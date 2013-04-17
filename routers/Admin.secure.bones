router = Backbone.Router.extend({
    routes: {
        
        '/admin': 'rss',
        '/admin/rss': 'rss',
        '/admin/tweets': 'tweets',
        '/admin/items': 'items',
        '/admin/secret': 'secret'

    },
testSecure: function()
{
	if (_.isUndefined(this.req.session) ||
			_.isUndefined(this.req.session.user) ||
			_.isUndefined(this.req.session.user.authenticated) || !this.req.session.user.authenticated)
	{
		throw(new Error('Unauthorized'));
	}
},
secret: function() {
	var options = {};
	options.model = new models.User();
	this.send(views.Secret, options);
 	console.log("Secret Page Loading");
},
rss: function() {
	this.testSecure();
		
 	var router = this,
  fetcher = this.fetcher();
 	var rssFeeds = new models.RssFeeds();
	var rssItems = new models.RssItems();
	
	

  fetcher.push(rssItems);
  fetcher.push(rssFeeds);
  fetcher.fetch(function(err) {
      if (err) return router.error(err);
      var options = {}; 
      options.rssItems = rssItems;
      options.rssFeeds = rssFeeds;
      router.send(views.Rss, options);
  });
	console.log("RSS Page Loading");
},

tweets: function() {
	this.testSecure();
	
 	var router = this,
  fetcher = this.fetcher();
 	var tweets = new models.Tweets();

	
	

  fetcher.push(tweets);
  fetcher.fetch(function(err) {
      if (err) return router.error(err);
      var options = {}; 
      options.collection = tweets;
      router.send(views.Tweets, options);
  });
	console.log("Tweets Page Loading");
},

items: function() {
	this.testSecure();

 	var router = this,
  fetcher = this.fetcher(),
 	items = new models.Items();
	
	

  fetcher.push(items);
  fetcher.fetch(function(err) {
      if (err) return router.error(err);
      var options = {}; 
      options.collection = items;
      router.send(views.ManageItems, options);
  });
	console.log("Manage Items Page Loading");
},



    // Helper to assemble the page title.
    pageTitle: function(view) {
        var title =  'What is Bones?';
        return (view.pageTitle ? view.pageTitle + ' | ' + title : title);
    },

    // The send method is...
    send: function(view) {
        var options = (arguments.length > 1 ? arguments[1] : {});
        var v = new view(options);

        // Populate the #page div with the main view.
        $('#page').empty().append(v.el);

        // TODO explain this!
        v.render().attach().activeLinks().scrollTop();

        // Set the page title.
        document.title = this.pageTitle(v);
    },

    // Generic error handling for our Router.
    error: function(error) {
        this.send(views.Error, _.isArray(error) ? error.shift() : error);
    },

    // Helper to fetch a set of models/collections in parrellel.
    fetcher: function() {
        var models = [];

        return {
            push: function(item) { models.push(item) },
            fetch: function(callback) {
                if (!models.length) return callback();
                var errors = [];
                var _done = _.after(models.length, function() {
                    callback(errors.length ? errors : null);
                });
                _.each(models, function(model) {
                    model.fetch({
                        success: _done,
                        error: function(error) {
                            errors.push(error);
                            _done();
                        }
                    });
                });
            }
        }
    }
});