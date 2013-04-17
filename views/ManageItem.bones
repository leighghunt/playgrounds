

var view = Backbone.View.extend({
	//tagName: 'li',
	className: 'manage-item',

events: {
	'click .edit-item': 'editItem',
	'click .remove-item': 'removeItem'
 },
    

	initialize: function(){
		_.bindAll(this, 'render', 'unrender',  'remove', 'editItem', 'removeItem');
		
		this.model.bind('change', this.render);
		this.model.bind('remove', this.unrender);
		
	},

	render: function(){

	var itemStartDate = new Date(this.model.get('startDate'));
	var itemStartMonth = itemStartDate.getMonth()+1;
	var itemEndDate = new Date(this.model.get('endDate'));
	var itemEndMonth = itemEndDate.getMonth()+1;
	
	var html =	"<h3>" + this.model.get('title') + "</h3>" +
	"<div class='meta'>( " + this.model.get('category') + ' ) '+ this.model.get('locationName') + ":  " + itemStartMonth  + "-" + itemStartDate.getDate() + "-" + itemStartDate.getFullYear();
			
			
	
	if (itemStartDate != itemEndDate) {
		html = html + " thru " + + itemEndMonth  + "-" + itemEndDate.getDate() + "-" + itemEndDate.getFullYear();
	}
			
			html = html + "</div>" +"<div class='note'>" + this.model.get('note') + "</div>" +
			"<div class='edit-item' style='cursor:pointer; color:red; font-family:sans-serif;'>[Edit]</div>" + 
			"<div class='remove-item' style='cursor:pointer; color:red; font-family:sans-serif;'>[Remove]</div>";
			
	$(this.el).html(html);

		   return this; 
    },


	
	unrender: function(){
		$(this.el).remove();
	},
	
	removeItem: function(e) {
		var r=confirm("DELETE: '" + this.model.get('title') + "' ?");
		if (r==true)
		{
			this.model.destroy({success: function(model, response) {
			  console.log("The model was destroyed");
			}});
		}
	},
	
	
  editItem: function(e) {
		//var container = $('#target');
		var container = $('#edit-item');
		
		var trigger = $(this);
		//var url = trigger.attr('href');
		
		var target = $('#target');
		target.attr('src',this.model.get('sourceUrl'));
		
		
		var view = new views.ItemEdit( {
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