'use strict';

/**
 * Module dependencies
 */
var katasPolicy = require('../policies/katas.server.policy'),
  katas = require('../controllers/katas.server.controller');

module.exports = function(app) {
  // Katas Routes
  app.route('/api/katas').all(katasPolicy.isAllowed)
    .get(katas.list)
    .post(katas.create);

  app.route('/api/katas/:kataId').all(katasPolicy.isAllowed)
    .get(katas.read)
    .put(katas.update)
    .delete(katas.delete);

  // Finish by binding the Kata middleware
  app.param('kataId', katas.kataByID);
};
