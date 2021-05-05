<script lang="ts">
  import Menu from '../../components/menu.svelte'

  const menu = [
    { url: '/impressum', label: 'Impressum' },
    { url: '/datenschutz', label: 'Datenschutzerklärung' },
    { url: '/barrierefreiheit', label: 'Digitale Barrierefreiheit' }
  ]
</script>

<div id="layout-grid__area--contentfooter" class="kiekma">
  <!-- Footer.view -->
  <section id="content-footer" aria-label="Fussbereich mit weiteren Links zu diesem Auftritt">
    <div class="content-footer__brand" aria-hidden="true"></div>
    <nav class="content-footer__links" aria-label="Weiterführende Links">
      <ul class="js-collapse-palm">
        <li class="initial-open">
          <Menu {menu} />
        </li>
      </ul>
    </nav>
  </section>
  <!-- /Footer.view -->
</div>
