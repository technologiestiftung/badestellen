const fs = require('fs'),
	request = require('request').defaults({ encoding: null }),
	sharp = require('sharp')

const 	regex1 = /http:\/\/www\.berlin\.de\/lageso\/gesundheit\/gesundheitsschutz\/badegewaesser\/badestellen\/(.)*\.jpg/g,
		regex2 = /http:\/\/www\.berlin\.de\/lageso\/gesundheit\/gesundheitsschutz\/badegewaesser\/(.)*\.jpg/g;

let images = [], image_keys = {}

const geojson = JSON.parse(fs.readFileSync('./data/all.min.geojson', 'utf8'))

geojson.features.forEach(f=>{
	let details = JSON.parse(fs.readFileSync('./data/individual/'+f.properties.id+'.json'))


	let m, str = details.properties.details.html, found = false;

	([regex1, regex2]).forEach(regex=>{

		while ((m = regex.exec(str)) !== null) {
		    // This is necessary to avoid infinite loops with zero-width matches
		    if (m.index === regex.lastIndex) {
		        regex.lastIndex++;
		    }
		    
		    // The result can be accessed through the `m`-variable.
		    m.forEach((match, groupIndex) => {
		    	if(match.length > 10 && !(match in image_keys)){
		    		image_keys[match] = true
			    	found = true;
			        images.push({ id: f.properties.id, image:match, name:details.properties.details.title});

					request.get(match, function (err, res, body) {
						sharp(body).resize(600, 300).toFile('./images/'+f.properties.id+'.jpg');
					});
			    }
		    });
		}

	})

	if(!found){
		console.log('not found', f.properties.id)
	}
})

fs.writeFileSync('images.html', '<html><head><meta charset="utf-8" /></head><body>'+ (images.map(a=>{ return '<h3>'+a.name+' ('+a.id+')</h3><br /><img src="'+ a.image +'" style="height:420px;" />'; })).join('<br /><br />') +'</body></html>')