if (typeof globalThis.requestAnimationFrame === "undefined") globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
if (typeof globalThis.cancelAnimationFrame === "undefined") globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
try {
	globalThis.requestAnimationFrame;
	globalThis.cancelAnimationFrame;
} catch (e) {}
import { defineSyntaxTheme, defineTheme, require_jsx_runtime } from "./@astryxdesign/core+[...].mjs";
import { ArrowDown, ArrowUp, ArrowUpDown, Calendar, Check, CheckCheck, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, CircleCheckBig, CircleX, Clock, Columns2, Copy, Ellipsis, ExternalLink, EyeOff, Funnel, Info, Menu, Mic, Search, Square, TriangleAlert, Wrench, X } from "./@astryxdesign/theme-matcha+[...].mjs";
//#region node_modules/@astryxdesign/theme-y2k/dist/source.mjs
var import_jsx_runtime = require_jsx_runtime();
var iconProps = {
	size: "1em",
	"aria-hidden": true
};
var y2kIconRegistry = {
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
var y2kSyntax = defineSyntaxTheme({
	name: "xds-y2k",
	tokens: {
		keyword: ["#615a7a", "#aea6ca"],
		string: ["#586242", "#a5af8b"],
		comment: ["#5e5e5e", "#ababab"],
		number: ["#775843", "#c8a48c"],
		function: ["#39637d", "#87b0cd"],
		type: ["#615a7a", "#aea6ca"],
		variable: ["#5e5e5e", "#ababab"],
		operator: ["#5e5e5e", "#ababab"],
		constant: ["#775843", "#c8a48c"],
		tag: ["#7f5351", "#d19f9d"],
		attribute: ["#6c5c3e", "#bca987"],
		property: ["#3c6755", "#87b5a1"],
		punctuation: ["#5e5e5e", "#ababab"],
		background: ["#FFF6ED", "#190f00"]
	}
});
var y2kTheme = defineTheme({
	name: "y2k",
	typography: {
		scale: {
			base: 16,
			ratio: 1.25
		},
		body: {
			family: "Poppins",
			fallbacks: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif"
		},
		heading: {
			family: "Poppins",
			fallbacks: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif"
		},
		code: {
			family: "JetBrains Mono",
			fallbacks: "\"SF Mono\", Monaco, Consolas, monospace"
		}
	},
	radius: {
		base: 4,
		multiplier: 0
	},
	motion: {
		fast: 100,
		medium: 250,
		slow: 600,
		ratio: .8
	},
	syntax: y2kSyntax,
	tokens: {
		"--spacing-0-5": "3px",
		"--spacing-1": "6px",
		"--spacing-1-5": "9px",
		"--spacing-2": "12px",
		"--spacing-3": "18px",
		"--spacing-4": "24px",
		"--spacing-5": "30px",
		"--spacing-6": "36px",
		"--spacing-7": "42px",
		"--spacing-8": "48px",
		"--size-element-sm": "32px",
		"--size-element-md": "40px",
		"--size-element-lg": "48px",
		"--color-accent": ["#2d241b", "#EDEFFC"],
		"--color-accent-muted": ["#2d241b14", "#EDEFFC20"],
		"--color-neutral": ["#2d241b10", "#EDEFFC1A"],
		"--color-background-surface": ["#FFFFFF", "#16182b"],
		"--color-background-body": ["#CCCFFA", "#0e0f1a"],
		"--color-overlay": ["#2d241b80", "#0a0b14CC"],
		"--color-overlay-hover": ["#2d241b0D", "#EDEFFC0D"],
		"--color-overlay-pressed": ["#2d241b1A", "#EDEFFC1A"],
		"--color-background-muted": ["#ede0d4", "#1f2238"],
		"--color-text-primary": ["#2d241b", "#EDEFFC"],
		"--color-text-secondary": ["#675d52", "#a6acd6"],
		"--color-text-disabled": ["#d1c5b8", "#4a4f6b"],
		"--color-text-accent": ["#2d241b", "#EDEFFC"],
		"--color-on-dark": "#FFFFFF",
		"--color-on-light": "#2d241b",
		"--color-on-accent": ["#FFFFFF", "#16182b"],
		"--color-on-success": ["#3a5500", "#1e3200"],
		"--color-on-error": ["#8b1d24", "#5c0008"],
		"--color-on-warning": ["#614400", "#3f2600"],
		"--color-icon-accent": ["#2d241b", "#EDEFFC"],
		"--color-icon-primary": ["#2d241b", "#EDEFFC"],
		"--color-icon-secondary": ["#675d52", "#a6acd6"],
		"--color-icon-disabled": ["#d1c5b8", "#4a4f6b"],
		"--color-background-card": ["#FFFFFF", "#16182b"],
		"--color-background-popover": ["#FFFFFF", "#1f2238"],
		"--color-background-inverted": ["#2d241b", "#EDEFFC"],
		"--color-success": ["#C5E17A", "#C5E17A"],
		"--color-success-muted": ["#C5E17A", "#C5E17A"],
		"--color-error": ["#FFC5C3", "#FFC5C3"],
		"--color-error-muted": ["#FFC5C3", "#FFC5C3"],
		"--color-warning": ["#FFE08A", "#FFE08A"],
		"--color-warning-muted": ["#FFE08A", "#FFE08A"],
		"--color-border": ["#2F292E", "#EDEFFC1A"],
		"--color-border-emphasized": ["#2F292E", "#3a3f5e"],
		"--color-skeleton": ["#d1c5b8", "#2a2e47"],
		"--color-shadow": ["#2d241b1A", "#0000004D"],
		"--color-tint-hover": ["#2d241b", "#EDEFFC"],
		"--text-supporting-size": "12px",
		"--color-background-green": ["#C5E17A", "#C5E17A"],
		"--color-border-green": ["#B5D16A", "#B5D16A"],
		"--color-icon-green": ["#3a5500", "#1e3200"],
		"--color-text-green": ["#3a5500", "#1e3200"],
		"--color-background-red": ["#FFC5C3", "#FFC5C3"],
		"--color-border-red": ["#FF9E9A", "#FF9E9A"],
		"--color-icon-red": ["#8b1d24", "#5c0008"],
		"--color-text-red": ["#8b1d24", "#5c0008"],
		"--color-background-yellow": ["#FFE08A", "#FFE08A"],
		"--color-border-yellow": ["#FFCC55", "#FFCC55"],
		"--color-icon-yellow": ["#614400", "#3f2600"],
		"--color-text-yellow": ["#614400", "#3f2600"],
		"--color-background-blue": ["#B8E0FF", "#B8E0FF"],
		"--color-border-blue": ["#8ECFFF", "#8ECFFF"],
		"--color-icon-blue": ["#004e74", "#002c4d"],
		"--color-text-blue": ["#004e74", "#002c4d"],
		"--color-background-pink": ["#FFC8E0", "#FFC8E0"],
		"--color-border-pink": ["#FFA0C8", "#FFA0C8"],
		"--color-icon-pink": ["#822050", "#580030"],
		"--color-text-pink": ["#822050", "#580030"],
		"--color-background-purple": ["#DDD0FF", "#DDD0FF"],
		"--color-border-purple": ["#C0AAFF", "#C0AAFF"],
		"--color-icon-purple": ["#453080", "#201058"],
		"--color-text-purple": ["#453080", "#201058"],
		"--color-background-cyan": ["#A8F0E2", "#A8F0E2"],
		"--color-border-cyan": ["#70E8D0", "#70E8D0"],
		"--color-icon-cyan": ["#005548", "#003028"],
		"--color-text-cyan": ["#005548", "#003028"],
		"--color-background-orange": ["#FFCCA0", "#FFCCA0"],
		"--color-border-orange": ["#FFAA66", "#FFAA66"],
		"--color-icon-orange": ["#703500", "#4a1800"],
		"--color-text-orange": ["#703500", "#4a1800"],
		"--color-background-teal": ["#A8EED0", "#A8EED0"],
		"--color-border-teal": ["#78E0B0", "#78E0B0"],
		"--color-icon-teal": ["#005530", "#003018"],
		"--color-text-teal": ["#005530", "#003018"],
		"--color-background-gray": ["#ede0d4", "#ede0d4"],
		"--color-border-gray": ["#dfd2c6", "#dfd2c6"],
		"--color-icon-gray": ["#4f453b", "#2d241b"],
		"--color-text-gray": ["#4f453b", "#2d241b"],
		"--radius-none": "0px",
		"--radius-inner": "0px",
		"--radius-element": "0px",
		"--radius-container": "0px",
		"--radius-page": "0px",
		"--radius-full": "0px",
		"--shadow-low": "0 2px 4px #2d241b0D, 0 4px 8px #2d241b1A",
		"--shadow-med": "0 2px 4px #2d241b0D, 0 4px 12px #2d241b1A",
		"--shadow-high": "0 4px 6px #2d241b1A, 0 12px 24px #2d241b26",
		"--shadow-inset-hover": "inset 0px 0px 0px 2px #2d241b30",
		"--shadow-inset-selected": "inset 0px 0px 0px 2px #2d241b50",
		"--shadow-inset-success": "inset 0px 0px 0px 2px #3a550050",
		"--shadow-inset-warning": "inset 0px 0px 0px 2px #61440050",
		"--shadow-inset-error": "inset 0px 0px 0px 2px #8b1d2450"
	},
	components: {
		text: {
			"type:display-1": { fontFamily: "\"Crimson Text\", Georgia, \"Times New Roman\", Times, serif" },
			"type:display-2": { fontFamily: "\"Crimson Text\", Georgia, \"Times New Roman\", Times, serif" },
			"type:display-3": { fontFamily: "\"Crimson Text\", Georgia, \"Times New Roman\", Times, serif" }
		},
		"top-nav-item": { selected: {
			backgroundColor: "transparent",
			":hover": { backgroundColor: "var(--color-overlay-hover)" },
			":active": { backgroundColor: "var(--color-overlay-pressed)" }
		} },
		button: {
			base: {
				borderRadius: "0px",
				borderWidth: "1px",
				borderStyle: "solid",
				borderColor: "var(--color-border)"
			},
			"variant:primary": {
				backgroundColor: "var(--color-text-primary)",
				color: "var(--color-background-body)",
				borderColor: "transparent"
			},
			"variant:secondary": {
				backgroundColor: "var(--color-background-green)",
				borderWidth: "1px",
				borderStyle: "solid",
				borderColor: "var(--color-text-green)",
				color: "var(--color-text-green)",
				":hover": { backgroundColor: "var(--color-border-green)" }
			},
			"variant:ghost": { borderColor: "transparent" },
			"variant:destructive": {
				backgroundColor: "var(--color-background-red)",
				color: "var(--color-text-red)",
				borderWidth: "1px",
				borderStyle: "solid",
				borderColor: "var(--color-text-red)"
			}
		},
		badge: {
			base: {
				borderRadius: "9999px",
				borderWidth: "1.5px",
				borderStyle: "solid",
				borderColor: "color-mix(in srgb, currentColor 30%, transparent)"
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
			base: { borderRadius: "0px" },
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
		field: { base: { borderRadius: "0px" } },
		card: { base: {
			borderRadius: "0px",
			padding: "var(--spacing-3)"
		} },
		section: { base: { padding: "var(--spacing-3)" } }
	},
	icons: y2kIconRegistry
});
//#endregion
export { y2kTheme };
