import type { PageLoad } from './$types';

// export const load: PageLoad = async ({ fetch }) => {
// 	// const res = await fetch(`/api/items/${params.id}`);
// 	// const item = await res.json();

// 	// return { item };

// 	const res = await fetch('/.netlify/functions/get-photo-series');
// 	const photoSeries = await res.json();

// 	return { photoSeries };
// };

// src/routes/admin/+page.ts
import { get } from '$lib/api';
import type { ApiResponse } from '$lib/api';
import type { Prisma, PhotoSeries } from '@prisma/client';

export const load: PageLoad = async ({ fetch }) => {
	const apiResponse: ApiResponse<
		Prisma.PhotoSeriesGetPayload<{ include: { Cover: true; photos: true } }>[]
	> = await get('/.netlify/functions/get-photo-series', {
		fetch
	});

	if (apiResponse.error) {
		throw new Error(apiResponse.error); // Обрабатываем ошибку
	}

	return { photoSeries: apiResponse.data };
};
