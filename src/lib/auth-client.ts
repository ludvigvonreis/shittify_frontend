import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: "http://localhost:3000/api/v1/auth"
})

export async function isAuthenticated(): Promise<boolean> {
	const session = await authClient.getSession();
		
	return !!session.data;
}

export function useIsAuthenticated() {
	const session = authClient.useSession();

	return () => {
		return (!!session.data);
	}
}