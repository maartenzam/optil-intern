import vlagem from '$lib/data/munis_simple_nodata_topo.json';

export default function getMuniData(niscode) {
    return vlagem.objects.munis_simple_nodata.geometries.find(d => d.properties.niscode == niscode).properties
}