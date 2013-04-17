//http://icant.co.uk/articles/crossdomain-ajax-with-jquery/error-handling.html


var view = Backbone.View.extend({
	id: 'rss-feeds',
	events: {
		'click span.add': 'addRssFeed'
	},
	
	initialize: function(){
		_.bindAll(this, 'render', 'appendRssFeed','addRssFeed', 'addRssFeedSuccess', 'renderRssFeeds');
		//this.collection = new models.RssFeeds([],{});
		
		this.collection.bind('reset', this.renderRssFeeds);
		
	},
	
	render: function(){
		$(this.el).html("Url: <input type='text' id='feed-url' /><br/><span class='add' style='cursor:pointer; color:red; font-family:sans-serif;'>[Add Feed]</span><div id='rss-feed-list'></div>");
		this.renderRssFeeds();
		return this;
	},
	renderRssFeeds: function(){
		$('#rss-feed-list').html('');	
		_(this.collection.models).each(function(rssFeedJson){
			this.appendRssFeed(rssFeedJson);
		}, this);
	},
	
addRssFeedSuccess: function(model, response){
	this.collection.fetch();
	$('#feed-url').val('');
},

addRssFeed: function(){
	var rssFeed = new models.RssFeed({
		url: $('#feed-url').val()
	});
	rssFeed.save({},{
		error: function(model, response){
		},
		success: this.addRssFeedSuccess
	});	
},
appendRssFeed: function(rssFeedJson){
		var rssFeedModel = new models.RssFeed(rssFeedJson);
	  var rssFeedView = new views.RssFeed({
        model: rssFeedModel
      });

     $('#rss-feed-list').append(rssFeedView.render().el);
   }
  });