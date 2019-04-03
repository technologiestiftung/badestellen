const path = require('path');
module.exports = {

  import : (db, parser, fs)=>{
    const filePath = path.resolve(__dirname, '../data/base.csv');
    const csv = parser.parse(fs.readFileSync(filePath, 'utf8'));

    function bool(str){
      return (str=='true')?1:0;
    }

    csv.forEach(c=>{

      let params = [
        c.id,
        bool(c.prediction),
        c.detail_id,
        c.messstelle,
        c.name,
        c.name_lang,
        c.gewaesser,
        c.bezirk,
        c.strasse,
        c.plz,
        c.stadt,
        c.gesundheitsamt_name,
        c.gesundheitsamt_zusatz,
        c.gesundheitsamt_strasse,
        c.gesundheitsamt_plz,
        c.gesundheitsamt_stadt,
        c.gesundheitsamt_mail,
        c.gesundheitsamt_telefon,
        bool(c.wasserrettung_durch_hilfsorganisationen_dlrg_oder_asb),
        bool(c.rettungsschwimmer),
        bool(c.barrierefrei),
        bool(c.barrierefrei_zugang),
        bool(c.barrierefrei_wc),
        bool(c.restaurant),
        bool(c.imbiss),
        bool(c.parken),
        bool(c.cyano_moeglich),
        bool(c.wc),
        bool(c.wc_mobil),
        bool(c.hundeverbot),
        c.name_lang2,
        parseFloat(c.lat),
        parseFloat(c.lng),
        c.image
      ];

      //check if the item already exists

      let rows = db.prepare('SELECT detail_id FROM badestellen WHERE detail_id = ?').all([c.detail_id]);
      if (rows.length>0){
        // // console.log('already exists');
      } else {

        let insert_str = 'INSERT INTO badestellen (id,prediction,detail_id,messstelle,name,name_lang,gewaesser,bezirk,strasse,plz,stadt,gesundheitsamt_name,gesundheitsamt_zusatz,gesundheitsamt_strasse,gesundheitsamt_plz,gesundheitsamt_stadt,gesundheitsamt_mail,gesundheitsamt_telefon,wasserrettung_durch_hilfsorganisationen_dlrg_oder_asb,rettungsschwimmer,barrierefrei,barrierefrei_zugang,barrierefrei_wc,restaurant,imbiss,parken,cyano_moeglich,wc,wc_mobil,hundeverbot,name_lang2,lat,lng,image) VALUES (';
        params.forEach((p,pi)=>{
          if (pi>0) insert_str += ',';
          insert_str += '?';
        });
        insert_str += ')';

        db.prepare(insert_str).run(params);

      }

    });
  }
};
