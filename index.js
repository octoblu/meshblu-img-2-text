'use strict';
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var debug = require('debug')('meshblu-img-2-text')
var imageToTextDecoder = require('image-to-text');
var base64Img = require('base64-img');

var MESSAGE_SCHEMA = {
  type: 'object',
  properties: {
  }
};

var OPTIONS_SCHEMA = {
  type: 'object',
  properties: {
  }
};

function Plugin(){
  var self = this;
  self.options = {};
  self.messageSchema = MESSAGE_SCHEMA;
  self.optionsSchema = OPTIONS_SCHEMA;
  return self;
}
util.inherits(Plugin, EventEmitter);

Plugin.prototype.onMessage = function(message){
  var self = this;
  var payload = message.payload;
  base64Img.img(payload.pictures, 'dest', '1', function(err, filepath){
    var file = {
      "name": "1.jpg",
      "path": "dest/"
    };

    imageToTextDecoder.getKeywordsForImage(file).then(function(keywords){
      self.emit('message', { devices: ['*'], payload: {keywords: keywords} });
    });
  });
};

Plugin.prototype.onConfig = function(device){
  var self = this;
  self.setOptions(device.options||{});
};

Plugin.prototype.setOptions = function(options){
  var self = this;
  self.options = options;
};

module.exports = {
  messageSchema: MESSAGE_SCHEMA,
  optionsSchema: OPTIONS_SCHEMA,
  Plugin: Plugin
};
