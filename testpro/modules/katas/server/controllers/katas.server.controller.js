'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Kata = mongoose.model('Kata'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Kata
 */
exports.create = function(req, res) {
  var kata = new Kata(req.body);
  kata.user = req.user;

  kata.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(kata);
    }
  });
};

/**
 * Show the current Kata
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var kata = req.kata ? req.kata.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  kata.isCurrentUserOwner = req.user && kata.user && kata.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(kata);
};

/**
 * Update a Kata
 */
exports.update = function(req, res) {
  var kata = req.kata ;

  kata = _.extend(kata , req.body);

  kata.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(kata);
    }
  });
};

/**
 * Delete an Kata
 */
exports.delete = function(req, res) {
  var kata = req.kata ;

  kata.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(kata);
    }
  });
};

/**
 * List of Katas
 */
exports.list = function(req, res) { 
  Kata.find().sort('-created').populate('user', 'displayName').exec(function(err, katas) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(katas);
    }
  });
};

/**
 * Kata middleware
 */
exports.kataByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Kata is invalid'
    });
  }

  Kata.findById(id)
  .populate('user', 'displayName')
  .populate('belt', 'name')
  .exec(function (err, kata) {
    if (err) {
      return next(err);
    } else if (!kata) {
      return res.status(404).send({
        message: 'No Kata with that identifier has been found'
      });
    }
    req.kata = kata;
    next();
  });
};
