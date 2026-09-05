if (typeof globalThis.requestAnimationFrame === "undefined") globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
if (typeof globalThis.cancelAnimationFrame === "undefined") globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
try {
	globalThis.requestAnimationFrame;
	globalThis.cancelAnimationFrame;
} catch (e) {}
import { RECURSIVE_CLIENT_UNWRAP_KEYS, get, isAsyncIteratorObject, isTypescriptObject, stringifyJSON, toArray } from "./client+[...].mjs";
//#region ../../.cache/nub/pm/store/@tanstack+query-core@5.102.8-0e1d0ffa8416c529/node_modules/@tanstack/query-core/build/modern/timeoutManager.js
var defaultTimeoutProvider = {
	setTimeout: (callback, delay) => setTimeout(callback, delay),
	clearTimeout: (timeoutId) => clearTimeout(timeoutId),
	setInterval: (callback, delay) => setInterval(callback, delay),
	clearInterval: (intervalId) => clearInterval(intervalId)
};
/**
* Allows customization of how timeouts are created.
*
* @tanstack/query-core makes liberal use of timeouts to implement `staleTime`
* and `gcTime`. The default TimeoutManager provider uses the platform's global
* `setTimeout` implementation, which is known to have scalability issues with
* thousands of timeouts on the event loop.
*
* If you hit this limitation, consider providing a custom TimeoutProvider that
* coalesces timeouts.
*/
var TimeoutManager = class {
	#provider = defaultTimeoutProvider;
	#providerCalled = false;
	setTimeoutProvider(provider) {
		this.#provider = provider;
	}
	setTimeout(callback, delay) {
		return this.#provider.setTimeout(callback, delay);
	}
	clearTimeout(timeoutId) {
		this.#provider.clearTimeout(timeoutId);
	}
	setInterval(callback, delay) {
		return this.#provider.setInterval(callback, delay);
	}
	clearInterval(intervalId) {
		this.#provider.clearInterval(intervalId);
	}
};
var timeoutManager = new TimeoutManager();
/**
* In many cases code wants to delay to the next event loop tick; this is not
* mediated by {@link timeoutManager}.
*
* This function is provided to make auditing the `tanstack/query-core` for
* incorrect use of system `setTimeout` easier.
*/
function systemSetTimeoutZero(callback) {
	setTimeout(callback, 0);
}
//#endregion
//#region ../../.cache/nub/pm/store/@tanstack+query-core@5.102.8-0e1d0ffa8416c529/node_modules/@tanstack/query-core/build/modern/utils.js
/** @deprecated
* use `environmentManager.isServer()` instead.
*/
var isServer = typeof window === "undefined" || "Deno" in globalThis;
function noop() {}
function functionalUpdate(updater, input) {
	return typeof updater === "function" ? updater(input) : updater;
}
function isValidTimeout(value) {
	return typeof value === "number" && value >= 0 && value !== Infinity;
}
function timeUntilStale(updatedAt, staleTime) {
	return Math.max(updatedAt + (staleTime || 0) - Date.now(), 0);
}
function resolveQueryValue(value, query) {
	return typeof value === "function" ? value(query) : value;
}
function matchQuery(filters, query) {
	const { type = "all", exact, fetchStatus, predicate, queryKey, stale } = filters;
	if (queryKey) {
		if (exact) {
			if (query.queryHash !== hashQueryKeyByOptions(queryKey, query.options)) return false;
		} else if (!partialMatchKey(query.queryKey, queryKey)) return false;
	}
	if (type !== "all") {
		const isActive = query.isActive();
		if (type === "active" && !isActive) return false;
		if (type === "inactive" && isActive) return false;
	}
	if (typeof stale === "boolean" && query.isStale() !== stale) return false;
	if (fetchStatus && fetchStatus !== query.state.fetchStatus) return false;
	if (predicate && !predicate(query)) return false;
	return true;
}
function matchMutation(filters, mutation) {
	const { exact, status, predicate, mutationKey } = filters;
	if (mutationKey) {
		if (!mutation.options.mutationKey) return false;
		if (exact) {
			if (hashKey(mutation.options.mutationKey) !== hashKey(mutationKey)) return false;
		} else if (!partialMatchKey(mutation.options.mutationKey, mutationKey)) return false;
	}
	if (status && mutation.state.status !== status) return false;
	if (predicate && !predicate(mutation)) return false;
	return true;
}
function hashQueryKeyByOptions(queryKey, options) {
	return (options?.queryKeyHashFn || hashKey)(queryKey);
}
/**
* Default query & mutation keys hash function.
* Hashes the value into a stable hash.
*/
function hashKey(queryKey) {
	return JSON.stringify(queryKey, (_, val) => isPlainObject(val) ? Object.keys(val).sort().reduce((result, key) => {
		result[key] = val[key];
		return result;
	}, {}) : val);
}
function partialMatchKey(a, b) {
	if (a === b) return true;
	if (typeof a !== typeof b) return false;
	if (a && b && typeof a === "object" && typeof b === "object") {
		if (Array.isArray(a) && Array.isArray(b)) {
			for (let i = 0; i < b.length; i++) if (!partialMatchKey(a[i], b[i])) return false;
			return true;
		}
		const bKeys = Object.keys(b);
		for (const key of bKeys) if (!partialMatchKey(a[key], b[key])) return false;
		return true;
	}
	return false;
}
var hasOwn = Object.prototype.hasOwnProperty;
function replaceEqualDeep(a, b, depth = 0) {
	if (a === b) return a;
	if (depth > 500) return b;
	const array = isPlainArray(a) && isPlainArray(b);
	if (!array && !(isPlainObject(a) && isPlainObject(b))) return b;
	const aSize = (array ? a : Object.keys(a)).length;
	const bItems = array ? b : Object.keys(b);
	const bSize = bItems.length;
	const copy = array ? new Array(bSize) : {};
	let equalItems = 0;
	for (let i = 0; i < bSize; i++) {
		const key = array ? i : bItems[i];
		const aItem = a[key];
		const bItem = b[key];
		if (aItem === bItem) {
			copy[key] = aItem;
			if (array ? i < aSize : hasOwn.call(a, key)) equalItems++;
			continue;
		}
		if (aItem === null || bItem === null || typeof aItem !== "object" || typeof bItem !== "object") {
			copy[key] = bItem;
			continue;
		}
		const v = replaceEqualDeep(aItem, bItem, depth + 1);
		copy[key] = v;
		if (v === aItem) equalItems++;
	}
	return aSize === bSize && equalItems === aSize ? a : copy;
}
function isPlainArray(value) {
	return Array.isArray(value) && value.length === Object.keys(value).length;
}
function isPlainObject(o) {
	if (!hasObjectPrototype(o)) return false;
	const ctor = o.constructor;
	if (ctor === void 0) return true;
	const prot = ctor.prototype;
	if (!hasObjectPrototype(prot)) return false;
	if (!prot.hasOwnProperty("isPrototypeOf")) return false;
	if (Object.getPrototypeOf(o) !== Object.prototype) return false;
	return true;
}
function hasObjectPrototype(o) {
	return Object.prototype.toString.call(o) === "[object Object]";
}
function sleep(timeout) {
	return new Promise((resolve) => {
		timeoutManager.setTimeout(resolve, timeout);
	});
}
function replaceData(prevData, data, options) {
	if (typeof options.structuralSharing === "function") return options.structuralSharing(prevData, data);
	else if (options.structuralSharing !== false) return replaceEqualDeep(prevData, data);
	return data;
}
function addToEnd(items, item, max = 0) {
	const newItems = [...items, item];
	return max && newItems.length > max ? newItems.slice(1) : newItems;
}
function addToStart(items, item, max = 0) {
	const newItems = [item, ...items];
	return max && newItems.length > max ? newItems.slice(0, -1) : newItems;
}
var skipToken = Symbol();
function ensureQueryFn(options, fetchOptions) {
	if (!options.queryFn && fetchOptions?.initialPromise) return () => fetchOptions.initialPromise;
	if (!options.queryFn || options.queryFn === skipToken) return () => Promise.reject(/* @__PURE__ */ new Error(`Missing queryFn: '${options.queryHash}'`));
	return options.queryFn;
}
function addConsumeAwareSignal(object, getSignal, onCancelled) {
	let consumed = false;
	let signal;
	Object.defineProperty(object, "signal", {
		enumerable: true,
		get: () => {
			signal ??= getSignal();
			if (consumed) return signal;
			consumed = true;
			if (signal.aborted) onCancelled();
			else signal.addEventListener("abort", onCancelled, { once: true });
			return signal;
		}
	});
	return object;
}
//#endregion
//#region ../../.cache/nub/pm/store/@orpc+tanstack-query@1.15.0_@opentelemetry+api@1.9.1_@orpc+client@1.15.0_@tanstack+query-core@5.102.8_-7f7240aa074ec0fc/node_modules/@orpc/tanstack-query/dist/index.mjs
function generateOperationKey(path, state = {}) {
	return [path, {
		...state.input !== void 0 ? { input: state.input } : {},
		...state.type !== void 0 ? { type: state.type } : {},
		...state.fnOptions !== void 0 ? { fnOptions: state.fnOptions } : {}
	}];
}
function createGeneralUtils(path) {
	return { key(options) {
		return generateOperationKey(path, options);
	} };
}
function experimental_liveQuery(queryFn) {
	return async (context) => {
		const stream = await queryFn(context);
		let last;
		for await (const chunk of stream) {
			if (context.signal.aborted) throw context.signal.reason;
			last = { chunk };
			context.client.setQueryData(context.queryKey, chunk);
		}
		if (!last) throw new Error(`Live query for ${stringifyJSON(context.queryKey)} did not yield any data. Ensure the query function returns an AsyncIterable with at least one chunk.`);
		return last.chunk;
	};
}
function experimental_serializableStreamedQuery(queryFn, { refetchMode = "reset", maxChunks = Number.POSITIVE_INFINITY } = {}) {
	return async (context) => {
		const query = context.client.getQueryCache().find({
			queryKey: context.queryKey,
			exact: true
		});
		const hasPreviousData = !!query && query.state.data !== void 0;
		if (hasPreviousData) {
			if (refetchMode === "reset") query.setState({
				status: "pending",
				data: void 0,
				error: null,
				fetchStatus: "fetching"
			});
			else context.client.setQueryData(context.queryKey, (prev = []) => limitArraySize(prev, maxChunks));
		}
		let result = [];
		const stream = await queryFn(context);
		const shouldUpdateCacheDuringStream = !hasPreviousData || refetchMode !== "replace";
		context.client.setQueryData(context.queryKey, (prev = []) => limitArraySize(prev, maxChunks));
		for await (const chunk of stream) {
			if (context.signal.aborted) throw context.signal.reason;
			result.push(chunk);
			result = limitArraySize(result, maxChunks);
			if (shouldUpdateCacheDuringStream) context.client.setQueryData(context.queryKey, (prev = []) => limitArraySize([...prev, chunk], maxChunks));
		}
		if (!shouldUpdateCacheDuringStream) context.client.setQueryData(context.queryKey, result);
		const cachedData = context.client.getQueryData(context.queryKey);
		if (cachedData) return limitArraySize(cachedData, maxChunks);
		return result;
	};
}
function limitArraySize(items, maxSize) {
	if (items.length <= maxSize) return items;
	return items.slice(items.length - maxSize);
}
var OPERATION_CONTEXT_SYMBOL = Symbol("ORPC_OPERATION_CONTEXT");
function createProcedureUtils(client, options) {
	const utils = {
		call: client,
		queryKey(...[optionsIn = {}]) {
			optionsIn = {
				...options.experimental_defaults?.queryKey,
				...optionsIn
			};
			return optionsIn.queryKey ?? generateOperationKey(options.path, {
				type: "query",
				input: optionsIn.input
			});
		},
		queryOptions(...[optionsIn = {}]) {
			optionsIn = {
				...options.experimental_defaults?.queryOptions,
				...optionsIn
			};
			const queryKey = utils.queryKey(optionsIn);
			return {
				queryFn: ({ signal }) => {
					if (optionsIn.input === skipToken) throw new Error("queryFn should not be called with skipToken used as input");
					return client(optionsIn.input, {
						signal,
						context: {
							[OPERATION_CONTEXT_SYMBOL]: {
								key: queryKey,
								type: "query"
							},
							...optionsIn.context
						}
					});
				},
				...optionsIn.input === skipToken ? { enabled: false } : {},
				...optionsIn,
				queryKey
			};
		},
		experimental_streamedKey(...[optionsIn = {}]) {
			optionsIn = {
				...options.experimental_defaults?.experimental_streamedKey,
				...optionsIn
			};
			return optionsIn.queryKey ?? generateOperationKey(options.path, {
				type: "streamed",
				input: optionsIn.input,
				fnOptions: optionsIn.queryFnOptions
			});
		},
		experimental_streamedOptions(...[optionsIn = {}]) {
			optionsIn = {
				...options.experimental_defaults?.experimental_streamedOptions,
				...optionsIn
			};
			const queryKey = utils.experimental_streamedKey(optionsIn);
			return {
				queryFn: experimental_serializableStreamedQuery(async ({ signal }) => {
					if (optionsIn.input === skipToken) throw new Error("queryFn should not be called with skipToken used as input");
					const output = await client(optionsIn.input, {
						signal,
						context: {
							[OPERATION_CONTEXT_SYMBOL]: {
								key: queryKey,
								type: "streamed"
							},
							...optionsIn.context
						}
					});
					if (!isAsyncIteratorObject(output)) throw new Error("streamedQuery requires an event iterator output");
					return output;
				}, optionsIn.queryFnOptions),
				...optionsIn.input === skipToken ? { enabled: false } : {},
				...optionsIn,
				queryKey
			};
		},
		experimental_liveKey(...[optionsIn = {}]) {
			optionsIn = {
				...options.experimental_defaults?.experimental_liveKey,
				...optionsIn
			};
			return optionsIn.queryKey ?? generateOperationKey(options.path, {
				type: "live",
				input: optionsIn.input
			});
		},
		experimental_liveOptions(...[optionsIn = {}]) {
			optionsIn = {
				...options.experimental_defaults?.experimental_liveOptions,
				...optionsIn
			};
			const queryKey = utils.experimental_liveKey(optionsIn);
			return {
				queryFn: experimental_liveQuery(async ({ signal }) => {
					if (optionsIn.input === skipToken) throw new Error("queryFn should not be called with skipToken used as input");
					const output = await client(optionsIn.input, {
						signal,
						context: {
							[OPERATION_CONTEXT_SYMBOL]: {
								key: queryKey,
								type: "live"
							},
							...optionsIn.context
						}
					});
					if (!isAsyncIteratorObject(output)) throw new Error("liveQuery requires an event iterator output");
					return output;
				}),
				...optionsIn.input === skipToken ? { enabled: false } : {},
				...optionsIn,
				queryKey
			};
		},
		infiniteKey(optionsIn) {
			optionsIn = {
				...options.experimental_defaults?.infiniteKey,
				...optionsIn
			};
			return optionsIn.queryKey ?? generateOperationKey(options.path, {
				type: "infinite",
				input: optionsIn.input === skipToken ? skipToken : optionsIn.input(optionsIn.initialPageParam)
			});
		},
		infiniteOptions(optionsIn) {
			optionsIn = {
				...options.experimental_defaults?.infiniteOptions,
				...optionsIn
			};
			const queryKey = utils.infiniteKey(optionsIn);
			return {
				queryFn: ({ pageParam, signal }) => {
					if (optionsIn.input === skipToken) throw new Error("queryFn should not be called with skipToken used as input");
					return client(optionsIn.input(pageParam), {
						signal,
						context: {
							[OPERATION_CONTEXT_SYMBOL]: {
								key: queryKey,
								type: "infinite"
							},
							...optionsIn.context
						}
					});
				},
				...optionsIn.input === skipToken ? { enabled: false } : {},
				...optionsIn,
				queryKey
			};
		},
		mutationKey(...[optionsIn = {}]) {
			optionsIn = {
				...options.experimental_defaults?.mutationKey,
				...optionsIn
			};
			return optionsIn.mutationKey ?? generateOperationKey(options.path, { type: "mutation" });
		},
		mutationOptions(...[optionsIn = {}]) {
			optionsIn = {
				...options.experimental_defaults?.mutationOptions,
				...optionsIn
			};
			const mutationKey = utils.mutationKey(optionsIn);
			return {
				mutationFn: (input) => client(input, { context: {
					[OPERATION_CONTEXT_SYMBOL]: {
						key: mutationKey,
						type: "mutation"
					},
					...optionsIn.context
				} }),
				...optionsIn,
				mutationKey
			};
		}
	};
	return utils;
}
function createRouterUtils(client, options = {}) {
	const path = toArray(options.path);
	const generalUtils = createGeneralUtils(path);
	const procedureUtils = createProcedureUtils(client, {
		path,
		experimental_defaults: options.experimental_defaults
	});
	return new Proxy({
		...generalUtils,
		...procedureUtils
	}, { get(target, prop) {
		const value = Reflect.get(target, prop);
		const nextClient = isTypescriptObject(client) ? Reflect.get(client, prop) : void 0;
		if (typeof prop !== "string" || RECURSIVE_CLIENT_UNWRAP_KEYS.has(prop) || !isTypescriptObject(nextClient)) return value;
		const nextUtils = createRouterUtils(client[prop], {
			...options,
			path: [...path, prop],
			experimental_defaults: get(options.experimental_defaults, [prop])
		});
		if (typeof value !== "function") return nextUtils;
		return new Proxy(value, { get(target2, prop2) {
			if (typeof prop2 !== "string" || RECURSIVE_CLIENT_UNWRAP_KEYS.has(prop2)) return Reflect.get(target2, prop2);
			return Reflect.get(nextUtils, prop2);
		} });
	} });
}
//#endregion
export { addConsumeAwareSignal, addToEnd, addToStart, createRouterUtils, ensureQueryFn, functionalUpdate, hashKey, hashQueryKeyByOptions, isServer, isValidTimeout, matchMutation, matchQuery, noop, partialMatchKey, replaceData, resolveQueryValue, skipToken, sleep, systemSetTimeoutZero, timeUntilStale, timeoutManager };
