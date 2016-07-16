(function () {
  'use strict';

  angular
    .module('belts')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('belts', {
        abstract: true,
        url: '/belts',
        template: '<ui-view/>'
      })
      .state('belts.list', {
        url: '',
        templateUrl: 'modules/belts/client/views/list-belts.client.view.html',
        controller: 'BeltsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Belts List'
        }
      })
      .state('belts.create', {
        url: '/create',
        templateUrl: 'modules/belts/client/views/form-belt.client.view.html',
        controller: 'BeltsController',
        controllerAs: 'vm',
        resolve: {
          beltResolve: newBelt
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Belts Create'
        }
      })
      .state('belts.edit', {
        url: '/:beltId/edit',
        templateUrl: 'modules/belts/client/views/form-belt.client.view.html',
        controller: 'BeltsController',
        controllerAs: 'vm',
        resolve: {
          beltResolve: getBelt
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Belt {{ beltResolve.name }}'
        }
      })
      .state('belts.view', {
        url: '/:beltId',
        templateUrl: 'modules/belts/client/views/view-belt.client.view.html',
        controller: 'BeltsController',
        controllerAs: 'vm',
        resolve: {
          beltResolve: getBelt
        },
        data:{
          pageTitle: 'Belt {{ articleResolve.name }}'
        }
      });
  }

  getBelt.$inject = ['$stateParams', 'BeltsService'];

  function getBelt($stateParams, BeltsService) {
    return BeltsService.get({
      beltId: $stateParams.beltId
    }).$promise;
  }

  newBelt.$inject = ['BeltsService'];

  function newBelt(BeltsService) {
    return new BeltsService();
  }
})();
