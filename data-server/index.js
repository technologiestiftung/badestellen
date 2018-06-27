const formidable = require('formidable'),
      path = require('path'),
      request = require('request'),
      fs = require('fs'),
      d3_dsv = require('d3-dsv'),
      parser = d3_dsv.dsvFormat(','),
      cparser = d3_dsv.dsvFormat(';'),
      express = require('express'),
      http = require('http'),
      moment = require('moment'),
      proj4 = require('proj4'),
      config = require(path.join(__dirname, '/config.json') ),
      uploadDir = path.join(__dirname, config.path),
      sqlite = require('better-sqlite3'),
      db = new sqlite(__dirname + '/badestellen.db'),
      backend = require('./backend.js'),
      importer = require('./initial_import.js'),
      predictionsImporter = require('./import_predictions.js'),
      metaImporter = require('./import_metadata.js'),
      lageso = require('./process_lageso.js'),
      builder = require('./build.js')

proj4.defs([
  [
    'EPSG:4326',
    '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees'],
  [
    "EPSG:25833",
    "+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"
  ]
])

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir)
}

//Create tables if they don't exist yet
backend.createDB(db)

//After initial start or a failure, make sure all the existing uploads are imported into the database
importer.import(db, parser, fs)

predictionsImporter.import(db, parser, fs, function(){

  //CRONTAB > twice a day + manual
  lageso.process(db, request, cparser, moment, function(){
    //After all changes in the db, rebuild the system
    metaImporter.import(db, fs, moment, proj4, function(){
      builder.build(db, config, fs, moment, path, cparser, request)
    })
  })
})

let app = express()

app.post('/upload', (req, res, next) => {
    var form = new formidable.IncomingForm()
    form.multiples = true
    form.keepExtensions = true
    form.uploadDir = uploadDir
    form.parse(req, (err, fields, files) => {
      if (err) return res.status(500).json({ error: err })

      if(!('user' in fields) || !('pwd' in fields)){
        if (err) return res.status(401).json({ error: 'user & pwd required.' })
      }else{

        let valid = false, cuser = null

        config.users.forEach(u=>{
          if(u.user == fields.user && u.pwd == fields.pwd){
            valid = true
            cuser = u
          }
        })

        if(valid){
          db.prepare('INSERT INTO events (type,timestamp)VALUES(?,?)').run([cuser.user, moment().format('YYYY-MM-DD HH:mm:ss')])
          for(let filename in files){
            let data = fs.readFileSync(files[filename].path, 'utf8')
            switch(cuser.user){
              case 'kwb':
                //Add to the database
                //Cache data in the system
                predictionsImporter.import(db, parser, fs, function(){
                  builder.build(db, config, fs, moment, path, cparser, request)
                })
              break;
              case 'bwb':
                //Update the details
                metaImporter.import(db, fs, moment, proj4, function(){
                  builder.build(db, config, fs, moment, path, cparser, request)
                })
              break;
              case 'lageso':
                //Current badestellen info
              break;
            }

            //TODO: If processing is done, make sure the temporary files are deleted
          }

          return res.status(200).json({ uploaded: true })
        }else{
          return res.status(401).json({ error: 'user or pwd invalid.' })
        }

      }
      
    })
})

//Test interface
app.post('/test', (req, res, next) => {
  return res.status(200).json({ message: 'all good' })
})

app.get('/', (req, res, next) => {
  return res.status(200).json({ message: 'Hello Berlin' })
})

app.get('/test', (req, res, next) => {
  return res.status(200).json({ message: 'Get Test.' })
})

console.log(config.refresh_secret)

//TODO: Emergency interface for overrides
//Test interface
app.get('/' + config.refresh_secret + '/update', (req, res, next) => {
  db.prepare('INSERT INTO events (type,timestamp)VALUES(?,?)').run(['manual_update', moment().format('YYYY-MM-DD HH:mm:ss')])
  console.log('manual_update')
  lageso.process(db, request, cparser, moment, function(){
    console.log('lageso.process')
    builder.build(db, config, fs, moment, path, cparser, request)
    console.log('build')
    return res.status(200).json({ message: 'all good' })
  })
})

app.get('/' + config.refresh_secret + '/update_cron', (req, res, next) => {
  db.prepare('INSERT INTO events (type,timestamp)VALUES(?,?)').run(['cron_update', moment().format('YYYY-MM-DD HH:mm:ss')])
  console.log('cron_update', moment().toDate())
  lageso.process(db, request, cparser, moment, function(){
    console.log('lageso.process')
    builder.build(db, config, fs, moment, path, cparser, request)
    console.log('build')
    return res.status(200).json({ message: 'all good' })
  })
})

//TODO: Add interfaces to query the data
//TODO: Static access to cached data

app.listen(config.port, function() {
 console.log("Listening on " + config.port);
});