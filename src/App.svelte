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
  import Splash from './views/components/splash.svelte'
  import { load, loaded } from './stores/data'
  import { routes } from './lib/routes/root'
  import Map from './views/components/map.svelte'
  import Legend from './views/components/legend.svelte'
  import BerlinHeader from './views/layout/berlin_de/header.svelte'
  import BerlinFooter from './views/layout/berlin_de/footer.svelte'
  import BerlinContentFooter from './views/layout/berlin_de/contentfooter.svelte'

  $: if (!$loaded) {
    load().catch(err => {
      console.error(err)
    })
  }
</script>


<div class="skyscraper palm-hide hidden-phone"></div>
<div id="page-wrapper" class=" container-content "> 
  <div class="container-wrapper container-portal-header" style="display:none !important"></div>
  <BerlinHeader />
  <div role="main" id="layout-grid" class="template-land_start">
    <div id="container">
      <div id="innercontainer">
        <div id="app">

{#if !$loaded}
  <Splash />
{:else}
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

        </div>
      </div>
    </div>
    <BerlinContentFooter />
  </div>
  <BerlinFooter />
</div>