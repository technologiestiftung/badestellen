const fs = require('fs')

fs.readdirSync(__dirname + '/uploads/').forEach(file => {
  if(file.indexOf('.json')>=0){
  	// console.log(fs.statSync(__dirname + '/uploads/' + file))
  }
})
