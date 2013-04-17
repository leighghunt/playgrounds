var model = Backbone.Collection.extend({
	model: models['Comment'],
	options: {},
	url: function() {
		if (typeof this.options !== 'undefined') {
   			if (typeof this.options.parkId !== 'undefined')
   			{	
		
				return '/api/Comment/?parkId=' + this.options.parkId;
			} else {
				return '/api/Comment/';
			}
		}
		//return '/api/Comment/';
	},
initialize: function(models, options) {
    if (typeof options !== 'undefined') {
   	if (typeof options.parkId !== 'undefined')
   	{	
    		this.options.parkId = options.parkId;
    	}
    }
    return this;
  },
parse: function(response) {
  return response;
}
});