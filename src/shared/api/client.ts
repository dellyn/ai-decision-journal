export function httpClient(url: string, options: RequestInit) {
    return fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    })
}