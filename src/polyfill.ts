if (typeof window === "undefined") {
	Object.defineProperty(globalThis, "window", {
		value: globalThis,
		writable: true,
		configurable: true,
	});
	if (!("document" in globalThis)) {
		const createElement = () => ({
			getContext: () => ({
				measureText: () => ({ width: 0 }),
				fillRect: () => {},
				clearRect: () => {},
				getImageData: () => ({ data: new Uint8ClampedArray() }),
				putImageData: () => {},
				createImageData: () => ({ data: new Uint8ClampedArray() }),
				setTransform: () => {},
				drawImage: () => {},
				save: () => {},
				fillText: () => {},
				restore: () => {},
				beginPath: () => {},
				moveTo: () => {},
				lineTo: () => {},
				closePath: () => {},
				stroke: () => {},
				translate: () => {},
				scale: () => {},
				rotate: () => {},
				arc: () => {},
				fill: () => {},
			}),
			style: {},
			classList: {
				toggle: () => {},
				add: () => {},
				remove: () => {},
				contains: () => false,
			},
			setAttribute: () => {},
			getAttribute: () => null,
			addEventListener: () => {},
			removeEventListener: () => {},
			dispatchEvent: () => false,
			appendChild: (child: any) => child,
			removeChild: (child: any) => child,
			querySelector: () => null,
			querySelectorAll: () => [],
		});
		Object.defineProperty(globalThis, "document", {
			value: {
				createElement,
				documentElement: {
					classList: { toggle: () => {}, add: () => {}, remove: () => {} },
					dataset: {},
					style: {},
				},
				body: createElement(),
				head: createElement(),
				querySelector: () => null,
				querySelectorAll: () => [],
				addEventListener: () => {},
				removeEventListener: () => {},
				dispatchEvent: () => false,
			},
			writable: true,
			configurable: true,
		});
	}
	if (!("navigator" in globalThis)) {
		Object.defineProperty(globalThis, "navigator", {
			value: {
				userAgent: "node",
				platform: "node",
			},
			writable: true,
			configurable: true,
		});
	}
	if (!("location" in globalThis)) {
		Object.defineProperty(globalThis, "location", {
			value: {
				origin: "http://localhost",
				protocol: "http:",
				host: "localhost",
				hostname: "localhost",
				port: "",
				pathname: "/",
				search: "",
				hash: "",
				href: "http://localhost/",
			},
			writable: true,
			configurable: true,
		});
	}
	if (!("EXCALIDRAW_EXPORT_SOURCE" in globalThis)) {
		(globalThis as any).EXCALIDRAW_EXPORT_SOURCE = "http://localhost";
	}
	if (!("devicePixelRatio" in globalThis)) {
		(globalThis as any).devicePixelRatio = 1;
	}
	if (!("requestAnimationFrame" in globalThis)) {
		(globalThis as any).requestAnimationFrame = (
			callback: FrameRequestCallback,
		) => setTimeout(() => callback(Date.now()), 0);
	}
	if (!("cancelAnimationFrame" in globalThis)) {
		(globalThis as any).cancelAnimationFrame = (id: number) => clearTimeout(id);
	}
	if (!("matchMedia" in globalThis)) {
		(globalThis as any).matchMedia = () => ({
			matches: false,
			addListener: () => {},
			removeListener: () => {},
			addEventListener: () => {},
			removeEventListener: () => {},
			dispatchEvent: () => false,
		});
	}
	class ElementStub {}
	if (!("Element" in globalThis)) {
		(globalThis as any).Element = ElementStub;
	}
	if (!("HTMLElement" in globalThis)) {
		(globalThis as any).HTMLElement = class HTMLElement extends ElementStub {};
	}
	if (!("SVGElement" in globalThis)) {
		(globalThis as any).SVGElement = class SVGElement extends ElementStub {};
	}
	if (!("HTMLCanvasElement" in globalThis)) {
		(globalThis as any).HTMLCanvasElement = class HTMLCanvasElement extends (
			ElementStub
		) {};
	}
}
export default function () {
	// Polyfills executed at module load
}
