// take in user input for the geographic location in lat, long and how many square miles
// to cache
var prompt = require('prompt');
var fs = require('fs');
var http = require('http-get');

console.log('This script will download map tiles based on the center point and number' +
    'of square miles');

var mapSource = 'arcGis';
var mapType = 'osm';
var baseUrl;
var rootDir;
if (mapSource === 'arcGis'){
    baseUrl = 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/';
    rootDir = '/home/iwc/svn/vmg/trunk/grup-vmg/app/maps./arcGis/';
}
else if (mapSource === 'mapQuest'){
    if (mapType === 'sat'){
        baseUrl = 'http://otile1.mqcdn.com/tiles/1.0.0/sat/';
        rootDir = '/home/iwc/svn/vmg/trunk/grup-vmg/app/maps./mapquestSat/';
    }
    else if (mapType === 'osm'){
        baseUrl = 'http://otile1.mqcdn.com/tiles/1.0.0/map/';
        rootDir = '/home/iwc/svn/vmg/trunk/grup-vmg/app/maps./mapquestOsm/';
    }
}
var schema = {
    properties : {
        latitude: {
            type: 'number',
            message: 'enter the latitude in decimal degrees',
            required: true
        },
        longitude: {
            type: 'number',
            message: 'enter the longitude in decimal degrees',
            required: true
        },
        sqKms: {
            type: 'number',
            message: 'enter the square miles in decimal degrees',
            required: true
        }
    }

};

prompt.start();

/* main execution path */
prompt.get(schema, function(err, result){
    if (err) {return onErr(err)}
    //console.log('latitude = ', result.latitude);
    //console.log('longitude = ', result.longitude);
    //console.log('sqKms = ', result.sqKms);

    var inputValid = checkBounds(result);
    // TODO implement retry on checkBounds()
    if (inputValid){
        var vertices = calcVertices(result);
        var numTiles = 0;
        fs.mkdir(rootDir, 0777, function(err){
            if (err){
                if (err.code !== 'EEXIST'){
                    console.log(err);
                }
            }
        });
        console.log('getting resources from: ' + baseUrl);
        /* for each zoom level */
        for (var zoomIdx=10; zoomIdx<19; zoomIdx++){
            /* calculate min and max tile values */
            var minAndMaxValues = calcMinAndMaxValues(vertices, zoomIdx);
            console.log('minAndMaxValues: ', minAndMaxValues);

            zoomFilePath = rootDir+zoomIdx.toString() + '/';
            fs.mkdir(zoomFilePath, 0777, function(err){
                if (err){
                    if (err.code !== 'EEXIST'){
                        console.log(err);
                    }
                }
            });
            for (var yIdx=minAndMaxValues.yMin; yIdx<=minAndMaxValues.yMax; yIdx++){
                for (var xIdx=minAndMaxValues.xMin; xIdx<=minAndMaxValues.xMax; xIdx++){
                    //console.log('zoomIdx: ', zoomIdx,  'yIdx: ', yIdx, 'xIdx: ', xIdx);
                    //console.log('yIdx: ', yIdx);
                    //console.log('zoomIdx: ', zoomIdx);
                    var delay = Math.random()*10000;
                    //console.log('delay: ', delay);
                    setTimeout(getAndStoreTile(baseUrl, zoomIdx, xIdx, yIdx, rootDir), delay);
                    numTiles++;
                }
            }
        }
        console.log('total number of tiles: ', numTiles);
    }
});

/* Diagram of Vertices
(xMin, yMax)     (xMax, yMax)
     +-----------------+
     |                 |
     |                 |
     |                 |
     |        *        |
     |     (Center)    |
     |                 |
     |                 |
     +-----------------+
(xMin, yMin)     (xMax, yMin)

*/
/* Function Declarations */
function onErr(err){
    console.log(err);
    return 1;
}
function getAndStoreTile(baseUrl, zoom, x, y, rootDir){
    return function(){

        var fullUrl = buildUrl(baseUrl, zoom, x, y);
        var dirPath;
        var fullPath = buildPath(rootDir, zoom, x, y);
        if (mapSource === 'arcGis'){
            dirPath = buildDirPath(rootDir, zoom, y);
        }
        else if (mapSource === 'mapQuest'){
            dirPath = buildDirPath(rootDir, zoom, x);
            if (mapType === 'sat'){
                fullPath += '.jpg';
                fullUrl += '.jpg';
            }
            else{
                fullPath += '.png';
                fullUrl += '.png';
            }
        }
        //console.log('dirPath: ', dirPath);

        //console.log('fullPath: ', fullPath);

        //var hrTime = process.hrtime()
        //console.log(hrTime[0] * 1000 + hrTime[1] / 1000)

        fs.mkdir(dirPath, 0777, function(err){
            if (err){
                if (err.code !== 'EEXIST'){
                    console.log(err);
                }
            }
        });
        //console.log('attempting to get resource from: ', fullUrl)
        http.get(fullUrl, fullPath, function(err){
            if (err) {
                console.log(err);
                console.log('HTTP request failed!')
            }

        })
    }
}
function buildDirPath(rootDir, zoom, secondParam){
    return (rootDir + zoom.toString() + '/' + secondParam.toString() + '/')
}
function buildPath(rootDir, zoom, x, y){
    return (rootDir + buildSuffixPath(zoom, x, y));
}
function buildUrl(baseUrl, zoom, x, y){
    return (baseUrl + buildSuffixPath(zoom, x, y));
}
function buildSuffixPath(zoom, x, y){
    var rtnString;
    if (mapSource === 'arcGis'){
        rtnString = zoom.toString() + '/' + y.toString()
            + '/' + x.toString();
    }
    else if (mapSource === 'mapQuest'){
        rtnString = zoom.toString() + '/' + x.toString()
            + '/' + y.toString();
    }
    return (rtnString);
}
function calcMinAndMaxValues(vertices, zoom){
    var minAndMaxObj = {};

    /* Not sure why yMin and yMax are transposed on the tile coordinate system */
    minAndMaxObj.yMax = convLat2YTile(vertices.lowerLeft.lat, zoom);
    minAndMaxObj.xMin = convLon2XTile(vertices.lowerLeft.lon, zoom);
    minAndMaxObj.yMin = convLat2YTile(vertices.upperRight.lat, zoom);
    minAndMaxObj.xMax = convLon2XTile(vertices.upperRight.lon, zoom);

    //console.log('upperLeft.lat: ', convLat2YTile(vertices.upperLeft.lat, zoom))
    //console.log('upperLeft.lon: ', convLon2XTile(vertices.upperLeft.lon, zoom))
    //console.log('lowerRight.lat: ', convLat2YTile(vertices.lowerRight.lat, zoom))
    //console.log('lowerRight.lon: ', convLon2XTile(vertices.lowerRight.lon, zoom))

    return minAndMaxObj;
}
function calcVertices(result){
    var vertices = {};
    var radius = calcRadius(result.sqKms);
    var distance = radius * Math.SQRT2;
    var centerRadLat = convDecToRad(result.latitude);
    var centerRadLon = convDecToRad(result.longitude);

    vertices.upperRight = calcEndPoint(centerRadLat, centerRadLon,
        distance, Math.PI/4);
    vertices.lowerRight = calcEndPoint(centerRadLat, centerRadLon,
        distance, 3*Math.PI/4);
    vertices.lowerLeft = calcEndPoint(centerRadLat, centerRadLon,
        distance, 5*Math.PI/4);
    vertices.upperLeft = calcEndPoint(centerRadLat, centerRadLon,
        distance, 7*Math.PI/4);

    printVertices(vertices);

    return vertices;
}
function calcRadius(sqKms){
    var radius = Math.sqrt(sqKms);
    return radius;
}
function calcEndPoint(startX, startY, distance, bearing){
    var d = distance;
    var brng = bearing;
    var R = 6371; // earth's radius in km
    var endPoint = {};

    endPoint.lat = Math.asin( Math.sin(startX)*Math.cos(d/R) +
        Math.cos(startX)*Math.sin(d/R)*Math.cos(brng) );
    endPoint.lon = startY + Math.atan2(Math.sin(brng)*Math.sin(d/R)*Math.cos(startX),
        Math.cos(d/R)-Math.sin(startX)*Math.sin(endPoint.lat));

    return endPoint;
}
function convLon2XTile(lon, zoom){
    return (Math.floor(((lon*180/Math.PI)+180)/360*Math.pow(2,zoom)));
}
function convLat2YTile(lat, zoom){
    return (Math.floor((1-Math.log(Math.tan(lat)
        + 1/Math.cos(lat))/Math.PI)/2 *Math.pow(2,zoom)));
}
function convDecToRad(dec){
    return (dec*Math.PI/180);
}
function convRadToDec(rad){
    return (rad*180/Math.PI);
}
function convRadToDecCoordinates(coordinates){
    decCoordinates = {};
    decCoordinates.lat = convRadToDec(coordinates.lat);
    decCoordinates.lon = convRadToDec(coordinates.lon);
    return decCoordinates;
}
function checkBounds(result) {
    if (result.latitude > 90 || result.latitude < -90){
        console.log('latitude should be less than 90 and greater than' +
            '-90');
        return false;
    }
    if (result.longitude > 180 || result.longitude < -180){
        console.log('longitude should be less than 180 and greater than' +
            '-180');
        return false;
    }
    if (result.sqKms > 30 || result.sqKms < 0){
        console.log('sqKms should be greater than 0 and less than 10');
        return false;
    }
    return true;
}
function printVertices(vertices){
    console.log('Upper-right vertex: ', convRadToDecCoordinates(vertices.upperRight));
    console.log('Lower-right vertex: ', convRadToDecCoordinates(vertices.lowerRight));
    console.log('Lower-left vertex: ', convRadToDecCoordinates(vertices.lowerLeft));
    console.log('Upper-left vertex: ', convRadToDecCoordinates(vertices.upperLeft));
}

//var request = require("request");
// calculate the range of x and y tiles to download and save

// get each tile (image) and save to the correct directory