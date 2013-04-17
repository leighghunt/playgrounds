var model = Backbone.Model.extend({
	defaults: {
	},
	initialize: function() {
    },
	url: function() {
		
		return '/api/Comment/';
	}
});