var BSON = require('mongodb').BSONPure;


models.Comments.prototype.sync = function(method, model, options) {
		var parkId = this.options.parkId;

		switch (method) {
		 	
		    case 'read':	
		    	var offset = this.options.offset;
		    	db.collection('places', function(err, collection) { 
		    		var query = {
						_id: new BSON.ObjectID(parkId)
					};
		    		collection.findOne(query,function(err, document) { 
		    			//model.set(document.comments);
		    			
		    			options.success(document.comments);	    			
		    		});
		    	});
		
		    break;
		}
};