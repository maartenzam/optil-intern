<script>
    import { probleemgemeenten } from '$lib/stores/stores.js';
    export let niscode

    let checked = $probleemgemeenten.includes(niscode)

    const onChange = () => {
        if(checked) {
            $probleemgemeenten = $probleemgemeenten.concat([niscode])
        }
        if(!checked){
            $probleemgemeenten = $probleemgemeenten.filter(d => d != niscode)
        }
    }
</script>

<input id="probleemgemeente" type=checkbox bind:checked={checked} on:change={() => onChange()}>
<label for="probleemgemeente">Probleemgemeente</label>