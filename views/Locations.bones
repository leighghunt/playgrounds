
var view = Backbone.View.extend({
	//el: $('#tweets'),
	id: 'locations',
	events: {
		'keyup #location-input': 'search'
	},
	initialize: function(){
		_.bindAll(this, 'render', 'appendLocation', 'search', 'updateLocations');
		this.collection = new models.Locations([],{'search': 'cv'});
		this.collection.bind('reset', this.updateLocations);
		
		this.render();
		if (!Bones.server)
		{

			console.log("Loading Locations!");
			this.collection.fetch();
		}
	},
	
	render: function(){
		$(this.el).html("<input type='text' id='location-input' /><br /><select multiple size=5></select>");
		
		_(this.collection.models).each(function(location){
					this.appendLocation(location);
				}, this);

		console.log("Rendering Location List");
		return this;



		//console.log(this.el);
	},

	updateLocations: function() {
	$('select', this.el).html('');
	_(this.collection.models).each(function(location){
				this.appendLocation(location);
			}, this);
	},
	search: function(){
		//this.collection = new models.Locations([],{'search': $('#location-input').val()});
		this.collection.options.search = $('#location-input').val();
		console.log("Searching...");
		this.collection.fetch();	
	},
	 appendLocation: function(location){
		console.log("Appended Location");
	  var locationView = new views.Location({
        model: location
      });
		
      $('select', this.el).append(locationView.render().el);
    }
  });