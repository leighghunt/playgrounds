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
		var test = typeof temp;
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
/*events: {
	
	'click .view-item': 'selectItem'
	},*/
	tagName: "div",

  className: "list-item",
	initialize: function(){
		_.bindAll(this, 'render', 'unrender',  'remove', 'selectItem');

		//this.model.bind('change', this.render);
		//this.model.bind('remove', this.unredner);
	},
	render: function(){
	var html = "<div class='title' ><a href='/place/"+this.model.get('id')+"' >"+this.model.get('name') + "</a></div>";
	html = html + "<div class='address'><a class='mapPin' href='/map/" + this.model.get('id') +"'><img class='map_pin_small' src='/assets/playgrounds/images/map_pin_alt_small.png'>" +  this.model.get('address') + "</a></div>";
	html = html + "<div class='activities'>";
	prop = this.model.get('prop');
	var activities = new Array();
	_.each(prop, function(item) {
		switch(item) {
			case "bbcourt":
					activities['bbcourt'] = "<img src='/assets/playgrounds/images/icons/basketball.png' alt='Basketball Court'>";
				//html = html + "<img src='/assets/playgrounds/images/icons/basketball.png'>";
			break;
			case "diamond60":
			case "diamond90":
				activities['diamond'] = "<img src='/assets/playgrounds/images/icons/baseball.png' alt='Baseball Diamond'>";
				//html = html + "<img src='/assets/playgrounds/images/icons/baseball.png'>";
			break;
			case "kidswim":
			case "inswim":
			case "outswim":
				activities['swim'] = "<img src='/assets/playgrounds/images/icons/swimming.png' alt='Swimming Pool'>";
				//html = html + "<img src='/assets/playgrounds/images/icons/swimming.png'>";
			break;
			case "soccerjr":
			case "soccerreg":
				activities['soccer'] = "<img src='/assets/playgrounds/images/icons/soccer.png' alt='Soccer Field'>";
				//html = html + "<img src='/assets/playgrounds/images/icons/soccer.png'>";
			break;
			case "tennisct":
				activities['tennis'] = "<img src='/assets/playgrounds/images/icons/tennis.png' alt='Tennis Court'>";
				//html = html + "<img src='/assets/playgrounds/images/icons/tennis.png'>";
			break;
			case "plygrd":
			case "totlot":
				activities['plygrd'] = "<img src='/assets/playgrounds/images/icons/playground.png' alt='Playground'>";
				//html = html + "<img src='/assets/playgrounds/images/icons/playground.png'>";
			break;
		}
	},this);
	
	for (var activity in activities) {
		html = html + activities[activity];
	
	}
	_.each(activities, function(item) { html = html + item }, this);
	//keys = ["bbcourt","busstp", "fbfield", "diamond60", "diamond90", "drinkfount", "inswim", "outswim", "picnic", "plygrd", "skatepark", "soccerjr", "soccerreg", "spraypark", "tennisct", "totlot", "volleyb", "woodland"];
						  
	html = html + "</div>";

	$(this.el).html( html);
			return this;
	},
	selectItem: function(){
		this.trigger('select', this.model);
	},
	unrender: function(){
		$(this.el).remove();
	},
	
	remove: function(){
		this.model.destroy();
	}

});