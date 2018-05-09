const fs = require('fs')
const proj4 = require('proj4')

proj4.defs([
  [
    'EPSG:4326',
    '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees'],
  [
    "EPSG:25833",
    "+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"
  ]
])

const sqlite = require('better-sqlite3')
const db = new sqlite(__dirname + '/badestellen.db')

let data = JSON.parse(fs.readFileSync(__dirname + '/uploads/upload_53ffa1a2aab64b24fc51c2966b4f811a.json', 'utf8'))

function transBool(bool){
	return (bool)?1:0
}

data.forEach(d=>{

	let params = []

	let fields_str = ['name_lang2', 'webseite','letzte_eu_einstufung','messstelle','name','name_lang','gewaesser','bezirk','strasse','plz','stadt','gesundheitsamt_name','gesundheitsamt_zusatz','gesundheitsamt_strasse','gesundheitsamt_plz','gesundheitsamt_stadt','gesundheitsamt_mail','gesundheitsamt_telefon']
	let fields_bool = ['wasserrettung_durch_hilfsorganisationen_dlrg_oder_asb','rettungsschwimmer','barrierefrei','barrierefrei_zugang','barrierefrei_wc','restaurant','imbiss','parken','cyano_moeglich','wc','wc_mobil','hundeverbot']

	let query = 'UPDATE badestellen SET '

	let added = 0

	fields_str.forEach(str=>{
		if(str in d){
			if(added > 0) query += ', '
			query += str + ' = ?'
			params.push(d[str])
			added++
		}
	})

	fields_bool.forEach(str=>{
		if(str in d){
			if(added > 0) query += ', '
			query += str + ' = ?'
			params.push(transBool(d[str]))
		}
	})

	let coord = proj4('EPSG:25833', 'EPSG:4326', [parseFloat((d.ost+'').replace(',','.')),parseFloat((d.nord+'').replace(',','.'))])

	query += ', lat = ?, lng = ?'

	params.push(coord[1].toFixed(5))
	params.push(coord[0].toFixed(5))

	query += ' WHERE detail_id = ?'
	params.push(d.detail_id)

	db.prepare(query).run(params)

})