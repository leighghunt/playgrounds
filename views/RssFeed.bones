

var view = Backbone.View.extend({
	//tagName: 'li',
	className: 'rss-feed',
	


    

	initialize: function(){
		_.bindAll(this, 'render', 'unrender'  );

		this.model.bind('change', this.render);
	},

	render: function(){
	$(this.el).html(
			"<div class='text'><div class='title'><a href='" + this.model.get('url') + "' class='filter-feed'>" + this.model.get('title') + "</a></div>");
			

				   return this; // for chainable calls, like .render().el
    },

	unrender: function(){
		$(this.el).remove();
	},
	
	remove: function(){
		this.model.destroy();
	}
});