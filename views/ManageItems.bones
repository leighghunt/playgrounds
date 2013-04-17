view = views.Main.extend({

events: {
	'click .close': 'hidePopup',
	'click #mask': 'hidePopup',
	'click button#more': 'moreItems'
},
    initialize: function(options) {
        _.bindAll(this, 'render', 'hidePopup', 'onClose', 'appendItem', 'moreItems', 'moreItemsSuccess');
        this.main = new views.Main();
        this.collection.bind('reset', this.render);
        this.collection.bind('destroy', function(model){
        	this.remove(model);
        });
    },
    
    render: function() {
			  	
         $(this.el).html(templates['ManageItems']());
        
        _(this.collection.models).each(function(item){
        			this.appendItem(item);
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
	moreItemsSuccess: function(coll,resp){ 
		
		console.log("Got more item!");
		_(resp).each(function(item){
					this.appendItem(item);
				}, this);	
		if (resp.length == 20)
		{
			$('#app').append("<button id='more'>More Items</button>");
		}
	},
	
	moreItems: function(){
		this.collection.fetch({
			add: true,
			data: {offset: this.collection.options.offset},
			success: this.moreItemsSuccess
		});
		$('#more').remove();
	},
	appendItem: function(itemObj){
	
	  var itemView = new views.ManageItem({
	      model: itemObj
	    });
		
	   $('#manage-items', this.el).append(itemView.render().el);
	 },
	 
	 onClose: function(){
	     this.collection.unbind("reset", this.render);
	   }
	});





