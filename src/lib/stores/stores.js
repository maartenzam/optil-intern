import { writable } from 'svelte/store';

export const scenarios = writable({
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

export const probleemgemeenten = writable([])