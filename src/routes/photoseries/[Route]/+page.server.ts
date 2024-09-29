import type { PageServerLoad } from './$types';
import { photos } from '$lib/db/data.js'
export const prerender = true;


export const load = (({ params }) => {


    photos.sort((a, b) => (a.Name.toLowerCase() < b.Name.toLowerCase() ? -1 : 1));

    const unicRoute = <string[]>[...photos.reduce(
        (acc, el) => {
            const f = el.Keywords.filter(e => e.startsWith('ph__'))
            if (f.length !== 0) {
                return acc.add(f[0])
            } return acc
        },
        new Set<string>()
    )]



    const photoSeries = {
        Route: params.Route,
        ImageName: photos
            .filter((image) => image.Keywords.includes(`ph__${params.Route}`))
            .map((image) => image.Name),
        Aspect: photos
            .filter((image) => image.Keywords.includes(`ph__${params.Route}`))
            .map((image) => image.Aspect),
        Colors: photos
            .filter((image) => image.Keywords.includes(`ph__${params.Route}`))
            .map((image) => image.Colors),
        Title: photos
            .filter((image) => image.Keywords.includes(`ph__${params.Route}`))[0]
            .Keywords?.filter(e => e.startsWith('name__'))[0].slice(6).replaceAll('_', ' '),
    }

    const allph = unicRoute.map((el, i) => {
        return {
            Id: i,
            Route: el.slice(4),
            Title: photos.filter((image) => image.Keywords?.includes(el))[0]
                .Keywords?.filter(e => e.startsWith('name__'))[0].slice(6).replaceAll('_', ' '),
            Cover: photos.filter((image) => image.Keywords?.includes(el))
                .filter((image) => image.Keywords.includes(`phcover`))[0].Name
        }
    })


    if (photoSeries !== undefined) {
        return { photoSeries, allph }
    }
}) satisfies PageServerLoad;