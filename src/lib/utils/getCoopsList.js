import vlagem from '$lib/data/munis_simple_nodata_topo.json';

export default function getCoopsList(property) {
    let ids = [
        ...new Set(vlagem.objects.munis_simple_nodata.geometries.map((d) => d.properties[property]))
    ].filter((d) => d);
    return ids.map(d => {
        return {
            label: d,
            value: d
        }
    }).sort((a,b) => a.label > b.label ? 1 : -1)
}