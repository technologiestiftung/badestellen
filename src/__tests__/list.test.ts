import { render } from '@testing-library/svelte'
import List from '../views/pages/list.svelte'
import { load, loaded, badestellen, createBadestelle } from '../stores/data'
import * as fs from 'fs'
import { csvParse } from 'd3-dsv'

test('should render - List', done => {
  const { getByText, container } = render(List, {})
  expect(() => getByText('Übersicht Badegewässer')).not.toThrow()
  const list = container.querySelectorAll('#list ul li')
  expect(list).toHaveLength(0)
  done()
})

test('should render - List < store', async done => {
  const { container } = render(List, {})

  const data = csvParse(fs.readFileSync(__dirname + '/data/data.csv', 'utf8'))
  const new_build = csvParse(fs.readFileSync(__dirname + '/data/new_build.csv', 'utf8'))

  const dataLength = data.length > new_build.length ? data.length : new_build.length

  let lLoaded = false
  let lBadestellen = []

  loaded.subscribe(state => {
    lLoaded = state
  })

  badestellen.subscribe(b => {
    lBadestellen = b
  })

  await load()
    .then(() => {
      expect(lLoaded).toBe(true)
      expect(lBadestellen).toHaveLength(dataLength)
      const list = container.querySelectorAll('#list li')
      expect(list).toHaveLength(dataLength)
      const listNames = container.querySelectorAll(
        '#list li a span.outer span>span:not(.unresponsive-sub)'
      )
      expect(listNames).toHaveLength(dataLength)

      let gewaesserCount = 0
      lBadestellen.forEach(b => {
        if (b.name.indexOf(b.gewaesser) === -1) {
          gewaesserCount += 1
        }
      })

      const geawesserNames = container.querySelectorAll(
        '#list li a span.outer span>span.unresponsive-sub'
      )
      expect(geawesserNames).toHaveLength(gewaesserCount)

      return loaded.set(false)
    })
    .then(() => {
      const list = container.querySelectorAll('#list ul li')
      expect(list).toHaveLength(0)

      done()
    })
    .catch(err => {
      throw err
    })
})

test('should render - List - simple', done => {
  const b = createBadestelle()
  b.name = 'TestName'
  b.gewaesser = 'TestGewaesser'
  badestellen.set([b])

  loaded.set(true)

  const { container, findByText } = render(List, {})

  expect(() => findByText('TestName')).not.toThrow()
  expect(() => findByText('TestGewaesser')).not.toThrow()
  expect(container.querySelectorAll('.unresponsive-sub').length).toBe(1)
  expect(container.querySelectorAll('#list li').length).toBe(1)

  done()
})

test('should render - List - simple - gewaesser in name', done => {
  const b = createBadestelle()
  b.name = 'TestName'
  b.gewaesser = 'Name'
  badestellen.set([b])

  loaded.set(true)

  const { container, findByText } = render(List, {})

  expect(() => findByText('TestName')).not.toThrow()
  expect(container.querySelectorAll('.unresponsive-sub').length).toBe(0)

  done()
})

test('should render - List - empty', done => {
  badestellen.set([])
  loaded.set(true)

  const { container } = render(List, {})

  expect(container.querySelectorAll('#list li').length).toBe(0)

  done()
})

test('should render - List - empty fields', done => {
  const b = createBadestelle()
  b.name = undefined
  b.gewaesser = undefined
  badestellen.set([b])
  loaded.set(true)

  const { container } = render(List, {})

  expect(container.querySelectorAll('#list li').length).toBe(1)
  expect(container.querySelectorAll('.outer span>span')[0].innerHTML).toBe('undefined')

  done()
})

test('should render - List - partly empty fields', done => {
  const b = createBadestelle()
  b.name = 'TestName'
  b.gewaesser = undefined
  badestellen.set([b])
  loaded.set(true)

  const { container } = render(List, {})

  expect(container.querySelectorAll('#list li').length).toBe(1)
  expect(container.querySelectorAll('.outer span>span')[0].innerHTML).toBe('TestName')
  expect(container.querySelectorAll('.unresponsive-sub').length).toBe(0)

  done()
})
