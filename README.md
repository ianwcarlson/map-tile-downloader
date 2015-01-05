# map-tile-downloader

NodeJS module that calculates a square area and downloads all the map tiles contained in that area at the specified zoom levels.  The tiles can then be served up locally with a simple static file web server and a client-side map engine like [Leaflet](http://leafletjs.com/). Eventually I'd like to provide a basic map server here.

Note when using Mapbox, you need to create an account and a new project and then fill in the properties accordingly.

Example usage:
```
var options = {
	baseUrl: 'http://api.tiles.mapbox.com/v4/<your username>.<map project ID>',
	rootDir: 'mapbox/',
	mapSourceSuffix: '.jpg90?access_token=<API access token>',
	inputCoordinates: {
		lat: 33.0,
		lng: -106.0,
		sqKms: 0.1
	},
	xBeforeY: true
};

var mapDownloader = require('./map-tile-downloader.js')(options);
mapDownloader.run(function(err){
	console.log(err);
	process.exit();
});
```

This module really only supports servers that comply with the TMS (Tile Map Service) format.  Go [here](http://wiki.openstreetmap.org/wiki/TMS) for more info.  There are slight variations in how the URL is constructed but I accounted for the variations that I know of.  

Please comply with the map provider license agreement.  Not all providers allow people to freely store their content locally (Google).  

The test directory provides some example of how to use this module (specifically in map-tile-downloader-spec.js).

This repo is still a work in progress, but it should hopefully be helpful.  

# Installation
- Install [Node](http://nodejs.org/)
- Install [Git](http://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- Git clone this repo `git clone https://github.com/ianwcarlson/map-tile-downloader` in your development directory
- Navigate to new project file and Install NPM packages
```
npm install
npm install -g gulp jsdoc jasmine-node
```

# Documentation
`gulp docs`

# Test
`jasmine-node test/` from root directory