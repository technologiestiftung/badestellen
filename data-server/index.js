const formidable = require('formidable'),
      path = require('path'),
      fs = require('fs'),
      express = require('express'),
      http = require('http'),
      config = require(path.join(__dirname, '/config.json') ),
      uploadDir = path.join(__dirname, config.path)

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir)
}

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
          for(let filename in files){

            console.log('UPLOAD COMPLETE', fs.readFileSync(files[filename].path, 'utf8'))
          }

          return res.status(200).json({ uploaded: true })
        }else{
          return res.status(401).json({ error: 'user or pwd invalid.' })
        }

      }
      
    })
})

app.listen(config.port, function() {
 console.log("Listening on " + config.port);
});