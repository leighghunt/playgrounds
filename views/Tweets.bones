//http://icant.co.uk/articles/crossdomain-ajax-with-jquery/error-handling.html


var view = views.Main.extend({
	//el: $('#tweets'),
	id: 'tweets',
	events: {
		'click button#more': 'moreTweets'
			
	},
	
	initialize: function(){
		_.bindAll(this, 'render', 'appendTweet', 'newItem', 'moreTweets', 'moreTweetsSuccess');
		//this.collection = new models.Tweets([],{page: 0, search: 0, offset: 0});
		
		this.collection.bind('reset', this.render);
		this.main = new views.Main();
		
	},
	
	render: function(){
		//this.el = '<html></html>';
		//this.el = templates['Home']();		
		//console.log($(this.el));
		$(this.el).html(templates['Tweets']());
		
		//$('body',this.el).html("<button id='add'>Add list item</button><ul></ul>");
		_(this.collection.models).each(function(tweet){
					this.appendTweet(tweet);
				}, this);

		console.log("Rendering Tweet List");
		return this;



		//console.log(this.el);
	},

	
	moreTweetsSuccess: function(coll,resp){ 
		
		console.log("Got more tweets!");
		_(resp).each(function(tweet){
					this.appendTweet(tweet);
				}, this);	
		
			$('#app').append("<button id='more'>More Tweets</button>");
		
	},
	
	moreTweets: function(){
		this.collection.fetch({
			add: true,
			data: {page: this.collection.options.page},
			success: this.moreTweetsSuccess
		});
		$('#more').remove();
	},
	
 
	
	appendTweet: function(tweetObj){
		var tweet = new models.Tweet(tweetObj);
	  var tweetView = new views.Tweet({
        model: tweet
      });
		
	
     $('#tweet-list', this.el).append(tweetView.render().el);
   }
  });