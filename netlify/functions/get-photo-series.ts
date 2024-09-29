import { Handler } from '@netlify/functions';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const handler: Handler = async (event, context) => {
	try {
		const photoSeries = await prisma.photoSeries.findMany({
			include: {
				Cover: true
				// photos: true
			}
		});

		return {
			statusCode: 200,
			headers: {
				'Content-Type': 'application/json; charset=utf-8' // Устанавливаем заголовок
			},
			body: JSON.stringify(photoSeries)
		};
	} catch (error) {
		console.error(error);

		return {
			statusCode: 500,
			body: JSON.stringify({ error: 'Failed to fetch data' })
		};
	}
};
