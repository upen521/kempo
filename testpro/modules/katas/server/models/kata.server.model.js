'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Kata Schema
 */
var KataSchema = new Schema({
  kata: {
    type: String,
    default: '',
    required: 'Please fill Kata name',
    trim: true
  },
  summary: {
    type: String,
    default: '',
    required: 'Please fill Kata name',
    trim: true
  },
  belt: {
    type: Schema.ObjectId,
    ref: 'Belt',
    required: 'Please select the belt'
  },
  attachemnt:[{
    fileName: {
      type: String
    },
    filePath: {
      type: String
    },
    fileType: {
      type: String
    },
    created: {
      type: Date,
      default: Date.now
    }
  }],
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Kata', KataSchema);
