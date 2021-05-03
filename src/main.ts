import App from './App.svelte'

const app = new App({
  target: document.querySelector('#app') || document.querySelector('body')
})

export default app
