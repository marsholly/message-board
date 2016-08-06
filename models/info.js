'use strict'
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const moment = require('moment');
const dataFilePath = path.join(__dirname, '../data/infos.json');

exports.getAll = function(callback){
  fs.readFile(dataFilePath, (err, data)=>{
    if(err) return callback(err);
    let infos;
    try{
      infos = JSON.parse(data);
    }catch(e){
      callback(err);
      return;
    }

    callback(null, infos);
  });
}

exports.create = function(messageObj, callback){
  exports.getAll(function(err, infos){
    if(err) return callback(err);
    messageObj.id = uuid.v4();
    messageObj.time = moment().format('lll');
    infos.push(messageObj);
    fs.writeFile(dataFilePath, JSON.stringify(infos),function(err){
      callback(err);
    });
  });
}

exports.getOne = function(id, callback){
  exports.getAll(function(err, infos){
    if(err) return callback(err);
    let info = infos.filter(info=>info.id === id)[0];
    callback(null, info);
  });
}

exports.update = function(id, updateObj, callback){
  exports.getAll(function(err, infos){
    if(err) return callback(err);
    let info = infos.filter(info=>info.id === id)[0];
    if(!info){
      return callback({error: "message not found."});
    }
    let index = infos.indexOf(info);
    for(let key in info){
      info[key] = updateObj[key] || info[key];
    }
    infos[index] = info;
    fs.writeFile(dataFilePath, JSON.stringify(infos), function(err){
      if(err) return callback(err);
      callback(null, info);
    })
  });
}

exports.remove = function(id, callback){
  exports.getAll(function(err, infos){
    if(err) return callback(err);
    infos = infos.filter(info=>info.id !== id);
    fs.writeFile(dataFilePath, JSON.stringify(infos), function(err){
      if(err) return callback(err);
      callback(null, infos);
    });
  });
}













