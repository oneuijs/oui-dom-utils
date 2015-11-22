/* eslint no-unused-expressions: 0 */
const reUnit = /width|height|top|left|right|bottom|margin|padding/i;

export default {
  // el can be an Element, NodeList or selector
  addClass(el, className) {
    if (typeof el === 'string') el = document.querySelectorAll(el);
    let els = (el instanceof NodeList) ? [].slice.call(el) : [el];

    els.forEach(e => {
      if (this.hasClass(e, className)) { return; }

      if (e.classList) {
        e.classList.add(className);
      } else {
        e.className += ' ' + className;
      }
    });
  },

  // el can be an Element, NodeList or selector
  removeClass(el, className) {
    if (typeof el === 'string') el = document.querySelectorAll(el);
    let els = (el instanceof NodeList) ? [].slice.call(el) : [el];

    els.forEach(e => {
      if (e.classList) {
        e.classList.remove(className);
      } else {
        e.className = e.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
      }
    });
  },

  // el can be an Element or selector
  hasClass(el, className) {
    if (typeof el === 'string') el = document.querySelector(el);
    if (el.classList) {
      return el.classList.contains(className);
    } else {
      return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
    }
  },

  insertAfter(newEl, targetEl) {
    let parent = targetEl.parentNode;

    if (parent.lastChild === targetEl) {
      parent.appendChild(newEl, targetEl);
    } else {
      parent.insertBefore(newEl, targetEl.nextSibling);
    }
  },

  /**
   * el can be an Element, NodeList or query string
   */
  remove(el) {
    if (typeof el === 'string') {
      [].forEach.call(document.querySelectorAll(el), node => {
        node.parentNode.removeChild(node);
      });
    } else if (el.parentNode) {
      // it's an Element
      el.parentNode.removeChild(el);
    } else if (el instanceof NodeList) {
      // it's an array of elements
      [].forEach.call(el, node => {
        node.parentNode.removeChild(node);
      });
    } else {
      console.error('you can only pass Element, array of Elements or query string as argument');
    }
  },

  forceReflow(el) {
    el.offsetHeight;
  },

  getDocumentScrollTop() {
    // IE8 used `document.documentElement`
    return (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
  },

  // Set the current vertical position of the scroll bar for document
  // Note: do not support fixed position of body
  setDocumentScrollTop(value) {
    window.scrollTo(0, value);
    return value;
  },

  outerHeight(el) {
    return el.offsetHeight;
  },

  outerHeightWithMargin(el) {
    let height = el.offsetHeight;
    let style = getComputedStyle(el);

    height += (parseFloat(style.marginTop) || 0) + (parseFloat(style.marginBottom) || 0);
    return height;
  },

  outerWidth(el) {
    return el.offsetWidth;
  },

  outerWidthWithMargin(el) {
    let width = el.offsetWidth;
    let style = getComputedStyle(el);

    width += (parseFloat(style.marginLeft) || 0) + (parseFloat(style.marginRight) || 0);
    return width;
  },

  getComputedStyles(el) {
    return el.ownerDocument.defaultView.getComputedStyle(el, null);
  },

  getOffset(el) {
    let html = el.ownerDocument.documentElement;
    let box = { top: 0, left: 0 };

    // If we don't have gBCR, just use 0,0 rather than error
    // BlackBerry 5, iOS 3 (original iPhone)
    if ( typeof el.getBoundingClientRect !== 'undefined' ) {
      box = el.getBoundingClientRect();
    }

    return {
      top: box.top + window.pageYOffset - html.clientTop,
      left: box.left + window.pageXOffset - html.clientLeft
    };
  },

  getPosition(el) {
    if (!el) {
      return {
        left: 0,
        top: 0
      };
    }

    return {
      left: el.offsetLeft,
      top: el.offsetTop
    };
  },

  setStyle(node, att, val, style) {
    style = style || node.style;

    if (style) {
      if (val === null || val === '') { // normalize unsetting
        val = '';
      } else if (!isNaN(Number(val)) && reUnit.test(att)) { // number values may need a unit
        val += 'px';
      }

      if (att === '') {
        att = 'cssText';
        val = '';
      }

      style[att] = val;
    }
  },

  setStyles(node, hash) {
    const HAS_CSSTEXT_FEATURE = typeof(node.style.cssText) != 'undefined';
    function trim(str) {
      return str.replace(/^\s+|\s+$/g, '');
    }
    let originStyleText;
    let originStyleObj = {};
    if(!!HAS_CSSTEXT_FEATURE) {
      originStyleText = node.style.cssText;
    } else {
      originStyleText = node.getAttribute('style', styleText);
    }
    originStyleText.split(';').forEach(item => {
      if(item.indexOf(':') != -1) {
        let obj = item.split(':');
        originStyleObj[trim(obj[0])] = trim(obj[1]);
      }
    });

    let styleObj = {};
    Object.keys(hash).forEach(item => {
      this.setStyle(node, item, hash[item], styleObj);
    });
    let mergedStyleObj = Object.assign({}, originStyleObj, styleObj);
    let styleText = Object.keys(mergedStyleObj)
        .map(item => item + ': ' + mergedStyleObj[item] + ';')
        .join(' ');
        
    if(!!HAS_CSSTEXT_FEATURE) {
      node.style.cssText = styleText;
    } else {
      node.setAttribute('style', styleText);
    }
  },

  getStyle(node, att, style) {
    style = style || node.style;

    let val = '';

    if (style) {
      val = style[att];

      if (val === '') {
        val = this.getComputedStyle(node, att);
      }
    }

    return val;
  },

  // NOTE: Known bug, will return 'auto' if style value is 'auto'
  getComputedStyle(el, att) {
    const win = el.ownerDocument.defaultView;
    // null means not return presudo styles
    const computed = win.getComputedStyle(el, null);

    return attr ? computed.attr : computed;
  },

  getPageSize() {
    let xScroll, yScroll;

    if (window.innerHeight && window.scrollMaxY) {
      xScroll = window.innerWidth + window.scrollMaxX;
      yScroll = window.innerHeight + window.scrollMaxY;
    } else {
      if (document.body.scrollHeight > document.body.offsetHeight) { // all but Explorer Mac
        xScroll = document.body.scrollWidth;
        yScroll = document.body.scrollHeight;
      } else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
        xScroll = document.body.offsetWidth;
        yScroll = document.body.offsetHeight;
      }
    }

    let windowWidth, windowHeight;

    if (self.innerHeight) { // all except Explorer
      if (document.documentElement.clientWidth) {
        windowWidth = document.documentElement.clientWidth;
      } else {
        windowWidth = self.innerWidth;
      }
      windowHeight = self.innerHeight;
    } else {
      if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
        windowWidth = document.documentElement.clientWidth;
        windowHeight = document.documentElement.clientHeight;
      } else {
        if (document.body) { // other Explorers
          windowWidth = document.body.clientWidth;
          windowHeight = document.body.clientHeight;
        }
      }
    }

    let pageHeight, pageWidth;

    // for small pages with total height less then height of the viewport
    if (yScroll < windowHeight) {
      pageHeight = windowHeight;
    } else {
      pageHeight = yScroll;
    }
    // for small pages with total width less then width of the viewport
    if (xScroll < windowWidth) {
      pageWidth = xScroll;
    } else {
      pageWidth = windowWidth;
    }

    return {
      pageWidth: pageWidth,
      pageHeight: pageHeight,
      windowWidth: windowWidth,
      windowHeight: windowHeight
    };
  },

  get(selector) {
    return document.querySelector(selector) || {};
  },

  getAll(selector) {
    return document.querySelectorAll(selector);
  },

  /**
   * selector 可选。字符串值，规定在何处停止对祖先元素进行匹配的选择器表达式。
   * filter   可选。字符串值，包含用于匹配元素的选择器表达式。
   */
  parentsUntil(el, selector, filter) {
    let result = [];
    let matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
    // match start from parent
    el = el.parentElement;
    while(el && !matchesSelector.call(el, selector)) {
      if (filter == null) {
        result.push(el);
      } else {
        if (matchesSelector.call(el, filter)) {
          result.push(el);
        }
      }
      el = el.parentElement;
    }
    return result;
  },

  // 获得匹配选择器的第一个祖先元素，从当前元素开始沿 DOM 树向上
  closest(el, selector) {
    let matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;

    while (el) {
      if (matchesSelector.call(el, selector)) {
        return el;
      } else {
        el = el.parentElement;
      }
    }
    return null;
  },

  /**
   * @param {number} to assign the scrollTop value
   * @param {number} duration assign the animate duration
   */
  scrollTo(to = 0, duration = 16) {
    if (duration < 0) {
      return;
    }
    let diff = to - this.getDocumentScrollTop();
    let perTick = diff / duration * 10;
    requestAnimationFrame(() => {
      if (Math.abs(perTick) > Math.abs(diff)) {
        this.setDocumentScrollTop(this.getDocumentScrollTop() + diff);
        return;
      }
      this.setDocumentScrollTop(this.getDocumentScrollTop() + perTick);
      if (diff > 0 && this.getDocumentScrollTop() >= to || diff < 0 && this.getDocumentScrollTop() <= to) {
        return;
      }
      this.scrollTo(to, duration - 16);
    });
  },

  // matches(el, '.my-class'); 这里不能使用伪类选择器
  is(el, selector) {
    return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
  },

  width(el) {
    const styles = this.getComputedStyles(el);
    const width = el.offsetWidth;
    const borderLeftWidth = parseFloat(styles.borderLeftWidth);
    const borderRightWidth = parseFloat(styles.borderRightWidth);
    const paddingLeft = parseFloat(styles.paddingLeft);
    const paddingRight = parseFloat(styles.paddingRight);
    return width - borderRightWidth - borderLeftWidth - paddingLeft - paddingRight;
  },

  height(el) {
    const styles = this.getComputedStyles(el);
    const height = el.offsetHeight;
    const borderTopWidth = parseFloat(styles.borderTopWidth);
    const borderBottomWidth = parseFloat(styles.borderBottomWidth);
    const paddingTop = parseFloat(styles.paddingTop);
    const paddingBottom = parseFloat(styles.paddingBottom);
    return height - borderBottomWidth - borderTopWidth - paddingTop - paddingBottom;
  }
};