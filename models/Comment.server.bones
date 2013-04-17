var BSON = require('mongodb').BSONPure;



models.Comment.prototype.sync = function(method, model, options) {

	switch(method) {
	/*case 'update':

		
			db.collection('parks', function(err, places) {
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


		break;*/
	case 'create':

		parkId = model.get("parkId");

		db.collection('places', function(err, parks) {
			var query = {
				_id: new BSON.ObjectID(parkId)
			};
			parks.findOne(query, function(err, document) {
				
				model.unset("parkId");
				if (typeof(document.comments) !== 'undefined') {
					document.comments.push(model.toJSON());
				} else {
					document.comments = [model.toJSON()];
				}

				var itemQuery = {
					_id: new BSON.ObjectID(parkId)
				};
				delete document._id;
				parks.update(itemQuery, document, {
					safe: true
				}, function(err) {
					if(err) {

						console.log("Error saving Item: " + err);

						options.error();
						//db.close();
					} else {
						console.log("Updated Item: " + document.comments.length);
						options.success(model);
						//db.close();
					}
				});
			});
		});

		


		break;

	/*case 'delete':
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

		break;*/
	}
};