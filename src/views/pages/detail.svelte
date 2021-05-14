<script lang="ts">
  import { detailId, badestelle, loaded } from '../../stores/data'
  import { link } from 'svelte-spa-router'
  import { onMount } from 'svelte'
  import * as animateScroll from 'svelte-scrollto'
  animateScroll.scrollTo(0)

  export let params = { id: null }

  let mounted = false

  onMount(() => {
    mounted = true
  })

  $: if (
    $loaded &&
    mounted &&
    'id' in params &&
    params.id &&
    !isNaN(parseInt(params.id.toString())) &&
    params.id >= 0
  ) {
    detailId.set(params.id)
  }

  const stufentext = {
    1: 'Zum Baden geeignet',
    2: 'Zum Baden geeignet',
    11: 'Zum Baden geeignet',
    12: 'Zum Baden geeignet',
    3: 'Vom Baden wird abgeraten',
    4: 'Vom Baden wird abgeraten',
    13: 'Vom Baden wird abgeraten',
    14: 'Vom Baden wird abgeraten',
    10: 'Vom Baden wird abgeraten',
    9: 'Keine Angabe',
    5: 'Badeverbot',
    6: 'Badeverbot',
    15: 'Badeverbot',
    16: 'Badeverbot'
  }

  const measurementsText = [
    { key: 'sicht_txt', label: 'Sichttiefe', unit: 'cm' },
    { key: 'eco_txt', label: 'Escherichia coli', unit: 'pro 100 ml' },
    { key: 'ente_txt', label: 'Intestinale Enterokokken', unit: 'pro 100 ml' },
    { key: 'temp_txt', label: 'Wassertemperatur', unit: '°C' },
    { key: 'algen_txt', label: 'Erhöhtes Algenauftreten', unit: '' }
    // { key: 'cb_txt', label: 'Coliforme Bakterien', unit: 'pro 100 ml' }
  ]

  let locationLink: string
  let euSign: string

  $: if ($loaded && $detailId >= 0) {
    locationLink =
      'https://maps.google.com/maps?daddr=' + String($badestelle.lng) + ',' + String($badestelle.lat)

    if (
      /* if we're on iOS, open in Apple Maps */
      navigator.platform.indexOf('iPhone') !== -1 ||
      navigator.platform.indexOf('iPod') !== -1 ||
      navigator.platform.indexOf('iPad') !== -1
    ) {
      locationLink =
        'maps://maps.google.com/maps?daddr=' + String($badestelle.lng) + ',' + String($badestelle.lat)
    }

    switch ($badestelle.letzte_eu_einstufung.toLowerCase()) {
      case 'mangelhaft':
        euSign = 'poor'
        break
      case 'ausreichend':
        euSign = 'sufficient'
        break
      case 'ausgezeichnet':
        euSign = 'excellent'
        break
      case 'gut':
        euSign = 'good'
        break
    }
  }

  const cleanWeb = (str: string): string => {
    if (str.substr(str.length - 1, 1) === '/') {
      str = str.substr(0, str.length - 1)
    }
    return str.replace('http://', '')
  }

  const makeHTTPS = (url: string): string => {
    return url.replace('http://', 'https://')
  }

  const googleCoords = (coord: number): string => {
    return coord.toFixed(6).replace('.', '')
  }
</script>

{#if $loaded && $badestelle && $detailId >= 0}
  <div id="detail" aria-live="polite" role="article" style="display: block;">
    <div class="detail-header">
      <a href="/" use:link id="closebtn">«&nbsp;zurück&nbsp;zur&nbsp;Übersicht</a>
      <h1>{$badestelle.name_lang} <span>{$badestelle.bezirk}</span></h1>
      <hr class="closer" />
    </div>
    <div class="detail-body">
      <div class="detail-image">
        <img
          src={makeHTTPS($badestelle.image)}
          alt={$badestelle.name}
          title={$badestelle.name}
        />
        <span class="caption">Bild: LAGeSo</span>
      </div>
      <div class="detail-location">
        <h3 class="title">Anschrift</h3>
        {$badestelle.name_lang}<br />
        {$badestelle.strasse}<br />
        {parseInt($badestelle.plz)}
        {$badestelle.stadt}<br />
        {#if $badestelle.webseite.length > 0}
          <a href={$badestelle.webseite}><span class="bade-webseite">{cleanWeb($badestelle.webseite)}</span></a
          ><br />
        {/if}
        <br />
        <a class="bade-routing-link" href={locationLink}>
          <img
            src="/assets/images/signs/location@2x.png"
            alt="Route berechnen"
            width="30"
            height="30"
          />&nbsp;<span>Route berechnen</span>
        </a><br />
        <a
          href="http://www.fahrinfo-berlin.de/Fahrinfo/bin/query.bin/dn?seqnr=&amp;ident=&amp;ZID=A=16@X={googleCoords(
            $badestelle.lng
          )}@Y={googleCoords(
            $badestelle.lat
          )}@O=WGS84%2052%B027%2747%20N%2013%B010%2747%20E&amp;ch"
        >
          <img
            src="/assets/images/signs/location@2x.png"
            alt="Anfahrt mit der BVG"
            width="30"
            height="30"
          />&nbsp;<span>Anfahrt mit der BVG</span>
        </a><br />
        <h3>Wasserqualität</h3>
        <span class="stufen-icon stufen-{$badestelle.real_state}" />{stufentext[
          $badestelle.real_state
        ]}<br />
        <span class="small">
          (Letzte Messung: {$badestelle.m_date}
          {#if $badestelle.p_date.length > 0}
            <span id="lastPredict">Letzte Prognose: {$badestelle.p_date}</span>
          {/if})
        </span>
        {#if $badestelle.sicht_txt || $badestelle.eco_txt || $badestelle.ente_txt || $badestelle.temp_txt || $badestelle.algen_txt || $badestelle.cb_txt}
          <table class="measurement_table" cellpadding="0">
            <tbody>
              {#each measurementsText as m, mi}
                {#if $badestelle[m.key] && $badestelle[m.key].length > 0}
                  <tr class="row-{mi + 1}">
                    <th>{m.label}</th>
                    <td
                      >{m.key === 'algen_txt'
                        ? $badestelle[m.key] === 'A'
                          ? 'Ja'
                          : 'Nein'
                        : $badestelle[m.key]}
                      {m.unit}</td
                    >
                  </tr>
                {/if}
              {/each}
            </tbody>
          </table>
        {/if}
        {#if $badestelle.predict_id > 0}
          <span class="prediction">
            <img
              src="/assets/images/signs/prediction@2x.png"
              alt=""
              width="30"
              height="30"
            />* Die hier angezeigte Bewertung wird unterstützt durch eine neuartige
            tagesaktuelle Vorhersagemethode.
            <a href="/info" use:link>Erfahren Sie mehr&nbsp;»</a>
          </span>
        {/if}
        <div class="detail-eu">
          <h3 class="title">EU-Einstufung</h3>
          <p class="small">Auswertung der letzten vier Jahre.</p>
          <span class="eu-ranks">
            <img
              class="eu-class"
              src="/assets/images/eu-signs/{euSign}@2x.png"
              alt="Badegewässerqualität {$badestelle.letzte_eu_einstufung}"
              width="92"
              height="81"
            />
            <img
              src="/assets/images/eu-signs/legend_excellent@2x.png"
              alt="Ausgezeichnet"
              width="49"
              height="14"
            />&nbsp;Ausgezeichnet<br />
            <img
              class="first"
              src="/assets/images/eu-signs/legend_good@2x.png"
              alt="Gut"
              width="49"
              height="14"
            />&nbsp;Gut<br />
            <img
              src="/assets/images/eu-signs/legend_sufficient@2x.png"
              alt="Ausreichend"
              width="49"
              height="14"
            />&nbsp;Ausreichend<br />
            <img
              src="/assets/images/eu-signs/legend_poor@2x.png"
              alt="Mangelhaft"
              width="49"
              height="14"
            />&nbsp;Mangelhaft
          </span><br />
        </div>
      </div>
      <div class="detail-addon">
        <h3 class="title">Weitere Angaben zur Badesstelle</h3>
        <ul>
          {#if $badestelle.cyano_moeglich === '1'}
            <li>
              <img
                src="/assets/images/signs/cyano@2x.png"
                alt="Cyanobakterien massenhaft möglich (Blaualgen)"
                width="30"
                height="30"
              />&nbsp;Cyanobakterien massenhaft möglich (Blaualgen)
            </li>
          {/if}
          {#if $badestelle.wasserrettung_durch_hilfsorganisationen_dlrg_oder_asb === '1' || $badestelle.rettungsschwimmer === '1'}
            <li>
              <img
                src="/assets/images/signs/rescue@2x.png"
                alt="Wasserrettung zeitweise"
                width="30"
                height="30"
              />&nbsp;Wasserrettung zeitweise
            </li>
          {/if}
          {#if $badestelle.barrierefrei !== '1'}
            <li>
              <img
                src="/assets/images/signs/barrierefrei-not@2x.png"
                alt="Nicht barrierefrei"
                width="30"
                height="30"
              />&nbsp;Nicht barrierefrei
            </li>
          {:else}
            <li>
              <img
                src="/assets/images/signs/barrierefrei@2x.png"
                alt="Barrierefrei"
                width="30"
                height="30"
              />&nbsp;Barrierefrei
            </li>
          {/if}
          {#if $badestelle.barrierefrei_zugang !== '1'}
            <li>
              <img
                src="/assets/images/signs/barrierefrei-not@2x.png"
                alt="Zugang zum Wasser nicht barrierefrei"
                width="30"
                height="30"
              />&nbsp;Zugang zum Wasser nicht barrierefrei
            </li>
          {:else}
            <li>
              <img
                src="/assets/images/signs/barrierefrei@2x.png"
                alt="Barrierefreier Zugang zum Wasser"
                width="30"
                height="30"
              />&nbsp;Barrierefreier Zugang zum Wasser
            </li>
          {/if}
          {#if $badestelle.restaurant === '1'}
            <li>
              <img
                src="/assets/images/signs/restaurant@2x.png"
                alt="Restaurant"
                width="30"
                height="30"
              />&nbsp;Restaurant
            </li>
          {/if}
          {#if $badestelle.imbiss === '1'}
            <li>
              <img
                src="/assets/images/signs/imbiss@2x.png"
                alt="Imbiss"
                width="30"
                height="30"
              />&nbsp;Imbiss
            </li>
          {/if}
          {#if $badestelle.parken === '1'}
            <li>
              <img
                src="/assets/images/signs/parken@2x.png"
                alt="Parkmöglichkeiten"
                width="30"
                height="30"
              />&nbsp;Parkmöglichkeiten
            </li>
          {/if}
          {#if $badestelle.wc === '1'}
            <li>
              <img
                src="/assets/images/signs/toilette@2x.png"
                alt="WC verfügbar"
                width="30"
                height="30"
              />&nbsp;WC verfügbar
            </li>
            {#if $badestelle.barrierefrei_wc !== '1'}
              <li>
                <img
                  src="/assets/images/signs/barrierefrei-not@2x.png"
                  alt="WC ist nicht barrierefrei"
                  width="30"
                  height="30"
                />&nbsp;WC ist nicht barrierefrei
              </li>
            {/if}
          {:else if $badestelle.wc_mobil === '1'}
            <li>
              <img
                src="/assets/images/signs/toilette@2x.png"
                alt="Mobiles WC verfügbar"
                width="30"
                height="30"
              />&nbsp;Mobiles WC verfügbar
            </li>
            {#if $badestelle.barrierefrei_wc !== '1'}
              <li>
                <img
                  src="/assets/images/signs/barrierefrei-not@2x.png"
                  alt="WC ist nicht barrierefrei"
                  width="30"
                  height="30"
                />&nbsp;WC ist nicht barrierefrei
              </li>
            {/if}
          {/if}
          {#if $badestelle.hundeverbot === '1'}
            <li>
              <img
                src="/assets/images/signs/hundeverbot@2x.png"
                alt="Hundeverbot"
                width="30"
                height="30"
              />&nbsp;Hundeverbot
            </li>
          {:else}
            <li>
              <img
                src="/assets/images/signs/hundeverbot-not@2x.png"
                alt="Kein Hundeverbot"
                width="30"
                height="30"
              />&nbsp;Kein Hundeverbot
            </li>
          {/if}
        </ul>
      </div>
      <div class="detail-amt">
        <h3 class="title">Zuständiges Gesundheitsamt</h3>
        <span>
          {$badestelle.gesundheitsamt_name}<br />
          {$badestelle.gesundheitsamt_zusatz}<br />
          {$badestelle.gesundheitsamt_strasse}<br />
          {parseInt($badestelle.gesundheitsamt_plz)}
          {$badestelle.gesundheitsamt_stadt}<br /><br />
        </span>
        <a href="mailto:{$badestelle.gesundheitsamt_mail}">
          <img
            src="/assets/images/signs/email@2x.png"
            alt="Email"
            width="30"
            height="30"
          />&nbsp;<span>{$badestelle.gesundheitsamt_mail}</span>
        </a><br />
        <a href="tel:{parseInt($badestelle.gesundheitsamt_telefon)}">
          <img
            src="/assets/images/signs/phone@2x.png"
            alt="Telefon"
            width="30"
            height="30"
          />&nbsp;<span>{parseInt($badestelle.gesundheitsamt_telefon)}</span>
        </a>
      </div>
    </div>
  </div>
{/if}
