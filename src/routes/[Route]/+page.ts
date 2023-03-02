// import type { PageLoad } from './$types';
export const prerender = true;
export async function load({ fetch, params }) {
    const res = await fetch(`/db/${params.Route}.json`);
    const data = await res.json();
    if (res.ok) {
        return { ...data }
    }
}
