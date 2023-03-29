<script>
	import { scenarios, probleemgemeenten } from '$lib/stores/stores.js';
	import ProbleemGemeenteCheckbox from './ProbleemGemeenteCheckbox.svelte';
    import getMuniData from '$lib/utils/getMuniData.js'
	export let showTable;

	function handleClick() {
		showTable = false;
	}
	function handleReset(laag, edit) {
		$scenarios[laag] = $scenarios[laag].filter((d) => d != edit);
	}
	function handleResetAll() {
		$scenarios = {
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
		$probleemgemeenten = []
	}

    $: leegScenario = JSON.stringify($scenarios) == JSON.stringify({
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
		})
</script>

<!--
@component
This component is a table to display and remove edits to the intermunicipal cooperations defined by the user
-->

<div class="modal">
	<button class="close-button" on:click={() => handleClick()}>X</button>
    {#if !leegScenario || $probleemgemeenten.length > 0}
	<h2>Huidige aanpassingen in dit scenario</h2>
	{#if !leegScenario}
	<table>
		<tr>
			<th>Gemeente</th>
			<th>Samenwerking</th>
			<th>Huidig</th>
			<th>Scenario</th>
			<th>Verwijder</th>
		</tr>
		{#each Object.keys($scenarios) as laag}
			{#if $scenarios[laag].length > 0}
				{#each $scenarios[laag] as edit, i}
					<tr style:background-color={i % 2 ? '#ffffff' : '#eeeeee'}>
						<td>{getMuniData(edit.niscode).naam}</td>
						<td>{laag}</td>
						<td>{edit.from === null || edit.from === "" ? '-' : edit.from}</td>
						<td>{edit.to}</td>
						<td style:text-align="center"
							><button class="remove-button" on:click={() => handleReset(laag, edit)}>x</button></td
						>
					</tr>
				{/each}
			{/if}
		{/each}
	</table>
	{/if}

	{#if $probleemgemeenten.length > 0}
	<table>
		<tr>
			<th>Gemeente</th>
			<th></th>
		</tr>
		{#each $probleemgemeenten as probgemeente}
			<tr>
			<td>{getMuniData(probgemeente).naam}</td>
			<td><ProbleemGemeenteCheckbox niscode={probgemeente}></ProbleemGemeenteCheckbox></td>
			</tr>
		{/each}
	</table>
	{/if}

	<div class="button-container">
		<button class="delete-all" on:click={() => handleResetAll()}
			>Alle aanpassingen verwijderen</button
		>
	</div>
    {:else}
    <p>Er werden nog geen aanpassingen aan de samenwerkingsverbanden doorgevoerd.</p>
    {/if}
</div>

<style>
	.button-container {
		padding: 8px;
		width: 100%;
		text-align: center;
	}
	button.delete-all {
		background-color: black;
		color: white;
		border: 2px solid black;
		border-radius: 3px;
		padding: 3px;
        cursor: pointer;
	}
	.modal {
		margin: auto;
		background-color: white;
		padding: 8px;
		border-radius: 3px;
		box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.2);
		position: relative;
		max-height: 80vh;
		overflow: scroll;
	}
	table {
		border: none;
		border-collapse: collapse;
		font-size: 14px;
	}
	th,
	td {
		text-align: left;
		padding: 4px;
		border: 0px solid black;
		border-collapse: collapse;
	}
	.remove-button {
		font-weight: bold;
		border-radius: 50%;
		cursor: pointer;
		border: 2px solid black;
		width: 22px;
		height: 22px;
		padding: 0px;
		color: white;
		background-color: black;
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
</style>
