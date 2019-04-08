module.exports = {
  createDB: function(db){
    db.prepare('CREATE TABLE IF NOT EXISTS badestellen (' +
      'id INTEGER UNIQUE PRIMARY KEY, ' +
      'prediction boolean,' +
      'detail_id integer,' +
      'messstelle text,' +
      'name text,' +
      'name_lang text,' +
      'gewaesser text,' +
      'bezirk text,' +
      'strasse text,' +
      'plz text,' +
      'stadt text,' +
      'gesundheitsamt_name text,' +
      'gesundheitsamt_zusatz text,' +
      'gesundheitsamt_strasse text,' +
      'gesundheitsamt_plz text,' +
      'gesundheitsamt_stadt text,' +
      'gesundheitsamt_mail text,' +
      'gesundheitsamt_telefon text,' +
      'wasserrettung_durch_hilfsorganisationen_dlrg_oder_asb boolean,' +
      'rettungsschwimmer boolean,' +
      'barrierefrei boolean,' +
      'barrierefrei_zugang boolean,' +
      'barrierefrei_wc boolean,' +
      'restaurant boolean,' +
      'imbiss boolean,' +
      'parken boolean,' +
      'cyano_moeglich boolean,' +
      'wc boolean,' +
      'wc_mobil boolean,' +
      'hundeverbot boolean,' +
      'name_lang2 text,' +
      'lat real,' +
      'lng real,' +
      'webseite text,' +
      'letzte_eu_einstufung text,' +
      'image text' +
      ')').run();

    db.prepare('CREATE TABLE IF NOT EXISTS predictions (' +
      'id INTEGER UNIQUE PRIMARY KEY AUTOINCREMENT, ' +
      'badestellen_id integer,' +
      'date date,' +
      'prediction text' +
      ')').run();

    db.prepare('CREATE TABLE IF NOT EXISTS events (' +
      'id INTEGER UNIQUE PRIMARY KEY AUTOINCREMENT, ' +
      'type text,' +
      'timestamp datetime' +
      ')').run();

    db.prepare('CREATE TABLE IF NOT EXISTS measurements (' +
      'id INTEGER UNIQUE PRIMARY KEY AUTOINCREMENT, ' +
      'badestellen_id integer,' +
      'date datetime,' +
      'sicht integer,' +
      'eco integer,' +
      'ente integer,' +
      'temp integer,' +
      'algen integer,' +
      'cb integer,' +
      'sicht_txt text,' +
      'eco_txt text,' +
      'ente_txt text,' +
      'temp_txt text,' +
      'algen_txt text,' +
      'cb_txt text,' +
      'bsl text,' +
      'state text,' +
      'wasserqualitaet integer,' +
      'wasserqualitaet_txt integer' +
      ')').run();
  }
};
