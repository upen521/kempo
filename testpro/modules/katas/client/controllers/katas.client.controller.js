(function () {
  'use strict';

  // Katas controller
  angular
    .module('katas')
    .controller('KatasController', KatasController);

  KatasController.$inject = ['$scope', '$state', 'Authentication', 'kataResolve', 'GetBeltListService'];

  function KatasController ($scope, $state, Authentication, kata, GetBeltListService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.kata = kata;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.beltsList = GetBeltListService.query();

    // Remove existing Kata
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.kata.$remove($state.go('katas.list'));
      }
    }

    // Save Kata
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.kataForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.kata._id) {
        vm.kata.$update(successCallback, errorCallback);
      } else {
        vm.kata.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('katas.view', {
          kataId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
