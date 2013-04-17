var model = Backbone.Collection.extend({
	model: models['Place'],
	options: {},
	url: function() {

			return '/api/Place';
		
	},
initialize: function(models, options) {
		
	if ((typeof models !== 'undefined') && (models.length > 0))
	{
		this.options.offset = models.length;
	} else {
		this.options.offset = 0;
	}
	    
   if (typeof options !== 'undefined') {
   	if (typeof options.offset !== 'undefined')
   	{
    		this.options.offset = parseInt(options.offset);
    	}
    }
    
    
    return this;
  },
parse: function(response) {
	this.options.offset = this.options.offset + response.length;
  return response;
}
});