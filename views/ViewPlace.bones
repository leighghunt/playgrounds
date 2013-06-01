 function parseISO8601(dateStringInRange) {
    var isoExp = /^\s*(\d{4})-(\d\d)-(\d\d)\s*/,
        date = new Date(NaN), month,
        parts = isoExp.exec(dateStringInRange);

    if(parts) {
      month = +parts[2];
      date.setFullYear(parts[1], month - 1, parts[3]);
      if(month != date.getMonth() + 1) {
        date.setTime(NaN);
      }
    }
    return date;
};

function printDate(temp) {

		if ((typeof temp != 'object') && (typeof temp != 'unknown'))
		{
			temp = parseISO8601(temp);
		
		}
   	var dateStr = (temp.getMonth()+1).toString() + '/' +
		              temp.getDate().toString() + '/' +
		              temp.getFullYear().toString();
    return dateStr;
};

var view = Backbone.View.extend({
tagName:  "div",
id: 'item-view',
events: {
	'click #item-close': 'unrender',
	'click input[type="radio"]' : 'handleRatingClick',
	'submit #commentform': 'saveComment'
	},
	initialize: function(){
		_.bindAll(this, 'render', 'unrender');
		$('#item-close').click(this.unrender);

		//this.model.bind('change', this.render);
		//this.model.bind('remove', this.unredner);
	},

	setRating : function(rating) {
        var radio = $('input[name="Place"]').filter('[value="'+rating+'"]');
        if (rating > 0 && rating <= 5) { 
            //need to see if radio is checked. If not, check it. This will
            //be the case if rating was set externally.
            if (!radio.is(':checked'))
                radio.attr('checked', true);
            this._rating = rating;
            this.trigger('ratingChanged',{rating : rating});
        } else {
            console.error('Rating out of range. Rating must be >= 1 and <= 5');
        }
    },
    getRating : function() {
        return this._rating;
    },                
    /**
    * Gets the current target (radio), gets its value
    * then triggers an event to which listeners can respond.
    */
    handleRatingClick : function(e) {
        this.setRating($('input[name="Place"]:checked').val());
    },
    renderComment: function(comment){
    		html = "<div class='comment'><span class='date'>" + printDate(comment.get('date')) + "</span> - <span class='stars'>";
			if (comment.get('rating')) {
				for (var idx=0;idx<comment.get('rating');idx++) {
					html = html+ "<span class='star'>★ </span>";
				};
			}	
			html = html+"</span>";
			html = html+"<p>"+comment.get('comment')+"</p>";
			html = html + "</div>";
			return html;
    },
	render: function(){
	var html = "<div id='item-close' class='close'></div>";
	url = this.model.get('url');
	if (url) {
		html = html + "<h2><a href='"+url+"'>"+this.model.get('name') + "</a><a class='mapPin' href='/map/" + this.model.get('id') +"'><img src='/assets/playgrounds/images/map_pin_alt.png'></a></h2>";
	} else {
		html = html + "<h2 >"+this.model.get('name') + "<a class='mapPin' href='/map/" + this.model.get('id') +"'><img src='/assets/playgrounds/images/map_pin_alt.png'></a></h2>";
	}
	html = html + "<div class='meta'>" + this.model.get('address') + "</div>";
	phone = this.model.get('phone');
	if (phone) {
		html = html + "<div class='meta'>" + phone + "</div>";
	}
	html = html + "<h3>Amenities</h3><ul>";
	prop = this.model.get('prop');
	_.each(prop, function(item) {
		switch(item) {
			case "busstp":
				html = html + "<li>Near Bus Stop</li>";
			break;	
			case "drinkfount":
				html = html + "<li>Drinking Fountain</li>";
			break;
			case "picnic":
				html = html + "<li>Picnic Area</li>";
			break;	
			case "volleyb":
				html = html + "<li>Volleyball Court</li>";
			break;
			case "woodland":
				html = html + "<li>Wooded</li>";
			break;	 
			case "bbcourt":
				html = html + "<li>Basketball Court</li>";
			break;
			case "diamond60":
				html = html + "<li>60' Baseball Diamond</li>";
				break;
			case "diamond90":
				html = html + "<li>90' Baseball Diamond</li>";
			break;
			case "inswim":
				html = html + "<li>Indoor Swimming Pool</li>";
				break;
			case "outswim":
				html = html + "<li>Outdoor Swimming Pool</li>";
			break;
			case "soccerjr":
				html = html + "<li>Junior Soccer Field</li>";
				break;
			case "soccerreg":
				html = html + "<li>Soccer Field</li>";
			break;
			case "tennisct":
				html = html + "<li>Tennis Court</li>";
			break;
			case "plygrd":
				html = html + "<li>6-12y Playground</li>";
			break;
			case "totlot":
				html = html + "<li>2-5y Playground</li>";
			break;
			case "rec":
				html = html + "<li>Recreation Center</li>";
			break;
			case "aquatic":
				html = html + "<li>Aquatic Center</li>";
			break;
			case "kidswim":
				html = html + "<li>Childeren's Swimming Pool</li>";
			break;
		}
	},this);
	html=html+"</ul>";
	
	var comments = this.model.get('comments');
	if (comments) {
		html = html+"<div id='comments'>";
		html = html + "<h3 id='CommentCount'>" + comments.length + " Comments</h3>";
		self = this;
		comments.each(function(comment) {
			html = html + self.renderComment(comment);
		});
		html = html+"</div>";
	}
	html=html+"<form id='commentform'><h3>Leave a Comment</h3>";
	html=html+"<textarea id='comment' rows='4' cols='50'/>";
	html=html+'<div id="rating"><fieldset class="rating">';

        for (var idx=5;idx>0;idx--) {
            html=html+'<input type="radio" id="star' + idx + '" name="Place" value="' + idx + '" />';
        	html=html+'<label for="star'+ idx + '" title="'+ idx + ' Stars"></label>';
        }
       
    html=html+'</fieldset><div>';

	html=html+"<input type='submit' value='Submit'></form>";

	$(this.el).html( html );

	return this;
	},

	saveComment: function() {

		var comment = new models.Comment({'parkId': this.model.get('_id'),'comment': $('#comment').val(), 'rating': this.getRating()});
       // this triggers a RESTFul POST (or PUT) request to the URL specified in the model
       self = this;
       comment.save({},{success: function(model, response, options){
			$('#comments').append(self.renderComment(model));
			$('#comment').val('');
			//$('#CommentCount').html(self.model.get('comments').length + " Comments");
       	}	
   		});
       return false;
   },
	unrender: function(){
		history.back();
		$('#item-border').hide();
		this.trigger('closed');	
		this.close();
		
	},
	onClose: function(){
			
				this.unbind();
	    //this.collection.unbind("reset", this.render);
	  }	


});