'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Belt = mongoose.model('Belt'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Belt
 */
exports.create = function(req, res) {
  var belt = new Belt(req.body);
  belt.user = req.user;

  belt.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(belt);
    }
  });
};

/**
 * Show the current Belt
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var belt = req.belt ? req.belt.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  belt.isCurrentUserOwner = req.user && belt.user && belt.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(belt);
};

/**
 * Update a Belt
 */
exports.update = function(req, res) {
  var belt = req.belt ;

  belt = _.extend(belt , req.body);

  belt.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(belt);
    }
  });
};

/**
 * Delete an Belt
 */
exports.delete = function(req, res) {
  var belt = req.belt ;

  belt.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(belt);
    }
  });
};

/**
 * List of Belts
 */
exports.list = function(req, res) { 
  Belt.find().sort('-created').populate('user', 'displayName').exec(function(err, belts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(belts);
    }
  });
};


/**
 * getList of Belts
 */
exports.getBeltsList = function(req, res) { 
  Belt.find({},'name').exec(function(err, belts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(belts);
    }
  });
};

/**
 * Belt middleware
 */
exports.beltByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Belt is invalid'
    });
  }

  Belt.findById(id).populate('user', 'displayName').exec(function (err, belt) {
    if (err) {
      return next(err);
    } else if (!belt) {
      return res.status(404).send({
        message: 'No Belt with that identifier has been found'
      });
    }
    req.belt = belt;
    next();
  });
};
