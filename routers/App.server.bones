// Setup a closure variable whice records the time that the server was started.
// This is used to make sure static resources (css, js) have a different url
// when the code underneath them changes.
var time = Date.now();

/**
 * On the server the send method is overridden to provide the path to actually
 * send rendered pages to the browser. In addition to a rendered page, we also
 * append aJSON versions of any models/collections to the page that were used.
 * to construct it. While duplicative this allow us to easily re-attach those
 * same views back onto the DOM client side.
 */
 
  routers.App.prototype.prepare = function(filter, value, success) {
 	var router = this;
 	var config = new models.Config();
 	if (typeof filter ==='function')
 	{
 		success = filter;
 	}
 
 	
 	config.ready(function(){
 		if (filter && value)
 		{ 
 			config.set({filter: filter, filterValue: value});
 			config.filter(filter, value);
 		}
 		
 			var mapView = new views.Map({ config: config});
 			config.set({mapView: mapView});

 		success(config);
 	});
 },
 
 
 
 routers.App.prototype.map = function() {
 
 	 	var router = this;
 	 	var map =  Bones.plugin.templates.Map(); // pull in template for map 
 		this.res.send(Bones.plugin.templates.App({
 		    version: time,
 		    title: "District Feeds",
 		    main: map,
 		    startup: 'Bones.initialize(function(models, views, routers, templates) {'+
 		    					'Bones.start({pushState: true, root: ""});'+			
 		             '});'
 		}));
 		
 	

 		console.log("Map Page Loading");
 };
 
 routers.App.prototype.about = function() {
 
 var router = this;
  
 	 	
 	
 	var aboutView = new views.About();	
 	aboutView.render();
 	
 	var map =  Bones.plugin.templates.Map({
 				places: aboutView.el.html()
 			});
 
 	router.res.send(Bones.plugin.templates.App({
 	    version: time,
 	    title: 'About',
 	    main: map,
 	    startup: 'Bones.initialize(function(models, views, routers, templates) {'+ "\n" +
 	    					'Bones.start({pushState: true, root: ""});'+ "\n" +
 	    				 '});'
 	}));


 
 
 		/*	var router = this;
 			var map =  Bones.plugin.templates.Map(); // pull in template for map 
 		this.res.send(Bones.plugin.templates.App({
 		    version: time,
 		    title: "District Feeds",
 		    main: map,
 		    startup: 'Bones.initialize(function(models, views, routers, templates) {'+
 		    					'Bones.start({pushState: true, root: ""});'+
 		    			
 		             '});'
 		}));*/
 	 
 		console.log("About Page Loading");
 };
 
 
 routers.App.prototype.list = function(filter, value) {
 
  var router = this;
  this.prepare(filter, value, function(config){
 
 	var listView = new views.ListPlaces({collection: config.get('filtered'), config: config});
  	config.set({currentView: listView});
  	
  	listView.render();
  	
  	var map =  Bones.plugin.templates.Map({
  				items: listView.el.html()
  			});
 
  	router.res.send(Bones.plugin.templates.App({
  	    version: time,
  	    title: 'District Feeds',
  	    main: map,
  	    startup: 'Bones.initialize(function(models, views, routers, templates) {'+ "\n" +
  	    					'Bones.start({pushState: true, root: ""});'+ "\n" +
  	    					'});'
  	}));
 
  });
 
 
 /*			var router = this;
 			var map =  Bones.plugin.templates.Map(); // pull in template for map 
 		this.res.send(Bones.plugin.templates.App({
 		    version: time,
 		    title: "District Feeds",
 		    main: map,
 		    startup: 'Bones.initialize(function(models, views, routers, templates) {'+
 		    					'Bones.start({pushState: true, root: ""});'+
 		    			
 		             '});'
 		}));*/
 		if (filter) {
 			console.log("List Page Loading - Filter: " + filter + " Value: " + value);
 		} else {
 			console.log("List Page Loading");
 		}
 };
 


routers.App.prototype.place = function(id) {

 var router = this;
 this.prepare(function(config){

 
 	//$('#item-border',map).hide();
 	
 	
 	var place = config.get('currentCollection').get(id);
 	
 	if (place != null)
 	{
	 	var placeView = new views.ViewPlace({model: place, config: config});
	 	config.set({currentView: placeView});
	 	placeView.render();
	 	
	 	var map =  Bones.plugin.templates.Map({
	 				place: $(placeView.el).html()
	 			});
			
	 	router.res.send(Bones.plugin.templates.App({
	 	    version: time,
	 	    title:  place.get("name"),
	 	    main: map,
	 	    startup: 'Bones.initialize(function(models, views, routers, templates) {'+ "\n" +
	 	    					'Bones.start({pushState: true, root: ""});'+ "\n" +
	 	    				 '});'
	 	}));
		console.log("Place Page Loading: " + place.get('title'));
	} else {
		router.res.send("<h1>Error loading page</h1>");
		console.log('Error: Place Page load, id - ' + id);
	}
	
 });
 
/*	var router = this;
	var map =  Bones.plugin.templates.Map(); // pull in template for map 
this.res.send(Bones.plugin.templates.App({
    version: time,
    title: "District Feeds",
    main: map,
    startup: 'Bones.initialize(function(models, views, routers, templates) {'+
    					'Bones.start({pushState: true, root: ""});'+
    			
             '});'
}));
*/
 
 		
 }; 
 
routers.App.prototype.send = function(o, config) {
    //var options = arguments.length > 1 ? arguments[1] : {};



    // Provide all models with the data that well be used to prop them back up
    // on the browser.
    
    
    
    _.each(options, function(v, k) {
        // Any options that is a model or collection will have it's title
        // declared. Use this to re-hydrate it.
       if (v.constructor.title != undefined) {
            o += JSON.stringify(k) + ': new models.'+ v.constructor.title +'('+ JSON.stringify(options[k]) + '),';
        } else {
            o += JSON.stringify(k) + ':' + JSON.stringify(options[k]) +',';
        }
    });
    o = o.replace(/,$/, '}');

    // Finally send the page to the client.
    this.res.send(Bones.plugin.templates.App({
        version: time,
        title: this.pageTitle(main),
        main: $(main.el).html(),
        startup: 'Bones.initialize(function(models, views, routers, templates) {'+ "\n" +
        					'Bones.start({pushState: true, root: ""});'+ "\n" +
        					'routers.App.init();' +
                 '});'
    }));
};