//http://icant.co.uk/articles/crossdomain-ajax-with-jquery/error-handling.html


var view = Backbone.View.extend({

	events: {
		'click button#more': 'moreRssItems',
		'click .filter-item-heart': 'filterHeart',
		'click .filter-item-unread': 'filterUnread',
		'click .filter-all': 'filterAll'
	},
	id: 'rss-items',
	unreadItems: [],
	initialize: function(){
		//var unreadItems = new Array();
		_.bindAll(this, 'render', 'appendRssItem', 'postRssItem', 'moreRssItems', 'moreRssItemsSuccess', 'renderRssItems', 'checkUnreadItems', 'filterHeart', 'filterUnread', 'filterAll', 'filter');
		//this.collection = new models.RssItems([],{url: 'http://www.cookography.com/feed/', offset: 0});
		if (!Bones.server){
		$(window).bind('scroll', this.checkUnreadItems);
		}
		this.collection.bind('reset', this.render);

	},
	
	
	
	render: function(){
		$(this.el).html("<div id='item-filters'>Filter: " +
		"<div class='filter-item-heart'></div><div class='filter-item-unread'></div><div class='filter-all'></div>"+
		"</div><div id='rss-item-list'></div><button id='more'>More Items</button>");

		this.renderRssItems();

		return this;
	},

	checkUnreadItems: function(){

		var scrollTop = $(window).scrollTop();
		while (this.unreadItems.length)
		{
			var item = this.unreadItems[0];
			
			if (scrollTop > (item.el.offsetTop+item.el.offsetHeight))
			{
				/*if (!item.model.get('read'))
				{*/
					item.model.set({read: true});
					item.model.save();
				//}
				this.unreadItems.shift();
				//$('.rss-item', item.el).removeClass('unread');
			}
			else {
				break;
			}
		}
	},
	renderRssItems: function(){
		_(this.collection.models).each(function(rssItem){
			this.appendRssItem(rssItem);
		}, this);	
	},

filterAll: function() {
	this.filter('all');
},	
filterHeart: function() {
	this.filter('heart');
},
filterUnread: function() {
	this.filter('unread');
},
	
filter: function(filter, value) {
	this.collection.options.offset = 0;
	this.collection.fetch({
		data: {filter: filter, value: value}
	});
	
},
	
	moreRssItemsSuccess: function(coll,resp){ 
		//this.collection.options.offset = this.collection.options.offset + resp.length;
		console.log("Got more RssItems!");
		_(resp).each(function(rssItem){
					this.appendRssItem(rssItem);
				}, this);	
	},
	
	moreRssItems: function(){
		this.collection.fetch({
			add: true,
			data: {url: this.collection.options.url, offset: this.collection.options.offset},
			success: this.moreRssItemsSuccess
		});
	},
	
	postRssItem: function(rssItem){
			this.trigger('post', rssItem);
	},
	
	appendRssItem: function(rssItemJson){
		var rssItemModel = new models.RssItem(rssItemJson);
	  var rssItemView = new views.RssItem({
        model: rssItemModel
      });
		rssItemView.bind('post', this.postRssItem);
		rssItemView.render();
		if (!rssItemModel.get('read'))
		{
			//$('div',rssItemView.el).addClass('unread');
			this.unreadItems.push({el:rssItemView.el, model: rssItemModel});
		}
     $('#rss-item-list').append(rssItemView.el);

   }
  });