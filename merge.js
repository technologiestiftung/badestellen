let fs = require('fs'),
	request = require('request-promise'),
	cheerio = require('cheerio')

let geojson = JSON.parse(fs.readFileSync('./data/all.gjson', 'utf8')),
	details = JSON.parse(fs.readFileSync('./data/details.json', 'utf8')),
	keys = {}

details.forEach((d,di)=>{
	keys[d.title] = di
})

geojson.features.forEach((f,fi)=>{
	let id = keys[f.properties.title]
	geojson.features[fi].properties['details'] = {}
	for(let key in details[id]){
		geojson.features[fi].properties.details[key] = details[id][key]
	}
})

Promise.all(geojson.features.map(function(feature) {
	let options = {
		uri: 'http://www.berlin.de' + feature.properties.data.profillink.split(':')[1],
		transform: function (body) {
			return cheerio.load(body);
		}
	}

	return request(options).then(function($) {
		return $('.column-content .html5-section.article').eq(0).html()
	}).then(function(html) {
		html = html.split('src="/lageso').join('src="http://www.berlin.de/lageso')
		html = html.split('href="/lageso').join('href="http://www.berlin.de/lageso')
		return html;
	}).catch(function (err) {
		console.log('getDetails-error', err)
	})

})).then(function(values) {
  geojson.features.forEach((feature,i)=>{
  	geojson.features[i].properties.details['profil'] = values[i]
  })
  fs.writeFileSync('./data/complete.geojson', JSON.stringify(geojson), 'utf8')
  console.log('done')
})