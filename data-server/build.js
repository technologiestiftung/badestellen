const fs = require('fs')

const sqlite = require('better-sqlite3')
const db = new sqlite(__dirname + '/badestellen.db')

//Build new.csv
//Build index.html
//Build badestellen/detail_id.html
//Build badestellen/detail_id.csv
//Build open data json
//Build status json
//Add static files to the API




// let csv = 'id,detail_id,messstelle,name,name_lang,gewaesser,bezirk,strasse,plz,stadt,gesundheitsamt_name,gesundheitsamt_zusatz,gesundheitsamt_strasse,gesundheitsamt_plz,gesundheitsamt_stadt,gesundheitsamt_mail,gesundheitsamt_telefon,wasserrettung_durch_hilfsorganisationen_dlrg_oder_asb,rettungsschwimmer,barrierefrei,barrierefrei_zugang,barrierefrei_wc,restaurant,imbiss,parken,cyano_moeglich,wc,wc_mobil,hundeverbot,name_lang2',
// 	labels = csv.split(',')

// 	csv += ',lat,lng,image,state,date,sicht,temp'


const query = 'SELECT ' +
	'b.id, b.detail_id, b.name, p.prediction, m.sicht_txt, m.eco_txt, m.ente_txt, m.temp_txt, m.algen_txt, m.cb_txt, m.state, m.date' + 
' FROM ' +
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
