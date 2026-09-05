if (typeof globalThis.requestAnimationFrame === "undefined") globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
if (typeof globalThis.cancelAnimationFrame === "undefined") globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
try {
	globalThis.requestAnimationFrame;
	globalThis.cancelAnimationFrame;
} catch (e) {}
//#region node_modules/.nitro/vite/services/ssr/assets/_tanstack-start-manifest_v-6I6_PDem.js
var tsrStartManifest = () => ({ routes: {
	__root__: {
		filePath: "/var/home/pmustafi/webskitters/drawy/src/routes/__root.tsx",
		children: [
			"/_authenticated",
			"/login",
			"/api/$",
			"/api/rpc/$"
		],
		css: ["/assets/index-Bb1wipfq.css"],
		preloads: [
			"/assets/index-D22YNrMK.js",
			"/assets/rolldown-runtime-Dd_uD5pT.js",
			"/assets/jsx-runtime-BpzPEenQ.js",
			"/assets/session-B8oMbTJu.js",
			"/assets/usetheme-mlTDnXT0.js",
			"/assets/useRouter-CypVFMAF.js",
			"/assets/root-DLTE-HSj.js",
			"/assets/copy-LwVRXgpX.js",
			"/assets/useStore-0Ziyf7I-.js",
			"/assets/useIsomorphicLayoutEffect-RWeYSuzB.js",
			"/assets/useTheme-B1MqQyLu.js"
		],
		scripts: [{ attrs: {
			type: "module",
			async: !0,
			src: "/assets/index-D22YNrMK.js"
		} }]
	},
	"/_authenticated": {
		filePath: "/var/home/pmustafi/webskitters/drawy/src/routes/_authenticated.tsx",
		children: ["/_authenticated/", "/_authenticated/canvas/$id"],
		preloads: ["/assets/_authenticated-BghFFHif.js"]
	},
	"/login": {
		filePath: "/var/home/pmustafi/webskitters/drawy/src/routes/login.tsx",
		children: void 0,
		preloads: [
			"/assets/login-CU8vchs3.js",
			"/assets/VStack-DEJQJ9n5.js",
			"/assets/TextInput-C2LBFSHt.js",
			"/assets/Card-TWzRmtPH.js",
			"/assets/createLucideIcon-C9BLIj54.js",
			"/assets/pen-tool-DEXIqWDl.js"
		]
	},
	"/_authenticated/": {
		filePath: "/var/home/pmustafi/webskitters/drawy/src/routes/_authenticated/index.tsx",
		children: void 0,
		preloads: [
			"/assets/_authenticated-BlMHogMr.js",
			"/assets/libraries-DFgwS_hU.js",
			"/assets/VStack-DEJQJ9n5.js",
			"/assets/sidebar-BBdhxxAo.js",
			"/assets/Card-TWzRmtPH.js",
			"/assets/HStack-BqzBX4Qq.js",
			"/assets/Token-i5sh_lbY.js",
			"/assets/pen-tool-DEXIqWDl.js"
		]
	},
	"/_authenticated/canvas/$id": {
		filePath: "/var/home/pmustafi/webskitters/drawy/src/routes/_authenticated/canvas/$id.tsx",
		children: void 0,
		preloads: [
			"/assets/_id-i5mhs8pZ.js",
			"/assets/libraries-DFgwS_hU.js",
			"/assets/VStack-DEJQJ9n5.js",
			"/assets/sidebar-BBdhxxAo.js"
		]
	}
} });
//#endregion
export { tsrStartManifest };
