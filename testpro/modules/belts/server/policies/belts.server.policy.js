'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Belts Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/belts',
      permissions: '*'
    }, {
      resources: '/api/belts/:beltId',
      permissions: '*'
    }, {
      resources: '/api/belts/getbeltslist',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/belts',
      permissions: ['get', 'post']
    }, {
      resources: '/api/belts/:beltId',
      permissions: ['get']
    }, {
      resources: '/api/belts/getbeltslist',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/belts',
      permissions: ['get']
    }, {
      resources: '/api/belts/:beltId',
      permissions: ['get']
    }, {
      resources: '/api/belts/getbeltslist',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Belts Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Belt is being processed and the current user created it then allow any manipulation
  if (req.belt && req.user && req.belt.user && req.belt.user.id === req.user.id) {
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
