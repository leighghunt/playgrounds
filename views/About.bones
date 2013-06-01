var view = Backbone.View.extend({

initialize: function(){
	_.bindAll(this, 'render');
	//this.collection.bind('reset', this.render);	
},
render: function(){
		
		var html = "<div id='about'><p>Washington, DC has lots of great parks and playgrounds. The problem is that they are tough to discover.";
		html = html + " I put this site together to help with that. It makes it easy to search for different features, like playgrounds and pools.</p>";
		html = html + "<p>You are also able to rate the parks and leave comments. This will make it easier to figure out whether a playground is awesome or run down<./p>";
		html = html + "<p>I didn't pay much attention to the playgrounds in DC, but now that we have kids I am also trying to scout out fun new ones. There isn't a list of playgrounds and that lead me to put this website together. If you have ideas, suggestions or corrections, send me an email.</p>";
		html = html + "<p>This data comes from the DC Parks & Recreations GIS Data Sets.</p>";
		html = html + "<p> - Luke <br> <a href='mailto://luke@lukeberndt.com'>luke@lukeberndt.com</a></p></div>";  
		
		$(this.el).html(html);
	

		return this;



	},


 
 onClose: function(){
 			this.unbind();
     //this.collection.unbind("reset", this.render);
   }
});