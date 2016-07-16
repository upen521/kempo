'use strict';

describe('Sdtechniques E2E Tests:', function () {
  describe('Test Sdtechniques page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/sdtechniques');
      expect(element.all(by.repeater('sdtechnique in sdtechniques')).count()).toEqual(0);
    });
  });
});
