//Sdtechniques service used to communicate Sdtechniques REST endpoints
(function () {
  'use strict';

  var app = angular.module('sdtechniques');
  app.factory('SdtechniquesService', SdtechniquesService);

  SdtechniquesService.$inject = ['$resource'];

  function SdtechniquesService($resource) {
    return $resource('api/sdtechniques/:sdtechniqueId', {
      sdtechniqueId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

  app.factory('GetBeltListService', GetBeltListService);

  SdtechniquesService.$inject = ['$resource'];

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
