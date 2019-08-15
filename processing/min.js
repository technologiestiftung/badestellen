let fs = require('fs')

let geojson = JSON.parse(fs.readFileSync('./data/complete.geojson', 'utf8'))

geojson.features.forEach((f,fi)=>{
    fs.writeFileSync('./data/individual/'+f.properties.data.id+'.json', JSON.stringify(f), 'utf8')
    geojson.features[fi].properties = {
        id:f.properties.data.id,
        title:f.properties.title,
        state:f.properties.details.state,
        date:f.properties.data.dat
    }
})

fs.writeFileSync('./data/all.min.geojson', JSON.stringify(geojson), 'utf8')