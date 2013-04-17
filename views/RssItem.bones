

var view = Backbone.View.extend({
	//tagName: 'li',
	className: 'rss-item',

events: {
	'click .expand-content': 'expandContent',
	'click .item-add': 'addItem',
	'click .item-heart': 'changeItemHeart',
	'click .item-read': 'changeItemRead'	
 },
    

	initialize: function(){
		_.bindAll(this, 'render', 'unrender',  'remove', 'post', 'expandContent', 'expandContentSuccess', 'addItem', 'changeItemHeart', 'changeItemRead');
		
		this.model.bind('change', this.render);
		this.model.bind('remove', this.unredner);
	},

	render: function(){

	var itemDate = new Date(this.model.get('date'));
	var itemMonth = itemDate.getMonth()+1;

	
	var html = "<h3><a href='" + this.model.get('url') + "' class='expand-content'>" + this.model.get('title') + "</a></h3>" +
			"<div class='meta'>" + this.model.get('feedName');
			if (this.model.get("items"))
			{
				console.log(this.model.get("items").length);
				html = html + " "  +this.model.get("items").length;
			}	
				html = html + " - " + itemMonth  + "-" + itemDate.getDate() + "-" + itemDate.getFullYear() +"</div>" +
			"<div class='item-actions'><div class='item-add'></div>" +
			"<div class='item-heart'></div><div class='item-read'></div></div>";
		
		

			$(this.el).html(html);
			
			if (this.model.get('read'))
			{
				$('.item-read', this.el).addClass('read');
			}
			else
			{
				$('.item-read', this.el).addClass('unread');
			}
			if (this.model.get('heart'))
			{
				$('.item-heart', this.el).addClass('heart');
			}
			else
			{
				$('.item-heart', this.el).addClass('no-heart');
			}
		   return this; 
    },

	post: function(){
		/*this.trigger("post", this.model);
		this.unrender();*/
		
	},
	
	unrender: function(){
		$(this.el).remove();
	},
	changeItemRead: function(e) {
		if (this.model.get('read'))
		{
			this.model.set({read: false});
		} else {
			this.model.set({read: true});
			//this.trigger('read', this.model);
		}
		this.model.save();
	},
	changeItemHeart: function(e) {
		if (this.model.get('heart'))
		{
			this.model.set({heart: false});
		} else {
			this.model.set({heart: true});
		}
		this.model.save();
	},
  addItem: function(e) {
		//var container = $('#target');
		var container = $('#create-item');
		
		var trigger = $(this);
		//var url = trigger.attr('href');
		
		var target = $('#target');
		target.attr('src',this.model.get('url'));
		var today = new Date();
		var itemModel = new models.Item({
			title: this.model.get('title'),
			source: this.model.get('feedName'),
			sourceUrl: this.model.get('url'),
			sourceType: "RSS",
			dateType: "single",
			created: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
			startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate())
		});
		var view = new views.ItemEdit( {
		    model: itemModel,
		    rssItem: this.model
		  }); 
		view.bind('save', this.hidePopup);
		container.html(view.render().el);
		
		e.preventDefault();
		//Get the A tag
		
		//Get the screen height and width
		var maskHeight = $(document).height();
		var maskWidth = $(window).width();
		
		//Set height and width to mask to fill up the whole screen
		$('#mask').css({'width':maskWidth,'height':maskHeight});
		 
		//transition effect     
		$('#mask').fadeIn(100);    
		
		//Get the window height and width
		var winH = $(window).height();
		var winW = $(window).width();
		       
		//Set the popup window to center
		$('#dialog').css('width', winW-100);
		$('#dialog').css('height', winH-100);
		
		$('#dialog').css('top',  winH/2-$('#dialog').height()/2 + window.scrollY);
		$('#dialog').css('left', winW/2-$('#dialog').width()/2);
		
		//transition effect
		$('#dialog').fadeIn(100); 
		return false;
  },

	expandContentSuccess: function(model,resp){ 
		console.log("Expanded RssItem!");
		$('a', this.el).removeClass('expand-content');
		$(this.el).append('<div class="content">'+model.get('content')+'</div>');
	},
	
	expandContent: function(e){
		/*var rssItem = new models.RssItem();
		rssItem.set({
			id: this.model.get('oid')								
		});
		rssItem*/
		
		this.model.fetch({
			success: this.expandContentSuccess
		});
		e.preventDefault();
		return false;
	},
	hidePopup: function(e){
		$('#mask, .window').hide();
	},
/*	wheel: function(e) {
	  preventDefault(e);
	},
	
	disable_scroll: function() {
	  if (window.addEventListener) {
	      window.addEventListener('DOMMouseScroll', wheel, false);
	  }
	  window.onmousewheel = document.onmousewheel = wheel;
	},
	
	enable_scroll: function() {
	    if (window.removeEventListener) {
	        window.removeEventListener('DOMMouseScroll', wheel, false);
	    }
	    window.onmousewheel = document.onmousewheel = document.onkeydown = null;  
	},*/
	
	remove: function(){
		this.model.destroy();
	}
});