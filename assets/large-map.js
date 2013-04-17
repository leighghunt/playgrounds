var markerClip;

function initMap() {
	
	//http://localhost:8888/1.0.0/dc-new-light/{z}/{x}/{y}.png
	var tilejson = {
	  tilejson: '1.0.0',
	  scheme: 'tms',
	tiles: ['http://tiles-a.cookography.com/v2/dc_base/{z}/{x}/{y}.png',
				'http://tiles-b.cookography.com/v2/dc_base/{z}/{x}/{y}.png',
				'http://tiles-c.cookography.com/v2/dc_base/{z}/{x}/{y}.png',
				'http://tiles-d.cookography.com/v2/dc_base/{z}/{x}/{y}.png']
	};
	
	
	var mm = com.modestmaps;
	var base = new mm.Map('map',
	  new wax.mm.connector(tilejson),
		null,
    [new mm.MouseHandler(), new mm.TouchHandler()]);
base.setCenterZoom(new mm.Location(38.8991, -77.0234), 13);
	
	wax.mm.zoomer(base, tilejson).appendTo(base.parent);

    window.onresize = function() {
   //     base.setSize(container.offsetWidth, container.offsetHeight);
   //     overlay.setSize(container.offsetWidth, container.offsetHeight);
    };
    	
    
    	
    	markerClip = new MarkerClip(base);
       
         
}

function MarkerClip(map) {

    this.map = map;
		this.tooltip = new wax.tooltip();
    var theClip = this;

    var markerDiv = document.createElement('div');
    markerDiv.id = map.parent.id + '-markerClip-' + new Date().getTime();
    markerDiv.style.margin = '0';
    markerDiv.style.padding = '0';
    markerDiv.style.position = 'absolute';
    markerDiv.style.top = '0px';
    markerDiv.style.left = '0px';
    markerDiv.style.width = map.dimensions.x+'px';
    markerDiv.style.height = map.dimensions.y+'px';        
    map.parent.appendChild(markerDiv);    
    
    function onMapChange() {
        theClip.updateMarkers();    
    }
		
		function onMarkerClick(e) {
			theClip.tooltip.click("test " + e.title, theClip.map.parent, e);
		};
		
		function onMarkerOver(event) {
			theClip.tooltip.over("Short " + e.title, theClip.map.parent);
		};
		
		function onMarkerOut(e) {
			theClip.tooltip.out( theClip.map.parent);
		};


    map.addCallback('panned', onMapChange);
    map.addCallback('zoomed', onMapChange);
    map.addCallback('centered', onMapChange);
    map.addCallback('extentset', onMapChange);

    map.addCallback('resized', function() {
        markerDiv.style.width = map.dimensions.x+'px';
        markerDiv.style.height = map.dimensions.y+'px';        
        theClip.updateMarkers();
    });

    this.updateMarkers = function() {
        for (var i = 0; i < this.markers.length; i++) {
            this.updateMarkerAt(i);
        }
    };
    
    this.markers = [];
    this.markerLocations = [];
    this.markerOffsets = [];
    
    this.addMarker = function(element, location, offset) {
        element.style.position = 'absolute';
        if (!offset) {
            offset = new com.modestmaps.Point(element.offsetWidth/2, element.offsetHeight/2);
        }
        markerDiv.appendChild(element);
        this.markers.push(element);
        this.markerLocations.push(location);
        this.markerOffsets.push(offset);
        this.updateMarkerAt(this.markers.length-1);
    };
    
    this.updateMarkerAt = function(index) {
        var point = map.locationPoint(this.markerLocations[index]),
            offset = this.markerOffsets[index],
            element = this.markers[index];
        element.style.left = (point.x - offset.x) + 'px';
        element.style.top = (point.y - offset.y) + 'px';    
    };

    var createdMarkerCount = 0;
	

    this.createDefaultMarker = function() {
        var marker = document.createElement('div');
        marker.id = map.parent.id+'-marker-'+createdMarkerCount;
        createdMarkerCount++;
        marker.style.width = '10px';
        marker.style.height = '10px';
        marker.style.margin = '0';
        marker.style.padding = '0';
        marker.style.backgroundColor = '#ffffff';
        marker.style.borderWidth = '2px';
        marker.style.borderColor = 'black';
        marker.style.borderStyle = 'solid';
        marker.style.MozBorderRadius = '10px';
        marker.style.borderRadius = '10px';
        marker.style.WebkitBorderRadius = '10px';
        marker.onclick = onMarkerClick;
        marker.onmouseover = onMarkerOver;
        marker.onmouseout = onMarkerOut;
        return marker;
    };

}



