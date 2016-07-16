(function () {
  'use strict';

  angular
    .module('katas')
    .controller('KatasListController', KatasListController);

  KatasListController.$inject = ['KatasService'];

  function KatasListController(KatasService) {
    var vm = this;

    vm.katas = KatasService.query();
  }
})();
