'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/* eslint no-unused-expressions: 0 */
var reUnit = /width|height|top|left|right|bottom|margin|padding/i;

exports.default = {
  // el can be an Element, NodeList or selector

  addClass: function addClass(el, className) {
    var _this = this;

    if (typeof el === 'string') el = document.querySelectorAll(el);
    var els = el instanceof NodeList ? [].slice.call(el) : [el];

    els.forEach(function (e) {
      if (_this.hasClass(e, className)) {
        return;
      }

      if (e.classList) {
        e.classList.add(className);
      } else {
        e.className += ' ' + className;
      }
    });
  },

  // el can be an Element, NodeList or selector
  removeClass: function removeClass(el, className) {
    if (typeof el === 'string') el = document.querySelectorAll(el);
    var els = el instanceof NodeList ? [].slice.call(el) : [el];

    els.forEach(function (e) {
      if (e.classList) {
        e.classList.remove(className);
      } else {
        e.className = e.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
      }
    });
  },

  // el can be an Element or selector
  hasClass: function hasClass(el, className) {
    if (typeof el === 'string') el = document.querySelector(el);
    if (el.classList) {
      return el.classList.contains(className);
    } else {
      return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
    }
  },
  insertAfter: function insertAfter(newEl, targetEl) {
    var parent = targetEl.parentNode;

    if (parent.lastChild === targetEl) {
      parent.appendChild(newEl, targetEl);
    } else {
      parent.insertBefore(newEl, targetEl.nextSibling);
    }
  },

  /**
   * el can be an Element, NodeList or query string
   */
  remove: function remove(el) {
    if (typeof el === 'string') {
      [].forEach.call(document.querySelectorAll(el), function (node) {
        node.parentNode.removeChild(node);
      });
    } else if (el.parentNode) {
      // it's an Element
      el.parentNode.removeChild(el);
    } else if (el instanceof NodeList) {
      // it's an array of elements
      [].forEach.call(el, function (node) {
        node.parentNode.removeChild(node);
      });
    } else {
      console.error('you can only pass Element, array of Elements or query string as argument');
    }
  },
  forceReflow: function forceReflow(el) {
    el.offsetHeight;
  },
  getDocumentScrollTop: function getDocumentScrollTop() {
    // IE8 used `document.documentElement`
    return document.documentElement && document.documentElement.scrollTop || document.body.scrollTop;
  },

  // Set the current vertical position of the scroll bar for document
  // Note: do not support fixed position of body
  setDocumentScrollTop: function setDocumentScrollTop(value) {
    window.scrollTo(0, value);
    return value;
  },
  outerHeight: function outerHeight(el) {
    return el.offsetHeight;
  },
  outerHeightWithMargin: function outerHeightWithMargin(el) {
    var height = el.offsetHeight;
    var style = getComputedStyle(el);

    height += (parseFloat(style.marginTop) || 0) + (parseFloat(style.marginBottom) || 0);
    return height;
  },
  outerWidth: function outerWidth(el) {
    return el.offsetWidth;
  },
  outerWidthWithMargin: function outerWidthWithMargin(el) {
    var width = el.offsetWidth;
    var style = getComputedStyle(el);

    width += (parseFloat(style.marginLeft) || 0) + (parseFloat(style.marginRight) || 0);
    return width;
  },
  getComputedStyles: function getComputedStyles(el) {
    return el.ownerDocument.defaultView.getComputedStyle(el, null);
  },
  getOffset: function getOffset(el) {
    var html = el.ownerDocument.documentElement;
    var box = { top: 0, left: 0 };

    // If we don't have gBCR, just use 0,0 rather than error
    // BlackBerry 5, iOS 3 (original iPhone)
    if (typeof el.getBoundingClientRect !== 'undefined') {
      box = el.getBoundingClientRect();
    }

    return {
      top: box.top + window.pageYOffset - html.clientTop,
      left: box.left + window.pageXOffset - html.clientLeft
    };
  },
  getPosition: function getPosition(el) {
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
  setStyle: function setStyle(node, att, val, style) {
    style = style || node.style;

    if (style) {
      if (val === null || val === '') {
        // normalize unsetting
        val = '';
      } else if (!isNaN(Number(val)) && reUnit.test(att)) {
        // number values may need a unit
        val += 'px';
      }

      if (att === '') {
        att = 'cssText';
        val = '';
      }

      style[att] = val;
    }
  },
  setStyles: function setStyles(node, hash) {
    var _this2 = this;

    var HAS_CSSTEXT_FEATURE = typeof node.style.cssText != 'undefined';
    function trim(str) {
      return str.replace(/^\s+|\s+$/g, '');
    }
    var originStyleText = undefined;
    var originStyleObj = {};
    if (!!HAS_CSSTEXT_FEATURE) {
      originStyleText = node.style.cssText;
    } else {
      originStyleText = node.getAttribute('style', styleText);
    }
    originStyleText.split(';').forEach(function (item) {
      if (item.indexOf(':') != -1) {
        var obj = item.split(':');
        originStyleObj[trim(obj[0])] = trim(obj[1]);
      }
    });

    var styleObj = {};
    Object.keys(hash).forEach(function (item) {
      _this2.setStyle(node, item, hash[item], styleObj);
    });
    var mergedStyleObj = Object.assign({}, originStyleObj, styleObj);
    var styleText = Object.keys(mergedStyleObj).map(function (item) {
      return item + ': ' + mergedStyleObj[item] + ';';
    }).join(' ');

    if (!!HAS_CSSTEXT_FEATURE) {
      node.style.cssText = styleText;
    } else {
      node.setAttribute('style', styleText);
    }
  },
  getStyle: function getStyle(node, att, style) {
    style = style || node.style;

    var val = '';

    if (style) {
      val = style[att];

      if (val === '') {
        val = this.getComputedStyle(node, att);
      }
    }

    return val;
  },

  // NOTE: Known bug, will return 'auto' if style value is 'auto'
  getComputedStyle: function getComputedStyle(el, att) {
    var win = el.ownerDocument.defaultView;
    // null means not return presudo styles
    var computed = win.getComputedStyle(el, null);

    return attr ? computed.attr : computed;
  },
  getPageSize: function getPageSize() {
    var xScroll = undefined,
        yScroll = undefined;

    if (window.innerHeight && window.scrollMaxY) {
      xScroll = window.innerWidth + window.scrollMaxX;
      yScroll = window.innerHeight + window.scrollMaxY;
    } else {
      if (document.body.scrollHeight > document.body.offsetHeight) {
        // all but Explorer Mac
        xScroll = document.body.scrollWidth;
        yScroll = document.body.scrollHeight;
      } else {
        // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
        xScroll = document.body.offsetWidth;
        yScroll = document.body.offsetHeight;
      }
    }

    var windowWidth = undefined,
        windowHeight = undefined;

    if (self.innerHeight) {
      // all except Explorer
      if (document.documentElement.clientWidth) {
        windowWidth = document.documentElement.clientWidth;
      } else {
        windowWidth = self.innerWidth;
      }
      windowHeight = self.innerHeight;
    } else {
      if (document.documentElement && document.documentElement.clientHeight) {
        // Explorer 6 Strict Mode
        windowWidth = document.documentElement.clientWidth;
        windowHeight = document.documentElement.clientHeight;
      } else {
        if (document.body) {
          // other Explorers
          windowWidth = document.body.clientWidth;
          windowHeight = document.body.clientHeight;
        }
      }
    }

    var pageHeight = undefined,
        pageWidth = undefined;

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
  get: function get(selector) {
    return document.querySelector(selector) || {};
  },
  getAll: function getAll(selector) {
    return document.querySelectorAll(selector);
  },

  /**
   * selector 可选。字符串值，规定在何处停止对祖先元素进行匹配的选择器表达式。
   * filter   可选。字符串值，包含用于匹配元素的选择器表达式。
   */
  parentsUntil: function parentsUntil(el, selector, filter) {
    var result = [];
    var matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
    // match start from parent
    el = el.parentElement;
    while (el && !matchesSelector.call(el, selector)) {
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
  closest: function closest(el, selector) {
    var matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;

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
  scrollTo: function scrollTo() {
    var _this3 = this;

    var to = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
    var duration = arguments.length <= 1 || arguments[1] === undefined ? 16 : arguments[1];

    if (duration < 0) {
      return;
    }
    var diff = to - this.getDocumentScrollTop();
    var perTick = diff / duration * 10;
    requestAnimationFrame(function () {
      if (Math.abs(perTick) > Math.abs(diff)) {
        _this3.setDocumentScrollTop(_this3.getDocumentScrollTop() + diff);
        return;
      }
      _this3.setDocumentScrollTop(_this3.getDocumentScrollTop() + perTick);
      if (diff > 0 && _this3.getDocumentScrollTop() >= to || diff < 0 && _this3.getDocumentScrollTop() <= to) {
        return;
      }
      _this3.scrollTo(to, duration - 16);
    });
  },

  // matches(el, '.my-class'); 这里不能使用伪类选择器
  is: function is(el, selector) {
    return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
  },
  width: function width(el) {
    var styles = this.getComputedStyles(el);
    var width = el.offsetWidth;
    var borderLeftWidth = parseFloat(styles.borderLeftWidth);
    var borderRightWidth = parseFloat(styles.borderRightWidth);
    var paddingLeft = parseFloat(styles.paddingLeft);
    var paddingRight = parseFloat(styles.paddingRight);
    return width - borderRightWidth - borderLeftWidth - paddingLeft - paddingRight;
  },
  height: function height(el) {
    var styles = this.getComputedStyles(el);
    var height = el.offsetHeight;
    var borderTopWidth = parseFloat(styles.borderTopWidth);
    var borderBottomWidth = parseFloat(styles.borderBottomWidth);
    var paddingTop = parseFloat(styles.paddingTop);
    var paddingBottom = parseFloat(styles.paddingBottom);
    return height - borderBottomWidth - borderTopWidth - paddingTop - paddingBottom;
  }
};