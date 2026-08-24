import { type ComponentType, useEffect, useState } from "react";

export function GlobalDialogs() {
	const [Dialogs, setDialogs] = useState<ComponentType | null>(null);

	useEffect(() => {
		let cancelled = false;
		void import("./dialogs").then((module) => {
			if (!cancelled) setDialogs(() => module.Dialogs);
		});
		return () => {
			cancelled = true;
		};
	}, []);

	if (!Dialogs) return null;
	return <Dialogs />;
}
