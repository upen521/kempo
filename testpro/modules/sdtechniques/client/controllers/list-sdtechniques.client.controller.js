(function () {
  'use strict';

  angular
    .module('sdtechniques')
    .controller('SdtechniquesListController', SdtechniquesListController);

  SdtechniquesListController.$inject = ['SdtechniquesService'];

  function SdtechniquesListController(SdtechniquesService) {
    var vm = this;

    vm.sdtechniques = SdtechniquesService.query();
  }
})();
