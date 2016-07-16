(function () {
  'use strict';

  angular
    .module('katas')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Katas',
      state: 'katas',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'katas', {
      title: 'List Katas',
      state: 'katas.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'katas', {
      title: 'Create Kata',
      state: 'katas.create',
      roles: ['user']
    });
  }
})();
