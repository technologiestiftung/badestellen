let fs = require('fs'),
	proj4 = require('proj4')

proj4.defs([
  [
    'EPSG:4326',
    '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees'],
  [
    "EPSG:25833",
    "+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"
  ]
])

const data = JSON.parse(fs.readFileSync('./new.json', 'utf8')),
	img_data = JSON.parse(fs.readFileSync('./all.gjson', 'utf8'))

let images = {}, titles = {}

const regex = /http:\/\/www\.berlin\.de\/lageso\/gesundheit\/gesundheitsschutz\/badegewaesser\/(.)*\.(jpg|jpeg|png|gif|JPEG|JPG|PNG|GIF)/g;

img_data.features.forEach(img=>{
	let detail = JSON.parse(fs.readFileSync('./individual/'+img.properties.data.id+'.json'))

	let title = detail.properties.title
	if(title.indexOf('/')>=0){title = (title.split('/'))[0].trim();}
	if(title.indexOf(',')>=0){title = (title.split(','))[0].trim();}

	const regex1 = /(\d){1,6}/g;
	let m, str = detail.properties.data.badestellelink;

	while ((m = regex1.exec(str)) !== null) {
	    if (m.index === regex1.lastIndex) {
	        regex1.lastIndex++;
	    }
	    
	    titles[m[0]] = img.properties.data.id;
	}

	str = detail.properties.details.html;

	while ((m = regex.exec(str)) !== null) {
	    if (m.index === regex.lastIndex) {
	        regex.lastIndex++;
	    }

	    images[img.properties.data.id] = {
	    	image:m[0],
	    	date:img.properties.data.dat,
	    	sicht:parseFloat(img.properties.data.sicht.replace(',','.')),
	    	temp:parseFloat(img.properties.data.temp.replace(',','.'))
	    }
	}
})

let csv = 'id,detail_id,messstelle,name,name_lang,gewaesser,bezirk,strasse,plz,stadt,gesundheitsamt_name,gesundheitsamt_zusatz,gesundheitsamt_strasse,gesundheitsamt_plz,gesundheitsamt_stadt,gesundheitsamt_mail,gesundheitsamt_telefon,wasserrettung_durch_hilfsorganisationen_dlrg_oder_asb,rettungsschwimmer,barrierefrei,barrierefrei_zugang,barrierefrei_wc,restaurant,imbiss,parken,cyano_moeglich,wc,wc_mobil,hundeverbot,name_lang2',
	labels = csv.split(',')

	csv += ',lat,lng,image,state,date,sicht,temp'

data.forEach(d=>{
	
	let imgID = titles[d.detail_id]

	csv += '\n'
	let coord = proj4("EPSG:25833", 'EPSG:4326', [parseFloat(d.ost.replace(',','.')),parseFloat(d.nord.replace(',','.'))])
	labels.forEach(l=>{
		let safe = ''

		if((typeof d[l])=='string'){
			safe = ((d[l].indexOf(',')>=0)?'"':'')
		}

		csv += safe + d[l] + safe + ','
	})
	csv += coord[0].toFixed(5)+','+coord[1].toFixed(5)
	csv += ','+images[imgID].image
	csv += ',gruen'
	csv += ','+images[imgID].date
	csv += ','+images[imgID].sicht
	csv += ','+images[imgID].temp
})

fs.writeFileSync('new.csv', csv, 'utf8')