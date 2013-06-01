router = Backbone.Router.extend({
    routes: {
        '/': 'map',
        '/map': 'map',
        '/map/:id': 'mapPlace',
        '/map/:filter/:value': 'map',
        '/list': 'list',
        '/list/:filter/:value': 'list',
        '/place/:id': 'place',
        '/about': 'about'
    },
prepare: function(filter, value, success) {
	var router = this;
	if (typeof filter ==='function')
	{
		success = filter;
	}
	if (typeof this.config === 'undefined')
	{
		this.config = new models.Config();
	}  else {
		if (this.config.get('currentView')) {
			this.config.get('currentView').close();
			this.config.set({currentView: null});
		}
	}
	this.config.ready(function(){
		if (filter && value)
		{ 
			router.config.set({filter: filter, filterValue: value});
			router.config.filter(filter, value);
		}
		if (!router.config.get('mapView'))
		{
			var mapView = new views.Map({ config: router.config});
			mapView.initMap();
			router.config.set({mapView: mapView});
		}
		if (value) {
			router.config.get('mapView').selectFilterCategory(value);
		}
		success();
	});
},

about: function() {
	var router = this;
	this.prepare(function(){
		$('#item-border').hide();
		
		$('#items').html('<div id="about"></div>');
		var aboutView = new views.About({ config: router.config});
		router.config.set({currentView: aboutView});
		
		aboutView.render();
		$('#items').empty().append(aboutView.el);
		$('#items-border').show();
	});
},
map: function(filter, value) {
		
	 	var router = this;
	 	

	 	this.prepare(filter, value, function(){

		 	
		 	$('#item-border').hide();
		 	$('#items-border').hide();
		 	router.config.get('mapView').render(router.config.get('filtered'));

	 	});
		
},
map: function(filter, value) {
		
	 	var router = this;
	 	

	 	this.prepare(filter, value, function(){

		 	
		 	$('#item-border').hide();
		 	$('#items-border').hide();
		 	router.config.get('mapView').render(router.config.get('filtered'));

	 	});
		
},



list: function(filter, value) {

		var router = this;

		this.prepare(filter, value, function(){
			$('#items-border').show();
	 		$('#items').html('<div id="item-list"></div>');
	 		var listView = new views.ListPlaces({collection: router.config.get('filtered'),el: $('#item-list'), config: router.config});
	 		router.config.set({currentView: listView});
	 		
	 		$('#item-border').hide();
		 	listView.render();
		 	$('#items').empty().append(listView.el);	 	
		});
},



place: function(id) {

		var router = this;
		
		this.prepare(function(){

	 		
	 		
			var place = router.config.get('currentCollection').get(id);
			if (place != null) {
				var options = {parkId: id};
				comments = new models.Comments({},options)
				place.set({comments: comments });
	 		//$('#item').html('<div id="item-close" class="close"></div><div id="item-view"></div>');
		 		
		 		comments.fetch({success: function(){
			 			var placeView = new views.ViewPlace({ model: place, config: router.config});
			 			router.config.set({currentView: placeView});
			 			console.log(place.get('comments'));
			 			placeView.render();
					 	$('#item').empty().append(placeView.el);
					 	$('#items-border').hide();		 	
					 	$('#item-border').show();
		 			}
		 		});
			 	
			} else {
				console.log('Error: Item Page load, id - ' + id);
			
			}
	 	
		});
	
},

mapPlace: function(id) {

		var router = this;
		console.log(router);
		this.prepare(function(){

	 		
	 		
			var place = router.config.get('currentCollection').get(id);
			if (place != null) {

		 		
				 	$('#item-border').hide();
				 	$('#items-border').hide();
				 	loc = place.get('loc');
				 	console.log(loc);
				 	if (loc.type == 'Polygon') {
				 		center = loc.coordinates[0][0];
				 	} else {
				 		center = loc.coordinates[0];
				 	}
			 		router.config.get('mapView').render(router.config.get('currentCollection'),center);
		 		
			 	
			} else {
				console.log('Error: Item Page load, id - ' + id);
			
			}
	 	
		});
	
},
    // Helper to assemble the page title.
    pageTitle: function(view) {
        var title =  'DC Playgrounds';
        return (view.pageTitle ? view.pageTitle + ' | ' + title : title);
    },

    // The send method is...
    send: function(view) {
        var options = (arguments.length > 1 ? arguments[1] : {});
        var v = new view(options);

        // Populate the #page div with the main view.
        $('#page').empty().append(v.el);

        // TODO explain this!
        v.render().attach().activeLinks().scrollTop();

        // Set the page title.
        document.title = this.pageTitle(v);
    },

    // Generic error handling for our Router.
    error: function(error) {
        this.send(views.Error, _.isArray(error) ? error.shift() : error);
    },

    // Helper to fetch a set of models/collections in parrellel.
    fetcher: function() {
        var models = [];

        return {
            push: function(place) { models.push(place) },
            fetch: function(callback) {
                if (!models.length) return callback();
                var errors = [];
                var _done = _.after(models.length, function() {
                    callback(errors.length ? errors : null);
                });
                _.each(models, function(model) {
                    model.fetch({
                        success: _done,
                        error: function(error) {
                            errors.push(error);
                            _done();
                        }
                    });
                });
            }
        }
    }
});