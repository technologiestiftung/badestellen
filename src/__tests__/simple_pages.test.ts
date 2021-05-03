import { render } from '@testing-library/svelte'
import Impressum from '../views/pages/impressum.svelte'
import Accessibility from '../views/pages/accessibility.svelte'
import DataPolicy from '../views/pages/datapolicy.svelte'
import FAQ from '../views/pages/faq.svelte'

test('should render - Impressum', () => {
  const results = render(Impressum, {})
  expect(() => results.getByText('Impressum')).not.toThrow()
})

test('should render - Accessbility', () => {
  const results = render(Accessibility, {})
  expect(() => results.getByText('Barrierefreiheitserklärung')).not.toThrow()
})

test('should render - DataPolicy', () => {
  const results = render(DataPolicy, {})
  expect(() => results.getByText('Datenschutzerklärung')).not.toThrow()
})

test('should render - FAQ', async () => {
  const {getByText, findAllByText, container, component } = render(FAQ, {})
  expect(() => getByText('FAQ zu den wichtigsten Themen')).not.toThrow()
  const heads = await findAllByText('Allgemeines');
  expect(heads).toHaveLength(2);
  const qs = await findAllByText('An wen kann ich mich wenden, wenn ich mehr wissen möchte?')
  expect(qs).toHaveLength(2);
  const navlist = container.querySelectorAll('#faq-list li')
  expect(navlist).toHaveLength(component.printData.length)
})