var BSON = require('mongodb').BSONPure;



models.Comment.prototype.sync = function(method, model, options) {

	switch(method) {

	case 'create':

		id = model.get("parkId");

		db.collection('places', function(err, parks) {
			var query = {
				_id: new BSON.ObjectID(id)
			};
			parks.findOne(query, function(err, document) {
				
				model.unset("parkId");
				model.set({date: new Date()});

				if (typeof(document.comments) !== 'undefined') {
					document.comments.push(model.toJSON());
				} else {
					document.comments = [model.toJSON()];
				}

				var itemQuery = {
					_id: new BSON.ObjectID(id)
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

	case 'delete':
			console.log("about to delete");
			db.collection('places', function(err, parks) {
				var query = {
					_id: new BSON.ObjectID(model.get('id'))
				};
				parks.findOne(query, function(err, document) {
				
				modelDate = new Date(model.get('date'))
				console.log("Model Date: " + modelDate);

				for (i=0; i<document.comments.length; i++){
					console.log("Doc Date: " + document.comments[i].date);
					if (document.comments[i].date.getTime() == modelDate.getTime()){
						console.log('Found a match on date: ' + modelDate);
						document.comments.splice(i,1);

						delete document._id;
						parks.update(query, document, {
							safe: true
						}, function(err) {
							if(err) {

								console.log("Error saving Item: " + err);

								options.error();
								//db.close();
							} else {
								console.log("Deleted comment, now there is: " + document.comments.length);
								options.success(model);
								//db.close();
							}
						});
						break;
					}
				}

			});
		});
		break;
	}
};