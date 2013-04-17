models.Places.prototype.sync = function(method, model, options) {
		
		switch (method) {
		 	
		    case 'read':	
		    	var offset = this.options.offset;
		    	db.collection('places', function(err, collection) { 
		    		collection.find({name: {$ne:""}},function(err, cursor) { 
		    			cursor.sort().skip(offset+0).limit().each(function(err, doc) {
		    				if(doc != null) {
									var place = new models.Place();
									doc.id = doc._id;
									if (typeof(doc.comments) !== 'undefined') {
										delete doc.comments; // We only want to send comments when a Place is viewed
									} 
									place.set(doc);
									model.add(place);
		    				}
		    				else {
		    					// all done with items
		    					options.success(model.toJSON());
		    				}
		    			});
		    			
		    		});
		    	});
		
		    break;
		}
};