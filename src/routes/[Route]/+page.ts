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


import allPhotoseries from "$lib/db/all.json";
export const prerender = true;


interface AllPhoto { Id: string; Route: string; Title: string }

export const load = (({ params }) => {

    const photoSeries = allPhotoseries.find((e) => e.Name.toLowerCase() === params.Route)
    const allph = allPhotoseries.map(e => ({
        "Id": e.id,
        "Route": e.Name,
        "Title": e.Title,
    } as AllPhoto))
    if (photoSeries !== undefined) {
        return { photoSeries, allph }
    }
}) satisfies PageLoad;