var Db = require('mongodb').Db,
  Connection = require('mongodb').Connection,
  Server = require('mongodb').Server;

var host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : Connection.DEFAULT_PORT;
var raw = new Db('parks', new Server(host, port, {}));
var clean = new Db('parks', new Server(host, port, {}));

raw.open(function(err, rawDb) {
	
	rawDb.collection('recImport', function(err, rawCollection) { 
		
		clean.open(function(err, cleanDb) {
			
			cleanDb.collection('places', function(err, cleanCollection) { 
				rawCollection.find(function(err, cursor) {
					cursor.each(function(err, item) {

						if (item) {

						  cleanItem = { name: item.properties["NAME"], prop: [], propid: item.id, address: item.properties["ADDRESS"]};
						  if (item.properties["POOL_NAME"] && (item.properties["POOL_NAME"] != "none")) {
						  	cleanItem.name = item.properties["POOL_NAME"];
						  }
						  if (item.properties["WEB_URL"]) {
						  	cleanItem.url = item.properties["WEB_URL"];
						  }
						  if (item.properties["PHONE"]) {
						  	cleanItem.phone = item.properties["PHONE"];
						  }

						   
						  switch (item.properties["USE_TYPE"]) {
						  	case "RECREATION CENTER":
						  		cleanItem.prop.push("rec");
						  	break;
						  	case "SPRAY PARK":
						  		//covered by POOL below
						  	break;
						  	case "POOL":
						  		//covered by POOL below
						  	break;
						  	case "AQUATIC CENTER":
						  		cleanItem.prop.push("aquatic");
						  	break;
						  }
						  switch (item.properties["POOL"]) {
						  		case "outdoor":
						  			cleanItem.prop.push("outswim");
						  		break;
								case "outdoor + child":
									cleanItem.prop.push("outswim");
									cleanItem.prop.push("kidswim");
								break;
								case "indoor":
									cleanItem.prop.push("inswim");
								break;
								case "child":
									cleanItem.prop.push("kidswim");
								break;
								case "Spray":
									cleanItem.prop.push("spraypark");
								break;
								case "walk to learn":
									cleanItem.prop.push("kidswim");
								break;
						  	}
						  
						  

						cleanItem.loc = {
							type: "Point",
							coordinates: item.geometry.coordinates
						};
						cleanItem.type = "rec";
						console.log("Rec Import: " + cleanItem.name);
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