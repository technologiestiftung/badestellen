module.exports = {

	build: (db, config, fs, moment, path, parser, request)=>{

		function parseNum(str){
			if(str.length==0) return 0
			return parseInt((str.replace('>','')).replace('<',''))
		}

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
				'prediction',
				'date'
			]

		const m_fields = [
				'wasserqualitaet',
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
			if(c=='date'){
				query += ' AS p_date'
			}
		})

		m_fields.forEach((c,ci)=>{
			query += ', m.'+c
			if(c=='date'){
				query += ' AS m_date'
			}
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

		let rows = db.prepare(query).all([]),
			row_keys = {}

		rows.forEach((r,ri)=>{
			row_keys[r.detail_id] = ri
		})

		let state_map = []

		rows.forEach(r=>{
			//Default is lageso
			r['real_state'] = r.wasserqualitaet

			//unsupported special case black???
			if(r.real_state == 10 || r.real_state == 7 || r.real_state == 8){
				r.real_state = 9
			}

			//Check if there is a prediction for this place, otherwise keep default
			if(r.prediction && r.prediction != null){
				//The only time prediction overrules Lageso is when prediction is 'mangelhaft'
				if(r.prediction == 'mangelhaft'){
					//If Lageso is even worse, stick to Lageso
					if(r.real_state == 6 || r.real_state == 5){
						//Do nothing Lageso overrules
					}else if(r.real_state == 2 || r.real_state == 4 || r.real_state == 6){
						//Lageso has detected algae
						r.real_state = 14
						r.state = 'organge'
					}else{
						//Set to predicted orange
						r.real_state = 13
						r.state = 'organge'
					}
				}else{
					//This place has a location, but it does not change whatever Lageso already says
					switch(r.real_state){
						case 1: r.real_state = 11; break;
						case 2: r.real_state = 12; break;
						case 3: r.real_state = 13; break;
						case 4: r.real_state = 14; break;
						case 5: r.real_state = 15; break;
						case 6: r.real_state = 16; break;
						case 9: r.real_state = 11; break;
					}
				}
			}

			state_map.push({
				wasserqualitaet : r.wasserqualitaet,
				real_state : r.real_state,
				state : r.state,
				state_date : r.m_date,
				prediction_date : r.p_date,
				prediction : r.prediction,
				id: r.id,
				name: r.name
			})
		})

		fs.writeFileSync(path.join(__dirname, config.export_path , 'test_build.min.json'), JSON.stringify(rows), 'utf8')
		fs.writeFileSync(path.join(__dirname, config.export_path, 'test_build.json'), JSON.stringify(rows, null, 2), 'utf8')
		fs.writeFileSync(path.join(__dirname, config.export_path, 'states.min.json'), JSON.stringify(state_map), 'utf8')
		fs.writeFileSync(path.join(__dirname, config.export_path, 'states.json'), JSON.stringify(state_map, null, 2), 'utf8')

		//Create state site
		let states_template = fs.readFileSync(__dirname + '/templates/states.html', 'utf8'),
			states_html = ''

		state_map.forEach(s=>{
			states_html += '<tr>'
			states_html += '<td>' + s.id + '</td>'
			states_html += '<td>' + s.name + '</td>'
			states_html += '<td>' + s.wasserqualitaet + '</td>'
			states_html += '<td>' + s.state_date + '</td>'
			states_html += '<td>' + s.prediction + '</td>'
			states_html += '<td>' + s.prediction_date + '</td>'
			states_html += '<td>' + s.real_state + '</td>'
			states_html += '</tr>'
		})

		states_template = states_template.split('{{STATES}}').join(states_html)

		fs.writeFileSync(path.join(__dirname, config.export_path, 'states.html'), states_template, 'utf8')

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

		fs.writeFileSync(path.join(__dirname, config.export_path, 'new_build.csv'), csv, 'utf8')

		//BUILDING THE INDEX.HTML

		let index_template = fs.readFileSync(__dirname + '/templates/index.html', 'utf8')

		let badestellen = ''

		rows.forEach(r=>{

			badestellen += '            	<li style="background-image: url(\'./images/badestellen/' + r.id + '.jpg\');">'+'\n';
			badestellen += '            		<a>'+'\n';
			badestellen += '            			<span class="outer">'+'\n';
			badestellen += '            				<img class="stateimg state-' + r.real_state + ' '+ ((r.name.indexOf(r.gewaesser)==-1)?'substate':'') +'" src="./images/trans.gif">'+'\n';
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

		fs.writeFileSync(path.join(__dirname, config.export_path, 'index.html'), index_template, 'utf8')

		// individual prediction files

		let prediction_rows = db.prepare('SELECT badestellen_id, date, prediction, p025, p975, p500 FROM predictions ORDER BY date').all([]),
			prediction_csv = {}

		prediction_rows.forEach(r=>{
			if(!(r.badestellen_id in prediction_csv)){
				prediction_csv[r.badestellen_id] = []
			}
			prediction_csv[r.badestellen_id].push([r.date, r.prediction, r.p025, r.p975, r.p500])
		})

		for(let id in prediction_csv){
			let csv = 'date,prediction,p025,p975,p500'
			prediction_csv[id].forEach(c=>{
				csv += '\n'
				csv += c[0]+','+c[1]+','+c[2]+','+c[3]+','+c[4]
			})
			fs.writeFileSync(path.join(__dirname, config.export_path, '/details/predictions_' + id + '.csv'), csv, 'utf8')
		}

		// individual measurement files

		let measurement_cols = 'date,sicht,eco,ente,temp,algen,cb,sicht_txt,eco_txt,ente_txt,temp_txt,algen_txt,cb_txt,bsl,state,wasserqualitaet,wasserqualitaet_txt',
			measurement_cols_a = measurement_cols.split(','),
			measurement_rows = db.prepare('SELECT badestellen_id, ' + measurement_cols + ' FROM measurements ORDER BY date').all([]),
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
			fs.writeFileSync(path.join(__dirname, config.export_path, 'details/measurements_' + id + '.csv'), csv, 'utf8')
		}

		//Build letzte.csv

		console.log('build.letzte')

		let letzte_cols_a = ['BadName','Bezirk','Profil','RSS_Name','Latitude','Longitude','ProfilLink','BadestelleLink','Dat','Sicht','Eco','Ente','Farbe','BSL','Algen','Wasserqualitaet','cb','Temp','PDFLink','PrognoseLink','Farb_ID','Wasserqualitaet_lageso','Wasserqualitaet_predict','Dat_predict'],
			letzte_cols = letzte_cols_a.join(';'),
			quali_id = letzte_cols_a.find(el=>el=='Wasserqualitaet')

		request({uri:'http://ftp.berlinonline.de/lageso/baden/letzte.csv', encoding:'latin1' /*iso-8859-1*/}, (error, response, body)=>{

			if(error) console.log(error)

			const csv = parser.parse(body.split('"').join(''))

			csv.forEach((c,ci)=>{

				let obj = {
					badestellen_id : c.BadestelleLink.match(/(\d){1,6}/g),
					quality:parseNum(c.Wasserqualitaet)
				}

				if(rows[row_keys[obj.badestellen_id]].prediction && rows[row_keys[obj.badestellen_id]].prediction != null){
					csv[ci]['Wasserqualitaet_lageso'] = obj.quality

					console.log(rows[row_keys[obj.badestellen_id]].id)

					let prediction_row = db.prepare('SELECT prediction, date FROM predictions WHERE badestellen_id = ? ORDER BY date DESC LIMIT 1').all([rows[row_keys[obj.badestellen_id]].id]),
						prediction = prediction_row[0].prediction,
						new_quality = obj.quality,
						new_farbe = csv[ci]['Farbe']

					if(prediction == 'mangelhaft'){
						//If Lageso is even worse, stick to Lageso
						if(obj.quality == 6 || obj.quality == 5){
							//Do nothing Lageso overrules
						}else if(obj.quality == 2 || obj.quality == 4 || obj.quality == 6){
							//Lageso has detected algae
							new_farbe = 'gelb_prog.jpg'
							new_quality = 14
						}else{
							//Set to predicted orange
							new_quality = 13
							new_farbe = 'gelb_prog.jpg'
						}
					}else{
						//This place has a location, but it does not change whatever Lageso already says
						switch(obj.quality){
							case 1: new_quality = 11; new_farbe = 'gruen_prog.jpg'; 	break;
							case 2: new_quality = 12; new_farbe = 'gruen_a_prog.jpg'; 	break;
							case 3: new_quality = 13; new_farbe = 'gelb_prog.jpg'; 		break;
							case 4: new_quality = 14; new_farbe = 'gelb_a_prog.jpg'; 	break;
							case 5: new_quality = 15; new_farbe = 'rot_prog.jpg'; 		break;
							case 6: new_quality = 16; new_farbe = 'rot_a_prog.jpg'; 	break;
							case 9: new_quality = 11; new_farbe = 'gruen_prog.jpg'; 	break;
						}
					}

					csv[ci]['Wasserqualitaet'] = new_quality
					csv[ci]['Farbe'] = new_farbe
					csv[ci]['Wasserqualitaet_predict'] = prediction
					csv[ci]['Dat_predict'] = prediction_row[0].date
				}else{
					csv[ci]['Wasserqualitaet_lageso'] = obj.quality
					csv[ci]['Wasserqualitaet_predict'] = ''
					csv[ci]['Dat_predict'] = ''
				}

			})

			let lcsv = letzte_cols
			csv.forEach(c=>{
				lcsv += '\n'
				let cci = 0
				for(var key in c){
					if(cci>0) lcsv += ';'
					let cc = c[key]
					if(key.indexOf("Link")>=0 && cc.length>0){
						if(cc.indexOf(':/lageso')>=0){
							lcsv += '"""'+cc.split(':/lageso').join('""":/lageso')
						}else{
							lcsv += '"""'+cc.split(':http').join('""":http')
						}
					}else{
						if(cc.length>0 && cc.indexOf(';')>=0){ //&& (cc.indexOf(',')>=0 || 
							lcsv += '"'+cc+'"'
						}else{
							lcsv += cc
						}
					}
					cci++
				}
			})
			fs.writeFileSync(path.join(__dirname, config.export_path, 'letzte.csv'), lcsv, 'utf8')

			console.log('build done')

		})

		//Build a statistical history since start of the app (2018-03-27)
		let today = moment(),
			first_day = moment('2018-03-27 10:00:00')

		today.hours(10).minutes(0).seconds(0)

		while(first_day.diff(today, 'minutes')<=0){
			let c_day = first_day.format('YYYY-MM-DD')

			let c_predictions = db.prepare('SELECT badestellen_id, prediction, date FROM predictions WHERE date <= date(?) ORDER BY date DESC LIMIT (SELECT COUNT(*) FROM predictions WHERE date <= date(?) GROUP BY date ORDER BY date DESC LIMIT 1)').all([c_day,c_day]),
				c_measurements = db.prepare('SELECT DISTINCT badestellen_id badestellen_id, wasserqualitaet, date  FROM measurements WHERE date <= ? ORDER BY date DESC').all([c_day])

			//console.log(c_day, c_predictions, c_measurements)

			first_day.add(1, 'day')
		}


		//Add static files to the API

	}
}