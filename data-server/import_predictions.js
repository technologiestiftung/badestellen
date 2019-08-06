module.exports = {

	import: (db, parser, fs, callback)=>{

		fs.readdirSync(__dirname + '/uploads/').forEach(file => {
		  if(file.indexOf('.csv')>=0){
		  	let csv = parser.parse(fs.readFileSync(__dirname + '/uploads/' + file, 'utf8'))
		  	csv.forEach(c=>{
				if(('id' in c) && ('badname' in c) && ('Datum' in c) && ('Vorhersage' in c) && c.id != null){

					let params = [
						c.id,
						c.Datum,
						c.Vorhersage,
						("p025" in c) ? c.p025 : -1,
						("p975" in c) ? c.p975 : -1,
						("p500" in c) ? c.p500 : -1
					]

					//check if the item already exists
					let rows = db.prepare("SELECT id FROM predictions WHERE badestellen_id = ? AND date = ?").all([c.id, c.Datum])
					if(rows.length>0){
						
						console.log('already exists', params)

					}else{

						let insert_str = 'INSERT INTO predictions (badestellen_id, date, prediction, p025, p975, p500) VALUES (?,?,?,?,?,?)'
						db.prepare(insert_str).run(params)

					}

				}
		  	})
		  }
		})

		callback()
	}
}