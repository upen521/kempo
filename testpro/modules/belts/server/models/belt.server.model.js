'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Belt Schema
 */
var BeltSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Belt name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Belt', BeltSchema);
