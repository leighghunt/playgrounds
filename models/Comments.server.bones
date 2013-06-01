var BSON = require('mongodb').BSONPure;


models.Comments.prototype.sync = function(method, model, options) {
		var parkId = this.options.parkId;

		switch (method) {
		 	
		    case 'read':	
		    	if (parkId) {
		    	
		    	db.collection('places', function(err, collection) { 
		    		var query = {
						_id: new BSON.ObjectID(parkId)
					};
		    		collection.findOne(query,function(err, document) { 
		    			options.success(document.comments);	    			
		    		});
		    	});
				} else {
					
					db.collection('places', function(err, collection) { 
			    		collection.find(function(err, cursor) {
			    			
			    			output = []; 
			    			cursor.each(function(err, doc) {
			    				if(doc != null) {
		    						if (doc.comments && (doc.comments.length)) {
		    							len = doc.comments.length;
		    							
			    						for (i=0; i < len; i++) {
				    						comment = {
				    							id: doc._id,
				    							name: doc.name,
				    							rating: doc.rating,
				    							date: doc.comments[i].date,
				    							comment: doc.comments[i].comment
				    						}
				    						output.push(comment);
			    						}
		    						}	
			    				}
			    				else {
			    					// all done with items
			    					options.success(output);
			    				}
			    			});
		    			
		    			});
		    		});


					/*
					db.collection('places', function(err, collection) { 
						m = function() {
							if (this.comments){
								len = this.comments.length;
								for (i=0;i<len; i++) {

									emit (this.comments[i].date, 
										{ name: this.name, 
											comment: this.comments[i].comment,
											id: this._id
										});
								}
							}
							
						}
						r = function(k,v) {
							return v;
						}
					*/
		    		/*collection.aggregate(
			            { $project: { 
			            	comments: 1, 
			            	name: 1
			            }},
			            { $unwind: "$comments" }, 
			            { $group : { 
			            	_id : { comment: "$comments.comment", name: "$name" } 
			            }}  
			          , function(err, result) {
			          	options.success(result);     
			        });*/
					/*
			        collection.mapReduce(m.toString(), r.toString(), {out:  { inline : 1 }}, function(e, c) {
					    console.log(e);

					    options.success(c);           
					});
		    	});*/

				}
		    break;
		}
};