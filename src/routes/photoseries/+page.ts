// import type { PageLoad } from './$types';

import photoseries from "$lib/db/Photoseries.json";

export const prerender = true;
// export async function load({ fetch }) {
//     const res = await fetch(`/db/Photoseries.json`);
//     const photoseries = await res.json();
//     if (res.ok) {
//         return { photoseries }
//     }
// }

export function load() {
    // const res = await fetch(`/db/Photoseries.json`);
    // const photoseries = await res.json();
    // if (res.ok) {
    return { photoseries }
    // }
}