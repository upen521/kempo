(function () {
  'use strict';

  angular
    .module('belts')
    .controller('BeltsListController', BeltsListController);

  BeltsListController.$inject = ['BeltsService'];

  function BeltsListController(BeltsService) {
    var vm = this;

    vm.belts = BeltsService.query();
  }
})();
