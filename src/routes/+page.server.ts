import type { PageServerLoad } from './$types';
import reviews from "$lib/db/reviews.json";
import { photos } from '$lib/db/data.js'
import prisma from '$lib/prisma';
// export const prerender = true;



// export const config = {
//     // Use 'nodejs18.x' for Serverless
//     runtime: 'edge',
// };
type T = Awaited<ReturnType<typeof sleep>>;

function sleep<T>(value: T, ms: number) {
    return new Promise<T>((fulfill) => {
        setTimeout(() => {
            fulfill(value);
        }, ms);
    });
}








export const load = (async () => {

    // const ppphotoSeries = await prisma.photoSeries.findMany({
    //     where: {
    //         type: 'ph',
    //     },
    //     include: {
    //         Cover: {
    //             include:
    //             {
    //                 photo:
    //                 {
    //                     select:
    //                         { aspect: true }
    //                 }
    //             }
    //         }
    //     },

    // })



    photos.sort((a, b) => (a.Name.toLowerCase() < b.Name.toLowerCase() ? -1 : 1));

    const unicRoute = <string[]>[...photos.reduce(
        (acc, el) => {
            const f = el.Keywords.filter(e => e.startsWith('ph__'))
            if (f.length !== 0) {
                return acc.add(f[0])
            } return acc
        },
        new Set()
    )]


    const allph = unicRoute.map((el, i) => {
        return {
            Id: i,
            Route: el.slice(4),
            Title: photos.filter((image) => image.Keywords?.includes(el))[0]
                .Keywords?.filter(e => e.startsWith('name__'))[0].slice(6).replaceAll('_', ' '),
            Cover: photos.filter((image) => image.Keywords?.includes(el))
                .filter((image) => image.Keywords.includes(`phcover`))[0].Name,
            Aspect: photos.filter((image) => image.Keywords?.includes(el))
                .filter((image) => image.Keywords.includes(`phcover`))[0].Aspect
        }
    })


    let photoseriesLandscape = allph.filter((e) => e.Aspect > 1);
    let photoseriesPortrait = allph.filter((e) => e.Aspect < 1);

    let halfOfLandscape = Math.floor(photoseriesLandscape.length / 2);

    let topGallery = photoseriesLandscape.slice(0, halfOfLandscape);
    let middleGallery = photoseriesPortrait;
    let bottomGallery = photoseriesLandscape.slice(halfOfLandscape, photoseriesLandscape.length - 1);

    const ph = { topGallery, middleGallery, bottomGallery }

    const shuffled = reviews
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

    const reviewsSlice = shuffled.slice(shuffled.length - 8, shuffled.length);

    return {
        allph,
        ph,
        streamed: {
            ph: sleep(ph, 400),
            reviewsSlice: sleep(reviewsSlice, 500),
        },

        // ppphotoSeries
    }

}) satisfies PageServerLoad;