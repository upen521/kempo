(function () {
  'use strict';

  angular
    .module('sdtechniques')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('sdtechniques', {
        abstract: true,
        url: '/sdtechniques',
        template: '<ui-view/>'
      })
      .state('sdtechniques.list', {
        url: '',
        templateUrl: 'modules/sdtechniques/client/views/list-sdtechniques.client.view.html',
        controller: 'SdtechniquesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Sdtechniques List'
        }
      })
      .state('sdtechniques.create', {
        url: '/create',
        templateUrl: 'modules/sdtechniques/client/views/form-sdtechnique.client.view.html',
        controller: 'SdtechniquesController',
        controllerAs: 'vm',
        resolve: {
          sdtechniqueResolve: newSdtechnique
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Sdtechniques Create'
        }
      })
      .state('sdtechniques.edit', {
        url: '/:sdtechniqueId/edit',
        templateUrl: 'modules/sdtechniques/client/views/form-sdtechnique.client.view.html',
        controller: 'SdtechniquesController',
        controllerAs: 'vm',
        resolve: {
          sdtechniqueResolve: getSdtechnique
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Sdtechnique {{ sdtechniqueResolve.name }}'
        }
      })
      .state('sdtechniques.view', {
        url: '/:sdtechniqueId',
        templateUrl: 'modules/sdtechniques/client/views/view-sdtechnique.client.view.html',
        controller: 'SdtechniquesController',
        controllerAs: 'vm',
        resolve: {
          sdtechniqueResolve: getSdtechnique
        },
        data:{
          pageTitle: 'Sdtechnique {{ articleResolve.name }}'
        }
      });
  }

  getSdtechnique.$inject = ['$stateParams', 'SdtechniquesService'];

  function getSdtechnique($stateParams, SdtechniquesService) {
    return SdtechniquesService.get({
      sdtechniqueId: $stateParams.sdtechniqueId
    }).$promise;
  }

  newSdtechnique.$inject = ['SdtechniquesService'];

  function newSdtechnique(SdtechniquesService) {
    return new SdtechniquesService();
  }
})();
