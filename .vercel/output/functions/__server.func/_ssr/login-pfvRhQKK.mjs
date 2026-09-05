if (typeof globalThis.requestAnimationFrame === "undefined") globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
if (typeof globalThis.cancelAnimationFrame === "undefined") globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
try {
	globalThis.requestAnimationFrame;
	globalThis.cancelAnimationFrame;
} catch (e) {}
import { __toESM } from "../_runtime.mjs";
import { Button, Card, Center, Heading, Icon, Text, TextInput, VStack, require_jsx_runtime, require_react } from "../_libs/@astryxdesign/core+[...].mjs";
import { useNavigate, useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { LockKeyhole, PenTool, User } from "../_libs/lucide-react.mjs";
import { signIn, signUp } from "./router-CcE2zVrw.mjs";
import { normalizeUsername, usernameError } from "./username-DNt5S620.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-pfvRhQKK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const router = useRouter();
	const navigate = useNavigate();
	const [mode, setMode] = (0, import_react.useState)("signin");
	const [username, setUsername] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [usernameTouched, setUsernameTouched] = (0, import_react.useState)(false);
	const [submitAttempted, setSubmitAttempted] = (0, import_react.useState)(false);
	function switchMode(next) {
		setMode(next);
		setError(null);
	}
	const usernameInvalid = usernameError(username);
	const showUsernameError = (usernameTouched || submitAttempted) && usernameInvalid;
	async function handleSubmit() {
		setBusy(true);
		setError(null);
		setSubmitAttempted(true);
		const invalidUsername = usernameError(username);
		if (invalidUsername) {
			setError(invalidUsername);
			setBusy(false);
			return;
		}
		try {
			const displayUsername = normalizeUsername(username);
			if (mode === "signup") await signUp({ data: {
				username: displayUsername,
				password
			} });
			else await signIn({ data: {
				username: displayUsername,
				password
			} });
			await router.invalidate();
			await navigate({ to: "/" });
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : "Something went wrong. Please try again.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Center, {
		height: "100vh",
		padding: 4,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			width: 380,
			padding: 6,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VStack, {
				gap: 5,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VStack, {
						gap: 1,
						hAlign: "center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								icon: PenTool,
								size: "lg"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
								level: 1,
								children: "Drawy"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								type: "supporting",
								children: mode === "signin" ? "Sign in to access your drawings" : "Create your Drawy account"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VStack, {
						gap: 3,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							label: "Username",
							value: username,
							onChange: (value) => {
								setUsername(value);
								setUsernameTouched(true);
							},
							onBlur: () => setUsernameTouched(true),
							onEnter: handleSubmit,
							hasAutoFocus: true,
							placeholder: "your_username",
							startIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								icon: User,
								size: "sm"
							}),
							isRequired: true,
							status: showUsernameError ? {
								type: "error",
								message: usernameInvalid
							} : void 0
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							label: "Password",
							type: "password",
							value: password,
							onChange: setPassword,
							onEnter: handleSubmit,
							placeholder: "••••••••",
							startIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								icon: LockKeyhole,
								size: "sm"
							}),
							isRequired: true,
							status: error ? {
								type: "error",
								message: error
							} : void 0
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						label: mode === "signin" ? "Sign in" : "Create an account",
						onClick: handleSubmit,
						isLoading: busy,
						width: "100%"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						label: mode === "signin" ? "New here? Create an account" : "Already have an account? Sign in",
						variant: "ghost",
						onClick: () => switchMode(mode === "signin" ? "signup" : "signin"),
						isDisabled: busy,
						width: "100%"
					})
				]
			})
		})
	});
}
//#endregion
export { LoginPage as component };
