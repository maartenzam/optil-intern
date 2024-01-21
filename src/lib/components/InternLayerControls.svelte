<script>
  import { fade } from "svelte/transition";
  import Select from "svelte-select";
  import getCoopsList from "$lib/utils/getCoopsList.js";
  import { colorScale } from "$lib/styles/styles.js";
  import GemeenteSearch from "$lib/components/GemeenteSearch.svelte";
  import Pattern from "./Pattern.svelte";

  export let selectedLagen;
  export let selectedCoops;
  export let showLabels;
  export let showAlleGemeenteNamen;
  export let dataReady;
  export let activeGemeente;
  export let gemeenten;
  export let showInfo;

  let sidebarCollapsed = false;
  function toggleSidebar(){
		sidebarCollapsed = !sidebarCollapsed;
	}
</script>

<!--
@component
This component is the UI for controlling which layers are visible on the internal map
-->
<div class="button-container uncollapse" style:visibility={sidebarCollapsed ? 'visible' : 'hidden'}>
  <button class={"sidebar-toggle"} on:click={() => toggleSidebar()}>&#8658;</button>
</div>
<div class="marker-filter-container"
  transition:fade
  style:left={sidebarCollapsed ? '-270px' : '10px'}
>
  <div class="button-container">
    <button class={"sidebar-toggle"} on:click={() => toggleSidebar()}>&#8656;</button>
  </div>
  <input
    class="styled-checkbox"
    id={"styled-checkbox-labels"}
    type="checkbox"
    bind:checked={showLabels}
  />
  <label
    for={"styled-checkbox-labels"}
    style:background-color={"white"}
    style:color={"black"}>Toon naam samenwerkingen</label
  >
  <input
    class="styled-checkbox"
    id={"styled-checkbox-namen"}
    type="checkbox"
    bind:checked={showAlleGemeenteNamen}
  />
  <label
    for={"styled-checkbox-namen"}
    style:background-color={"white"}
    style:color={"black"}>Toon gemeentenamen</label
  >

  <GemeenteSearch bind:activeGemeente bind:showInfo {gemeenten} />

  <ul class="unstyled centered">
    {#each Object.keys(selectedCoops) as laag}
      <li>
        <input
          class="styled-checkbox"
          id={"styled-checkbox-" + laag}
          type="checkbox"
          value={laag}
          bind:group={selectedLagen}
        />
        <label
          for={"styled-checkbox-" + laag}
          style:background-color={colorScale[laag]}
        >
          {#if laag == "igs_bolo_cultuur" || laag == "regio"}
            {laag}
          {/if}
          {#if laag != "igs_bolo_cultuur" && laag != "regio"}
            {laag}
            <svg width="50px" height="20px" style:float={"right"}>
              <defs>
                <Pattern {laag} />
              </defs>
              <rect width="50" height="20" fill={"white"} />
              <rect width="50" height="20" fill={`url('#${laag}')`} />
            </svg>
          {/if}
        </label>
      </li>
    {/each}
  </ul>
  {#if dataReady}
    {#each selectedLagen as selectedLaag}
      <Select
        --border-radius="2px"
        --multi-select-padding="4px"
        --multi-item-border-radius="2px"
        --height="34px"
        --padding="6px"
        --font-size="14px"
        items={getCoopsList(selectedLaag)}
        multiple={true}
        placeholder={"Selecteer " + selectedLaag}
        bind:value={selectedCoops[selectedLaag]}
      />
    {/each}
  {/if}
</div>

<style>
  .button-container.uncollapse {
    position: absolute;
    top: 15px;
    left: 15px;
  }
  .marker-filter-container {
    position: absolute;
    top: 10px;
    transition: left 0.5s;
    background: rgba(255, 255, 255, 0.8);
    padding: 5px;
    border-radius: 2px;
    width: 250px;
  }
  .unstyled {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }

  li {
    margin: 6px 0;
  }
  .styled-checkbox {
    position: absolute;
    opacity: 0;
  }
  .styled-checkbox + label {
    position: relative;
    cursor: pointer;
  }
  .styled-checkbox + label:before {
    content: "";
    margin-right: 10px;
    display: inline-block;
    vertical-align: text-bottom;
    width: 18px;
    height: 18px;
    background: white;
  }
  .styled-checkbox + label:before {
    border: 1px black solid;
  }
  .styled-checkbox:checked + label:before {
    background: #000000;
  }
  .styled-checkbox:disabled + label {
    color: #b8b8b8;
    cursor: auto;
  }
  .styled-checkbox:disabled + label:before {
    box-shadow: none;
    background: #ddd;
  }
  .styled-checkbox:checked + label:after {
    content: "";
    position: absolute;
    left: 8px;
    top: 12px;
    background: white;
    width: 3px;
    height: 3px;
    box-shadow: 2px 0 0 white, 4px 0 0 white, 4px -2px 0 white, 4px -4px 0 white,
      4px -6px 0 white, 4px -8px 0 white;
    transform: rotate(45deg);
  }
  label {
    padding: 4px;
    color: white;
    width: calc(100% - 8px);
    display: block;
  }
	button.sidebar-toggle {
		font-weight: 700;
		cursor: pointer;
		border-radius: 4px;
		border: 1.5px solid #666666;
		background-color: #ffffff;
	}
	button.sidebar-toggle:hover {
		background-color: #eeeeee;
	}
</style>
