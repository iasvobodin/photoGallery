import type { PageLoad } from './$types';
// import { allPhotoseries } from '$lib/store.js';
// export const prerender = true;
// export async function load({ fetch, params }) {

//     const res1 = await fetch(`/db/Photoseries.json`);
//     const photoseries = await res1.json()
//     const ph = photoseries.map(e => {
//         return {
//             "Id": e.Id,
//             "Route": e.Route,
//             "Title": e.Title,
//         }
//     });
//     allPhotoseries.set(ph)

//     const res = await fetch(`/db/${params.Route}.json`);
//     const data = await res.json();
//     if (res.ok) {
//         return { ...data }
//     }
// }


// import allPhotoseries from "$lib/db/all.json";
import data from "$lib/db/lightData3.json";
// import type { AllPhoto } from "$lib/types/type";
export const prerender = true;



data.sort((a, b) => (a.Name.toLowerCase() < b.Name.toLowerCase() ? -1 : 1));

const unicRoute = <string[]>[...data.reduce(
    (acc, el) => {
        const f = el.Keywords.filter(e => e.startsWith('ph__'))
        if (f.length !== 0) {
            return acc.add(f[0])
        } return acc
    },
    new Set()
)]



// type AllPhoto = { Id: string; Route: string; Title: string }

export const load = (({ params }) => {

    // const photoSeries = allPhotoseries.find((e) => e.Name.toLowerCase() === params.Route)

    const photoSeries = {
        // Route: params.Route,
        ImageName: data
            // .filter((image) => image.Keywords.includes(`ph__${params.Route}`))
            .map((image) => image.Name),
        Aspect: data
            // .filter((image) => image.Keywords.includes(`ph__${params.Route}`))
            .map((image) => image.Aspect),
        Colors: data
            // .filter((image) => image.Keywords.includes(`ph__${params.Route}`))
            .map((image) => image.Colors),
        // Title: data
        //     .filter((image) => image.Keywords.includes(`ph__${params.Route}`))[0]
        //     .Keywords?.filter(e => e.startsWith('name__'))[0].slice(6).replaceAll('_', ' '),
    }

    // const allph = unicRoute.map((el, i) => {
    //     return {
    //         Id: i,
    //         Route: el.slice(4),
    //         Title: data.filter((image) => image.Keywords?.includes(el))[0]
    //             .Keywords?.filter(e => e.startsWith('name__'))[0].slice(6).replaceAll('_', ' '),
    //     }
    // })

    // const allph = allPhotoseries.map(e => ({
    //     "Id": e.id,
    //     "Route": e.Name,
    //     "Title": e.Title,
    // } as AllPhoto))

    if (photoSeries !== undefined) {
        return { photoSeries }
    }
}) satisfies PageLoad;