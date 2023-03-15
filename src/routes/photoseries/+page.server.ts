import type { PageServerLoad } from './$types';
import { photos } from '$lib/db/data.js'


export const prerender = true;




export const load = (() => {

    photos.sort((a, b) => (a.Name.toLowerCase() < b.Name.toLowerCase() ? -1 : 1));

    const phcover = photos.filter((image) => image.Keywords.includes(`phcover`))
    phcover.sort((a, b) => (a.Name.toLowerCase() < b.Name.toLowerCase() ? 1 : -1));

    const photoseries = {
        Route: phcover.map((image) => image.Keywords.filter(e => e.startsWith('ph__'))[0].slice(4)),
        ImageName: phcover.map((image) => image.Name),
        Aspect: phcover.map((image) => image.Aspect),
        Colors: phcover.map((image) => image.Colors),
        Title: phcover.map((image) => image.Keywords.filter(e => e.startsWith('name__'))[0].slice(6).replaceAll('_', ' ')),
    }

    return { photoseries }

}) satisfies PageServerLoad;
