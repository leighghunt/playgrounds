var model = Backbone.Model.extend({
	defaults: {
	},
	initialize: function() {
    },
	url: function() {
		if (typeof this.get('id') != 'undefined') {
		
			return '/api/Comment/' + this.get('id');
		} else {
			return '/api/Comment/';
		}
		
	}
});