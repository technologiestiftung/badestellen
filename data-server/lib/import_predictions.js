/* eslint-disable camelcase */
const path = require('path');
const folderPath = path.resolve(__dirname, '../uploads/');
module.exports = {
  import: (db, parser, fs, callback)=>{

    fs.readdirSync(folderPath).forEach(file => {
      if (file.indexOf('.csv')>=0){
        let csv = parser.parse(fs.readFileSync(`${folderPath}/${file}`, 'utf8'));
        csv.forEach(c=>{
          if (('id' in c) && ('badname' in c) && ('Datum' in c) && ('Vorhersage' in c) && c.id != null){

            let params = [
              c.id,
              c.Datum,
              c.Vorhersage
            ];

            //check if the item already exists
            let rows = db.prepare('SELECT id FROM predictions WHERE badestellen_id = ? AND date = ?').all([c.id, c.Datum]);
            if (rows.length>0){
              // console.log('already exists', params);
            } else {

              let insert_str = 'INSERT INTO predictions (badestellen_id, date, prediction) VALUES (?,?,?)';
              db.prepare(insert_str).run(params);

            }

          }
        });
      }
    });

    callback();
  }
};
