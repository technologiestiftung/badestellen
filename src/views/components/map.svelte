<script lang="typescript">
  import mapbox from 'mapbox-gl'
  import { onMount } from 'svelte'
  import { badestellen, loaded, detailId, badestelle } from '../../stores/data'
  import { push } from 'svelte-spa-router'

  mapbox.accessToken = __global.env.MAPBOXKEY
  let map: mapbox.Map
  let mounted = false
  const center = [13.4244, 52.5047]

  onMount(() => {
    map = new mapbox.Map({
      container: 'map',
      style: 'mapbox://styles/technologiestiftung/cjz09bylr5f8k1cp83p7cwdaf',
      center: center,
      zoom: 10
    })

    map.addControl(new mapbox.NavigationControl(), 'bottom-left')

    map.fitBounds(
      [
        [13.0790332437, 52.3283651024],
        [13.7700526861, 52.6876624308]
      ],
      {
        speed: 999
      }
    )

    mounted = true
  })

  $: if (mounted && $loaded) {
    JSON.parse(JSON.stringify($badestellen))
      .sort((b, a) => {
        if (a.lng < b.lng) {
          return -1
        }
        return 1
      })
      .forEach(b => {
        const el = document.createElement('div')
        el.className = 'marker marker-' + String(b.real_state)
        el.setAttribute('id', 'marker_' + String(b.id))
        el.addEventListener('click', () => {
          push('/detail/' + String(b.id))
            .catch((err) => {console.error(err);})
        })

        const marker = new mapbox.Marker(el, { offset: [-2, -8.5] })
        marker.setLngLat([b.lat, b.lng])
        marker.addTo(map)
      })
  }

  $: if (mounted && $loaded && $detailId >= 0) {
    map.flyTo({
      center: [$badestelle.lat, $badestelle.lng],
      zoom: 14
    })

    // d3.selectAll('.marker').classed('inactive', true)
    // d3.select('#marker_' + id).classed('inactive', false)
  } else if (mounted && $loaded) {
    map.fitBounds(
      [
        [13.0790332437, 52.3283651024],
        [13.7700526861, 52.6876624308]
      ]
    )
  }
</script>

<svelte:head>
  <link
    href="https://api.mapbox.com/mapbox-gl-js/v2.1.1/mapbox-gl.css"
    rel="stylesheet"
  />
</svelte:head>

<div id="map" />
