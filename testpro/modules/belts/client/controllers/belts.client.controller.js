(function () {
  'use strict';

  // Belts controller
  angular
    .module('belts')
    .controller('BeltsController', BeltsController);

  BeltsController.$inject = ['$scope', '$state', 'Authentication', 'beltResolve'];

  function BeltsController ($scope, $state, Authentication, belt) {
    var vm = this;

    vm.authentication = Authentication;
    vm.belt = belt;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Belt
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.belt.$remove($state.go('belts.list'));
      }
    }

    // Save Belt
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.beltForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.belt._id) {
        vm.belt.$update(successCallback, errorCallback);
      } else {
        vm.belt.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('belts.view', {
          beltId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
