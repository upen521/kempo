'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Sdtechnique = mongoose.model('Sdtechnique'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Sdtechnique
 */
exports.create = function(req, res) {
  var sdtechnique = new Sdtechnique(req.body);
  sdtechnique.user = req.user;

  sdtechnique.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sdtechnique);
    }
  });
};

/**
 * Show the current Sdtechnique
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var sdtechnique = req.sdtechnique ? req.sdtechnique.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  sdtechnique.isCurrentUserOwner = req.user && sdtechnique.user && sdtechnique.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(sdtechnique);
};

/**
 * Update a Sdtechnique
 */
exports.update = function(req, res) {
  var sdtechnique = req.sdtechnique ;

  sdtechnique = _.extend(sdtechnique , req.body);

  sdtechnique.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sdtechnique);
    }
  });
};

/**
 * Delete an Sdtechnique
 */
exports.delete = function(req, res) {
  var sdtechnique = req.sdtechnique ;

  sdtechnique.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sdtechnique);
    }
  });
};

/**
 * List of Sdtechniques
 */
exports.list = function(req, res) { 
  Sdtechnique.find().sort('-created').populate('user', 'displayName').exec(function(err, sdtechniques) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sdtechniques);
    }
  });
};

/**
 * Sdtechnique middleware
 */
exports.sdtechniqueByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Sdtechnique is invalid'
    });
  }

  Sdtechnique.findById(id)
  .populate('user', 'displayName')
  .populate('belt', 'name')
  .exec(function (err, sdtechnique) {
    if (err) {
      return next(err);
    } else if (!sdtechnique) {
      return res.status(404).send({
        message: 'No Sdtechnique with that identifier has been found'
      });
    }
    req.sdtechnique = sdtechnique;
    next();
  });
};
