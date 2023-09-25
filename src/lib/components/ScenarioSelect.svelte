<script>
    import getCoopsList from '$lib/utils/getCoopsList.js';
    import { scenarios } from '$lib/stores/stores.js';
    export let activeGemeente
    export let laag

// Initial gemeenteProps is a copy of the activeGemeente properties, which represent the actual, current situation
let gemeenteProps = JSON.parse(JSON.stringify(activeGemeente.properties))
    
// When $scenarios contains any user defined changes for this municipality, update the gemeenteProps with it
Object.keys($scenarios).forEach(laag => {
        if ($scenarios[laag].length > 0 && $scenarios[laag].find(d => d.niscode == gemeenteProps.niscode)){
            gemeenteProps[laag] = $scenarios[laag].find(d => d.niscode == gemeenteProps.niscode).to
        }
    })

    // Sync scenarios store with the selected options
    const onChange = (laag) => {
        if(gemeenteProps[laag] != activeGemeente.properties[laag]){
            
            // First, remove any change for this municipality defined earlier
            $scenarios[laag] = $scenarios[laag].filter(d => d.niscode != gemeenteProps.niscode)

            // Add the new change to the array of changes for this layer in $scenarios
            $scenarios[laag] = $scenarios[laag].concat([{niscode: gemeenteProps.niscode, from: activeGemeente.properties[laag], to: gemeenteProps[laag]}])
        }
        else{
            // If the change was a reset to the actual, current situation, remove any changes for this municipality
            $scenarios[laag] = $scenarios[laag].filter(d => d.niscode != gemeenteProps.niscode)
        }
    }
    
</script>

<!--
@component
This component is a dropdown to be used in the GemeenteScenarioInfo component, to let the user assign a municipality to a different intermunicipal cooperation.
-->
<div class="row-container">
<label for={'select-' + laag}>{laag + ": "}</label>
<select
    id={'select-' + laag}
    bind:value={gemeenteProps[laag]}
    on:change={() => onChange(laag)}
    class={$scenarios[laag].find(d => d.niscode == gemeenteProps.niscode) ? "edited" : ""}>
    <option value={""}></option>
    {#each getCoopsList(laag) as option}
        <option value={option.value}>{option.label}</option>
    {/each}
</select>
</div>

<style>
    .row-container {
        display: flex;
    }
    label {
        flex: 1;
        width: 200px;
    }
    select {
        width: 200px;
        margin-bottom: 8px;
    }
    select.edited {
        background-color: #ffd1a6;
    }
</style>