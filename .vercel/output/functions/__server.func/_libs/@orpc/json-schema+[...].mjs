if (typeof globalThis.requestAnimationFrame === "undefined") globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
if (typeof globalThis.cancelAnimationFrame === "undefined") globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
try {
	globalThis.requestAnimationFrame;
	globalThis.cancelAnimationFrame;
} catch (e) {}
import { ErrorEvent, HibernationEventIterator, NullProtoObj, ORPCError, asyncIteratorWithSpan, clone, createORPCErrorFromJson, fallbackORPCErrorMessage, fallbackORPCErrorStatus, findDeepMatches, intercept, isAsyncIteratorObject, isORPCErrorJson, isORPCErrorStatus, isObject, isTypescriptObject, mapEventIterator, overlayProxy, resolveMaybeOptionalOptions, runWithSpan, stringifyJSON, toArray, toHttpPath, toORPCError, value } from "./client+[...].mjs";
import { ValidationError, enhanceRoute, fallbackContractConfig, getEventIteratorSchemaDetails, isContractProcedure, mergeErrorMap, mergeMeta, mergePrefix, mergeRoute, mergeTags, validateORPCError } from "../orpc__contract.mjs";
//#region ../../.cache/nub/pm/store/radash@12.1.1-d9f8ae1f619b18d8/node_modules/radash/dist/esm/async.mjs
var guard = (func, shouldGuard) => {
	const _guard = (err) => {
		if (shouldGuard && !shouldGuard(err)) throw err;
	};
	const isPromise2 = (result) => result instanceof Promise;
	try {
		const result = func();
		return isPromise2(result) ? result.catch(_guard) : result;
	} catch (err) {
		return _guard(err);
	}
};
//#endregion
//#region node_modules/.store/@orpc+server@1.15.0_@opentelemetry+api@1.9.1_crossws@0.4.10_ws@8.21.3/node_modules/@orpc/server/dist/shared/server.DEBcqOjg.mjs
var LAZY_SYMBOL = Symbol("ORPC_LAZY_SYMBOL");
function lazy(loader, meta = {}) {
	return { [LAZY_SYMBOL]: {
		loader,
		meta
	} };
}
function isLazy(item) {
	return (typeof item === "object" || typeof item === "function") && item !== null && LAZY_SYMBOL in item;
}
function getLazyMeta(lazied) {
	return lazied[LAZY_SYMBOL].meta;
}
function unlazy(lazied) {
	return isLazy(lazied) ? lazied[LAZY_SYMBOL].loader() : Promise.resolve({ default: lazied });
}
function isStartWithMiddlewares(middlewares, compare) {
	if (compare.length > middlewares.length) return false;
	for (let i = 0; i < middlewares.length; i++) {
		if (compare[i] === void 0) return true;
		if (middlewares[i] !== compare[i]) return false;
	}
	return true;
}
function mergeMiddlewares(first, second, options) {
	if (options.dedupeLeading && isStartWithMiddlewares(second, first)) return second;
	return [...first, ...second];
}
function addMiddleware(middlewares, addition) {
	return [...middlewares, addition];
}
var Procedure = class {
	/**
	* This property holds the defined options.
	*/
	"~orpc";
	constructor(def) {
		this["~orpc"] = def;
	}
};
function isProcedure(item) {
	if (item instanceof Procedure) return true;
	return isContractProcedure(item) && "middlewares" in item["~orpc"] && "inputValidationIndex" in item["~orpc"] && "outputValidationIndex" in item["~orpc"] && "handler" in item["~orpc"];
}
function mergeCurrentContext(context, other) {
	return {
		...context,
		...other
	};
}
function createORPCErrorConstructorMap(errors) {
	return new Proxy(errors, { get(target, code) {
		if (typeof code !== "string") return Reflect.get(target, code);
		const item = (...rest) => {
			const options = resolveMaybeOptionalOptions(rest);
			const config = errors[code];
			return new ORPCError(code, {
				defined: Boolean(config),
				status: config?.status,
				message: options.message ?? config?.message,
				data: options.data,
				cause: options.cause
			});
		};
		return item;
	} });
}
function middlewareOutputFn(output) {
	return {
		output,
		context: {}
	};
}
function createProcedureClient(lazyableProcedure, ...rest) {
	const options = resolveMaybeOptionalOptions(rest);
	return async (...[input, callerOptions]) => {
		const path = toArray(options.path);
		const { default: procedure } = await unlazy(lazyableProcedure);
		const clientContext = callerOptions?.context ?? {};
		const context = await value(options.context ?? {}, clientContext);
		const errors = createORPCErrorConstructorMap(procedure["~orpc"].errorMap);
		const validateError = async (e) => {
			if (e instanceof ORPCError) return await validateORPCError(procedure["~orpc"].errorMap, e);
			return e;
		};
		try {
			const output = await runWithSpan({
				name: "call_procedure",
				signal: callerOptions?.signal
			}, (span) => {
				span?.setAttribute("procedure.path", [...path]);
				return intercept(toArray(options.interceptors), {
					context,
					input,
					errors,
					path,
					procedure,
					signal: callerOptions?.signal,
					lastEventId: callerOptions?.lastEventId
				}, (interceptorOptions) => executeProcedureInternal(interceptorOptions.procedure, interceptorOptions));
			});
			if (isAsyncIteratorObject(output)) {
				if (output instanceof HibernationEventIterator) return output;
				return overlayProxy(output, mapEventIterator(asyncIteratorWithSpan({
					name: "consume_event_iterator_output",
					signal: callerOptions?.signal
				}, output), {
					value: (v) => v,
					error: (e) => validateError(e)
				}));
			}
			return output;
		} catch (e) {
			throw await validateError(e);
		}
	};
}
async function validateInput(procedure, input) {
	const schema = procedure["~orpc"].inputSchema;
	if (!schema) return input;
	return runWithSpan({ name: "validate_input" }, async () => {
		const result = await schema["~standard"].validate(input);
		if (result.issues) throw new ORPCError("BAD_REQUEST", {
			message: "Input validation failed",
			data: { issues: result.issues },
			cause: new ValidationError({
				message: "Input validation failed",
				issues: result.issues,
				data: input
			})
		});
		return result.value;
	});
}
async function validateOutput(procedure, output) {
	const schema = procedure["~orpc"].outputSchema;
	if (!schema) return output;
	return runWithSpan({ name: "validate_output" }, async () => {
		const result = await schema["~standard"].validate(output);
		if (result.issues) throw new ORPCError("INTERNAL_SERVER_ERROR", {
			message: "Output validation failed",
			cause: new ValidationError({
				message: "Output validation failed",
				issues: result.issues,
				data: output
			})
		});
		return result.value;
	});
}
async function executeProcedureInternal(procedure, options) {
	const middlewares = procedure["~orpc"].middlewares;
	const inputValidationIndex = Math.min(Math.max(0, procedure["~orpc"].inputValidationIndex), middlewares.length);
	const outputValidationIndex = Math.min(Math.max(0, procedure["~orpc"].outputValidationIndex), middlewares.length);
	const next = async (index, context, input) => {
		let currentInput = input;
		if (index === inputValidationIndex) currentInput = await validateInput(procedure, currentInput);
		const mid = middlewares[index];
		const output = mid ? await runWithSpan({
			name: `middleware.${mid.name}`,
			signal: options.signal
		}, async (span) => {
			span?.setAttribute("middleware.index", index);
			span?.setAttribute("middleware.name", mid.name);
			return (await mid({
				...options,
				context,
				next: async (...[nextOptions]) => {
					const nextContext = nextOptions?.context ?? {};
					return {
						output: await next(index + 1, mergeCurrentContext(context, nextContext), currentInput),
						context: nextContext
					};
				}
			}, currentInput, middlewareOutputFn)).output;
		}) : await runWithSpan({
			name: "handler",
			signal: options.signal
		}, () => procedure["~orpc"].handler({
			...options,
			context,
			input: currentInput
		}));
		if (index === outputValidationIndex) return await validateOutput(procedure, output);
		return output;
	};
	return next(0, options.context, options.input);
}
var HIDDEN_ROUTER_CONTRACT_SYMBOL = Symbol("ORPC_HIDDEN_ROUTER_CONTRACT");
function getHiddenRouterContract(router) {
	return router[HIDDEN_ROUTER_CONTRACT_SYMBOL];
}
function getRouter(router, path) {
	let current = router;
	for (let i = 0; i < path.length; i++) {
		const segment = path[i];
		if (!current) return;
		if (isProcedure(current)) return;
		if (!isTypescriptObject(current)) return;
		if (!isLazy(current)) {
			current = current[segment];
			continue;
		}
		const lazied = current;
		const rest = path.slice(i);
		return lazy(async () => {
			return unlazy(getRouter((await unlazy(lazied)).default, rest));
		}, getLazyMeta(lazied));
	}
	return current;
}
function createAccessibleLazyRouter(lazied) {
	return new Proxy(lazied, { get(target, key) {
		if (typeof key !== "string") return Reflect.get(target, key);
		return createAccessibleLazyRouter(getRouter(lazied, [key]));
	} });
}
function enhanceRouter(router, options) {
	if (isLazy(router)) {
		const laziedMeta = getLazyMeta(router);
		const enhancedPrefix = laziedMeta?.prefix ? mergePrefix(options.prefix, laziedMeta?.prefix) : options.prefix;
		return createAccessibleLazyRouter(lazy(async () => {
			const { default: unlaziedRouter } = await unlazy(router);
			return unlazy(enhanceRouter(unlaziedRouter, options));
		}, {
			...laziedMeta,
			prefix: enhancedPrefix
		}));
	}
	if (isProcedure(router)) {
		const newMiddlewares = mergeMiddlewares(options.middlewares, router["~orpc"].middlewares, { dedupeLeading: options.dedupeLeadingMiddlewares });
		const newMiddlewareAdded = newMiddlewares.length - router["~orpc"].middlewares.length;
		return new Procedure({
			...router["~orpc"],
			route: enhanceRoute(router["~orpc"].route, options),
			errorMap: mergeErrorMap(options.errorMap, router["~orpc"].errorMap),
			middlewares: newMiddlewares,
			inputValidationIndex: router["~orpc"].inputValidationIndex + newMiddlewareAdded,
			outputValidationIndex: router["~orpc"].outputValidationIndex + newMiddlewareAdded
		});
	}
	if (typeof router !== "object" || router === null) return router;
	const enhanced = {};
	for (const key in router) enhanced[key] = enhanceRouter(router[key], options);
	return enhanced;
}
function traverseContractProcedures(options, callback, lazyOptions = []) {
	let currentRouter = options.router;
	const hiddenContract = isTypescriptObject(options.router) ? getHiddenRouterContract(options.router) : void 0;
	if (hiddenContract !== void 0) currentRouter = hiddenContract;
	if (isLazy(currentRouter)) lazyOptions.push({
		router: currentRouter,
		path: options.path
	});
	else if (isContractProcedure(currentRouter)) callback({
		contract: currentRouter,
		path: options.path
	});
	else if (typeof currentRouter === "object" && currentRouter !== null) for (const key in currentRouter) traverseContractProcedures({
		router: currentRouter[key],
		path: [...options.path, key]
	}, callback, lazyOptions);
	return lazyOptions;
}
async function resolveContractProcedures(options, callback) {
	const pending = [options];
	for (const options2 of pending) {
		const lazyOptions = traverseContractProcedures(options2, callback);
		for (const options3 of lazyOptions) {
			const { default: router } = await unlazy(options3.router);
			pending.push({
				router,
				path: options3.path
			});
		}
	}
}
function createAssertedLazyProcedure(lazied) {
	return lazy(async () => {
		const { default: maybeProcedure } = await unlazy(lazied);
		if (!isProcedure(maybeProcedure)) throw new Error(`
            Expected a lazy<procedure> but got lazy<unknown>.
            This should be caught by TypeScript compilation.
            Please report this issue if this makes you feel uncomfortable.
        `);
		return { default: maybeProcedure };
	}, getLazyMeta(lazied));
}
function createContractedProcedure(procedure, contract) {
	return new Procedure({
		...procedure["~orpc"],
		errorMap: contract["~orpc"].errorMap,
		route: contract["~orpc"].route,
		meta: contract["~orpc"].meta
	});
}
//#endregion
//#region node_modules/.store/@orpc+server@1.15.0_@opentelemetry+api@1.9.1_crossws@0.4.10_ws@8.21.3/node_modules/@orpc/server/dist/index.mjs
var DEFAULT_CONFIG = {
	initialInputValidationIndex: 0,
	initialOutputValidationIndex: 0,
	dedupeLeadingMiddlewares: true
};
function fallbackConfig(key, value) {
	if (value === void 0) return DEFAULT_CONFIG[key];
	return value;
}
function decorateMiddleware(middleware) {
	const decorated = ((...args) => middleware(...args));
	decorated.mapInput = (mapInput) => {
		return decorateMiddleware((options, input, ...rest) => middleware(options, mapInput(input), ...rest));
	};
	decorated.concat = (concatMiddleware, mapInput) => {
		const mapped = mapInput ? decorateMiddleware(concatMiddleware).mapInput(mapInput) : concatMiddleware;
		return decorateMiddleware((options, input, output, ...rest) => {
			return middleware({
				...options,
				next: (...[nextOptions1]) => mapped({
					...options,
					context: {
						...options.context,
						...nextOptions1?.context
					},
					next: (...[nextOptions2]) => options.next({ context: {
						...nextOptions1?.context,
						...nextOptions2?.context
					} })
				}, input, output, ...rest)
			}, input, output, ...rest);
		});
	};
	return decorated;
}
function createActionableClient(client) {
	const action = async (input) => {
		try {
			return [null, await client(input)];
		} catch (error) {
			if (error instanceof Error && "digest" in error && typeof error.digest === "string" && error.digest.startsWith("NEXT_")) throw error;
			if (error instanceof Response && "options" in error && isObject(error.options) || isObject(error) && error.isNotFound === true) throw error;
			return [toORPCError(error).toJSON(), void 0];
		}
	};
	return action;
}
var DecoratedProcedure = class DecoratedProcedure extends Procedure {
	/**
	* Adds type-safe custom errors.
	* The provided errors are spared-merged with any existing errors.
	*
	* @see {@link https://orpc.dev/docs/error-handling#type%E2%80%90safe-error-handling Type-Safe Error Handling Docs}
	*/
	errors(errors) {
		return new DecoratedProcedure({
			...this["~orpc"],
			errorMap: mergeErrorMap(this["~orpc"].errorMap, errors)
		});
	}
	/**
	* Sets or updates the metadata.
	* The provided metadata is spared-merged with any existing metadata.
	*
	* @see {@link https://orpc.dev/docs/metadata Metadata Docs}
	*/
	meta(meta) {
		return new DecoratedProcedure({
			...this["~orpc"],
			meta: mergeMeta(this["~orpc"].meta, meta)
		});
	}
	/**
	* Sets or updates the route definition.
	* The provided route is spared-merged with any existing route.
	* This option is typically relevant when integrating with OpenAPI.
	*
	* @see {@link https://orpc.dev/docs/openapi/routing OpenAPI Routing Docs}
	* @see {@link https://orpc.dev/docs/openapi/input-output-structure OpenAPI Input/Output Structure Docs}
	*/
	route(route) {
		return new DecoratedProcedure({
			...this["~orpc"],
			route: mergeRoute(this["~orpc"].route, route)
		});
	}
	use(middleware, mapInput) {
		const mapped = mapInput ? decorateMiddleware(middleware).mapInput(mapInput) : middleware;
		return new DecoratedProcedure({
			...this["~orpc"],
			middlewares: addMiddleware(this["~orpc"].middlewares, mapped)
		});
	}
	/**
	* Make this procedure callable (works like a function while still being a procedure).
	*
	* @see {@link https://orpc.dev/docs/client/server-side Server-side Client Docs}
	*/
	callable(...rest) {
		const client = createProcedureClient(this, ...rest);
		return new Proxy(client, {
			get: (target, key) => {
				return Reflect.has(this, key) ? Reflect.get(this, key) : Reflect.get(target, key);
			},
			has: (target, key) => {
				return Reflect.has(this, key) || Reflect.has(target, key);
			}
		});
	}
	/**
	* Make this procedure compatible with server action.
	*
	* @see {@link https://orpc.dev/docs/server-action Server Action Docs}
	*/
	actionable(...rest) {
		const action = createActionableClient(createProcedureClient(this, ...rest));
		return new Proxy(action, {
			get: (target, key) => {
				return Reflect.has(this, key) ? Reflect.get(this, key) : Reflect.get(target, key);
			},
			has: (target, key) => {
				return Reflect.has(this, key) || Reflect.has(target, key);
			}
		});
	}
};
var os = new class Builder {
	/**
	* This property holds the defined options.
	*/
	"~orpc";
	constructor(def) {
		this["~orpc"] = def;
	}
	/**
	* Sets or overrides the config.
	*
	* @see {@link https://orpc.dev/docs/client/server-side#middlewares-order Middlewares Order Docs}
	* @see {@link https://orpc.dev/docs/best-practices/dedupe-middleware#configuration Dedupe Middleware Docs}
	*/
	$config(config) {
		const inputValidationCount = this["~orpc"].inputValidationIndex - fallbackConfig("initialInputValidationIndex", this["~orpc"].config.initialInputValidationIndex);
		const outputValidationCount = this["~orpc"].outputValidationIndex - fallbackConfig("initialOutputValidationIndex", this["~orpc"].config.initialOutputValidationIndex);
		return new Builder({
			...this["~orpc"],
			config,
			dedupeLeadingMiddlewares: fallbackConfig("dedupeLeadingMiddlewares", config.dedupeLeadingMiddlewares),
			inputValidationIndex: fallbackConfig("initialInputValidationIndex", config.initialInputValidationIndex) + inputValidationCount,
			outputValidationIndex: fallbackConfig("initialOutputValidationIndex", config.initialOutputValidationIndex) + outputValidationCount
		});
	}
	/**
	* Set or override the initial context.
	*
	* @see {@link https://orpc.dev/docs/context Context Docs}
	*/
	$context() {
		return new Builder({
			...this["~orpc"],
			middlewares: [],
			inputValidationIndex: fallbackConfig("initialInputValidationIndex", this["~orpc"].config.initialInputValidationIndex),
			outputValidationIndex: fallbackConfig("initialOutputValidationIndex", this["~orpc"].config.initialOutputValidationIndex)
		});
	}
	/**
	* Sets or overrides the initial meta.
	*
	* @see {@link https://orpc.dev/docs/metadata Metadata Docs}
	*/
	$meta(initialMeta) {
		return new Builder({
			...this["~orpc"],
			meta: initialMeta
		});
	}
	/**
	* Sets or overrides the initial route.
	* This option is typically relevant when integrating with OpenAPI.
	*
	* @see {@link https://orpc.dev/docs/openapi/routing OpenAPI Routing Docs}
	* @see {@link https://orpc.dev/docs/openapi/input-output-structure OpenAPI Input/Output Structure Docs}
	*/
	$route(initialRoute) {
		return new Builder({
			...this["~orpc"],
			route: initialRoute
		});
	}
	/**
	* Sets or overrides the initial input schema.
	*
	* @see {@link https://orpc.dev/docs/procedure#initial-configuration Initial Procedure Configuration Docs}
	*/
	$input(initialInputSchema) {
		return new Builder({
			...this["~orpc"],
			inputSchema: initialInputSchema
		});
	}
	/**
	* Creates a middleware.
	*
	* @see {@link https://orpc.dev/docs/middleware Middleware Docs}
	*/
	middleware(middleware) {
		return decorateMiddleware(middleware);
	}
	/**
	* Adds type-safe custom errors.
	* The provided errors are spared-merged with any existing errors.
	*
	* @see {@link https://orpc.dev/docs/error-handling#type%E2%80%90safe-error-handling Type-Safe Error Handling Docs}
	*/
	errors(errors) {
		return new Builder({
			...this["~orpc"],
			errorMap: mergeErrorMap(this["~orpc"].errorMap, errors)
		});
	}
	use(middleware, mapInput) {
		const mapped = mapInput ? decorateMiddleware(middleware).mapInput(mapInput) : middleware;
		return new Builder({
			...this["~orpc"],
			middlewares: addMiddleware(this["~orpc"].middlewares, mapped)
		});
	}
	/**
	* Sets or updates the metadata.
	* The provided metadata is spared-merged with any existing metadata.
	*
	* @see {@link https://orpc.dev/docs/metadata Metadata Docs}
	*/
	meta(meta) {
		return new Builder({
			...this["~orpc"],
			meta: mergeMeta(this["~orpc"].meta, meta)
		});
	}
	/**
	* Sets or updates the route definition.
	* The provided route is spared-merged with any existing route.
	* This option is typically relevant when integrating with OpenAPI.
	*
	* @see {@link https://orpc.dev/docs/openapi/routing OpenAPI Routing Docs}
	* @see {@link https://orpc.dev/docs/openapi/input-output-structure OpenAPI Input/Output Structure Docs}
	*/
	route(route) {
		return new Builder({
			...this["~orpc"],
			route: mergeRoute(this["~orpc"].route, route)
		});
	}
	/**
	* Defines the input validation schema.
	*
	* @see {@link https://orpc.dev/docs/procedure#input-output-validation Input Validation Docs}
	*/
	input(schema) {
		return new Builder({
			...this["~orpc"],
			inputSchema: schema,
			inputValidationIndex: fallbackConfig("initialInputValidationIndex", this["~orpc"].config.initialInputValidationIndex) + this["~orpc"].middlewares.length
		});
	}
	/**
	* Defines the output validation schema.
	*
	* @see {@link https://orpc.dev/docs/procedure#input-output-validation Output Validation Docs}
	*/
	output(schema) {
		return new Builder({
			...this["~orpc"],
			outputSchema: schema,
			outputValidationIndex: fallbackConfig("initialOutputValidationIndex", this["~orpc"].config.initialOutputValidationIndex) + this["~orpc"].middlewares.length
		});
	}
	/**
	* Defines the handler of the procedure.
	*
	* @see {@link https://orpc.dev/docs/procedure Procedure Docs}
	*/
	handler(handler) {
		return new DecoratedProcedure({
			...this["~orpc"],
			handler
		});
	}
	/**
	* Prefixes all procedures in the router.
	* The provided prefix is post-appended to any existing router prefix.
	*
	* @note This option does not affect procedures that do not define a path in their route definition.
	*
	* @see {@link https://orpc.dev/docs/openapi/routing#route-prefixes OpenAPI Route Prefixes Docs}
	*/
	prefix(prefix) {
		return new Builder({
			...this["~orpc"],
			prefix: mergePrefix(this["~orpc"].prefix, prefix)
		});
	}
	/**
	* Adds tags to all procedures in the router.
	* This helpful when you want to group procedures together in the OpenAPI specification.
	*
	* @see {@link https://orpc.dev/docs/openapi/openapi-specification#operation-metadata OpenAPI Operation Metadata Docs}
	*/
	tag(...tags) {
		return new Builder({
			...this["~orpc"],
			tags: mergeTags(this["~orpc"].tags, tags)
		});
	}
	/**
	* Applies all of the previously defined options to the specified router.
	*
	* @see {@link https://orpc.dev/docs/router#extending-router Extending Router Docs}
	*/
	router(router) {
		return enhanceRouter(router, this["~orpc"]);
	}
	/**
	* Create a lazy router
	* And applies all of the previously defined options to the specified router.
	*
	* @see {@link https://orpc.dev/docs/router#extending-router Extending Router Docs}
	*/
	lazy(loader) {
		return enhanceRouter(lazy(loader), this["~orpc"]);
	}
}({
	config: {},
	route: {},
	meta: {},
	errorMap: {},
	inputValidationIndex: fallbackConfig("initialInputValidationIndex"),
	outputValidationIndex: fallbackConfig("initialOutputValidationIndex"),
	middlewares: [],
	dedupeLeadingMiddlewares: true
});
function createRouterClient(router, ...rest) {
	const options = resolveMaybeOptionalOptions(rest);
	if (isProcedure(router)) return createProcedureClient(router, options);
	const procedureCaller = isLazy(router) ? createProcedureClient(createAssertedLazyProcedure(router), options) : {};
	return new Proxy(procedureCaller, { get(target, key) {
		if (typeof key !== "string") return Reflect.get(target, key);
		const next = getRouter(router, [key]);
		if (!next) return Reflect.get(target, key);
		return createRouterClient(next, {
			...rest[0],
			path: [...rest[0]?.path ?? [], key]
		});
	} });
}
//#endregion
//#region ../../.cache/nub/pm/store/@orpc+openapi-client@1.15.0_@opentelemetry+api@1.9.1_-9e057460b3ef864e/node_modules/@orpc/openapi-client/dist/shared/openapi-client.t9fCAe3x.mjs
var StandardBracketNotationSerializer = class {
	maxArrayIndex;
	constructor(options = {}) {
		this.maxArrayIndex = options.maxBracketNotationArrayIndex ?? 9999;
	}
	serialize(data, segments = [], result = []) {
		if (Array.isArray(data)) data.forEach((item, i) => {
			this.serialize(item, [...segments, i], result);
		});
		else if (isObject(data)) for (const key in data) this.serialize(data[key], [...segments, key], result);
		else result.push([this.stringifyPath(segments), data]);
		return result;
	}
	deserialize(serialized) {
		if (serialized.length === 0) return {};
		const arrayPushStyles = /* @__PURE__ */ new WeakSet();
		const ref = { value: [] };
		for (const [path, value] of serialized) {
			const segments = this.parsePath(path);
			let currentRef = ref;
			let nextSegment = "value";
			segments.forEach((segment, i) => {
				if (!Array.isArray(currentRef[nextSegment]) && !isObject(currentRef[nextSegment])) currentRef[nextSegment] = [];
				if (i !== segments.length - 1) {
					if (Array.isArray(currentRef[nextSegment]) && !isValidArrayIndex(segment, this.maxArrayIndex)) {
						if (arrayPushStyles.has(currentRef[nextSegment])) {
							arrayPushStyles.delete(currentRef[nextSegment]);
							currentRef[nextSegment] = pushStyleArrayToObject(currentRef[nextSegment]);
						} else currentRef[nextSegment] = arrayToObject(currentRef[nextSegment]);
					}
				} else if (Array.isArray(currentRef[nextSegment])) {
					if (segment === "") {
						if (currentRef[nextSegment].length && !arrayPushStyles.has(currentRef[nextSegment])) currentRef[nextSegment] = arrayToObject(currentRef[nextSegment]);
					} else if (arrayPushStyles.has(currentRef[nextSegment])) {
						arrayPushStyles.delete(currentRef[nextSegment]);
						currentRef[nextSegment] = pushStyleArrayToObject(currentRef[nextSegment]);
					} else if (!isValidArrayIndex(segment, this.maxArrayIndex)) currentRef[nextSegment] = arrayToObject(currentRef[nextSegment]);
				}
				currentRef = currentRef[nextSegment];
				nextSegment = segment;
			});
			if (Array.isArray(currentRef) && nextSegment === "") {
				arrayPushStyles.add(currentRef);
				currentRef.push(value);
			} else if (nextSegment in currentRef) {
				if (Array.isArray(currentRef[nextSegment])) currentRef[nextSegment].push(value);
				else currentRef[nextSegment] = [currentRef[nextSegment], value];
			} else currentRef[nextSegment] = value;
		}
		return ref.value;
	}
	stringifyPath(segments) {
		return segments.map((segment) => {
			return segment.toString().replace(/[\\[\]]/g, (match) => {
				switch (match) {
					case "\\": return "\\\\";
					case "[": return "\\[";
					case "]": return "\\]";
					/* v8 ignore next 2 */
					default: return match;
				}
			});
		}).reduce((result, segment, i) => {
			if (i === 0) return segment;
			return `${result}[${segment}]`;
		}, "");
	}
	parsePath(path) {
		const segments = [];
		let inBrackets = false;
		let currentSegment = "";
		let backslashCount = 0;
		for (let i = 0; i < path.length; i++) {
			const char = path[i];
			const nextChar = path[i + 1];
			if (inBrackets && char === "]" && (nextChar === void 0 || nextChar === "[") && backslashCount % 2 === 0) {
				if (nextChar === void 0) inBrackets = false;
				segments.push(currentSegment);
				currentSegment = "";
				i++;
			} else if (segments.length === 0 && char === "[" && backslashCount % 2 === 0) {
				inBrackets = true;
				segments.push(currentSegment);
				currentSegment = "";
			} else if (char === "\\") backslashCount++;
			else {
				currentSegment += "\\".repeat(backslashCount / 2) + char;
				backslashCount = 0;
			}
		}
		return inBrackets || segments.length === 0 ? [path] : segments;
	}
};
function isValidArrayIndex(value, maxIndex) {
	return /^0$|^[1-9]\d*$/.test(value) && Number(value) <= maxIndex;
}
function arrayToObject(array) {
	const obj = new NullProtoObj();
	array.forEach((item, i) => {
		obj[i] = item;
	});
	return obj;
}
function pushStyleArrayToObject(array) {
	const obj = new NullProtoObj();
	obj[""] = array.length === 1 ? array[0] : array;
	return obj;
}
//#endregion
//#region ../../.cache/nub/pm/store/@orpc+openapi-client@1.15.0_@opentelemetry+api@1.9.1_-9e057460b3ef864e/node_modules/@orpc/openapi-client/dist/shared/openapi-client.B2Q9qU5m.mjs
var StandardOpenAPIJsonSerializer = class {
	customSerializers;
	constructor(options = {}) {
		this.customSerializers = options.customJsonSerializers ?? [];
	}
	serialize(data, hasBlobRef = { value: false }) {
		for (const custom of this.customSerializers) if (custom.condition(data)) return this.serialize(custom.serialize(data), hasBlobRef);
		if (data instanceof Blob) {
			hasBlobRef.value = true;
			return [data, hasBlobRef.value];
		}
		if (data instanceof Set) return this.serialize(Array.from(data), hasBlobRef);
		if (data instanceof Map) return this.serialize(Array.from(data.entries()), hasBlobRef);
		if (Array.isArray(data)) return [data.map((v) => v === void 0 ? null : this.serialize(v, hasBlobRef)[0]), hasBlobRef.value];
		if (isObject(data)) {
			const json = {};
			for (const k in data) {
				if (k === "toJSON" && typeof data[k] === "function") continue;
				json[k] = this.serialize(data[k], hasBlobRef)[0];
			}
			return [json, hasBlobRef.value];
		}
		if (typeof data === "bigint" || data instanceof RegExp || data instanceof URL) return [data.toString(), hasBlobRef.value];
		if (data instanceof Date) return [Number.isNaN(data.getTime()) ? null : data.toISOString(), hasBlobRef.value];
		if (Number.isNaN(data)) return [null, hasBlobRef.value];
		return [data, hasBlobRef.value];
	}
};
function standardizeHTTPPath(path) {
	return `/${path.replace(/\/{2,}/g, "/").replace(/^\/|\/$/g, "")}`;
}
function getDynamicParams(path) {
	return path ? standardizeHTTPPath(path).match(/\/\{[^}]+\}/g)?.map((v) => ({
		raw: v,
		name: v.match(/\{\+?([^}]+)\}/)[1]
	})) : void 0;
}
var StandardOpenAPISerializer = class {
	constructor(jsonSerializer, bracketNotation) {
		this.jsonSerializer = jsonSerializer;
		this.bracketNotation = bracketNotation;
	}
	serialize(data, options = {}) {
		if (isAsyncIteratorObject(data) && !options.outputFormat) return mapEventIterator(data, {
			value: async (value) => this.#serialize(value, { outputFormat: "plain" }),
			error: async (e) => {
				return new ErrorEvent({
					data: this.#serialize(toORPCError(e).toJSON(), { outputFormat: "plain" }),
					cause: e
				});
			}
		});
		return this.#serialize(data, options);
	}
	#serialize(data, options) {
		const [json, hasBlob] = this.jsonSerializer.serialize(data);
		if (options.outputFormat === "plain") return json;
		if (options.outputFormat === "URLSearchParams") {
			const params = new URLSearchParams();
			for (const [path, value] of this.bracketNotation.serialize(json)) if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") params.append(path, value.toString());
			return params;
		}
		if (json instanceof Blob || json === void 0 || !hasBlob) return json;
		const form = new FormData();
		for (const [path, value] of this.bracketNotation.serialize(json)) if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") form.append(path, value.toString());
		else if (value instanceof Blob) form.append(path, value);
		return form;
	}
	deserialize(data) {
		if (data instanceof URLSearchParams || data instanceof FormData) return this.bracketNotation.deserialize(Array.from(data.entries()));
		if (isAsyncIteratorObject(data)) return mapEventIterator(data, {
			value: async (value) => value,
			error: async (e) => {
				if (e instanceof ErrorEvent && isORPCErrorJson(e.data)) return createORPCErrorFromJson(e.data, { cause: e });
				return e;
			}
		});
		return data;
	}
};
//#endregion
//#region ../../.cache/nub/pm/store/json-schema-typed@8.0.2-87e1a3ddf759e8f1/node_modules/json-schema-typed/draft_2020_12.js
/**
* Content encoding strategy enum.
*
* - [Content-Transfer-Encoding Syntax](https://datatracker.ietf.org/doc/html/rfc2045#section-6.1)
* - [7bit vs 8bit encoding](https://stackoverflow.com/questions/25710599/content-transfer-encoding-7bit-or-8-bit/28531705#28531705)
*/
var ContentEncoding;
(function(ContentEncoding) {
	/**
	* Only US-ASCII characters, which use the lower 7 bits for each character.
	*
	* Each line must be less than 1,000 characters.
	*/
	ContentEncoding["7bit"] = "7bit";
	/**
	* Allow extended ASCII characters which can use the 8th (highest) bit to
	* indicate special characters not available in 7bit.
	*
	* Each line must be less than 1,000 characters.
	*/
	ContentEncoding["8bit"] = "8bit";
	/**
	* Useful for data that is mostly non-text.
	*/
	ContentEncoding["Base64"] = "base64";
	/**
	* Same character set as 8bit, with no line length restriction.
	*/
	ContentEncoding["Binary"] = "binary";
	/**
	* An extension token defined by a standards-track RFC and registered with
	* IANA.
	*/
	ContentEncoding["IETFToken"] = "ietf-token";
	/**
	* Lines are limited to 76 characters, and line breaks are represented using
	* special characters that are escaped.
	*/
	ContentEncoding["QuotedPrintable"] = "quoted-printable";
	/**
	* The two characters "X-" or "x-" followed, with no intervening white space,
	* by any token.
	*/
	ContentEncoding["XToken"] = "x-token";
})(ContentEncoding || (ContentEncoding = {}));
/**
* This enum provides well-known formats that apply to strings.
*/
var Format;
(function(Format) {
	/**
	* A string instance is valid against this attribute if it is a valid
	* representation according to the "full-date" production in
	* [RFC 3339][RFC3339].
	*
	* [RFC3339]: https://datatracker.ietf.org/doc/html/rfc3339
	*/
	Format["Date"] = "date";
	/**
	* A string instance is valid against this attribute if it is a valid
	* representation according to the "date-time" production in
	* [RFC 3339][RFC3339].
	*
	* [RFC3339]: https://datatracker.ietf.org/doc/html/rfc3339
	*/
	Format["DateTime"] = "date-time";
	/**
	* A string instance is valid against this attribute if it is a valid
	* representation according to the "duration" production.
	*/
	Format["Duration"] = "duration";
	/**
	* A string instance is valid against this attribute if it is a valid Internet
	* email address as defined by by the "Mailbox" ABNF rule in [RFC
	* 5321][RFC5322], section 4.1.2.
	*
	* [RFC5321]: https://datatracker.ietf.org/doc/html/rfc5321
	*/
	Format["Email"] = "email";
	/**
	* As defined by [RFC 1123, section 2.1][RFC1123], including host names
	* produced using the Punycode algorithm specified in
	* [RFC 5891, section 4.4][RFC5891].
	*
	* [RFC1123]: https://datatracker.ietf.org/doc/html/rfc1123
	* [RFC5891]: https://datatracker.ietf.org/doc/html/rfc5891
	*/
	Format["Hostname"] = "hostname";
	/**
	* A string instance is valid against this attribute if it is a valid Internet
	* email address as defined by the extended "Mailbox" ABNF rule in
	* [RFC 6531][RFC6531], section 3.3.
	*
	* [RFC6531]: https://datatracker.ietf.org/doc/html/rfc6531
	*/
	Format["IDNEmail"] = "idn-email";
	/**
	* As defined by either [RFC 1123, section 2.1][RFC1123] as for hostname, or
	* an internationalized hostname as defined by
	* [RFC 5890, section 2.3.2.3][RFC5890].
	*
	* [RFC1123]: https://datatracker.ietf.org/doc/html/rfc1123
	* [RFC5890]: https://datatracker.ietf.org/doc/html/rfc5890
	*/
	Format["IDNHostname"] = "idn-hostname";
	/**
	* An IPv4 address according to the "dotted-quad" ABNF syntax as defined in
	* [RFC 2673, section 3.2][RFC2673].
	*
	* [RFC2673]: https://datatracker.ietf.org/doc/html/rfc2673
	*/
	Format["IPv4"] = "ipv4";
	/**
	* An IPv6 address as defined in [RFC 4291, section 2.2][RFC4291].
	*
	* [RFC4291]: https://datatracker.ietf.org/doc/html/rfc4291
	*/
	Format["IPv6"] = "ipv6";
	/**
	* A string instance is valid against this attribute if it is a valid IRI,
	* according to [RFC 3987][RFC3987].
	*
	* [RFC3987]: https://datatracker.ietf.org/doc/html/rfc3987
	*/
	Format["IRI"] = "iri";
	/**
	* A string instance is valid against this attribute if it is a valid IRI
	* Reference (either an IRI or a relative-reference), according to
	* [RFC 3987][RFC3987].
	*
	* [RFC3987]: https://datatracker.ietf.org/doc/html/rfc3987
	*/
	Format["IRIReference"] = "iri-reference";
	/**
	* A string instance is valid against this attribute if it is a valid JSON
	* string representation of a JSON Pointer, according to
	* [RFC 6901, section 5][RFC6901].
	*
	* [RFC6901]: https://datatracker.ietf.org/doc/html/rfc6901
	*/
	Format["JSONPointer"] = "json-pointer";
	/**
	* A string instance is valid against this attribute if it is a valid JSON
	* string representation of a JSON Pointer fragment, according to
	* [RFC 6901, section 5][RFC6901].
	*
	* [RFC6901]: https://datatracker.ietf.org/doc/html/rfc6901
	*/
	Format["JSONPointerURIFragment"] = "json-pointer-uri-fragment";
	/**
	* This attribute applies to string instances.
	*
	* A regular expression, which SHOULD be valid according to the
	* [ECMA-262][ecma262] regular expression dialect.
	*
	* Implementations that validate formats MUST accept at least the subset of
	* [ECMA-262][ecma262] defined in the [Regular Expressions][regexInterop]
	* section of this specification, and SHOULD accept all valid
	* [ECMA-262][ecma262] expressions.
	*
	* [ecma262]: https://www.ecma-international.org/publications-and-standards/standards/ecma-262/
	* [regexInterop]: https://json-schema.org/draft/2020-12/json-schema-validation.html#regexInterop
	*/
	Format["RegEx"] = "regex";
	/**
	* A string instance is valid against this attribute if it is a valid
	* [Relative JSON Pointer][relative-json-pointer].
	*
	* [relative-json-pointer]: https://datatracker.ietf.org/doc/html/draft-handrews-relative-json-pointer-01
	*/
	Format["RelativeJSONPointer"] = "relative-json-pointer";
	/**
	* A string instance is valid against this attribute if it is a valid
	* representation according to the "time" production in [RFC 3339][RFC3339].
	*
	* [RFC3339]: https://datatracker.ietf.org/doc/html/rfc3339
	*/
	Format["Time"] = "time";
	/**
	* A string instance is valid against this attribute if it is a valid URI,
	* according to [RFC3986][RFC3986].
	*
	* [RFC3986]: https://datatracker.ietf.org/doc/html/rfc3986
	*/
	Format["URI"] = "uri";
	/**
	* A string instance is valid against this attribute if it is a valid URI
	* Reference (either a URI or a relative-reference), according to
	* [RFC3986][RFC3986].
	*
	* [RFC3986]: https://datatracker.ietf.org/doc/html/rfc3986
	*/
	Format["URIReference"] = "uri-reference";
	/**
	* A string instance is valid against this attribute if it is a valid URI
	* Template (of any level), according to [RFC 6570][RFC6570].
	*
	* Note that URI Templates may be used for IRIs; there is no separate IRI
	* Template specification.
	*
	* [RFC6570]: https://datatracker.ietf.org/doc/html/rfc6570
	*/
	Format["URITemplate"] = "uri-template";
	/**
	* A string instance is valid against this attribute if it is a valid string
	* representation of a UUID, according to [RFC 4122][RFC4122].
	*
	* [RFC4122]: https://datatracker.ietf.org/doc/html/rfc4122
	*/
	Format["UUID"] = "uuid";
})(Format || (Format = {}));
/**
* Enum consisting of simple type names for the `type` keyword
*/
var TypeName;
(function(TypeName) {
	/**
	* Value MUST be an array.
	*/
	TypeName["Array"] = "array";
	/**
	* Value MUST be a boolean.
	*/
	TypeName["Boolean"] = "boolean";
	/**
	* Value MUST be an integer, no floating point numbers are allowed. This is a
	* subset of the number type.
	*/
	TypeName["Integer"] = "integer";
	/**
	* Value MUST be null. Note this is mainly for purpose of being able use union
	* types to define nullability. If this type is not included in a union, null
	* values are not allowed (the primitives listed above do not allow nulls on
	* their own).
	*/
	TypeName["Null"] = "null";
	/**
	* Value MUST be a number, floating point numbers are allowed.
	*/
	TypeName["Number"] = "number";
	/**
	* Value MUST be an object.
	*/
	TypeName["Object"] = "object";
	/**
	* Value MUST be a string.
	*/
	TypeName["String"] = "string";
})(TypeName || (TypeName = {}));
//#endregion
//#region node_modules/.store/@orpc+openapi@1.15.0_@opentelemetry+api@1.9.1_crossws@0.4.10_ws@8.21.3/node_modules/@orpc/openapi/dist/shared/openapi.BwdtJjDu.mjs
var OPERATION_EXTENDER_SYMBOL = Symbol("ORPC_OPERATION_EXTENDER");
function getCustomOpenAPIOperation(o) {
	return o[OPERATION_EXTENDER_SYMBOL];
}
function applyCustomOpenAPIOperation(operation, contract) {
	const operationCustoms = [];
	for (const errorItem of Object.values(contract["~orpc"].errorMap)) {
		const maybeExtender = errorItem ? getCustomOpenAPIOperation(errorItem) : void 0;
		if (maybeExtender) operationCustoms.push(maybeExtender);
	}
	if (isProcedure(contract)) for (const middleware of contract["~orpc"].middlewares) {
		const maybeExtender = getCustomOpenAPIOperation(middleware);
		if (maybeExtender) operationCustoms.push(maybeExtender);
	}
	let currentOperation = operation;
	for (const custom of operationCustoms) if (typeof custom === "function") currentOperation = custom(currentOperation, contract);
	else currentOperation = {
		...currentOperation,
		...custom
	};
	return currentOperation;
}
var LOGIC_KEYWORDS = [
	"$dynamicRef",
	"$ref",
	"additionalItems",
	"additionalProperties",
	"allOf",
	"anyOf",
	"const",
	"contains",
	"contentEncoding",
	"contentMediaType",
	"contentSchema",
	"dependencies",
	"dependentRequired",
	"dependentSchemas",
	"else",
	"enum",
	"exclusiveMaximum",
	"exclusiveMinimum",
	"format",
	"if",
	"items",
	"maxContains",
	"maximum",
	"maxItems",
	"maxLength",
	"maxProperties",
	"minContains",
	"minimum",
	"minItems",
	"minLength",
	"minProperties",
	"multipleOf",
	"not",
	"oneOf",
	"pattern",
	"patternProperties",
	"prefixItems",
	"properties",
	"propertyNames",
	"required",
	"then",
	"type",
	"unevaluatedItems",
	"unevaluatedProperties",
	"uniqueItems"
];
function isFileSchema(schema) {
	return isObject(schema) && schema.type === "string" && typeof schema.contentMediaType === "string";
}
function isObjectSchema(schema) {
	return isObject(schema) && schema.type === "object";
}
function isAnySchema(schema) {
	if (schema === true) return true;
	if (Object.keys(schema).filter((v) => schema[v] !== void 0).every((k) => !LOGIC_KEYWORDS.includes(k))) return true;
	return false;
}
function isNeverSchema(schema) {
	if (schema === false) return true;
	if (typeof schema === "object" && schema.not !== void 0) {
		if (schema.not === true) return true;
		if (typeof schema.not === "object" && Object.keys(schema.not).length === 0) return true;
	}
	return false;
}
function separateObjectSchema(schema, separatedProperties) {
	if (Object.keys(schema).some((k) => ![
		"type",
		"properties",
		"required",
		"additionalProperties"
	].includes(k) && LOGIC_KEYWORDS.includes(k) && schema[k] !== void 0)) return [{ type: "object" }, schema];
	const matched = { ...schema };
	const rest = { ...schema };
	matched.properties = separatedProperties.reduce((acc, key) => {
		const keySchema = schema.properties?.[key] ?? schema.additionalProperties;
		if (keySchema !== void 0) acc[key] = keySchema;
		return acc;
	}, {});
	if (Object.keys(matched.properties).length === 0) matched.properties = void 0;
	matched.required = schema.required?.filter((key) => separatedProperties.includes(key));
	if (matched.required?.length === 0) matched.required = void 0;
	matched.examples = schema.examples?.map((example) => {
		if (!isObject(example)) return example;
		return Object.entries(example).reduce((acc, [key, value]) => {
			if (separatedProperties.includes(key)) acc[key] = value;
			return acc;
		}, {});
	});
	rest.properties = schema.properties && Object.entries(schema.properties).filter(([key]) => !separatedProperties.includes(key)).reduce((acc = {}, [key, value]) => {
		acc[key] = value;
		return acc;
	}, void 0);
	rest.required = schema.required?.filter((key) => !separatedProperties.includes(key));
	if (rest.required?.length === 0) rest.required = void 0;
	rest.examples = schema.examples?.map((example) => {
		if (!isObject(example)) return example;
		return Object.entries(example).reduce((acc, [key, value]) => {
			if (!separatedProperties.includes(key)) acc[key] = value;
			return acc;
		}, {});
	});
	return [matched, rest];
}
function filterSchemaBranches(schema, check, matches = []) {
	if (check(schema)) {
		matches.push(schema);
		return [matches, void 0];
	}
	if (isObject(schema)) {
		for (const keyword of ["anyOf", "oneOf"]) if (schema[keyword] && Object.keys(schema).every((k) => k === keyword || !LOGIC_KEYWORDS.includes(k))) {
			const rest = schema[keyword].map((s) => filterSchemaBranches(s, check, matches)[1]).filter((v) => !!v);
			if (rest.length === 1 && typeof rest[0] === "object") return [matches, {
				...schema,
				[keyword]: void 0,
				...rest[0]
			}];
			return [matches, {
				...schema,
				[keyword]: rest
			}];
		}
	}
	return [matches, schema];
}
function applySchemaOptionality(required, schema) {
	if (required) return schema;
	return { anyOf: [schema, { not: {} }] };
}
function expandUnionSchema(schema) {
	if (typeof schema === "object") {
		for (const keyword of ["anyOf", "oneOf"]) if (schema[keyword] && Object.keys(schema).every((k) => k === keyword || !LOGIC_KEYWORDS.includes(k))) return schema[keyword].flatMap((s) => expandUnionSchema(s));
	}
	return [schema];
}
function expandArrayableSchema(schema) {
	const schemas = expandUnionSchema(schema);
	if (schemas.length !== 2) return;
	const arraySchema = schemas.find((s) => typeof s === "object" && s.type === "array" && Object.keys(s).filter((k) => LOGIC_KEYWORDS.includes(k)).every((k) => k === "type" || k === "items"));
	if (arraySchema === void 0) return;
	const items1 = arraySchema.items;
	const items2 = schemas.find((s) => s !== arraySchema);
	if (stringifyJSON(items1) !== stringifyJSON(items2)) return;
	return [items2, arraySchema];
}
var PRIMITIVE_SCHEMA_TYPES = /* @__PURE__ */ new Set([
	TypeName.String,
	TypeName.Number,
	TypeName.Integer,
	TypeName.Boolean,
	TypeName.Null
]);
function isPrimitiveSchema(schema) {
	return expandUnionSchema(schema).every((s) => {
		if (typeof s === "boolean") return false;
		if (typeof s.type === "string" && PRIMITIVE_SCHEMA_TYPES.has(s.type)) return true;
		if (s.const !== void 0) return true;
		return false;
	});
}
function toOpenAPIPath(path) {
	return standardizeHTTPPath(path).replace(/\/\{\+([^}]+)\}/g, "/{$1}");
}
function toOpenAPIMethod(method) {
	return method.toLocaleLowerCase();
}
function toOpenAPIContent(schema) {
	const content = {};
	const [matches, restSchema] = filterSchemaBranches(schema, isFileSchema);
	for (const file of matches) content[file.contentMediaType] = { schema: toOpenAPISchema(file) };
	if (restSchema !== void 0 && !isAnySchema(restSchema) && !isNeverSchema(restSchema)) {
		content["application/json"] = { schema: toOpenAPISchema(restSchema) };
		if (findDeepMatches((v) => isObject(v) && isFileSchema(v), restSchema).values.length > 0) content["multipart/form-data"] = { schema: toOpenAPISchema(restSchema) };
	}
	return content;
}
function toOpenAPIEventIteratorContent([yieldsRequired, yieldsSchema], [returnsRequired, returnsSchema]) {
	return { "text/event-stream": { schema: toOpenAPISchema({ oneOf: [
		{
			type: "object",
			properties: {
				event: { const: "message" },
				data: yieldsSchema,
				id: { type: "string" },
				retry: { type: "number" }
			},
			required: yieldsRequired ? ["event", "data"] : ["event"]
		},
		{
			type: "object",
			properties: {
				event: { const: "done" },
				data: returnsSchema,
				id: { type: "string" },
				retry: { type: "number" }
			},
			required: returnsRequired ? ["event", "data"] : ["event"]
		},
		{
			type: "object",
			properties: {
				event: { const: "error" },
				data: {},
				id: { type: "string" },
				retry: { type: "number" }
			},
			required: ["event"]
		}
	] }) } };
}
function toOpenAPIParameters(schema, parameterIn) {
	const parameters = [];
	for (const key in schema.properties) {
		const keySchema = schema.properties[key];
		let isDeepObjectStyle = true;
		if (parameterIn !== "query") isDeepObjectStyle = false;
		else if (isPrimitiveSchema(keySchema)) isDeepObjectStyle = false;
		else {
			const [item] = expandArrayableSchema(keySchema) ?? [];
			if (item !== void 0 && isPrimitiveSchema(item)) isDeepObjectStyle = false;
		}
		parameters.push({
			name: key,
			in: parameterIn,
			required: schema.required?.includes(key),
			schema: toOpenAPISchema(keySchema),
			style: isDeepObjectStyle ? "deepObject" : void 0,
			explode: isDeepObjectStyle ? true : void 0,
			allowEmptyValue: parameterIn === "query" ? true : void 0,
			allowReserved: parameterIn === "query" ? true : void 0
		});
	}
	return parameters;
}
function checkParamsSchema(schema, params) {
	const properties = Object.keys(schema.properties ?? {});
	const required = schema.required ?? [];
	if (properties.length !== params.length || properties.some((v) => !params.includes(v))) return false;
	if (required.length !== params.length || required.some((v) => !params.includes(v))) return false;
	return true;
}
function toOpenAPISchema(schema) {
	return schema === true ? {} : schema === false ? { not: {} } : schema;
}
var OPENAPI_JSON_SCHEMA_REF_PREFIX = "#/components/schemas/";
function resolveOpenAPIJsonSchemaRef(doc, schema) {
	if (typeof schema !== "object" || !schema.$ref?.startsWith(OPENAPI_JSON_SCHEMA_REF_PREFIX)) return schema;
	const name = schema.$ref.slice(21);
	return doc.components?.schemas?.[name] ?? schema;
}
function simplifyComposedObjectJsonSchemasAndRefs(schema, doc) {
	if (doc) schema = resolveOpenAPIJsonSchemaRef(doc, schema);
	if (typeof schema !== "object" || !schema.anyOf && !schema.oneOf && !schema.allOf) return schema;
	const unionSchemas = [...toArray(schema.anyOf?.map((s) => simplifyComposedObjectJsonSchemasAndRefs(s, doc))), ...toArray(schema.oneOf?.map((s) => simplifyComposedObjectJsonSchemasAndRefs(s, doc)))];
	const objectUnionSchemas = [];
	for (const u of unionSchemas) {
		if (!isObjectSchema(u)) return schema;
		objectUnionSchemas.push(u);
	}
	const mergedUnionPropertyMap = /* @__PURE__ */ new Map();
	for (const u of objectUnionSchemas) if (u.properties) for (const [key, value] of Object.entries(u.properties)) {
		let entry = mergedUnionPropertyMap.get(key);
		if (!entry) {
			entry = {
				required: objectUnionSchemas.every((s) => s.required?.includes(key)),
				schemas: []
			};
			mergedUnionPropertyMap.set(key, entry);
		}
		entry.schemas.push(value);
	}
	const intersectionSchemas = toArray(schema.allOf?.map((s) => simplifyComposedObjectJsonSchemasAndRefs(s, doc)));
	const objectIntersectionSchemas = [];
	for (const u of intersectionSchemas) {
		if (!isObjectSchema(u)) return schema;
		objectIntersectionSchemas.push(u);
	}
	if (isObjectSchema(schema)) objectIntersectionSchemas.push(schema);
	const mergedInteractionPropertyMap = /* @__PURE__ */ new Map();
	for (const u of objectIntersectionSchemas) if (u.properties) for (const [key, value] of Object.entries(u.properties)) {
		let entry = mergedInteractionPropertyMap.get(key);
		if (!entry) {
			entry = {
				required: objectIntersectionSchemas.some((s) => s.required?.includes(key)),
				schemas: []
			};
			mergedInteractionPropertyMap.set(key, entry);
		}
		entry.schemas.push(value);
	}
	const resultObjectSchema = {
		type: "object",
		properties: {},
		required: []
	};
	const keys = /* @__PURE__ */ new Set([...mergedUnionPropertyMap.keys(), ...mergedInteractionPropertyMap.keys()]);
	if (keys.size === 0) return schema;
	const deduplicateSchemas = (schemas) => {
		const seen = /* @__PURE__ */ new Set();
		const result = [];
		for (const schema2 of schemas) {
			const key = stringifyJSON(schema2);
			if (!seen.has(key)) {
				seen.add(key);
				result.push(schema2);
			}
		}
		return result;
	};
	for (const key of keys) {
		const unionEntry = mergedUnionPropertyMap.get(key);
		const intersectionEntry = mergedInteractionPropertyMap.get(key);
		resultObjectSchema.properties[key] = (() => {
			const dedupedUnionSchemas = unionEntry ? deduplicateSchemas(unionEntry.schemas) : [];
			const dedupedIntersectionSchemas = intersectionEntry ? deduplicateSchemas(intersectionEntry.schemas) : [];
			if (!dedupedUnionSchemas.length) return dedupedIntersectionSchemas.length === 1 ? dedupedIntersectionSchemas[0] : { allOf: dedupedIntersectionSchemas };
			if (!dedupedIntersectionSchemas.length) return dedupedUnionSchemas.length === 1 ? dedupedUnionSchemas[0] : { anyOf: dedupedUnionSchemas };
			const allOf = deduplicateSchemas([...dedupedIntersectionSchemas, dedupedUnionSchemas.length === 1 ? dedupedUnionSchemas[0] : { anyOf: dedupedUnionSchemas }]);
			return allOf.length === 1 ? allOf[0] : { allOf };
		})();
		if (unionEntry?.required || intersectionEntry?.required) resultObjectSchema.required.push(key);
	}
	return resultObjectSchema;
}
var CompositeSchemaConverter = class {
	converters;
	constructor(converters) {
		this.converters = converters;
	}
	async convert(schema, options) {
		for (const converter of this.converters) if (await converter.condition(schema, options)) return converter.convert(schema, options);
		return [false, {}];
	}
};
var OpenAPIGeneratorError = class extends Error {};
var OpenAPIGenerator = class {
	serializer;
	converter;
	constructor(options = {}) {
		this.serializer = new StandardOpenAPIJsonSerializer(options);
		this.converter = new CompositeSchemaConverter(toArray(options.schemaConverters));
	}
	/**
	* Generates OpenAPI specifications from oRPC routers/contracts.
	*
	* @see {@link https://orpc.dev/docs/openapi/openapi-specification OpenAPI Specification Docs}
	*/
	async generate(router, { customErrorResponseBodySchema, commonSchemas, filter: baseFilter, exclude, ...baseDoc } = {}) {
		const filter = baseFilter ?? (({ contract, path }) => {
			return !(exclude?.(contract, path) ?? false);
		});
		const doc = {
			...clone(baseDoc),
			info: baseDoc.info ?? {
				title: "API Reference",
				version: "0.0.0"
			},
			openapi: "3.1.1"
		};
		const { baseSchemaConvertOptions, undefinedErrorJsonSchema } = await this.#resolveCommonSchemas(doc, commonSchemas);
		const contracts = [];
		await resolveContractProcedures({
			path: [],
			router
		}, (traverseOptions) => {
			if (!value(filter, traverseOptions)) return;
			contracts.push(traverseOptions);
		});
		const errors = [];
		for (const { contract, path } of contracts) {
			const stringPath = path.join(".");
			try {
				const def = contract["~orpc"];
				const method = toOpenAPIMethod(fallbackContractConfig("defaultMethod", def.route.method));
				const httpPath = toOpenAPIPath(def.route.path ?? toHttpPath(path));
				let operationObjectRef;
				if (def.route.spec !== void 0 && typeof def.route.spec !== "function") operationObjectRef = def.route.spec;
				else {
					operationObjectRef = {
						operationId: def.route.operationId ?? stringPath,
						summary: def.route.summary,
						description: def.route.description,
						deprecated: def.route.deprecated,
						tags: def.route.tags?.map((tag) => tag)
					};
					await this.#request(doc, operationObjectRef, def, baseSchemaConvertOptions);
					await this.#successResponse(doc, operationObjectRef, def, baseSchemaConvertOptions);
					await this.#errorResponse(operationObjectRef, def, baseSchemaConvertOptions, undefinedErrorJsonSchema, customErrorResponseBodySchema);
				}
				if (typeof def.route.spec === "function") operationObjectRef = def.route.spec(operationObjectRef);
				doc.paths ??= {};
				doc.paths[httpPath] ??= {};
				doc.paths[httpPath][method] = applyCustomOpenAPIOperation(operationObjectRef, contract);
			} catch (e) {
				if (!(e instanceof OpenAPIGeneratorError)) throw e;
				errors.push(`[OpenAPIGenerator] Error occurred while generating OpenAPI for procedure at path: ${stringPath}
${e.message}`);
			}
		}
		if (errors.length) throw new OpenAPIGeneratorError(`Some error occurred during OpenAPI generation:

${errors.join("\n\n")}`);
		return this.serializer.serialize(doc)[0];
	}
	async #resolveCommonSchemas(doc, commonSchemas) {
		let undefinedErrorJsonSchema = {
			type: "object",
			properties: {
				defined: { const: false },
				code: { type: "string" },
				status: { type: "number" },
				message: { type: "string" },
				data: {}
			},
			required: [
				"defined",
				"code",
				"status",
				"message"
			]
		};
		const baseSchemaConvertOptions = {};
		if (commonSchemas) {
			baseSchemaConvertOptions.components = [];
			for (const key in commonSchemas) {
				const options = commonSchemas[key];
				if (options.schema === void 0) continue;
				const { schema, strategy = "input" } = options;
				const [required, json] = await this.converter.convert(schema, { strategy });
				const allowedStrategies = [strategy];
				if (strategy === "input") {
					const [outputRequired, outputJson] = await this.converter.convert(schema, { strategy: "output" });
					if (outputRequired === required && stringifyJSON(outputJson) === stringifyJSON(json)) allowedStrategies.push("output");
				} else if (strategy === "output") {
					const [inputRequired, inputJson] = await this.converter.convert(schema, { strategy: "input" });
					if (inputRequired === required && stringifyJSON(inputJson) === stringifyJSON(json)) allowedStrategies.push("input");
				}
				baseSchemaConvertOptions.components.push({
					schema,
					required,
					ref: `#/components/schemas/${key}`,
					allowedStrategies
				});
			}
			doc.components ??= {};
			doc.components.schemas ??= {};
			for (const key in commonSchemas) {
				const options = commonSchemas[key];
				if (options.schema === void 0) {
					if (options.error === "UndefinedError") {
						doc.components.schemas[key] = toOpenAPISchema(undefinedErrorJsonSchema);
						undefinedErrorJsonSchema = { $ref: `#/components/schemas/${key}` };
					}
					continue;
				}
				const { schema, strategy = "input" } = options;
				const [, json] = await this.converter.convert(schema, {
					...baseSchemaConvertOptions,
					strategy,
					minStructureDepthForRef: 1
				});
				doc.components.schemas[key] = toOpenAPISchema(json);
			}
		}
		return {
			baseSchemaConvertOptions,
			undefinedErrorJsonSchema
		};
	}
	async #request(doc, ref, def, baseSchemaConvertOptions) {
		const method = fallbackContractConfig("defaultMethod", def.route.method);
		const details = getEventIteratorSchemaDetails(def.inputSchema);
		if (details) {
			ref.requestBody = {
				required: true,
				content: toOpenAPIEventIteratorContent(await this.converter.convert(details.yields, {
					...baseSchemaConvertOptions,
					strategy: "input"
				}), await this.converter.convert(details.returns, {
					...baseSchemaConvertOptions,
					strategy: "input"
				}))
			};
			return;
		}
		const dynamicParams = getDynamicParams(def.route.path)?.map((v) => v.name);
		const inputStructure = fallbackContractConfig("defaultInputStructure", def.route.inputStructure);
		let [required, schema] = await this.converter.convert(def.inputSchema, {
			...baseSchemaConvertOptions,
			strategy: "input"
		});
		let omitResponseBody = false;
		if (isAnySchema(schema) && !dynamicParams?.length) return;
		if (inputStructure === "detailed" || inputStructure === "compact" && (dynamicParams?.length || method === "GET")) schema = simplifyComposedObjectJsonSchemasAndRefs(schema, doc);
		if (inputStructure === "compact") {
			if (dynamicParams?.length) {
				const error2 = new OpenAPIGeneratorError("When input structure is \"compact\", and path has dynamic params, input schema must be an object with all dynamic params as required.");
				if (!isObjectSchema(schema)) throw error2;
				const [paramsSchema, rest] = separateObjectSchema(schema, dynamicParams);
				schema = rest;
				required = rest.required ? rest.required.length !== 0 : false;
				omitResponseBody = !required && !rest.properties;
				if (!checkParamsSchema(paramsSchema, dynamicParams)) throw error2;
				ref.parameters ??= [];
				ref.parameters.push(...toOpenAPIParameters(paramsSchema, "path"));
			}
			if (method === "GET") {
				if (!isObjectSchema(schema)) throw new OpenAPIGeneratorError("When method is \"GET\", input schema must satisfy: object | any | unknown");
				ref.parameters ??= [];
				ref.parameters.push(...toOpenAPIParameters(schema, "query"));
			} else if (!omitResponseBody) ref.requestBody = {
				required,
				content: toOpenAPIContent(schema)
			};
			return;
		}
		const error = new OpenAPIGeneratorError("When input structure is \"detailed\", input schema must satisfy: { params?: Record<string, unknown>, query?: Record<string, unknown>, headers?: Record<string, unknown>, body?: unknown }");
		if (!isObjectSchema(schema)) throw error;
		const resolvedParamSchema = schema.properties?.params !== void 0 ? simplifyComposedObjectJsonSchemasAndRefs(schema.properties.params, doc) : void 0;
		if (dynamicParams?.length && (resolvedParamSchema === void 0 || !isObjectSchema(resolvedParamSchema) || !checkParamsSchema(resolvedParamSchema, dynamicParams))) throw new OpenAPIGeneratorError("When input structure is \"detailed\" and path has dynamic params, the \"params\" schema must be an object with all dynamic params as required.");
		for (const from of [
			"params",
			"query",
			"headers"
		]) {
			const fromSchema = schema.properties?.[from];
			if (fromSchema !== void 0) {
				const resolvedSchema = simplifyComposedObjectJsonSchemasAndRefs(fromSchema, doc);
				if (!isObjectSchema(resolvedSchema)) throw error;
				const parameterIn = from === "params" ? "path" : from === "headers" ? "header" : "query";
				ref.parameters ??= [];
				ref.parameters.push(...toOpenAPIParameters(resolvedSchema, parameterIn));
			}
		}
		if (schema.properties?.body !== void 0) ref.requestBody = {
			required: schema.required?.includes("body"),
			content: toOpenAPIContent(schema.properties.body)
		};
	}
	async #successResponse(doc, ref, def, baseSchemaConvertOptions) {
		const outputSchema = def.outputSchema;
		const status = fallbackContractConfig("defaultSuccessStatus", def.route.successStatus);
		const description = fallbackContractConfig("defaultSuccessDescription", def.route?.successDescription);
		const eventIteratorSchemaDetails = getEventIteratorSchemaDetails(outputSchema);
		const outputStructure = fallbackContractConfig("defaultOutputStructure", def.route.outputStructure);
		if (eventIteratorSchemaDetails) {
			ref.responses ??= {};
			ref.responses[status] = {
				description,
				content: toOpenAPIEventIteratorContent(await this.converter.convert(eventIteratorSchemaDetails.yields, {
					...baseSchemaConvertOptions,
					strategy: "output"
				}), await this.converter.convert(eventIteratorSchemaDetails.returns, {
					...baseSchemaConvertOptions,
					strategy: "output"
				}))
			};
			return;
		}
		const [required, json] = await this.converter.convert(outputSchema, {
			...baseSchemaConvertOptions,
			strategy: "output",
			minStructureDepthForRef: outputStructure === "detailed" ? 1 : 0
		});
		if (outputStructure === "compact") {
			ref.responses ??= {};
			ref.responses[status] = { description };
			ref.responses[status].content = toOpenAPIContent(applySchemaOptionality(required, json));
			return;
		}
		const handledStatuses = /* @__PURE__ */ new Set();
		for (const item of expandUnionSchema(json)) {
			const error = new OpenAPIGeneratorError(`
        When output structure is "detailed", output schema must satisfy:
        { 
          status?: number, // must be a literal number and in the range of 200-399
          headers?: Record<string, unknown>, 
          body?: unknown 
        }
        
        But got: ${stringifyJSON(item)}
      `);
			const simplifiedItem = simplifyComposedObjectJsonSchemasAndRefs(item, doc);
			if (!isObjectSchema(simplifiedItem)) throw error;
			let schemaStatus;
			let schemaDescription;
			if (simplifiedItem.properties?.status !== void 0) {
				const statusSchema = resolveOpenAPIJsonSchemaRef(doc, simplifiedItem.properties.status);
				if (typeof statusSchema !== "object" || statusSchema.const === void 0 || typeof statusSchema.const !== "number" || !Number.isInteger(statusSchema.const) || isORPCErrorStatus(statusSchema.const)) throw error;
				schemaStatus = statusSchema.const;
				schemaDescription = statusSchema.description;
			}
			const itemStatus = schemaStatus ?? status;
			const itemDescription = schemaDescription ?? description;
			if (handledStatuses.has(itemStatus)) throw new OpenAPIGeneratorError(`
          When output structure is "detailed", each success status must be unique.
          But got status: ${itemStatus} used more than once.
        `);
			handledStatuses.add(itemStatus);
			ref.responses ??= {};
			ref.responses[itemStatus] = { description: itemDescription };
			if (simplifiedItem.properties?.headers !== void 0) {
				const headersSchema = simplifyComposedObjectJsonSchemasAndRefs(simplifiedItem.properties.headers, doc);
				if (!isObjectSchema(headersSchema)) throw error;
				for (const key in headersSchema.properties) {
					const headerSchema = headersSchema.properties[key];
					if (headerSchema !== void 0) {
						ref.responses[itemStatus].headers ??= {};
						ref.responses[itemStatus].headers[key] = {
							schema: toOpenAPISchema(headerSchema),
							required: simplifiedItem.required?.includes("headers") && headersSchema.required?.includes(key)
						};
					}
				}
			}
			if (simplifiedItem.properties?.body !== void 0) ref.responses[itemStatus].content = toOpenAPIContent(applySchemaOptionality(simplifiedItem.required?.includes("body") ?? false, simplifiedItem.properties.body));
		}
	}
	async #errorResponse(ref, def, baseSchemaConvertOptions, undefinedErrorSchema, customErrorResponseBodySchema) {
		const errorMap = def.errorMap;
		const errorResponsesByStatus = {};
		for (const code in errorMap) {
			const config = errorMap[code];
			if (!config) continue;
			const status = fallbackORPCErrorStatus(code, config.status);
			const defaultMessage = fallbackORPCErrorMessage(code, config.message);
			errorResponsesByStatus[status] ??= {
				status,
				definedErrorDefinitions: [],
				errorSchemaVariants: []
			};
			const [dataRequired, dataSchema] = await this.converter.convert(config.data, {
				...baseSchemaConvertOptions,
				strategy: "output"
			});
			errorResponsesByStatus[status].definedErrorDefinitions.push([
				code,
				defaultMessage,
				dataRequired,
				dataSchema
			]);
			errorResponsesByStatus[status].errorSchemaVariants.push({
				type: "object",
				properties: {
					defined: { const: true },
					code: { const: code },
					status: { const: status },
					message: {
						type: "string",
						default: defaultMessage
					},
					data: dataSchema
				},
				required: dataRequired ? [
					"defined",
					"code",
					"status",
					"message",
					"data"
				] : [
					"defined",
					"code",
					"status",
					"message"
				]
			});
		}
		ref.responses ??= {};
		for (const statusString in errorResponsesByStatus) {
			const errorResponse = errorResponsesByStatus[statusString];
			const customBodySchema = value(customErrorResponseBodySchema, errorResponse.definedErrorDefinitions, errorResponse.status);
			ref.responses[statusString] = {
				description: statusString,
				content: toOpenAPIContent(customBodySchema ?? { oneOf: [...errorResponse.errorSchemaVariants, undefinedErrorSchema] })
			};
		}
	}
};
//#endregion
//#region node_modules/.store/@orpc+json-schema@1.15.0_@opentelemetry+api@1.9.1_crossws@0.4.10_ws@8.21.3/node_modules/@orpc/json-schema/dist/index.mjs
var JsonSchemaXNativeType = /* @__PURE__ */ ((JsonSchemaXNativeType2) => {
	JsonSchemaXNativeType2["BigInt"] = "bigint";
	JsonSchemaXNativeType2["RegExp"] = "regexp";
	JsonSchemaXNativeType2["Date"] = "date";
	JsonSchemaXNativeType2["Url"] = "url";
	JsonSchemaXNativeType2["Set"] = "set";
	JsonSchemaXNativeType2["Map"] = "map";
	return JsonSchemaXNativeType2;
})(JsonSchemaXNativeType || {});
var FLEXIBLE_DATE_FORMAT_REGEX = /^[^-]+-[^-]+-[^-]+$/;
var JsonSchemaCoercer = class {
	coerce(schema, value, options = {}) {
		const [, coerced] = this.#coerce(schema, value, options);
		return coerced;
	}
	#coerce(schema, originalValue, options) {
		if (typeof schema === "boolean") return [schema, originalValue];
		if (Array.isArray(schema.type)) return this.#coerce({ anyOf: schema.type.map((type) => ({
			...schema,
			type
		})) }, originalValue, options);
		let coerced = originalValue;
		let satisfied = true;
		if (typeof schema.$ref === "string") {
			const refSchema = options?.components?.[schema.$ref];
			if (refSchema !== void 0) {
				const [subSatisfied, subCoerced] = this.#coerce(refSchema, coerced, options);
				coerced = subCoerced;
				satisfied = subSatisfied;
			}
		}
		const enumValues = schema.const !== void 0 ? [schema.const] : schema.enum;
		if (enumValues !== void 0 && !enumValues.includes(coerced)) {
			if (typeof coerced === "string") {
				const numberValue = this.#stringToNumber(coerced);
				if (enumValues.includes(numberValue)) coerced = numberValue;
				else {
					const booleanValue = this.#stringToBoolean(coerced);
					if (enumValues.includes(booleanValue)) coerced = booleanValue;
					else satisfied = false;
				}
			} else satisfied = false;
		}
		if (typeof schema.type === "string") switch (schema.type) {
			case "null":
				if (coerced !== null) satisfied = false;
				break;
			case "string":
				if (typeof coerced !== "string") satisfied = false;
				break;
			case "number":
				if (typeof coerced === "string") coerced = this.#stringToNumber(coerced);
				if (typeof coerced !== "number") satisfied = false;
				break;
			case "integer":
				if (typeof coerced === "string") coerced = this.#stringToInteger(coerced);
				if (typeof coerced !== "number" || !Number.isInteger(coerced)) satisfied = false;
				break;
			case "boolean":
				if (typeof coerced === "string") coerced = this.#stringToBoolean(coerced);
				if (typeof coerced !== "boolean") satisfied = false;
				break;
			case "array":
				if (Array.isArray(coerced)) {
					const prefixItemSchemas = "prefixItems" in schema ? toArray(schema.prefixItems) : Array.isArray(schema.items) ? schema.items : [];
					const itemSchema = Array.isArray(schema.items) ? schema.additionalItems : schema.items;
					let shouldUseCoercedItems = false;
					const coercedItems = coerced.map((item, i) => {
						const subSchema = prefixItemSchemas[i] ?? itemSchema;
						if (subSchema === void 0) {
							satisfied = false;
							return item;
						}
						const [subSatisfied, subCoerced] = this.#coerce(subSchema, item, options);
						if (!subSatisfied) satisfied = false;
						if (subCoerced !== item) shouldUseCoercedItems = true;
						return subCoerced;
					});
					if (coercedItems.length < prefixItemSchemas.length) satisfied = false;
					if (shouldUseCoercedItems) coerced = coercedItems;
				} else satisfied = false;
				break;
			case "object":
				if (Array.isArray(coerced)) coerced = { ...coerced };
				if (isObject(coerced)) {
					let shouldUseCoercedItems = false;
					const coercedItems = new NullProtoObj();
					const patternProperties = Object.entries(schema.patternProperties ?? {}).map(([key, value]) => [new RegExp(key), value]);
					for (const key in coerced) {
						const value = coerced[key];
						const subSchema = (schema.properties !== void 0 && Object.hasOwn(schema.properties, key) ? schema.properties[key] : void 0) ?? patternProperties.find(([pattern]) => pattern.test(key))?.[1] ?? schema.additionalProperties;
						if (value === void 0 && !schema.required?.includes(key)) coercedItems[key] = value;
						else if (subSchema === void 0) {
							coercedItems[key] = value;
							satisfied = false;
						} else {
							const [subSatisfied, subCoerced] = this.#coerce(subSchema, value, options);
							coercedItems[key] = subCoerced;
							if (!subSatisfied) satisfied = false;
							if (subCoerced !== value) shouldUseCoercedItems = true;
						}
					}
					if (schema.required?.some((key) => !Object.hasOwn(coercedItems, key))) satisfied = false;
					if (shouldUseCoercedItems) coerced = coercedItems;
				} else satisfied = false;
		}
		if ("x-native-type" in schema && typeof schema["x-native-type"] === "string") switch (schema["x-native-type"]) {
			case JsonSchemaXNativeType.Date:
				if (typeof coerced === "string") coerced = this.#stringToDate(coerced);
				if (!(coerced instanceof Date)) satisfied = false;
				break;
			case JsonSchemaXNativeType.BigInt:
				switch (typeof coerced) {
					case "string":
						coerced = this.#stringToBigInt(coerced);
						break;
					case "number": coerced = this.#numberToBigInt(coerced);
				}
				if (typeof coerced !== "bigint") satisfied = false;
				break;
			case JsonSchemaXNativeType.RegExp:
				if (typeof coerced === "string") coerced = this.#stringToRegExp(coerced);
				if (!(coerced instanceof RegExp)) satisfied = false;
				break;
			case JsonSchemaXNativeType.Url:
				if (typeof coerced === "string") coerced = this.#stringToURL(coerced);
				if (!(coerced instanceof URL)) satisfied = false;
				break;
			case JsonSchemaXNativeType.Set:
				if (Array.isArray(coerced)) coerced = this.#arrayToSet(coerced);
				if (!(coerced instanceof Set)) satisfied = false;
				break;
			case JsonSchemaXNativeType.Map:
				if (Array.isArray(coerced)) coerced = this.#arrayToMap(coerced);
				if (!(coerced instanceof Map)) satisfied = false;
		}
		if (schema.allOf) for (const subSchema of schema.allOf) {
			const [subSatisfied, subCoerced] = this.#coerce(subSchema, coerced, options);
			coerced = subCoerced;
			if (!subSatisfied) satisfied = false;
		}
		for (const key of ["anyOf", "oneOf"]) if (schema[key]) {
			let bestOptions;
			for (const subSchema of schema[key]) {
				const [subSatisfied, subCoerced] = this.#coerce(subSchema, coerced, options);
				if (subSatisfied) {
					if (!bestOptions || subCoerced === coerced) bestOptions = {
						coerced: subCoerced,
						satisfied: subSatisfied
					};
					if (subCoerced === coerced) break;
				}
			}
			coerced = bestOptions ? bestOptions.coerced : coerced;
			satisfied = bestOptions ? bestOptions.satisfied : false;
		}
		if (typeof schema.not !== "undefined") {
			const [notSatisfied] = this.#coerce(schema.not, coerced, options);
			if (notSatisfied) satisfied = false;
		}
		return [satisfied, coerced];
	}
	#stringToNumber(value) {
		const num = Number.parseFloat(value);
		if (Number.isNaN(num) || num !== Number(value)) return value;
		return num;
	}
	#stringToInteger(value) {
		const num = Number.parseInt(value);
		if (Number.isNaN(num) || num !== Number(value)) return value;
		return num;
	}
	#stringToBoolean(value) {
		const lower = value.toLowerCase();
		if (lower === "false" || lower === "off") return false;
		if (lower === "true" || lower === "on") return true;
		return value;
	}
	#stringToBigInt(value) {
		return guard(() => BigInt(value)) ?? value;
	}
	#numberToBigInt(value) {
		return guard(() => BigInt(value)) ?? value;
	}
	#stringToDate(value) {
		const date = new Date(value);
		if (Number.isNaN(date.getTime()) || !FLEXIBLE_DATE_FORMAT_REGEX.test(value)) return value;
		return date;
	}
	#stringToRegExp(value) {
		const match = value.match(/^\/(.*)\/([a-z]*)$/);
		if (match) {
			const [, pattern, flags] = match;
			return guard(() => new RegExp(pattern, flags)) ?? value;
		}
		return value;
	}
	#stringToURL(value) {
		return guard(() => new URL(value)) ?? value;
	}
	#arrayToSet(value) {
		const set = new Set(value);
		if (set.size !== value.length) return value;
		return set;
	}
	#arrayToMap(value) {
		if (value.some((item) => !Array.isArray(item) || item.length !== 2)) return value;
		const result = new Map(value);
		if (result.size !== value.length) return value;
		return result;
	}
};
var SmartCoercionPlugin = class {
	converter;
	coercer;
	cache = /* @__PURE__ */ new WeakMap();
	constructor(options = {}) {
		this.converter = new CompositeSchemaConverter(toArray(options.schemaConverters));
		this.coercer = new JsonSchemaCoercer();
	}
	init(options) {
		options.clientInterceptors ??= [];
		options.clientInterceptors.unshift(async (options2) => {
			const inputSchema = options2.procedure["~orpc"].inputSchema;
			if (!inputSchema) return options2.next();
			const coercedInput = await this.#coerce(inputSchema, options2.input);
			return options2.next({
				...options2,
				input: coercedInput
			});
		});
	}
	async #coerce(schema, value) {
		let jsonSchema = this.cache.get(schema);
		if (!jsonSchema) {
			jsonSchema = (await this.converter.convert(schema, { strategy: "input" }))[1];
			this.cache.set(schema, jsonSchema);
		}
		return this.coercer.coerce(jsonSchema, value);
	}
};
//#endregion
export { ContentEncoding, Format, JsonSchemaXNativeType, OpenAPIGenerator, SmartCoercionPlugin, StandardBracketNotationSerializer, StandardOpenAPIJsonSerializer, StandardOpenAPISerializer, createContractedProcedure, createProcedureClient, createRouterClient, getLazyMeta, getRouter, isProcedure, os, standardizeHTTPPath, traverseContractProcedures, unlazy };
