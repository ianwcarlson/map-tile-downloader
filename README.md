# map-tile-downloader

NodeJS module that calculates a square area and downloads all the map tiles contained in that area at the specified zoom levels.  The tiles can then be served up locally with a simple static file web server and client-side map engine like [Leaflet](http://leafletjs.com/). 

The test directory provides some example of how to use this module (specifically in map-tile-downloader-spec.js)

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