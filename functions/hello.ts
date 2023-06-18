import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

import { photos } from '../src/lib/db/data.js'


import path from 'path';
import fs from 'fs'

import { fileURLToPath } from 'url';
// import mime from 'mime-types';




// const __filename = fileURLToPath(import.meta.url);

// const __dirname = path.dirname(__filename);

console.log(__dirname);


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


// const phcover = photos.filter((image) => image.Keywords.includes(`phcover`))
// phcover.sort((a, b) => (a.Name.toLowerCase() < b.Name.toLowerCase() ? 1 : -1));

// const photoseries = {
//     route: phcover.map((image) => image.Keywords.filter(e => e.startsWith('ph__'))[0].slice(4)),
//     cover: phcover.map((image) => image.Name),
//     description: "",
//     colors: phcover.map((image) => image.Colors),
//     title: phcover.map((image) => image.Keywords.filter(e => e.startsWith('name__'))[0].slice(6).replaceAll('_', ' ')),
//     // Aspect: phcover.map((image) => image.Aspect),
// }

const updatePhotos = photos.map(el => {
    return {
        "Name": el.Name,
        "Aspect": 0.67,
        "Colors": el.Colors,
        "Props": {
            "ShSp": el.ShSp,
            "Ap": el.Ap,
            "FL": el.FL,
        },
        "Photoseries": {
            "Route": el.Keywords?.filter(e => e.startsWith('ph__'))[0].slice(4),
            "Title": el.Keywords?.filter(e => e.startsWith('name__'))[0].slice(6).replaceAll('_', ' '),
            "Cover": el.Keywords.includes(`phcover`) ? true : false
        },
    }
})

const allph = unicRoute.map((el, i) => {
    return {
        type: "",
        route: el.slice(4),
        title: photos.filter((image) => image.Keywords?.includes(el))[0]
            .Keywords?.filter(e => e.startsWith('name__'))[0].slice(6).replaceAll('_', ' '),
        cover: updatePhotos.find(e => e.Name === photos.filter((image) => image.Keywords?.includes(el))
            .filter((image) => image.Keywords.includes(`phcover`))[0].Name)
    }
})
const createPh = (el) => `mutation CreatePhotoSeries {
    createPhotoSeries(data: {
    route: "${el.route}"
    title: "${el.title}"
    description: "${el.description}"
    cover: "${el.cover}"
   }){
        route
        title
    }
 }`

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    try {
        updatePhotos
        fs.writeFileSync('./src/lib/db/updatePhotos.json', JSON.stringify(updatePhotos, null, 2))
        fs.writeFileSync('./src/lib/db/photoseries.json', JSON.stringify(allph, null, 2))
    } catch (error) {
        console.log(error)
    }

    // await Promise.all[]  
    // allph.map(async (el, i) => {
    // if (i < 4) {

    // try {
    //     const response = await fetch('https://graphql.fauna.com/graphql', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${process.env.FAUNADB_ADMIN_SECRET}`
    //         },
    //         body: JSON.stringify({

    //             query:
    //                 //         `mutation CreatePhotoSeries {
    //                 //     createPhotoSeries(data: {
    //                 //     route: "${el.route}"
    //                 //     title: "${el.title}"
    //                 //     description: "${el.description}"
    //                 //     cover: "${el.cover}"
    //                 //    }){
    //                 //         route
    //                 //         title
    //                 //     }
    //                 //  }`


    //                 `query FindAllPhotoSeries {
    //                                     allPhotoSeries {
    //                                       data {
    //                                         _id
    //                                         route
    //                                       }
    //                                     }
    //                                   }
    //                     `
    //             ,
    //         }),
    //     })
    //     const result = await response.json();
    //     console.log(result);

    //     return {
    //         statusCode: 200,
    //         body: JSON.stringify({ result }),
    //     };

    // } catch (error) {
    //     console.log(error);
    //     return {
    //         statusCode: 400,
    //         body: JSON.stringify({ error }),
    //     };
    // }


    return {
        statusCode: 200,
        body: JSON.stringify({ photos }),
    };

};

export { handler };