$(function() {
  
/*    var bypass = true,
        _loadUrl = Backbone.History.prototype.loadUrl;

    Backbone.History.prototype.loadUrl = function(e) {
        if (bypass) {
            bypass = false;
            return;
        }
        _loadUrl.call(this, e);
    }*/

   //{pushState: true, root: ""});


	Bones.start(); 
	if (!location.hash) {
	    location.hash = '/';
	}
});
