import type { PageLoad } from './$types';
import pricedata from "$lib/db/price.json";

export const prerender = true;

export const load = (() => {

    return { pricedata }

}) satisfies PageLoad