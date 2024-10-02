import { Handler } from '@netlify/functions';
import * as crypto from 'crypto';

const BOT_TOKEN = process.env.BOT_TOKEN as string;

interface TelegramAuthData {
	id: number;
	first_name: string;
	last_name?: string;
	username?: string;
	photo_url?: string;
	auth_date: string;
	hash: string;
}

const verifyTelegramAuth = (data: TelegramAuthData): boolean => {
	const { hash, ...userData } = data;

	// Сортировка данных и формирование строки проверки
	const sortedData = Object.keys(userData)
		.sort()
		.map((key) => `${key}=${(userData as any)[key]}`)
		.join('\n');

	// Создание HMAC с использованием секретного ключа бота
	const secretKey = crypto.createHash('sha256').update(BOT_TOKEN).digest();
	const hmac = crypto.createHmac('sha256', secretKey).update(sortedData).digest('hex');

	// Сравнение хеша
	if (hmac !== hash) {
		return false;
	}

	// Проверка срока действия (24 часа)
	const authDate = parseInt(userData.auth_date, 10);
	if (Math.floor(Date.now() / 1000) - authDate > 86400) {
		// 86400 секунд = 24 часа
		return false;
	}

	return true;
};

export const handler: Handler = async (event, context) => {
	if (event.httpMethod !== 'POST') {
		return {
			statusCode: 405,
			body: 'Method Not Allowed'
		};
	}

	try {
		const data: TelegramAuthData = JSON.parse(event.body || '{}');

		// Валидация данных
		const isValid = verifyTelegramAuth(data);

		if (!isValid) {
			return {
				statusCode: 403,
				body: JSON.stringify({ error: 'Data is not from Telegram or it is outdated' })
			};
		}

		// Успешная проверка данных
		return {
			statusCode: 200,
			body: JSON.stringify({ success: true, user: data })
		};
	} catch (error) {
		return {
			statusCode: 500,
			body: JSON.stringify({ error: 'Internal Server Error', details: error.message })
		};
	}
};
