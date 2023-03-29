<script>
	import { onMount } from 'svelte';
	import { csv } from 'd3-fetch';
	import { feature } from 'topojson-client';
	import { geoMercator, geoPath } from 'd3-geo';
	import centroid from '@turf/centroid';
	import { colorScale } from '$lib/styles/styles.js';
	import { scenarios, probleemgemeenten } from '$lib/stores/stores.js';

	import GemeenteScenarioInfo from '$lib/components/GemeenteScenarioInfo.svelte';
	import MapControls from '$lib/components/MapControls.svelte';
	import MergedLayer from '$lib/components/MergedLayer.svelte';
	import GemeenteLayer from '$lib/components/GemeenteLayer.svelte';
	import GemeenteLabelLayer from '$lib/components/GemeenteLabelLayer.svelte';
	import MergedLabelLayer from '$lib/components/MergedLabelLayer.svelte';
	import getMergedData from '$lib/utils/getMergedData.js';
	import getFilteredMergedData from '$lib/utils/getFilteredMergedData.js';
	import InternLayerControls from '$lib/components/InternLayerControls.svelte';
	import ScenarioTable from '../lib/components/ScenarioTable.svelte';
	import ExclamationIcon from '../lib/components/ExclamationIcon.svelte';

	import vlagem from '$lib/data/munis_simple_nodata_topo.json';

	// Initialise data
	let gemeenten = [];
	let provincies = [];
	let regios = [];
	let igsen = [];

	let igsdata;
	let coopdata;

	let showRegios = false;

	let w;
	let h;

	let projection = geoMercator();

	let dataReady = false;

	onMount(async () => {
		// Let the geographic data fit into the screen
		projection.fitSize([w, h], feature(vlagem, vlagem.objects['munis_simple_nodata']));

		// Load data from Google Sheets
		// IGS data
		igsdata = await csv(
			'https://docs.google.com/spreadsheets/d/e/2PACX-1vSZv8Cfkf3RkuQ21XcEyN-qAoEwuDe3rUNLxv2JNhOFy6RZIYl-RtNI6SD8XGVI7DI-LGkvL6WdRCgN/pub?gid=1116949341&single=true&output=csv'
		);
		//}
		coopdata = await csv(
			'https://docs.google.com/spreadsheets/d/e/2PACX-1vSZv8Cfkf3RkuQ21XcEyN-qAoEwuDe3rUNLxv2JNhOFy6RZIYl-RtNI6SD8XGVI7DI-LGkvL6WdRCgN/pub?gid=1512650050&single=true&output=csv'
		);

		// Join the data on cooperations between municipalities to the geographic data
		vlagem.objects.munis_simple_nodata.geometries.forEach((gem) => {
			let gemdata = coopdata.find((d) => d.niscode == gem.properties.niscode);
			gem.properties = gemdata;
		});

		// Convert topojson to geojson
		gemeenten = feature(vlagem, vlagem.objects['munis_simple_nodata']).features;

		// Add the centroid coordinates for each gemeente
		gemeenten.forEach((d) => {
			d.properties.centroid = centroid(d).geometry.coordinates;
		});

		// getMergedData returns the geojson of gemeente features merged on some property in gemeente.properties
		provincies = getMergedData(vlagem, 'provinciecode', []);
		regios = getMergedData(vlagem, 'regio', []);
		igsen = getMergedData(vlagem, 'igs', []);

		// dataReady is used to only render things when all the data is fetched from Google Sheets, and processed
		dataReady = true;
	});

	// Converts geojson path data to SVG paths
	$: path = geoPath(projection);

	// Map interaction behaviour
	let clickedPoint;
	let dragging = false;
	let dragged = false;
	let previousLocation = [0, 0];
	let dragOffset = [0, 0];
	let scale;
	let initialScale;
	let initialCenter;
	let notZoomedYet = true;

	let activeGemeente;
	let activeCluster;
	let clickPosition = [0, 0];
	let showInfo = false;
	let activeProject;
	let showProjectInfo = false;

	// Clicking the map either initiates a drag, or opens an info window of a project or gemeente
	function onMouseDown(e) {
		// Store the initial scale and center of the map, for the reset zoom button
		if (notZoomedYet) {
			initialScale = projection.scale();
			initialCenter = projection.invert([w / 2, h / 2]);
		}
		dragging = true;
		dragged = false;
		clickedPoint = [e.clientX, e.clientY];
		previousLocation = clickedPoint;
	}

	function onMouseMove(e) {
		if (dragging) {
			dragOffset = [e.clientX - clickedPoint[0], e.clientY - clickedPoint[1]];
			dragged = true;
			activeProject = null;
			activeGemeente = null;
		}
	}

	function onMouseUp(e) {
		if (dragging) {
			notZoomedYet = false;
			dragging = false;
			let locationOffset = [e.clientX - clickedPoint[0], e.clientY - clickedPoint[1]];
			let newCenter = projection.invert([w / 2 - locationOffset[0], h / 2 - locationOffset[1]]);
			projection = projection.center(newCenter).translate([w / 2, h / 2]);
			dragOffset = [0, 0];
		}
	}

	// For the internal map
	let showLabels = false;
	let showAlleGemeenteNamen = false;
	let showTable = false;
	// The layer(s) shown on the internal map, edit to change the default layer(s) shown
	let selectedLagen = [];
	let selectedCoops = {
		igs: [],
		uitpas: [],
		bibnetwerk: [],
		erfgoedcel: [],
		ioed: [],
		ccnetwerk: [],
		sportnetwerk: [],
		jeugdnetwerk: [],
		avansa: [],
		regio: []
	};
</script>

<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />
<svelte:head>
	<style>
		@font-face {
			font-family: 'DrukWide';
			src: url('fonts/DrukWide/DrukWide-Medium.otf') format('opentype');
		}
		@font-face {
			font-family: 'Helvetica';
			src: url('fonts/Helvetica/Linotype - HelveticaNeueLTStd-Md.otf') format('opentype');
		}
		@font-face {
			font-family: 'Clearface';
			src: url('fonts/Clearface/ITC - ClearfaceStd-Bold.woff');
		}
	</style>
</svelte:head>

<div class="map-container" bind:clientWidth={w} bind:clientHeight={h}>
	<svg
		id="map"
		width={w}
		height={h}
		on:mousedown={onMouseDown}
		transform={`translate(${dragOffset[0]},${dragOffset[1]})`}
		style:cursor={dragging ? 'move' : 'default'}
	>
		{#if path && !isNaN(projection.scale())}
			<g class="gemeente-polys">
				<GemeenteLayer
					{gemeenten}
					{path}
					bind:activeGemeente
					bind:activeProject
					bind:showInfo
					bind:dragged
					bind:clickPosition
				/>
			</g>

			<g class="provincie-polys">
				<MergedLayer
					features={provincies}
					{path}
					strokeWidth={1.5}
					fillOpacity={1}
					stroke={'#666'}
					fill={'none'}
					laag={'provincies'}
				/>
			</g>

			{#if selectedLagen.length > 0 && dataReady}
				<g class="merged-layer">
					{#each selectedLagen as laag}
						<MergedLayer
							features={selectedCoops[laag] && selectedCoops[laag].length > 0
								? getFilteredMergedData(
										getMergedData(vlagem, laag, $scenarios[laag]),
										selectedCoops[laag].map((d) => d.value)
								  )
								: getMergedData(vlagem, laag, $scenarios[laag])}
							{path}
							stroke={colorScale[laag]}
							fill={colorScale[laag]}
							strokeWidth={2}
							fillOpacity={0.3}
							{laag}
						/>
					{/each}
				</g>
			{/if}

			{#if showRegios}
				<g class="regio-polys">
					<MergedLayer
						features={regios}
						{path}
						strokeWidth={1.5}
						fillOpacity={1}
						stroke={'#fe5442'}
						fill={'none'}
						laag={'regio'}
					/>
				</g>
			{/if}

			{#if activeGemeente}
				<path
					class="active-outline"
					d={path(activeGemeente)}
					stroke-width={2}
					stroke={'#000000'}
					fill="none"
					stroke-linejoin="round"
				/>
			{/if}

			{#if $probleemgemeenten.length > 0 && !showAlleGemeenteNamen}
				{#each $probleemgemeenten as probgemeente}
				<ExclamationIcon
					x={projection(gemeenten.find(d => d.properties.niscode == probgemeente).properties.centroid)[0]}
					y={projection(gemeenten.find(d => d.properties.niscode == probgemeente).properties.centroid)[1]}
				></ExclamationIcon>
				{/each}
			{/if}

			<GemeenteLabelLayer {gemeenten} {scale} {projection} {showAlleGemeenteNamen} />

			{#if selectedLagen.length > 0 && showLabels}
				<g class="merged-layer-labels">
					{#each selectedLagen as laag, i}
						<MergedLabelLayer
							regios={selectedCoops[laag] && selectedCoops[laag].length > 0
								? getFilteredMergedData(
										getMergedData(vlagem, laag, $scenarios[laag]),
										selectedCoops[laag].map((d) => d.value)
								  )
								: getMergedData(vlagem, laag, $scenarios[laag])}
							{projection}
							colour={colorScale[laag]}
							{laag}
						/>
					{/each}
				</g>
			{/if}
		{/if}
	</svg>
</div>

<MapControls
	bind:projection
	bind:scale
	bind:initialScale
	bind:initialCenter
	bind:notZoomedYet
	bind:showTable
	bind:activeCluster
	{w}
	{h}
/>

	<InternLayerControls
		bind:selectedCoops
		bind:selectedLagen
		bind:showLabels
		bind:showAlleGemeenteNamen
		bind:activeGemeente
		bind:showInfo
		{gemeenten}
		{dataReady}
	/>

{#if activeGemeente && showInfo}
	<GemeenteScenarioInfo bind:activeGemeente bind:showInfo {clickPosition} {w} {h} />
{/if}

{#if showTable}
	<div class="table-container">
		<ScenarioTable bind:showTable />
	</div>
{/if}

<style>
	svg {
		overflow: visible;
	}
	.table-container {
		position: absolute;
		left: 0px;
		top: 0px;
		width: 100%;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	:global(html, body) {
		margin: 0;
		box-sizing: border-box;
		font-family: 'Helvetica';
	}
	.map-container {
		width: 100%;
		height: 100vh;
	}
	.regio-polys,
	.provincie-polys,
	.igs-polys,
	.active-outline {
		pointer-events: none;
	}
</style>
