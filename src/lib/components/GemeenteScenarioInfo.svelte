<script>
    import ScenarioSelect from '$lib/components/ScenarioSelect.svelte';
	import ProbleemGemeenteCheckbox from './ProbleemGemeenteCheckbox.svelte';
	export let activeGemeente;
	export let clickPosition;
	export let showInfo;
	export let w;
	export let h;

	function handleClick() {
		showInfo = false;
		activeGemeente = null;
	}

</script>

<!--
@component
This component shows a popup on top of the internal map when the user clicks on a municipality.

The ScenarioSelect component is a dropdown to assign a municipality to a different intermunicipal cooperation
-->

<div class="background-layer" on:click={() => handleClick()}></div>

<div
	class="gemeente-info"
	style:left={clickPosition[0] < w - 380 ? clickPosition[0] + 30 + 'px' : 'auto'}
    style:right={clickPosition[0] > w - 380 ? w - clickPosition[0] + 30 + 'px' : 'auto'}
	style:top={clickPosition[1] < h - 400 ? clickPosition[1] + 'px' : 'auto'}
    style:bottom={clickPosition[1] > h - 400 ? h - clickPosition[1] + 'px' : 'auto'}
>
	<button class="close-button" on:click={() => handleClick()}>X</button>
	<h3>{activeGemeente.properties.naam}</h3>

    <ScenarioSelect {activeGemeente} laag='igs_bolo_cultuur'></ScenarioSelect>
	<ScenarioSelect {activeGemeente} laag='igs_cultuur'></ScenarioSelect>
    <ScenarioSelect {activeGemeente} laag='uitpas'></ScenarioSelect>
    <ScenarioSelect {activeGemeente} laag='bibnetwerk'></ScenarioSelect>
    <ScenarioSelect {activeGemeente} laag='erfgoedcel'></ScenarioSelect>
    <ScenarioSelect {activeGemeente} laag='ioed'></ScenarioSelect>
    <ScenarioSelect {activeGemeente} laag='ccnetwerk'></ScenarioSelect>
    <ScenarioSelect {activeGemeente} laag='sportnetwerk'></ScenarioSelect>
    <ScenarioSelect {activeGemeente} laag='jeugdnetwerk'></ScenarioSelect>
	<ScenarioSelect {activeGemeente} laag='avansa'></ScenarioSelect>
	<ScenarioSelect {activeGemeente} laag='regio'></ScenarioSelect>
	<ScenarioSelect {activeGemeente} laag='regioconsulent'></ScenarioSelect>

	<ProbleemGemeenteCheckbox niscode={activeGemeente.properties.niscode}></ProbleemGemeenteCheckbox>

</div>

<style>
	.background-layer {
		position: absolute;
		left: 0px;
		top: 0px;
		width: 100%;
		height: 100vh;
		background-color: black;
		opacity: 0;
	}
	.gemeente-info {
		position: absolute;
		background-color: white;
		padding: 8px;
		max-width: 350px;
		box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.2);
	}
	.close-button {
		position: absolute;
		top: 0px;
		right: 0px;
		border: none;
		padding: 0.5rem;
		background-color: inherit;
		font-weight: 700;
		cursor: pointer;
	}
	h3 {
		font-family: 'DrukWide';
	}
</style>
