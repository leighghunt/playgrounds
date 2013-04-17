var view = Backbone.View.extend({
id: "item-list",
/*events: {
    'click a': 'routeClick'
},*/
initialize: function(){
	_.bindAll(this, 'render', 'appendItem', 'routeClick');
	//this.collection.bind('reset', this.render);	
},
render: function(){
		//$(this.el).html("<div id='items-go-here'></div>");
		
		this.collection.each(function(item){
                    if (item.get('name'))			
					   this.appendItem(item);
				}, this);

		return this;



	},
// Routes a click event
// --------------------
routeClick: function(ev) {

    // We only route client side if the browser supports push state.
    // The check here is borrowed from Backbone.
    //Backbone.Router[0].navigate($(ev.currentTarget).get(0).getAttribute('href', 2));
   /* if (window.history && window.history.pushState) {
        var href = $(ev.currentTarget).get(0).getAttribute('href', 2);
        if (href) return view.route($(ev.currentTarget).get(0).getAttribute('href', 2));
    }*/
    
    var href = $(ev.currentTarget).get(0).getAttribute('href', 2);
    console.log("There: " + href);
    if (href) return this.route($(ev.currentTarget).get(0).getAttribute('href', 2));
    
    return true;
},

// Routes a path
// -------------
route: function(path) {
    
    if (path.charAt(0) === '/') {
        var matched = _.any(Backbone.history.handlers, function(handler) {
            if (handler.route.test(path)) {
                Backbone.history.navigate(path, true);
                return true;
            }
        });
        return !matched;
    }
    return true;
},

appendItem: function(itemObj){
	var place = new models.Place(itemObj);
  var itemView = new views.ListPlace({
      model: place
    });

   $(this.el).append(itemView.render().el);
 },
 
 onClose: function(){
 			this.unbind();
     //this.collection.unbind("reset", this.render);
   }
});