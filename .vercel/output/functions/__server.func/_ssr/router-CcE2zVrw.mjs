if (typeof globalThis.requestAnimationFrame === "undefined") globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
if (typeof globalThis.cancelAnimationFrame === "undefined") globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
try {
	globalThis.requestAnimationFrame;
	globalThis.cancelAnimationFrame;
} catch (e) {}
import { __toESM } from "../_runtime.mjs";
import { Theme, defineSyntaxTheme, defineTheme, require_jsx_runtime, require_react } from "../_libs/@astryxdesign/core+[...].mjs";
import { HeadContent, Scripts, createFileRoute, createRootRouteWithContext, createRouter, lazyRouteComponent, redirect } from "../_libs/@tanstack/react-router+[...].mjs";
import { TSS_SERVER_FUNCTION, createServerFn, getServerFnById } from "./ssr.mjs";
import { createSupabaseAdminClient } from "./server-supabase-DoqNbnQq.mjs";
import { ArrowDown, ArrowUp, ArrowUpDown, Calendar, Check, CheckCheck, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, CircleCheckBig, CircleX, Clock, Columns2, Copy, Ellipsis, ExternalLink, EyeOff, Funnel, Info, Menu, Mic, Search, Square, TriangleAlert, Wrench, X, matchaTheme } from "../_libs/@astryxdesign/theme-matcha+[...].mjs";
import { any, array, boolean, number, object, record, string } from "../_libs/zod.mjs";
import { neutralTheme } from "../_libs/astryxdesign__theme-neutral.mjs";
import { stoneTheme } from "../_libs/astryxdesign__theme-stone.mjs";
import { y2kTheme } from "../_libs/astryxdesign__theme-y2k.mjs";
import { SmartCoercionPlugin, os } from "../_libs/@orpc/json-schema+[...].mjs";
import { ORPCError, onError } from "../_libs/@orpc/client+[...].mjs";
import { QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { QueryClient } from "../_libs/tanstack__query-core.mjs";
import { OpenAPIHandler, OpenAPIReferencePlugin, RPCHandler } from "../_libs/@orpc/openapi+[...].mjs";
import { ZodToJsonSchemaConverter } from "../_libs/orpc__zod+zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CcE2zVrw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var authInput = object({
	username: string().min(1, "Username is required"),
	password: string().min(1, "Password must be at least 1 characters").max(128, "Password is too long")
});
var getCurrentUser = createServerFn({ method: "GET" }).handler(createSsrRpc("d5e82007b47147f145f963d5be968dacdc8650b94e7b7acbccd798481667f8c2"));
var signIn = createServerFn({ method: "POST" }).validator(authInput).handler(createSsrRpc("a4d3d4730f48f1e2519ac989fac8f688ba4c010085f3723244762dd3de614dca"));
var signUp = createServerFn({ method: "POST" }).validator(authInput).handler(createSsrRpc("8fe7bbce9692fe7ceb3a35635e6520a7e1bd465714761009724ddc71260b5add"));
var logout = createServerFn({ method: "POST" }).handler(createSsrRpc("1b90f4feb8175e40785b2aba78db201a0b0269327953c16d833808a1166bd7cd"));
var iconProps$1 = {
	size: "1em",
	"aria-hidden": true
};
var butterIconRegistry = {
	close: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { ...iconProps$1 }),
	chevronDown: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { ...iconProps$1 }),
	chevronLeft: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { ...iconProps$1 }),
	chevronRight: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { ...iconProps$1 }),
	chevronsLeft: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronsLeft, { ...iconProps$1 }),
	chevronsRight: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronsRight, { ...iconProps$1 }),
	check: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { ...iconProps$1 }),
	success: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { ...iconProps$1 }),
	error: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { ...iconProps$1 }),
	warning: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { ...iconProps$1 }),
	info: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { ...iconProps$1 }),
	calendar: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { ...iconProps$1 }),
	clock: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { ...iconProps$1 }),
	externalLink: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { ...iconProps$1 }),
	menu: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { ...iconProps$1 }),
	moreHorizontal: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { ...iconProps$1 }),
	search: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { ...iconProps$1 }),
	arrowUp: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { ...iconProps$1 }),
	arrowDown: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { ...iconProps$1 }),
	arrowsUpDown: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, { ...iconProps$1 }),
	funnel: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { ...iconProps$1 }),
	eyeSlash: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { ...iconProps$1 }),
	viewColumns: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Columns2, { ...iconProps$1 }),
	copy: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { ...iconProps$1 }),
	checkDouble: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { ...iconProps$1 }),
	wrench: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { ...iconProps$1 }),
	stop: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { ...iconProps$1 }),
	microphone: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { ...iconProps$1 })
};
/**
* Butter Theme
*
* Warm, golden buttery theme with blue accents.
* Sarina for display, Outfit for headings and body.
*
* Source palette (per design):
*   Accent  #225BFF   Gray    #868B99   Red     #FF7553
*   Orange  #FFA347   Yellow  #fdee8c   Green   #5DCE5F
*   Cyan    #60CFD3   Teal    #6CD9A8   Blue    #5681FF
*   Purple  #B780F6   Pink    #F680E8   Error   #FF5947
*   Warning #F8C726   Success #91D143
*
* All tonal ramps derived in CIELab (matches the algorithm used by
* ThemePalettePreview so card / badge / banner / strip render the
* same values). Regen via scripts/butter-palette-gen.mjs if sources
* change.
*/
/** Butter syntax palette — T25 / T80 of each color's ramp. */
var butterSyntax = defineSyntaxTheme({
	name: "xds-butter",
	tokens: {
		keyword: ["#52237b", "#ddb9f6"],
		string: ["#004800", "#a5d29d"],
		comment: ["#605f52", "#adac9e"],
		number: ["#622e00", "#f2bd81"],
		function: ["#203a6c", "#bdc5eb"],
		type: ["#52237b", "#ddb9f6"],
		variable: ["#605f52", "#adac9e"],
		operator: ["#605f52", "#adac9e"],
		constant: ["#622e00", "#f2bd81"],
		tag: ["#6d211c", "#f4b8ae"],
		attribute: ["#413e00", "#d6c957"],
		property: ["#00482d", "#94d3bb"],
		punctuation: ["#605f52", "#adac9e"],
		background: ["#FDFBE4", "#131107"]
	}
});
var butterTheme = defineTheme({
	name: "butter",
	typography: {
		scale: {
			base: 14,
			ratio: 1.25
		},
		body: {
			family: "Outfit",
			fallbacks: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif"
		},
		heading: {
			family: "Outfit",
			fallbacks: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif",
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
	syntax: butterSyntax,
	tokens: {
		"--color-accent": ["#225BFF", "#FDEE8C"],
		"--color-accent-muted": ["#225BFF33", "#FDEE8C40"],
		"--color-neutral": ["#1d1c110F", "#f3f2e21A"],
		"--color-background-surface": ["#FFFFFF", "#2E2117"],
		"--color-background-body": ["#FDFBE4", "#261A13"],
		"--color-overlay": ["#1d1c1180", "#261A13cc"],
		"--color-overlay-hover": ["#1d1c110D", "#f3f2e20D"],
		"--color-overlay-pressed": ["#1d1c111A", "#f3f2e21A"],
		"--color-background-muted": ["#f3f2e2", "#3A2A1F"],
		"--color-text-primary": ["#1d1c11", "#f3f2e2"],
		"--color-text-secondary": ["#605f52", "#adac9e"],
		"--color-text-disabled": ["#adac9e", "#605f52"],
		"--color-text-accent": ["#225BFF", "#FDEE8C"],
		"--color-on-dark": "#ffffff",
		"--color-on-light": "#1d1c11",
		"--color-on-accent": ["#ffffff", "#1d1c11"],
		"--color-on-success": ["#ccff88", "#0b2e00"],
		"--color-on-error": ["#ffe3de", "#600000"],
		"--color-on-warning": ["#ffeec3", "#3b2200"],
		"--color-icon-accent": ["#225BFF", "#FDEE8C"],
		"--color-icon-primary": ["#1d1c11", "#f3f2e2"],
		"--color-icon-secondary": ["#605f52", "#adac9e"],
		"--color-icon-disabled": ["#adac9e", "#605f52"],
		"--color-background-card": ["#FFFFFF", "#3A2A1F"],
		"--color-background-popover": ["#FFFFFF", "#3A2A1F"],
		"--color-background-inverted": ["#1d1c11", "#FDFBE4"],
		"--color-error": ["#771210", "#ffb4a6"],
		"--color-error-muted": ["#77121033", "#ffb4a640"],
		"--color-warning": ["#543700", "#f7be00"],
		"--color-warning-muted": ["#54370033", "#f7be0040"],
		"--color-success": ["#004700", "#99d94b"],
		"--color-success-muted": ["#00470033", "#99d94b40"],
		"--color-border": ["#e5e3d4", "#f3f2e21A"],
		"--color-border-emphasized": ["#C7C4B2", "#939184"],
		"--color-skeleton": ["#e5e3d4", "#49473b"],
		"--color-shadow": ["#1d1c111A", "#0000004D"],
		"--color-tint-hover": ["black", "white"],
		"--text-supporting-size": "12px",
		"--size-element-sm": "32px",
		"--size-element-md": "40px",
		"--size-element-lg": "48px",
		"--color-background-blue": ["#dbe1ff", "#dbe1ff"],
		"--color-border-blue": ["#bdc5eb", "#bdc5eb"],
		"--color-icon-blue": ["#203a6c", "#203a6c"],
		"--color-text-blue": ["#203a6c", "#203a6c"],
		"--color-background-cyan": ["#a9eff0", "#a9eff0"],
		"--color-border-cyan": ["#8dd2d3", "#8dd2d3"],
		"--color-icon-cyan": ["#004649", "#004649"],
		"--color-text-cyan": ["#004649", "#004649"],
		"--color-background-gray": ["#f0edd4", "#f0edd4"],
		"--color-border-gray": ["#d6d3b8", "#d6d3b8"],
		"--color-icon-gray": ["#4a4732", "#4a4732"],
		"--color-text-gray": ["#4a4732", "#4a4732"],
		"--color-background-green": ["#c1efb8", "#c1efb8"],
		"--color-border-green": ["#a5d29d", "#a5d29d"],
		"--color-icon-green": ["#004800", "#004800"],
		"--color-text-green": ["#004800", "#004800"],
		"--color-background-orange": ["#ffdcb6", "#ffdcb6"],
		"--color-border-orange": ["#f2bd81", "#f2bd81"],
		"--color-icon-orange": ["#622e00", "#622e00"],
		"--color-text-orange": ["#622e00", "#622e00"],
		"--color-background-pink": ["#ffd5fb", "#ffd5fb"],
		"--color-border-pink": ["#f0b3e8", "#f0b3e8"],
		"--color-icon-pink": ["#6c0a68", "#6c0a68"],
		"--color-text-pink": ["#6c0a68", "#6c0a68"],
		"--color-background-purple": ["#f2daff", "#f2daff"],
		"--color-border-purple": ["#ddb9f6", "#ddb9f6"],
		"--color-icon-purple": ["#52237b", "#52237b"],
		"--color-text-purple": ["#52237b", "#52237b"],
		"--color-background-red": ["#ffdad3", "#ffdad3"],
		"--color-border-red": ["#f4b8ae", "#f4b8ae"],
		"--color-icon-red": ["#6d211c", "#6d211c"],
		"--color-text-red": ["#6d211c", "#6d211c"],
		"--color-background-teal": ["#b0f0d7", "#b0f0d7"],
		"--color-border-teal": ["#94d3bb", "#94d3bb"],
		"--color-icon-teal": ["#00482d", "#00482d"],
		"--color-text-teal": ["#00482d", "#00482d"],
		"--color-background-yellow": ["#feee7b", "#feee7b"],
		"--color-border-yellow": ["#d6c957", "#d6c957"],
		"--color-icon-yellow": ["#413e00", "#413e00"],
		"--color-text-yellow": ["#413e00", "#413e00"],
		"--radius-none": "0px",
		"--radius-inner": "0.375rem",
		"--radius-element": "0.5rem",
		"--radius-container": "0.75rem",
		"--radius-page": "1.5rem",
		"--radius-full": "9999px",
		"--shadow-low": "0 2px 4px #1d1c110D, 0 4px 8px #1d1c111A",
		"--shadow-med": "0 2px 4px #1d1c110D, 0 4px 12px #1d1c111A",
		"--shadow-high": "0 4px 6px #1d1c111A, 0 12px 24px #1d1c1126",
		"--shadow-inset-hover": "inset 0px 0px 0px 2px #79786a30",
		"--shadow-inset-selected": "inset 0px 0px 0px 2px #79786a50",
		"--shadow-inset-success": "inset 0px 0px 0px 2px #00470030",
		"--shadow-inset-warning": "inset 0px 0px 0px 2px #54370030",
		"--shadow-inset-error": "inset 0px 0px 0px 2px #77121030"
	},
	components: {
		"top-nav-heading": { base: {
			color: "light-dark(#225BFF, #FDEE8C)",
			"--color-text-primary": "light-dark(#225BFF, #FDEE8C)"
		} },
		"top-nav-item": {
			base: { color: "light-dark(#6E92FF, #FDEE8CCC)" },
			selected: {
				color: "light-dark(#225BFF, #FDEE8C)",
				backgroundColor: "transparent",
				":hover": { backgroundColor: "var(--color-overlay-hover)" },
				":active": { backgroundColor: "var(--color-overlay-pressed)" }
			}
		},
		button: {
			base: {
				paddingBlock: "var(--spacing-3)",
				paddingInline: "var(--spacing-4)"
			},
			"variant:secondary": {
				backgroundColor: "transparent",
				borderWidth: "1.5px",
				borderStyle: "solid",
				borderColor: "light-dark(#225BFF, #FDEE8C)",
				color: "light-dark(#225BFF, #FDEE8C)",
				":hover": { backgroundColor: "light-dark(#225BFF14, #FDEE8C14)" }
			},
			"variant:ghost": { color: "light-dark(#225BFF, #FDEE8C)" },
			"variant:destructive": {
				backgroundColor: "light-dark(#ffdad3, #f4b8ae)",
				color: "light-dark(#550000, #6d211c)"
			}
		},
		badge: {
			base: {
				height: "30px",
				paddingBlock: "0",
				paddingInline: "var(--spacing-3)"
			},
			"variant:info": {
				backgroundColor: "#4883fd",
				color: "#ffffff"
			},
			"variant:neutral": {
				backgroundColor: "#ffee7b",
				color: "#225BFF"
			},
			"variant:success": {
				backgroundColor: "#91D143",
				color: "#1d1c11"
			},
			"variant:warning": {
				backgroundColor: "#ffc502",
				color: "#1d1c11"
			},
			"variant:error": {
				backgroundColor: "#fc473b",
				color: "#ffffff"
			}
		},
		banner: {
			"status:info": {
				"--color-accent-muted": "#4883fd",
				"--color-text-primary": "#ffffff",
				"--color-text-secondary": "#ffffff",
				"--color-accent": "#ffffff"
			},
			"status:success": {
				"--color-success-muted": "#91D143",
				"--color-text-primary": "#1d1c11",
				"--color-text-secondary": "#1d1c11",
				"--color-success": "#1d1c11"
			},
			"status:warning": {
				"--color-warning-muted": "#ffc502",
				"--color-text-primary": "#1d1c11",
				"--color-text-secondary": "#1d1c11",
				"--color-warning": "#1d1c11"
			},
			"status:error": {
				"--color-error-muted": "#fc473b",
				"--color-text-primary": "#ffffff",
				"--color-text-secondary": "#ffffff",
				"--color-error": "#ffffff"
			}
		},
		card: {
			base: {
				borderRadius: "var(--radius-container)",
				padding: "var(--spacing-4)"
			},
			"variant:info": {
				"--color-text-primary": "#1d1c11",
				"--color-text-secondary": "#605f52"
			},
			"variant:success": {
				"--color-text-primary": "#1d1c11",
				"--color-text-secondary": "#605f52"
			},
			"variant:warning": {
				"--color-text-primary": "#1d1c11",
				"--color-text-secondary": "#605f52"
			},
			"variant:error": {
				"--color-text-primary": "#1d1c11",
				"--color-text-secondary": "#605f52"
			},
			"variant:blue": {
				"--color-text-primary": "#1d1c11",
				"--color-text-secondary": "#605f52"
			},
			"variant:cyan": {
				"--color-text-primary": "#1d1c11",
				"--color-text-secondary": "#605f52"
			},
			"variant:gray": {
				"--color-text-primary": "#1d1c11",
				"--color-text-secondary": "#605f52"
			},
			"variant:green": {
				"--color-text-primary": "#1d1c11",
				"--color-text-secondary": "#605f52"
			},
			"variant:orange": {
				"--color-text-primary": "#1d1c11",
				"--color-text-secondary": "#605f52"
			},
			"variant:pink": {
				"--color-text-primary": "#1d1c11",
				"--color-text-secondary": "#605f52"
			},
			"variant:purple": {
				"--color-text-primary": "#1d1c11",
				"--color-text-secondary": "#605f52"
			},
			"variant:red": {
				"--color-text-primary": "#1d1c11",
				"--color-text-secondary": "#605f52"
			},
			"variant:teal": {
				"--color-text-primary": "#1d1c11",
				"--color-text-secondary": "#605f52"
			},
			"variant:yellow": {
				"--color-text-primary": "#1d1c11",
				"--color-text-secondary": "#605f52"
			},
			"variant:muted": {
				"--color-text-primary": "#1d1c11",
				"--color-text-secondary": "#605f52"
			}
		},
		section: { base: { padding: "var(--spacing-4)" } },
		"progressbar-track": { base: { backgroundColor: "light-dark(#e5e3d4, #725538)" } },
		"progressbar-fill": {
			"variant:success": { backgroundColor: "#91D143" },
			"variant:warning": { backgroundColor: "#ffc502" },
			"variant:error": { backgroundColor: "#fc473b" }
		},
		"field-status": {
			"type:success": {
				backgroundColor: "#91D143",
				color: "#1d1c11"
			},
			"type:warning": {
				backgroundColor: "#ffc502",
				color: "#1d1c11"
			},
			"type:error": {
				backgroundColor: "#fc473b",
				color: "#ffffff"
			}
		},
		"text-input": {
			base: {
				paddingBlock: "var(--spacing-2)",
				paddingInline: "var(--spacing-3)",
				borderColor: "var(--color-border)"
			},
			"status:success": { "--color-success": "#91D143" },
			"status:warning": { "--color-warning": "#ffc502" },
			"status:error": { "--color-error": "#fc473b" }
		},
		textarea: {
			base: {
				paddingBlock: "var(--spacing-2)",
				paddingInline: "var(--spacing-3)",
				borderColor: "var(--color-border)"
			},
			"status:success": { "--color-success": "#91D143" },
			"status:warning": { "--color-warning": "#ffc502" },
			"status:error": { "--color-error": "#fc473b" }
		},
		"number-input": {
			base: {
				paddingBlock: "var(--spacing-2)",
				paddingInline: "var(--spacing-3)",
				borderColor: "var(--color-border)"
			},
			"status:success": { "--color-success": "#91D143" },
			"status:warning": { "--color-warning": "#ffc502" },
			"status:error": { "--color-error": "#fc473b" }
		},
		"date-input": {
			base: {
				paddingBlock: "var(--spacing-2)",
				paddingInline: "var(--spacing-3)",
				borderColor: "var(--color-border)"
			},
			"status:success": { "--color-success": "#91D143" },
			"status:warning": { "--color-warning": "#ffc502" },
			"status:error": { "--color-error": "#fc473b" }
		},
		"time-input": {
			base: {
				paddingBlock: "var(--spacing-2)",
				paddingInline: "var(--spacing-3)",
				borderColor: "var(--color-border)"
			},
			"status:success": { "--color-success": "#91D143" },
			"status:warning": { "--color-warning": "#ffc502" },
			"status:error": { "--color-error": "#fc473b" }
		},
		selector: {
			base: {
				paddingBlock: "var(--spacing-2)",
				paddingInline: "var(--spacing-3)",
				borderColor: "var(--color-border)"
			},
			"status:success": { "--color-success": "#91D143" },
			"status:warning": { "--color-warning": "#ffc502" },
			"status:error": { "--color-error": "#fc473b" }
		},
		"multi-selector": {
			base: {
				paddingBlock: "var(--spacing-2)",
				paddingInline: "var(--spacing-3)",
				borderColor: "var(--color-border)"
			},
			"status:success": { "--color-success": "#91D143" },
			"status:warning": { "--color-warning": "#ffc502" },
			"status:error": { "--color-error": "#fc473b" }
		},
		typeahead: {
			base: {
				paddingBlock: "var(--spacing-2)",
				paddingInline: "var(--spacing-3)",
				borderColor: "var(--color-border)"
			},
			"status:success": { "--color-success": "#91D143" },
			"status:warning": { "--color-warning": "#ffc502" },
			"status:error": { "--color-error": "#fc473b" }
		},
		tokenizer: {
			base: {
				paddingBlock: "var(--spacing-2)",
				paddingInline: "var(--spacing-3)",
				borderColor: "var(--color-border)"
			},
			"status:success": { "--color-success": "#91D143" },
			"status:warning": { "--color-warning": "#ffc502" },
			"status:error": { "--color-error": "#fc473b" }
		},
		text: {
			"type:display-1": { fontFamily: "Sarina, \"Brush Script MT\", \"Snell Roundhand\", cursive" },
			"type:display-2": { fontFamily: "Sarina, \"Brush Script MT\", \"Snell Roundhand\", cursive" },
			"type:display-3": { fontFamily: "Sarina, \"Brush Script MT\", \"Snell Roundhand\", cursive" }
		}
	},
	icons: butterIconRegistry
});
var iconProps = {
	size: "1em",
	"aria-hidden": true
};
var gothicIconRegistry = {
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
/**
* Gothic Theme — dark only
*
* A dark-only theme with deep blue-gray tones and a distressed display
* heading. Inspired by ink, manuscript, and noir typography.
*
* Core palette: #E8F1F6, #96A0AB, #495056, #24292D, #101314
* Categorical colors follow a pastel-on-dark pattern (light backgrounds
* with dark text) — same in any system color preference.
*
* Uses Manufacturing Consent for headings and Fustat for body text.
*/
/**
* Gothic syntax palette — atmospheric tones drawn from the gothic
* categorical palette: deep purples (cathedral), blood crimson (tags),
* aged gold (numbers), forest moss (strings), midnight indigo (functions).
*
* Single values (no tuples) since this is a dark-only theme.
*/
var gothicSyntax = defineSyntaxTheme({
	name: "xds-gothic",
	tokens: {
		keyword: "#c39adb",
		string: "#a3c987",
		comment: "#6b7079",
		number: "#dec074",
		function: "#8aa1d8",
		type: "#c39adb",
		variable: "#E8F1F6",
		operator: "#96A0AB",
		constant: "#e6b85e",
		tag: "#d97580",
		attribute: "#dec074",
		property: "#7cc5b3",
		punctuation: "#7a8290",
		background: "#101314"
	}
});
var gothicTheme = defineTheme({
	name: "gothic",
	typography: {
		scale: {
			base: 16,
			ratio: 1.25
		},
		body: {
			family: "Fustat",
			fallbacks: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif"
		},
		heading: {
			family: "Fustat",
			fallbacks: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif",
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
		fast: 150,
		medium: 350,
		slow: 800,
		ratio: .75
	},
	syntax: gothicSyntax,
	tokens: {
		"--color-accent": "#E8F1F6",
		"--color-accent-muted": "#E8F1F620",
		"--color-neutral": "#E8F1F61A",
		"--color-background-surface": "#101314",
		"--color-background-body": "#101314",
		"--color-overlay": "#101314CC",
		"--color-overlay-hover": "#E8F1F60D",
		"--color-overlay-pressed": "#E8F1F61A",
		"--color-background-muted": "#24292D",
		"--color-text-primary": "#E8F1F6",
		"--color-text-secondary": "#96A0AB",
		"--color-text-disabled": "#495056",
		"--color-text-accent": "#E8F1F6",
		"--color-on-dark": "#E8F1F6",
		"--color-on-light": "#101314",
		"--color-on-accent": "#101314",
		"--color-on-success": "#101314",
		"--color-on-error": "#101314",
		"--color-on-warning": "#101314",
		"--color-icon-accent": "#E8F1F6",
		"--color-icon-primary": "#E8F1F6",
		"--color-icon-secondary": "#96A0AB",
		"--color-icon-disabled": "#495056",
		"--color-background-card": "#1a1d20",
		"--color-background-popover": "#24292D",
		"--color-background-inverted": "#E8F1F6",
		"--color-success": "#b3c79a",
		"--color-success-muted": "#b3c79a",
		"--color-error": "#c6a6a2",
		"--color-error-muted": "#c6a6a2",
		"--color-warning": "#d3c490",
		"--color-warning-muted": "#d3c490",
		"--color-border": "#E8F1F61A",
		"--color-border-emphasized": "#495056",
		"--color-skeleton": "#495056",
		"--color-shadow": "#0000004D",
		"--color-tint-hover": "white",
		"--color-background-blue": "#a3b5d6",
		"--color-border-blue": "#8696b8",
		"--color-icon-blue": "#2a3b6e",
		"--color-text-blue": "#1f2c54",
		"--color-background-cyan": "#a3c2cf",
		"--color-border-cyan": "#86a4b1",
		"--color-icon-cyan": "#2a5e75",
		"--color-text-cyan": "#204858",
		"--color-background-gray": "#3d4248",
		"--color-border-gray": "#5d646b",
		"--color-icon-gray": "#E8F1F6",
		"--color-text-gray": "#E8F1F6",
		"--color-background-green": "#b3c79a",
		"--color-border-green": "#96a880",
		"--color-icon-green": "#3a5e2c",
		"--color-text-green": "#244023",
		"--color-background-orange": "#d3b89a",
		"--color-border-orange": "#b6987d",
		"--color-icon-orange": "#8a4818",
		"--color-text-orange": "#6e3812",
		"--color-background-pink": "#c89aab",
		"--color-border-pink": "#aa7d8e",
		"--color-icon-pink": "#8d2d4c",
		"--color-text-pink": "#71223c",
		"--color-background-purple": "#b29bc4",
		"--color-border-purple": "#947da6",
		"--color-icon-purple": "#5a2370",
		"--color-text-purple": "#481b58",
		"--color-background-red": "#c6a6a2",
		"--color-border-red": "#a48581",
		"--color-icon-red": "#5e3a35",
		"--color-text-red": "#4a2520",
		"--color-background-teal": "#a3c2b6",
		"--color-border-teal": "#86a499",
		"--color-icon-teal": "#1f5e52",
		"--color-text-teal": "#174a40",
		"--color-background-yellow": "#d3c490",
		"--color-border-yellow": "#b6a775",
		"--color-icon-yellow": "#876515",
		"--color-text-yellow": "#6c5010",
		"--radius-none": "0px",
		"--radius-inner": "0.25rem",
		"--radius-element": "0.5rem",
		"--radius-container": "0.75rem",
		"--radius-page": "1.5rem",
		"--radius-full": "9999px",
		"--shadow-low": "0 2px 4px #00000033, 0 4px 8px #00000040",
		"--shadow-med": "0 2px 4px #00000033, 0 4px 12px #00000040",
		"--shadow-high": "0 4px 6px #00000040, 0 12px 24px #0000004D",
		"--shadow-inset-hover": "inset 0px 0px 0px 1px #96A0AB30",
		"--shadow-inset-selected": "inset 0px 0px 0px 2px #96A0AB50",
		"--shadow-inset-success": "inset 0px 0px 0px 1px #87b06a50",
		"--shadow-inset-warning": "inset 0px 0px 0px 1px #d6b56a50",
		"--shadow-inset-error": "inset 0px 0px 0px 1px #d4485150"
	},
	components: {
		button: {
			"variant:secondary": {
				backgroundColor: "var(--color-background-gray)",
				color: "var(--color-text-gray)",
				borderColor: "transparent",
				borderWidth: "0"
			},
			"variant:ghost": { ":hover": { backgroundColor: "var(--color-overlay-hover)" } },
			"variant:destructive": {
				backgroundColor: "var(--color-error)",
				color: "var(--color-text-red)"
			}
		},
		badge: {
			base: {
				borderRadius: "var(--radius-element)",
				fontWeight: "var(--font-weight-medium)"
			},
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
			base: { borderRadius: "var(--radius-element)" },
			"status:info": {
				backgroundColor: "var(--color-background-blue)",
				"--color-text-primary": "var(--color-text-blue)",
				"--color-text-secondary": "var(--color-text-blue)",
				"--color-accent": "var(--color-text-blue)"
			},
			"status:success": {
				backgroundColor: "var(--color-background-green)",
				"--color-text-primary": "var(--color-text-green)",
				"--color-text-secondary": "var(--color-text-green)",
				"--color-success": "var(--color-text-green)"
			},
			"status:warning": {
				backgroundColor: "var(--color-background-yellow)",
				"--color-text-primary": "var(--color-text-yellow)",
				"--color-text-secondary": "var(--color-text-yellow)",
				"--color-warning": "var(--color-text-yellow)"
			},
			"status:error": {
				backgroundColor: "var(--color-background-red)",
				"--color-text-primary": "var(--color-text-red)",
				"--color-text-secondary": "var(--color-text-red)",
				"--color-error": "var(--color-text-red)"
			}
		},
		card: {
			base: {
				padding: "var(--spacing-3)",
				borderRadius: "var(--radius-container)"
			},
			"variant:blue": {
				"--color-text-primary": "var(--color-text-blue)",
				"--color-text-secondary": "var(--color-text-blue)"
			},
			"variant:cyan": {
				"--color-text-primary": "var(--color-text-cyan)",
				"--color-text-secondary": "var(--color-text-cyan)"
			},
			"variant:gray": {
				"--color-text-primary": "var(--color-text-gray)",
				"--color-text-secondary": "var(--color-text-gray)"
			},
			"variant:green": {
				"--color-text-primary": "var(--color-text-green)",
				"--color-text-secondary": "var(--color-text-green)"
			},
			"variant:orange": {
				"--color-text-primary": "var(--color-text-orange)",
				"--color-text-secondary": "var(--color-text-orange)"
			},
			"variant:pink": {
				"--color-text-primary": "var(--color-text-pink)",
				"--color-text-secondary": "var(--color-text-pink)"
			},
			"variant:purple": {
				"--color-text-primary": "var(--color-text-purple)",
				"--color-text-secondary": "var(--color-text-purple)"
			},
			"variant:red": {
				"--color-text-primary": "var(--color-text-red)",
				"--color-text-secondary": "var(--color-text-red)"
			},
			"variant:teal": {
				"--color-text-primary": "var(--color-text-teal)",
				"--color-text-secondary": "var(--color-text-teal)"
			},
			"variant:yellow": {
				"--color-text-primary": "var(--color-text-yellow)",
				"--color-text-secondary": "var(--color-text-yellow)"
			}
		},
		section: { base: { padding: "var(--spacing-3)" } },
		field: { base: { borderRadius: "var(--radius-element)" } },
		text: {
			"type:display-1": { fontFamily: "\"Manufacturing Consent\", \"UnifrakturMaguntia\", \"Old English Text MT\", serif" },
			"type:display-2": { fontFamily: "\"Manufacturing Consent\", \"UnifrakturMaguntia\", \"Old English Text MT\", serif" },
			"type:display-3": { fontFamily: "\"Manufacturing Consent\", \"UnifrakturMaguntia\", \"Old English Text MT\", serif" }
		}
	},
	icons: gothicIconRegistry
});
/**
* Selectable app themes, keyed by the name persisted to localStorage.
* Gothic is dark-only — the mode is forced to "dark" for it
* (see getEffectiveMode in hooks/usetheme.ts).
*/
var themeRegistry = {
	butter: {
		label: "Butter",
		description: "Warm, golden surfaces with blue accents",
		darkOnly: false,
		theme: butterTheme
	},
	neutral: {
		label: "Neutral",
		description: "Muted, minimal warm grays",
		darkOnly: false,
		theme: neutralTheme
	},
	matcha: {
		label: "Matcha",
		description: "Earthy greens with a calm, organic feel",
		darkOnly: false,
		theme: matchaTheme
	},
	stone: {
		label: "Stone",
		description: "Warm stone and slate, understated",
		darkOnly: false,
		theme: stoneTheme
	},
	y2k: {
		label: "Y2K",
		description: "Hot pinks and lime — bubbly retro pop",
		darkOnly: false,
		theme: y2kTheme
	},
	gothic: {
		label: "Gothic",
		description: "Dark-only, atmospheric ink & manuscript",
		darkOnly: true,
		theme: gothicTheme
	}
};
var themeNames = Object.keys(themeRegistry);
function isThemeName(value) {
	return typeof value === "string" && value in themeRegistry;
}
var STORAGE_KEY = "drawy-theme";
var SERVER_THEME = "butter";
var SERVER_MODE = "light";
/**
* Resolves a mode preference against the selected theme.
* Dark-only themes (gothic) force dark regardless of the preference, so the
* persisted preference survives switching back to a theme with both modes.
*/
function getEffectiveMode(name, preference) {
	if (themeRegistry[name]?.darkOnly) return "dark";
	if (preference === "system") return (matchMedia ? matchMedia("(prefers-color-scheme: dark)").matches : false) ? "dark" : "light";
	return preference;
}
function applyDocumentState(name, mode) {
	if (typeof document === "undefined") return;
	const root = document.documentElement;
	root.classList.toggle("dark", mode === "dark");
	root.dataset.theme = mode;
	root.dataset.appTheme = name;
	root.style.colorScheme = mode;
}
function readStoredName() {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored === "light" || stored === "dark") return SERVER_THEME;
		if (isThemeName(stored)) return stored;
	} catch {}
	return SERVER_THEME;
}
function readStoredMode() {
	try {
		const stored = localStorage.getItem(`${STORAGE_KEY}-mode`);
		if (stored === "light" || stored === "dark" || stored === "system") return stored;
	} catch {}
	return "system";
}
var state = {
	name: SERVER_THEME,
	modePreference: SERVER_MODE
};
var initialized = false;
function ensureInitialized() {
	if (initialized) return;
	initialized = true;
	state = {
		name: readStoredName(),
		modePreference: readStoredMode()
	};
}
function getSnapshot() {
	ensureInitialized();
	return state;
}
function getServerSnapshot() {
	return {
		name: SERVER_THEME,
		modePreference: SERVER_MODE
	};
}
var listeners = /* @__PURE__ */ new Set();
function subscribe(listener) {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
}
function persist() {
	try {
		localStorage.setItem(STORAGE_KEY, state.name);
		localStorage.setItem(`${STORAGE_KEY}-mode`, state.modePreference);
	} catch {}
}
function setStateInternal(next) {
	const merged = {
		...getSnapshot(),
		...next
	};
	if (merged.name === state.name && merged.modePreference === state.modePreference) return;
	state = merged;
	persist();
	applyDocumentState(state.name, getEffectiveMode(state.name, state.modePreference));
	for (const listener of listeners) listener();
}
/**
* Tracks the selected app theme name and color-mode preference.
* The Astryx `<Theme>` provider consumes both via AppThemeProvider.
*/
function useTheme() {
	const snapshot = (0, import_react.useSyncExternalStore)(subscribe, getSnapshot, getServerSnapshot);
	(0, import_react.useEffect)(() => {
		applyDocumentState(snapshot.name, getEffectiveMode(snapshot.name, snapshot.modePreference));
	}, [snapshot.name, snapshot.modePreference]);
	const setThemeName = (0, import_react.useCallback)((name) => {
		setStateInternal({ name });
	}, []);
	const setMode = (0, import_react.useCallback)((mode) => {
		setStateInternal({ modePreference: mode });
	}, []);
	const toggleMode = (0, import_react.useCallback)(() => {
		setStateInternal({ modePreference: getEffectiveMode(getSnapshot().name, getSnapshot().modePreference) === "dark" ? "light" : "dark" });
	}, []);
	return {
		themeName: snapshot.name,
		modePreference: snapshot.modePreference,
		/** Effective color mode after applying dark-only themes and "system". */
		mode: getEffectiveMode(snapshot.name, snapshot.modePreference),
		setThemeName,
		setMode,
		toggleMode
	};
}
if (typeof matchMedia !== "undefined") matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", () => {
	if (state.modePreference !== "system") return;
	applyDocumentState(state.name, getEffectiveMode(state.name, state.modePreference));
	for (const listener of listeners) listener();
});
var base = os.$context();
var SharedWithFieldSchema = object({ sharedWith: array(string()) });
var CanvasAppStateSchema = object({}).loose();
function parseCanvasAppState(raw) {
	const parsed = CanvasAppStateSchema.safeParse(raw);
	if (!parsed.success) return { sharedWith: [] };
	const shared = SharedWithFieldSchema.safeParse(parsed.data);
	return shared.success ? shared.data : { sharedWith: [] };
}
function getSharedWith(appState) {
	return appState.sharedWith;
}
function toMeta(row, currentUser) {
	const owner = row.user_id || "Anonymous";
	const sharedWith = getSharedWith(parseCanvasAppState(row.app_state));
	const isOwner = currentUser ? row.user_id === currentUser : false;
	return {
		id: row.id,
		title: row.title,
		createdAt: row.created_at,
		updatedAt: row.updated_at,
		owner,
		isOwner,
		sharedWith
	};
}
function toData(row, currentUser) {
	const rawAppState = row.app_state && typeof row.app_state === "object" ? row.app_state : {};
	const files = rawAppState.files && typeof rawAppState.files === "object" ? rawAppState.files : {};
	return {
		...toMeta(row, currentUser),
		elements: row.elements,
		appState: row.app_state,
		files
	};
}
function fail(error) {
	throw new ORPCError("INTERNAL_SERVER_ERROR", { message: error.message });
}
var BUCKET_NAME$1 = "canvas-assets";
var create = base.input(object({ title: string() })).output(object({
	id: string(),
	title: string(),
	createdAt: string(),
	updatedAt: string(),
	owner: string(),
	isOwner: boolean(),
	sharedWith: array(string())
})).handler(async ({ input, context }) => {
	const username = context.user?.username;
	if (!username) throw new ORPCError("UNAUTHORIZED", { message: "Not authenticated" });
	const supabase = createSupabaseAdminClient();
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const title = input.title.trim() || "Untitled";
	const { data, error } = await supabase.from("canvases").insert({
		user_id: username,
		title,
		elements: [],
		app_state: { sharedWith: [] },
		created_at: now,
		updated_at: now
	}).select("id, user_id, title, app_state, created_at, updated_at").single();
	if (error) return fail(error);
	return toMeta(data, username);
});
var save = base.input(object({
	id: string(),
	elements: any(),
	appState: any(),
	files: record(string(), any()).optional()
})).handler(async ({ input, context }) => {
	const username = context.user?.username;
	if (!username) throw new ORPCError("UNAUTHORIZED", { message: "Not authenticated" });
	const supabase = createSupabaseAdminClient();
	const { data: existing, error: fetchErr } = await supabase.from("canvases").select("user_id, app_state").eq("id", input.id).maybeSingle();
	if (fetchErr) return fail(fetchErr);
	if (!existing) throw new ORPCError("NOT_FOUND", { message: "Canvas not found" });
	const isOwner = existing.user_id === username;
	const sharedWith = getSharedWith(parseCanvasAppState(existing.app_state));
	if (!isOwner && !sharedWith.includes(username)) throw new ORPCError("FORBIDDEN", { message: "You do not have permission to edit this canvas." });
	const existingAppState = existing.app_state && typeof existing.app_state === "object" ? existing.app_state : {};
	const existingFiles = existingAppState.files && typeof existingAppState.files === "object" ? existingAppState.files : {};
	const mergedAppState = {
		...parseCanvasAppState(input.appState),
		sharedWith,
		files: input.files !== void 0 ? input.files : existingFiles
	};
	const { error } = await supabase.from("canvases").update({
		elements: input.elements,
		app_state: mergedAppState,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", input.id);
	if (error) return fail(error);
});
var rename = base.input(object({
	id: string(),
	title: string()
})).handler(async ({ input, context }) => {
	const username = context.user?.username;
	if (!username) throw new ORPCError("UNAUTHORIZED", { message: "Not authenticated" });
	const supabase = createSupabaseAdminClient();
	const { data: existing, error: fetchErr } = await supabase.from("canvases").select("user_id, app_state").eq("id", input.id).maybeSingle();
	if (fetchErr) return fail(fetchErr);
	if (!existing) throw new ORPCError("NOT_FOUND", { message: "Canvas not found" });
	const isOwner = existing.user_id === username;
	const sharedWith = getSharedWith(existing.app_state);
	if (!isOwner && !sharedWith.includes(username)) throw new ORPCError("FORBIDDEN", { message: "You do not have permission to rename this canvas." });
	const { error } = await supabase.from("canvases").update({
		title: input.title.trim() || "Untitled",
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", input.id);
	if (error) return fail(error);
});
var remove = base.input(object({ id: string() })).handler(async ({ input, context }) => {
	const username = context.user?.username;
	if (!username) throw new ORPCError("UNAUTHORIZED", { message: "Not authenticated" });
	const supabase = createSupabaseAdminClient();
	const { data: existing, error: fetchErr } = await supabase.from("canvases").select("user_id").eq("id", input.id).maybeSingle();
	if (fetchErr) return fail(fetchErr);
	if (!existing) return;
	if (existing.user_id !== username) throw new ORPCError("FORBIDDEN", { message: "Only the owner can delete this canvas." });
	const { error } = await supabase.from("canvases").delete().eq("id", input.id);
	if (error) return fail(error);
	try {
		const { data: files } = await supabase.storage.from(BUCKET_NAME$1).list(input.id);
		if (files && files.length > 0) {
			const pathsToRemove = files.map((f) => `${input.id}/${f.name}`);
			await supabase.storage.from(BUCKET_NAME$1).remove(pathsToRemove);
		}
	} catch (err) {
		console.error("Failed to delete canvas storage assets:", err);
	}
});
var list = base.output(array(object({
	id: string(),
	title: string(),
	createdAt: string(),
	updatedAt: string(),
	owner: string(),
	isOwner: boolean(),
	sharedWith: array(string())
}))).handler(async ({ context }) => {
	const username = context.user?.username;
	if (!username) throw new ORPCError("UNAUTHORIZED", { message: "Not authenticated" });
	const { data, error } = await createSupabaseAdminClient().from("canvases").select("id, user_id, title, app_state, created_at, updated_at").order("updated_at", { ascending: false });
	if (error) return fail(error);
	return data.filter((row) => {
		if (row.user_id === username) return true;
		return getSharedWith(parseCanvasAppState(row.app_state)).includes(username);
	}).map((row) => toMeta(row, username));
});
var get = base.input(object({ id: string() })).output(object({
	id: string(),
	title: string(),
	createdAt: string(),
	updatedAt: string(),
	owner: string(),
	isOwner: boolean(),
	sharedWith: array(string()),
	elements: any(),
	appState: any(),
	files: any().optional()
}).nullable()).handler(async ({ input, context }) => {
	const username = context.user?.username;
	if (!username) throw new ORPCError("UNAUTHORIZED", { message: "Not authenticated" });
	const { data, error } = await createSupabaseAdminClient().from("canvases").select("*").eq("id", input.id).maybeSingle();
	if (error) return fail(error);
	if (!data) return null;
	const row = data;
	const sharedWith = getSharedWith(parseCanvasAppState(row.app_state));
	if (!(row.user_id === username) && !sharedWith.includes(username)) throw new ORPCError("FORBIDDEN", { message: "You do not have access to this canvas." });
	return toData(row, username);
});
var share = base.input(object({
	id: string(),
	targetUsername: string()
})).handler(async ({ input, context }) => {
	const username = context.user?.username;
	if (!username) throw new ORPCError("UNAUTHORIZED", { message: "Not authenticated" });
	const target = input.targetUsername.trim().toLowerCase();
	if (!target) throw new ORPCError("BAD_REQUEST", { message: "Target username is required" });
	if (target === username) throw new ORPCError("BAD_REQUEST", { message: "You are already the owner of this canvas" });
	const supabase = createSupabaseAdminClient();
	const { data: targetUser } = await supabase.from("app_users").select("username").eq("username", target).maybeSingle();
	if (!targetUser) throw new ORPCError("NOT_FOUND", { message: `User "${target}" does not exist.` });
	const { data: canvas, error: fetchErr } = await supabase.from("canvases").select("user_id, app_state").eq("id", input.id).maybeSingle();
	if (fetchErr) return fail(fetchErr);
	if (!canvas) throw new ORPCError("NOT_FOUND", { message: "Canvas not found" });
	if (canvas.user_id !== username) throw new ORPCError("FORBIDDEN", { message: "Only the owner can manage sharing permissions." });
	const currentShared = getSharedWith(parseCanvasAppState(canvas.app_state));
	if (currentShared.includes(target)) return;
	const updatedShared = [...currentShared, target];
	const newAppState = {
		...parseCanvasAppState(canvas.app_state),
		sharedWith: updatedShared
	};
	const { error } = await supabase.from("canvases").update({
		app_state: newAppState,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", input.id);
	if (error) return fail(error);
});
var unshare = base.input(object({
	id: string(),
	targetUsername: string()
})).handler(async ({ input, context }) => {
	const username = context.user?.username;
	if (!username) throw new ORPCError("UNAUTHORIZED", { message: "Not authenticated" });
	const target = input.targetUsername.trim().toLowerCase();
	const supabase = createSupabaseAdminClient();
	const { data: canvas, error: fetchErr } = await supabase.from("canvases").select("user_id, app_state").eq("id", input.id).maybeSingle();
	if (fetchErr) return fail(fetchErr);
	if (!canvas) throw new ORPCError("NOT_FOUND", { message: "Canvas not found" });
	if (canvas.user_id !== username) throw new ORPCError("FORBIDDEN", { message: "Only the owner can manage sharing permissions." });
	const updatedShared = getSharedWith(parseCanvasAppState(canvas.app_state)).filter((u) => u !== target);
	const newAppState = {
		...parseCanvasAppState(canvas.app_state),
		sharedWith: updatedShared
	};
	const { error } = await supabase.from("canvases").update({
		app_state: newAppState,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", input.id);
	if (error) return fail(error);
});
var listUsers = base.output(array(string())).handler(async ({ context }) => {
	const username = context.user?.username;
	const { data, error } = await createSupabaseAdminClient().from("app_users").select("username").order("username", { ascending: true });
	if (error) return fail(error);
	return (data || []).map((u) => u.username).filter((u) => u !== username);
});
var BUCKET_NAME = "canvas-assets";
var bucketInitPromise;
async function ensureStorageBucket(supabase) {
	if (bucketInitPromise) return bucketInitPromise;
	bucketInitPromise = (async () => {
		try {
			const { data: buckets } = await supabase.storage.listBuckets();
			if (!buckets?.some((b) => b.name === BUCKET_NAME)) await supabase.storage.createBucket(BUCKET_NAME, {
				public: true,
				fileSizeLimit: 10485760
			});
		} catch (err) {
			console.error("Failed to ensure storage bucket:", err);
			return bucketInitPromise;
		}
	})();
	return bucketInitPromise;
}
var uploadAsset = base.input(object({
	canvasId: string(),
	fileId: string(),
	mimeType: string(),
	base64Data: string()
})).output(object({
	fileId: string(),
	url: string(),
	mimeType: string()
})).handler(async ({ input, context }) => {
	const username = context.user?.username;
	if (!username) throw new ORPCError("UNAUTHORIZED", { message: "Not authenticated" });
	const supabase = createSupabaseAdminClient();
	const { data: existing, error: fetchErr } = await supabase.from("canvases").select("user_id, app_state").eq("id", input.canvasId).maybeSingle();
	if (fetchErr) throw new ORPCError("INTERNAL_SERVER_ERROR", { message: fetchErr.message });
	if (!existing) throw new ORPCError("NOT_FOUND", { message: "Canvas not found" });
	const isOwner = existing.user_id === username;
	const sharedWith = getSharedWith(parseCanvasAppState(existing.app_state));
	if (!isOwner && !sharedWith.includes(username)) throw new ORPCError("FORBIDDEN", { message: "You do not have permission to upload assets to this canvas." });
	await ensureStorageBucket(supabase);
	let cleanBase64 = input.base64Data;
	const commaIdx = cleanBase64.indexOf(",");
	if (commaIdx !== -1) cleanBase64 = cleanBase64.slice(commaIdx + 1);
	const buffer = Buffer.from(cleanBase64, "base64");
	const extension = input.mimeType.split("/")[1]?.replace("+xml", "") || "bin";
	const filePath = `${input.canvasId}/${input.fileId}.${extension}`;
	const { error: uploadError } = await supabase.storage.from(BUCKET_NAME).upload(filePath, buffer, {
		contentType: input.mimeType,
		upsert: true
	});
	if (uploadError) throw new ORPCError("INTERNAL_SERVER_ERROR", { message: uploadError.message });
	const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
	const cacheBustedUrl = `${publicUrlData.publicUrl}?v=${Date.now()}`;
	return {
		fileId: input.fileId,
		url: cacheBustedUrl,
		mimeType: input.mimeType
	};
});
var router_default = { canvases: /* @__PURE__ */ __exportAll({
	create: () => create,
	get: () => get,
	list: () => list,
	listUsers: () => listUsers,
	remove: () => remove,
	rename: () => rename,
	save: () => save,
	share: () => share,
	unshare: () => unshare,
	uploadAsset: () => uploadAsset
}) };
function getContext() {
	return { queryClient: new QueryClient() };
}
function GlobalDialogs() {
	const [Dialogs, setDialogs] = (0, import_react.useState)();
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		import("./dialogs--PUO5SH1.mjs").then((module) => {
			if (!cancelled) setDialogs(() => module.Dialogs);
		});
		return () => {
			cancelled = true;
		};
	}, []);
	if (!Dialogs) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
		fallback: null,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialogs, {})
	});
}
/**
* Restores the persisted theme + mode before first paint (no flash).
* Mirrors readStored* / getEffectiveMode in hooks/usetheme.ts.
*/
var themeScript = `(function(){try{var n=localStorage.getItem("drawy-theme");var names=["butter","neutral","matcha","stone","y2k","gothic"];if(!n||names.indexOf(n)<0){n="butter";}var darkOnly={gothic:1};var p=localStorage.getItem("drawy-theme-mode")||"system";var m;if(darkOnly[n]){m="dark";}else if(p==="light"||p==="dark"){m=p;}else{m=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}var r=document.documentElement;r.classList.toggle("dark",m==="dark");r.dataset.theme=m;r.dataset.appTheme=n;r.style.colorScheme=m;}catch(e){}})();`;
var Route$6 = createRootRouteWithContext()({
	head: () => ({ meta: [
		{ charSet: "utf-8" },
		{
			name: "viewport",
			content: "width=device-width, initial-scale=1"
		},
		{ title: "Drawy" },
		{
			name: "description",
			content: "Drawy — a collaborative drawing workspace."
		}
	] }),
	shellComponent: RootDocument
});
function Devtools() {
	const [DevtoolsComponent, setDevtoolsComponent] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {}, []);
	if (!DevtoolsComponent) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DevtoolsComponent, {});
}
function AppThemeProvider({ children }) {
	const { themeName, modePreference } = useTheme();
	const entry = themeRegistry[themeName];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Theme, {
		theme: entry.theme,
		mode: entry.darkOnly ? "dark" : modePreference,
		children
	});
}
function RootDocument({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("head", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { dangerouslySetInnerHTML: { __html: themeScript } }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppThemeProvider, { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlobalDialogs, {})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Devtools, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	});
}
var $$splitComponentImporter$3 = () => import("../_authenticated-DOwiAXPj.mjs");
var Route$5 = createFileRoute("/_authenticated")({
	beforeLoad: async () => {
		if (!await getCurrentUser()) throw redirect({ to: "/login" });
	},
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./login-pfvRhQKK.mjs");
var Route$4 = createFileRoute("/login")({
	beforeLoad: async () => {
		if (await getCurrentUser()) throw redirect({ to: "/" });
	},
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("../_authenticated-BanwsW7z.mjs");
var Route$3 = createFileRoute("/_authenticated/")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
if (typeof window === "undefined") {
	Object.defineProperty(globalThis, "window", {
		value: globalThis,
		writable: true,
		configurable: true
	});
	if (!("document" in globalThis)) {
		const createElement = () => ({
			getContext: () => ({
				measureText: () => ({ width: 0 }),
				fillRect: () => {},
				clearRect: () => {},
				getImageData: () => ({ data: /* @__PURE__ */ new Uint8ClampedArray() }),
				putImageData: () => {},
				createImageData: () => ({ data: /* @__PURE__ */ new Uint8ClampedArray() }),
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
				fill: () => {}
			}),
			style: {},
			classList: {
				toggle: () => {},
				add: () => {},
				remove: () => {},
				contains: () => false
			},
			setAttribute: () => {},
			getAttribute: () => null,
			addEventListener: () => {},
			removeEventListener: () => {},
			dispatchEvent: () => false,
			appendChild: (child) => child,
			removeChild: (child) => child,
			querySelector: () => null,
			querySelectorAll: () => []
		});
		Object.defineProperty(globalThis, "document", {
			value: {
				createElement,
				documentElement: {
					classList: {
						toggle: () => {},
						add: () => {},
						remove: () => {}
					},
					dataset: {},
					style: {}
				},
				body: createElement(),
				head: createElement(),
				querySelector: () => null,
				querySelectorAll: () => [],
				addEventListener: () => {},
				removeEventListener: () => {},
				dispatchEvent: () => false
			},
			writable: true,
			configurable: true
		});
	}
	if (!("navigator" in globalThis)) Object.defineProperty(globalThis, "navigator", {
		value: {
			userAgent: "node",
			platform: "node"
		},
		writable: true,
		configurable: true
	});
	if (!("location" in globalThis)) Object.defineProperty(globalThis, "location", {
		value: {
			origin: "http://localhost",
			protocol: "http:",
			host: "localhost",
			hostname: "localhost",
			port: "",
			pathname: "/",
			search: "",
			hash: "",
			href: "http://localhost/"
		},
		writable: true,
		configurable: true
	});
	if (!("EXCALIDRAW_EXPORT_SOURCE" in globalThis)) globalThis.EXCALIDRAW_EXPORT_SOURCE = "http://localhost";
	if (!("devicePixelRatio" in globalThis)) globalThis.devicePixelRatio = 1;
	if (!("requestAnimationFrame" in globalThis)) globalThis.requestAnimationFrame = (callback) => setTimeout(() => callback(Date.now()), 0);
	if (!("cancelAnimationFrame" in globalThis)) globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
	if (!("matchMedia" in globalThis)) globalThis.matchMedia = () => ({
		matches: false,
		addListener: () => {},
		removeListener: () => {},
		addEventListener: () => {},
		removeEventListener: () => {},
		dispatchEvent: () => false
	});
	class ElementStub {}
	if (!("Element" in globalThis)) globalThis.Element = ElementStub;
	if (!("HTMLElement" in globalThis)) globalThis.HTMLElement = class HTMLElement extends ElementStub {};
	if (!("SVGElement" in globalThis)) globalThis.SVGElement = class SVGElement extends ElementStub {};
	if (!("HTMLCanvasElement" in globalThis)) globalThis.HTMLCanvasElement = class HTMLCanvasElement extends ElementStub {};
}
var TodoSchema = object({
	id: number().int().min(1),
	name: string()
});
var handler$1 = new OpenAPIHandler(router_default, {
	interceptors: [onError((error) => {
		console.error(error);
	})],
	plugins: [new SmartCoercionPlugin({ schemaConverters: [new ZodToJsonSchemaConverter()] }), new OpenAPIReferencePlugin({
		schemaConverters: [new ZodToJsonSchemaConverter()],
		specGenerateOptions: {
			info: {
				title: "TanStack ORPC Playground",
				version: "1.0.0"
			},
			commonSchemas: {
				Todo: { schema: TodoSchema },
				UndefinedError: { error: "UndefinedError" }
			},
			security: [{ bearerAuth: [] }],
			components: { securitySchemes: { bearerAuth: {
				type: "http",
				scheme: "bearer"
			} } }
		},
		docsConfig: { authentication: { securitySchemes: { bearerAuth: { token: "default-token" } } } }
	})]
});
async function handle$1({ request }) {
	const user = await getCurrentUser();
	if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), {
		status: 401,
		headers: { "content-type": "application/json" }
	});
	const { response } = await handler$1.handle(request, {
		prefix: "/api",
		context: {
			request,
			user
		}
	});
	return response ?? new Response("Not Found", { status: 404 });
}
var Route$2 = createFileRoute("/api/$")({ server: { handlers: {
	HEAD: handle$1,
	GET: handle$1,
	POST: handle$1,
	PUT: handle$1,
	PATCH: handle$1,
	DELETE: handle$1
} } });
var $$splitComponentImporter = () => import("../_id-DEfPWgRj.mjs");
var Route$1 = createFileRoute("/_authenticated/canvas/$id")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var handler = new RPCHandler(router_default, { interceptors: [onError((error) => {
	console.error(error);
})] });
async function handle({ request }) {
	const user = await getCurrentUser();
	if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), {
		status: 401,
		headers: { "content-type": "application/json" }
	});
	const { response } = await handler.handle(request, {
		prefix: "/api/rpc",
		context: {
			request,
			user
		}
	});
	return response ?? new Response("Not Found", { status: 404 });
}
var Route = createFileRoute("/api/rpc/$")({ server: { handlers: {
	HEAD: handle,
	GET: handle,
	POST: handle,
	PUT: handle,
	PATCH: handle,
	DELETE: handle
} } });
var AuthenticatedRoute = Route$5.update({
	id: "/_authenticated",
	getParentRoute: () => Route$6
});
var LoginRoute = Route$4.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$6
});
var AuthenticatedIndexRoute = Route$3.update({
	id: "/",
	path: "/",
	getParentRoute: () => AuthenticatedRoute
});
var ApiSplatRoute = Route$2.update({
	id: "/api/$",
	path: "/api/$",
	getParentRoute: () => Route$6
});
var AuthenticatedCanvasIdRoute = Route$1.update({
	id: "/canvas/$id",
	path: "/canvas/$id",
	getParentRoute: () => AuthenticatedRoute
});
var ApiRpcSplatRoute = Route.update({
	id: "/api/rpc/$",
	path: "/api/rpc/$",
	getParentRoute: () => Route$6
});
var AuthenticatedRouteChildren = {
	AuthenticatedIndexRoute,
	AuthenticatedCanvasIdRoute
};
var rootRouteChildren = {
	AuthenticatedRoute: AuthenticatedRoute._addFileChildren(AuthenticatedRouteChildren),
	LoginRoute,
	ApiSplatRoute,
	ApiRpcSplatRoute
};
var routeTree = Route$6._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	const context = getContext();
	return createRouter({
		routeTree,
		context,
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0,
		Wrap: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
			client: context.queryClient,
			children
		})
	});
}
//#endregion
export { Route$1, getCurrentUser, logout, router_default, router_exports, signIn, signUp, themeNames, themeRegistry, useTheme };
