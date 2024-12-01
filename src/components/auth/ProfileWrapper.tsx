import { useIsAuthenticated } from "@lib/auth-client";
import ProfileButton from "./ProfileButton";
import { Link, useLocation } from "@tanstack/react-router";

export default function ProfileWrapper() {
	const isAuthenticated = useIsAuthenticated();
	const location = useLocation();

	return (
		<>
			{isAuthenticated() ? (
				<ProfileButton />
			) : (
				<div className="flex justify-end h-full w-full p-2">
					<Link
						to="/login"
						search={{
							continuePath: location.href
						}}
						className="w-28 p-1 rounded-3xl bg-slate-600 font-medium transition-transform
							flex items-center justify-center text-white hover:scale-105"
					>
						Log In
					</Link>
				</div>
			)}
		</>
	);
}
