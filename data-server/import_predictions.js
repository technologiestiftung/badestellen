const fs = require('fs')
const d3_dsv = require('d3-dsv')
const parser = d3_dsv.dsvFormat(',')

const sqlite = require('better-sqlite3')

const db = new sqlite(__dirname + '/badestellen.db');

fs.readdirSync(__dirname + '/uploads/').forEach(file => {
  if(file.indexOf('.csv')>=0){
  	let csv = parser.parse(fs.readFileSync(__dirname + '/uploads/' + file, 'utf8'))
  	csv.forEach(c=>{
		if(('id' in c) && ('badname' in c) && ('Datum' in c) && ('Vorhersage' in c) && c.id != null){

			let params = [
				c.id,
				c.Datum,
				c.Vorhersage
			]

			//check if the item already exists
			let rows = db.prepare("SELECT id FROM predictions WHERE badestellen_id = ? AND date = ?").all([c.id, c.Datum])
			if(rows.length>0){
				console.log('already exists', params)
			}else{

				let insert_str = 'INSERT INTO predictions (badestellen_id, date, prediction) VALUES (?,?,?)'
				db.prepare(insert_str).run(params)

			}

		}
  	})
  }
})