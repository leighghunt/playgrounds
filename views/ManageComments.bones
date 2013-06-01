view = views.Main.extend({

events: {
	'click .close': 'hidePopup',
	'click #mask': 'hidePopup',
	'click button#more': 'moreComments'
},
    initialize: function(options) {
        _.bindAll(this, 'render', 'hidePopup', 'onClose', 'appendComment', 'moreComments', 'moreCommentsSuccess');
        this.main = new views.Main();
        this.collection.bind('reset', this.render);
        this.collection.bind('destroy', function(model){
        	this.remove(model);
        });
    },
    
    render: function() {
			  	
         $(this.el).html(templates['ManageComments']());
         //html = '<div id="mask"></div><div id="app"><div id="header"><a href="/admin/items">Manage Items</a><a href="/admin/rss">RSS</a><a href="/admin/tweets">Tweets</a></div><div id="filter-items"></div><div id="manage-items"></div><button id="more">More Items</button></div><div id="dialog" class="window"><div id="edit-item"></div><div id="item-display"><iframe id="target"></iframe></div><a href="#" class="close">Close it</a></div>';
        //$(this.el).html(html);
        _(this.collection.models).each(function(comment){
        			this.appendComment(comment);
        		}, this);
 		


        return this;
    
     
     
        
    },
	
	hidePopup: function(e){
		if (e)
		{
			e.preventDefault();
		}
		$('#mask, .window').hide();
	},
	moreCommentsSuccess: function(coll,resp){ 
		
		console.log("Got more Comments!");
		_(resp).each(function(comment){
					this.appendComment(comment);
				}, this);	
		if (resp.length == 20)
		{
			$('#app').append("<button id='more'>More Comments</button>");
		}
	},
	
	moreComments: function(){
		this.collection.fetch({
			add: true,
			//data: {offset: this.collection.options.offset},
			success: this.moreCommentsSuccess
		});
		$('#more').remove();
	},
	appendComment: function(commentObj){
	
	  var commentView = new views.ManageComment({
	      model: commentObj
	    });
		
	   $('#manage-items', this.el).append(commentView.render().el);
	 },
	 
	 onClose: function(){
	     this.collection.unbind("reset", this.render);
	   }
	});





