<script>
	import { fade } from 'svelte/transition';
	import Pattern from './Pattern.svelte';
	
	export let features;
	export let path;
	export let stroke;
	export let strokeWidth;
	export let fillOpacity;
	export let fill;
	export let laag;
	export let igsdata;

</script>

<!--
@component
This component renders a map layer with intermunicipal cooperations.
-->

{#if !['igs_bolo_cultuur', 'regio', 'provincies'].includes(laag)}
	<defs>
		<Pattern {laag}></Pattern>
	</defs>
{/if}

{#each features as feature}
	{#if 'igs_bolo_cultuur' && !igsdata}
		<path
			d={path(feature)}
			fill={fill}
			stroke={stroke}
			stroke-width={strokeWidth}
			stroke-linejoin="round"
			fill-opacity={fillOpacity}
			transition:fade
		/>
	{/if}
	{#if laag == 'igs_bolo_cultuur' && igsdata}
	<path
		d={path(feature)}
		fill={igsdata.find((d) => d.igs == feature.id) ? igsdata.find((d) => d.igs == feature.id).colour : 'none'}
		stroke={igsdata.find((d) => d.igs == feature.id) ? igsdata.find((d) => d.igs == feature.id).colour : 'none'}
		stroke-width={strokeWidth}
		stroke-linejoin="round"
		fill-opacity={fillOpacity}
		transition:fade
	/>
{/if}
	<path
		d={path(feature)}
		fill={`url('#${laag}')`}
		stroke={stroke}
		stroke-width={strokeWidth}
		stroke-linejoin="round"
		fill-opacity={1}
		transition:fade
	/>
{/each}

<style>
	path {
		pointer-events: none;
		/*mix-blend-mode: multiply;*/
	}
</style>
