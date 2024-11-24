import { createFileRoute } from "@tanstack/react-router";
import { usePageTitle } from "@hooks/usePageTitle";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

function HomeComponent() {
	usePageTitle("Shitifiy");

	return (
		<div className="p-2">
			<h3>Welcome Home!</h3>
		</div>
	);
}
