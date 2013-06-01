

var view = Backbone.View.extend({
	//tagName: 'li',
	className: 'manage-item',

events: {
	'click .edit-comment': 'editComment',
	'click .remove-comment': 'removeComment'
 },
    

	initialize: function(){
		_.bindAll(this, 'render', 'unrender',  'remove', 'editComment', 'removeComment');
		
		this.model.bind('change', this.render);
		this.model.bind('remove', this.unrender);
		
	},

	render: function(){

	var commentDate = new Date(this.model.get('date'));
	var commentMonth = commentDate.getMonth()+1;
	var itemEndDate = new Date(this.model.get('endDate'));
	var itemEndMonth = itemEndDate.getMonth()+1;
	
	var html =	"<h3>" + this.model.get('name') + "</h3>" +
	"<div class='meta'>" + commentMonth  + "-" + commentDate.getDate() + "-" + commentDate.getFullYear() + "</div>";
			
			

			
			html = html +"<div class='note'>" + this.model.get('comment') + "</div>" +
			"<div class='edit-comment' style='cursor:pointer; color:red; font-family:sans-serif;'>[Edit]</div>" + 
			"<div class='remove-comment' style='cursor:pointer; color:red; font-family:sans-serif;'>[Remove]</div>";
			
	$(this.el).html(html);

		   return this; 
    },


	
	unrender: function(){
		$(this.el).remove();
	},
	
	removeComment: function(e) {
		var r=confirm("DELETE: '" + this.model.get('name') + "' ?");
		if (r==true)
		{
			this.model.destroy({wait: true, success: function(model, response) {
			  console.log("The model was destroyed");
			}});
		}
	},
	
	
  editComment: function(e) {
		//var container = $('#target');
		var container = $('#edit-comment');
		
		var trigger = $(this);
		//var url = trigger.attr('href');
		/*
		var target = $('#target');
		target.attr('src',this.model.get('sourceUrl'));
		*/
		
		var view = new views.EditComment( {
		    model: this.model
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
hidePopup: function(){
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