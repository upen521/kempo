(function () {
  'use strict';

  angular
    .module('katas')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('katas', {
        abstract: true,
        url: '/katas',
        template: '<ui-view/>'
      })
      .state('katas.list', {
        url: '',
        templateUrl: 'modules/katas/client/views/list-katas.client.view.html',
        controller: 'KatasListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Katas List'
        }
      })
      .state('katas.create', {
        url: '/create',
        templateUrl: 'modules/katas/client/views/form-kata.client.view.html',
        controller: 'KatasController',
        controllerAs: 'vm',
        resolve: {
          kataResolve: newKata
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Katas Create'
        }
      })
      .state('katas.edit', {
        url: '/:kataId/edit',
        templateUrl: 'modules/katas/client/views/form-kata.client.view.html',
        controller: 'KatasController',
        controllerAs: 'vm',
        resolve: {
          kataResolve: getKata
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Kata {{ kataResolve.name }}'
        }
      })
      .state('katas.view', {
        url: '/:kataId',
        templateUrl: 'modules/katas/client/views/view-kata.client.view.html',
        controller: 'KatasController',
        controllerAs: 'vm',
        resolve: {
          kataResolve: getKata
        },
        data:{
          pageTitle: 'Kata {{ articleResolve.name }}'
        }
      });
  }

  getKata.$inject = ['$stateParams', 'KatasService'];

  function getKata($stateParams, KatasService) {
    return KatasService.get({
      kataId: $stateParams.kataId
    }).$promise;
  }

  newKata.$inject = ['KatasService'];

  function newKata(KatasService) {
    return new KatasService();
  }
})();
