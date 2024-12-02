import { useDismissOnClickOutside } from "@hooks/useDismissOnClickOutside";
import { authClient } from "@lib/auth-client";
import { Link, LinkOptions, linkOptions } from "@tanstack/react-router";
import { useRef, useState } from "react";

export default function ProfileButton() {
	const session = authClient.useSession();

	const [isActive, setIsActive] = useState(false);
	const divRef = useRef<HTMLDivElement | null>(null);
	useDismissOnClickOutside(divRef, setIsActive);
	
	return (
		<div className="w-full h-full flex justify-end relative p-1">
			<img
				data-ignore-click
				title={session.data?.user.name}
				src={session.data?.user.image ?? ""}
				alt="Profile image"
				className="w-auto h-full rounded-full p-2 hover:scale-105 transition-transform"
				onClick={() => setIsActive(!isActive)}
			/>
			{isActive && (
				<div
					ref={divRef}
					className="absolute top-full w-1/3 h-auto bg-slate-800 flex flex-col p-1 rounded-md"
				>
					<DropDownLink
						text={"Profile"}
						linkOptions={linkOptions({ to: "." })}
					/>
					<DropDownLink
						text={"Settings"}
						linkOptions={linkOptions({ to: "/settings" })}
					/>
					<hr className="border-t-slate-700 w-full" />
					<button
						className="w-full min-h-10 flex items-center px-3
					hover:bg-slate-700 transition-colors rounded-sm hover:underline"
					onClick={async () => {
						await authClient.signOut();
						window.location.reload();
					}}
					>
						Log Out
					</button>
				</div>
			)}
		</div>
	);
}

interface DropDownLinkProps {
	text: string;
	linkOptions: LinkOptions;
}

function DropDownLink({ text, linkOptions }: DropDownLinkProps) {
	return (
		<Link
			className="w-full min-h-10 flex items-center px-3 font-medium
			hover:bg-slate-700 transition-colors rounded-sm hover:underline"
			{...linkOptions}
		>
			{text}
		</Link>
	);
}
