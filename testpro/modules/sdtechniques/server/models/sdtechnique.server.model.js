'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Sdtechnique Schema
 */
var SdtechniqueSchema = new Schema({
  technique: {
    type: String,
    default: '',
    required: 'Please fill self defence technique name',
    trim: true
  },
  belt: {
    type: Schema.ObjectId,
    ref: 'Belt',
    required: 'Please select the belt'
  },
  attack: {
    type: String,
    default: '',
    required: 'Please fill attack procedure',
    trim: true
  },
  description: {
    type: String,
    default: '',
    required: 'Please fill descriptions about the attack ',
    trim: true
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

mongoose.model('Sdtechnique', SdtechniqueSchema);
