'use strict';

/**
 * Module dependencies
 */
var beltsPolicy = require('../policies/belts.server.policy'),
  belts = require('../controllers/belts.server.controller');

module.exports = function(app) {
  // Belts Routes
  app.route('/api/belts').all(beltsPolicy.isAllowed)
    .get(belts.list)
    .post(belts.create);

  app.route('/api/belts/getbeltslist').all(beltsPolicy.isAllowed)
    .get(belts.getBeltsList);

  app.route('/api/belts/:beltId').all(beltsPolicy.isAllowed)
    .get(belts.read)
    .put(belts.update)
    .delete(belts.delete);

  // Finish by binding the Belt middleware
  app.param('beltId', belts.beltByID);
};
