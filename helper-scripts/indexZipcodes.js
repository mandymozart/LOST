var fs       = require('fs')
var path     = require('path')
var readline = require('readline')
var mongodb  = require('mongodb')

var traverse = function(collection){
	var filePath = path.join(__dirname, 'allCountries.txt')

	var rd = readline.createInterface({
   		input: fs.createReadStream(filePath),
    	output: process.stdout,
    	terminal: false
	})

	rd.on('line', function(line) {
		var splits = line.trim().split('\t')
		var json = {
			countrycode : splits[0],
			name        : splits[2],
			city        : splits[3],
			zip         : splits[1],
			geolocation : {
				lat : parseFloat(splits[9]),
				lon : parseFloat(splits[10])
			}
		}
	
		console.log(json)
		collection.insert(json, function(err,docs){
			if (err) console.log(err);
		})
	})
}

mongodb.MongoClient.connect('mongodb://127.0.0.1:27017/lost', function (err, db) {
    if (err) {
        throw err;
    } 
    traverse(db.collection('geoinfos'));   
});



