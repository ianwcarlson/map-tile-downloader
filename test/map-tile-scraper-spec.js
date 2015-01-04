var mapTileScraperModule = require('../map-tile-scraper.js');
var myMapScraper = mapTileScraperModule({});
var defaults = require('../map-tile-scraper-defaults.js');
var testFixtures = require('./testFixtures.js');
describe("map-tile-scraper", function(){
	
	it("should set and get well", function(){
		var defaultsGetter = myMapScraper.getOptions();		
		expect(defaultsGetter).toEqual(defaults.defaults);

		var testConfig = {
			baseUrl: 'testBaseUrl',
			inputCoordinates: {
				lat: 33.0,
				lng: -106.0,
				sqKms: 3
			},
			maxDelay: 5
		};	

		myMapScraper.setOptions(testConfig);
		var newOptions = myMapScraper.getOptions();
		var expectedConfig = {
			baseUrl: testConfig.baseUrl,
			rootDir: defaults.defaults.rootDir,
			mapSource: defaults.defaults.mapSource,
			mapSourceSuffix: defaults.defaults.mapSourceSuffix,
			inputCoordinates: {
				lat: testConfig.inputCoordinates.lat,
				lng: testConfig.inputCoordinates.lng,
				sqKms: testConfig.inputCoordinates.sqKms
			},
			zoom : {
				max: defaults.defaults.zoom.max,
				min: defaults.defaults.zoom.min
			},
			maxDelay: testConfig.maxDelay,
			xBeforeY: defaults.defaults.xBeforeY
		}
		expect(newOptions).toEqual(expectedConfig);

		var testCoordinates = {
			lat: 44.0,
			lng: 55.0,
			sqKms: 5
		};
		myMapScraper.setInputCoordinates(testCoordinates.lat,
			testCoordinates.lng, testCoordinates.sqKms);
		expect(myMapScraper.getInputCoordinates()).toEqual(testCoordinates);
	});

	it("should have the constructor work properly", function(){

		var testMapScraper = mapTileScraperModule(testFixtures.testObject0);

		var mapOptions = testMapScraper.getOptions();
		expect(mapOptions.inputCoordinates).toEqual(testFixtures.testObject0.inputCoordinates);
		expect(mapOptions.zoom).toEqual(testFixtures.testObject0.zoom);
		expect(mapOptions.rootDir).toEqual(testFixtures.testObject0.rootDir);
	});

	it("should do set the right options based on map provider", function(){
		var testMapScraper = mapTileScraperModule({});	
		testMapScraper.setUrlByMapProvider('mapQuestAerial');
		var mapQuestAerialOptions = testMapScraper.getOptions();

		expect(mapQuestAerialOptions.mapSource).toEqual('mapQuestAerial');
		expect(mapQuestAerialOptions.baseUrl).toEqual(defaults.providerUrls.mapQuestAerial);
		expect(mapQuestAerialOptions.mapSourceSuffix).toEqual('.jpg');
		expect(mapQuestAerialOptions.xBeforeY).toEqual(true);

		testMapScraper.setUrlByMapProvider('mapQuestOsm');
		var mapQuestAerialOptions = testMapScraper.getOptions();

		expect(mapQuestAerialOptions.mapSource).toEqual('mapQuestOsm');
		expect(mapQuestAerialOptions.baseUrl).toEqual(defaults.providerUrls.mapQuestOsm);
		expect(mapQuestAerialOptions.mapSourceSuffix).toEqual('.jpg');
		expect(mapQuestAerialOptions.xBeforeY).toEqual(true);

		testMapScraper.setUrlByMapProvider('arcGis');
		var mapQuestAerialOptions = testMapScraper.getOptions();

		expect(mapQuestAerialOptions.mapSource).toEqual('arcGis');
		expect(mapQuestAerialOptions.baseUrl).toEqual(defaults.providerUrls.arcGis);
		expect(mapQuestAerialOptions.mapSourceSuffix).toEqual('');
		expect(mapQuestAerialOptions.xBeforeY).toEqual(false);
	});

	it("should error when inputs are invalid", function(){

		var testMapScraper = mapTileScraperModule(testFixtures.testObject0);	
		var testOptions = {
			baseUrl: 'http://api.tiles.mapbox.com/v4/iancarlson3000.g9no2eg2/',
			rootDir: 'mapbox/',
			mapSourceSuffix: '.jpg90?access_token=pk.eyJ1IjoiaWFuY2FybHNvbjMwMDAiLCJhIjoib1hRZlNoRSJ9.yEX3JTcra1PvRLws51hWyg',
			inputCoordinates: {
				lat: 91.0,
				lng: -106.0,
				sqKms: 0.1
			},
			xBeforeY: true
		}

		testMapScraper.setOptions(testOptions);
		testMapScraper.run(function(err){		
			expect(err).toBeTruthy();
		});

		testOptions.inputCoordinates.lat = -91.0;
		testMapScraper.setOptions(testOptions);
		testMapScraper.run(function(err){		
			expect(err).toBeTruthy();
		});

		testOptions.inputCoordinates.lat = 33.0;
		testOptions.inputCoordinates.lng = -181.0;
		testMapScraper.setOptions(testOptions);
		testMapScraper.run(function(err){		
			expect(err).toBeTruthy();
		});

		testOptions.inputCoordinates.lng = 181.0;
		testMapScraper.setOptions(testOptions);
		testMapScraper.run(function(err){		
			expect(err).toBeTruthy();
		});
	});

	it("should download the correct tiles based on custom options", function(){

		var testMapScraper = mapTileScraperModule(testFixtures.testObject0);	
		var testOptions = {
			baseUrl: 'http://api.tiles.mapbox.com/v4/iancarlson3000.g9no2eg2/',
			rootDir: 'mapbox/',
			mapSourceSuffix: '.jpg90?access_token=pk.eyJ1IjoiaWFuY2FybHNvbjMwMDAiLCJhIjoib1hRZlNoRSJ9.yEX3JTcra1PvRLws51hWyg',
			inputCoordinates: {
				lat: 33.0,
				lng: -106.0,
				sqKms: 0.1
			},
			xBeforeY: true
		}

		testMapScraper.setOptions(testOptions);

		testMapScraper.run(function(err){
			console.log(err);
			expect(err).toBeTruthy();
		});
	});

	it("should download the correct tiles based on presets", function(){
		var testMapScraper = mapTileScraperModule({});	
		testMapScraper.setUrlByMapProvider('mapQuestAerial');
		testMapScraper.setOptions({
			rootDir: 'mapQuestAerial/',
			inputCoordinates: {
				lat: 33.0,
				lng: -106.0,
				sqKms: 0.1
			}
		});
		testMapScraper.run(function(err){
			console.log(err);
			expect(err).toBeTruthy();
		});
	});

});