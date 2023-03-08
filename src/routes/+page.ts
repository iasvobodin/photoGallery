import data from "$lib/db/lightData3.json";
import type { PageLoad } from './$types';
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

const photoseries = unicRoute.map((el, i) => {
    return {
        Route: el.slice(4),
        Name: data.filter((image) => image.Keywords?.includes(el))[0]
            .Keywords?.filter(e => e.startsWith('name__'))[0].slice(6).replaceAll('_', ' '),
        cover: data.filter((image) => image.Keywords?.includes(el))
            .filter((image) => image.Keywords?.includes('phcover'))?.[0]?.Name,
    }

    // el.ImageName = lightData
    //   .filter((image) => image.Keywords.includes(el.Name))
    //   .map((image) => image.Name)
    // el.Aspect = lightData
    //   .filter((image) => image.Keywords.includes(el.Name))
    //   .map((image) => image.Aspect)
    // el.Cover = lightData
    //   .filter((image) => image.Keywords.includes(el.Name))
    //   .find((image) => image.Keywords.includes('cover'))
    // el.Portrait = lightData
    //   .filter((image) => image.Keywords.includes(el.Name))
    //   .filter((image) => image.Keywords.includes('portrait'))
    //   .map((image) => image.Name)[0]
    // el.PortraitAspect = lightData
    //   .filter((image) => image.Keywords.includes(el.Name))
    //   .filter((image) => image.Keywords.includes('portrait'))
    //   .map((image) => image.Aspect)[0]
    // el.Spec = lightData
    //   .filter((image) => image.Keywords.includes(el.Name))
    //   .map((image) => image.Params)
})

// console.log(photoseries);


export const load = (() => {

    return { data }

}) satisfies PageLoad



















// type AllPhoto = { Id: string; Route: string; Title: string }

// export const load = (({ params }) => {

//     const photoSeries = allPhotoseries.find((e) => e.Name.toLowerCase() === params.Route)
//     const allph = allPhotoseries.map(e => ({
//         "Id": e.id,
//         "Route": e.Name,
//         "Title": e.Title,
//     } as AllPhoto))
//     if (photoSeries !== undefined) {
//         return { photoSeries, allph }
//     }
// }) satisfies PageLoad;