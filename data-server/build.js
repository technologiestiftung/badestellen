const fs = require('fs')

const moment = require('moment')

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

let state_map = []

rows.forEach(r=>{
	r['real_state'] = r.state
	if(r.state == 'gruen' && r.prediction == 'mangelhaft'){
		r.real_state = 'orange'
	}else if(r.state == 'grau' && r.prediction == 'mangelhaft'){
		r.real_state = 'orange'
	}else if(r.state == 'grau' && r.prediction != 'mangelhaft'){
		r.real_state = 'gruen'
	}

	state_map.push({
		real_state : r.real_state,
		state : r.state,
		prediction : r.prediction,
		id: r.id,
		name: r.name
	})
})

fs.writeFileSync(__dirname + '/data/test_build.min.json', JSON.stringify(rows), 'utf8')
fs.writeFileSync(__dirname + '/data/test_build.json', JSON.stringify(rows, null, 2), 'utf8')
fs.writeFileSync(__dirname + '/data/states.min.json', JSON.stringify(state_map), 'utf8')
fs.writeFileSync(__dirname + '/data/states.json', JSON.stringify(state_map, null, 2), 'utf8')

//Create state site
let states_template = fs.readFileSync(__dirname + '/templates/states.html', 'utf8'),
	states_html = ''

state_map.forEach(s=>{
	states_html += '<tr>'
	states_html += '<td>' + s.id + '</td>'
	states_html += '<td>' + s.name + '</td>'
	states_html += '<td>' + s.state + '</td>'
	states_html += '<td>' + s.prediction + '</td>'
	states_html += '<td>' + s.real_state + '</td>'
	states_html += '</tr>'
})

states_template = states_template.split('{{STATES}}').join(states_html)

fs.writeFileSync(__dirname + '/data/states.html', states_template, 'utf8')

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

fs.writeFileSync(__dirname + '/data/new_build.csv', csv, 'utf8')

//BUILDING THE INDEX.HTML

let index_template = fs.readFileSync(__dirname + '/templates/index.html', 'utf8')

let badestellen = ''

rows.forEach(r=>{

badestellen += '            	<li style="background-image: url(\'./images/badestellen/' + r.id + '.jpg\');">'+'\n';
badestellen += '            		<a href="./details/badestelle_' + r.id + '.html">'+'\n';
badestellen += '            			<span class="outer">'+'\n';
badestellen += '            				<img class="stateimg state-' + r.real_state + ' substate" src="./images/trans.gif">'+'\n';
badestellen += '            				<span>'+'\n';
badestellen += '            					<span>' + r.name + '</span>'
if(r.name.indexOf(r.gewaesser)==-1){
	badestellen += '<br class="unresposive-break">'+'\n';
	badestellen += '            					<span class="unresponsive-sub">' + r.gewaesser + '</span>'+'\n';
}
badestellen += '            				</span>'+'\n';
badestellen += '            			</span>'+'\n';
badestellen += '            		</a>'+'\n';
badestellen += '            	</li>'+'\n';

})

index_template = index_template.replace('{{LAST_MODIFIED}}', moment().format('YYYY-MM-DD'))
index_template = index_template.replace('{{BADESTELLEN_LISTE}}', badestellen)

fs.writeFileSync(__dirname + '/data/index.html', index_template, 'utf8')

//BUILDING DETAILS

function cleanWeb(str){
	if(str.substr(str.length-1,1)=='/'){
		str = str.substr(0, str.length-1);
	}
	return str.replace('http://','');
}

let stufentext = {
	'gruen':'Zum Baden geeignet',
	'orange':'Vom Baden wird abgeraten',
	'grau':'Keine Angabe',
	'rot':'Badeverbot'
};

let details_template = fs.readFileSync(__dirname + '/templates/detail.html', 'utf8')

rows.forEach(r=>{
	let temp = details_template

	let date = moment(r.date, 'YYYY-MM-DD').format('DD.MM.YYYY');

	let measurements_html = ''

	var measurements = [      'sicht_txt',  'eco_txt',            'ente_txt',                 'temp_txt',         'algen_txt',                'cb_txt'],
		measurement_labels = ['Sichttiefe', 'Escherichia coli',   'Intestinale Enterokokken', 'Wassertemperatur', 'Erhöhtes Algenauftreten',  'Coliforme Bakterien'],
		measurement_units = [ 'cm',         'pro 100 ml',         'pro 100 ml',               '°C',               '',                         'pro 100 ml'];

	var hasMeasurements = false;
	measurements.forEach(function(m){
		if(m in r && r[m].length>0){
			hasMeasurements = true;
		}
	});

	if(hasMeasurements){
		measurements_html += '<table cellpadding="0" cellmargin="0" border="0" class="measurement_table">';

		var line_count = 1;
		measurements.forEach(function(m,mi){
		  if(m in r && r[m].length>0){
		    measurements_html += '<tr class="row-'+line_count+'"><th>'+measurement_labels[mi]+'</th><td>'+((m=='algen_txt')?((r[m]=='A')?'Ja':'Nein'):(r[m]+' '+measurement_units[mi]))+'</td></tr>';
		    line_count++;
		  }
		});

		measurements_html += '</table>';
	}

	var eu_sign, eu_sign_alt;

	switch(r.letzte_eu_einstufung.toLowerCase()){
		case 'mangelhaft':
			eu_sign = 'poor';
			eu_sign_alt = 'Mangelhafte';
		break;
		case 'ausreichend':
			eu_sign = 'sufficient';
			eu_sign_alt = 'Auschreichende';
		break;
		case 'ausgezeichnet':
			eu_sign = 'excellent';
			eu_sign_alt = 'Ausgezeichnete';
		break;
		case 'gut':
			eu_sign = 'good';
			eu_sign_alt = 'Gute';
		break;
    }

    let features_html = ''

	if(r.cyano_moeglich && r.cyano_moeglich!=0){
		features_html += '<li><img src="./images/signs/cyano@2x.png" width="30" height="30" alt="Cyanobakterien massenhaft möglich (Blaualgen)" />&nbsp;Cyanobakterien massenhaft möglich (Blaualgen)</li>';
	}

	if((r.wasserrettung_durch_hilfsorganisationen_dlrg_oder_asb && r.wasserrettung_durch_hilfsorganisationen_dlrg_oder_asb!=0) || (r.rettungsschwimmer && r.rettungsschwimmer!=0)){
		features_html += '<li><img src="./images/signs/rescue@2x.png" width="30" height="30" alt="Wasserrettung zeitweise" />&nbsp;Wasserrettung zeitweise</li>';
	}

	if(!r.barrierefrei || r.barrierefrei == 0){
		features_html += '<li><img src="./images/signs/barrierefrei-not@2x.png" width="30" height="30" alt="Nicht barrierefrei" />&nbsp;Nicht barrierefrei</li>';
	}else{
		features_html += '<li><img src="./images/signs/barrierefrei@2x.png" width="30" height="30" alt="Barrierefrei" />&nbsp;Barrierefrei</li>';
	}

	if(!r.barrierefrei_zugang || r.barrierefrei_zugang == 0){
		features_html += '<li><img src="./images/signs/barrierefrei-not@2x.png" width="30" height="30" alt="Zugang zum Wasser nicht barrierefrei" />&nbsp;Zugang zum Wasser nicht barrierefrei</li>';
	}else{
		features_html += '<li><img src="./images/signs/barrierefrei@2x.png" width="30" height="30" alt="Barrierefreier Zugang zum Wasser" />&nbsp;Barrierefreier Zugang zum Wasser</li>';
	}

	if(r.restaurant && r.restaurant!=0){
		features_html += '<li><img src="./images/signs/restaurant@2x.png" width="30" height="30" alt="Restaurant" />&nbsp;Restaurant</li>';
	}

	if(r.imbiss && r.imbiss!=0){
		features_html += '<li><img src="./images/signs/imbiss@2x.png" width="30" height="30" alt="Imbiss" />&nbsp;Imbiss</li>';
	}

	if(r.parken&&r.parken!=0){
		features_html += '<li><img src="./images/signs/parken@2x.png" width="30" height="30" alt="Parkmöglichkeiten" />&nbsp;Parkmöglichkeiten</li>';
	}

	if(r.wc&&r.wc!=0){
		features_html += '<li><img src="./images/signs/toilette@2x.png" width="30" height="30" alt="WC verfügbar" />&nbsp;WC verfügbar</li>';
		if(!r.barrierefrei_wc||r.barrierefrei_wc==0){
			features_html += '<li><img src="./images/signs/barrierefrei-not@2x.png" width="30" height="30" alt="WC ist nicht barrierefrei" />&nbsp;WC ist nicht barrierefrei</li>';
		}
	}else if(r.wc_mobil&&r.wc_mobil!=0){
		features_html += '<li><img src="./images/signs/toilette@2x.png" width="30" height="30" alt="Mobiles WC verfügbar" />&nbsp;Mobiles WC verfügbar</li>';
		if(!r.barrierefrei_wc||r.barrierefrei_wc==0){
			features_html += '<li><img src="./images/signs/barrierefrei-not@2x.png" width="30" height="30" alt="WC ist nicht barrierefrei" />&nbsp;WC ist nicht barrierefrei</li>';
		}
	}

	if(r.hundeverbot&&r.hundeverbot!=0){
		features_html += '<li><img src="./images/signs/hundeverbot@2x.png" width="30" height="30" alt="Hundeverbot" />&nbsp;Hundeverbot</li>';
	}else{
		features_html += '<li><img src="./images/signs/hundeverbot-not@2x.png" width="30" height="30" alt="Kein Hundeverbot" />&nbsp;Kein Hundeverbot</li>';
	}

	let vars = [
		['name_lang',r.name_lang],
		['bezirk',r.bezirk],
		['image',r.image],
		['name',r.name],
		['strasse',r.strasse],
		['plz',parseInt(r.plz)],
		['stadt',r.stadt],
		['webseite',((r.webseite && r.webseite.length>0)?'<br /><a href="'+r.webseite+'"><span>'+cleanWeb(r.webseite)+'</span></a>':'')],
		['loc_x',parseFloat(r.lng)],
		['loc_y',parseFloat(r.lat)],
		['loc_bvg_x',parseFloat(r.lng).toFixed(6).toString().replace('.','')],
		['loc_bvg_y',parseFloat(r.lat).toFixed(6).toString().replace('.','')],
		['state',r.real_state],
		['state_text',stufentext[r.real_state]],
		['date', date],
		['MEASUREMENTS', measurements_html],
		['eu_sign', eu_sign],
		['eu_sign_alt', eu_sign_alt],
		['FEATURES', features_html],
		['PREDICTION', ((r.prediction=='true'||r.prediction==1)?'<span class="prediction"><img src="./images/signs/prediction@2x.png" width="30" height="30" alt="" />Die hier angezeigte Bewertung wird unterstützt durch eine neuartige tagesaktuelle Vorhersagemethode. <a href="info.html">Erfahren Sie mehr&nbsp;&raquo;</a></span>':'')],
		['gesundheitsamt_name', r.gesundheitsamt_name],
		['gesundheitsamt_zusatz', r.gesundheitsamt_zusatz],
		['gesundheitsamt_strasse', r.gesundheitsamt_strasse],
		['gesundheitsamt_plz', parseInt(r.gesundheitsamt_plz)],
		['gesundheitsamt_stadt', r.gesundheitsamt_stadt],
		['gesundheitsamt_mail', r.gesundheitsamt_mail],
		['gesundheitsamt_telefon', parseInt(r.gesundheitsamt_telefon)],
		['LAST_MODIFIED', moment().format('YYYY-MM-DD')]
	]

	vars.forEach(v=>{
		temp = temp.split('{{'+v[0]+'}}').join([v[1]])
	})

	fs.writeFileSync(__dirname + '/data/details/badestelle_'+r.id+'.html', temp, 'utf8')

})


let prediction_rows = db.prepare('SELECT badestellen_id, date, prediction FROM predictions').all([]),
	prediction_csv = {}

prediction_rows.forEach(r=>{
	if(!(r.badestellen_id in prediction_csv)){
		prediction_csv[r.badestellen_id] = []
	}
	prediction_csv[r.badestellen_id].push([r.date, r.prediction])
})

for(let id in prediction_csv){
	let csv = 'date,prediction'
	prediction_csv[id].forEach(c=>{
		csv += '\n'
		csv += c[0]+','+c[1]
	})
	fs.writeFileSync(__dirname + '/data/details/predictions_' + id + '.csv', csv, 'utf8')
}

let measurement_cols = 'date,sicht,eco,ente,temp,algen,cb,sicht_txt,eco_txt,ente_txt,temp_txt,algen_txt,cb_txt,bsl,state,wasserqualitaet,wasserqualitaet_txt',
	measurement_cols_a = measurement_cols.split(','),
	measurement_rows = db.prepare('SELECT badestellen_id, ' + measurement_cols + ' FROM measurements').all([]),
	measurement_csv = {}

measurement_rows.forEach(r=>{
	if(!(r.badestellen_id in measurement_csv)){
		measurement_csv[r.badestellen_id] = []
	}
	let a = []
	measurement_cols_a.forEach(c=>{
		a.push(r[c])
	})
	measurement_csv[r.badestellen_id].push(a)
})

for(let id in measurement_csv){
	let csv = measurement_cols
	measurement_csv[id].forEach(c=>{
		csv += '\n'
		c.forEach((cc,cci)=>{
			if(cc && cc.length>0 && cc.indexOf(',')>=0) c[cci] = '"'+cc+'"'
		})
		csv += c.join(',')
	})
	fs.writeFileSync(__dirname + '/data/details/measurements_' + id + '.csv', csv, 'utf8')
}


//Add static files to the API

