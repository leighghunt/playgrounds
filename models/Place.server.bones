var BSON = require('mongodb').BSONPure;



models.Place.prototype.sync = function(method, model, options) {
	switch(method) {
	case 'update':

		
			db.collection('places', function(err, places) {
				var placeQuery = {
					_id: new BSON.ObjectID(model.get("locationId"))
				};
				places.findOne(placeQuery, function(err, document) {
					model.set(document);
					model.unset('_id'); //we don't want to try and update the _id, mongo kicks an error  
					var itemQuery = {
						_id: new BSON.ObjectID(model.get("id"))
					};
					collection.update(itemQuery, model.toJSON(), {
						safe: true
					}, function(err) {
						if(err) {

							console.log("Error saving Item: " + err);

							options.error();
							//db.close();
						} else {

							options.success(model);
							//db.close();
						}
					});
				});
			});


		break;
	case 'create':

		db.collection('items', function(err, collection) {
			db.collection('places', function(err, places) {
				var query = {
					_id: new BSON.ObjectID(model.get("locationId"))
				};
				places.findOne(query, function(err, document) {
					model.set({
						latitude: document.latitude,
						longitude: document.longitude,
						address: document.address,
						locationName: document.name,
						startDate: new Date(model.get('startDate')),
						endDate: new Date(model.get('endDate'))
					});

					collection.insert(model.toJSON(), function(err, objects) {
						if(err) {

							console.log("Error saving Item: " + err);

							options.error();
							//db.close();
						} else {

							options.success(objects);
							//db.close();
						}
					});
				});
			});

		});


		break;

	case 'delete':
		db.collection('items', function(err, collection) {

			var query = {
				_id: new BSON.ObjectID(model.get("id"))
			};

			console.log(query);
			collection.remove(query, function(err, error) {
				if(err) {

					console.log("Error deleting Item: " + err);

					options.error();
					//db.close();
				} else {
					console.log("Successfully deleted!");
					options.success();
					//db.close();
				}

			});
		});

		break;
	}
};