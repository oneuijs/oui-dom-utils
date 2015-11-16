/* eslint no-unused-expressions: 0 */
import ReactDOM from 'react-dom';

const reUnit = /width|height|top|left|right|bottom|margin|padding/i;

export default {
  ownerDocument(componentOrElement) {
    let elem = ReactDOM.findDOMNode(componentOrElement);
    return (elem && elem.ownerDocument) || document;
  },

  addClass(el, className) {
    if (this.hasClass(el, className)) { return; }

    if (el.classList) {
      el.classList.add(className);
    } else {
      el.className += ' ' + className;
    }
  },

  removeClass(el, className) {
    if (el.classList) {
      el.classList.remove(className);
    } else {
      el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
  },

  hasClass(el, className) {
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

  remove(el) {
    el.parentNode.removeChild(el);
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
  },

  outerHeight(el) {
    return el.offsetHeight;
  },

  outerHeightWithMargin(el) {
    let height = el.offsetHeight;
    let style = el.currentStyle || getComputedStyle(el);

    height += (parseInt(style.marginTop) || 0) + (parseInt(style.marginBottom) || 0);
    return height;
  },

  outerWidth(el) {
    return el.offsetWidth;
  },

  outerWidthWithMargin(el) {
    let width = el.offsetWidth;
    let style = el.currentStyle || getComputedStyle(el);

    width += (parseInt(style.marginLeft) || 0) + (parseInt(style.marginRight) || 0);
    return width;
  },

  getComputedStyles(elem) {
    return this.ownerDocument(elem).defaultView.getComputedStyle(elem, null);
  },

  getOffset(DOMNode) {
    let docElem = this.ownerDocument(DOMNode).documentElement;
    let box = { top: 0, left: 0 };

    // If we don't have gBCR, just use 0,0 rather than error
    // BlackBerry 5, iOS 3 (original iPhone)
    if ( typeof DOMNode.getBoundingClientRect !== 'undefined' ) {
      box = DOMNode.getBoundingClientRect();
    }

    return {
      top: box.top + window.pageYOffset - docElem.clientTop,
      left: box.left + window.pageXOffset - docElem.clientLeft
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
    let style = node.style;

    for (let i in hash) {
      this.setStyle(node, i, hash[i], style);
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
  getComputedStyle(node, att) {
    let val = '',
        doc = node.ownerDocument,
        computed;

    if (node.style && doc.defaultView && doc.defaultView.getComputedStyle) {
        computed = doc.defaultView.getComputedStyle(node, null);
        if (computed) { // FF may be null in some cases (ticket #2530548)
          val = computed[att];
        }
    }

    return val;
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
    return document.querySelector(selector);
  },

  closest(element, className) {
    className = className.replace(/^[\b\.]/, '');
    let reg = new RegExp('\\b' + className + '\\b');

    let finder = (el, _className) => {
      if (el.className && el.className.match(reg)) {
        return el;
      } else if (el.parentNode === null) {
        return null;
      } else {
        return finder(el.parentNode, _className);
      }
    };

    return finder(element, className);
  }
};
