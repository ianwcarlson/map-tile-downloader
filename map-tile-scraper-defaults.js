exports.defaults = {
    baseUrl : '',
    rootDir : '',
    mapSource : '',
    mapSourceSuffix : '',
    inputCoordinates : {
        lat: 0,
        lng: 0,
        sqKms : 0
    },
    zoom : {
        max : 19,
        min : 1
    },
    maxDelay : 0,
    xBeforeY: true	
};

exports.providerUrls = {
    arcGis : 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/',
    mapQuestAerial : 'http://otile1.mqcdn.com/tiles/1.0.0/sat/',
    mapQuestOsm : 'http://otile1.mqcdn.com/tiles/1.0.0/map/'
};