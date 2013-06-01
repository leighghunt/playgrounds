var view = Backbone.View.extend({
	locations: [],
	dateDiv: '',
	dateType: 'single',
	recurrDiv: '',
	recurrType: 'weekly',
	events: {
		'click span.save': 'save',
		'click span.addLocation': 'addLocation',
		'click span.saveLocation': 'saveLocation',
		'click span.delete': 'remove',
		'change #date-type': 'dateTypeChange',
		'change #recurrence-pattern': 'recurrPatternChange',
		'keyup #location-input': 'search'
	},
	
	

	initialize: function(){
		_.bindAll(this, 'render', 'save','updateLocations', 'search', 'appendLocation', 'addLocation', 'saveLocation', 'saveLocationSuccess', 'recurrPatternChange', 'dateTypeChange');
		
		this.locations = new models.Locations([],{'search': ''});
		this.locations.bind('reset', this.updateLocations);
		
	},

	render: function(){

	  $(this.el).html( templates.ItemEdit(this.model.toJSON()));
    $( "#item-date", this.el ).datepicker();     
    var dates = $( "#item-start-date, #item-end-date", this.el ).datepicker({
    			defaultDate: "+1w",
    			changeMonth: true,
    			numberOfMonths: 2,
    			onSelect: function( selectedDate ) {
    				var option = this.id == "item-start-date" ? "minDate" : "maxDate",
    					instance = $( this ).data( "datepicker" ),
    					date = $.datepicker.parseDate(
    						instance.settings.dateFormat ||
    						$.datepicker._defaults.dateFormat,
    						selectedDate, instance.settings );
    				dates.not( this ).datepicker( "option", option, date );
    			}
    		});

    this.dateDiv = $('#single-date', this.el);
    this.recurrDiv = $('#recurring-weekly', this.el); 
    $('#range-date', this.el).hide();
    $('#recurring-date', this.el).hide();
		$('#recurring-monthly', this.el).hide();
		
		if(typeof this.model.get('category') !== 'undefined')
		{
			$('#item-category').val(this.model.get('category'));
		}
		
		if(typeof this.model.get('dateType') !== 'undefined')
		{
					this.dateType = this.model.get('dateType');
					$('#date-type',this.el).val(this.model.get('dateType'));
					
					
					switch(this.dateType) {
						case 'single':
							$('#item-date', this.el).val(this.model.get('startDate'));
							
						break;
						case 'range':
							this.dateDiv = $('#range-date',this.el);
							$('#range-date',this.el).show();
							$('#single-date', this.el).hide();
							
							$('#item-start-date', this.el).val(this.model.get('startDate'));
							$('#item-end-date', this.el).val(this.model.get('endDate'));
						break;
						case 'recurring':
							$('#range-date', this.el).show();
							$('#recurring-date',this.el).show();
							$('#single-date', this.el).hide();
						
							$('#item-start-date', this.el).val(this.model.get('startDate'));
							$('#item-end-date', this.el).val(this.model.get('endDate'));
							
							this.recurrType = this.model.get('freq');
							$('#recurrence-pattern', this.el).val(this.recurrType);
							this.dateDiv = $('#recurring-date',this.el);
							
							switch (this.recurrType) {
								case 'weekly':
									
									$('#item-weekly-day', this.el).val(this.model.get('byDay'));
									$('#item-weekly-interval', this.el).val(this.model.get('interval'));
								break;
								case 'monthly':
									$('#recurring-monthly',this.el).show();
									$('#recurring-weekly',this.el).hide();
									$('#item-monthly-day', this.el).val(this.model.get('byDay'));
									$('#item-monthly-order', this.el).val(this.model.get('order'));
									$('#item-monthly-interval', this.el).val(this.model.get('interval'));	
								break;
							}
						break;
					}
		
		}
      return this; // for chainable calls, like .render().el
    },
    
	updateLocations: function() {
	$('#search-results', this.el).html('');
		_(this.locations.models).each(function(location){
					this.appendLocation(location);
				}, this);
	},
	
	search: function(){
		//this.collection = new models.Locations([],{'search': $('#location-input').val()});
		if ($('#location-input').val().length > 2)
		{
			this.locations.options.search = $('#location-input').val();
			console.log("Searching...");
			this.locations.fetch();	
		}
	},
	
	appendLocation: function(location){
	
	var locationView = new views.Location({
	    model: location
	  });
	
	  $('#search-results', this.el).append(locationView.render().el);
	},


	unrender: function(){
		$(this.el).remove();
		this.trigger('unrender');
	},
	saveLocationSuccess: function(model, response){
		$('#add-location').hide();
		$('#search-location').show();
		
		this.locations.options.search = model.get('name');
		$('#location-input').val(model.get('name'));
		console.log("Searching...");
		this.locations.fetch();
		$('#location-name').val('');
		$('#location-address').val('');
		
	},
	
	saveLocation: function(){
		var location = new models.Location({
			name: $('#location-name').val(),
			address: $('#location-address').val()
		});
		location.save({},{
			error: function(model, response){
				$('#location-name').val('');
				$('#location-address').val('');
				$('#add-location').hide();
				$('#search-location').show();
			},
			success: this.saveLocationSuccess
		});	
	},
	dateTypeChange: function(e) {
		if (this.dateType = 'recurring') {
			$('#range-date').hide();
		}
		this.dateDiv.hide();
		var selectedOption = $('#date-type');
		var selectedType = selectedOption.val();
		switch(selectedType) {
			case 'single':
				this.dateDiv = $('#single-date');
				this.dateType = 'single';
			break;
			case 'range':
				this.dateDiv = $('#range-date');
				this.dateType = 'range';
			break;
			case 'recurring':
				this.dateDiv = $('#recurring-date');
				this.dateType = 'recurring';
				$('#range-date').show();
			break;
		}
		this.dateDiv.show();
	},
	recurrPatternChange: function(e) {
		if (this.recurrDiv) {
			this.recurrDiv.hide();
		}
		var selectedOption = $('#recurrence-pattern');
		var selectedType = selectedOption.val();
		switch(selectedType) {
			case 'weekly':
				this.recurrDiv = $('#recurring-weekly');
				this.recurrType = 'weekly';
			break;
			case 'monthly':
				this.recurrDiv = $('#recurring-monthly');
				this.recurrType = 'monthly';
			break;
		}
		this.recurrDiv.show();
	},
	addLocation: function(){
		$('#add-location').show();
		$('#search-location').hide();
	},
	save: function(){
		if (($('#search-results').val()) || (typeof this.model.get('locationId') !== 'undefined'))
		{
			var item = this.model;
			
			item.set({
				note: $('#item-note').val(),
				source: $('#item-source').val(),
				sourceUrl: $('#item-source-url').val(),
				title: $('#item-title').val(),
				category: $('#item-category').val(),
				dateType: this.dateType
			});
			if ($('#search-results').val()) {
				item.set({locationId: $('#search-results').val()});
			}
			
			
			switch(this.dateType) {
				case 'single':
					item.set({startDate: $('#item-date').val(), endDate: $('#item-date').val()});
				break;
				case 'range':
					item.set({startDate: $('#item-start-date').val(), endDate: $('#item-end-date').val()});

				break;
				case 'recurring':
					item.set({startDate: $('#item-start-date').val(), endDate: $('#item-end-date').val()});
					item.set({freq: this.recurrType});
					switch (this.recurrType) {
						case 'weekly':
							item.set({byDay: $('#item-weekly-day').val(), interval: $('#item-weekly-interval').val()});
						break;
						case 'monthly':
							item.set({byDay: $('#item-monthly-day').val(), order: $('#item-monthly-order').val(), interval: $('#item-monthly-interval').val()});
					
						break;
					}
				break;
			}
			
			// this adds the Item id to the RSS Item, tells you how many posts there were from an item.
			if (typeof this.options.rssItem !== 'undefined') // only do this for new Items where the rssItem gets pushed.
			{
				var rssItem = this.options.rssItem;
				item.save(null,{success: function(model, response){
					var items = rssItem.get('items');
					if (!items)
					{
						items = new Array();
					}
					items.push(response[0]._id);	
					rssItem.set({items: items});
					rssItem.save();
				}});
			} else {
				item.save();
			}
			this.trigger('save');
			this.unbind();
			this.unrender();
		}		
	},

	remove: function(){
		this.model.destroy();
	}
});