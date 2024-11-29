import Card from "@components/search/Card";
import { usePageTitle } from "@hooks/usePageTitle";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/search/")({
	component: RouteComponent,
});

function RouteComponent() {
	usePageTitle("Shittify - Search");

	return (
		<>
			<section className="p-5">
				<h1 className="text-3xl">Recent Searches</h1>
				<div className="flex flex-row gap-2">
					<Card
						type={"Artist"}
						subHeader="mijau"
						header={"Pink Floyd"}
						image={
							"http://localhost:3000/v1/static/images/qbbMyMJCoxdcEjGpuQixO.png"
						}
					/>
					<Card
						type={"Album"}
						subHeader="mijau"
						header={"Dark Side Of The Moon"}
						image={
							"http://localhost:3000/v1/static/images/vxdbijX247MGCZnEZYUUz.png"
						}
					/>
				</div>
			</section>
		</>
	);
}
