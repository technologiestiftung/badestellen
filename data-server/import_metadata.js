module.exports = {

	import:(db, fs, moment, proj4, callback)=>{

		let meta_files = []

		fs.readdirSync(__dirname + '/uploads/').forEach(file => {
		  if(file.indexOf('.json')>=0){
		  	let stat = fs.statSync(__dirname + '/uploads/' + file)

		  	meta_files.push({
		  		file:__dirname + '/uploads/' + file,
		  		date:moment(stat.birthtime)
		  	})
		  }
		})

		meta_files.sort((a,b)=>{
			return a.date.diff(b.date, 'seconds')
		})

		let data = JSON.parse(fs.readFileSync(meta_files[meta_files.length-1].file, 'utf8'))

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

			query += ', lng = ?, lat = ?'

			params.push(coord[1].toFixed(5))
			params.push(coord[0].toFixed(5))

			query += ' WHERE detail_id = ?'
			params.push(d.detail_id)

			db.prepare(query).run(params)

		})

		callback()
	}
}