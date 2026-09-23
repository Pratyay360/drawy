import { useCallback, useRef } from "react";

export function useThrottleCallback<Params extends unknown[], Return>(
	callback: (...args: Params) => Return,
	delay: number,
): (...args: Params) => void {
	const lastCall = useRef(0);
	const timeout = useRef<NodeJS.Timeout | null>(null);

	return useCallback(
		(...args: Params) => {
			const now = Date.now();
			const remainingTime = delay - (now - lastCall.current);

			if (remainingTime <= 0) {
				if (timeout.current) {
					clearTimeout(timeout.current);
					timeout.current = null;
				}
				lastCall.current = now;
				callback(...args);
			} else if (!timeout.current) {
				timeout.current = setTimeout(() => {
					lastCall.current = Date.now();
					timeout.current = null;
					callback(...args);
				}, remainingTime);
			}
		},
		[callback, delay],
	);
}
