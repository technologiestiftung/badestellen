const fs = require('fs'),
	d3 = require('d3'),
	request = require('request').defaults({ encoding: null }),
	sharp = require('sharp')

const geojson = d3.csvParse(fs.readFileSync('./data/new.csv', 'utf8'))

geojson.forEach(f=>{
	request.get(f.image, function (err, res, body) {
		sharp(body).resize(600, 300).toFile('./images/'+f.id+'.jpg')
	})
})