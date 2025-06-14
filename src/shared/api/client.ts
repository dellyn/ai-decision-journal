import { ApiError, createApiError } from './error-handler';

export async function httpClient<T>(url: string, options: RequestInit): Promise<T> {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
            body: options.body ? JSON.stringify(options.body) : undefined,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new ApiError(
                response.status,
                data.error?.message || 'An error occurred',
                data.error?.code
            );
        }

        return data;
    } catch (error) {
        throw createApiError(error);
    }
}