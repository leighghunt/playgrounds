#!/usr/bin/env node
var Db = require('mongodb').Db,
  Connection = require('mongodb').Connection,
  Server = require('mongodb').Server;
require('iron-bones').load(__dirname);

var host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : Connection.DEFAULT_PORT;
var mongo = new Db('parks', new Server(host, port, {}));

console.log("Env: " + process.env.NODE_ENV);

if (!module.parent) {
	console.log("index initalized " + __dirname);
	mongo.open(function(err, db) {
		global.db = db;
	});

		
    require('iron-bones').start();
}
