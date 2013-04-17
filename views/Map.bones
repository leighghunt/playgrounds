// App
// ---
// View representing the entire app viewport. The view that should "fill" the
// viewport should be passed as `options.view`. When the View's element has
// been successfully added to the DOM a `ready` event will be triggered on that
// view.


view = views.Main.extend({
           defaultStyle: {
            color: "#2262CC",
            weight: 2,
            opacity: 0.6,
            fillOpacity: 0.1,
            fillColor: "#2262CC"
        },
        minimalStyle: {
            color: "#CCCCCC",
            weight: 2,
            opacity: 0.6,
            fillOpacity: 0.1,
            fillColor: "#CCCCCC"
        },
        highlightStyle: {
            color: '#2262CC', 
            weight: 3,
            opacity: 0.6,
            fillOpacity: 0.65,
            fillColor: '#2262CC'
        },
initMap: function() {
 

this.geojson = { "type": "FeatureCollection",
                "features": [] };
this.mapStuff = L.map('map', {
    center: [38.958643, -77.021242  ],
    zoom: 13
});
L.tileLayer('http://tiles-a.cookography.com/v2/dc_base/{z}/{x}/{y}.png',{}).addTo(this.mapStuff);

},


events: {
	'change #filter-category': 'changeFilterCategory'
},






    initialize: function(options) {
        _.bindAll(this, 'render', 'renderItems', 'appendItem', 'hidePopup', 'changeFilterCategory');
    	
    		this.config = options.config;    
    		this.main = new views.Main();
      
      	$('#filter-category').change(this.changeFilterCategory);
    },
    render: function(collection) {


				if (typeof collection != 'undefined')
				{
					this.collection = collection;
				}
				
				if (typeof this.config != 'undefined')
				{
					this.clearLayers();
					this.renderItems();
				}

				 	$('#item-border').hide();
				 	$('#items-border').hide();
				 	 
				 	$('.open-map').addClass('active');
				 			
				
		  
      return this;
    },
    
		
		
		selectFilterCategory: function(value) {
		
			$('#filter-category').val(value);
		
		},
		changeFilterCategory: function() {
			var catFilter = $('#filter-category').val();
			var pathArray = window.location.pathname.split( '/' );
			if (pathArray[1].length > 0)
			{
				var url = '/' + pathArray[1]; 
				
			}
			else {
				var url = '/map';
			}
			
				if (catFilter !='All')
				{
					url = url + '/category/' + catFilter;
						
				}
			Backbone.history.navigate(url, true);
			
		},
    openMapItem: function(e, id) {
    	
    		var url = '/item/' + id; 
    		
    		Backbone.history.navigate(url, true);
    },
	 renderItems: function(){
	 	
	 	
	 	this.collection.each(function(item){
	 		this.appendItem(item);
	 	}, this);	
        var geojsonMarkerOptions = {
            radius: 5,
            fillColor: "#ff7800",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };
        var myStyle = {
            "color": "#ff7800",
            "weight": 1,
            "opacity": 0.65
        };
        var onEachFeature = function(feature, layer) {
            // Load the default style. 
            //layer.setStyle(this.defaultStyle);
            // Create a self-invoking function that passes in the layer
            // and the properties associated with this particular record.
            (function(layer, properties) {
              // Create a mouseover event
              layer.on("mouseover", function (e) {
                // Change the style to the highlighted version
                //layer.setStyle(this.highlightStyle);
                // Create a popup with a unique ID linked to this record
                var popup = $("<div></div>", {
                    id: "popup-" + properties.id,
                    css: {
                        position: "absolute",
                        bottom: "85px",
                        left: "50px",
                        zIndex: 1002,
                        backgroundColor: "white",
                        padding: "8px",
                        border: "1px solid #ccc"
                    }
                });
                // Insert a headline into that popup
                var hed = $("<div></div>", {
                    text: properties.name,
                    css: {fontSize: "16px", marginBottom: "3px"}
                }).appendTo(popup);
                // Add the popup to the map
                popup.appendTo("#map");
              });
              // Create a mouseout event that undoes the mouseover changes
              layer.on("mouseout", function (e) {
                // Start by reverting the style back
                //layer.setStyle(this.defaultStyle); 
                // And then destroying the popup
                $("#popup-" + properties.id).remove();
              });
              layer.on('click', function(e){
                    var url = '/place/' + properties.id; 
                    
                    Backbone.history.navigate(url, true);
                });
              // Close the "anonymous" wrapper function, and call it while passing
              // in the variables necessary to make the events work the way we want.
            })(layer, feature.properties);
        };
        var featureLayer = L.geoJson(this.geojson, {
            // And link up the function to run when loading each feature
            onEachFeature: onEachFeature,
            pointToLayer: function (feature, latlng) {
                return L.circle(latlng, 5, geojsonMarkerOptions);
            },
            style: myStyle
        });
        // Finally, add the layer to the map.
        this.mapStuff.addLayer(featureLayer);
        this.layer = featureLayer;
	 },
	clearLayers: function() {
        if (this.layer){
            this.mapStuff.removeLayer(this.layer);
            this.layer="";
        }
        this.geojson = { "type": "FeatureCollection",
                "features": [] };
        /*while (layer=this.layers.pop()){
            this.mapStuff.removeLayer(layer);
        }*/
    }, 

	appendItem: function(item){

        var loc = item.get('loc');
        var linePts = [];
        var geo = { "type": "Feature",
                properties: {name: item.get('name'), id: item.get('_id')},
                geometry: item.get('loc')
         };
        this.geojson.features.push(geo);
/*
        // a FOR loop operates on each item in a list
        if (loc.type == "Polygon") {
            for( i=0; i < loc.coordinates.length; i++ ) {
                // turn this coordinate into a LatLng
              linePts[ i ] = new L.LatLng( loc.coordinates[ i ][ 1 ], loc.coordinates[ i ][ 0 ] );
            } 
        

  
        

        var polygon = L.polygon(linePts);
        this.layers.push(polygon);
 
        if (item.get("prop").length ==0 ) {
            polygon.setStyle(this.minimalStyle);
        } else {
            polygon.setStyle(this.defaultStyle);
        }

        
        polygon.on("mouseover", function (e) {
        // Change the style to the highlighted version
        polygon.setStyle(this.highlightStyle);
        // Create a popup with a unique ID linked to this record
        var popup = $("<div></div>", {
            id: "popup-" + item.get('id'),
            css: {
                position: "absolute",
                bottom: "85px",
                left: "50px",
                zIndex: 1002,
                backgroundColor: "white",
                padding: "8px",
                border: "1px solid #ccc"
            }
        });
        // Insert a headline into that popup
        var hed = $("<div></div>", {
            text: item.get('name') + ": " + item.get('address'),
            css: {fontSize: "16px", marginBottom: "3px"}
        }).appendTo(popup);
        // Add the popup to the map
        popup.appendTo("#map");
      });
      // Create a mouseout event that undoes the mouseover changes
      polygon.on("mouseout", function (e) {
        // Start by reverting the style back
        polygon.setStyle(this.defaultStyle); 
        // And then destroying the popup
        $("#popup-" + item.get('id')).remove();
      });
        polygon.on('click', function(e){
            var url = '/place/' + item.get('id'); 
            
            Backbone.history.navigate(url, true);
 
        });
        polygon.addTo(this.mapStuff);
    } else {
        L.circle([loc.coordinates[ 1 ], loc.coordinates[ 0 ]],10).addTo(this.mapStuff);
    } 
*/


	 },
	 
	onClose: function(){
			markerClip.clearMarkers();
	  },
	  
hidePopup: function(e){
	if (e)
	{
		e.preventDefault();
	}
	$('#mask, .window').hide();
}
});