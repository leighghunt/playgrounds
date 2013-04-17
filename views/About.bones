var view = Backbone.View.extend({

initialize: function(){
	_.bindAll(this, 'render');
	//this.collection.bind('reset', this.render);	
},
render: function(){
		
		var html = "<div id='about'><p>There is so much food stuff happening in DC. It is tough to keep up with what is happening when and where.";
		html = html + " I put this site together to help with that. It keeps track of the latest food news and happenings, plots them on a map and adds them to a calendar.</p>";
		html = html + "<p>There are already lots of covering, that is half the problem. Instead of adding to the noise, and doing difficult things like creating original content, I simply mooch off the hard work other are already doing. That said, if you have any tips or news, send them my way and I will add them.</p>";
		html = html + "<p>Right now I am stalking: <a href='http://www.princeofpetworth.com/'>Prince of Petworth</a> - <a href='http://www.washingtonpost.com/blogs/going-out-gurus'>Going Out Gurus</a> - <a href='http://www.washingtoncitypaper.com/blogs/youngandhungry/'>Young & Hungry</a> - <a href='http://metrocurean.com/'>Metrocurean</a> - <a href='http://www.borderstan.com/food-and-drink/'>Borderstan</a></p>";
		html = html + "<p>Let me know if you would like on or off this illustrious, or have suggestions of new blogs to follow</p>";
		html = html + "<p> - Luke <br> <a href='mailto://luke@districtfeeds.com'>luke@districtfeeds.com</a></p></div>";  
		
		$(this.el).html(html);
	

		return this;



	},


 
 onClose: function(){
 			this.unbind();
     //this.collection.unbind("reset", this.render);
   }
});