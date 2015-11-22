import chai, { expect } from 'chai';
import { DOMUtils } from '../src/index.js';

describe('DOMUtils', () => {
  describe('#addClass', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <ul id="addClass-test" class='list top'>
          <li class="item-i item">I</li>
          <li class="item-ii item">II</li>
          <li>III</li>
        </ul>
      `;
    });

    afterEach(() => {
      var el = document.querySelector('#addClass-test');
      el.parentNode.removeChild(el);
    });

    it('can add className to element', () => {
      let el = document.querySelector(".item-i");
      DOMUtils.addClass(el, 'newcls');
      expect(el.className).to.equal('item-i item newcls');
    });

    it('can add className to elements matched the selector', () => {
      DOMUtils.addClass('.item', 'newcls');
      expect(document.querySelectorAll('.item')[0].className).to.equal('item-i item newcls');
      expect(document.querySelectorAll('.item')[1].className).to.equal('item-ii item newcls');
    });

    it('can add className to NodeList', () => {
      const els = document.querySelectorAll('.item');
      DOMUtils.addClass(els, 'newcls');
      expect(document.querySelectorAll('.item')[0].className).to.equal('item-i item newcls');
      expect(document.querySelectorAll('.item')[1].className).to.equal('item-ii item newcls');
    });
  });

  describe('#removeClass', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <ul id="removeClass-test" class='list top'>
          <li class="item-i item">I</li>
          <li class="item-ii item">II</li>
          <li>III</li>
        </ul>
      `;
    });

    afterEach(() => {
      var el = document.querySelector('#removeClass-test');
      el.parentNode.removeChild(el);
    });

    it('can remove className of element', () => {
      let el = document.querySelector(".item-i");
      DOMUtils.removeClass(el, 'item');
      expect(el.className).to.equal('item-i');
    });

    it('can remove className of elements matched the selector', () => {
      DOMUtils.removeClass('.item', 'item');
      expect(document.querySelector('.item-i').className).to.equal('item-i');
      expect(document.querySelector('.item-ii').className).to.equal('item-ii');
    });
  });

  describe('#hasClass', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <ul id="hasClass-test" class='list top'>
          <li class="item-i item">I</li>
          <li class="item-ii item">II</li>
          <li>III</li>
        </ul>
      `;
    });

    afterEach(() => {
      var el = document.querySelector('#hasClass-test');
      el.parentNode.removeChild(el);
    });

    it('return true if has class', () => {
      let el = document.querySelector(".item-i");
      expect(DOMUtils.hasClass(el, 'item')).to.be.true;
      expect(DOMUtils.hasClass(el, 'item-not')).to.be.false;
    });

    it('el can be selector', () => {
      expect(DOMUtils.hasClass('.item', 'item-i')).to.be.true;
      expect(DOMUtils.hasClass('.item', 'item-ii')).to.be.false;
    });
  });

  describe('#closest', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <ul id="closest-test" class='list'>
          <li class="item-i">I</li>
          <li id="ii" class="item-ii">II
            <ul class="level-2 list">
              <li class="item-a">A</li>
              <li class="item-b">B
                <ul class="level-3">
                  <li class="item-1">1</li>
                  <li class="item-2">2</li>
                  <li class="item-3">3</li>
                </ul>
              </li>
              <li class="item-c">C</li>
            </ul>
          </li>
          <li class="item-iii">III</li>
        </ul>
      `;
    });

    afterEach(() => {
      var el = document.querySelector('#closest-test');
      el.parentNode.removeChild(el);
    });

    it('closest can query by tag name', () => {
      let el = DOMUtils.closest(document.querySelector("li.item-a"), "ul");
      expect(el.className).to.equal('level-2 list');
    });

    it('closest can query by class name', () => {
      let el = DOMUtils.closest(document.querySelector("li.item-a"), ".list");
      expect(el.className).to.equal('level-2 list');
    });

    it('closest can query by id', () => {
      let el = DOMUtils.closest(document.querySelector("li.item-a"), "#ii");
      expect(el.className).to.equal('item-ii');
    });

    it('closest can query by complex query', () => {
      let el = DOMUtils.closest(document.querySelector("li.item-a"), "ul.list");
      expect(el.className).to.equal('level-2 list');
    });

    it('closest should return itself if matches', () => {
      let el = DOMUtils.closest(document.querySelector("li.item-a"), "li.item-a");
      expect(el).to.equal(document.querySelector("li.item-a"));
    });
  });

  describe('#parentsUntil', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <ul id="parents-until-test" class='level-1 yes'>
          <li class="item-i">I</li>
          <li class="item-ii">II
            <ul class="level-2 yes" microscope-data='test'>
              <li class="item-a">A</li>
              <li class="item-b">B
                <ul class="level-3">
                  <li class="item-1">1</li>
                  <li class="item-2">2</li>
                  <li class="item-3">3</li>
                </ul>
              </li>
              <li class="item-c">C</li>
            </ul>
          </li>
          <li class="item-iii">III</li>
        </ul>
      `;
    });

    afterEach(() => {
      var el = document.querySelector('#parents-until-test');
      el.parentNode.removeChild(el);
    });

    it('return an array of parents until selector', () => {
      let arr = DOMUtils.parentsUntil(document.querySelector("li.item-a"), ".level-1");
      expect(arr.length).to.equal(2);
    });

    it('if not match will return all up to html', () => {
      let arr = DOMUtils.parentsUntil(document.querySelector("li.item-a"), ".item-a");
      expect(arr.length).to.equal(5);
    });

    it('if can filter returns', () => {
      let arr;
      arr = DOMUtils.parentsUntil(document.querySelector("li.item-a"), "body", '.yes');
      expect(arr.length).to.equal(2);

      arr = DOMUtils.parentsUntil(document.querySelector("li.item-a"), "body", '.level-2.yes');
      expect(arr[0]).to.equal(document.querySelector('.level-2'));

      arr = DOMUtils.parentsUntil(document.querySelector("li.item-a"), "body", '[microscope-data]');
      expect(arr[0]).to.equal(document.querySelector('.level-2'));
    });
  });

  describe('#setDocumentScrollTop', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div id="setDocumentScrollTop-until-test" style="height: 3000px"></div>
      `;
    });

    afterEach(() => {
      var el = document.querySelector('#setDocumentScrollTop-until-test');
      el.parentNode.removeChild(el);
    });

    it('return document scrollTop', () => {
      var scrollTop = DOMUtils.setDocumentScrollTop(100);
      expect(scrollTop).to.equal(100);
    });
  });

   describe('#getDocumentScrollTop', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div id="getDocumentScrollTop-until-test" style="height: 3000px"></div>
      `;
    });

    afterEach(() => {
      var el = document.querySelector('#getDocumentScrollTop-until-test');
      el.parentNode.removeChild(el);
    });

    it('return document scrollTop', () => {
      DOMUtils.setDocumentScrollTop(1000);
      setTimeout(() => {
        var scrollTop = DOMUtils.getDocumentScrollTop();
        expect(scrollTop).to.equal(1000);
      });
    });
  });

  describe('#scrollTo', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div id="scrollTo-until-test" style="height: 3000px"></div>
      `;
    });

    afterEach(() => {
      var el = document.querySelector('#scrollTo-until-test');
      el.parentNode.removeChild(el);
    });

    it('return document scrollTop', () => {
      DOMUtils.scrollTo(100, 100);
      setTimeout(() => {
        expect(DOMUtils.getDocumentScrollTop()).to.equal(100);
      }, 200);
    });

    it('return document scrollTop', () => {
      DOMUtils.scrollTo(100);
      setTimeout(() => {
        expect(DOMUtils.getDocumentScrollTop()).to.equal(100);
      }, 200);
    });
  });
});