'use strict';

describe('Katas E2E Tests:', function () {
  describe('Test Katas page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/katas');
      expect(element.all(by.repeater('kata in katas')).count()).toEqual(0);
    });
  });
});
