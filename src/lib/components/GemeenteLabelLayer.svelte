<script>
    import { fade } from 'svelte/transition';
	import { probleemgemeenten } from '$lib/stores/stores.js';
	export let gemeenten;
    export let projection;
	export let showAlleGemeenteNamen

	const biggestMunicipalities = ['Antwerpen', 'Gent', 'Brugge', 'Leuven', 'Hasselt', 'Aalst', 'Mechelen', 'Sint-Niklaas', 'Oostende', 'Kortrijk', 'Genk', 'Roeselare', 'Turnhout']
</script>

<!--
@component
This component renders the names of municipalities on top of the maps.

All the names are rendered if showAlleGemeenteNamen is true
-->

<g class="gemeente-labels">
{#each gemeenten as centroid}
	{#if showAlleGemeenteNamen}
	<text
		class={$probleemgemeenten.includes(centroid.properties.niscode) ? "municipality-label probleem" :  "municipality-label"}
		x={projection(centroid.properties.centroid)[0]}
		y={projection(centroid.properties.centroid)[1]}
		style:font-family={'Helvetica'}
		text-anchor={'middle'}
		transition:fade>{centroid.properties.naam}</text
	>
{/if}
{/each}
</g>

<style>
    .municipality-label {
		fill: grey;
		font-size: 12px;
		text-shadow: -1px -1px white, -1px 1px white, 1px 1px white, 1px -1px white, -1px 0 white,
			0 1px white, 1px 0 white, 0 -1px white;
        pointer-events: none;
	}
	.municipality-label.probleem {
		fill: red;
		font-size: 14px;
	}
</style>
