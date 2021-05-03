<script lang="ts">
  import { link, location } from 'svelte-spa-router'

  export let menu: {
    url: string
    label: string
  }[] = []

  let cLocation = ''
  $: if ($location && typeof $location === 'string') {
    cLocation = $location
  }
</script>

{#if menu && menu.length > 0}
  <ul>
    {#each menu as item}
      <li>
        <a
          href={item.url}
          class:active={(item.url !== '/' && cLocation.indexOf(item.url) === 0) ||
            (item.url === '/' && cLocation === item.url)}
          use:link
          >{item.label}
        </a>
      </li>
    {/each}
  </ul>
{/if}
