import Card from "@components/search/Card";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/search/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<section className="p-5">
				<h1 className="text-3xl">Recent Searches</h1>
				<div className="flex flex-row gap-2">
					<Card
						type={"Artist"}
						header={"Pink Floyd"}
						image={
							"http://192.168.198.128:3000/v1/static/images/qbbMyMJCoxdcEjGpuQixO.png"
						}
					/>
					<Card
						type={"Album"}
						header={"Dark Side Of The Moon"}
						image={
							"http://192.168.198.128:3000/v1/static/images/vxdbijX247MGCZnEZYUUz.png"
						}
					/>
				</div>
			</section>
		</>
	);
}
