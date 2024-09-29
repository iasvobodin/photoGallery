import { PrismaClient } from '@prisma/client';
import photoSeries from '../src/lib/db/photoseries.json';
import { photos } from '../src/lib/db/data';

const prisma = new PrismaClient();

async function main() {
	// const dphotoSeries = await prisma.photoSeries.deleteMany({})
	// console.log('photoSeries.deleteMany');

	// const dphotos = await prisma.photo.deleteMany({})
	// console.log('photo.deleteMany');

	// photoSeries.map(async (e) => {
	// 	await prisma.photoSeries.create({
	// 		data: {
	// 			type: e.type,
	// 			route: e.route,
	// 			title: e.title,
	// 			description: ''
	// 		}
	// 	});
	// 	console.log('Database seeded successfully', e.title);
	// });

	// photos.slice(1500, photos.length).map(async (e) => {
	// 	try {
	// 		await prisma.photo.create({
	// 			data: {
	// 				name: e.Name,
	// 				aspect: e.Aspect,
	// 				colors: e.Colors,
	// 				props: {
	// 					create: {
	// 						ShSp: e.ShSp,
	// 						Ap: e.Ap.toString(),
	// 						Fl: e.FL.toString()
	// 					}
	// 				},
	// 				Keywords: e.Keywords,
	// 				Rating: 0,
	// 				seriesRoute: e.Keywords.filter((e) => e.startsWith('ph__'))[0].slice(4)
	// 			}
	// 		});
	// 		console.log('createPhoto', e.Name);
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// });

	photos.sort((a, b) => (a.Name.toLowerCase() < b.Name.toLowerCase() ? -1 : 1));

	const unicRoute = <string[]>[
		...photos.reduce((acc, el) => {
			const f = el.Keywords?.filter((e) => e.startsWith('ph__'));
			// const n = el.Keywords?.filter(e => e.startsWith('name__'))
			if (f) {
				return acc.add(f[0]);
			}
			return acc;
		}, new Set<string>())
	];

	unicRoute.map(async (el, i) => {
		try {
			await prisma.cover.create({
				data: {
					// Id: i + 1,
					seriesRoute: el.slice(4),
					// Name: photos.filter((image) => image.Keywords?.includes(el))[0]
					//     .Keywords?.filter(e => e.startsWith('name__'))[0].slice(6).replaceAll('_', ' '),
					photoName: photos
						.filter((image) => image.Keywords?.includes(el))
						.filter((image) => image.Keywords?.includes('phcover'))?.[0]?.Name
				}
			});
			console.log('covercreate', el);
		} catch (error) {
			console.log(error);
		}
	}); //.sort((a, b) => (a.Route.toLowerCase() < b.Route.toLowerCase() ? -1 : 1));
}
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		// console.error(e);
		// await prisma.$disconnect();
		// process.exit(1);
	});
