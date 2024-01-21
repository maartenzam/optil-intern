import { writable } from 'svelte/store';

export const scenarios = writable({
    igs_bolo_cultuur: [],
    igs_cultuur: [],
    uitpas: [],
    bibnetwerk: [],
    erfgoedcel: [],
    ioed: [],
    ccnetwerk: [],
    sportnetwerk: [],
    jeugdnetwerk: [],
    avansa: [],
    regio: [],
    regioconsulent: [],
    lo_vrijetijdspart: [],
    bolo_vrijetijdspart: []
})

export const probleemgemeenten = writable([])