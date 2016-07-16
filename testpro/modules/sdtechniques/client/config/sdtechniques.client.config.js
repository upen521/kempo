(function () {
  'use strict';

  angular
    .module('sdtechniques')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Self Defense Techniques',
      state: 'sdtechniques',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'sdtechniques', {
      title: 'List Techniques',
      state: 'sdtechniques.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'sdtechniques', {
      title: 'Create Techniques',
      state: 'sdtechniques.create',
      roles: ['user']
    });
  }
})();
