const request = require('request')
const d3_dsv = require('d3-dsv')

const parser = d3_dsv.dsvFormat(';')

request({uri:'http://ftp.berlinonline.de/lageso/baden/letzte.csv', encoding:'utf8'}, (error, response, body)=>{

	if(error) console.log(error)

	const csv = parser.parse(body.split('""":').join("'"))

	csv.forEach(c=>{
		const regex = /(\d){1,6}/g
		console.log(c.Sicht.match(regex))
	})

	console.log(csv[0])

	// BadName: 'Alter Hof',
	// Bezirk: 'Steglitz-Zehlendorf',
	// Profil: 'Unterhavel',
	// RSS_Name: 'Alter Hof / Unterhavel',
	// Latitude: '52.43270500',
	// Longitude: '13.14227800',
	// ProfilLink: '"Unterhavel - Alter Hof(Link zum Badegew�sserprofil Unterhavel Alter Hof)"',
	// BadestelleLink: '/lageso/gesundheit/gesundheitsschutz/badegewaesser/badegewaesserprofile/artikel.339134.php',
	// Dat: '"Alter Hof(Link zur Badestelle Alter Hof)"',
	// Sicht: '/lageso/gesundheit/gesundheitsschutz/badegewaesser/badestellen/artikel.344360.php',
	// Eco: '12.09.2017',
	// Ente: '150',
	// Farbe: '15',
	// BSL: '<15',
	// Algen: 'gruen.jpg',
	// Wasserqualitaet: 'B334',
	// cb: '',
	// Temp: '1',
	// PDFLink: '360',
	// Farb_ID: '18,10'

})

