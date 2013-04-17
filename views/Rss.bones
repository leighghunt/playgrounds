view = views.Main.extend({
rssItemsView: null,
events: {
	

	'click .close': 'hidePopup',
	'click #mask': 'hidePopup',
	'click .filter-feed': 'filterFeed'
},
    initialize: function(options) {
        _.bindAll(this, 'render', 'triggerPost', 'hidePopup',  'filterFeed');
        this.main = new views.Main();
    },
    
    render: function() {
			  	 if (Bones.server) { 
			  	 	console.log("running this on the server"); 
			  	 } else {
			  		console.log('client side is running');
			  	}
  
  
         $(this.el).html(templates['Rss']());
         this.rssItemsView = new views.RssItems({el: $('#rss-items', this.el), collection: this.options.rssItems});
         var rssFeedsView = new views.RssFeeds({el: $('#rss-feeds', this.el), collection: this.options.rssFeeds});		

				

 				this.rssItemsView.render();
 				rssFeedsView.render();
 			

        return this;
    
     
     
        
    },

  
    	
	filterFeed: function(e) {
		this.rssItemsView.filter('feedName', e.target.innerText);
		e.preventDefault();
	},
	
	hidePopup: function(e){
		if (e)
		{
			e.preventDefault();
		}
		$('#mask, .window').hide();
	},
	triggerPost: function(tweet) {
		this.options.listView.trigger('post', tweet);
	}

	
});


