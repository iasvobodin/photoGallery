import type { PageLoad } from './$types';
import reviews from "$lib/db/reviews.json";

export const prerender = true;

export const load = (() => {

    return { reviews }

}) satisfies PageLoad