const request = require('request')

const d3_dsv = require('d3-dsv')
const parser = d3_dsv.dsvFormat(';')

const moment = require('moment')

const sqlite = require('better-sqlite3')
const db = new sqlite(__dirname + '/badestellen.db')

function parseNum(str){
	if(str.length==0) return 0
	return parseInt((str.replace('>','')).replace('<',''))
}

request({uri:'http://ftp.berlinonline.de/lageso/baden/letzte.csv', encoding:'utf8'}, (error, response, body)=>{

	if(error) console.log(error)

	const csv = parser.parse(body.split('"').join(''))

	csv.forEach((c,ci)=>{

		let obj = {
			badestellen_id : c.BadestelleLink.match(/(\d){1,6}/g),
			date: moment(c.Dat, 'DD.MM.YYYY'),
			sicht: parseNum(c.Sicht),
			eco: parseNum(c.Eco),
			ente: parseNum(c.Ente),
			algae:parseNum(c.Algen),
			state:(c.Farbe.split('.'))[0],
			quality:parseNum(c.Wasserqualitaet),
			cb:parseNum(c.cb),
			temperature: parseFloat(c.Temp.split(',').join('.'))		
		}

		let params = [
			obj.badestellen_id[0],
			obj.date.format('YYYY-MM-DD'),
			obj.sicht,
			obj.eco,
			obj.ente,
			obj.temperature,
			obj.algae,
			obj.cb,
			c.Sicht,
			c.Eco,
			c.Ente,
			c.Temp,
			c.Algen,
			c.cb,
			c.BSL,
			obj.quality,
			c.Wasserqualitaet,
			obj.state
		]

		//check if the item already exists
		let rows = db.prepare("SELECT id FROM measurements WHERE badestellen_id = ? AND date = ?").all([obj.badestellen_id[0], obj.date.format('YYYY-MM-DD')])
		if(rows.length>0){
			console.log('already exists > run update')

			let update_str = 'UPDATE measurements SET '
			let update_cols = ['sicht','eco','ente','temp','algen','cb','sicht_txt','eco_txt','ente_txt','temp_txt','algen_txt','cb_txt','bsl','wasserqualitaet','wasserqualitaet_txt','state']

			update_cols.forEach((uc,uci)=>{
				if(uci>0) update_str += ','
				update_str += uc + ' = ? '
			})

			update_str += ' WHERE id = ?'

			let n_params = params.slice(2)
			n_params.push(rows[0].id)

			db.prepare(update_str).run(n_params)

		}else{

			console.log('new row')

			let insert_str = 'INSERT INTO measurements (badestellen_id,date,sicht,eco,ente,temp,algen,cb,sicht_txt,eco_txt,ente_txt,temp_txt,algen_txt,cb_txt,bsl,wasserqualitaet,wasserqualitaet_txt,state) VALUES ('
			params.forEach((p,pi)=>{
				if(pi>0) insert_str += ','
				insert_str += '?'
			})
			insert_str += ')'
			db.prepare(insert_str).run(params)

		}

	})

})

