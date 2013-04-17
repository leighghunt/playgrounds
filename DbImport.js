var Db = require('mongodb').Db,
  Connection = require('mongodb').Connection,
  Server = require('mongodb').Server;

var host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : Connection.DEFAULT_PORT;
var raw = new Db('parks', new Server(host, port, {}));
var clean = new Db('parks', new Server(host, port, {}));

function checkIt( item, key, properties) {
	key = key.toUpperCase();
	//console.log(item);
	if ((item.properties[key]) && ((item.properties[key] == 'Y') || (item.properties[key] > 0))) {
		properties.push(key.toLowerCase());
		console.log("Key: " + key + " value -> " + item.properties[key]);
	
	}
	return properties;
}

raw.open(function(err, rawDb) {
	
	rawDb.collection('import', function(err, rawCollection) { 
		
		clean.open(function(err, cleanDb) {
			
			cleanDb.collection('places', function(err, cleanCollection) { 
				rawCollection.find(function(err, cursor) {
					cursor.each(function(err, item) {

						if (item) {
						/*var obj = item.properties;
						  var keys = Object.keys(obj);
						  var n = keys.length;
						  while (n--) {
						    var key = keys[n];
						    obj[key.toLowerCase()] = obj[key]
						    delete obj[key]
						  }*/
						  cleanItem = { name: item.properties["NAME"], prop: [], propid: item.properties["PROPID"], address: item.properties["ADDRESS"]};
						  
						  keys = ["bbcourt","busstp", "fbfield", "diamond60", "diamond90", "drinkfount", "inswim", "outswim", "picnic", "plygrd", "skatepark", "soccerjr", "soccerreg", "spraypark", "tennisct", "totlot", "volleyb", "woodland"];
						  for (var i = 0; i< keys.length; i++) {
						  	cleanItem.prop = checkIt(item, keys[i], cleanItem.prop);
						  }
						  //cleanItem = item.properties;
/*
						if (item.geometry.coordinates[0].length > 2) {
				            coordinates = item.geometry.coordinates[0];
				        } else {
				            coordinates = item.geometry.coordinates[0][0];
				        }*/
				        

						cleanItem.loc = {
							type: "Polygon",
							coordinates: item.geometry.coordinates
						};
						cleanItem.type = "park";
						console.log("Park Import: " + cleanItem.name);
						cleanCollection.insert(cleanItem);
						
						}
						else {
							console.log("Done");
							rawDb.close();
							cleanDb.close();
						}
					});
				});
			
		});
		});
		});
	
});

