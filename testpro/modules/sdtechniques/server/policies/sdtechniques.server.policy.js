'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Sdtechniques Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/sdtechniques',
      permissions: '*'
    }, {
      resources: '/api/sdtechniques/:sdtechniqueId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/sdtechniques',
      permissions: ['get', 'post']
    }, {
      resources: '/api/sdtechniques/:sdtechniqueId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/sdtechniques',
      permissions: ['get']
    }, {
      resources: '/api/sdtechniques/:sdtechniqueId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Sdtechniques Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Sdtechnique is being processed and the current user created it then allow any manipulation
  if (req.sdtechnique && req.user && req.sdtechnique.user && req.sdtechnique.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
