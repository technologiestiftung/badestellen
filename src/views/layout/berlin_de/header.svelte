<script lang="ts">
  import Menu from '../../components/menu.svelte'
  import {link} from 'svelte-spa-router'

  const menu = [
    { url: '/', label: 'Liste der Badestellen' },
    { url: '/info', label: 'Vorhersagemodell' },
    { url: '/faq', label: 'FAQ' }
  ]

  const metaMenu = [
    { url: '/impressum', label: 'Impressum' },
    { url: '/datenschutz', label: 'Datenschutzerklärung' },
    { url: '/barrierefreiheit', label: 'Digitale Barrierefreiheit' }
  ]
</script>

<header id="header" class="kiekma">
  <!-- Portal.view -->
  <div class="header__row-portalbrand">
    <div class="logo">
      <a href="https://www.berlin.de"><img class="logo" title="Link führt zur Startseite von Berlin.de" alt="Bild zeigt: Berlin.de Logo" src="//www.berlin.de/i9f/r1//images/logo_berlin_m_srgb.svg" /></a>
    </div>
  </div>
  <!-- /Portal.view -->

  <!-- Horizontal.view -->
  <div class="header__row-pageheader">
    <div class="pageheader__logo without-logo">
      <p class="textlogo">
        <a href="#/" title="Link zu: Startseite der Berliner Badestellen">Berliner Badestellen</a>
      </p>
    </div>
    <nav class="pageheader__quicklinks" aria-label="Bereichsnavigation">
      <Menu {menu} />      
    </nav>
    <div class="pageheader__services">
      <div id="servicebuttonAccessibility" class="service-button-overlay js-service-button-overlay accessibility">
        <div class="service-button-overlay__button">
          <button type="button" class="icon-button js-button-overlay-open" aria-haspopup="dialog">
            <i class="icon fas fa-universal-access" aria-hidden="true"></i>
            <span class="aural">Einstellungen zur Barrierefreiheit öffnen</span>
            <span class="text">Barrierefrei</span>
          </button>
        </div>
        <div class="service-button-overlay__overlay overlay js-overlay-container" aria-modal="true" role="dialog">
          <div class="overlay__header">
            <h2 class="heading">Barrierefreiheit</h2>
            <button type="button" class="close-button js-button-overlay-close">
              <i class="fas fa-times" aria-hidden="true"></i>
              <span class="aural">Schließen: Barrierefreiheit</span>
            </button>
          </div>
          <div class="overlay__body">
            <div class="inner">
              <h3>Wie barrierefrei ist diese Webseite?</h3>
              <p><a href="/barrierefreiheit" use:link>Digitale Barrierefreiheit</a></p>
              <h3>Wen können Sie bei Anmerkungen oder Fragen zur digitalen Barrierefreiheit (Feedbackoption) kontaktieren?</h3>
              <p>Name: Stefan Trautmann<br />E-Mail: <a href="mailto:barrierefreiheit@lageso.berlin.de">barrierefreiheit@lageso.berlin.de</a><br />Telefon: (030) 90229 1500</p>
              <h3>Wo gibt es zusätzliche Informationen zur Barrierefreiheit im Land Berlin?</h3>
              <p><a target="_blank" class="extern" href="https://www.berlin.de/moderne-verwaltung/barrierefreie-it/">Barrierefreie Informations- und Kommunikationstechnik (IKT)</a></p>
            </div>
          </div>
        </div>
      </div>
      <div id="servicebuttonMenu" class="service-button-overlay js-service-button-overlay menu">
        <div class="service-button-overlay__button">
          <button type="button" class="icon-button js-button-overlay-open" aria-haspopup="menu">
            <i class="icon fa fa-bars" aria-hidden="true"></i>
            <span class="text">Menü</span>
          </button>
        </div>
        <div class="service-button-overlay__overlay overlay js-overlay-container" aria-modal="true" role="dialog">
          <div class="overlay__header">
            <h2 class="heading">Hauptnavigation</h2>
            <button type="button" class="close-button js-button-overlay-close"><i class="fas fa-times" aria-hidden="true"></i><span class="aural">Menü schließen</span></button>
          </div>
          <div class="overlay__body">
            <nav id="navigation-primary" class="js-navigation-primary" aria-label="Hauptnavigation">
              <div class="tree-wrapper js-navigation-tree-wrapper">
                <Menu {menu} cssClass="navigation-tree"/>
              </div>
              <div class="navigation-meta">
                <h3 class="heading">Weiteres</h3>
                <Menu menu={metaMenu} />
              </div>
              <!-- /Meta.view -->
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div><!-- /#pageheader -->
<!-- /Horizontal.view -->
</header>