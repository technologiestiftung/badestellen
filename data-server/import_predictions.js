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
						("P2.5" in c) ? parseFloat(c["P2.5"]) : 0,
						("P97.5" in c) ? parseFloat(c["P97.5"]) : 0,
						("P50" in c) ? parseFloat(c["P50"]) : 0
					]

					//check if the item already exists
					let rows = db.prepare("SELECT id, p500 FROM predictions WHERE badestellen_id = ? AND date = ?").all([c.id, c.Datum])
					if(rows.length>0){

						if ((rows[0].p500 === 0 || rows[0].p500 === null || rows[0].p500 === "null") && params[5] !== 0) {
							db.prepare("UPDATE predictions SET p025 = ?, p975 = ?, p500 = ? WHERE id = ?")
								.run([
									params[3],
									params[4],
									params[5],
									rows[0].id
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