import Icon from "@components/shared/Icon";
import { usePageTitle } from "@hooks/usePageTitle";
import { useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";

export default function SearchField() {
	usePageTitle("Shittify - Search");

	const navigate = useNavigate();
	const [search, setSearch] = useState("");
	const searchRef = useRef<HTMLInputElement | null>(null);

	function onChange() {
		if (searchRef.current == undefined) return;

		const searchValue = searchRef.current.value;

		setSearch(searchValue);
		if (searchValue === "" || searchValue === undefined) {
			navigate({
				to: "/search",
			});
		} else {
			navigate({
				to: "/search/$query",
				params: { query: searchValue },
			});
		}
	}

	function onFocus() {
		navigate({
			to: "/search",
		});
	}

	return (
		<div className="justify-center flex items-center">
			<div className="relative w-full">
				<div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
					<Icon type="search" />
				</div>
				<input
					ref={searchRef}
					type="text"
					className="text-sm rounded-lg block w-full ps-10 p-2.5
					bg-gray-700 border-gray-600 placeholder-gray-400 text-white
					hover:border-none focus:outline-none focus:ring-0 active:outline-none"
					placeholder="Search"
					onChange={onChange}
					onFocus={onFocus}
					value={search}
				/>
			</div>
		</div>
	);
}
