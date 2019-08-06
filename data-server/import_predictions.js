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
						("p025" in c) ? c.p025 : 0,
						("p975" in c) ? c.p975 : 0,
						("p500" in c) ? c.p500 : 0
					]

					//check if the item already exists
					let rows = db.prepare("SELECT id, p500 FROM predictions WHERE badestellen_id = ? AND date = ?").all([c.id, c.Datum])
					if(rows.length>0){

						if (rows[0].p500 === 0 && params[5] !== 0) {
							db.preapre("UPDATE predictions SET p025 = ?, p975 = ?, p500 = ? WHERE id = ?")
								.run([
									params[3],
									params[4],
									params[5],
									c.id
								]);
							console.log('already exists > updated', params)
						} else {
							console.log('already exists', params)
						}

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