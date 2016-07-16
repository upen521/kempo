//Belts service used to communicate Belts REST endpoints
(function () {
  'use strict';

  angular
    .module('belts')
    .factory('BeltsService', BeltsService);

  BeltsService.$inject = ['$resource'];

  function BeltsService($resource) {
    return $resource('api/belts/:beltId', {
      beltId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
