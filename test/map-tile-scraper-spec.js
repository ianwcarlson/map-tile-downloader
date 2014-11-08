var mapTileScraperModule = require('../map-tile-scraper.js');
var myMapScraper = mapTileScraperModule();
describe("Basic setters and getters", function(){
	
	it("should set and get well", function(){
		var zoom = {min: 3, max: 6};
		myMapScraper.setZoomMinMax(zoom);
		
		expect(myMapScraper.getZoomMinMax()).toEqual(zoom);	

		var rootPath = 'someRootPath';
		myMapScraper.setRootPath(rootPath);

		expect(myMapScraper.getRootPath()).toEqual(rootPath);

		myMapScraper.setBaseUrl(rootPath);
		expect(myMapScraper.getBaseUrl()).toEqual(rootPath);

		var testCoordinates = {
			lat: 33.0,
			lng: 106.0,
			sqKms: 5
		};
		myMapScraper.setInputCoordinates(testCoordinates.lat,
			testCoordinates.lng, testCoordinates.sqKms);
		expect(myMapScraper.getInputCoordinates()).toEqual(testCoordinates);
	});


	//mapTileScraper.setRootPath('../maps');
});