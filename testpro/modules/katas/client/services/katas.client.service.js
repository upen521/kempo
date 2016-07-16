//Katas service used to communicate Katas REST endpoints
(function () {
  'use strict';

  var app = angular.module('katas');
  app.factory('KatasService', KatasService);

  KatasService.$inject = ['$resource'];

  function KatasService($resource) {
    return $resource('api/katas/:kataId', {
      kataId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

  app.factory('GetBeltListService', GetBeltListService);

  KatasService.$inject = ['$resource'];

  function GetBeltListService($resource) {
    return $resource('api/belts/getbeltslist', {
      sdtechniqueId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
