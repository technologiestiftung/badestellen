import { render, fireEvent } from '@testing-library/svelte'
import Menu from '../views/components/menu.svelte'

const homeUrl = '/';
const homeLabel = 'Home';

const aboutUrl = '/about';
const aboutLabel = 'About';

const menu = [{
  url: homeUrl,
  label: homeLabel
}, {
  url: aboutUrl,
  label: aboutLabel
}]

test('menu - setup', async () => {
  const { container, getByText, findAllByRole, component } = render(Menu, { menu });

  container.querySelectorAll('ul li a').forEach((a, ai) => {
    expect(a).toHaveProperty('href', 'http://localhost/#' + menu[ai].url)
    expect(a.innerHTML).toBe(menu[ai].label)
  })

  expect(component.menu).toBe(menu)

  const links = await findAllByRole('link')
  expect(links).toHaveLength(menu.length)
  menu.forEach((m, mi) => {
    expect(() => getByText(m.label)).not.toThrow()
    expect(links[mi].innerHTML).toBe(m.label)
    expect(links[mi].getAttribute('href')).toBe('#' + m.url)
  });
})

test('menu - navigation', async (done) => {
  const { container } = render(Menu, { menu });

  const aboutLink = container.querySelectorAll('a')[1]
  await fireEvent.click(aboutLink)

  // nothing visually changes besides the class so we need to use a timeout here
  setTimeout(() => {
    const aboutClass = container.querySelectorAll('a')[1].getAttribute('class')
    expect(aboutClass).toBe('active')
    done()
  }, 100)
})

test('menu - empty', () => {
  const menu = []
  const {container} = render(Menu, { menu });

  expect(container.innerHTML).toBe('<div></div>')
})
