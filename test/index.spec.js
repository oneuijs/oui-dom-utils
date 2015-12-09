// FIXME: PhantomJS 1.9 doesn't support rAF, but IE10+ supports
window.requestAnimationFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         function(callback) {
           window.setTimeout(callback, 1000 / 60);
         };
})();


import { expect } from 'chai';
import D from '../src/index.js';

describe('oui-dom-utils', () => {
  describe('#addClass', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <ul id='addClass-test' class='list top'>
          <li class='item-i item'>I</li>
          <li class='item-ii item'>II</li>
          <li>III</li>
        </ul>
      `;
    });

    afterEach(() => {
      const el = document.querySelector('#addClass-test');
      el.parentNode.removeChild(el);
    });

    it('can add className to element', () => {
      const el = document.querySelector('.item-i');
      D.addClass(el, 'newcls');
      expect(el.className).to.equal('item-i item newcls');
    });

    it('can add className to elements matched the selector', () => {
      D.addClass('.item', 'newcls');
      expect(document.querySelectorAll('.item')[0].className).to.equal('item-i item newcls');
      expect(document.querySelectorAll('.item')[1].className).to.equal('item-ii item newcls');
    });

    it('can add className to NodeList', () => {
      const els = document.querySelectorAll('.item');
      D.addClass(els, 'newcls');
      expect(document.querySelectorAll('.item')[0].className).to.equal('item-i item newcls');
      expect(document.querySelectorAll('.item')[1].className).to.equal('item-ii item newcls');
    });
  });

  describe('#removeClass', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <ul id='removeClass-test' class='list top'>
          <li class='item-i item'>I</li>
          <li class='item-ii item'>II</li>
          <li>III</li>
        </ul>
      `;
    });

    afterEach(() => {
      const el = document.querySelector('#removeClass-test');
      el.parentNode.removeChild(el);
    });

    it('can remove className of element', () => {
      const el = document.querySelector('.item-i');
      D.removeClass(el, 'item');
      expect(el.className).to.equal('item-i');
    });

    it('can remove className of elements matched the selector', () => {
      D.removeClass('.item', 'item');
      expect(document.querySelector('.item-i').className).to.equal('item-i');
      expect(document.querySelector('.item-ii').className).to.equal('item-ii');
    });
  });

  describe('#hasClass', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <ul id='hasClass-test' class='list top'>
          <li class='item-i item'>I</li>
          <li class='item-ii item'>II</li>
          <li>III</li>
        </ul>
      `;
    });

    afterEach(() => {
      const el = document.querySelector('#hasClass-test');
      el.parentNode.removeChild(el);
    });

    it('return true if has class', () => {
      const el = document.querySelector('.item-i');
      expect(D.hasClass(el, 'item')).to.be.true;
      expect(D.hasClass(el, 'item-not')).to.be.false;
    });

    it('el can be selector', () => {
      expect(D.hasClass('.item', 'item-i')).to.be.true;
      expect(D.hasClass('.item', 'item-ii')).to.be.false;
    });
  });

  describe('#toggleClass', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <ul id='toggleClass-test' class='list top'>
          <li class='item-i item'>I</li>
        </ul>
      `;
    });

    afterEach(() => {
      const el = document.querySelector('#toggleClass-test');
      el.parentNode.removeChild(el);
    });

    it('return true if has class', () => {
      const el = document.querySelector('.item-i');
      expect(D.toggleClass(el, 'item')).to.be.true;
      expect(D.toggleClass(el, 'item')).to.be.false;
    });
  });

  describe('#closest', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <ul id='closest-test' class='list'>
          <li class='item-i'>I</li>
          <li id='ii' class='item-ii'>II
            <ul class='level-2 list'>
              <li class='item-a'>A</li>
              <li class='item-b'>B
                <ul class='level-3'>
                  <li class='item-1'>1</li>
                  <li class='item-2'>2</li>
                  <li class='item-3'>3</li>
                </ul>
              </li>
              <li class='item-c'>C</li>
            </ul>
          </li>
          <li class='item-iii'>III</li>
        </ul>
      `;
    });

    afterEach(() => {
      const el = document.querySelector('#closest-test');
      el.parentNode.removeChild(el);
    });

    it('closest can query by tag name', () => {
      const el = D.closest(document.querySelector('li.item-a'), 'ul');
      expect(el.className).to.equal('level-2 list');
    });

    it('closest can query by class name', () => {
      const el = D.closest(document.querySelector('li.item-a'), '.list');
      expect(el.className).to.equal('level-2 list');
    });

    it('closest can query by id', () => {
      const el = D.closest(document.querySelector('li.item-a'), '#ii');
      expect(el.className).to.equal('item-ii');
    });

    it('closest can query by complex query', () => {
      const el = D.closest(document.querySelector('li.item-a'), 'ul.list');
      expect(el.className).to.equal('level-2 list');
    });

    it('closest should return itself if matches', () => {
      const el = D.closest(document.querySelector('li.item-a'), 'li.item-a');
      expect(el).to.equal(document.querySelector('li.item-a'));
    });
  });

  describe('#parentsUntil', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <ul id='parents-until-test' class='level-1 yes'>
          <li class='item-i'>I</li>
          <li class='item-ii'>II
            <ul class='level-2 yes' microscope-data='test'>
              <li class='item-a'>A</li>
              <li class='item-b'>B
                <ul class='level-3'>
                  <li class='item-1'>1</li>
                  <li class='item-2'>2</li>
                  <li class='item-3'>3</li>
                </ul>
              </li>
              <li class='item-c'>C</li>
            </ul>
          </li>
          <li class='item-iii'>III</li>
        </ul>
      `;
    });

    afterEach(() => {
      const el = document.querySelector('#parents-until-test');
      el.parentNode.removeChild(el);
    });

    it('return an array of parents until selector', () => {
      const arr = D.parentsUntil(document.querySelector('li.item-a'), '.level-1');
      expect(arr.length).to.equal(2);
    });

    it('if not match will return all up to html', () => {
      const arr = D.parentsUntil(document.querySelector('li.item-a'), '.item-a');
      expect(arr.length).to.equal(5);
    });

    it('if can filter returns', () => {
      let arr;
      arr = D.parentsUntil(document.querySelector('li.item-a'), 'body', '.yes');
      expect(arr.length).to.equal(2);

      arr = D.parentsUntil(document.querySelector('li.item-a'), 'body', '.level-2.yes');
      expect(arr[0]).to.equal(document.querySelector('.level-2'));

      arr = D.parentsUntil(document.querySelector('li.item-a'), 'body', '[microscope-data]');
      expect(arr[0]).to.equal(document.querySelector('.level-2'));
    });
  });

  describe('#setDocumentScrollTop', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div id='setDocumentScrollTop-until-test' style='height: 3000px'></div>
      `;
    });

    afterEach(() => {
      const el = document.querySelector('#setDocumentScrollTop-until-test');
      el.parentNode.removeChild(el);
    });

    it('return document scrollTop', () => {
      const scrollTop = D.setDocumentScrollTop(100);
      expect(scrollTop).to.equal(100);
    });
  });

  describe('#getDocumentScrollTop', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div id='getDocumentScrollTop-until-test' style='height: 30000px; width: 1000px;'></div>
      `;
    });

    afterEach(() => {
      const el = document.querySelector('#getDocumentScrollTop-until-test');
      el.parentNode.removeChild(el);
    });

    it.only('return document scrollTop', function(done) {
      document.body.style.height = '10000px';
      scrollTo(1, 1000);
      this.timeout(9999999);
      setTimeout(function() {
        const top = D.getDocumentScrollTop();
        console.log(top)
        expect(top).to.equal(1000);
        done();
      }, 2000);
    });
  });

  describe('#scrollTo', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div id='scrollTo-until-test' style='height: 3000px'></div>
      `;
    });

    afterEach(() => {
      const el = document.querySelector('#scrollTo-until-test');
      el.parentNode.removeChild(el);
    });

    it('return document scrollTop', function(done) {
      this.timeout(9999999);
      D.scrollTo(100, 100);
      setTimeout(() => {
        expect(D.getDocumentScrollTop()).to.equal(100);
        done();
      }, 2000);
    });

    it('return document scrollTop', () => {
      D.scrollTo(100);
      setTimeout(() => {
        expect(D.getDocumentScrollTop()).to.equal(100);
      }, 200);
    });
  });

  describe('#_showHide', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div id='showHide-until-test'>
          <div class='elements' style='width: 200px; height: 200px; display: inline-block;'></div>
          <div class='elements' style='width: 200px; height: 200px; display: inline-block;'></div>
          <div class='elements' style='width: 200px; height: 200px; display: inline-block;'></div>
          <div class='elements' style='width: 200px; height: 200px; display: inline-block;'></div>
        </div>
      `;
    });

    afterEach(() => {
      const el = document.querySelector('#showHide-until-test');
      el.parentNode.removeChild(el);
    });

    it('can hide elements', () => {
      D._showHide(document.querySelector('.elements'), false);
      expect(D.getStyle(document.querySelector('.elements'), 'display') === 'none');
    });

    it('can read the original display', () => {
      D._showHide('.elements', false);
      D._showHide('.elements', true);
      expect(D.getStyle(document.querySelector('.elements'), 'display') === 'inline-block');
    });
  });

  describe('#hide', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div id='showHide-until-test'>
          <div class='elements' style='width: 200px; height: 200px; display: inline-block;'></div>
          <div class='elements' style='width: 200px; height: 200px; display: inline-block;'></div>
          <div class='elements' style='width: 200px; height: 200px; display: inline-block;'></div>
          <div class='elements' style='width: 200px; height: 200px; display: inline-block;'></div>
        </div>
      `;
    });

    afterEach(() => {
      const el = document.querySelector('#showHide-until-test');
      el.parentNode.removeChild(el);
    });

    it('can hide elements', () => {
      D.hide(document.querySelector('.elements'));
      expect(D.getStyle(document.querySelector('.elements'), 'display') === 'none');
    });

    it('can read the original display', () => {
      D.hide('.elements');
      expect(D.getStyle(document.querySelectorAll('.elements')[1], 'display') === 'none');
    });
  });

  describe('#show', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div id='showHide-until-test'>
          <div class='elements' style='width: 200px; height: 200px; display: inline-block;'></div>
          <div class='elements' style='width: 200px; height: 200px; display: inline-block;'></div>
          <div class='elements' style='width: 200px; height: 200px; display: inline-block;'></div>
          <div class='elements' style='width: 200px; height: 200px; display: inline-block;'></div>
        </div>
      `;
    });

    afterEach(() => {
      const el = document.querySelector('#showHide-until-test');
      el.parentNode.removeChild(el);
    });

    it('can read the original display', () => {
      D.hide(document.querySelector('.elements'));
      D.show(document.querySelector('.elements'));
      expect(D.getStyle(document.querySelector('.elements'), 'display') === 'inline-block');
    });

    it('can read the original display', () => {
      D.hide('.elements');
      D.show('.elements');
      expect(D.getStyle(document.querySelectorAll('.elements')[1], 'display') === 'inline-block');
    });
  });

  describe('#toggle', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div id='showHide-until-test'>
          <div class='elements' style='width: 200px; height: 200px; display: inline-block;'></div>
        </div>
      `;
    });

    afterEach(() => {
      const el = document.querySelector('#showHide-until-test');
      el.parentNode.removeChild(el);
    });

    it('can read the original display', () => {
      D.hide(document.querySelector('.elements'));
      D.toggle(document.querySelector('.elements'));
      expect(D.getStyle(document.querySelector('.elements'), 'display') === 'inline-block');
    });

    it('can read the original display', () => {
      D.hide(document.querySelector('.elements'));
      D.show(document.querySelector('.elements'));
      D.toggle(document.querySelector('.elements'));
      expect(D.getStyle(document.querySelector('.elements'), 'display') === 'none');
    });
  });
});
