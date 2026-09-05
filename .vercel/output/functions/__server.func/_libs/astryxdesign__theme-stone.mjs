if (typeof globalThis.requestAnimationFrame === "undefined") globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
if (typeof globalThis.cancelAnimationFrame === "undefined") globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
try {
	globalThis.requestAnimationFrame;
	globalThis.cancelAnimationFrame;
} catch (e) {}
import { defineSyntaxTheme, defineTheme, require_jsx_runtime } from "./@astryxdesign/core+[...].mjs";
import { ArrowDown, ArrowUp, ArrowUpDown, Calendar, Check, CheckCheck, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, CircleCheckBig, CircleX, Clock, Columns2, Copy, Ellipsis, ExternalLink, EyeOff, Funnel, Info, Menu, Mic, Search, Square, TriangleAlert, Wrench, X } from "./@astryxdesign/theme-matcha+[...].mjs";
//#region node_modules/@astryxdesign/theme-stone/dist/source.mjs
var import_jsx_runtime = require_jsx_runtime();
var iconProps = {
	size: "1em",
	"aria-hidden": true
};
var stoneIconRegistry = {
	close: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { ...iconProps }),
	chevronDown: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { ...iconProps }),
	chevronLeft: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { ...iconProps }),
	chevronRight: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { ...iconProps }),
	chevronsLeft: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronsLeft, { ...iconProps }),
	chevronsRight: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronsRight, { ...iconProps }),
	check: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { ...iconProps }),
	success: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { ...iconProps }),
	error: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { ...iconProps }),
	warning: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { ...iconProps }),
	info: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { ...iconProps }),
	calendar: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { ...iconProps }),
	clock: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { ...iconProps }),
	externalLink: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { ...iconProps }),
	menu: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { ...iconProps }),
	moreHorizontal: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { ...iconProps }),
	search: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { ...iconProps }),
	arrowUp: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { ...iconProps }),
	arrowDown: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { ...iconProps }),
	arrowsUpDown: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, { ...iconProps }),
	funnel: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { ...iconProps }),
	eyeSlash: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { ...iconProps }),
	viewColumns: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Columns2, { ...iconProps }),
	copy: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { ...iconProps }),
	checkDouble: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { ...iconProps }),
	wrench: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { ...iconProps }),
	stop: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { ...iconProps }),
	microphone: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { ...iconProps })
};
var INPUT_STATUS_VARS = {
	"status:success": { "--color-success": "light-dark(#7f977e, #99b298)" },
	"status:warning": { "--color-warning": "light-dark(#9f8f68, #bbaa81)" },
	"status:error": { "--color-error": "light-dark(#a58b86, #c0a5a1)" }
};
var stoneSyntax = defineSyntaxTheme({
	name: "xds-stone",
	tokens: {
		keyword: ["#645a72", "#b2a7c1"],
		string: ["#4e6357", "#9bb19a"],
		comment: ["#5e5e5e", "#ababb0"],
		number: ["#755752", "#bea792"],
		function: ["#506072", "#99adc6"],
		type: ["#645a72", "#b2a7c1"],
		variable: ["#5e5e5e", "#ababb0"],
		operator: ["#5e5e5e", "#ababb0"],
		constant: ["#755752", "#bea792"],
		tag: ["#775751", "#c7a39d"],
		attribute: ["#79693f", "#b6aa90"],
		property: ["#4e6357", "#94b2a0"],
		punctuation: ["#5e5e5e", "#ababb0"],
		background: ["#f3f3f5", "#171719"]
	}
});
var stoneTheme = defineTheme({
	name: "stone",
	typography: {
		scale: {
			base: 14,
			ratio: 1.25
		},
		body: {
			family: "Figtree",
			fallbacks: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif"
		},
		heading: {
			family: "Montserrat",
			fallbacks: "\"Figtree\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif",
			weights: {
				3: "bold",
				4: "bold"
			}
		},
		code: {
			family: "JetBrains Mono",
			fallbacks: "\"SF Mono\", Monaco, Consolas, monospace"
		}
	},
	motion: {
		fast: 125,
		medium: 300,
		slow: 700,
		ratio: .75
	},
	syntax: stoneSyntax,
	tokens: {
		"--color-accent": ["#25252a", "#f3f3f5"],
		"--color-accent-muted": ["#25252a14", "#f3f3f520"],
		"--color-neutral": ["#25252a0f", "#f3f3f51a"],
		"--color-background-surface": ["#ffffff", "#1b1b1f"],
		"--color-background-body": ["#f3f3f5", "#111015"],
		"--color-overlay": ["#25252a80", "#28282acc"],
		"--color-overlay-hover": ["#25252a0d", "#f3f3f50d"],
		"--color-overlay-pressed": ["#25252a1a", "#f3f3f51a"],
		"--color-background-muted": ["#e2e2e8", "#3b3b3f"],
		"--color-text-primary": ["#25252a", "#f3f3f5"],
		"--color-text-secondary": ["#5e5e63", "#ababb0"],
		"--color-text-disabled": ["#d7d7da", "#5e5e61"],
		"--color-text-accent": ["#25252a", "#f3f3f5"],
		"--color-on-dark": "#FFFFFF",
		"--color-on-light": ["#25252a", "#28282a"],
		"--color-on-accent": ["#ffffff", "#25252a"],
		"--color-on-success": ["#374c36", "#d0e9ce"],
		"--color-on-error": ["#58413e", "#f9dcd7"],
		"--color-on-warning": ["#524622", "#f4e1b7"],
		"--color-icon-accent": ["#25252a", "#f3f3f5"],
		"--color-icon-primary": ["#25252a", "#f3f3f5"],
		"--color-icon-secondary": ["#83838a", "#9d9da3"],
		"--color-icon-disabled": ["#d7d7da", "#5e5e61"],
		"--color-background-card": ["#FFFFFF", "#242325"],
		"--color-background-popover": ["#ffffff", "#25252a"],
		"--color-background-inverted": ["#25252a", "#f3f3f5"],
		"--color-success": ["#374c36", "#b4cdb2"],
		"--color-success-muted": ["#d0e9ce", "#b4cdb2"],
		"--color-error": ["#58413e", "#dcc0bc"],
		"--color-error-muted": ["#f9dcd7", "#dcc0bc"],
		"--color-warning": ["#524622", "#d7c59c"],
		"--color-warning-muted": ["#f4e1b7", "#d7c59c"],
		"--color-border": ["#e2e2e8", "#f3f3f51a"],
		"--color-border-emphasized": ["#83838a", "#5e5e61"],
		"--color-skeleton": ["#d4d4da", "#5e5e64"],
		"--color-shadow": ["#25252a1a", "#0000004d"],
		"--color-tint-hover": ["black", "white"],
		"--text-supporting-size": "12px",
		"--color-background-blue": ["#d7e4f5", "#485362"],
		"--color-border-blue": ["#c9d6e7", "#313c4a"],
		"--color-icon-blue": ["#3c4856", "#d7e4f5"],
		"--color-text-blue": ["#3c4856", "#d7e4f5"],
		"--color-background-cyan": ["#cce8e5", "#3e5755"],
		"--color-border-cyan": ["#bedad7", "#28403e"],
		"--color-icon-cyan": ["#334b49", "#cce8e5"],
		"--color-text-cyan": ["#334b49", "#cce8e5"],
		"--color-background-gray": ["#e2e2e8", "#525257"],
		"--color-border-gray": ["#d4d4da", "#3b3b3f"],
		"--color-icon-gray": ["#46464b", "#e2e2e8"],
		"--color-text-gray": ["#46464b", "#e2e2e8"],
		"--color-background-green": ["#d0e9ce", "#425841"],
		"--color-border-green": ["#c2dbc0", "#2b402b"],
		"--color-icon-green": ["#374c36", "#d0e9ce"],
		"--color-text-green": ["#374c36", "#d0e9ce"],
		"--color-background-orange": ["#ffdcbb", "#684d32"],
		"--color-border-orange": ["#f1ceae", "#4f361c"],
		"--color-icon-orange": ["#5b4227", "#ffdcbb"],
		"--color-text-orange": ["#5b4227", "#ffdcbb"],
		"--color-background-pink": ["#f0dde8", "#5e4e57"],
		"--color-border-pink": ["#e2cfda", "#463740"],
		"--color-icon-pink": ["#52424c", "#f0dde8"],
		"--color-text-pink": ["#52424c", "#f0dde8"],
		"--color-background-purple": ["#e8dff3", "#564f60"],
		"--color-border-purple": ["#d9d1e5", "#3f3949"],
		"--color-icon-purple": ["#4b4454", "#e8dff3"],
		"--color-text-purple": ["#4b4454", "#e8dff3"],
		"--color-background-red": ["#f9dcd7", "#644d49"],
		"--color-border-red": ["#ebcec9", "#4c3633"],
		"--color-icon-red": ["#58413e", "#f9dcd7"],
		"--color-text-red": ["#58413e", "#f9dcd7"],
		"--color-background-teal": ["#d4e7dc", "#46564d"],
		"--color-border-teal": ["#c6d9ce", "#303f36"],
		"--color-icon-teal": ["#3b4a41", "#d4e7dc"],
		"--color-text-teal": ["#3b4a41", "#d4e7dc"],
		"--color-background-yellow": ["#f4e1b7", "#5e512d"],
		"--color-border-yellow": ["#e5d3a9", "#463a18"],
		"--color-icon-yellow": ["#524622", "#f4e1b7"],
		"--color-text-yellow": ["#524622", "#f4e1b7"],
		"--radius-none": "0px",
		"--radius-inner": "0.25rem",
		"--radius-element": "0.5rem",
		"--radius-container": "0.75rem",
		"--radius-page": "1.5rem",
		"--radius-full": "9999px",
		"--shadow-low": "0 2px 4px #28282A0D, 0 4px 8px #28282A1A",
		"--shadow-med": "0 2px 4px #28282A0D, 0 4px 12px #28282A1A",
		"--shadow-high": "0 4px 6px #28282A1A, 0 12px 24px #28282A26",
		"--shadow-inset-hover": "inset 0px 0px 0px 2px #28282A30",
		"--shadow-inset-selected": "inset 0px 0px 0px 2px #28282A50",
		"--shadow-inset-success": "inset 0px 0px 0px 2px #83838a30",
		"--shadow-inset-warning": "inset 0px 0px 0px 2px #83838a30",
		"--shadow-inset-error": "inset 0px 0px 0px 2px #83838a30"
	},
	components: {
		button: {
			base: { borderRadius: "var(--radius-full)" },
			"variant:secondary": {
				backgroundColor: "transparent",
				borderWidth: "1.5px",
				borderStyle: "solid",
				borderColor: "var(--color-border-emphasized)",
				":hover": { backgroundColor: "var(--color-neutral)" }
			},
			"variant:destructive": {
				backgroundColor: "var(--color-background-red)",
				color: "var(--color-text-red)"
			}
		},
		badge: {
			"variant:info": {
				backgroundColor: "var(--color-background-blue)",
				color: "var(--color-text-blue)"
			},
			"variant:neutral": {
				backgroundColor: "var(--color-background-gray)",
				color: "var(--color-text-gray)"
			},
			"variant:success": {
				backgroundColor: "var(--color-background-green)",
				color: "var(--color-text-green)"
			},
			"variant:warning": {
				backgroundColor: "var(--color-background-yellow)",
				color: "var(--color-text-yellow)"
			},
			"variant:error": {
				backgroundColor: "var(--color-background-red)",
				color: "var(--color-text-red)"
			}
		},
		banner: {
			"status:info": {
				"--color-accent-muted": "var(--color-background-blue)",
				"--color-text-primary": "var(--color-text-blue)",
				"--color-text-secondary": "var(--color-text-blue)",
				"--color-accent": "var(--color-text-blue)"
			},
			"status:success": {
				"--color-success-muted": "var(--color-background-green)",
				"--color-text-primary": "var(--color-text-green)",
				"--color-text-secondary": "var(--color-text-green)",
				"--color-success": "var(--color-text-green)"
			},
			"status:warning": {
				"--color-warning-muted": "var(--color-background-yellow)",
				"--color-text-primary": "var(--color-text-yellow)",
				"--color-text-secondary": "var(--color-text-yellow)",
				"--color-warning": "var(--color-text-yellow)"
			},
			"status:error": {
				"--color-error-muted": "var(--color-background-red)",
				"--color-text-primary": "var(--color-text-red)",
				"--color-text-secondary": "var(--color-text-red)",
				"--color-error": "var(--color-text-red)"
			}
		},
		"progressbar-fill": {
			"variant:accent": { backgroundColor: "light-dark(#d7e4f5, #a0acbc)" },
			"variant:success": { backgroundColor: "light-dark(#d0e9ce, #9ab298)" },
			"variant:warning": { backgroundColor: "light-dark(#f4e1b7, #bbaa82)" },
			"variant:error": { backgroundColor: "light-dark(#f9dcd7, #c0a5a0)" }
		},
		"progressbar-track": { base: { backgroundColor: "var(--color-skeleton)" } },
		switch: { base: { "--color-background-gray": "var(--color-skeleton)" } },
		"field-status": {
			"type:success": { backgroundColor: "var(--color-background-green)" },
			"type:warning": { backgroundColor: "var(--color-background-yellow)" },
			"type:error": { backgroundColor: "var(--color-background-red)" }
		},
		"text-input": INPUT_STATUS_VARS,
		textarea: INPUT_STATUS_VARS,
		"number-input": INPUT_STATUS_VARS,
		"date-input": INPUT_STATUS_VARS,
		"time-input": INPUT_STATUS_VARS,
		selector: INPUT_STATUS_VARS,
		"multi-selector": INPUT_STATUS_VARS,
		typeahead: INPUT_STATUS_VARS,
		tokenizer: INPUT_STATUS_VARS,
		card: { base: { padding: "var(--spacing-3)" } },
		section: { base: { padding: "var(--spacing-3)" } }
	},
	icons: stoneIconRegistry
});
//#endregion
export { stoneTheme };
