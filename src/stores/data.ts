import { writable, Writable, derived, Readable } from 'svelte/store'
import { csvParse, DSVRowString } from 'd3-dsv'

export interface Badestelle {
  id: number
  detail_id: number
  detail_id2: number
  predict_id?: number
  color: string
  prediction: string
  p_date: string
  wasserqualitaet: string
  sicht_txt: string
  eco_txt: string
  ente_txt: string
  temp_txt: string
  algen_txt: string
  cb_txt: string
  state: string
  m_date: string
  real_state: number
  messstelle: string
  name: string
  name_lang: string
  gewaesser: string
  bezirk: string
  strasse: string
  plz: string
  stadt: string
  webseite: string
  gesundheitsamt_name: string
  gesundheitsamt_zusatz: string
  gesundheitsamt_strasse: string
  gesundheitsamt_plz: string
  gesundheitsamt_stadt: string
  gesundheitsamt_mail: string
  gesundheitsamt_telefon: string
  wasserrettung_durch_hilfsorganisationen_dlrg_oder_asb: string
  rettungsschwimmer: string
  barrierefrei: string
  barrierefrei_zugang: string
  barrierefrei_wc: string
  restaurant: string
  imbiss: string
  parken: string
  cyano_moeglich: string
  wc: string
  wc_mobil: string
  hundeverbot: string
  name_lang2: string
  lat: number
  lng: number
  image: string
  letzte_eu_einstufung: string
}

export const badestellen: Writable<Badestelle[]> = writable([])

export const detailId: Writable<number> = writable(-1)

export const badestellenMap: Readable<{ [key: number]: number }> = derived(
  badestellen,
  $badestellen => {
    const map = {}
    $badestellen.forEach((b, bi) => {
      map[b.id] = bi
    })
    return map
  }
)

export const loaded: Writable<boolean> = writable(false)
export const loading: Writable<boolean> = writable(false)

export const badestelle: Readable<Badestelle | null> = derived(
  [badestellen, detailId, loaded, badestellenMap],
  ([$badestellen, $detailId, $loaded, $badestellenMap]) => {
    if ($loaded && $detailId >= 0) {
      return $badestellen[$badestellenMap[$detailId]]
    } else {
      return null
    }
  }
)

export const load = (): Promise<void> => {
  loading.set(true)
  return Promise.all([
    fetch(`${__global.env.URL}/.netlify/functions/swimapi`).then(response =>
      response.json()
    ),
    // fetch wants an absolute url
    fetch(__global.env.URL + '/assets/data/new_build.csv')
      .then(response => response.text())
      .then(txt => {
        return csvParse(txt)
      })
  ]).then(([measurements, info]) => {
    const loadBadestellen: Badestelle[] = []
    measurements.forEach(m => {
      let loadBadestelle = createBadestelle()

      loadBadestelle = addFields(
        loadBadestelle,
        m,
        ['detail_id', 'detail_id2', 'predict_id', 'real_state'],
        'integer'
      )

      loadBadestelle = addFields(
        loadBadestelle,
        m,
        [
          'color',
          'prediction',
          'p_date',
          'wasserqualitaet',
          'sicht_txt',
          'eco_txt',
          'ente_txt',
          'temp_txt',
          'algen_txt',
          'cb_txt',
          'state',
          'm_date'
        ],
        'string'
      )

      // find corresponding data item
      let match: DSVRowString
      info.forEach(i => {
        if (i.detail_id === `${m.detail_id}`) {
          match = i
        }
      })
      if (match) {
        loadBadestelle = addFields(loadBadestelle, match, ['id'], 'integer')
        loadBadestelle = addFields(loadBadestelle, match, ['lat', 'lng'], 'float')

        loadBadestelle = addFields(
          loadBadestelle,
          match,
          [
            'messstelle',
            'name',
            'name_lang',
            'gewaesser',
            'bezirk',
            'strasse',
            'plz',
            'stadt',
            'webseite',
            'gesundheitsamt_name',
            'gesundheitsamt_zusatz',
            'gesundheitsamt_strasse',
            'gesundheitsamt_plz',
            'gesundheitsamt_stadt',
            'gesundheitsamt_mail',
            'gesundheitsamt_telefon',
            'wasserrettung_durch_hilfsorganisationen_dlrg_oder_asb',
            'rettungsschwimmer',
            'barrierefrei',
            'barrierefrei_zugang',
            'barrierefrei_wc',
            'restaurant',
            'imbiss',
            'parken',
            'cyano_moeglich',
            'wc',
            'wc_mobil',
            'hundeverbot',
            'name_lang2',
            'image',
            'letzte_eu_einstufung'
          ],
          'string'
        )
      }

      loadBadestellen.push(loadBadestelle)
    })
    badestellen.set(loadBadestellen)

    loaded.set(true)
  })
}

export const createBadestelle = (): Badestelle => {
  return {
    id: -1,
    detail_id: -1,
    detail_id2: -1,
    predict_id: 0,
    color: '',
    prediction: '',
    p_date: '',
    wasserqualitaet: '',
    sicht_txt: '',
    eco_txt: '',
    ente_txt: '',
    temp_txt: '',
    algen_txt: '',
    cb_txt: '',
    state: '',
    m_date: '',
    real_state: -1,
    messstelle: '',
    name: '',
    name_lang: '',
    gewaesser: '',
    bezirk: '',
    strasse: '',
    plz: '',
    stadt: '',
    webseite: '',
    gesundheitsamt_name: '',
    gesundheitsamt_zusatz: '',
    gesundheitsamt_strasse: '',
    gesundheitsamt_plz: '',
    gesundheitsamt_stadt: '',
    gesundheitsamt_mail: '',
    gesundheitsamt_telefon: '',
    wasserrettung_durch_hilfsorganisationen_dlrg_oder_asb: '',
    rettungsschwimmer: '',
    barrierefrei: '',
    barrierefrei_zugang: '',
    barrierefrei_wc: '',
    restaurant: '',
    imbiss: '',
    parken: '',
    cyano_moeglich: '',
    wc: '',
    wc_mobil: '',
    hundeverbot: '',
    name_lang2: '',
    lat: 0,
    lng: 0,
    image: '',
    letzte_eu_einstufung: ''
  }
}

const addFields = (
  objTarget: Badestelle,
  objSource: DSVRowString,
  fields: string[],
  fieldType: 'integer' | 'string' | 'float'
): Badestelle => {
  fields.forEach(f => {
    let value: number | string | null = objSource[f]

    if (value === null) {
      return null
    }
    if (fieldType === 'integer') {
      value = parseInt(value.toString())
    } else if (fieldType === 'float') {
      value = parseFloat(value.toString())
    }
    objTarget[f] = value
  })
  return objTarget
}
