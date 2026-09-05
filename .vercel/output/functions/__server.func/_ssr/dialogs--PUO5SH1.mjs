if (typeof globalThis.requestAnimationFrame === "undefined") globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
if (typeof globalThis.cancelAnimationFrame === "undefined") globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
try {
	globalThis.requestAnimationFrame;
	globalThis.cancelAnimationFrame;
} catch (e) {}
import { __toESM } from "../_runtime.mjs";
import { Button, Card, Center, Dialog, DialogHeader, Divider, Grid, HStack, Heading, Icon, IconButton, Layout, LayoutContent, LayoutFooter, Section, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow, Text, TextInput, Token, VStack, require_jsx_runtime, require_react } from "../_libs/@astryxdesign/core+[...].mjs";
import { Check, Copy, Search } from "../_libs/@astryxdesign/theme-matcha+[...].mjs";
import { BookmarkCheck, BookmarkPlus, BookmarkX, Eye, Library, LoaderCircle, RefreshCw, Share2, UserPlus, UserX } from "../_libs/lucide-react.mjs";
import { getSavedLibraries, installLibraryItems, listAvailableUsers, onLibraryConfigUpdated, removeLibraryFromConfig, saveLibraryContent, saveLibraryToConfig, shareCanvas, unshareCanvas, useUIStore } from "./libraries-DLCIDk6W.mjs";
import { fetchLibraries, fetchLibraryContent, getLibraryAssetUrl, libraryItemCount, searchLibraries, toLibraryItems, useLibraryStore } from "./library-Bpj0Zib1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dialogs--PUO5SH1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LibraryTable({ libraries, filteredLibraries, savedLibraries, savingId, onLibrarySelect, onToggleSave }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
			density: "compact",
			hasHover: true,
			dividers: "rows",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
				isHeaderRow: true,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeaderCell, { children: "Preview" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeaderCell, { children: "Name" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeaderCell, { children: "Description" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeaderCell, { children: "Author" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeaderCell, { children: "Status" })
				]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: filteredLibraries.map((library, index) => {
				const saved = savedLibraries.find((lib) => lib.id === library.id);
				const saving = savingId === library.id;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
					onClick: () => onLibrarySelect?.(library),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: library.preview && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: getLibraryAssetUrl(library.preview),
							alt: `${library.name} preview`,
							className: "h-12 w-16 rounded object-cover"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
							weight: "medium",
							maxLines: 1,
							children: library.name
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
							type: "supporting",
							maxLines: 1,
							children: library.description
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
							maxLines: 1,
							children: library.authors[0]?.name || "Unknown"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							onClick: (e) => e.stopPropagation(),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								label: saved ? `${libraryItemCount(saved)} items` : "Save",
								variant: "ghost",
								size: "sm",
								icon: saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									icon: LoaderCircle,
									size: "sm"
								}) : saved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									icon: BookmarkCheck,
									size: "sm"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									icon: BookmarkPlus,
									size: "sm"
								}),
								isLoading: saving,
								onClick: () => onToggleSave(library),
								tooltip: saved ? `Remove ${library.name}` : `Save ${library.name}`
							})
						})
					]
				}, library.id ?? `${library.source}-${index}`);
			}) })]
		}),
		filteredLibraries.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			type: "supporting",
			justify: "center",
			children: "No libraries found matching your search."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
			type: "supporting",
			children: [
				filteredLibraries.length,
				" of ",
				libraries.length,
				" libraries ·",
				" ",
				savedLibraries.length,
				" saved"
			]
		})
	] });
}
function formatFetchedAt(fetchedAt) {
	if (!fetchedAt) return "Content not downloaded";
	const date = new Date(fetchedAt);
	if (Number.isNaN(date.getTime())) return "Content not downloaded";
	return `Updated ${date.toLocaleDateString(void 0, {
		month: "short",
		day: "numeric"
	})}`;
}
function SavedLibraryCard({ saved, refreshing, removing, onRefresh, onBrowse, onRemove }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		padding: 3,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VStack, {
			gap: 2,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HStack, {
				gap: 3,
				align: "center",
				children: [saved.preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: getLibraryAssetUrl(saved.preview),
					alt: `${saved.name} preview`,
					className: "h-10 w-20 shrink-0 rounded object-cover"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					variant: "muted",
					width: 80,
					height: 40,
					padding: 1,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Center, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
						icon: Library,
						size: "sm"
					}) })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VStack, {
					gap: 0,
					width: "100%",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						weight: "medium",
						maxLines: 1,
						children: saved.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
						type: "supporting",
						children: [
							libraryItemCount(saved),
							" items ·",
							" ",
							formatFetchedAt(saved.fetched_at)
						]
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HStack, {
				gap: 1,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						label: "Refresh",
						variant: "ghost",
						size: "sm",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							icon: RefreshCw,
							size: "sm"
						}),
						isLoading: refreshing,
						isDisabled: removing,
						onClick: () => onRefresh(saved),
						tooltip: "Download latest content"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						label: "Browse",
						variant: "ghost",
						size: "sm",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							icon: Eye,
							size: "sm"
						}),
						isDisabled: refreshing || removing,
						onClick: () => onBrowse(saved.id),
						tooltip: `Browse items in ${saved.name}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						label: "Remove",
						variant: "ghost",
						size: "sm",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							icon: BookmarkX,
							size: "sm"
						}),
						isLoading: removing,
						isDisabled: refreshing,
						onClick: () => onRemove(saved),
						tooltip: "Remove bookmark (items stay in your library panel)"
					})
				]
			})]
		})
	});
}
var LibraryItemBrowser = (0, import_react.lazy)(() => import("./library-item-browser-B5Ozi5ED.mjs").then((m) => ({ default: m.LibraryItemBrowser })));
function LibraryBrowser({ onLibrarySelect, initialBrowseId = null, source = "canvas" }) {
	const libraries = useLibraryStore((s) => s.libraries);
	const filteredLibraries = useLibraryStore((s) => s.filteredLibraries);
	const savedLibraries = useLibraryStore((s) => s.savedLibraries);
	const savingId = useLibraryStore((s) => s.savingId);
	const refreshingId = useLibraryStore((s) => s.refreshingId);
	const removingId = useLibraryStore((s) => s.removingId);
	const loading = useLibraryStore((s) => s.loading);
	const savedLoaded = useLibraryStore((s) => s.savedLoaded);
	const searchQuery = useLibraryStore((s) => s.searchQuery);
	const browsingId = useLibraryStore((s) => s.browsingId);
	const pendingBrowseId = useLibraryStore((s) => s.pendingBrowseId);
	const { init, setLibraries, setFilteredLibraries, setSavedLibraries, setSavingId, setRefreshingId, setRemovingId, setLoading, setSavedLoaded, setSearchQuery, setBrowsingId, setPendingBrowseId } = useLibraryStore.getState();
	const refreshSaved = (0, import_react.useCallback)(async () => {
		const saved = await getSavedLibraries();
		setSavedLibraries(saved);
		setSavedLoaded(true);
	}, [setSavedLibraries, setSavedLoaded]);
	(0, import_react.useEffect)(() => {
		init(initialBrowseId);
	}, [initialBrowseId, init]);
	(0, import_react.useEffect)(() => {
		if (pendingBrowseId == null) return;
		if (savedLibraries.some((lib) => lib.id === pendingBrowseId)) {
			setBrowsingId(pendingBrowseId);
			setPendingBrowseId(null);
		} else if (savedLoaded) setPendingBrowseId(null);
	}, [
		pendingBrowseId,
		savedLibraries,
		savedLoaded,
		setBrowsingId,
		setPendingBrowseId
	]);
	(0, import_react.useEffect)(() => {
		fetchLibraries().then((libs) => {
			setLibraries(libs);
			setFilteredLibraries(libs);
			setLoading(false);
		});
		refreshSaved();
		return onLibraryConfigUpdated(() => {
			refreshSaved();
		});
	}, [
		refreshSaved,
		setLibraries,
		setFilteredLibraries,
		setLoading
	]);
	(0, import_react.useEffect)(() => {
		if (searchQuery) setFilteredLibraries(searchLibraries(libraries, searchQuery));
		else setFilteredLibraries(libraries);
	}, [
		searchQuery,
		libraries,
		setFilteredLibraries
	]);
	const isSaved = (0, import_react.useCallback)((libraryId) => savedLibraries.some((lib) => lib.id === libraryId), [savedLibraries]);
	async function handleToggleSave(library) {
		if (isSaved(library.id)) {
			try {
				await removeLibraryFromConfig(library.id);
				setSavedLibraries((prev) => prev.filter((lib) => lib.id !== library.id));
			} catch (error) {
				console.error("Failed to remove library from config:", error);
			}
			return;
		}
		setSavingId(library.id);
		try {
			const saved = {
				id: library.id,
				name: library.name,
				description: library.description,
				authors: library.authors,
				source: library.source,
				preview: library.preview,
				created: library.created,
				updated: library.updated,
				version: library.version,
				item_names: library.itemNames || [],
				items: [],
				fetched_at: ""
			};
			await saveLibraryToConfig(saved);
			setSavedLibraries((prev) => [...prev.filter((lib) => lib.id !== library.id), saved]);
			const content = await fetchLibraryContent(library);
			if (content) {
				const items = await toLibraryItems(content, library.id);
				await saveLibraryContent(library.id, library.itemNames || [], items);
				await installLibraryItems(items);
				await refreshSaved();
			}
		} catch (error) {
			console.error("Failed to save library to config:", error);
		} finally {
			setSavingId(null);
		}
	}
	async function handleRefreshLibrary(saved) {
		setRefreshingId(saved.id);
		try {
			const library = libraries.find((lib) => lib.id === saved.id) ?? {
				id: saved.id,
				name: saved.name,
				description: saved.description,
				authors: saved.authors,
				source: saved.source,
				preview: saved.preview,
				created: saved.created,
				updated: saved.updated,
				version: saved.version
			};
			const content = await fetchLibraryContent(library);
			if (content) {
				const items = await toLibraryItems(content, saved.id);
				await saveLibraryContent(saved.id, library.itemNames || [], items);
				await installLibraryItems(items);
			}
			await refreshSaved();
		} catch (error) {
			console.error("Failed to refresh library:", error);
		} finally {
			setRefreshingId(null);
		}
	}
	async function handleRemoveLibrary(saved) {
		setRemovingId(saved.id);
		try {
			await removeLibraryFromConfig(saved.id);
			setSavedLibraries((prev) => prev.filter((lib) => lib.id !== saved.id));
		} catch (error) {
			console.error("Failed to remove library from config:", error);
		} finally {
			setRemovingId(null);
		}
	}
	const browsingLibrary = savedLibraries.find((lib) => lib.id === browsingId) ?? null;
	if (loading || pendingBrowseId != null && !savedLoaded) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Center, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
		icon: LoaderCircle,
		size: "lg"
	}) });
	if (browsingLibrary) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
		fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Center, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
			icon: LoaderCircle,
			size: "lg"
		}) }),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LibraryItemBrowser, {
			library: browsingLibrary,
			source,
			onBack: () => setBrowsingId(null),
			onRefreshContent: () => handleRefreshLibrary(browsingLibrary)
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VStack, {
		gap: 5,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VStack, {
				gap: 1,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
					level: 2,
					children: "Excalidraw Libraries"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
					type: "supporting",
					children: "Save a library to download its components into your library panel — they stay available offline"
				})]
			}),
			savedLibraries.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HStack, {
				gap: 2,
				vAlign: "center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
					level: 3,
					children: "Saved libraries"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
					type: "supporting",
					children: [
						"(",
						savedLibraries.length,
						")"
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grid, {
				columns: {
					minWidth: 260,
					max: 3
				},
				gap: 3,
				children: savedLibraries.map((saved) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SavedLibraryCard, {
					saved,
					refreshing: refreshingId === saved.id,
					removing: removingId === saved.id,
					onRefresh: handleRefreshLibrary,
					onBrowse: (id) => setBrowsingId(id),
					onRemove: handleRemoveLibrary
				}, saved.id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
					level: 3,
					children: "Browse libraries"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
					label: "Search libraries",
					isLabelHidden: true,
					placeholder: "Search libraries...",
					value: searchQuery,
					onChange: setSearchQuery,
					startIcon: Search,
					hasClear: true,
					width: 320
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LibraryTable, {
					libraries,
					filteredLibraries,
					savedLibraries,
					savingId,
					onLibrarySelect,
					onToggleSave: handleToggleSave
				})
			] })
		]
	});
}
function LibraryBrowserModal() {
	const isOpen = useUIStore((s) => s.libraryModal.isOpen);
	const initialBrowseId = useUIStore((s) => s.libraryModal.initialBrowseId);
	const closeLibraryBrowser = useUIStore((s) => s.closeLibraryBrowser);
	const handleOpenChange = (open) => {
		if (!open) closeLibraryBrowser();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		isOpen,
		onOpenChange: handleOpenChange,
		width: 880,
		maxHeight: "85vh",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layout, {
			header: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, {
				title: "Libraries",
				startContent: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
					icon: Library,
					size: "sm"
				}),
				onOpenChange: handleOpenChange
			}),
			content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutContent, {
				isScrollable: true,
				padding: 4,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LibraryBrowser, {
					initialBrowseId,
					source: "sidebar"
				})
			})
		})
	});
}
function ShareCanvasModal() {
	const isOpen = useUIStore((s) => s.shareModal.isOpen);
	const canvasId = useUIStore((s) => s.shareModal.canvasId);
	const owner = useUIStore((s) => s.shareModal.owner);
	const isOwner = useUIStore((s) => s.shareModal.isOwner);
	const sharedWith = useUIStore((s) => s.shareModal.sharedWith);
	const targetUser = useUIStore((s) => s.shareModal.targetUser);
	const availableUsers = useUIStore((s) => s.shareModal.availableUsers);
	const isSharing = useUIStore((s) => s.shareModal.isSharing);
	const unsharingUser = useUIStore((s) => s.shareModal.unsharingUser);
	const errorMsg = useUIStore((s) => s.shareModal.errorMsg);
	const copied = useUIStore((s) => s.shareModal.copied);
	const closeShareCanvas = useUIStore((s) => s.closeShareCanvas);
	const setShareTargetUser = useUIStore((s) => s.setShareTargetUser);
	const setShareAvailableUsers = useUIStore((s) => s.setShareAvailableUsers);
	const setShareIsSharing = useUIStore((s) => s.setShareIsSharing);
	const setShareUnsharingUser = useUIStore((s) => s.setShareUnsharingUser);
	const setShareErrorMsg = useUIStore((s) => s.setShareErrorMsg);
	const setShareCopied = useUIStore((s) => s.setShareCopied);
	const onOpenChange = (open) => {
		if (!open) closeShareCanvas();
	};
	const onShareChange = () => {
		globalThis.dispatchEvent(new Event("canvas-updated"));
	};
	const loadUsers = (0, import_react.useCallback)(async () => {
		try {
			const users = await listAvailableUsers();
			setShareAvailableUsers(users);
		} catch (error) {
			console.error("Failed to load users for sharing:", error);
		}
	}, [setShareAvailableUsers]);
	(0, import_react.useEffect)(() => {
		if (isOpen) {
			loadUsers();
			setShareErrorMsg(null);
			setShareTargetUser("");
			setShareCopied(false);
		}
	}, [
		isOpen,
		loadUsers,
		setShareErrorMsg,
		setShareTargetUser,
		setShareCopied
	]);
	if (!canvasId) return null;
	async function handleAddShare(usernameToShare) {
		if (!canvasId) return;
		const username = usernameToShare.trim();
		if (!username) return;
		setShareIsSharing(true);
		setShareErrorMsg(null);
		try {
			await shareCanvas(canvasId, username);
			setShareTargetUser("");
			onShareChange();
		} catch (error) {
			const message = error instanceof Error ? error.message : "Failed to share canvas.";
			setShareErrorMsg(message);
		} finally {
			setShareIsSharing(false);
		}
	}
	async function handleRemoveShare(usernameToRemove) {
		if (!canvasId) return;
		setShareUnsharingUser(usernameToRemove);
		setShareErrorMsg(null);
		try {
			await unshareCanvas(canvasId, usernameToRemove);
			onShareChange();
		} catch (error) {
			throw new Error(error);
		} finally {
			setShareUnsharingUser(null);
		}
	}
	function handleCopyLink() {
		const url = `${window.location.origin}/canvas/${canvasId}`;
		navigator.clipboard.writeText(url);
		setShareCopied(true);
		setTimeout(() => setShareCopied(false), 2e3);
	}
	const unsharedAvailableUsers = availableUsers.filter((u) => u !== owner && !sharedWith.includes(u));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		isOpen,
		onOpenChange,
		width: 520,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layout, {
			header: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, {
				title: "Share canvas",
				startContent: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
					icon: Share2,
					size: "sm"
				}),
				onOpenChange
			}),
			content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutContent, {
				padding: 4,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VStack, {
					gap: 4,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VStack, {
							gap: 2,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								weight: "medium",
								children: "Canvas Link"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HStack, {
								gap: 2,
								align: "center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
									label: "Canvas link",
									isLabelHidden: true,
									value: `${window.location.origin}/canvas/${canvasId}`,
									isReadOnly: true,
									width: "100%",
									size: "sm"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									label: copied ? "Copied" : "Copy link",
									variant: "secondary",
									size: "sm",
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
										icon: copied ? Check : Copy,
										size: "sm"
									}),
									onClick: handleCopyLink
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Divider, {}),
						isOwner && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VStack, {
							gap: 2,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
									weight: "medium",
									children: "Share with people"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HStack, {
									gap: 2,
									align: "center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
										label: "Target username",
										isLabelHidden: true,
										placeholder: "Enter username...",
										value: targetUser,
										onChange: (val) => setShareTargetUser(val),
										onKeyDown: (e) => {
											if (e.key === "Enter" && targetUser.trim()) handleAddShare(targetUser);
										},
										size: "sm",
										width: "100%"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										label: "Share",
										size: "sm",
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
											icon: UserPlus,
											size: "sm"
										}),
										isLoading: isSharing,
										isDisabled: !targetUser.trim(),
										onClick: () => handleAddShare(targetUser)
									})]
								}),
								unsharedAvailableUsers.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VStack, {
									gap: 1,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
										type: "supporting",
										children: "Registered users:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HStack, {
										gap: 1,
										wrap: "wrap",
										children: unsharedAvailableUsers.map((user) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											label: `+ ${user}`,
											variant: "ghost",
											size: "sm",
											onClick: () => {
												setShareTargetUser(user);
												handleAddShare(user);
											}
										}, user))
									})]
								}),
								errorMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
									type: "supporting",
									children: errorMsg
								})
							]
						}),
						isOwner && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Divider, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VStack, {
							gap: 2,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								weight: "medium",
								children: "People with access"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VStack, {
								gap: 2,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HStack, {
										justify: "between",
										align: "center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VStack, {
											gap: 0,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
												weight: "medium",
												children: owner
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
												type: "supporting",
												children: "Canvas Owner"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Token, { label: "Owner" })]
									}),
									sharedWith.map((user) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HStack, {
										justify: "between",
										align: "center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VStack, {
											gap: 0,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
												weight: "medium",
												children: user
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
												type: "supporting",
												children: "Can view and edit"
											})]
										}), isOwner && (unsharingUser === user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
											icon: LoaderCircle,
											size: "sm"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
											label: `Remove ${user}`,
											variant: "ghost",
											size: "sm",
											icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
												icon: UserX,
												size: "sm"
											}),
											onClick: () => handleRemoveShare(user),
											tooltip: "Remove access"
										}))]
									}, user)),
									sharedWith.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
										type: "supporting",
										children: "Not shared with anyone yet."
									})
								]
							})]
						})
					]
				})
			})
		})
	});
}
/**
* The web build ships from the server, so there is no auto-updater.
* These stubs keep the (optional) update prompt wired up without
* ever firing; a native/desktop build can implement them for real.
*/
function onUpdateAvailable(_callback) {
	return () => {};
}
async function installUpdate(_version) {}
function UpdatePrompt() {
	const [update, setUpdate] = (0, import_react.useState)(null);
	const [installing, setInstalling] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		return onUpdateAvailable((info) => setUpdate(info));
	}, []);
	async function handleInstall() {
		if (!update) return;
		setInstalling(true);
		try {
			await installUpdate(update.version);
		} catch (error) {
			console.error("Failed to install update:", error);
			setInstalling(false);
		}
	}
	function handleLater() {
		if (update) update.version;
		setUpdate(null);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		isOpen: update !== null,
		onOpenChange: (open) => {
			if (!open && !installing) handleLater();
		},
		width: 480,
		purpose: "form",
		children: update && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layout, {
			header: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, {
				title: `Update to ${update.version}`,
				onOpenChange: () => {
					if (!installing) handleLater();
				}
			}),
			content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutContent, {
				padding: 4,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VStack, {
					gap: 2,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, { children: [
						"A new version of Drawy is available. Update to",
						" ",
						update.version,
						"?"
					] }), update.notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						type: "supporting",
						children: update.notes
					}) : null]
				})
			}),
			footer: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutFooter, {
				hasDivider: true,
				padding: 4,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HStack, {
					justify: "end",
					gap: 2,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						label: "Later",
						variant: "secondary",
						onClick: handleLater,
						isDisabled: installing
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						label: installing ? "Installing..." : "Update Now",
						variant: "primary",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							icon: installing ? LoaderCircle : RefreshCw,
							size: "sm"
						}),
						onClick: handleInstall,
						isLoading: installing
					})]
				})
			})
		})
	});
}
function Dialogs() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LibraryBrowserModal, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShareCanvasModal, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UpdatePrompt, {})
	] });
}
//#endregion
export { Dialogs };
