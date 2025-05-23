import { authClient } from "@lib/auth-client";

interface FetchWithAuthOptions extends RequestInit {
	headers?: HeadersInit;
	body?: string | FormData;
	method?: string;
}

export const fetchWithAuth = async <T = any>(
	url: string,
	options: FetchWithAuthOptions = {},
	defaultHeaders = true,
): Promise<T> => {
	const headers = defaultHeaders ? {
		"Content-Type": "application/json",
	} : "";

	const response = await fetch(url, {
		...options,
		credentials: "include",
		method: options.method ?? "GET",
		headers: {
			...headers,
			...options.headers, // Allow custom headers to be passed
		},
		body: options.body
	});

	if (!response.ok) {
		throw new Error("Request failed");
	}

	return response.json() as Promise<T>;
};
