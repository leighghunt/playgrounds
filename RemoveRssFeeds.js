var sys = require('util'),
couchdb = require('felix-couchdb'),
client = couchdb.createClient(5984, 'localhost'),
db = client.db('rss');


function DeleteFeeds(er, doc){
var i,len;
    if (er) {
     console.log(JSON.stringify(er));
    }
    else {
    
    
	    len = doc.rows.length;
	    //for (i=0; i < len; i++)
	    {
	    	sys.p(doc.rows[0].value);
	    	db.removeDoc(doc.rows[0].value._id,doc.rows[0].value._rev, function() { console.log("Deleted");});
    	}
    }
}

db.view('select', 'type', {key: 'feed'},DeleteFeeds);
