import { useId } from "react";
import { twMerge } from "tailwind-merge";

interface IInput {
	type: "INPUT" | "TEXTAREA";
	label: string;
	className?: string;
	parentClassName?: string;
	placeHolder?: string;
	name?: string;

	value: string;
	onChange?: (
		event:
			| React.ChangeEvent<HTMLInputElement>
			| React.ChangeEvent<HTMLTextAreaElement>
	) => void;
}

export function Input({
	type,
	label,
	className,
	parentClassName,
	value,
	placeHolder,
	onChange,
	name,
}: IInput) {
	const id = useId();

	const baseClasses = `bg-slate-800 
			text-slate-200 border border-slate-600 
			rounded-md px-3 py-2 outline-none focus:ring-0 
			peer transition-colors duration-300`;

	const inputVariant = (
		<input
			id={id}
			type="text"
			className={twMerge(baseClasses, className)}
			value={value}
			placeholder={placeHolder}
			onChange={onChange}
			name={name}
		/>
	);

	const textAreaVariant = (
		<textarea
			id={id}
			className={twMerge(baseClasses, "resize-none", className)}
			value={value}
			placeholder={placeHolder}
			onChange={onChange}
			name={name}
		/>
	);

	return (
		<div className={twMerge("relative", parentClassName)}>
			{type === "INPUT" ? inputVariant : textAreaVariant}
			<label
				className="text-gray-300 text-sm absolute bg-slate-800
				left-3 bottom-full translate-y-1/2 px-2 duration-300
				peer-focus:opacity-100 opacity-0 transition-opacity font-medium"
				htmlFor={id}
			>
				{label}
			</label>
		</div>
	);
}
