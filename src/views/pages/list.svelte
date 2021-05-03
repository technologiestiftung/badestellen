<script lang="ts">
  import { loaded, badestellen, detailId} from '../../stores/data'
  import type {Badestelle} from '../../stores/data'
  import { link } from 'svelte-spa-router'

  detailId.set(-1)

  $: sortedBadestellen = (<Badestelle[]>JSON.parse(JSON.stringify($badestellen))).sort(
    (a, b) => {
      if (a.name < b.name) {
        return -1
      }
      // no equal names, so skip 0
      return 1
    }
  )
</script>

<div id="list-container">
  <h2>Übersicht Badegewässer</h2>
  <div class="predict-list-note">
    Bei den mit einem <span class="largestar">*</span> ausgezeichneten Badestellen wird
    die Bewertung durch ein Vorhersagemodel unterstützt.
    <a href="/info" use:link>Mehr zum Vorhersagemodell erfahren »</a>
  </div>
  <div id="list" role="listbox" aria-live="polite">
    <ul>
      {#if $loaded}
        {#each sortedBadestellen as badestelle}
          <li
            style="background-image: url(/assets/images/badestellen/{badestelle.id}.jpg)"
          >
            <a href={`/detail/${String(badestelle.id)}`} use:link>
              <span class="outer">
                <img
                  alt={badestelle.name}
                  class="stateimg state-{badestelle.real_state}"
                  class:substate={badestelle.name && badestelle.gewaesser && badestelle.name.indexOf(badestelle.gewaesser) === -1}
                  src="/assets/images/trans.gif"
                />
                <span>
                  <span>{badestelle.name}</span>
                  {#if badestelle.name && badestelle.gewaesser && badestelle.name.indexOf(badestelle.gewaesser) === -1}
                    <br /><span class="unresponsive-sub">{badestelle.gewaesser}</span>
                  {/if}
                </span>
              </span>
            </a>
          </li>
        {/each}
      {/if}
    </ul>
  </div>
</div>
