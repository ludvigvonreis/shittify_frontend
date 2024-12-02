import { createFileRoute } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { SettingsAtom } from "@atoms/atoms";
import { useEffect, useState } from "react";
import { useBlocker } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@utils/fetchWithAuth";

export const Route = createFileRoute("/settings/")({
	component: RouteComponent,
});

const updateSettings = async (data: Settings) => {
	return fetchWithAuth("http://localhost:3000/api/v1/settings", {
		body: JSON.stringify(data),
		method: "POST",
	});
};

const SelectableColors: { [key: string]: string } = {
	"#f43f5e": "Red",
	"#f97316": "Orange",
	"#eab308": "Yellow",
	"#84cc16": "Lime",
	"#10b981": "Green",
	"#0ea5e9": "Blue",
	"#6366f1": "Indigo",
	"#a855f7": "Violet",
	"#ec4899": "Pink",
};

function RouteComponent() {
	const queryClient = useQueryClient();

	// Data Loading
	const [settings] = useAtom(SettingsAtom);

	// "form" status.
	const [isDirty, setIsDirty] = useState(false);
	const [settingsCopy, setSettingsCopy] = useState<Settings | null>(null);

	// Mutations
	const mutation = useMutation({
		mutationFn: updateSettings,
		mutationKey: ["settings"],
		onSuccess: () => {
			setIsDirty(false);
		},
		onSettled: async () => {
			await queryClient.invalidateQueries();
		}
	});

	useEffect(() => {
		if (!settings) return;

		setSettingsCopy(settings);
	}, [settings, setSettingsCopy]);

	useBlocker({
		blockerFn: () => window.confirm("Are you sure you want to leave?"),
		condition: isDirty,
	});

	function onSave() {
		if (isDirty === false) return;
		if (!settingsCopy) return;

		console.log("Im saving your mother");

		const newSettings: Settings = {
			...settings,
			accentColor: settingsCopy.accentColor ?? "#1DB954",
		};
		mutation.mutate(newSettings);
	}

	if (!settings) return <></>;

	return (
		<main className="flex justify-center">
			<div className="w-1/2 h-max bg-slate-800 p-3 rounded-md flex flex-col gap-5">
				<h1 className="text-2xl font-bold mb-5">Settings</h1>
				<section className="flex flex-col gap-4">
					<h2 className="text-lg font-bold">Accent color</h2>
					<div className="flex flex-row h-auto w-auto gap-2 mx-auto justify-center">
						{Object.keys(SelectableColors).map((element: string) => {
							return (
								<div
									key={element}
									title={SelectableColors[element]}
									className={
										"size-6 rounded-md outline-white outline-1"
									}
									style={{
										backgroundColor: element,
										outlineStyle:
											settingsCopy?.accentColor ===
											element
												? "solid"
												: "none",
									}}
									onClick={() => {
										setIsDirty(true);
										setSettingsCopy({
											...settingsCopy,
											accentColor: element,
										});
									}}
								></div>
							);
						})}
					</div>
					<button
						className="mx-auto font-bold"
						onClick={() =>
							setSettingsCopy({
								...settingsCopy,
								accentColor: settings.accentColor,
							})
						}
					>
						Reset
					</button>
				</section>
				<hr className="border-t-2 w-full border-slate-700" />
				<button
					disabled={!isDirty}
					className="relative bg-accent h-10 w-max p-2 rounded-md ml-auto transition-colors
						disabled:bg-slate-600 disabled:cursor-not-allowed group"
					onClick={() => onSave()}
				>
					<span className="z-10">Save Settings</span>
				</button>

				<p>{mutation.error?.message}</p>
			</div>
		</main>
	);
}
