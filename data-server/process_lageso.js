const request = require('request')
const d3_dsv = require('d3-dsv')

const parser = d3_dsv.dsvFormat(';')

request({uri:'http://ftp.berlinonline.de/lageso/baden/letzte.csv', encoding:'utf8'}, (error, response, body)=>{

	if(error) console.log(error)

	console.log(parser.parse(body))

})

