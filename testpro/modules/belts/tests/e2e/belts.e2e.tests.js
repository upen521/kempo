'use strict';

describe('Belts E2E Tests:', function () {
  describe('Test Belts page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/belts');
      expect(element.all(by.repeater('belt in belts')).count()).toEqual(0);
    });
  });
});
