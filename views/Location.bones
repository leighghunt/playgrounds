var view = Backbone.View.extend({
	tagName: 'option',
	className: 'location',
	events: {
		//'click div.save-tweet': 'post',
	},

	initialize: function(){
		_.bindAll(this, 'render', 'unrender');

		this.model.bind('change', this.render);
		this.model.bind('remove', this.unredner);
	},

	render: function(){
	$(this.el).html('<b>' + this.model.get('name') + '</b> ' +   this.model.get('address'));
  $(this.el).attr('value', this.model.get('id') +'');
  
      return this; // for chainable calls, like .render().el
    },

	post: function(){
		//this.trigger("post", this.model);
		this.unrender();
	},
	unrender: function(){
		$(this.el).remove();
	},

	
	remove: function(){
		this.model.destroy();
	}
});