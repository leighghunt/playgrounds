

var view = Backbone.View.extend({
	//tagName: 'li',
	className: 'tweet',
	events: {
		'click div.save-tweet': 'addItem',
		'click .window': 'hidePopup',
		'click .close': 'hidePopup'
	},



    

	initialize: function(){
		_.bindAll(this, 'render', 'unrender',  'remove', 'addItem', 'hidePopup');

		this.model.bind('change', this.render);
		this.model.bind('remove', this.unredner);
	},

	render: function(){
	$(this.el).html(
			"<div class='profile-picture'><img src='" + this.model.get('profile_image_url') + "'></div> " + "<div class='text'><div class='user'><span class='screen-name'>" + this.model.get('screen_name') + "</span><span class='user-name'>" + this.model.get('name') + "</span></div><div class='message'>"+this.model.get('text') + "</div></div><div class='save-tweet' style='cursor:pointer; color:red; font-family:sans-serif;'>[Save]</div>");
		var urls = this.model.get('urls');	
		var urlLen = urls.length;
		for (var j=0; j < urlLen; j++)
		{	
			$(this.el).append('<a href="' + urls[j] + '" class="load-url">' + urls[j] + '</a>');
		}	
		$('.load-url', this.el).click(function(e){	
				var container = $('#target');
			  var trigger = $(this);
		    var url = trigger.attr('href');
		    container.attr('src',url);
		   
		   
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
		});
		   return this; // for chainable calls, like .render().el
    },

addItem: function(e) {
	//var container = $('#target');
	var container = $('#create-item');
	
	var trigger = $(this);
	//var url = trigger.attr('href');
	
	var target = $('#target');
	target.attr('src',this.model.get('url'));
	
	var itemModel = new models.Item({
		title: this.model.get('title'),
		source: this.model.get('screen_name'),
		sourceImage: this.model.get('profile_image_url'),
		sourceUrl: this.model.get('url'),
		sourceType: "Twitter"
	});
	var view = new views.ItemEdit( {
	    model: itemModel,
	    twitterItem: this.model
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



	unrender: function(){
		$(this.el).remove();
	},
	
	hidePopup: function(e){
		e.preventDefault();
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