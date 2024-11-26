/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Roboto", "sans-serif"], // Set Roboto as the default sans-serif font
			},
			colors: {
				accent: "var(--accent-color)"
			},
		},
	},

	plugins: [],
};
