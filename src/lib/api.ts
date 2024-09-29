// src/lib/api.ts
export interface ApiResponse<T> {
	data: T | null;
	error: string | null;
}

const handleResponse = async <T>(response: Response): Promise<T> => {
	if (!response.ok) {
		const erJson = await response.json();
		throw new Error(`Error! status: ${response.status}, message: ${JSON.stringify(erJson)}`);
	}
	return response.json();
};

export const fetchData = async <T>(
	url: string,
	event: { fetch: typeof fetch }, // Используем встроенный fetch SvelteKit
	options: RequestInit = {}
): Promise<ApiResponse<T>> => {
	try {
		const response = await event.fetch(url, options); // Используем event.fetch вместо глобального fetch
		const result = await handleResponse<T>(response);
		return { data: result, error: null };
	} catch (err) {
		const errorMessage = (err as Error).message;
		return { data: null, error: errorMessage };
	}
};

export const get = async <T>(
	url: string,
	event: { fetch: typeof fetch }
): Promise<ApiResponse<T>> => {
	return fetchData<T>(url, event);
};

export const post = async <T>(
	url: string,
	event: { fetch: typeof fetch },
	body: any
): Promise<ApiResponse<T>> => {
	return fetchData<T>(url, event, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});
};

export const put = async <T>(
	url: string,
	event: { fetch: typeof fetch },
	body: any
): Promise<ApiResponse<T>> => {
	return fetchData<T>(url, event, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});
};

export const patch = async <T>(
	url: string,
	event: { fetch: typeof fetch },
	body: any
): Promise<ApiResponse<T>> => {
	return fetchData<T>(url, event, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});
};

export const del = async <T>(
	url: string,
	event: { fetch: typeof fetch }
): Promise<ApiResponse<T>> => {
	return fetchData<T>(url, event, { method: 'DELETE' });
};
