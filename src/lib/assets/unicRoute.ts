import data from "$lib/db/lightData3.json";


data.sort((a, b) => (a.Name.toLowerCase() < b.Name.toLowerCase() ? -1 : 1));

export const unicRoute = <string[]>[...data.reduce(
    (acc, el) => {
        const f = el.Keywords?.filter(e => e.startsWith('ph__'))
        // const n = el.Keywords?.filter(e => e.startsWith('name__'))
        if (f) {
            return acc.add(f[0])
        } return acc
    },
    new Set()
)]

export const photoseries = unicRoute.map((el, i) => {
    return {
        Id: i + 1,
        Route: el.slice(4),
        Name: data.filter((image) => image.Keywords?.includes(el))[0]
            .Keywords?.filter(e => e.startsWith('name__'))[0].slice(6).replaceAll('_', ' '),
        Cover: data.filter((image) => image.Keywords?.includes(el))
            .filter((image) => image.Keywords?.includes('phcover'))?.[0]?.Name,
    }
})//.sort((a, b) => (a.Route.toLowerCase() < b.Route.toLowerCase() ? -1 : 1));