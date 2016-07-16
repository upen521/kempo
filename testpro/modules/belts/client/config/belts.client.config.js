(function () {
  'use strict';

  angular
    .module('belts')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Belts',
      state: 'belts',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'belts', {
      title: 'List Belts',
      state: 'belts.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'belts', {
      title: 'Create Belt',
      state: 'belts.create',
      roles: ['user']
    });
  }
})();
