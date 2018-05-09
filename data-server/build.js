const fs = require('fs')

const sqlite = require('better-sqlite3')
const db = new sqlite(__dirname + '/badestellen.db')

const b_fields = [
	'id',
	'detail_id',
	'messstelle',
	'name',
	'name_lang',
	'gewaesser',
	'bezirk',
	'strasse','plz','stadt',
	'webseite',
	'gesundheitsamt_name','gesundheitsamt_zusatz','gesundheitsamt_strasse','gesundheitsamt_plz','gesundheitsamt_stadt','gesundheitsamt_mail','gesundheitsamt_telefon',
	'wasserrettung_durch_hilfsorganisationen_dlrg_oder_asb',
	'rettungsschwimmer',
	'barrierefrei',
	'barrierefrei_zugang',
	'barrierefrei_wc',
	'restaurant',
	'imbiss',
	'parken',
	'cyano_moeglich',
	'wc',
	'wc_mobil',
	'hundeverbot',
	'name_lang2',
	'lat',
	'lng',
	'image',
	'letzte_eu_einstufung'
	]

const p_fields = [
		'prediction'
	]

const m_fields = [
		'sicht_txt',
		'eco_txt',
		'ente_txt',
		'temp_txt',
		'algen_txt',
		'cb_txt',
		'state',
		'date'
	]

let query = 'SELECT ';

b_fields.forEach((c,ci)=>{
	if(ci>0) query += ','
	query += 'b.'+c
})

p_fields.forEach((c,ci)=>{
	query += ', p.'+c
})

m_fields.forEach((c,ci)=>{
	query += ', m.'+c
})

query += ' FROM ' +
	'badestellen AS b' + 
' LEFT JOIN ' + 
	'predictions AS p ON b.id = p.badestellen_id' + 
' LEFT JOIN ' + 
	'measurements AS m ON b.detail_id = m.badestellen_id' +
' GROUP BY ' + 
	'b.detail_id' + 
' ORDER BY ' +
	'm.date DESC, p.date DESC '

let rows = db.prepare(query).all([])

fs.writeFileSync('./data/test_build.json', JSON.stringify(rows, null, 2), 'utf8')

//Build new.csv
let csv = '', keys = []

for(let key in rows[0]){
	if(csv != '') csv += ','
	csv += key
	keys.push(key)
}

rows.forEach(r=>{
	csv += '\n'
	keys.forEach((k,ki)=>{
		if(ki>0) csv += ','

		let safe = ''

		if((typeof r[k])=='string'){
			safe = ((r[k].indexOf(',')>=0)?'"':'')
		}

		csv += safe + r[k] + safe
	})
})

fs.writeFileSync('./data/new_build.csv', csv, 'utf8')

//Build index.html
//Build badestellen/detail_id.html
//Build badestellen/detail_id.csv
//Build open data json
//Build status json
//Add static files to the API

