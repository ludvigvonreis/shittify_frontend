import { authClient } from "@lib/auth-client";
import React from "react";

export default function ProfileButton() {
	const session = authClient.useSession();

	return (
		<div className="w-full h-full flex justify-end">
			<img
				src={session.data?.user.image ?? ""}
				alt="Profile image"
				className="w-auto h-full rounded-full p-2"
			/>
		</div>
	);
}
