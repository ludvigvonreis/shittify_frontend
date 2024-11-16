import * as React from "react";
import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/search/$query")({
	component: RouteComponent,
});

function RouteComponent() {
	const { query } = Route.useParams();

	return `Hello /search/${query}!`;
}
