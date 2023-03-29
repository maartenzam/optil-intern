export default function getFilteredMergedData(geojsons, filter) {
    return geojsons.filter(d => filter.includes(d.id))
}