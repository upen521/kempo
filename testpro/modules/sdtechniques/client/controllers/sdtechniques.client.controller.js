(function () {
  'use strict';

  // Sdtechniques controller
  angular
    .module('sdtechniques')
    .controller('SdtechniquesController', SdtechniquesController);

  SdtechniquesController.$inject = ['$scope', '$state', 'Authentication', 'sdtechniqueResolve', 'GetBeltListService'];

  function SdtechniquesController ($scope, $state, Authentication, sdtechnique, GetBeltListService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.sdtechnique = sdtechnique;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.beltsList = GetBeltListService.query();

    // Remove existing Sdtechnique
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.sdtechnique.$remove($state.go('sdtechniques.list'));
      }
    }

    // Save Sdtechnique
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.sdtechniqueForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.sdtechnique._id) {
        vm.sdtechnique.$update(successCallback, errorCallback);
      } else {
        vm.sdtechnique.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('sdtechniques.view', {
          sdtechniqueId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
