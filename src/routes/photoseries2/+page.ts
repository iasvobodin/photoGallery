import type { PageLoad } from './$types';

// import photoseries from "$lib/db/Photoseries.json";
import data from "$lib/db/lightData3.json";


export const prerender = true;


data.sort((a, b) => (a.Name.toLowerCase() < b.Name.toLowerCase() ? -1 : 1));

const unicRoute = <string[]>[...data.reduce(
    (acc, el) => {
        const f = el.Keywords?.filter(e => e.startsWith('ph__'))
        // const n = el.Keywords?.filter(e => e.startsWith('name__'))
        if (f) {
            return acc.add(f[0])
        } return acc
    },
    new Set()
)]

// const photoseries = unicRoute.map((el, i) => {
//     return {
//         Route: el.slice(4),
//         Name: data.filter((image) => image.Keywords?.includes(el))[0]
//             .Keywords?.filter(e => e.startsWith('name__'))[0].slice(6).replaceAll('_', ' '),
//         cover: data.filter((image) => image.Keywords?.includes(el))
//             .filter((image) => image.Keywords?.includes('phcover'))?.[0]?.Name,
//     }
// })


const photoseries = {
    Route: data
        .filter((image) => image.Keywords?.includes(`phcover`))
        .map((image) => image.Keywords?.filter(e => e.startsWith('ph__'))[0].slice(4)),
    ImageName: data
        .filter((image) => image.Keywords?.includes(`phcover`))
        .map((image) => image.Name),
    Aspect: data
        .filter((image) => image.Keywords?.includes(`phcover`))
        .map((image) => image.Aspect),
    Colors: data
        .filter((image) => image.Keywords?.includes(`phcover`))
        .map((image) => image.Colors),
    Title: data
        .filter((image) => image.Keywords?.includes(`phcover`))
        .map((image) => image.Keywords?.filter(e => e.startsWith('name__'))[0].slice(6).replaceAll('_', ' ')),
}

// photoseries.sort((a, b) => (a.cover.toLowerCase() < b.cover.toLowerCase() ? 1 : -1));

// console.log(photoSeriesLoy);

export const load = (() => {

    return { photoseries }

}) satisfies PageLoad




// import type { PageLoad } from './$types';


