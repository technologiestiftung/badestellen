import { render, fireEvent } from '@testing-library/svelte'
import App from '../App.svelte'

test('should render - app', (done) => {
  const {getByText, findByText} = render(App, {})
  expect(() => getByText('Partnernetzwerk')).not.toThrow()
  // loading
  expect(() => findByText('werden geladen...')).not.toThrow()
  // loading complete
  expect(() => findByText('Übersicht Badegewässer')).not.toThrow()
  done()
})

test('should render - map case', async (done) => {
  const {container, findByText} = render(App, {})
  // wait for loading to complete
  await findByText('Übersicht Badegewässer')
  expect(container.querySelectorAll('#map')).toHaveLength(1)

  const aboutLink = container.querySelectorAll('#bade-nav a')[1];
  await fireEvent.click(aboutLink)
  await findByText('Beschreibung Vorhersagemodell')
  expect(container.querySelectorAll('#map')).toHaveLength(0)

  const homeLink = container.querySelectorAll('#bade-nav a')[0];
  await fireEvent.click(homeLink)
  await findByText('Übersicht Badegewässer')
  expect(container.querySelectorAll('#map')).toHaveLength(1)

  const detailLink = container.querySelectorAll('#list li a')[0];
  await fireEvent.click(detailLink)
  await findByText('« zurück zur Übersicht')
  expect(container.querySelectorAll('#map')).toHaveLength(1)

  done()
})