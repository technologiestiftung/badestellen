import { render } from '@testing-library/svelte'
import Detail from '../views/pages/detail.svelte'
import {load, loaded, badestellen, detailId, createBadestelle} from '../stores/data'

test('should render - Detail', (done) => {
  const {container} = render(Detail, {})
  expect(container.innerHTML).toBe('<div></div>')
  done()
})

test('should render - Detail < store', async (done) => {
   const {container} = render(Detail, {})

  let lBadestellen = [];

  badestellen.subscribe((b) => {
    lBadestellen = b;
  })

  await load()
    .then(() => {
      return detailId.set(lBadestellen[0].id)
    })
    .then(() => {
      expect(container.querySelector('h1 span').innerHTML).toBe(lBadestellen[0].bezirk)
      done()
    })
    .catch((err) => {throw err;})
})

test('should render - Detail < store via params', async (done) => {
 let lBadestellen = [];

 badestellen.subscribe((b) => {
   lBadestellen = b;
 })

 await load()
   .then(() => {
    const {container, findByText } = render(Detail, { params: { id: lBadestellen[0].id }})
    expect(container.querySelector('h1 span').innerHTML).toBe(lBadestellen[0].bezirk)
    expect(container.querySelector('h1').innerHTML).toBe(`${lBadestellen[0].name_lang} <span>${lBadestellen[0].bezirk}</span>`)

    expect(container.querySelector('.bade-routing-link').getAttribute('href')).toBe('https://maps.google.com/maps?daddr=' + String(lBadestellen[0].lng) + ',' + String(lBadestellen[0].lat))

    const keys = ['name_lang', 'bezirk']
    keys.forEach((k) => {
      expect(() => findByText(lBadestellen[0][k])).not.toThrow()
    })

    expect(container.querySelector('.detail-amt>span').innerHTML).toBe(`${lBadestellen[0].gesundheitsamt_name}<br> ${lBadestellen[0].gesundheitsamt_zusatz}<br> ${lBadestellen[0].gesundheitsamt_strasse}<br> ${parseInt(lBadestellen[0].gesundheitsamt_plz)} ${lBadestellen[0].gesundheitsamt_stadt}<br><br>`)
    done()
   })
   .catch((err) => {throw err;})
})

test('should render - Detail - iphone link', async (done) => {
  const platformGetter = jest.spyOn(window.navigator, 'platform', 'get')
  platformGetter.mockReturnValue('iPhone')

  let lBadestellen = []
  badestellen.subscribe((b) => {
    lBadestellen = b;
  })

  await load()
    .then(() => {
      const {container} = render(Detail, { params: { id: lBadestellen[0].id }})
      expect(container.querySelector('.bade-routing-link').getAttribute('href')).toContain('maps://maps.google.com/maps?daddr=')
      done()
    })
     .catch((err) => {throw err;})
})

const alts = [
  'Restaurant',
  'Barrierefrei',
  'Barrierefreier Zugang zum Wasser',
  'Imbiss',
  'Parkmöglichkeiten',
  'WC verfügbar',
  'WC ist nicht barrierefrei',
  'Hundeverbot',
];

const measurementsText = [
  { key: 'sicht_txt', label: 'Sichttiefe', unit: 'cm' },
  { key: 'eco_txt', label: 'Escherichia coli', unit: 'pro 100 ml' },
  { key: 'ente_txt', label: 'Intestinale Enterokokken', unit: 'pro 100 ml' },
  { key: 'temp_txt', label: 'Wassertemperatur', unit: '°C' },
  { key: 'algen_txt', label: 'Erhöhtes Algenauftreten', unit: '' },
  { key: 'cb_txt', label: 'Coliforme Bakterien', unit: 'pro 100 ml' }
]

test('should render - Detail < set empty badestelle', (done) => {
  const demoId = 999;
  
  loaded.set(true)

  const b = createBadestelle();
  b.id = demoId;
  delete b.gesundheitsamt_name
  badestellen.set([b])

  detailId.set(demoId)
 
  const {container, getAllByAltText} = render(Detail, { params: { id: demoId }})

  expect(container.querySelector('h1 span').innerHTML).toBe('')
  expect(container.querySelector('h1').innerHTML).toBe(' <span></span>')
  expect(container.querySelectorAll('#lastPredict')).toHaveLength(0)
  expect(container.querySelectorAll('.measurement_table tr')).toHaveLength(0)

  for (let a = 0; a < alts.length; a += 1) {
    expect(() => getAllByAltText(alts[a])).toHaveLength(0)
  }

  for (let m = 0; m < measurementsText.length; m += 1) {
    expect(() => getAllByAltText(measurementsText[m].label)).toHaveLength(0)
  }

  expect(container.querySelector('.detail-amt>span').innerHTML).toBe(`undefined<br> <br> <br> NaN <br><br>`)

  done()
})

test('should render - Detail < full badestelle', async (done) => {
  const demoId = 999;
  
  loaded.set(true)

  const b = createBadestelle();
  b.p_date = '01.01.2020'
  b.barrierefrei = '1'
  b.barrierefrei_zugang = '1'
  b.restaurant = '1'
  b.imbiss = '1'
  b.hundeverbot = '1'
  b.wc = '1'
  b.parken = '1'
  b.real_state = 1
  // b.barrierefrei_wc = '1'
  b.sicht_txt = '1'
  b.eco_txt = '1'
  b.ente_txt = '1'
  b.temp_txt = '1'
  b.algen_txt = 'A'
  b.cb_txt = '1'
  b.id = demoId;
  badestellen.set([b])

  detailId.set(demoId)
 
  const {container, findAllByAltText, findByText, findAllByText} = render(Detail, { params: { id: demoId }})

  expect(container.querySelector('h1 span').innerHTML).toBe('')
  expect(container.querySelector('h1').innerHTML).toBe(' <span></span>')
  expect(container.querySelectorAll('#lastPredict')).toHaveLength(1)
  expect(container.querySelectorAll('.measurement_table tr')).toHaveLength(measurementsText.length)

  for(let a = 0; a < alts.length; a += 1) {
    const altEls = await findAllByAltText(alts[a])
    expect(altEls.length).toBeGreaterThan(0)
  }

  for (let m = 0; m < measurementsText.length; m += 1) {
    if (measurementsText[m].key === 'algen_txt') {
      const altEls = await findAllByText('Ja')
      expect(altEls.length).toBeGreaterThan(0)
    } else {
      const altEls = await findAllByText(`${b[measurementsText[m].key]} ${measurementsText[m].unit}`)
      expect(altEls.length).toBeGreaterThan(0)
    }
    const altEls = await findAllByText(measurementsText[m].label)
    expect(altEls.length).toBeGreaterThan(0)
  }

  expect(() => findByText('Zum Baden geeignet')).not.toThrow()

  done()
})

test('should render - Detail - cleanWeb', (done) => {
  const demoId = 999;
  
  loaded.set(true)

  const b = createBadestelle();
  b.webseite = 'http://url/'
  b.id = demoId;
  badestellen.set([b])

  detailId.set(demoId)
 
  const {container} = render(Detail, { params: { id: demoId }})

  expect(container.querySelector('.bade-webseite').innerHTML).toBe('url')
  done()
})

test('should render - Detail - no algae', async (done) => {
  const demoId = 999;
  
  loaded.set(true)

  const b = createBadestelle();
  b.algen_txt = 'NA'
  b.id = demoId;
  badestellen.set([b])

  detailId.set(demoId)
 
  const {findAllByText} = render(Detail, { params: { id: demoId }})

  const altEls = await findAllByText('Nein')
  expect(altEls.length).toBeGreaterThan(0)

  done()
})

const euTests: string[][] = [
  ['mangelhaft', 'poor'],
  ['ausreichend', 'sufficient'],
  ['ausgezeichnet', 'excellent'],
  ['gut', 'good']
]

euTests.forEach((euSet) => {
  test('should render - Detail - euSign - ' + euSet[0], (done) => {
    const demoId = 999;
    
    loaded.set(true)
  
    const b = createBadestelle();
    b.letzte_eu_einstufung = euSet[0]
    b.name_lang = 'Testname'
    b.id = demoId;
    badestellen.set([b])
  
    detailId.set(demoId)
   
    const {container, getByText} = render(Detail, { params: { id: demoId }})
  
    expect(() => getByText('Testname')).not.toThrow()
  
    expect(container.querySelector('img.eu-class').getAttribute('src')).toBe(`/assets/images/eu-signs/${euSet[1]}@2x.png`)
    done()
  })
})
