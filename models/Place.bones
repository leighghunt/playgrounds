

var model = Backbone.Model.extend({
	defaults: {

	},
	initialize: function() {
		
	},
	url: function() {
		if (typeof this.get('_id') != 'undefined') {
		
			return '/api/Place/' + this.get('_id');
		} else {
			return '/api/Place/';
		}
	}
});