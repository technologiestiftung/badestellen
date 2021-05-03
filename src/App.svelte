<style lang="scss" global>
  @import 'styles/vars';
  @import 'styles/badegewaesser';
  @import 'styles/faq';
  @import 'styles/list';
  @import 'styles/berlin.kombi';
</style>

<script lang="ts">
  import { location } from 'svelte-spa-router'
  import Router from 'svelte-spa-router'
  import Footer from './views/layout/footer.svelte'
  import Menu from './views/components/menu.svelte'
  import Splash from './views/components/splash.svelte'
  import { load, loaded } from './stores/data'
  import { routes } from './lib/routes/root'
  import Map from './views/components/map.svelte'
  import Legend from './views/components/legend.svelte'

  const menu = [
    { url: '/', label: 'Liste der Badestellen' },
    { url: '/info', label: 'Vorhersagemodell' },
    { url: '/faq', label: 'FAQ' }
  ]

  $: if (!$loaded) {
    load().catch(err => {
      console.error(err)
    })
  }
</script>

{#if !$loaded}
  <Splash />
{:else}
  <nav id="bade-nav">
    <Menu {menu} />
  </nav>
  {#if $location === '/' || $location.indexOf('detail/') >= 0}
    <Map />
  {/if}
  <main>
    <div
      id="content"
      class:nomap={$location !== '/' && $location.indexOf('detail/') === -1}
    >
      <div id="home">
        {#if $location === '/'}
          <Legend />
        {/if}
        <Router {routes} />
      </div>
    </div>
  </main>
{/if}
<Footer />
