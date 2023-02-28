// import type { PageLoad } from './$types';
export const prerender = true;
export async function load({ fetch }) {
    const res = await fetch(`/db/Photoseries.json`);
    const photoseries = await res.json();
    if (res.ok) {
        return { photoseries }
    }
}
