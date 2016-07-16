'use strict';

/**
 * Module dependencies
 */
var sdtechniquesPolicy = require('../policies/sdtechniques.server.policy'),
  sdtechniques = require('../controllers/sdtechniques.server.controller');

module.exports = function(app) {
  // Sdtechniques Routes
  app.route('/api/sdtechniques').all(sdtechniquesPolicy.isAllowed)
    .get(sdtechniques.list)
    .post(sdtechniques.create);

  app.route('/api/sdtechniques/:sdtechniqueId').all(sdtechniquesPolicy.isAllowed)
    .get(sdtechniques.read)
    .put(sdtechniques.update)
    .delete(sdtechniques.delete);

  // Finish by binding the Sdtechnique middleware
  app.param('sdtechniqueId', sdtechniques.sdtechniqueByID);
};
