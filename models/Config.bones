
var model = Backbone.Model.extend({
	defaults: {
		currentView: null,
		mapView: null,
		currentCollection: null,
		filtered: null,
		offset: 0
	},
	initialize: function(options) {
		this.set({'currentCollection': options.currentCollection});
		this.set({'filtered': options.currentCollection});
	},
	ready: function(success) {
		var config=this;
		if (this.get('currentCollection') == null)
		{
			this.set({currentCollection: new models.Places()});
			this.get('currentCollection').fetch({
					
			    success: function(){
			    	config.sort();
				    config.set({'filtered': config.get('currentCollection')});
				    success();
			    }
			});
		}
		else {
			//config.sort();
			config.set({'filtered': config.get('currentCollection')});
			success();
		}
	
	},
	
	/**Parses string formatted as YYYY-MM-DD to a Date object.
	 * If the supplied string does not match the format, an 
	 * invalid Date (value NaN) is returned.
	 * @param {string} dateStringInRange format YYYY-MM-DD, with year in
	 * range of 0000-9999, inclusive.
	 * @return {Date} Date object representing the string.
	 */
	
	 parseISO8601: function(dateStringInRange) {
	    var isoExp = /^\s*(\d{4})-(\d\d)-(\d\d)\s*/,
	        date = new Date(NaN), month,
	        parts = isoExp.exec(dateStringInRange);
	
	    if(parts) {
	      month = +parts[2];
	      date.setFullYear(parts[1], month - 1, parts[3]);
	      if(month != date.getMonth() + 1) {
	        date.setTime(NaN);
	      }
	    }
	    return date;
	},
	
	
	unfilter: function()
	{
		this.set({'filtered': this.get('currentCollection')});
	},
	sort: function() {
	var collection = this.get('currentCollection');
	var config = this;
	var sortedPlaces = collection.sortBy(function(item){
		var d = item.get('startDate');
		if (typeof d != 'object')
		{
			d = config.parseISO8601(d);
		
		}
		
					
		var utc = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(),0,0,0);
		
		return 	-utc;	
	});
	
	this.set({'currentCollection': new models.Places(sortedPlaces)});
	
	},
	filter: function(key, value) {
		var collection = this.get('currentCollection');
		var items = collection.filter(function(item){
			if (item.get('prop').indexOf(value) != -1)
			{
				return true;
			}
			else
			{
				return false;
			}
		});

		this.set({'filtered': new models.Places(items)});
	}

});