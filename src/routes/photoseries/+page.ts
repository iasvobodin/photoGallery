import type { PageLoad } from './$types';
import data from "$lib/db/lightData3.json";
import type { AllData } from '$lib/types/type';


export const prerender = true;


data.sort((a, b) => (a.Name.toLowerCase() < b.Name.toLowerCase() ? -1 : 1));

const phcover = data.filter((image) => image.Keywords.includes(`phcover`))


const photoseries = {
    Route: phcover.map((image) => image.Keywords.filter(e => e.startsWith('ph__'))[0].slice(4)),
    ImageName: phcover.map((image) => image.Name),
    Aspect: phcover.map((image) => image.Aspect),
    Colors: phcover.map((image) => image.Colors),
    Title: phcover.map((image) => image.Keywords.filter(e => e.startsWith('name__'))[0].slice(6).replaceAll('_', ' ')),
}

export const load = (() => {

    return { photoseries }

}) satisfies PageLoad




// import type { PageLoad } from './$types';


