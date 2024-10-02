// src/routes/photos/+page.ts
// export const load = async ({ fetch }) => {
// 	try {
// 		const response = await fetch('/.netlify/functions/get-photo-series');
// 		if (response.ok) {
// 			const data = await response.json();
// 			return { data };
// 		} else {
// 			throw new Error('Failed to fetch data');
// 		}
// 	} catch (error) {
// 		console.error(error);
// 		return {
// 			error: 'Could not load photo series'
// 		};
// 	}
// };

import type { PageServerLoad } from './$types';
import type { PhotoSeries } from '@prisma/client';
export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const response = await fetch('http://localhost:8888/.netlify/functions/get-photo-series');
		if (response.ok) {
			const photoseries: PhotoSeries[] = await response.json();

			return { photoseries };
		} else {
			throw new Error('Failed to fetch data');
		}
	} catch (error) {
		console.error(error);
		return {
			error: 'Could not load photo series'
		};
	}
};
