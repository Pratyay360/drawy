if (typeof globalThis.requestAnimationFrame === "undefined") globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
if (typeof globalThis.cancelAnimationFrame === "undefined") globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
try {
	var requestAnimationFrame = globalThis.requestAnimationFrame;
	globalThis.cancelAnimationFrame;
} catch (e) {}
import { __commonJSMin, __exportAll, __toESM } from "../../_runtime.mjs";
//#region ../../.cache/nub/pm/store/react@19.2.8-644ed9d17122ef6d/node_modules/react/cjs/react.production.js
/**
* @license React
* react.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_react_production = /* @__PURE__ */ __commonJSMin(((exports) => {
	var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element");
	var REACT_PORTAL_TYPE = Symbol.for("react.portal");
	var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
	var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
	var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
	var REACT_CONSUMER_TYPE = Symbol.for("react.consumer");
	var REACT_CONTEXT_TYPE = Symbol.for("react.context");
	var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
	var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
	var REACT_MEMO_TYPE = Symbol.for("react.memo");
	var REACT_LAZY_TYPE = Symbol.for("react.lazy");
	var REACT_ACTIVITY_TYPE = Symbol.for("react.activity");
	var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
	function getIteratorFn(maybeIterable) {
		if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
		maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
		return "function" === typeof maybeIterable ? maybeIterable : null;
	}
	var ReactNoopUpdateQueue = {
		isMounted: function() {
			return !1;
		},
		enqueueForceUpdate: function() {},
		enqueueReplaceState: function() {},
		enqueueSetState: function() {}
	};
	var assign = Object.assign;
	var emptyObject = {};
	function Component(props, context, updater) {
		this.props = props;
		this.context = context;
		this.refs = emptyObject;
		this.updater = updater || ReactNoopUpdateQueue;
	}
	Component.prototype.isReactComponent = {};
	Component.prototype.setState = function(partialState, callback) {
		if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
		this.updater.enqueueSetState(this, partialState, callback, "setState");
	};
	Component.prototype.forceUpdate = function(callback) {
		this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
	};
	function ComponentDummy() {}
	ComponentDummy.prototype = Component.prototype;
	function PureComponent(props, context, updater) {
		this.props = props;
		this.context = context;
		this.refs = emptyObject;
		this.updater = updater || ReactNoopUpdateQueue;
	}
	var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
	pureComponentPrototype.constructor = PureComponent;
	assign(pureComponentPrototype, Component.prototype);
	pureComponentPrototype.isPureReactComponent = !0;
	var isArrayImpl = Array.isArray;
	function noop() {}
	var ReactSharedInternals = {
		H: null,
		A: null,
		T: null,
		S: null
	};
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	function ReactElement(type, key, props) {
		var refProp = props.ref;
		return {
			$$typeof: REACT_ELEMENT_TYPE,
			type,
			key,
			ref: void 0 !== refProp ? refProp : null,
			props
		};
	}
	function cloneAndReplaceKey(oldElement, newKey) {
		return ReactElement(oldElement.type, newKey, oldElement.props);
	}
	function isValidElement(object) {
		return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
	}
	function escape(key) {
		var escaperLookup = {
			"=": "=0",
			":": "=2"
		};
		return "$" + key.replace(/[=:]/g, function(match) {
			return escaperLookup[match];
		});
	}
	var userProvidedKeyEscapeRegex = /\/+/g;
	function getElementKey(element, index) {
		return "object" === typeof element && null !== element && null != element.key ? escape("" + element.key) : index.toString(36);
	}
	function resolveThenable(thenable) {
		switch (thenable.status) {
			case "fulfilled": return thenable.value;
			case "rejected": throw thenable.reason;
			default: switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(function(fulfilledValue) {
				"pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
			}, function(error) {
				"pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
			})), thenable.status) {
				case "fulfilled": return thenable.value;
				case "rejected": throw thenable.reason;
			}
		}
		throw thenable;
	}
	function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
		var type = typeof children;
		if ("undefined" === type || "boolean" === type) children = null;
		var invokeCallback = !1;
		if (null === children) invokeCallback = !0;
		else switch (type) {
			case "bigint":
			case "string":
			case "number":
				invokeCallback = !0;
				break;
			case "object": switch (children.$$typeof) {
				case REACT_ELEMENT_TYPE:
				case REACT_PORTAL_TYPE:
					invokeCallback = !0;
					break;
				case REACT_LAZY_TYPE: return invokeCallback = children._init, mapIntoArray(invokeCallback(children._payload), array, escapedPrefix, nameSoFar, callback);
			}
		}
		if (invokeCallback) return callback = callback(children), invokeCallback = "" === nameSoFar ? "." + getElementKey(children, 0) : nameSoFar, isArrayImpl(callback) ? (escapedPrefix = "", null != invokeCallback && (escapedPrefix = invokeCallback.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
			return c;
		})) : null != callback && (isValidElement(callback) && (callback = cloneAndReplaceKey(callback, escapedPrefix + (null == callback.key || children && children.key === callback.key ? "" : ("" + callback.key).replace(userProvidedKeyEscapeRegex, "$&/") + "/") + invokeCallback)), array.push(callback)), 1;
		invokeCallback = 0;
		var nextNamePrefix = "" === nameSoFar ? "." : nameSoFar + ":";
		if (isArrayImpl(children)) for (var i = 0; i < children.length; i++) nameSoFar = children[i], type = nextNamePrefix + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(nameSoFar, array, escapedPrefix, type, callback);
		else if (i = getIteratorFn(children), "function" === typeof i) for (children = i.call(children), i = 0; !(nameSoFar = children.next()).done;) nameSoFar = nameSoFar.value, type = nextNamePrefix + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(nameSoFar, array, escapedPrefix, type, callback);
		else if ("object" === type) {
			if ("function" === typeof children.then) return mapIntoArray(resolveThenable(children), array, escapedPrefix, nameSoFar, callback);
			array = String(children);
			throw Error("Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead.");
		}
		return invokeCallback;
	}
	function mapChildren(children, func, context) {
		if (null == children) return children;
		var result = [], count = 0;
		mapIntoArray(children, result, "", "", function(child) {
			return func.call(context, child, count++);
		});
		return result;
	}
	function lazyInitializer(payload) {
		if (-1 === payload._status) {
			var ctor = payload._result;
			ctor = ctor();
			ctor.then(function(moduleObject) {
				if (0 === payload._status || -1 === payload._status) payload._status = 1, payload._result = moduleObject;
			}, function(error) {
				if (0 === payload._status || -1 === payload._status) payload._status = 2, payload._result = error;
			});
			-1 === payload._status && (payload._status = 0, payload._result = ctor);
		}
		if (1 === payload._status) return payload._result.default;
		throw payload._result;
	}
	var reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
		if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
			var event = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
				error
			});
			if (!window.dispatchEvent(event)) return;
		} else if ("object" === typeof process && "function" === typeof process.emit) {
			process.emit("uncaughtException", error);
			return;
		}
		console.error(error);
	};
	var Children = {
		map: mapChildren,
		forEach: function(children, forEachFunc, forEachContext) {
			mapChildren(children, function() {
				forEachFunc.apply(this, arguments);
			}, forEachContext);
		},
		count: function(children) {
			var n = 0;
			mapChildren(children, function() {
				n++;
			});
			return n;
		},
		toArray: function(children) {
			return mapChildren(children, function(child) {
				return child;
			}) || [];
		},
		only: function(children) {
			if (!isValidElement(children)) throw Error("React.Children.only expected to receive a single React element child.");
			return children;
		}
	};
	exports.Activity = REACT_ACTIVITY_TYPE;
	exports.Children = Children;
	exports.Component = Component;
	exports.Fragment = REACT_FRAGMENT_TYPE;
	exports.Profiler = REACT_PROFILER_TYPE;
	exports.PureComponent = PureComponent;
	exports.StrictMode = REACT_STRICT_MODE_TYPE;
	exports.Suspense = REACT_SUSPENSE_TYPE;
	exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
	exports.__COMPILER_RUNTIME = {
		__proto__: null,
		c: function(size) {
			return ReactSharedInternals.H.useMemoCache(size);
		}
	};
	exports.cache = function(fn) {
		return function() {
			return fn.apply(null, arguments);
		};
	};
	exports.cacheSignal = function() {
		return null;
	};
	exports.cloneElement = function(element, config, children) {
		if (null === element || void 0 === element) throw Error("The argument must be a React element, but you passed " + element + ".");
		var props = assign({}, element.props), key = element.key;
		if (null != config) for (propName in void 0 !== config.key && (key = "" + config.key), config) !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
		var propName = arguments.length - 2;
		if (1 === propName) props.children = children;
		else if (1 < propName) {
			for (var childArray = Array(propName), i = 0; i < propName; i++) childArray[i] = arguments[i + 2];
			props.children = childArray;
		}
		return ReactElement(element.type, key, props);
	};
	exports.createContext = function(defaultValue) {
		defaultValue = {
			$$typeof: REACT_CONTEXT_TYPE,
			_currentValue: defaultValue,
			_currentValue2: defaultValue,
			_threadCount: 0,
			Provider: null,
			Consumer: null
		};
		defaultValue.Provider = defaultValue;
		defaultValue.Consumer = {
			$$typeof: REACT_CONSUMER_TYPE,
			_context: defaultValue
		};
		return defaultValue;
	};
	exports.createElement = function(type, config, children) {
		var propName, props = {}, key = null;
		if (null != config) for (propName in void 0 !== config.key && (key = "" + config.key), config) hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (props[propName] = config[propName]);
		var childrenLength = arguments.length - 2;
		if (1 === childrenLength) props.children = children;
		else if (1 < childrenLength) {
			for (var childArray = Array(childrenLength), i = 0; i < childrenLength; i++) childArray[i] = arguments[i + 2];
			props.children = childArray;
		}
		if (type && type.defaultProps) for (propName in childrenLength = type.defaultProps, childrenLength) void 0 === props[propName] && (props[propName] = childrenLength[propName]);
		return ReactElement(type, key, props);
	};
	exports.createRef = function() {
		return { current: null };
	};
	exports.forwardRef = function(render) {
		return {
			$$typeof: REACT_FORWARD_REF_TYPE,
			render
		};
	};
	exports.isValidElement = isValidElement;
	exports.lazy = function(ctor) {
		return {
			$$typeof: REACT_LAZY_TYPE,
			_payload: {
				_status: -1,
				_result: ctor
			},
			_init: lazyInitializer
		};
	};
	exports.memo = function(type, compare) {
		return {
			$$typeof: REACT_MEMO_TYPE,
			type,
			compare: void 0 === compare ? null : compare
		};
	};
	exports.startTransition = function(scope) {
		var prevTransition = ReactSharedInternals.T, currentTransition = {};
		ReactSharedInternals.T = currentTransition;
		try {
			var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
			null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
			"object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && returnValue.then(noop, reportGlobalError);
		} catch (error) {
			reportGlobalError(error);
		} finally {
			null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
		}
	};
	exports.unstable_useCacheRefresh = function() {
		return ReactSharedInternals.H.useCacheRefresh();
	};
	exports.use = function(usable) {
		return ReactSharedInternals.H.use(usable);
	};
	exports.useActionState = function(action, initialState, permalink) {
		return ReactSharedInternals.H.useActionState(action, initialState, permalink);
	};
	exports.useCallback = function(callback, deps) {
		return ReactSharedInternals.H.useCallback(callback, deps);
	};
	exports.useContext = function(Context) {
		return ReactSharedInternals.H.useContext(Context);
	};
	exports.useDebugValue = function() {};
	exports.useDeferredValue = function(value, initialValue) {
		return ReactSharedInternals.H.useDeferredValue(value, initialValue);
	};
	exports.useEffect = function(create, deps) {
		return ReactSharedInternals.H.useEffect(create, deps);
	};
	exports.useEffectEvent = function(callback) {
		return ReactSharedInternals.H.useEffectEvent(callback);
	};
	exports.useId = function() {
		return ReactSharedInternals.H.useId();
	};
	exports.useImperativeHandle = function(ref, create, deps) {
		return ReactSharedInternals.H.useImperativeHandle(ref, create, deps);
	};
	exports.useInsertionEffect = function(create, deps) {
		return ReactSharedInternals.H.useInsertionEffect(create, deps);
	};
	exports.useLayoutEffect = function(create, deps) {
		return ReactSharedInternals.H.useLayoutEffect(create, deps);
	};
	exports.useMemo = function(create, deps) {
		return ReactSharedInternals.H.useMemo(create, deps);
	};
	exports.useOptimistic = function(passthrough, reducer) {
		return ReactSharedInternals.H.useOptimistic(passthrough, reducer);
	};
	exports.useReducer = function(reducer, initialArg, init) {
		return ReactSharedInternals.H.useReducer(reducer, initialArg, init);
	};
	exports.useRef = function(initialValue) {
		return ReactSharedInternals.H.useRef(initialValue);
	};
	exports.useState = function(initialState) {
		return ReactSharedInternals.H.useState(initialState);
	};
	exports.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
		return ReactSharedInternals.H.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
	};
	exports.useTransition = function() {
		return ReactSharedInternals.H.useTransition();
	};
	exports.version = "19.2.8";
}));
//#endregion
//#region ../../.cache/nub/pm/store/react@19.2.8-644ed9d17122ef6d/node_modules/react/index.js
var require_react = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_react_production();
}));
//#endregion
//#region ../../.cache/nub/pm/store/react@19.2.8-644ed9d17122ef6d/node_modules/react/cjs/react-jsx-runtime.production.js
/**
* @license React
* react-jsx-runtime.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_react_jsx_runtime_production = /* @__PURE__ */ __commonJSMin(((exports) => {
	var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element");
	var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
	function jsxProd(type, config, maybeKey) {
		var key = null;
		void 0 !== maybeKey && (key = "" + maybeKey);
		void 0 !== config.key && (key = "" + config.key);
		if ("key" in config) {
			maybeKey = {};
			for (var propName in config) "key" !== propName && (maybeKey[propName] = config[propName]);
		} else maybeKey = config;
		config = maybeKey.ref;
		return {
			$$typeof: REACT_ELEMENT_TYPE,
			type,
			key,
			ref: void 0 !== config ? config : null,
			props: maybeKey
		};
	}
	exports.Fragment = REACT_FRAGMENT_TYPE;
	exports.jsx = jsxProd;
	exports.jsxs = jsxProd;
}));
//#endregion
//#region ../../.cache/nub/pm/store/react@19.2.8-644ed9d17122ef6d/node_modules/react/jsx-runtime.js
var require_jsx_runtime = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_react_jsx_runtime_production();
}));
//#endregion
//#region ../../.cache/nub/pm/store/react-dom@19.2.8_react@19.2.8_-09b53dab9dd8e616/node_modules/react-dom/cjs/react-dom.production.js
/**
* @license React
* react-dom.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_react_dom_production = /* @__PURE__ */ __commonJSMin(((exports) => {
	var React = require_react();
	function formatProdErrorMessage(code) {
		var url = "https://react.dev/errors/" + code;
		if (1 < arguments.length) {
			url += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var i = 2; i < arguments.length; i++) url += "&args[]=" + encodeURIComponent(arguments[i]);
		}
		return "Minified React error #" + code + "; visit " + url + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function noop() {}
	var Internals = {
		d: {
			f: noop,
			r: function() {
				throw Error(formatProdErrorMessage(522));
			},
			D: noop,
			C: noop,
			L: noop,
			m: noop,
			X: noop,
			S: noop,
			M: noop
		},
		p: 0,
		findDOMNode: null
	};
	var REACT_PORTAL_TYPE = Symbol.for("react.portal");
	function createPortal$1(children, containerInfo, implementation) {
		var key = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
		return {
			$$typeof: REACT_PORTAL_TYPE,
			key: null == key ? null : "" + key,
			children,
			containerInfo,
			implementation
		};
	}
	var ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
	function getCrossOriginStringAs(as, input) {
		if ("font" === as) return "";
		if ("string" === typeof input) return "use-credentials" === input ? input : "";
	}
	exports.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Internals;
	exports.createPortal = function(children, container) {
		var key = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
		if (!container || 1 !== container.nodeType && 9 !== container.nodeType && 11 !== container.nodeType) throw Error(formatProdErrorMessage(299));
		return createPortal$1(children, container, null, key);
	};
	exports.flushSync = function(fn) {
		var previousTransition = ReactSharedInternals.T, previousUpdatePriority = Internals.p;
		try {
			if (ReactSharedInternals.T = null, Internals.p = 2, fn) return fn();
		} finally {
			ReactSharedInternals.T = previousTransition, Internals.p = previousUpdatePriority, Internals.d.f();
		}
	};
	exports.preconnect = function(href, options) {
		"string" === typeof href && (options ? (options = options.crossOrigin, options = "string" === typeof options ? "use-credentials" === options ? options : "" : void 0) : options = null, Internals.d.C(href, options));
	};
	exports.prefetchDNS = function(href) {
		"string" === typeof href && Internals.d.D(href);
	};
	exports.preinit = function(href, options) {
		if ("string" === typeof href && options && "string" === typeof options.as) {
			var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin), integrity = "string" === typeof options.integrity ? options.integrity : void 0, fetchPriority = "string" === typeof options.fetchPriority ? options.fetchPriority : void 0;
			"style" === as ? Internals.d.S(href, "string" === typeof options.precedence ? options.precedence : void 0, {
				crossOrigin,
				integrity,
				fetchPriority
			}) : "script" === as && Internals.d.X(href, {
				crossOrigin,
				integrity,
				fetchPriority,
				nonce: "string" === typeof options.nonce ? options.nonce : void 0
			});
		}
	};
	exports.preinitModule = function(href, options) {
		if ("string" === typeof href) if ("object" === typeof options && null !== options) {
			if (null == options.as || "script" === options.as) {
				var crossOrigin = getCrossOriginStringAs(options.as, options.crossOrigin);
				Internals.d.M(href, {
					crossOrigin,
					integrity: "string" === typeof options.integrity ? options.integrity : void 0,
					nonce: "string" === typeof options.nonce ? options.nonce : void 0
				});
			}
		} else options ?? Internals.d.M(href);
	};
	exports.preload = function(href, options) {
		if ("string" === typeof href && "object" === typeof options && null !== options && "string" === typeof options.as) {
			var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin);
			Internals.d.L(href, as, {
				crossOrigin,
				integrity: "string" === typeof options.integrity ? options.integrity : void 0,
				nonce: "string" === typeof options.nonce ? options.nonce : void 0,
				type: "string" === typeof options.type ? options.type : void 0,
				fetchPriority: "string" === typeof options.fetchPriority ? options.fetchPriority : void 0,
				referrerPolicy: "string" === typeof options.referrerPolicy ? options.referrerPolicy : void 0,
				imageSrcSet: "string" === typeof options.imageSrcSet ? options.imageSrcSet : void 0,
				imageSizes: "string" === typeof options.imageSizes ? options.imageSizes : void 0,
				media: "string" === typeof options.media ? options.media : void 0
			});
		}
	};
	exports.preloadModule = function(href, options) {
		if ("string" === typeof href) if (options) {
			var crossOrigin = getCrossOriginStringAs(options.as, options.crossOrigin);
			Internals.d.m(href, {
				as: "string" === typeof options.as && "script" !== options.as ? options.as : void 0,
				crossOrigin,
				integrity: "string" === typeof options.integrity ? options.integrity : void 0
			});
		} else Internals.d.m(href);
	};
	exports.requestFormReset = function(form) {
		Internals.d.r(form);
	};
	exports.unstable_batchedUpdates = function(fn, a) {
		return fn(a);
	};
	exports.useFormState = function(action, initialState, permalink) {
		return ReactSharedInternals.H.useFormState(action, initialState, permalink);
	};
	exports.useFormStatus = function() {
		return ReactSharedInternals.H.useHostTransitionStatus();
	};
	exports.version = "19.2.8";
}));
//#endregion
//#region ../../.cache/nub/pm/store/react-dom@19.2.8_react@19.2.8_-09b53dab9dd8e616/node_modules/react-dom/index.js
var require_react_dom = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function checkDCE() {
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") return;
		try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
		} catch (err) {
			console.error(err);
		}
	}
	checkDCE();
	module.exports = require_react_dom_production();
}));
//#endregion
//#region node_modules/@astryxdesign/core/dist/hooks/useIsomorphicLayoutEffect.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var useIsomorphicLayoutEffect = typeof window !== "undefined" ? import_react.useLayoutEffect : import_react.useEffect;
//#endregion
//#region ../../.cache/nub/pm/store/@stylexjs+stylex@0.19.0-ceed69a649160ca4/node_modules/@stylexjs/stylex/lib/es/stylex.mjs
var styleq = {};
var hasRequiredStyleq;
function requireStyleq() {
	if (hasRequiredStyleq) return styleq;
	hasRequiredStyleq = 1;
	Object.defineProperty(styleq, "__esModule", { value: true });
	styleq.styleq = void 0;
	var cache = /* @__PURE__ */ new WeakMap();
	var compiledKey = "$$css";
	function createStyleq(options) {
		var disableCache;
		var disableMix;
		var transform;
		if (options != null) {
			disableCache = options.disableCache === true;
			disableMix = options.disableMix === true;
			transform = options.transform;
		}
		return function styleq() {
			var definedProperties = [];
			var className = "";
			var inlineStyle = null;
			var debugString = "";
			var nextCache = disableCache ? null : cache;
			var styles = new Array(arguments.length);
			for (var i = 0; i < arguments.length; i++) styles[i] = arguments[i];
			while (styles.length > 0) {
				var possibleStyle = styles.pop();
				if (possibleStyle == null || possibleStyle === false) continue;
				if (Array.isArray(possibleStyle)) {
					for (var _i = 0; _i < possibleStyle.length; _i++) styles.push(possibleStyle[_i]);
					continue;
				}
				var style = transform != null ? transform(possibleStyle) : possibleStyle;
				if (style.$$css != null) {
					var classNameChunk = "";
					if (nextCache != null && nextCache.has(style)) {
						var cacheEntry = nextCache.get(style);
						if (cacheEntry != null) {
							classNameChunk = cacheEntry[0];
							debugString = cacheEntry[2];
							definedProperties.push.apply(definedProperties, cacheEntry[1]);
							nextCache = cacheEntry[3];
						}
					} else {
						var definedPropertiesChunk = [];
						for (var prop in style) {
							var value = style[prop];
							if (prop === compiledKey) {
								var compiledKeyValue = style[prop];
								if (compiledKeyValue !== true) debugString = debugString ? compiledKeyValue + "; " + debugString : compiledKeyValue;
								continue;
							}
							if (typeof value === "string" || value === null) {
								if (!definedProperties.includes(prop)) {
									definedProperties.push(prop);
									if (nextCache != null) definedPropertiesChunk.push(prop);
									if (typeof value === "string") classNameChunk += classNameChunk ? " " + value : value;
								}
							} else console.error("styleq: ".concat(prop, " typeof ").concat(String(value), " is not \"string\" or \"null\"."));
						}
						if (nextCache != null) {
							var weakMap = /* @__PURE__ */ new WeakMap();
							nextCache.set(style, [
								classNameChunk,
								definedPropertiesChunk,
								debugString,
								weakMap
							]);
							nextCache = weakMap;
						}
					}
					if (classNameChunk) className = className ? classNameChunk + " " + className : classNameChunk;
				} else if (disableMix) {
					if (inlineStyle == null) inlineStyle = {};
					inlineStyle = Object.assign({}, style, inlineStyle);
				} else {
					var subStyle = null;
					for (var _prop in style) {
						var _value = style[_prop];
						if (_value !== void 0) {
							if (!definedProperties.includes(_prop)) {
								if (_value != null) {
									if (inlineStyle == null) inlineStyle = {};
									if (subStyle == null) subStyle = {};
									subStyle[_prop] = _value;
								}
								definedProperties.push(_prop);
								nextCache = null;
							}
						}
					}
					if (subStyle != null) inlineStyle = Object.assign(subStyle, inlineStyle);
				}
			}
			return [
				className,
				inlineStyle,
				debugString
			];
		};
	}
	var styleq$1 = styleq.styleq = createStyleq();
	styleq$1.factory = createStyleq;
	return styleq;
}
var styleqExports = /*@__PURE__*/ requireStyleq();
function props(...styles) {
	const [className, style, dataStyleSrc] = styleqExports.styleq(styles);
	const result = {};
	if (className != null && className !== "") result.className = className;
	if (style != null && Object.keys(style).length > 0) result.style = style;
	if (dataStyleSrc != null && dataStyleSrc !== "") result["data-style-src"] = dataStyleSrc;
	return result;
}
Object.freeze({});
//#endregion
//#region node_modules/@astryxdesign/core/dist/theme/tokens.stylex.js
var colorDefaults = {
	"--color-accent": "light-dark(#0064E0, #2694FE)",
	"--color-accent-muted": "light-dark(#0082FB33, #0082FB3F)",
	"--color-on-accent": "light-dark(#FFFFFF, #FFFFFF)",
	"--color-neutral": "light-dark(rgba(5, 54, 89, 0.1), rgba(223, 226, 229, 0.2))",
	"--color-background-surface": "light-dark(#FFFFFF, #1F1F22)",
	"--color-background-body": "light-dark(#F1F4F7, #111112)",
	"--color-overlay": "light-dark(#01122866, #11111299)",
	"--color-overlay-hover": "light-dark(#0536590C, #FFFFFF0C)",
	"--color-overlay-pressed": "light-dark(#05365919, #FFFFFF19)",
	"--color-background-muted": "light-dark(#0536590C, #1111127F)",
	"--color-text-primary": "light-dark(#0A1317, #DFE2E5)",
	"--color-text-secondary": "light-dark(#4E606F, #AAAFB5)",
	"--color-text-disabled": "light-dark(#A4B0BC, #6F747C)",
	"--color-text-accent": "light-dark(#0064E0, #3E9EFB)",
	"--color-on-dark": "light-dark(#FFFFFF, #FFFFFF)",
	"--color-on-light": "light-dark(#000000, #000000)",
	"--color-icon-accent": "light-dark(#0064E0, #2694FE)",
	"--color-icon-primary": "light-dark(#0A1317, #DFE2E5)",
	"--color-icon-secondary": "light-dark(#4E606F, #AAAFB5)",
	"--color-icon-disabled": "light-dark(#A4B0BC, #6F747C)",
	"--color-background-card": "light-dark(#FFFFFF, #1F1F22)",
	"--color-background-popover": "light-dark(#FFFFFF, #28292C)",
	"--color-background-inverted": "light-dark(#0A1317, #FFFFFF)",
	"--color-background-error-inverted": "light-dark(#AA071E, #E3193B)",
	"--color-success": "light-dark(#0D8626, #0D8626)",
	"--color-success-muted": "light-dark(#0B991F33, #0B991F3F)",
	"--color-on-success": "light-dark(#FFFFFF, #FFFFFF)",
	"--color-error": "light-dark(#E3193B, #F5394F)",
	"--color-error-muted": "light-dark(#E3193B33, #F5394F3F)",
	"--color-on-error": "light-dark(#FFFFFF, #FFFFFF)",
	"--color-warning": "light-dark(#E9AF08, #F2C00B)",
	"--color-warning-muted": "light-dark(#E2A40033, #E2A4003F)",
	"--color-on-warning": "light-dark(#0A1317, #0A1317)",
	"--color-border": "light-dark(#05365919, #F2F4F619)",
	"--color-border-emphasized": "light-dark(#CCD3DB, #494D53)",
	"--color-skeleton": "light-dark(#CCD3DB, #5A5E66)",
	"--color-track": "light-dark(#CCD3DB, #5A5E66)",
	"--color-shadow": "light-dark(rgba(5, 54, 89, 0.1), rgba(0, 0, 0, 0.3))",
	"--color-tint-hover": "light-dark(black, white)",
	"--color-background-blue": "light-dark(#0171E333, #0171E333)",
	"--color-border-blue": "light-dark(#0064E0, #2694FE)",
	"--color-icon-blue": "light-dark(#0064E0, #2694FE)",
	"--color-text-blue": "light-dark(#042F97, #AFD7FF)",
	"--color-background-cyan": "light-dark(#03A7D733, #03A7D733)",
	"--color-border-cyan": "light-dark(#089DD0, #0171A4)",
	"--color-icon-cyan": "light-dark(#00ACC1, #26C6DA)",
	"--color-text-cyan": "light-dark(#014975, #A1EEF9)",
	"--color-background-gray": "light-dark(#0A131733, #666A724C)",
	"--color-border-gray": "light-dark(#647685, #748695)",
	"--color-icon-gray": "light-dark(#4E606F, #AAAFB5)",
	"--color-text-gray": "light-dark(#0A1317, #E7EAED)",
	"--color-background-green": "light-dark(#24BB5E33, #24BB5E33)",
	"--color-border-green": "light-dark(#0D8626, #0B991F)",
	"--color-icon-green": "light-dark(#0D8626, #26A756)",
	"--color-text-green": "light-dark(#09441F, #A5F690)",
	"--color-background-orange": "light-dark(#F2790233, #F2790233)",
	"--color-border-orange": "light-dark(#EB6E00, #B34A01)",
	"--color-icon-orange": "light-dark(#E9690B, #FB8C00)",
	"--color-text-orange": "light-dark(#6B2203, #FDB876)",
	"--color-background-pink": "light-dark(#E638B333, #E638B333)",
	"--color-border-pink": "light-dark(#F351C0, #C02294)",
	"--color-icon-pink": "light-dark(#C2185B, #EC407A)",
	"--color-text-pink": "light-dark(#650053, #FEADE3)",
	"--color-background-purple": "light-dark(#7952FF33, #7952FF33)",
	"--color-border-purple": "light-dark(#9081FF, #7340FE)",
	"--color-icon-purple": "light-dark(#5B08D8, #7952FF)",
	"--color-text-purple": "light-dark(#3E0697, #B3B0FE)",
	"--color-background-red": "light-dark(#E3193B33, #E3193B33)",
	"--color-border-red": "light-dark(#E3193B, #F5394F)",
	"--color-icon-red": "light-dark(#D31130, #E3193B)",
	"--color-text-red": "light-dark(#7B0210, #FFB2B8)",
	"--color-background-teal": "light-dark(#0DB7AF33, #0DB7AF33)",
	"--color-border-teal": "light-dark(#08A3A3, #08767D)",
	"--color-icon-teal": "light-dark(#009688, #26A69A)",
	"--color-text-teal": "light-dark(#083943, #40DCCD)",
	"--color-background-yellow": "light-dark(#E2A40033, #E2A40033)",
	"--color-border-yellow": "light-dark(#C58600, #B47700)",
	"--color-icon-yellow": "light-dark(#FBC02D, #FFEE58)",
	"--color-text-yellow": "light-dark(#753F07, #FBCE03)"
};
var colorVars = {
	"--color-accent": "var(--color-accent)",
	"--color-accent-muted": "var(--color-accent-muted)",
	"--color-on-accent": "var(--color-on-accent)",
	"--color-neutral": "var(--color-neutral)",
	"--color-background-surface": "var(--color-background-surface)",
	"--color-background-body": "var(--color-background-body)",
	"--color-overlay": "var(--color-overlay)",
	"--color-overlay-hover": "var(--color-overlay-hover)",
	"--color-overlay-pressed": "var(--color-overlay-pressed)",
	"--color-background-muted": "var(--color-background-muted)",
	"--color-text-primary": "var(--color-text-primary)",
	"--color-text-secondary": "var(--color-text-secondary)",
	"--color-text-disabled": "var(--color-text-disabled)",
	"--color-text-accent": "var(--color-text-accent)",
	"--color-on-dark": "var(--color-on-dark)",
	"--color-on-light": "var(--color-on-light)",
	"--color-icon-accent": "var(--color-icon-accent)",
	"--color-icon-primary": "var(--color-icon-primary)",
	"--color-icon-secondary": "var(--color-icon-secondary)",
	"--color-icon-disabled": "var(--color-icon-disabled)",
	"--color-background-card": "var(--color-background-card)",
	"--color-background-popover": "var(--color-background-popover)",
	"--color-background-inverted": "var(--color-background-inverted)",
	"--color-background-error-inverted": "var(--color-background-error-inverted)",
	"--color-success": "var(--color-success)",
	"--color-success-muted": "var(--color-success-muted)",
	"--color-on-success": "var(--color-on-success)",
	"--color-error": "var(--color-error)",
	"--color-error-muted": "var(--color-error-muted)",
	"--color-on-error": "var(--color-on-error)",
	"--color-warning": "var(--color-warning)",
	"--color-warning-muted": "var(--color-warning-muted)",
	"--color-on-warning": "var(--color-on-warning)",
	"--color-border": "var(--color-border)",
	"--color-border-emphasized": "var(--color-border-emphasized)",
	"--color-skeleton": "var(--color-skeleton)",
	"--color-track": "var(--color-track)",
	"--color-shadow": "var(--color-shadow)",
	"--color-tint-hover": "var(--color-tint-hover)",
	"--color-background-blue": "var(--color-background-blue)",
	"--color-border-blue": "var(--color-border-blue)",
	"--color-icon-blue": "var(--color-icon-blue)",
	"--color-text-blue": "var(--color-text-blue)",
	"--color-background-cyan": "var(--color-background-cyan)",
	"--color-border-cyan": "var(--color-border-cyan)",
	"--color-icon-cyan": "var(--color-icon-cyan)",
	"--color-text-cyan": "var(--color-text-cyan)",
	"--color-background-gray": "var(--color-background-gray)",
	"--color-border-gray": "var(--color-border-gray)",
	"--color-icon-gray": "var(--color-icon-gray)",
	"--color-text-gray": "var(--color-text-gray)",
	"--color-background-green": "var(--color-background-green)",
	"--color-border-green": "var(--color-border-green)",
	"--color-icon-green": "var(--color-icon-green)",
	"--color-text-green": "var(--color-text-green)",
	"--color-background-orange": "var(--color-background-orange)",
	"--color-border-orange": "var(--color-border-orange)",
	"--color-icon-orange": "var(--color-icon-orange)",
	"--color-text-orange": "var(--color-text-orange)",
	"--color-background-pink": "var(--color-background-pink)",
	"--color-border-pink": "var(--color-border-pink)",
	"--color-icon-pink": "var(--color-icon-pink)",
	"--color-text-pink": "var(--color-text-pink)",
	"--color-background-purple": "var(--color-background-purple)",
	"--color-border-purple": "var(--color-border-purple)",
	"--color-icon-purple": "var(--color-icon-purple)",
	"--color-text-purple": "var(--color-text-purple)",
	"--color-background-red": "var(--color-background-red)",
	"--color-border-red": "var(--color-border-red)",
	"--color-icon-red": "var(--color-icon-red)",
	"--color-text-red": "var(--color-text-red)",
	"--color-background-teal": "var(--color-background-teal)",
	"--color-border-teal": "var(--color-border-teal)",
	"--color-icon-teal": "var(--color-icon-teal)",
	"--color-text-teal": "var(--color-text-teal)",
	"--color-background-yellow": "var(--color-background-yellow)",
	"--color-border-yellow": "var(--color-border-yellow)",
	"--color-icon-yellow": "var(--color-icon-yellow)",
	"--color-text-yellow": "var(--color-text-yellow)",
	__varGroupHash__: "xj0fimd"
};
var spacingDefaults = {
	"--spacing-0": "0px",
	"--spacing-0-5": "2px",
	"--spacing-1": "4px",
	"--spacing-1-5": "6px",
	"--spacing-2": "8px",
	"--spacing-3": "12px",
	"--spacing-4": "16px",
	"--spacing-5": "20px",
	"--spacing-6": "24px",
	"--spacing-7": "28px",
	"--spacing-8": "32px",
	"--spacing-9": "36px",
	"--spacing-10": "40px",
	"--spacing-11": "44px",
	"--spacing-12": "48px"
};
var spacingVars = {
	"--spacing-0": "var(--spacing-0)",
	"--spacing-0-5": "var(--spacing-0-5)",
	"--spacing-1": "var(--spacing-1)",
	"--spacing-1-5": "var(--spacing-1-5)",
	"--spacing-2": "var(--spacing-2)",
	"--spacing-3": "var(--spacing-3)",
	"--spacing-4": "var(--spacing-4)",
	"--spacing-5": "var(--spacing-5)",
	"--spacing-6": "var(--spacing-6)",
	"--spacing-7": "var(--spacing-7)",
	"--spacing-8": "var(--spacing-8)",
	"--spacing-9": "var(--spacing-9)",
	"--spacing-10": "var(--spacing-10)",
	"--spacing-11": "var(--spacing-11)",
	"--spacing-12": "var(--spacing-12)",
	__varGroupHash__: "x1kvdh9l"
};
var sizeDefaults = {
	"--size-element-sm": "28px",
	"--size-element-md": "32px",
	"--size-element-lg": "36px"
};
var borderDefaults = { "--border-width": "1px" };
var focusDefaults = {
	"--focus-outline-width": "2px",
	"--focus-outline-style": "solid",
	"--focus-outline-color": "var(--color-accent)",
	"--focus-outline-offset": "3px"
};
var focusVars = {
	"--focus-outline-width": "var(--focus-outline-width)",
	"--focus-outline-style": "var(--focus-outline-style)",
	"--focus-outline-color": "var(--focus-outline-color)",
	"--focus-outline-offset": "var(--focus-outline-offset)",
	__varGroupHash__: "xzxs3qz"
};
var radiusDefaults = {
	"--radius-none": "0px",
	"--radius-inner": "4px",
	"--radius-element": "8px",
	"--radius-container": "12px",
	"--radius-page": "28px",
	"--radius-chat": "28px",
	"--radius-full": "9999px"
};
var shadowDefaults = {
	"--shadow-low": "0px 1px 1px light-dark(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2)), 0px 2px 8px light-dark(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2))",
	"--shadow-med": "0px 1px 2px light-dark(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2)), 0px 2px 12px light-dark(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2))",
	"--shadow-high": "0px 2px 2px light-dark(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2)), 0px 8px 24px light-dark(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3))",
	"--shadow-inset-hover": "inset 0px 0px 0px 2px light-dark(rgba(5, 54, 89, 0.15), rgba(223, 226, 229, 0.2))",
	"--shadow-inset-selected": "inset 0px 0px 0px 2px rgba(1, 113, 227, 0.5)",
	"--shadow-inset-success": "inset 0px 0px 0px 2px rgba(38, 167, 86, 0.3)",
	"--shadow-inset-warning": "inset 0px 0px 0px 2px rgba(226, 164, 0, 0.3)",
	"--shadow-inset-error": "inset 0px 0px 0px 2px rgba(227, 25, 59, 0.3)"
};
var durationDefaults = {
	"--duration-fast-min": "130ms",
	"--duration-fast": "175ms",
	"--duration-fast-max": "230ms",
	"--duration-medium-min": "310ms",
	"--duration-medium": "410ms",
	"--duration-medium-max": "550ms",
	"--duration-slow-min": "730ms",
	"--duration-slow": "975ms",
	"--duration-slow-max": "1300ms"
};
var durationVars = {
	"--duration-fast-min": "var(--duration-fast-min)",
	"--duration-fast": "var(--duration-fast)",
	"--duration-fast-max": "var(--duration-fast-max)",
	"--duration-medium-min": "var(--duration-medium-min)",
	"--duration-medium": "var(--duration-medium)",
	"--duration-medium-max": "var(--duration-medium-max)",
	"--duration-slow-min": "var(--duration-slow-min)",
	"--duration-slow": "var(--duration-slow)",
	"--duration-slow-max": "var(--duration-slow-max)",
	__varGroupHash__: "x14lkjui"
};
var easeDefaults = { "--ease-standard": "cubic-bezier(0.24, 1, 0.4, 1)" };
var easeVars = {
	"--ease-standard": "var(--ease-standard)",
	__varGroupHash__: "xf09i69"
};
var typographyDefaults = {
	"--font-family-body": "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif",
	"--font-family-code": "\"SF Mono\", Monaco, Consolas, monospace",
	"--font-family-heading": "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif"
};
var textSizeDefaults = {
	"--font-size-4xs": "0.375rem",
	"--font-size-3xs": "0.4375rem",
	"--font-size-2xs": "0.5rem",
	"--font-size-xs": "0.625rem",
	"--font-size-sm": "0.75rem",
	"--font-size-base": "0.875rem",
	"--font-size-lg": "1.0625rem",
	"--font-size-xl": "1.25rem",
	"--font-size-2xl": "1.5rem",
	"--font-size-3xl": "1.8125rem",
	"--font-size-4xl": "2.1875rem",
	"--font-size-5xl": "2.625rem"
};
var fontWeightDefaults = {
	"--font-weight-normal": "400",
	"--font-weight-medium": "500",
	"--font-weight-semibold": "600",
	"--font-weight-bold": "700"
};
var typeScaleDefaults = {
	"--text-heading-1-size": "var(--font-size-2xl)",
	"--text-heading-1-weight": "var(--font-weight-semibold)",
	"--text-heading-1-leading": "1.3333",
	"--text-heading-2-size": "var(--font-size-xl)",
	"--text-heading-2-weight": "var(--font-weight-semibold)",
	"--text-heading-2-leading": "1.4",
	"--text-heading-3-size": "var(--font-size-lg)",
	"--text-heading-3-weight": "var(--font-weight-semibold)",
	"--text-heading-3-leading": "1.4118",
	"--text-heading-4-size": "var(--font-size-base)",
	"--text-heading-4-weight": "var(--font-weight-semibold)",
	"--text-heading-4-leading": "1.4286",
	"--text-heading-5-size": "var(--font-size-sm)",
	"--text-heading-5-weight": "var(--font-weight-semibold)",
	"--text-heading-5-leading": "1.6667",
	"--text-heading-6-size": "var(--font-size-xs)",
	"--text-heading-6-weight": "var(--font-weight-semibold)",
	"--text-heading-6-leading": "1.6",
	"--text-body-size": "var(--font-size-base)",
	"--text-body-weight": "var(--font-weight-normal)",
	"--text-body-leading": "1.4286",
	"--text-large-size": "var(--font-size-lg)",
	"--text-large-weight": "var(--font-weight-semibold)",
	"--text-large-leading": "1.4118",
	"--text-label-size": "var(--font-size-base)",
	"--text-label-weight": "var(--font-weight-medium)",
	"--text-label-leading": "1.4286",
	"--text-code-size": "var(--font-size-base)",
	"--text-code-weight": "var(--font-weight-normal)",
	"--text-code-leading": "1.4286",
	"--text-supporting-size": "var(--font-size-sm)",
	"--text-supporting-weight": "var(--font-weight-normal)",
	"--text-supporting-leading": "1.6667",
	"--text-display-1-size": "var(--font-size-5xl)",
	"--text-display-1-weight": "var(--font-weight-normal)",
	"--text-display-1-leading": "1.2381",
	"--text-display-2-size": "var(--font-size-4xl)",
	"--text-display-2-weight": "var(--font-weight-normal)",
	"--text-display-2-leading": "1.2571",
	"--text-display-3-size": "var(--font-size-3xl)",
	"--text-display-3-weight": "var(--font-weight-normal)",
	"--text-display-3-leading": "1.2414"
};
//#endregion
//#region node_modules/@astryxdesign/core/dist/theme/mergeComponents.js
/**
* @file Component style-map merging
*
* One merge rule for component overrides, shared by every layer that composes
* them: `extends` inheritance, generated type-scale rules, and the on-media
* (`onDark`/`onLight`) surfaces. Merging is per style key, so a child that
* restates one property of `button.base` keeps the rest of the base's.
*
* @input two ComponentStyleMaps — the base and the overrides that win
* @output a merged ComponentStyleMap
* @position packages/core/src/theme/mergeComponents.ts
*/
/**
* Deep-merge component style maps: `overrides` wins per style key, and every
* component and key the base declared that the overrides do not mention is
* carried through untouched.
*/
function deepMergeComponents(base, overrides) {
	if (!base && !overrides) return;
	if (!base) return overrides;
	if (!overrides) return base;
	const result = {};
	for (const [component, rules] of Object.entries(base)) result[component] = { ...rules };
	for (const [component, rules] of Object.entries(overrides)) if (!result[component]) result[component] = { ...rules };
	else for (const [key, styles] of Object.entries(rules)) result[component][key] = {
		...result[component][key],
		...styles
	};
	return result;
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/theme/onMediaTokens.js
/**
* @file onMediaTokens.ts
* @input Theme token values from defineTheme
* @output Default on-dark / on-light token overrides for MediaTheme
* @position Theme system utility; consumed by defineTheme and generateThemeRules
*
* Generates semantic token overrides for content rendered on inverted surfaces.
* "onDark" = content on a dark background (light text, white-tinted interactions)
* "onLight" = content on a light background (dark text, black-tinted interactions)
*
* The primary mechanism is `color-scheme` — setting `color-scheme: dark` on the
* media element makes all `light-dark()` tokens resolve to their dark-side values.
* Only a small set of tokens need explicit overrides (text/icon primary use
* `var(--color-on-dark)` instead of the dark-mode grey, accent collapses to
* on-color, etc.).
*
* Themes can provide additional token and component overrides via the
* `onDark`/`onLight` fields in `defineTheme()`.
*/
/**
* On-media theme overrides — same shape as the main theme but scoped
* to a surface luminance context.
*/
/**
* Resolved on-media overrides stored on DefinedTheme.
* @internal
*/
/**
* Default token overrides for content on a dark surface.
*
* Most tokens work automatically via `color-scheme: dark` which flips
* `light-dark()` values. These overrides handle the tokens that need
* different values on an inverted surface vs a dark page background.
*/
var defaultOnDarkTokens = {
	"color-scheme": "dark",
	"--color-text-primary": "var(--color-on-dark)",
	"--color-icon-primary": "var(--color-on-dark)",
	"--color-accent": "var(--color-on-dark)"
};
/**
* Default token overrides for content on a light surface.
*/
var defaultOnLightTokens = {
	"color-scheme": "light",
	"--color-text-primary": "var(--color-on-light)",
	"--color-icon-primary": "var(--color-on-light)",
	"--color-accent": "var(--color-on-light)"
};
/**
* Resolve a token value to a CSS string.
*/
function resolveValue(value) {
	if (Array.isArray(value)) return `light-dark(${value[0]}, ${value[1]})`;
	return value;
}
/**
* Resolve on-media overrides: merge user tokens with defaults,
* pass through component overrides.
*
* `base` is the already-resolved surface of a theme being extended. It sits
* between the defaults and this theme's own input, so a child theme inherits
* the surface customizations of the theme it extends instead of silently
* reverting them to the defaults.
*/
function resolveOnMedia(surface, input, base) {
	const tokens = {
		...surface === "dark" ? defaultOnDarkTokens : defaultOnLightTokens,
		...base?.tokens
	};
	if (input?.tokens) {
		for (const [key, value] of Object.entries(input.tokens)) if (value !== void 0) tokens[key] = resolveValue(value);
	}
	return {
		tokens,
		components: deepMergeComponents(base?.components, input?.components)
	};
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/theme/expandTypeScale.js
/**
* @file expandTypeScale.ts
* @input Type scale configuration { base, ratio, weights? }
* @output Token overrides for raw size tokens and semantic typography tokens
* @position Theme utility; consumed by defineTheme.ts
*
* Computes a complete typography token set from a base size and scaling ratio
* using a geometric progression: size = base × ratio^step.
*
* Two-layer architecture:
*   Layer 1: Raw size tokens (--font-size-4xs … --font-size-4xl)
*            Geometric progression in rem.
*   Layer 2: Semantic tokens (--heading-*, --text-*-size/leading/weight)
*            Sizes are var() references to Layer 1.
*            Line heights are hardcoded computed values (4px grid snapped).
*            Weights are var() references to font-weight tokens.
*
* The named leading tokens (--leading-tight … --leading-relaxed) are NOT
* modified by the type scale — they remain as intent-based ratios for
* component use.
*
* Step mapping:
*   step -5 → --font-size-4xs   (sub-scale)
*   step -4 → --font-size-3xs   (sub-scale)
*   step -3 → --font-size-2xs   (sub-scale)
*   step -2 → --font-size-xs   (h6)
*   step -1 → --font-size-sm    (h5, supporting)
*   step  0 → --font-size-base  (h4, body, label, code)
*   step +1 → --font-size-lg    (h3, large)
*   step +2 → --font-size-xl    (h2)
*   step +3 → --font-size-2xl   (h1)
*   step +4 → --font-size-3xl
*   step +5 → --font-size-4xl
*
* Line heights use a tiered target ratio based on font size:
*   < 20px  → 1.5   (body text, small UI)
*   20–31px → 1.4   (medium headings)
*   ≥ 32px  → 1.25  (large display headings)
*
* Then 4px-grid-snapped with Math.round and a minimum of fontSize + 4.
*
* SYNC: When modified, update:
* - /packages/core/src/theme/expandTypeScale.test.ts
* - /packages/core/src/theme/defineTheme.ts
* - /packages/cli/assets/theme.template.ts (the annotated field reference)
*/
/** Font weight value — either a CSS string or a var() reference. */
/**
* Weight overrides for heading levels.
* Keys are heading levels 1–6, values are CSS font-weight values
* (e.g. '600', 'var(--font-weight-bold)').
*/
/**
* Weight overrides for text types.
* Keys are built-in text type names, values are CSS font-weight values.
* Accepts additional string keys for custom theme-defined text types.
*/
/**
* Type scale configuration.
*
* @example
* ```
* // Default Astryx type scale
* { base: 14, ratio: 1.2 }
*
* // With custom weights
* {
*   base: 14,
*   ratio: 1.2,
*   weights: {
*     heading: { 1: 'var(--font-weight-bold)', 3: 'var(--font-weight-bold)' },
*     text: { large: 'var(--font-weight-normal)' },
*   },
* }
*
* // Suggested starting points:
* //   Dense/functional: { base: 12, ratio: 1.125 }
* //   Default:          { base: 14, ratio: 1.2 }
* //   Airy/editorial:   { base: 16, ratio: 1.25 }
* ```
*/
/**
* Generated typography token overrides.
* Keys are CSS custom property names, values are CSS strings.
*/
/**
* Step → raw size token name.
* These tokens form the geometric font size scale.
*
* The full scale spans steps -5 to +5:
*   -5 → --font-size-4xs (sub-scale)
*   -4 → --font-size-3xs (sub-scale)
*   -3 → --font-size-2xs (sub-scale)
*   -2 → --font-size-xs
*   -1 → --font-size-sm
*    0 → --font-size-base (anchor)
*   +1 → --font-size-lg
*   +2 → --font-size-xl
*   +3 → --font-size-2xl
*   +4 → --font-size-3xl
*   +5 → --font-size-4xl
*/
var STEP_TO_SIZE_TOKEN = {
	[-5]: "--font-size-4xs",
	[-4]: "--font-size-3xs",
	[-3]: "--font-size-2xs",
	[-2]: "--font-size-xs",
	[-1]: "--font-size-sm",
	[0]: "--font-size-base",
	[1]: "--font-size-lg",
	[2]: "--font-size-xl",
	[3]: "--font-size-2xl",
	[4]: "--font-size-3xl",
	[5]: "--font-size-4xl",
	[6]: "--font-size-5xl"
};
/**
* Heading level → step offset from base (h4 = 0).
* h1 is 3 steps above base, h6 is 2 steps below.
*/
var HEADING_STEPS = {
	1: 3,
	2: 2,
	3: 1,
	4: 0,
	5: -1,
	6: -2
};
/**
* Text type → step offset from base.
* body/label/code are at base, large is one step up, supporting one step down.
*/
var TEXT_STEPS = {
	body: 0,
	large: 1,
	label: 0,
	code: 0,
	supporting: -1,
	"display-1": 6,
	"display-2": 5,
	"display-3": 4
};
/**
* Default font weights per heading level.
*/
var DEFAULT_HEADING_WEIGHTS = {
	1: "var(--font-weight-semibold)",
	2: "var(--font-weight-semibold)",
	3: "var(--font-weight-semibold)",
	4: "var(--font-weight-semibold)",
	5: "var(--font-weight-semibold)",
	6: "var(--font-weight-semibold)"
};
/**
* Default font weights per text type.
*/
var DEFAULT_TEXT_WEIGHTS = {
	body: "var(--font-weight-normal)",
	large: "var(--font-weight-semibold)",
	label: "var(--font-weight-medium)",
	code: "var(--font-weight-normal)",
	supporting: "var(--font-weight-normal)",
	"display-1": "var(--font-weight-normal)",
	"display-2": "var(--font-weight-normal)",
	"display-3": "var(--font-weight-normal)"
};
/**
* Compute a font size from the geometric progression and round to nearest integer.
*/
function computeSize(base, ratio, step) {
	return Math.round(base * Math.pow(ratio, step));
}
/** Convert px to rem based on the standard 16px root font size. */
function pxToRem(px) {
	return `${Math.round(px / 16 * 1e4) / 1e4}rem`;
}
/**
* Tiered target line-height ratio based on font size.
*
*   < 20px  → 1.5   (body text, small UI elements)
*   20–31px → 1.4   (medium headings, transitional)
*   ≥ 32px  → 1.25  (large display headings)
*/
function targetLeadingRatio(fontSize) {
	return fontSize < 20 ? 1.5 : fontSize < 32 ? 1.4 : 1.25;
}
/**
* Compute a unitless line-height ratio, snapped so the computed px value
* aligns to a 4px grid. Ensures a minimum gap of fontSize + 4px.
*
* Uses a tiered target ratio — see `targetLeadingRatio`.
*/
function computeLeading(fontSize) {
	const rawLh = fontSize * targetLeadingRatio(fontSize);
	const snappedLh = Math.max(Math.round(rawLh / 4) * 4, Math.ceil((fontSize + 4) / 4) * 4);
	return Math.round(snappedLh / fontSize * 1e4) / 1e4;
}
/**
* Expand a type scale configuration into typography token overrides.
*
* Generates two layers of tokens:
*   - Layer 1: 11 raw size tokens (--font-size-4xs … --font-size-4xl) in rem
*   - Layer 2: semantic tokens using var() refs for sizes and
*              hardcoded computed values for line heights
*
* Includes 6 heading levels × 3 + 8 text types × 3 (body, large, label, code, supporting, display-1/2/3).
* Font sizes are emitted as rem values (e.g. '1.5rem') based on 16px root.
* Line heights are emitted as unitless ratios (e.g. '1.3333').
* Font weights are emitted as var() references (e.g. '''var(--font-weight-semibold)'''').
*
* @example
* ```
* const tokens = expandTypeScale({ base: 14, ratio: 1.2 });
* // Layer 1 — raw sizes
* // tokens['--font-size-base'] === '0.875rem'
* // tokens['--font-size-2xl'] === '1.5rem'
* //
* // Layer 2 — semantic
* // tokens['--text-heading-1-size'] === 'var(--font-size-2xl)'
* // tokens['--text-heading-1-leading'] === '1.3333'
* // tokens['--text-body-size'] === 'var(--font-size-base)'
* // tokens['--text-body-leading'] === '1.4286'
* ```
*/
function expandTypeScale(config) {
	const { base, ratio, weights } = config;
	const tokens = {};
	const headingWeights = {
		...DEFAULT_HEADING_WEIGHTS,
		...weights?.heading
	};
	const textWeights = {
		...DEFAULT_TEXT_WEIGHTS,
		...weights?.text
	};
	for (let step = -5; step <= 6; step++) {
		const size = computeSize(base, ratio, step);
		tokens[STEP_TO_SIZE_TOKEN[step]] = pxToRem(size);
	}
	for (const [levelStr, step] of Object.entries(HEADING_STEPS)) {
		const level = Number(levelStr);
		const leading = computeLeading(computeSize(base, ratio, step));
		tokens[`--text-heading-${level}-size`] = `var(${STEP_TO_SIZE_TOKEN[step]})`;
		tokens[`--text-heading-${level}-weight`] = headingWeights[level];
		tokens[`--text-heading-${level}-leading`] = `${leading}`;
	}
	for (const [type, step] of Object.entries(TEXT_STEPS)) {
		const leading = computeLeading(computeSize(base, ratio, step));
		tokens[`--text-${type}-size`] = `var(${STEP_TO_SIZE_TOKEN[step]})`;
		tokens[`--text-${type}-weight`] = textWeights[type];
		tokens[`--text-${type}-leading`] = `${leading}`;
	}
	return tokens;
}
var TEXT_FONT_FAMILIES = {
	body: "var(--font-family-body)",
	large: "var(--font-family-body)",
	label: "var(--font-family-body)",
	code: "var(--font-family-code)",
	supporting: "var(--font-family-body)",
	"display-1": "var(--font-family-heading)",
	"display-2": "var(--font-family-heading)",
	"display-3": "var(--font-family-heading)"
};
/**
* Generate component style overrides for heading and text components.
*/
function generateTypeScaleComponents(_config) {
	const components = {};
	const headingRules = {};
	for (const level of [
		1,
		2,
		3,
		4,
		5,
		6
	]) headingRules[`level:${level}`] = {
		fontFamily: "var(--font-family-heading)",
		fontSize: `var(--text-heading-${level}-size)`,
		fontWeight: `var(--text-heading-${level}-weight)`,
		lineHeight: `var(--text-heading-${level}-leading)`
	};
	for (const type of [
		"display-1",
		"display-2",
		"display-3"
	]) headingRules[`type:${type}`] = {
		fontFamily: "var(--font-family-heading)",
		fontSize: `var(--text-${type}-size)`,
		lineHeight: `var(--text-${type}-leading)`
	};
	components.heading = headingRules;
	const textRules = {};
	for (const type of [
		"body",
		"large",
		"label",
		"code",
		"supporting",
		"display-1",
		"display-2",
		"display-3"
	]) textRules[`type:${type}`] = {
		fontFamily: TEXT_FONT_FAMILIES[type],
		fontSize: `var(--text-${type}-size)`,
		lineHeight: `var(--text-${type}-leading)`
	};
	components.text = textRules;
	return components;
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/theme/expandMotionScale.js
/**
* @file expandMotionScale.ts
* @input Motion scale configuration { fast, medium, ratio, easing? }
* @output Token overrides for duration and easing primitives
* @position Theme utility; consumed by defineTheme.ts
*
* Computes duration min/max variants from base values and a scaling ratio:
*   min = base × ratio
*   max = base / ratio
*
* This gives theme authors a simple 3-value interface (fast, medium, ratio)
* that expands into a coherent 6-token duration scale. A "snappy" theme
* lowers the base; a "cinematic" theme raises it — and the proportional
* relationships between variants are preserved automatically.
*
* SYNC: When modified, update:
* - /packages/core/src/theme/expandMotionScale.test.ts
* - /packages/core/src/theme/defineTheme.ts
* - /packages/cli/assets/theme.template.ts (the annotated field reference)
*/
/**
* Motion scale configuration.
*
* @example
* ```
* // Default Astryx motion scale
* { fast: 175, medium: 410, slow: 975, ratio: 0.75 }
*
* // Snappy theme (reduced motion budget)
* { fast: 100, medium: 250, ratio: 0.75 }
*
* // Cinematic theme (dramatic animations)
* { fast: 200, medium: 500, slow: 1200, ratio: 0.7 }
*
* // With custom easing
* { fast: 175, medium: 410, ratio: 0.75, easing: 'cubic-bezier(0.0, 0.0, 0.2, 1)' }
* ```
*/
/** Token overrides produced by expandMotionScale. */
/**
* Round a duration in ms to the nearest 5ms for clean token values.
*/
function roundMs(ms) {
	return Math.round(ms / 5) * 5;
}
/**
* Expand a motion scale configuration into duration and easing token overrides.
*
* Duration computation:
*   fast-min  = fast × ratio    (smallest micro-interaction)
*   fast      = fast             (standard micro-interaction)
*   fast-max  = fast / ratio    (slightly longer micro-interaction)
*   medium-min = medium × ratio (quick entrance/exit)
*   medium     = medium          (standard entrance/exit)
*   medium-max = medium / ratio (dramatic entrance)
*   slow-min  = slow × ratio    (quick continuous animation) [optional]
*   slow      = slow             (standard continuous animation) [optional]
*   slow-max  = slow / ratio    (relaxed continuous animation) [optional]
*
* @param config — Motion scale configuration
* @returns Token overrides to merge into the theme token map
*/
function expandMotionScale(config) {
	const { fast, medium, slow, ratio, easing } = config;
	const tokens = {
		"--duration-fast-min": `${roundMs(fast * ratio)}ms`,
		"--duration-fast": `${roundMs(fast)}ms`,
		"--duration-fast-max": `${roundMs(fast / ratio)}ms`,
		"--duration-medium-min": `${roundMs(medium * ratio)}ms`,
		"--duration-medium": `${roundMs(medium)}ms`,
		"--duration-medium-max": `${roundMs(medium / ratio)}ms`
	};
	if (slow != null) {
		tokens["--duration-slow-min"] = `${roundMs(slow * ratio)}ms`;
		tokens["--duration-slow"] = `${roundMs(slow)}ms`;
		tokens["--duration-slow-max"] = `${roundMs(slow / ratio)}ms`;
	}
	if (easing) tokens["--ease-standard"] = easing;
	return tokens;
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/theme/expandRadiusScale.js
/**
* @file expandRadiusScale.ts
* @input Radius scale configuration { base, multiplier }
* @output Token overrides for radius tokens
* @position Theme utility; consumed by defineTheme.ts
*
* Computes border-radius values from a base unit and multiplier.
* --radius-none and --radius-full are always fixed (never affected by multiplier).
* --radius-inner through --radius-page = base * step * multiplier.
*
* Semantic scale:
*   --radius-none      → 0px (fixed)
*   --radius-inner     → base × 1 × multiplier (internal corners)
*   --radius-element   → base × 2 × multiplier (buttons, inputs)
*   --radius-container → base × 3 × multiplier (cards, panels)
*   --radius-page      → base × 7 × multiplier (page-level containers)
*   --radius-chat      → base × 7 × multiplier (chat surfaces; tracks page)
*   --radius-full      → 9999px (fixed, pill shapes)
*
* SYNC: When modified, update:
* - /packages/core/src/theme/expandRadiusScale.test.ts
* - /packages/core/src/theme/defineTheme.ts
* - /packages/cli/assets/theme.template.ts (the annotated field reference)
*/
/**
* Radius scale configuration.
*
* @example
* ```
* // Default Astryx radius scale
* { base: 4, multiplier: 1 }
*
* // Sharp/brutalist — all radii become 0
* { base: 4, multiplier: 0 }
*
* // Extra rounded
* { base: 4, multiplier: 1.5 }
* ```
*/
/**
* Generated radius token overrides.
* Keys are CSS custom property names, values are CSS strings.
*/
/**
* Expand a radius scale config into token overrides.
*
* --radius-none and --radius-full are fixed anchors.
* --radius-inner through --radius-page scale with base × step × multiplier.
*
* @example
* ```
* const tokens = expandRadiusScale({ base: 4, multiplier: 1 });
* // tokens['--radius-none'] === '0px'
* // tokens['--radius-inner'] === '4px'       (4 × 1 × 1)
* // tokens['--radius-element'] === '8px'     (4 × 2 × 1)
* // tokens['--radius-container'] === '12px'  (4 × 3 × 1)
* // tokens['--radius-page'] === '28px'       (4 × 7 × 1)
* // tokens['--radius-chat'] === '28px'       (4 × 7 × 1)
* // tokens['--radius-full'] === '9999px'
*
* const sharp = expandRadiusScale({ base: 4, multiplier: 0 });
* // All scalable tokens become '0px', none and full unchanged
* ```
*/
function expandRadiusScale(config) {
	const { base, multiplier } = config;
	return {
		"--radius-none": "0px",
		"--radius-inner": `${Math.round(base * 1 * multiplier)}px`,
		"--radius-element": `${Math.round(base * 2 * multiplier)}px`,
		"--radius-container": `${Math.round(base * 3 * multiplier)}px`,
		"--radius-page": `${Math.round(base * 7 * multiplier)}px`,
		"--radius-chat": `${Math.round(base * 7 * multiplier)}px`,
		"--radius-full": "9999px"
	};
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/utils/color.js
/**
* @file color.ts
* @input CSS color strings (hex, rgb()/rgba(), a small set of named colors)
* @output Shared color parsing/formatting primitives used across the design system
* @position Package utility; backs theme token resolution, HCT color math, and chart/WebGL rendering
*
* A single home for the color parsers that were previously duplicated across
* the theme layer, charts, and lab. Consumers get one well-tested definition of
* "parse this color" rather than several subtly different regexes.
*/
/** A color decomposed into 0-255 RGB channels and a 0-1 alpha. */
/** The named colors the design system relies on in token expressions. */
var NAMED_COLORS = {
	transparent: {
		r: 0,
		g: 0,
		b: 0,
		a: 0
	},
	black: {
		r: 0,
		g: 0,
		b: 0,
		a: 1
	},
	white: {
		r: 255,
		g: 255,
		b: 255,
		a: 1
	}
};
var clamp = (value, min, max) => Math.max(min, Math.min(max, value));
/** Expand a shorthand hex body (`rgb`/`rgba`) to its full form (`rrggbb`/`rrggbbaa`). */
function expandShorthand(body) {
	return body.split("").map((c) => c + c).join("");
}
/**
* Parse a hex color into {@link RGBA}. Accepts `#rgb`, `#rgba`, `#rrggbb`, and
* `#rrggbbaa`, with or without the leading `#`. Returns null for anything else.
*/
function parseHex(hex) {
	if (typeof hex !== "string") return null;
	const body = hex.trim().replace(/^#/, "");
	const normalized = body.length === 3 || body.length === 4 ? expandShorthand(body) : body;
	if (normalized.length !== 6 && normalized.length !== 8 || !/^[0-9a-fA-F]+$/.test(normalized)) return null;
	return {
		r: parseInt(normalized.slice(0, 2), 16),
		g: parseInt(normalized.slice(2, 4), 16),
		b: parseInt(normalized.slice(4, 6), 16),
		a: normalized.length === 8 ? parseInt(normalized.slice(6, 8), 16) / 255 : 1
	};
}
/**
* Parse an `rgb()`/`rgba()` color into {@link RGBA}. Accepts comma- or
* space-separated channels, an optional `/ alpha`, and percentage channels.
*/
function parseRgb(value) {
	const open = value.indexOf("(");
	if (open === -1 || !value.trim().endsWith(")")) return null;
	const parts = value.slice(open + 1, value.lastIndexOf(")")).replace(/\//g, " ").split(/[\s,]+/).map((p) => p.trim()).filter(Boolean);
	if (parts.length < 3) return null;
	const channel = (p) => {
		return clamp(p.endsWith("%") ? parseFloat(p) / 100 * 255 : parseFloat(p), 0, 255);
	};
	const r = channel(parts[0]);
	const g = channel(parts[1]);
	const b = channel(parts[2]);
	if ([
		r,
		g,
		b
	].some(Number.isNaN)) return null;
	let a = 1;
	if (parts.length >= 4) {
		const raw = parts[3];
		a = raw.endsWith("%") ? parseFloat(raw) / 100 : parseFloat(raw);
		if (Number.isNaN(a)) return null;
		a = clamp(a, 0, 1);
	}
	return {
		r,
		g,
		b,
		a
	};
}
/**
* Parse a concrete CSS color string into {@link RGBA}. Supports hex,
* `rgb()`/`rgba()`, and the named colors used in token expressions. Returns
* null for anything it can't evaluate (e.g. `var()`, `oklch()`, unknown names)
* so callers can preserve the original expression rather than guessing.
*/
function parseColor(value) {
	const trimmed = value.trim();
	const named = NAMED_COLORS[trimmed.toLowerCase()];
	if (named) return { ...named };
	if (trimmed.startsWith("#")) return parseHex(trimmed);
	if (/^rgba?\(/i.test(trimmed)) return parseRgb(trimmed);
	return null;
}
/** Format RGB channels (0-255) as an uppercase `#RRGGBB` string. */
function formatHex(r, g, b) {
	const channel = (c) => clamp(Math.round(c), 0, 255).toString(16).padStart(2, "0").toUpperCase();
	return `#${channel(r)}${channel(g)}${channel(b)}`;
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/theme/contrast.js
/**
* @file contrast.ts
* @input CSS color strings (hex, rgb()/rgba()) or parsed RGBA values
* @output WCAG 2.x relative luminance and contrast ratios
* @position Theme utility; consumed by expandColorScale.ts and theme tests
*
* Dependency-free WCAG 2.x contrast math. Backs the contrast guarantees
* for generated color tokens (WCAG 1.4.3 text contrast >= 4.5:1,
* WCAG 1.4.11 non-text contrast >= 3:1).
*
* Semi-transparent foregrounds are composited over their backdrop in
* gamma-encoded sRGB space (matching CSS alpha compositing) before the
* ratio is measured — a translucent token has no contrast of its own,
* only against what it renders on.
*/
/**
* WCAG 2.x relative luminance of an sRGB color (alpha ignored).
* 0 = black, 1 = white.
*
* https://www.w3.org/WAI/WCAG22/Techniques/general/G18
*/
function relativeLuminance(color) {
	const channel = (c) => {
		const s = c / 255;
		return s <= .04045 ? s / 12.92 : Math.pow((s + .055) / 1.055, 2.4);
	};
	return .2126 * channel(color.r) + .7152 * channel(color.g) + .0722 * channel(color.b);
}
/**
* Composite a (possibly translucent) foreground over an opaque backdrop
* using standard source-over alpha blending in gamma-encoded sRGB space,
* matching how CSS paints translucent tokens. Returns an opaque color.
*/
function compositeOver(foreground, backdrop) {
	const a = foreground.a;
	return {
		r: foreground.r * a + backdrop.r * (1 - a),
		g: foreground.g * a + backdrop.g * (1 - a),
		b: foreground.b * a + backdrop.b * (1 - a),
		a: 1
	};
}
function resolve(value, label) {
	if (typeof value !== "string") return value;
	const parsed = parseColor(value);
	if (parsed === null) throw new TypeError(`contrastRatio: could not parse ${label} "${value}"`);
	return parsed;
}
/**
* WCAG 2.x contrast ratio between a foreground and an opaque background.
* Returns a value in [1, 21].
*
* A translucent foreground is composited over the background first.
* A translucent background is rejected — composite it over its own
* backdrop before calling, since its rendered color is unknowable here.
*
* @example
* ```
* contrastRatio('#000000', '#FFFFFF'); // 21
* contrastRatio('#0D131A', '#FCFDFE') >= 4.5; // text-on-surface check
* ```
*/
function contrastRatio(foreground, background) {
	const bg = resolve(background, "background");
	if (bg.a < 1) throw new TypeError("contrastRatio: background must be opaque — composite it over its backdrop first");
	let fg = resolve(foreground, "foreground");
	if (fg.a < 1) fg = compositeOver(fg, bg);
	const lumA = relativeLuminance(fg);
	const lumB = relativeLuminance(bg);
	const lighter = Math.max(lumA, lumB);
	const darker = Math.min(lumA, lumB);
	return (lighter + .05) / (darker + .05);
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/theme/hct.js
/**
* @file hct.ts
* @input Hex color string (#RRGGBB)
* @output HCT color representation (Hue, Chroma, Tone)
* @position Theme utility; consumed by expandColorScale.ts
*
* Minimal HCT (Hue, Chroma, Tone) color space implementation.
* Ported from Google's material-color-utilities (Apache-2.0).
* Zero runtime dependencies — all math is self-contained.
*
* HCT combines:
* - Hue from CIELab (perceptually uniform hue)
* - Chroma approximated via CIELab C*ab (colorfulness)
* - Tone from L* (CIE Lightness, 0=black, 100=white)
*/
function srgbToLinear(c) {
	const s = c / 255;
	return s <= .04045 ? s / 12.92 : Math.pow((s + .055) / 1.055, 2.4);
}
function linearToSrgb(c) {
	const s = c <= .0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - .055;
	return Math.round(Math.min(255, Math.max(0, s * 255)));
}
function linearRgbToXyz(r, g, b) {
	return [
		.4124564 * r + .3575761 * g + .1804375 * b,
		.2126729 * r + .7151522 * g + .072175 * b,
		.0193339 * r + .119192 * g + .9503041 * b
	];
}
function xyzToLinearRgb(x, y, z) {
	return [
		3.2404542 * x - 1.5371385 * y - .4985314 * z,
		-.969266 * x + 1.8760108 * y + .041556 * z,
		.0556434 * x - .2040259 * y + 1.0572252 * z
	];
}
var D65_WHITE = [
	.95047,
	1,
	1.08883
];
function labF(t) {
	const delta = 6 / 29;
	return t > delta * delta * delta ? Math.cbrt(t) : t / (3 * delta * delta) + 4 / 29;
}
function labFInv(t) {
	const delta = 6 / 29;
	return t > delta ? t * t * t : 3 * delta * delta * (t - 4 / 29);
}
function xyzToLab(x, y, z) {
	const fx = labF(x / D65_WHITE[0]);
	const fy = labF(y / D65_WHITE[1]);
	const fz = labF(z / D65_WHITE[2]);
	return [
		116 * fy - 16,
		500 * (fx - fy),
		200 * (fy - fz)
	];
}
function labToXyz(L, a, b) {
	const fy = (L + 16) / 116;
	const fx = a / 500 + fy;
	const fz = fy - b / 200;
	return [
		labFInv(fx) * D65_WHITE[0],
		labFInv(fy) * D65_WHITE[1],
		labFInv(fz) * D65_WHITE[2]
	];
}
function toneToY(tone) {
	return labFInv((tone + 16) / 116);
}
function hexToRgb(hex) {
	const parsed = parseHex(hex);
	if (parsed === null) return [
		0,
		0,
		0
	];
	return [
		parsed.r,
		parsed.g,
		parsed.b
	];
}
/**
* Convert a hex color to HCT.
* Hue: 0-360, Chroma: 0-~120, Tone: 0-100.
*/
function hexToHct(hex) {
	const [r, g, b] = hexToRgb(hex);
	const [x, y, z] = linearRgbToXyz(srgbToLinear(r), srgbToLinear(g), srgbToLinear(b));
	const [L, a, bLab] = xyzToLab(x, y, z);
	let hue = Math.atan2(bLab, a) * 180 / Math.PI;
	if (hue < 0) hue += 360;
	const chroma = Math.sqrt(a * a + bLab * bLab);
	return {
		hue,
		chroma,
		tone: Math.max(0, Math.min(100, L))
	};
}
/**
* Convert HCT to hex, with gamut mapping.
* Uses chroma reduction to find the closest in-gamut sRGB color.
*/
function hctToHex(hct) {
	const { hue, chroma, tone } = hct;
	if (tone <= 0) return "#000000";
	if (tone >= 100) return "#FFFFFF";
	if (chroma < .5) {
		const gray = toneToGray(tone);
		return formatHex(gray, gray, gray);
	}
	let lo = 0;
	let hi = chroma;
	let bestHex = "#000000";
	for (let i = 0; i < 16; i++) {
		const mid = (lo + hi) / 2;
		const candidate = hctComponentToHex(hue, mid, tone);
		if (candidate !== null) {
			bestHex = candidate;
			lo = mid;
		} else hi = mid;
	}
	return bestHex;
}
function toneToGray(tone) {
	return linearToSrgb(toneToY(tone));
}
function hctComponentToHex(hue, chroma, tone) {
	const hueRad = hue * Math.PI / 180;
	const [x, y, z] = labToXyz(tone, Math.cos(hueRad) * chroma, Math.sin(hueRad) * chroma);
	const [lr, lg, lb] = xyzToLinearRgb(x, y, z);
	const r = linearToSrgb(lr);
	const g = linearToSrgb(lg);
	const bVal = linearToSrgb(lb);
	const rLin = srgbToLinear(r);
	const gLin = srgbToLinear(g);
	const bLin = srgbToLinear(bVal);
	const tolerance = .02;
	if (Math.abs(rLin - lr) > tolerance || Math.abs(gLin - lg) > tolerance || Math.abs(bLin - lb) > tolerance) return null;
	if (r < 0 || r > 255 || g < 0 || g > 255 || bVal < 0 || bVal > 255) return null;
	return formatHex(r, g, bVal);
}
var PALETTE_TONES = [
	0,
	5,
	10,
	20,
	30,
	40,
	50,
	60,
	70,
	80,
	90,
	95,
	99,
	100
];
/**
* Generate a tonal palette: hex colors at standard tones
* for a given hue and chroma.
*/
function tonalPalette(hue, chroma) {
	const result = {};
	for (const tone of PALETTE_TONES) result[tone] = hctToHex({
		hue,
		chroma,
		tone
	});
	return result;
}
/**
* Append alpha (0-1) to a hex color as a 2-digit hex suffix.
*/
function hexWithAlpha(hex, alpha) {
	return hex + Math.round(alpha * 255).toString(16).padStart(2, "0").toUpperCase();
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/theme/expandColorScale.js
/**
* @file expandColorScale.ts
* @input Color scale configuration { accent?, neutralStyle?, contrast? }
* @output Token overrides for derivable color tokens
* @position Theme utility; consumed by defineTheme.ts
*
* Generates color token overrides from an accent seed using the HCT
* perceptual color model. Only produces tokens that meaningfully
* derive from the accent — status colors, categorical hues, and fixed
* tokens (on-dark/on-light) fall through to colorDefaults.
*
* `accent` is optional: a neutral-only config still gets the full neutral
* ramp (seeded from the default accent's hue) while the accent tokens
* themselves fall through to colorDefaults, same as the tokens above.
*
* `accent` also accepts a `[light, dark]` tuple (matching `TokenValue` in
* defineTheme). A tuple seeds each color scheme from its own half: the
* light side of every generated `light-dark()` pair derives from the light
* accent's palettes, the dark side from the dark accent's. A plain string
* seeds both sides identically, token for token the same output as before
* tuples existed.
*
* WCAG contrast guarantees (asserted in expandColorScale.test.ts):
* - Text tones are guaranteed >= 4.5:1 against their surfaces by tone
*   spacing alone — HCT tone is CIE L*, which fixes relative luminance
*   regardless of hue/chroma, so the fixed tone assignments hold for any
*   accent/neutralStyle (WCAG 1.4.3), and each half of a tuple pairs with
*   surfaces derived from that same seed.
* - --color-border-emphasized (form-control boundaries) is tone-bumped
*   until it reaches >= 3:1 against the generated surface (WCAG 1.4.11).
* - --color-border, --color-skeleton, and --color-track are intentionally
*   decorative/redundant cues and are NOT held to 3:1 — see the test file
*   for the rationale.
*
* SYNC: When modified, update:
* - /packages/core/src/theme/defineTheme.ts
* - /packages/cli/assets/theme.template.ts (the annotated field reference)
*/
/**
* Color scale configuration.
*
* @example
* ```
* // Minimal — just a seed color
* { accent: '#0064E0' }
*
* // Per-scheme seeds: light palettes from '#0064E0', dark from '#48CAE4'
* { accent: ['#0064E0', '#48CAE4'] }
*
* // With customization
* { accent: '#B7410E', neutralStyle: 'warm', contrast: 'high' }
*
* // Neutral-only — keeps the default accent, themes the neutrals
* { neutralStyle: 'warm' }
* ```
*/
var NEUTRAL_CHROMA = {
	warm: 7,
	cool: 5,
	neutral: 3
};
var NEUTRAL_VARIANT_CHROMA = {
	warm: 10,
	cool: 8,
	neutral: 6
};
/**
* Hue source for accent-less configs — the light half of
* colorDefaults['--color-accent'] (a test guards the two against drift).
* Only its hue reaches the output: the accent tokens stay ungenerated, so
* they keep their colorDefaults values rather than this seed's derivation.
*/
var DEFAULT_ACCENT_SEED = "#0064E0";
function ld(light, dark) {
	return `light-dark(${light}, ${dark})`;
}
function accentWithAlpha(alpha) {
	return `color-mix(in srgb, var(--color-accent) ${alpha * 100}%, transparent)`;
}
/** WCAG 1.4.11 minimum contrast for non-text UI boundaries. */
var NON_TEXT_MIN_CONTRAST = 3;
/**
* Walk tone in `step` increments from `startTone` until the color reaches
* `minRatio` against `background`, and return the resulting hex.
*
* Used for tokens whose preferred tone is not guaranteed by tone spacing
* alone (e.g. --color-border-emphasized). Because HCT tone is CIE L*,
* each step moves luminance monotonically, so the loop always terminates —
* at worst at pure black/white (21:1 against anything mid-range).
*/
function ensureContrastTone(hue, chroma, startTone, step, background, minRatio) {
	let tone = startTone;
	let hex = hctToHex({
		hue,
		chroma,
		tone
	});
	while (contrastRatio(hex, background) < minRatio && tone + step >= 0 && tone + step <= 100) {
		tone += step;
		hex = hctToHex({
			hue,
			chroma,
			tone
		});
	}
	return hex;
}
/**
* Expand a color scale config into Astryx color token overrides.
*
* Only generates tokens that meaningfully derive from the accent color.
* Tokens that are convention-bound (status colors, categorical hues,
* --color-on-dark/on-light) are NOT generated — they fall through
* to colorDefaults.
*
* A `[light, dark]` tuple accent seeds each scheme separately: the light
* half of every generated `light-dark()` pair comes from the light seed's
* palettes, the dark half from the dark seed's. A string accent seeds both
* halves from the same palettes, exactly as before tuples were supported.
*
* Without an `accent`, the accent tokens join that fall-through set: the
* neutrals are seeded from the default accent's hue, and --color-accent,
* --color-accent-muted and --color-on-accent keep their colorDefaults values.
*
* @example
* ```
* const tokens = expandColorScale({ accent: '#0064E0' });
* // tokens['--color-accent'] === 'light-dark(#..., #...)'
*
* const perScheme = expandColorScale({ accent: ['#0064E0', '#48CAE4'] });
* // light half derives from #0064E0, dark half from #48CAE4
*
* const neutralOnly = expandColorScale({ neutralStyle: 'warm' });
* // neutralOnly['--color-accent'] === undefined
* ```
*/
function expandColorScale(config) {
	const { accent, neutralStyle = "cool", contrast = "standard" } = config;
	const [lightAccent, darkAccent] = Array.isArray(accent) ? accent : [accent, accent];
	const lightSeed = hexToHct(lightAccent ?? DEFAULT_ACCENT_SEED);
	const sameSeed = darkAccent === lightAccent;
	const darkSeed = sameSeed ? lightSeed : hexToHct(darkAccent ?? DEFAULT_ACCENT_SEED);
	const neutralChroma = NEUTRAL_CHROMA[neutralStyle] ?? 5;
	const neutralVariantChroma = NEUTRAL_VARIANT_CHROMA[neutralStyle] ?? 8;
	const PL = tonalPalette(lightSeed.hue, Math.max(lightSeed.chroma, 48));
	const NL = tonalPalette(lightSeed.hue, neutralChroma);
	const NVL = tonalPalette(lightSeed.hue, neutralVariantChroma);
	const PD = sameSeed ? PL : tonalPalette(darkSeed.hue, Math.max(darkSeed.chroma, 48));
	const ND = sameSeed ? NL : tonalPalette(darkSeed.hue, neutralChroma);
	const NVD = sameSeed ? NVL : tonalPalette(darkSeed.hue, neutralVariantChroma);
	const isHigh = contrast === "high";
	const textPrimaryLightTone = isHigh ? 0 : 10;
	const textPrimaryDarkTone = isHigh ? 99 : 90;
	const textSecondaryLightTone = isHigh ? 20 : 30;
	const textSecondaryDarkTone = isHigh ? 80 : 70;
	const borderSubtleAlpha = isHigh ? .2 : .1;
	const borderEmphasizedStartLight = isHigh ? 50 : 70;
	const borderEmphasizedStartDark = isHigh ? 50 : 30;
	const borderEmphasized = ld(ensureContrastTone(lightSeed.hue, neutralVariantChroma, borderEmphasizedStartLight, -1, NL[99], NON_TEXT_MIN_CONTRAST), ensureContrastTone(darkSeed.hue, neutralVariantChroma, borderEmphasizedStartDark, 1, ND[10], NON_TEXT_MIN_CONTRAST));
	return {
		...accent != null ? {
			"--color-accent": ld(PL[40], PD[80]),
			"--color-accent-muted": ld(accentWithAlpha(.2), accentWithAlpha(.25)),
			"--color-on-accent": ld(PL[100], PD[20])
		} : null,
		"--color-neutral": ld(hexWithAlpha(NL[10], .1), hexWithAlpha(ND[90], .2)),
		"--color-background-surface": ld(NL[99], ND[10]),
		"--color-background-body": ld(NL[95], ND[5]),
		"--color-overlay": ld(hexWithAlpha(NL[10], .4), hexWithAlpha(ND[10], .6)),
		"--color-overlay-hover": ld(hexWithAlpha(NL[10], .05), hexWithAlpha(ND[100], .05)),
		"--color-overlay-pressed": ld(hexWithAlpha(NL[10], .1), hexWithAlpha(ND[100], .1)),
		"--color-background-muted": ld(hexWithAlpha(NL[10], .05), hexWithAlpha(ND[10], .5)),
		"--color-text-primary": ld(NL[textPrimaryLightTone], ND[textPrimaryDarkTone]),
		"--color-text-secondary": ld(NVL[textSecondaryLightTone], NVD[textSecondaryDarkTone]),
		"--color-text-disabled": ld(NVL[60], NVD[40]),
		"--color-text-accent": "var(--color-accent)",
		"--color-icon-accent": "var(--color-accent)",
		"--color-icon-primary": ld(NL[textPrimaryLightTone], ND[textPrimaryDarkTone]),
		"--color-icon-secondary": ld(NVL[textSecondaryLightTone], NVD[textSecondaryDarkTone]),
		"--color-icon-disabled": ld(NVL[60], NVD[40]),
		"--color-background-card": ld(NL[99], ND[10]),
		"--color-background-popover": ld(NL[99], ND[20]),
		"--color-background-inverted": ld(NL[10], ND[99]),
		"--color-border": ld(hexWithAlpha(NL[10], borderSubtleAlpha), hexWithAlpha(ND[95], borderSubtleAlpha)),
		"--color-border-emphasized": borderEmphasized,
		"--color-skeleton": ld(NVL[70], NVD[30]),
		"--color-track": ld(NVL[70], NVD[30]),
		"--color-shadow": ld(hexWithAlpha(NL[0], .1), hexWithAlpha(ND[0], .3)),
		"--color-tint-hover": ld("black", "white")
	};
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/theme/syntax/tokens.js
/**
* @file tokens.ts
* @input None (pure token definitions)
* @output syntaxTokenDefaults, SyntaxTokenName
* @position Domain token sub-module; re-exported from domainTokens/index.ts
*
* Code syntax highlighting tokens. Used by the CodeBlock component and any
* consumer that renders highlighted source code.
*
* Default values reference the theme's named palette via var() so syntax
* colors automatically adapt to any theme's color system. Themes can also
* set an explicit syntax theme via defineTheme({ syntax: dracula }).
*
* 14-token architecture validated against 11 community code themes.
* All themes map cleanly to these 14 slots.
*
* @see https://github.com/facebook/astryx/issues/1148
*/
var syntaxTokenDefaults = {
	"--color-syntax-keyword": "var(--color-text-accent)",
	"--color-syntax-string": "var(--color-text-green)",
	"--color-syntax-comment": "var(--color-text-secondary)",
	"--color-syntax-number": "var(--color-text-orange)",
	"--color-syntax-function": "var(--color-text-blue)",
	"--color-syntax-type": "var(--color-text-purple)",
	"--color-syntax-variable": "var(--color-text-primary)",
	"--color-syntax-operator": "var(--color-text-cyan)",
	"--color-syntax-constant": "var(--color-text-orange)",
	"--color-syntax-tag": "var(--color-text-red)",
	"--color-syntax-attribute": "var(--color-text-teal)",
	"--color-syntax-property": "var(--color-text-cyan)",
	"--color-syntax-punctuation": "var(--color-text-secondary)",
	"--color-syntax-background": "var(--color-background-muted)"
};
//#endregion
//#region node_modules/@astryxdesign/core/dist/theme/domainTokens/dataTokens.js
/**
* @file dataTokens.ts
* @input None (pure token definitions)
* @output dataTokenDefaults, DataTokenName
* @position Domain token sub-module; re-exported from domainTokens/index.ts
*
* Data visualization tokens. Used by chart and graph components to maintain
* consistent, theme-aware color palettes across all data vis surfaces.
*
* Token structure:
* - Categorical: one accent per category (use for distinct series/dimensions)
* - Neutral: a single neutral tone (use for labels, reference lines, empty states)
* - Sequential ramps (color-5 → color-1): darkest → lightest within a hue.
*   Use for ordered/quantitative scales, heatmaps, choropleth maps.
*/
var dataTokenDefaults = {
	"--color-data-categorical-blue": "light-dark(#0171E3, #0171E3)",
	"--color-data-categorical-orange": "light-dark(#EB6E00, #EB6E00)",
	"--color-data-categorical-purple": "light-dark(#6B1EFD, #6B1EFD)",
	"--color-data-categorical-green": "light-dark(#0B991F, #0B991F)",
	"--color-data-categorical-pink": "light-dark(#F351C0, #F351C0)",
	"--color-data-categorical-cyan": "light-dark(#0171A4, #0171A4)",
	"--color-data-categorical-red": "light-dark(#F5394F, #F5394F)",
	"--color-data-categorical-teal": "light-dark(#08A3A3, #08A3A3)",
	"--color-data-categorical-brown": "light-dark(#965E03, #965E03)",
	"--color-data-categorical-indigo": "light-dark(#6F8AFF, #6F8AFF)",
	"--color-data-neutral": "light-dark(#8494A3, #8C939B)",
	"--color-data-blue-5": "light-dark(#02165E, #02165E)",
	"--color-data-blue-4": "light-dark(#004CBC, #004CBC)",
	"--color-data-blue-3": "light-dark(#2694FE, #2694FE)",
	"--color-data-blue-2": "light-dark(#78BEFF, #78BEFF)",
	"--color-data-blue-1": "light-dark(#DBECFF, #DBECFF)",
	"--color-data-shamrock-5": "light-dark(#0B603D, #0B603D)",
	"--color-data-shamrock-4": "light-dark(#138546, #138546)",
	"--color-data-shamrock-3": "light-dark(#24BB5E, #24BB5E)",
	"--color-data-shamrock-2": "light-dark(#8EF7AA, #8EF7AA)",
	"--color-data-shamrock-1": "light-dark(#D6FEE4, #D6FEE4)",
	"--color-data-orange-5": "light-dark(#A13F04, #A13F04)",
	"--color-data-orange-4": "light-dark(#D66100, #D66100)",
	"--color-data-orange-3": "light-dark(#FD9537, #FD9537)",
	"--color-data-orange-2": "light-dark(#FDB876, #FDB876)",
	"--color-data-orange-1": "light-dark(#FFE6CF, #FFE6CF)",
	"--color-data-pink-5": "light-dark(#8E1073, #8E1073)",
	"--color-data-pink-4": "light-dark(#D123A1, #D123A1)",
	"--color-data-pink-3": "light-dark(#F989D3, #F989D3)",
	"--color-data-pink-2": "light-dark(#FEADE3, #FEADE3)",
	"--color-data-pink-1": "light-dark(#FCE3F4, #FCE3F4)",
	"--color-data-purple-5": "light-dark(#3E0697, #3E0697)",
	"--color-data-purple-4": "light-dark(#6B1EFD, #6B1EFD)",
	"--color-data-purple-3": "light-dark(#9081FF, #9081FF)",
	"--color-data-purple-2": "light-dark(#B3B0FE, #B3B0FE)",
	"--color-data-purple-1": "light-dark(#E8E8FB, #E8E8FB)",
	"--color-data-red-5": "light-dark(#9D0519, #9D0519)",
	"--color-data-red-4": "light-dark(#D31130, #D31130)",
	"--color-data-red-3": "light-dark(#FB7D87, #FB7D87)",
	"--color-data-red-2": "light-dark(#FFB2B8, #FFB2B8)",
	"--color-data-red-1": "light-dark(#FEE4E6, #FEE4E6)",
	"--color-data-teal-5": "light-dark(#08767D, #08767D)",
	"--color-data-teal-4": "light-dark(#0C9293, #0C9293)",
	"--color-data-teal-3": "light-dark(#0DB7AF, #0DB7AF)",
	"--color-data-teal-2": "light-dark(#6CE6D8, #6CE6D8)",
	"--color-data-teal-1": "light-dark(#D7FCF8, #D7FCF8)",
	"--color-data-yellow-5": "light-dark(#8A5001, #8A5001)",
	"--color-data-yellow-4": "light-dark(#D69804, #D69804)",
	"--color-data-yellow-3": "light-dark(#FBCE03, #FBCE03)",
	"--color-data-yellow-2": "light-dark(#FCEC85, #FCEC85)",
	"--color-data-yellow-1": "light-dark(#FDF6BA, #FDF6BA)",
	"--color-data-gray-5": "light-dark(#25363F, #333338)",
	"--color-data-gray-4": "light-dark(#5D6C7B, #666A72)",
	"--color-data-gray-3": "light-dark(#AFB9C4, #B2B8BE)",
	"--color-data-gray-2": "light-dark(#CCD3DB, #D0D3D6)",
	"--color-data-gray-1": "light-dark(#F1F4F7, #F2F4F6)"
};
//#endregion
//#region node_modules/@astryxdesign/core/dist/theme/domainTokens/index.js
/** All domain token defaults merged — used by defineTheme for validation */
var domainTokenDefaults = {
	...syntaxTokenDefaults,
	...dataTokenDefaults
};
/** Union of all domain token names */
//#endregion
//#region node_modules/@astryxdesign/core/dist/theme/themeRegistry.js
/**
* @file themeRegistry.ts
* @input DefinedTheme objects from defineTheme() or built theme packages
* @output Exports registerTheme, getRegisteredTheme, getRegisteredThemes, resetThemes
* @position Server-safe theme registry for theme-name-based SSR resolution
*
* This module has NO 'use client' directive. It is importable from SSR/RSC and
* lets code resolve theme data by stable theme name without React context.
*/
var themeRegistry = /* @__PURE__ */ new Map();
/**
* Register a defined theme under its `name`.
*
* Registration is idempotent and replaces any previous theme with the same
* name. Call from app initialization, theme packages, or <Theme> to make the
* theme available to SSR-safe resolvers by name.
*/
function registerTheme(theme) {
	themeRegistry.set(theme.name, theme);
}
/**
* Return a previously registered theme by name.
*/
function getRegisteredTheme(name) {
	if (name == null || name === "") return null;
	return themeRegistry.get(name) ?? null;
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/utils/parseStyleKey.js
/**
* Parse a component style key into a CSS selector suffix.
*
* Used by both defineTheme (CSS generation) and components (class name rendering)
* to ensure the same convention is applied consistently.
*
* <!-- SYNC: packages/core/src/utils/themeProps.ts -->
*
* Emits the legacy class-selector suffix used by defineTheme/component override
* generation today. Components also reflect the same prop values as data
* attributes via `themeProps()` (`variant:secondary` renders both `.secondary`
* and `[data-variant="secondary"]` in the DOM), but generated theme CSS still
* uses these class selectors until the selector contract migrates fully.
*
* Values starting with a digit get prefixed with the prop name since
* CSS class names can't start with a number.
*
* Bare state names (no colon) are used directly as class names.
* This supports state-based theming targets like 'checked', 'disabled',
* 'selected' documented in the Theming Infrastructure wiki.
*
* @example
* ```ts
* parseStyleKey('base')                        // ''
* parseStyleKey('checked')                      // '.checked'
* parseStyleKey('checked+disabled')             // '.checked.disabled'
* parseStyleKey('variant:secondary')            // '.secondary'
* parseStyleKey('level:1')                      // '.level-1'
* parseStyleKey('variant:destructive+size:sm')  // '.destructive.sm'
* ```
*/
function parseStyleKey(key) {
	if (key === "base") return "";
	return key.split("+").map((part) => {
		const [prop, value] = part.split(":");
		if (value === void 0) return `.${prop}`;
		if (/^\d/.test(value)) return `.${prop}-${value}`;
		return `.${value}`;
	}).join("");
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/theme/derivedVarRegistry.js
/**
* @file Derived variable registry — maps CSS properties to internal vars.
*
* Used by generateThemeRules to expand standard CSS properties (borderRadius,
* padding) into internal CSS custom properties that components read.
*
* This is a compiled registry — the source of truth lives in each component's
* doc file (theming.derived). The consistency test in derivedVarRegistry.test.ts
* verifies this file stays in sync with the docs.
*
* When adding a new component with derived vars:
* 1. Add the `derived` field to the component's doc.mjs file
* 2. Add the corresponding entry here
* 3. The consistency test will catch any drift
*
* @position Core theme infrastructure — read by generateThemeRules at runtime
*/
/**
* Component → derived var mappings.
*
* Keys are lowercase component names (matching defineTheme component keys).
* Values are ordered arrays — earlier entries emit first when multiple
* entries share the same property.
*/
var derivedVarRegistry = {
	avatar: [{
		property: "borderRadius",
		vars: ["--_avatar-radius"]
	}],
	banner: [{
		property: "borderRadius",
		vars: ["--_banner-radius"]
	}],
	button: [{
		property: "borderRadius",
		vars: ["--_button-radius"]
	}],
	card: [{
		property: "borderRadius",
		vars: ["--_card-radius"]
	}, {
		property: "padding",
		expand: "container"
	}],
	chat: [{
		property: "borderRadius",
		vars: ["--_chat-composer-radius"]
	}, {
		property: "padding",
		vars: ["--_chat-composer-padding"]
	}],
	dialog: [{
		property: "borderRadius",
		vars: ["--_dialog-radius"]
	}, {
		property: "padding",
		expand: "container"
	}],
	"context-menu": [{
		property: "borderRadius",
		vars: ["--_dropdown-menu-radius"]
	}, {
		property: "padding",
		vars: ["--_dropdown-menu-padding"]
	}],
	"dropdown-menu": [{
		property: "borderRadius",
		vars: ["--_dropdown-menu-radius"]
	}, {
		property: "padding",
		vars: ["--_dropdown-menu-padding"]
	}],
	field: [{
		property: "borderRadius",
		vars: ["--_field-radius"]
	}],
	"hover-card": [{
		property: "borderRadius",
		vars: ["--_hovercard-radius"]
	}],
	"number-input": [{
		property: "padding",
		expand: "container"
	}, {
		property: "borderRadius",
		vars: ["--_field-radius"]
	}],
	popover: [{
		property: "borderRadius",
		vars: ["--_popover-radius"]
	}],
	"progress-bar-mark": [{
		property: "width",
		vars: ["--_progressbar-mark-width"],
		replaces: true
	}, {
		property: "height",
		vars: ["--_progressbar-mark-height"],
		replaces: true
	}],
	section: [{
		property: "padding",
		expand: "container"
	}],
	"segmented-control": [{
		property: "borderRadius",
		vars: ["--_segmented-control-radius"]
	}, {
		property: "padding",
		vars: ["--_segmented-control-padding"]
	}],
	"text-area": [{
		property: "paddingInline",
		vars: ["--_textarea-inline-padding"],
		replaces: true
	}]
};
/**
* Deprecated component keys → the key that superseded them.
*
* A renamed target keeps emitting its old class, so a theme written against
* the old key still selects the element. Without this the rule would land but
* its derived vars would not expand, and the half that travels through a var
* (a hover card's radius, a text area's inline padding) would silently do
* nothing. Drop these with the classes, in the next major.
*/
var DEPRECATED_REGISTRY_KEYS = {
	hovercard: "hover-card",
	"progressbar-mark": "progress-bar-mark",
	textarea: "text-area"
};
/**
* Look up derived var entries for a component + CSS property.
* Returns matching entries in priority order, or empty array if none.
*/
function getDerivedVars(component, property) {
	const renamedTo = DEPRECATED_REGISTRY_KEYS[component];
	const entries = derivedVarRegistry[component] ?? (renamedTo ? derivedVarRegistry[renamedTo] : void 0);
	if (!entries) return [];
	return entries.filter((e) => e.property === property);
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/naming.js
/**
* @file naming.ts
* @input None (pure constants/helpers)
* @output Centralized namespace-prefix constants and helpers for all
*   externally-observable name surfaces: CSS classes, data attributes,
*   CSS custom properties, and CSS layer names.
* @position Single source of truth consumed by the runtime (components,
*   theme generation) AND by build/CLI tooling (build-theme.mjs, discovery)
*   via the `@astryxdesign/core/naming` subpath export.
*
* ## Why this module exists
*
* The namespace prefix `astryx` is part of several externally-observable
* contracts (`.astryx-button` classes, `data-astryx-theme` attributes,
* `--astryx-card-padding` custom properties). Historically each of these was
* hardcoded independently across the runtime, the theme build pipeline, and
* discovery tooling, kept in sync only by `<!-- SYNC: ... -->` comments.
* Centralizing the prefix here means it lives in ONE place instead of
* hundreds of literals.
*
* ## Surfaces
*
* - CSS classes: `.astryx-button` via {@link classPrefix} / {@link stableClassName}.
* - data attributes: `data-astryx-*` via {@link dataAttrNamespace} / {@link dataAttr}.
* - CSS custom properties: `--astryx-*` via {@link cssVarNamespace} / {@link cssVar}.
* - CSS layers: `astryx-base` / `astryx-theme`.
*
* SYNC: packages/core/src/utils/themeProps.ts (consumes classPrefix)
* SYNC: packages/core/src/utils/parseStyleKey.ts
* SYNC: packages/cli/src/commands/build-theme.mjs (imports @astryxdesign/core/naming)
*/
/**
* The DOM/CSS namespace prefix for all externally-observable surfaces
* (classes, theme/media data attributes, CSS custom properties).
*/
var NAMESPACE = "astryx";
/**
* Class-name prefix for stable component classes, WITHOUT the trailing dash.
*
* Use {@link stableClassName} to build a full class token rather than
* concatenating this directly.
*/
var classPrefix = NAMESPACE;
/**
* data-attribute namespace segment (the part between `data-` and the rest).
* e.g. `dataAttrNamespace` = 'astryx' -> `data-astryx-theme`.
*/
var dataAttrNamespace = NAMESPACE;
/**
* CSS custom-property namespace segment.
* e.g. `--astryx-card-padding`.
*/
var cssVarNamespace = NAMESPACE;
/**
* Build a stable component class token, e.g. `stableClassName('button')`
* -> `'astryx-button'`.
*/
function stableClassName(component) {
	return `${classPrefix}-${component}`;
}
/**
* Build a `data-*` attribute name in the current namespace, e.g.
* `dataAttr('theme')` -> `'data-astryx-theme'`.
*/
function dataAttr(name) {
	return `data-${dataAttrNamespace}-${name}`;
}
/**
* Build a CSS custom-property name in the current namespace, e.g.
* `cssVar('card-padding')` -> `'--astryx-card-padding'`.
*/
function cssVar(name) {
	return `--${cssVarNamespace}-${name}`;
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/theme/generateThemeRules.js
/**
* @file Theme CSS generation utilities
*
* Shared logic for generating CSS rules from a resolved theme definition.
* Used by both the runtime path (Theme injects <style>) and the build
* path (`astryx theme build` pre-compiles to CSS files).
*
* Extracted from defineTheme.ts to reduce cyclomatic complexity and provide
* a clear single-responsibility module for CSS generation.
*
* @input DefinedTheme (resolved theme object from defineTheme)
* @output CSS rule strings, split by layer (component vs prose)
* @position packages/core/src/theme/generateThemeRules.ts
*/
/**
* Theme @scope selectors.
*
* Theme CSS is @scope'd to the theme-name data attribute that Theme writes
* (`data-astryx-theme`).
*
* @example themeScopeStart('mytheme')
*   -> '[data-astryx-theme="mytheme"]'
*/
function themeScopeStart(name) {
	return `[data-${dataAttrNamespace}-theme="${name}"]`;
}
/** Scope limit matching the theme attribute (nested-theme boundary). */
var THEME_SCOPE_TO = `[data-${dataAttrNamespace}-theme]`;
/** Media-surface selector, e.g. for [data-astryx-media="dark"]. */
function mediaSelector(surface) {
	return `[data-${dataAttrNamespace}-media="${surface}"]`;
}
/** Component base-class selector, e.g. '.astryx-button'. */
function componentClassSelector(component, suffix) {
	return `.${classPrefix}-${component}${suffix}`;
}
/**
* Guard appended to a themed `:hover` rule so it cannot match a disabled
* element.
*
* A theme authoring `':hover': {backgroundColor: …}` is describing the
* enabled control; `:hover` on its own would paint that background on a
* disabled one too, because browsers suppress a disabled control's events,
* not its hover styling. `:where()` contributes no specificity, so a themed
* hover rule still weighs exactly what it weighed before.
*
* Mirrors the `@astryx/no-hover-on-disabled` lint rule, which enforces the
* same guard on the components' own StyleX styles.
*/
var HOVER_DISABLED_GUARD = ":where(:not(:disabled,[aria-disabled=\"true\"]))";
/**
* Append a pseudo-class to every selector in a comma-separated selector list.
*
* Selector helpers may emit comma-separated lists. CSS does not distribute a
* trailing pseudo over selector lists, so `${list}:hover` would only target the
* final selector. Rewrite each item so the pseudo applies to all of them.
*
* A `:hover` pseudo also picks up the disabled guard. A pseudo-ELEMENT has to
* end the selector, so the guard is spliced in before it.
*/
function appendPseudoToSelectorList(selector, pseudo) {
	const parts = [];
	let depth = 0;
	let start = 0;
	for (let i = 0; i < selector.length; i++) {
		const char = selector[i];
		if (char === "(") depth++;
		else if (char === ")") depth = Math.max(0, depth - 1);
		else if (char === "," && depth === 0) {
			parts.push(selector.slice(start, i).trim());
			start = i + 1;
		}
	}
	parts.push(selector.slice(start).trim());
	const guarded = guardHoverPseudo(pseudo);
	return parts.map((part) => `${part}${guarded}`).join(", ");
}
/** Insert the disabled guard into a `:hover` pseudo, keeping any pseudo-element last. */
function guardHoverPseudo(pseudo) {
	if (!/^:hover(?![-\w])/.test(pseudo) || pseudo.includes("[aria-disabled")) return pseudo;
	const pseudoElement = pseudo.indexOf("::");
	return pseudoElement === -1 ? pseudo + HOVER_DISABLED_GUARD : pseudo.slice(0, pseudoElement) + HOVER_DISABLED_GUARD + pseudo.slice(pseudoElement);
}
/**
* Structured output from generateThemeRulesSplit.
* Separates prose element defaults from component/token overrides
* so callers can place them in different CSS layers.
*/
/**
* Output from generateThemeCSS — two CSS blocks for different layers.
*/
/** Convert camelCase CSS property to kebab-case */
function toKebabCase(str) {
	return str.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}
/** Padding properties that trigger container token mapping */
var PADDING_PROPS = /* @__PURE__ */ new Set([
	"padding",
	"paddingBlock",
	"paddingInline",
	"paddingBlockStart",
	"paddingBlockEnd",
	"paddingInlineStart",
	"paddingInlineEnd"
]);
/**
* Physical block-axis longhands, and the logical longhand each one *is* in
* every horizontal writing mode. Normalizing them costs no direction
* assumption, which is why they can join the container expansion.
*
* `paddingLeft`/`paddingRight` are deliberately absent. They are
* direction-relative — left is inline-start in LTR and inline-end in RTL — and
* the expansion's tokens are consumed by logical properties, so mapping them
* would put the padding on the opposite edge in RTL. They keep their physical
* meaning and land on the element as `padding-left`/`padding-right`; the cost
* is that a component's internals cannot see them.
*/
var PHYSICAL_BLOCK_PADDING_PROPS = {
	paddingTop: "paddingBlockStart",
	paddingBottom: "paddingBlockEnd"
};
/**
* Every padding spelling the container expansion consumes. Kept separate from
* PADDING_PROPS, which also routes longhands to `vars`-style derived entries —
* those carry one value for the whole box, so a single physical edge must not
* reach them.
*/
var CONTAINER_PADDING_PROPS = /* @__PURE__ */ new Set([...PADDING_PROPS, ...Object.keys(PHYSICAL_BLOCK_PADDING_PROPS)]);
/**
* Parse CSS padding shorthand/longhand into block/inline values.
* Supports 1-3 value shorthands, logical properties, and the physical block
* longhands normalized by PHYSICAL_BLOCK_PADDING_PROPS.
*/
function parsePadding(props) {
	const result = {};
	for (const [rawProp, value] of props) switch (PHYSICAL_BLOCK_PADDING_PROPS[rawProp] ?? rawProp) {
		case "padding": {
			const parts = value.trim().split(/\s+/);
			if (parts.length === 1) {
				result.blockStart = parts[0];
				result.blockEnd = parts[0];
				result.inline = parts[0];
			} else if (parts.length === 2) {
				result.blockStart = parts[0];
				result.blockEnd = parts[0];
				result.inline = parts[1];
			} else if (parts.length >= 3) {
				result.blockStart = parts[0];
				result.inline = parts[1];
				result.blockEnd = parts[2];
			}
			break;
		}
		case "paddingBlock": {
			const parts = value.trim().split(/\s+/);
			result.blockStart = parts[0];
			result.blockEnd = parts[1] ?? parts[0];
			break;
		}
		case "paddingInline": {
			const parts = value.trim().split(/\s+/);
			if (parts.length === 1) result.inline = parts[0];
			else {
				result.inlineStart = parts[0];
				result.inlineEnd = parts[1];
			}
			break;
		}
		case "paddingBlockStart":
			result.blockStart = value;
			break;
		case "paddingBlockEnd":
			result.blockEnd = value;
			break;
		case "paddingInlineStart":
			result.inlineStart = value;
			break;
		case "paddingInlineEnd": result.inlineEnd = value;
	}
	return result;
}
/**
* Expand parsed padding into component-scoped public tokens.
*
* Emits the rebranded --astryx-<component>-padding tokens (shorthand +
* directional overrides), e.g.:
*   --astryx-card-padding: 20px
*   --astryx-card-padding-inline: 20px
*   --astryx-card-padding-block-start: 20px
*   --astryx-card-padding-block-end: 20px
*
* The component reads these with an inverted fallback chain
* (var(--astryx-*, default)). The container.stylex.ts default styles read
* these via var() fallbacks,
* so the theme CSS sets the value and the component picks it up through
* CSS custom property cascade — no layer competition with StyleX output.
*/
function expandContainerPadding(component, parsed) {
	const prefix = cssVar(`${component}-padding`);
	const tokens = [];
	const effectiveInlineStart = parsed.inlineStart ?? parsed.inline;
	const effectiveInlineEnd = parsed.inlineEnd ?? parsed.inline;
	if (effectiveInlineStart != null && effectiveInlineEnd != null && effectiveInlineStart === effectiveInlineEnd && parsed.blockStart != null && parsed.blockEnd != null && effectiveInlineStart === parsed.blockStart && parsed.blockStart === parsed.blockEnd) {
		tokens.push([prefix, effectiveInlineStart ?? ""]);
		return tokens;
	}
	if (parsed.inlineStart != null || parsed.inlineEnd != null) {
		if (effectiveInlineStart != null) tokens.push([`${prefix}-inline-start`, effectiveInlineStart]);
		if (effectiveInlineEnd != null) tokens.push([`${prefix}-inline-end`, effectiveInlineEnd]);
	} else if (parsed.inline != null) tokens.push([`${prefix}-inline`, parsed.inline]);
	if (parsed.blockStart != null) tokens.push([`${prefix}-block-start`, parsed.blockStart]);
	if (parsed.blockEnd != null) tokens.push([`${prefix}-block-end`, parsed.blockEnd]);
	return tokens;
}
/**
* Generate the intermediary CSS rules for a theme.
*
* Returns an array of CSS rule strings — the shared format used by both
* the runtime path (useInsertionEffect) and the build path (astryx theme build).
*/
function generateThemeRules(theme) {
	const parts = [];
	const tokens = theme.tokens;
	const val = (key) => tokens[key] || `var(${key})`;
	const tokenEntries = Object.entries(tokens);
	if (tokenEntries.length > 0) {
		const declarations = tokenEntries.map(([prop, value]) => `    ${prop}: ${value};`).join("\n");
		parts.push(`  :scope {\n${declarations}\n  }`);
	}
	if (theme.components) generateComponentRules(theme.components, parts);
	generateProseRules(val, parts);
	generateColorOverrides(theme.components || {}, parts);
	generateSizeOverrides(theme.components || {}, parts);
	return parts;
}
/**
* Generate component override rules using the .astryx-* class selector
* format. Runtime components also emit matching data-* prop reflections; the
* theme CSS generator will move to data-attribute selectors in a later step.
* Handles derived var expansion and container padding mapping.
*/
function generateComponentRules(components, parts) {
	for (const [component, rules] of Object.entries(components)) for (const [key, styles] of Object.entries(rules)) {
		const entries = Object.entries(styles);
		if (entries.length === 0) continue;
		const baseSelector = componentClassSelector(component, parseStyleKey(key));
		const props = [];
		const pseudos = [];
		for (const [prop, value] of entries) if (prop.startsWith(":") && typeof value === "object") pseudos.push([prop, value]);
		else props.push([prop, value]);
		let finalProps = props;
		const derivedProps = [];
		let containerExpanded = false;
		const replacedProps = /* @__PURE__ */ new Set();
		for (const [prop, value] of props) {
			const derived = getDerivedVars(component, prop);
			const paddingDerived = PADDING_PROPS.has(prop) && prop !== "padding" ? getDerivedVars(component, "padding") : [];
			for (const entry of [...derived, ...paddingDerived]) {
				if (entry.expand === "container" && PADDING_PROPS.has(prop)) containerExpanded = true;
				if (entry.replaces) replacedProps.add(prop);
				if (entry.vars) for (const varName of entry.vars) derivedProps.push([varName, value]);
			}
			if (prop in PHYSICAL_BLOCK_PADDING_PROPS && getDerivedVars(component, "padding").some((e) => e.expand === "container")) containerExpanded = true;
		}
		if (containerExpanded) {
			const paddingProps = props.filter(([p]) => CONTAINER_PADDING_PROPS.has(p));
			const nonPaddingProps = props.filter(([p]) => !CONTAINER_PADDING_PROPS.has(p));
			const containerTokens = expandContainerPadding(component, parsePadding(paddingProps));
			finalProps = [...nonPaddingProps, ...containerTokens];
		}
		if (replacedProps.size > 0) finalProps = finalProps.filter(([p]) => !replacedProps.has(p));
		if (derivedProps.length > 0) finalProps = [...finalProps, ...derivedProps];
		if (finalProps.length > 0) {
			const declarations = finalProps.map(([prop, value]) => `    ${toKebabCase(prop)}: ${value};`).join("\n");
			parts.push(`  ${baseSelector} {\n${declarations}\n  }`);
		}
		for (const [pseudo, pseudoStyles] of pseudos) {
			const pseudoEntries = Object.entries(pseudoStyles);
			if (pseudoEntries.length > 0) {
				const declarations = pseudoEntries.map(([prop, value]) => `    ${toKebabCase(prop)}: ${value};`).join("\n");
				parts.push(`  ${appendPseudoToSelectorList(baseSelector, pseudo)} {\n${declarations}\n  }`);
			}
		}
	}
}
/**
* Generate prose HTML element default rules (h1-h6, p, small, code, hr).
* Wrapped in :where() for zero specificity — these are defaults that
* any class-based style (StyleX, .astryx-* overrides) should beat.
* The caller places these in the reset layer (not astryx-theme) so they
* sit below all component styles in the cascade.
*/
function generateProseRules(val, parts) {
	parts.push(`  :where(h1, h2, h3, h4, h5, h6) {
    font-family: var(--font-family-heading);
    color: var(--color-text-primary);
  }`);
	for (let level = 1; level <= 6; level++) parts.push(`  :where(h${level}) {
    font-size: ${val(`--text-heading-${level}-size`)};
    font-weight: ${val(`--text-heading-${level}-weight`)};
    line-height: ${val(`--text-heading-${level}-leading`)};
  }`);
	parts.push(`  :where(p) {
    font-family: var(--font-family-body);
    font-size: ${val("--text-body-size")};
    font-weight: ${val("--text-body-weight")};
    line-height: ${val("--text-body-leading")};
    color: var(--color-text-primary);
  }`);
	parts.push(`  :where(small) {
    font-size: ${val("--text-supporting-size")};
    font-weight: ${val("--text-supporting-weight")};
    line-height: ${val("--text-supporting-leading")};
    color: var(--color-text-secondary);
  }`);
	parts.push(`  :where(code, pre) {
    font-family: var(--font-family-code);
    font-size: ${val("--text-code-size")};
    line-height: ${val("--text-code-leading")};
  }`);
	parts.push(`  :where(hr) {
    border: none;
    border-top: 1px solid var(--color-border);
  }`);
}
/**
* Generate prop-level color override rules for text/heading/link components.
* These ensure color prop classes override theme token changes.
*/
function generateColorOverrides(components, parts) {
	const TEXT_COLOR_MAP = {
		primary: "var(--color-text-primary)",
		secondary: "var(--color-text-secondary)",
		disabled: "var(--color-text-disabled)",
		placeholder: "var(--color-text-secondary)",
		accent: "var(--color-text-accent)"
	};
	const touchesText = "text" in components;
	const touchesHeading = "heading" in components;
	const touchesLink = "link" in components;
	if (touchesText || touchesHeading || touchesLink) for (const [colorName, colorValue] of Object.entries(TEXT_COLOR_MAP)) {
		if (touchesText) parts.push(`  ${componentClassSelector("text", `.${colorName}`)} { color: ${colorValue}; }`);
		if (touchesHeading) parts.push(`  ${componentClassSelector("heading", `.${colorName}`)} { color: ${colorValue}; }`);
		if (touchesLink) parts.push(`  ${componentClassSelector("link", `.${colorName}`)} { color: ${colorValue}; }`);
	}
}
/**
* Map a Text `size` prop value to its raw font-size token.
* Mirrors `sizeStyles` in `Text/text.stylex.ts` (note `xsm` → `--font-size-xs`).
* <!-- SYNC: packages/core/src/Text/text.stylex.ts (sizeStyles) -->
*/
var TEXT_SIZE_TOKEN_MAP = {
	"4xs": "var(--font-size-4xs)",
	"3xs": "var(--font-size-3xs)",
	"2xs": "var(--font-size-2xs)",
	xsm: "var(--font-size-xs)",
	sm: "var(--font-size-sm)",
	base: "var(--font-size-base)",
	lg: "var(--font-size-lg)",
	xl: "var(--font-size-xl)",
	"2xl": "var(--font-size-2xl)",
	"3xl": "var(--font-size-3xl)",
	"4xl": "var(--font-size-4xl)"
};
/**
* Generate `size`-prop font-size overrides for the Text component.
*
* The `size` prop is documented as a font-size override that wins over the
* size implied by `type`. Its StyleX class lives in `@layer astryx-base`, but a
* theme's per-type font-size rule (`.astryx-text.<type>`) lives in the higher
* `@layer astryx-theme`, so the layer cascade let the theme silently shadow
* `size` for any `type` the theme styled. Re-emitting the size classes here —
* same layer as the type rules, same `.astryx-text.<x>` specificity, later in
* source — restores `size` as a real override.
*
* Only `font-size` is overridden; line-height and other type properties are
* intentionally preserved, matching the prop's documented contract.
*
* Gated on the theme touching `text` (which includes the auto-generated
* type-scale rules) — with no theme type rule to beat, the base-layer StyleX
* class already wins and no override is needed.
*/
function generateSizeOverrides(components, parts) {
	if (!("text" in components)) return;
	for (const [sizeName, sizeValue] of Object.entries(TEXT_SIZE_TOKEN_MAP)) {
		const suffix = parseStyleKey(`size:${sizeName}`);
		parts.push(`  ${componentClassSelector("text", suffix)} { font-size: ${sizeValue}; }`);
	}
}
/**
* Generate theme rules split into component and prose groups.
*
* Prose element rules (h1-h6, p, small, code, hr) style bare HTML elements
* as themed defaults — conceptually the same tier as the CSS reset. They
* belong in the reset layer so any class-based style wins.
*
* Component rules (tokens, .astryx-* overrides) are intentional theme overrides
* that need to beat StyleX — they stay in astryx-theme (above StyleX layers).
*/
function generateThemeRulesSplit(theme) {
	const allRules = generateThemeRules(theme);
	const prose = [];
	const component = [];
	for (const rule of allRules) if (rule.trimStart().startsWith(":where(")) prose.push(rule);
	else component.push(rule);
	return {
		component,
		prose
	};
}
/**
* Generate CSS for on-media token and component overrides.
*
* Emitted in an unbounded @scope (no `to` limit) so the rules can reach
* [data-astryx-media] elements. Parent theme component overrides flow through
* to media contexts — only tokens change. Themes can further customize
* via onDark.components / onLight.components.
*/
function generateOnMediaCSS(theme) {
	const parts = [];
	const scopeSelector = themeScopeStart(theme.name);
	for (const surface of ["dark", "light"]) {
		const onMedia = surface === "dark" ? theme.__onDark : theme.__onLight;
		if (!onMedia) continue;
		const tokenEntries = Object.entries(onMedia.tokens);
		if (tokenEntries.length > 0) {
			const declarations = tokenEntries.map(([prop, value]) => `    ${prop}: ${value};`).join("\n");
			parts.push(`  ${mediaSelector(surface)} {\n${declarations}\n  }`);
		}
		if (onMedia.components) for (const [component, rules] of Object.entries(onMedia.components)) for (const [key, styles] of Object.entries(rules)) {
			const entries = Object.entries(styles);
			if (entries.length === 0) continue;
			const suffix = parseStyleKey(key);
			const baseSelector = `:is(${mediaSelector(surface)}) :is(${componentClassSelector(component, suffix)})`;
			const props = [];
			const pseudos = [];
			for (const [prop, value] of entries) if (prop.startsWith(":") && typeof value === "object") pseudos.push([prop, value]);
			else props.push([prop, value]);
			if (props.length > 0) {
				const declarations = props.map(([prop, value]) => `    ${toKebabCase(prop)}: ${value};`).join("\n");
				parts.push(`  ${baseSelector} {\n${declarations}\n  }`);
			}
			for (const [pseudo, pseudoStyles] of pseudos) {
				const pseudoEntries = Object.entries(pseudoStyles);
				if (pseudoEntries.length > 0) {
					const declarations = pseudoEntries.map(([prop, value]) => `    ${toKebabCase(prop)}: ${value};`).join("\n");
					parts.push(`  ${appendPseudoToSelectorList(baseSelector, pseudo)} {\n${declarations}\n  }`);
				}
			}
		}
	}
	if (parts.length === 0) return "";
	return `@scope (${scopeSelector}) to (${THEME_SCOPE_TO}) {\n${parts.join("\n\n")}\n}`;
}
/**
* The `--color-data-*` defaults as one unscoped `:root` block.
*
* Core tokens reach CSS once, at `:root`, from StyleX's `defineVars` output in
* `@layer astryx-base`; a theme's own scope block then carries only the tokens
* that theme overrides, which is why a nested theme inherits its parent's
* override instead of shadowing it. Data tokens are not StyleX vars, so nothing
* declares them — this is their equivalent, and callers put it in
* `@layer astryx-base` so a theme's override wins by layer rather than by
* specificity. Seeding it per theme scope instead re-declares the default
* inside every nested theme, which is the shadowing this shape avoids.
*
* @internal Not exported from `@astryxdesign/core/theme`: the `<Theme>`
* runtime is the only caller. `astryx theme build` formats the same block from
* the public `dataTokenDefaults` export, and a CLI test asserts the two are
* byte-identical.
*/
function generateDataTokenDefaultsCSS() {
	return `:root {\n${Object.entries(dataTokenDefaults).map(([prop, value]) => `  ${prop}: ${value};`).join("\n")}\n}`;
}
/**
* Generate layered CSS for a theme — runtime path.
*
* Returns two CSS blocks for injection into different layers:
* - `prose`: @scope'd element defaults → inject into @layer reset
* - `component`: @scope'd token + .astryx-* overrides → inject into @layer astryx-theme
*
* This separation ensures prose defaults (what bare HTML looks like in a theme)
* sit at reset-layer priority where any class-based style wins, while component
* overrides sit above StyleX so themes can restyle components intentionally.
*
* The theme-independent `--color-data-*` defaults are not part of this output:
* see `generateDataTokenDefaultsCSS`.
*/
function generateThemeCSS(theme) {
	const { component, prose } = generateThemeRulesSplit(theme);
	const scopeSelector = themeScopeStart(theme.name);
	const scopeTo = THEME_SCOPE_TO;
	let proseCss = "";
	if (prose.length > 0) proseCss = `@scope (${scopeSelector}) to (${scopeTo}) {\n${prose.join("\n\n")}\n}`;
	let componentCss = "";
	if (component.length > 0) componentCss = `@scope (${scopeSelector}) to (${scopeTo}) {\n${component.join("\n\n")}\n}`;
	const onMediaCss = generateOnMediaCSS(theme);
	if (onMediaCss) componentCss = componentCss ? `${componentCss}\n\n${onMediaCss}` : onMediaCss;
	return {
		prose: proseCss,
		component: componentCss
	};
}
({
	...colorDefaults,
	...spacingDefaults,
	...sizeDefaults,
	...borderDefaults,
	...focusDefaults,
	...radiusDefaults,
	...shadowDefaults,
	...durationDefaults,
	...easeDefaults,
	...typographyDefaults,
	...textSizeDefaults,
	...fontWeightDefaults,
	...typeScaleDefaults,
	...domainTokenDefaults
});
/**
* Resolve a token value to a CSS string.
* - String values pass through as-is
* - [light, dark] tuples become light-dark(light, dark)
*/
function resolveTokenValue$1(value) {
	if (Array.isArray(value)) return `light-dark(${value[0]}, ${value[1]})`;
	return value;
}
/**
* Resolve a FontWeight name to a var() reference.
* Named weights map to var(--font-weight-*); raw values pass through.
*/
function resolveFontWeight(weight) {
	return {
		normal: "var(--font-weight-normal)",
		medium: "var(--font-weight-medium)",
		semibold: "var(--font-weight-semibold)",
		bold: "var(--font-weight-bold)"
	}[weight] ?? weight;
}
/**
* Build the full CSS font-family value from family + fallbacks.
* Quotes the family name if it contains spaces.
*/
function buildFontFamily(family, fallbacks) {
	if (!family) return;
	const quoted = family.includes(" ") ? `"${family}"` : family;
	if (fallbacks) return `${quoted}, ${fallbacks}`;
	return quoted;
}
/**
* Describe a rejected `extends` value for the error message — enough to tell a
* missed import (`undefined`) from a module namespace or a plain object.
*/
function describeBadBase(value) {
	if (value === void 0) return "undefined";
	if (value === null) return "null";
	if (typeof value !== "object") return typeof value;
	const keys = Object.keys(value);
	return `an object with keys [${keys.slice(0, 4).join(", ")}${keys.length > 4 ? ", …" : ""}]`;
}
/**
* Create an Astryx theme.
*
* Pass only the tokens you want to override — everything else
* inherits from the Astryx defaults.
*
* When `typography.scale` is provided, it generates typography token overrides
* that are merged into the token map. Explicit `tokens` entries take
* precedence over generated values.
*/
function defineTheme(input) {
	const tokens = {};
	if ("extends" in input && !isDefinedTheme(input.extends)) throw new Error(`defineTheme("${input.name}"): \`extends\` must be a theme from defineTheme(), got ${describeBadBase(input.extends)}. Check that the import naming your base theme resolves to its source and exports that name — a generated \`<theme>.js\` artifact sitting next to the source exports \`<name>Theme\`, not the source's own export.`);
	const base = input.extends;
	if (base) for (const [key, value] of Object.entries(base.tokens)) tokens[key] = value;
	const typo = input.typography;
	let typeScaleConfig;
	if (typo?.scale) {
		const headingWeights = {};
		const headingRole = typo.heading;
		if (headingRole?.weights) {
			for (const [level, w] of Object.entries(headingRole.weights)) if (w) headingWeights[Number(level)] = resolveFontWeight(w);
		}
		const defaultHeadingWeight = headingRole?.weight ? resolveFontWeight(headingRole.weight) : void 0;
		if (defaultHeadingWeight) {
			for (let i = 1; i <= 6; i++) if (!(i in headingWeights)) headingWeights[i] = defaultHeadingWeight;
		}
		const textWeights = {};
		if (typo.body?.weight) textWeights.body = resolveFontWeight(typo.body.weight);
		if (typo.code?.weight) textWeights.code = resolveFontWeight(typo.code.weight);
		typeScaleConfig = {
			base: typo.scale.base,
			ratio: typo.scale.ratio,
			weights: {
				...Object.keys(headingWeights).length > 0 ? { heading: headingWeights } : {},
				...Object.keys(textWeights).length > 0 ? { text: textWeights } : {}
			}
		};
	}
	if (input.color) {
		const colorTokens = expandColorScale(input.color);
		for (const [key, value] of Object.entries(colorTokens)) tokens[key] = value;
	}
	if (typeScaleConfig) {
		const typeScaleTokens = expandTypeScale(typeScaleConfig);
		for (const [key, value] of Object.entries(typeScaleTokens)) tokens[key] = value;
	}
	if (input.radius) {
		const radiusTokens = expandRadiusScale(input.radius);
		for (const [key, value] of Object.entries(radiusTokens)) tokens[key] = value;
	}
	if (input.motion) {
		const motionTokens = expandMotionScale(input.motion);
		for (const [key, value] of Object.entries(motionTokens)) tokens[key] = value;
	}
	if (typo) {
		const bodyFamily = buildFontFamily(typo.body?.family, typo.body?.fallbacks);
		const headingFamily = buildFontFamily(typo.heading?.family, typo.heading?.fallbacks) ?? bodyFamily;
		const codeFamily = buildFontFamily(typo.code?.family, typo.code?.fallbacks);
		if (bodyFamily) tokens["--font-family-body"] = bodyFamily;
		if (headingFamily) tokens["--font-family-heading"] = headingFamily;
		if (codeFamily) tokens["--font-family-code"] = codeFamily;
	}
	if (input.syntax) {
		const syntaxMap = input.syntax.tokens;
		const prefix = "--color-syntax-";
		for (const [key, value] of Object.entries(syntaxMap)) tokens[prefix + key] = value;
	}
	if (input.tokens) {
		for (const [key, value] of Object.entries(input.tokens)) if (value !== void 0) tokens[key] = resolveTokenValue$1(value);
	}
	let components = input.components;
	if (typeScaleConfig) components = deepMergeComponents(generateTypeScaleComponents(typeScaleConfig), input.components);
	if (base?.components) components = deepMergeComponents(base.components, components);
	const __onDark = resolveOnMedia("dark", input.onDark, base?.__onDark);
	const __onLight = resolveOnMedia("light", input.onLight, base?.__onLight);
	const icons = input.icons && base?.icons ? {
		...base.icons,
		...input.icons
	} : input.icons ?? base?.icons;
	const indicators = input.indicators && base?.indicators ? {
		...base.indicators,
		...input.indicators
	} : input.indicators ?? base?.indicators;
	const theme = {
		name: input.name,
		tokens,
		components,
		icons,
		indicators,
		__inputTokens: base?.__inputTokens || input.tokens ? {
			...base?.__inputTokens,
			...input.tokens
		} : void 0,
		__onDark,
		__onLight
	};
	registerTheme(theme);
	return theme;
}
/** Check if a theme object was created with defineTheme */
function isDefinedTheme(theme) {
	return typeof theme === "object" && theme !== null && "name" in theme && "tokens" in theme && !("styles" in theme);
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/hooks/useMediaQuery.js
/**
* @file useMediaQuery.ts
* @input Uses React useSyncExternalStore, useCallback
* @output Exports useMediaQuery hook for responsive breakpoint detection
* @position Core hook; used by consumers for responsive patterns
*
* SSR-safe media query hook that subscribes to window.matchMedia changes
* via useSyncExternalStore — the canonical React pattern for external
* browser state.
*
* SYNC: When modified, update:
* - /packages/core/src/hooks/index.ts
*/
/**
* SSR-safe media query hook.
* Returns whether the given media query matches.
*
* @param query - CSS media query string
* @param serverDefault - Value to return during SSR. Pass a server-side hint
*   (e.g. derived from User-Agent or client hints) to avoid a layout flash.
*
* @example
* ```
* const isMobile = useMediaQuery('(max-width: 768px)');
* const isMobile = useMediaQuery('(max-width: 768px)', defaultIsMobile);
* ```
*/
function useMediaQuery(query, serverDefault = false) {
	const subscribe = (0, import_react.useCallback)((onStoreChange) => {
		const mql = window.matchMedia(query);
		mql.addEventListener("change", onStoreChange);
		return () => mql.removeEventListener("change", onStoreChange);
	}, [query]);
	const getSnapshot = (0, import_react.useCallback)(() => {
		return window.matchMedia(query).matches;
	}, [query]);
	const getServerSnapshot = (0, import_react.useCallback)(() => serverDefault, [serverDefault]);
	return (0, import_react.useSyncExternalStore)(subscribe, getSnapshot, getServerSnapshot);
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/theme/useTheme.js
/**
* @file useTheme.ts
* @input ThemeContext provided by Theme
* @output Exports useTheme and useThemeName hooks for programmatic theme access
* @position Theme hook; used by data viz, canvas, and non-CSS consumers
*
* Provides synchronous access to theme token values resolved for the
* current color mode — no DOM reads on the provider path, no double render.
* Without a reachable ThemeContext it consults `<html data-theme>` and
* `<html data-astryx-theme>` (kept in sync by Theme) via shared, refcounted
* MutationObservers before assuming OS preference/default tokens. Provider-path
* consumers subscribe to no-op stores instead, so mounting under a Theme never
* creates an observer. Token resolution is shared with the server-safe helpers
* in ./tokens.ts.
*
* SYNC: When modified, update:
* - /packages/core/src/theme/index.ts
*/
/**
* Internal context value — carries the theme + mode from Theme.
* @internal
*/
/**
* React context for the nearest Theme provider.
* null when no provider is present.
* @internal
*/
var ThemeContext = /*#__PURE__*/ (0, import_react.createContext)(null);
ThemeContext.displayName = "ThemeContext";
function getRootNameAttrSnapshot() {
	if (typeof document === "undefined") return null;
	return document.documentElement.getAttribute(dataAttr("theme"));
}
function getRootNameAttrServerSnapshot() {
	return null;
}
function getNullThemeSnapshot() {
	return null;
}
var rootNameAttrListeners = /* @__PURE__ */ new Set();
var rootNameAttrObserver = null;
function notifyRootNameAttrListeners() {
	for (const listener of rootNameAttrListeners) listener();
}
function subscribeRootNameAttr(onStoreChange) {
	rootNameAttrListeners.add(onStoreChange);
	if (rootNameAttrListeners.size === 1 && typeof MutationObserver !== "undefined") {
		rootNameAttrObserver = new MutationObserver(notifyRootNameAttrListeners);
		rootNameAttrObserver.observe(document.documentElement, {
			attributes: true,
			attributeFilter: [dataAttr("theme")]
		});
	}
	return () => {
		rootNameAttrListeners.delete(onStoreChange);
		if (rootNameAttrListeners.size === 0 && rootNameAttrObserver) {
			rootNameAttrObserver.disconnect();
			rootNameAttrObserver = null;
		}
	};
}
function subscribeNoop() {
	return () => {};
}
function useRootThemeNameAttr(hasCtx) {
	return (0, import_react.useSyncExternalStore)(hasCtx ? subscribeNoop : subscribeRootNameAttr, hasCtx ? getNullThemeSnapshot : getRootNameAttrSnapshot, getRootNameAttrServerSnapshot);
}
/**
* Return the nearest active Astryx theme name.
*
* Uses ThemeContext when present and otherwise follows the root Theme's
* <html data-astryx-theme> attribute. This is intentionally lighter than
* useTheme() for consumers that only need theme identity, such as semantic
* icon resolution.
*/
function useThemeName() {
	const ctx = (0, import_react.use)(ThemeContext);
	const rootThemeName = useRootThemeNameAttr(ctx != null);
	return ctx?.theme.name ?? rootThemeName;
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/utils/devWarning.js
/** Format a message as `Component: message`. */
function formatDevMessage(component, message) {
	return `${component}: ${message}`;
}
/**
* `console.error` in the standardized `Component: message` format. Unlike
* {@link devWarn}, this runs in production too: it reports real runtime
* failures (e.g. a thrown callback) that should reach error telemetry.
*
* @example
* ```
* devError('Table', 'Plugin at index 0 threw in transform:', error);
* ```
*/
function devError(component, message, ...args) {
	console.error(formatDevMessage(component, message), ...args);
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/theme/Theme.js
/**
* Theme Provider Component
*
* Applies theme tokens and sets color-scheme for light-dark() to work.
* Themes are created with `defineTheme()` and applied via CSS:
* - Token overrides set as CSS custom properties on [data-astryx-theme]
* - Component overrides scoped via @scope'd CSS selectors on the stable Astryx
*   selector surface (`.xds-*` classes today; components also emit `data-*`
*   prop reflections for the data-attribute selector migration)
*
* Root detection: The first Theme in the tree (no parent Theme)
* automatically syncs attributes to `document.documentElement`:
* - `data-theme` — drives `color-scheme` via reset.css rules, ensuring browser
*   chrome (scrollbars, native form controls, date pickers) reflects the mode.
* - `data-astryx-theme` — enables @scope'd theme CSS to reach elements rendered
*   outside the Theme wrapper (portals, toast fallback viewports).
*
* For RSC / SSR, set `data-theme` on `<html>` in your root server layout
* to avoid a flash of wrong theme before hydration:
*
*   <html lang="en" data-theme="dark">
*
* @example
* ```
* const ocean = defineTheme({
*   name: 'ocean',
*   tokens: { '--color-accent': ['#0077B6', '#48CAE4'] },
*   components: { card: { base: { borderWidth: '2px' } } },
*   icons: oceanIcons,
* });
* <Theme theme={ocean}><App /></Theme>
* ```
*/
var import_jsx_runtime = require_jsx_runtime();
/**
* Styles for the theme wrapper
*/
var wrapperStyles = {
	base: {
		k1xSpc: "xjp7ctv",
		kMwMTN: "x1tgivj0",
		kMv6JI: "x9ynric",
		$$css: true
	},
	light: {
		kQNsl9: "x19aimcq",
		$$css: true
	},
	dark: {
		kQNsl9: "xntwwlm",
		$$css: true
	},
	system: {
		kQNsl9: "x108lcm5",
		$$css: true
	}
};
/**
* Context to detect whether this Theme is nested inside another.
* The root provider (no parent context) syncs data-theme to <html>.
* @internal
*/
var ThemeNestingContext = /*#__PURE__*/ import_react.createContext(false);
ThemeNestingContext.displayName = "ThemeNestingContext";
/** Track which themes have already been injected */
var injectedThemes = /* @__PURE__ */ new Set();
/**
* How many mounted `Theme`s are relying on the injected data-token defaults.
*
* The defaults are one document-wide `:root` block, shared by every theme, so
* they are injected once and removed only when the last theme that took a
* reference unmounts — tearing them down with whichever provider happened to
* inject them would strip the palette from the providers still mounted.
*/
var dataTokenDefaultsRefCount = 0;
/**
* Hook to inject theme CSS into the document.
* Built themes (from `astryx theme build`) skip injection — their CSS
* is in a separate file imported by the consumer.
*/
function useThemeStyleInjection(theme) {
	const id = (0, import_react.useId)();
	(0, import_react.useInsertionEffect)(() => {
		if (theme.__built) return;
		const themeKey = `astryx-theme-${theme.name}`;
		if (injectedThemes.has(themeKey)) return;
		`${theme.name}`, `${theme.name}${theme.name}${theme.name}${theme.name}`;
		const { prose, component } = generateThemeCSS(theme);
		const base = generateDataTokenDefaultsCSS();
		injectedThemes.add(themeKey);
		const cleanups = [() => injectedThemes.delete(themeKey)];
		if (base) {
			if (dataTokenDefaultsRefCount++ === 0) {
				const baseStyle = document.createElement("style");
				baseStyle.setAttribute(dataAttr("theme-base"), "");
				baseStyle.textContent = `@layer astryx-base {\n${base}\n}`;
				document.head.appendChild(baseStyle);
			}
			cleanups.push(() => {
				if (--dataTokenDefaultsRefCount === 0) document.querySelector(`style[${dataAttr("theme-base")}]`)?.remove();
			});
		}
		if (prose) {
			const proseStyle = document.createElement("style");
			proseStyle.setAttribute(dataAttr("theme-prose"), theme.name);
			proseStyle.setAttribute(dataAttr("id"), id);
			proseStyle.textContent = `@layer reset {\n${prose}\n}`;
			document.head.appendChild(proseStyle);
		}
		if (component) {
			const compStyle = document.createElement("style");
			compStyle.setAttribute(dataAttr("theme"), theme.name);
			compStyle.setAttribute(dataAttr("id"), id);
			compStyle.textContent = `@layer astryx-theme {\n${component}\n}`;
			document.head.appendChild(compStyle);
		}
		if (prose || component) cleanups.push(() => {
			const proseEl = document.querySelector(`style[${dataAttr("theme-prose")}="${theme.name}"][${dataAttr("id")}="${id}"]`);
			const compEl = document.querySelector(`style[${dataAttr("theme")}="${theme.name}"][${dataAttr("id")}="${id}"]`);
			proseEl?.remove();
			compEl?.remove();
		});
		return () => {
			for (const cleanup of cleanups) cleanup();
		};
	}, [theme, id]);
}
/**
* Hook to sync theme attributes to document.documentElement for the root provider.
* Skipped for nested Theme instances.
*
* Syncs two attributes:
* - `data-theme` (light/dark) — reset.css maps this to color-scheme, controlling
*   browser chrome (scrollbars, native form controls, date pickers).
* - `data-astryx-theme` (theme name) — enables @scope'd theme CSS to reach elements
*   outside the Theme wrapper (e.g. toast fallback viewports, portals).
*
* - 'light' | 'dark' → sets data-theme="light" | "dark"
* - 'system' → removes data-theme (reset.css defaults to color-scheme: light dark)
*/
function useRootThemeSync(isNested, mode, themeName) {
	useIsomorphicLayoutEffect(() => {
		if (isNested) return;
		if (typeof document === "undefined") return;
		if (mode === "light" || mode === "dark") document.documentElement.setAttribute("data-theme", mode);
		else document.documentElement.removeAttribute("data-theme");
		document.documentElement.setAttribute(dataAttr("theme"), themeName);
		return () => {
			document.documentElement.removeAttribute("data-theme");
			document.documentElement.removeAttribute(dataAttr("theme"));
		};
	}, [
		isNested,
		mode,
		themeName
	]);
}
/**
* Theme provider component
*
* Sets data-astryx-theme attribute so @scope'd CSS takes effect.
* Component overrides are pure CSS scoped under the theme attribute —
* components render with stable `.xds-*` classes plus `data-*` prop
* reflections and don't need context.
*
* When this is the root Theme (no parent Theme in the tree),
* it syncs `data-theme` and `data-astryx-theme` to `<html>` so browser
* chrome reflects the active mode and @scope'd CSS reaches portals.
* Nested Theme instances skip the sync.
*/
function Theme({ theme, mode = "system", children }) {
	const isNested = (0, import_react.use)(ThemeNestingContext);
	registerTheme(theme);
	useThemeStyleInjection(theme);
	useRootThemeSync(isNested, mode, theme.name);
	const colorSchemeStyle = mode === "dark" ? wrapperStyles.dark : mode === "light" ? wrapperStyles.light : wrapperStyles.system;
	const ctxValue = (0, import_react.useMemo)(() => ({
		theme,
		mode
	}), [theme, mode]);
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(ThemeContext, {
		value: ctxValue,
		children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)(ThemeNestingContext, {
			value: true,
			children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
				...props(wrapperStyles.base, colorSchemeStyle),
				"data-astryx-theme": theme.name,
				"data-theme": mode === "system" ? void 0 : mode,
				children
			})
		})
	});
}
Theme.displayName = "Theme";
//#endregion
//#region node_modules/@astryxdesign/core/dist/theme/syntax/defineSyntaxTheme.js
/**
* @file defineSyntaxTheme.ts
* @input syntaxTokenDefaults from tokens.ts
* @output defineSyntaxTheme, SyntaxTheme, syntaxThemeStyle
* @position Syntax theme definition API; consumed by presets, SyntaxTheme, defineTheme
*
* @see https://github.com/facebook/astryx/issues/1148
*/
/** Human-readable syntax token name (without CSS custom property prefix). */
/**
* Token value — either a single string or a [light, dark] tuple.
* Tuples are converted to CSS light-dark() at theme creation time.
*/
/** Token map for defineSyntaxTheme input — values can be strings or tuples. */
/** Resolved token map — all values are CSS strings (tuples resolved to light-dark()). */
/** Input to defineSyntaxTheme. */
/** A defined syntax theme — tokens are resolved to CSS strings. */
var CSS_PREFIX = "--color-syntax-";
/** All valid human-readable token keys, derived from the defaults. */
var ALL_SYNTAX_KEYS = Object.keys(syntaxTokenDefaults).map((k) => k.replace(CSS_PREFIX, ""));
/** Resolve a token value to a CSS string. Tuples become light-dark(). */
function resolveTokenValue(value) {
	if (Array.isArray(value)) return `light-dark(${value[0]}, ${value[1]})`;
	return value;
}
/**
* Create a syntax theme from a complete token map.
*
* Token values can be:
* - A string: used as-is (e.g. '#ff79c6' or 'light-dark(#0064E0, #2694FE)')
* - A [light, dark] tuple: converted to light-dark(light, dark)
*
* @example
* const myTheme = defineSyntaxTheme({
*   name: 'my-theme',
*   tokens: {
*     keyword: ['#0064E0', '#2694FE'],     // [light, dark] tuple
*     string: '#98c379',                    // same in both modes
*     comment: 'light-dark(#666, #999)',    // CSS light-dark() string
*     // ... all 14 tokens
*   },
* });
*/
function defineSyntaxTheme(input) {
	const missing = ALL_SYNTAX_KEYS.filter((key) => !(key in input.tokens));
	if (missing.length > 0) `${input.name}${missing.join(", ")}`;
	const resolved = {};
	for (const key of ALL_SYNTAX_KEYS) resolved[key] = resolveTokenValue(input.tokens[key]);
	return {
		name: input.name,
		tokens: resolved,
		__inputTokens: { ...input.tokens }
	};
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/Layout/LayoutAreaContext.js
/**
* @file LayoutAreaContext.ts
* @input Uses React createContext
* @output Exports LayoutAreaContext and LayoutArea type
* @position Context for layout slot detection
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/Layout/Layout.doc.mjs
*/
/**
* Layout area type representing which slot a component is rendered in.
* Used by content area components to detect their position and adjust styling.
*/
/**
* Context for detecting which layout area a component is rendered in.
* Content area components use this to:
* - Auto-position dividers correctly
* - Apply correct semantic elements
* - Adjust internal spacing
*/
var LayoutAreaContext = /*#__PURE__*/ (0, import_react.createContext)(null);
LayoutAreaContext.displayName = "LayoutAreaContext";
/**
* Context for layout slot information.
* Content area components use this to determine if they are at an edge
* (for applying outer padding).
*/
var LayoutSlotsContext = /*#__PURE__*/ (0, import_react.createContext)({
	hasHeader: false,
	hasFooter: false,
	hasStart: false,
	hasEnd: false
});
LayoutSlotsContext.displayName = "LayoutSlotsContext";
//#endregion
//#region node_modules/@astryxdesign/core/dist/Layout/LayoutDividerContext.js
/**
* @file LayoutDividerContext.ts
* @input Uses React createContext
* @output Exports LayoutDividerContext and LayoutDividerContextValue type
* @position Context for container-controlled default divider visibility;
*   consumed by LayoutHeader.tsx, LayoutFooter.tsx, provided by Layout.tsx
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/Layout/Layout.doc.mjs
* - /packages/core/src/Layout/Layout.tsx
* - /packages/core/src/Layout/LayoutHeader.tsx
* - /packages/core/src/Layout/LayoutFooter.tsx
*/
var LayoutDividerContext = /*#__PURE__*/ (0, import_react.createContext)(null);
LayoutDividerContext.displayName = "LayoutDividerContext";
//#endregion
//#region node_modules/@astryxdesign/core/dist/Stack/stack.stylex.js
var alignItemsStyles = {
	center: {
		kGNEyG: "x6s0dn4",
		$$css: true
	},
	end: {
		kGNEyG: "xuk3077",
		$$css: true
	},
	start: {
		kGNEyG: "x1cy8zhl",
		$$css: true
	},
	stretch: {
		kGNEyG: "x1qjc9v5",
		$$css: true
	}
};
/**
* Cross-axis alignment options for stack items.
* - For HStack: vertical alignment
* - For VStack: horizontal alignment
*/
var justifyContentStyles = {
	start: {
		kjj79g: "x1nhvcw1",
		$$css: true
	},
	center: {
		kjj79g: "xl56j7k",
		$$css: true
	},
	end: {
		kjj79g: "x13a6bvl",
		$$css: true
	},
	between: {
		kjj79g: "x1qughib",
		$$css: true
	},
	around: {
		kjj79g: "x1l1ennw",
		$$css: true
	},
	evenly: {
		kjj79g: "xaw8158",
		$$css: true
	}
};
/**
* Main-axis alignment options for stack items.
* - For HStack: horizontal alignment
* - For VStack: vertical alignment
*/
var directionStyles = {
	horizontal: {
		kXwgrk: "x1q0g3np",
		$$css: true
	},
	vertical: {
		kXwgrk: "xdt5ytf",
		$$css: true
	}
};
/**
* Stack direction.
* - `horizontal`: Items flow left-to-right (HStack)
* - `vertical`: Items flow top-to-bottom (VStack)
*/
var wrapStyles$1 = {
	nowrap: {
		kwnvtZ: "xozqiw3",
		$$css: true
	},
	wrap: {
		kwnvtZ: "x1a02dak",
		$$css: true
	},
	"wrap-reverse": {
		kwnvtZ: "x8hhl5t",
		$$css: true
	}
};
/**
* Flex wrap behavior.
* - `nowrap`: Items stay on one line (default)
* - `wrap`: Items wrap to next line
* - `wrap-reverse`: Items wrap to previous line
*/
var baseStyles$3 = { stack: {
	k1xSpc: "x78zum5",
	$$css: true
} };
/**
* Gap styles using spacing tokens from the theme.
* Keys are numeric SpacingStep values.
*/
var gapStyles$1 = {
	"0": {
		k1C7PZ: "x1o57wo1",
		khm7nJ: "x6yxi7o",
		$$css: true
	},
	"1": {
		k1C7PZ: "x1lfs0n9",
		khm7nJ: "x1ngg2t4",
		$$css: true
	},
	"2": {
		k1C7PZ: "xak3so",
		khm7nJ: "x1x7z4sm",
		$$css: true
	},
	"3": {
		k1C7PZ: "xewh9hi",
		khm7nJ: "x4olc9o",
		$$css: true
	},
	"4": {
		k1C7PZ: "xty4p9g",
		khm7nJ: "xtx9w7w",
		$$css: true
	},
	"5": {
		k1C7PZ: "x1eqhezk",
		khm7nJ: "x1iu6piu",
		$$css: true
	},
	"6": {
		k1C7PZ: "x3qlgwd",
		khm7nJ: "xczp1bk",
		$$css: true
	},
	"8": {
		k1C7PZ: "xicv188",
		khm7nJ: "xgx0vcf",
		$$css: true
	},
	"10": {
		k1C7PZ: "x1p37tyl",
		khm7nJ: "x1xpicb7",
		$$css: true
	},
	"0.5": {
		k1C7PZ: "x1kihgfc",
		khm7nJ: "x1tw44j4",
		$$css: true
	},
	"1.5": {
		k1C7PZ: "x1thn6ci",
		khm7nJ: "xhq53yo",
		$$css: true
	}
};
/**
* StyleX utility to add stack (flex container) styles to any element.
*
* @example
* ```
* import { stack } from '@astryxdesign/core/Layout';
* import * as stylex from '@stylexjs/stylex';
*
* // Horizontal stack with numeric gap
* <div {...stylex.props(...stack({ direction: 'horizontal', gap: 2 }))}>
*   <Child />
*   <Child />
* </div>
*
* // Vertical stack with centered items
* <div {...stylex.props(...stack({ direction: 'vertical', crossAlign: 'center' }))}>
*   <Child />
*   <Child />
* </div>
*
* // Wrapping horizontal stack with larger gap
* <div {...stylex.props(...stack({ direction: 'horizontal', gap: 4, wrap: 'wrap' }))}>
*   <Child />
*   <Child />
*   <Child />
* </div>
* ```
*/
function stack({ crossAlign, direction, gap, mainAlign, wrap }) {
	return [
		baseStyles$3.stack,
		directionStyles[direction],
		gap != null && gapStyles$1[gap],
		crossAlign != null && alignItemsStyles[crossAlign],
		mainAlign != null && justifyContentStyles[mainAlign],
		wrap != null && wrapStyles$1[wrap]
	];
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/Stack/stackItem.stylex.js
/**
* "Resets" the min-width and min-height of the flex item to behave predictably.
*
* Flex items have an implicit min size of auto, meaning they will never shrink
* smaller than their contents. This reset allows items to be constrained by
* their flex parent and become scrollable if necessary.
*/
var minSizeResetStyles = { reset: {
	kAzted: "x2lwn1j",
	k7Eaqz: "xeuugli",
	$$css: true
} };
var crossAlignSelfStyles = {
	center: {
		kSGwAc: "xamitd3",
		$$css: true
	},
	end: {
		kSGwAc: "xpvyfi4",
		$$css: true
	},
	start: {
		kSGwAc: "xqcrz7y",
		$$css: true
	},
	stretch: {
		kSGwAc: "xkh2ocl",
		$$css: true
	}
};
/**
* Cross-alignment options for stack items.
* Overrides the default cross-alignment set on the parent stack.
*/
var sizeStyles$6 = {
	fill: {
		kzQI83: "x1iyjqo2",
		$$css: true
	},
	static: {
		kzQI83: "x1c4vz4f",
		kmuXW: "x2lah0s",
		$$css: true
	}
};
/**
* Size options for stack items.
* - `static`: Item uses its intrinsic size, won't grow or shrink
* - `fill`: Item grows to fill remaining space (flexGrow: 1)
*/
/**
* StyleX utility to add stack item styles to any component.
*
* Use this to avoid wrapping components in StackItem when you need
* direct control over flex behavior.
*
* @example
* ```
* import { stackItem } from '@astryxdesign/core/Layout';
*
* <div {...stylex.props(...stackItem({ size: 'fill' }))}>
*   Content that fills remaining space
* </div>
* ```
*/
function stackItem({ crossAlignSelf, size } = {}) {
	return [
		minSizeResetStyles.reset,
		sizeStyles$6[size ?? "static"],
		crossAlignSelf != null && crossAlignSelfStyles[crossAlignSelf]
	];
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/utils/characters.js
var import_react_dom = require_react_dom();
/**
* @file characters.ts
* @input Strings that may contain characters made of several code units
*        (emoji, flags, joined emoji sequences, accented letters)
* @output Exports characterCount, firstCharacter, truncateCharacters —
*         replacements for .length / .charAt(0) / .slice(0, n) that measure
*         and cut user-visible strings the way a person reads them
* @position Shared utility; consumed by Avatar, TextArea, PowerSearch, Table
*
* SYNC: When modified, update:
* - /packages/core/src/utils/characters.test.ts
* - /packages/core/src/utils/index.ts
*/
/**
* Reuse a single segmenter when the runtime supports Intl.Segmenter.
* `grapheme` is the Intl granularity name for a user-perceived character.
*/
var characterSegmenter = typeof Intl.Segmenter === "function" ? new Intl.Segmenter(void 0, { granularity: "grapheme" }) : null;
/**
* The first character of a string, or '' when empty. Replacement for
* `.charAt(0)`, which can return half of an emoji. Reads only the first
* character, so cost does not scale with the length of the string.
*/
function firstCharacter(str) {
	if (characterSegmenter) {
		const first = characterSegmenter.segment(str)[Symbol.iterator]().next();
		return first.done ? "" : first.value.segment;
	}
	const codePoint = str.codePointAt(0);
	return codePoint == null ? "" : String.fromCodePoint(codePoint);
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/utils/mergeProps.js
/**
* Merge xds-* props, stylex.props result, and optional consumer className/style.
*
* stylex.props() returns { className, style }. This merges the Astryx stable
* class name plus any data-attribute reflection from `themeProps()` with the
* StyleX class name so both StyleX styles and the theme-targeting surface are
* applied.
*
* Consumer className is appended after StyleX classes.
* Consumer style is spread after StyleX inline styles, so these values take priority.
*
* @example
* ```tsx
* // Root element with themeProps
* <div {...mergeProps(
*   themeProps('button', { variant }),
*   stylex.props(styles.base, variants[variant]),
*   className,
*   style,
* )} />
*
* // Internal element — stylex + dynamic style only
* <div {...mergeProps(
*   stylex.props(styles.track),
*   { style: { width: dynamicWidth } },
* )} />
* ```
*/
function mergeTwoProps(base, overrides) {
	const merged = {
		...base,
		...overrides
	};
	const cls = [base.className, overrides.className].filter(Boolean).join(" ");
	if (cls) merged.className = cls;
	else delete merged.className;
	const mergedStyle = overrides.style && base.style ? {
		...base.style,
		...overrides.style
	} : overrides.style || base.style;
	if (mergedStyle) merged.style = mergedStyle;
	else delete merged.style;
	return merged;
}
function mergeProps(xdsClassOrStylexResult, stylexResultOrClassName, classNameOrStyle, style) {
	if (typeof xdsClassOrStylexResult === "string") {
		const xdsClass = xdsClassOrStylexResult;
		const stylexResult = stylexResultOrClassName ?? { className: "" };
		const className = classNameOrStyle;
		let cls = stylexResult.className ? `${xdsClass} ${stylexResult.className}` : xdsClass;
		if (className) cls = `${cls} ${className}`;
		const mergedStyle = style && stylexResult.style ? {
			...stylexResult.style,
			...style
		} : style || stylexResult.style;
		return {
			...stylexResult,
			className: cls,
			style: mergedStyle
		};
	}
	let merged = mergeTwoProps(xdsClassOrStylexResult, typeof stylexResultOrClassName === "string" ? { className: stylexResultOrClassName } : stylexResultOrClassName ?? {});
	if (typeof classNameOrStyle === "string") merged = mergeTwoProps(merged, { className: classNameOrStyle });
	else if (classNameOrStyle != null) merged = mergeTwoProps(merged, { style: classNameOrStyle });
	if (style != null) merged = mergeTwoProps(merged, { style });
	return merged;
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/utils/mergeRefs.js
/**
* @file mergeRefs.ts
* @input Multiple React refs (callback, object, or undefined)
* @output A single callback ref that forwards to all inputs
* @position Utility; used by components that need to merge an external ref
*   with an internal ref (e.g., popover trigger + consumer ref).
*/
function mergeRefs(...refs) {
	return (value) => {
		const cleanups = [];
		for (const ref of refs) if (typeof ref === "function") {
			const cleanup = ref(value);
			cleanups.push(typeof cleanup === "function" ? cleanup : () => ref(null));
		} else if (ref != null) {
			const mutableRef = ref;
			mutableRef.current = value;
			cleanups.push(() => {
				mutableRef.current = null;
			});
		}
		if (value != null && cleanups.length > 0) return () => {
			for (const cleanup of cleanups) cleanup();
		};
	};
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/utils/composeEventHandlers.js
/**
* @file composeEventHandlers.ts
* @input Multiple React event handlers (or undefined)
* @output A single handler that calls each in order, stopping if one prevents default
* @position Utility; used by components that own an interaction (a click that
*   selects, a keydown that drives arrow navigation) but also accept a consumer
*   handler for the same event through {...rest}. Composes them instead of
*   letting one clobber the other.
*
* Order is call order: the first argument runs first. Put the consumer handler
* first so it can opt out of the component's built-in behavior via
* `event.preventDefault()`; put the component's handler first when its behavior
* must always run regardless of the consumer.
*/
/**
* Compose event handlers into one. Each handler runs in argument order; if any
* calls `event.preventDefault()`, the remaining handlers are skipped.
*
* @example
* ```tsx
* // Consumer first: a consumer onClick can preventDefault to block selection.
* <button onClick={composeEventHandlers(onClickProp, handleSelect)} />
*
* // Component first: built-in keyboard nav always runs.
* <div onKeyDown={composeEventHandlers(handleArrowKeys, onKeyDownProp)} />
* ```
*/
function composeEventHandlers(...handlers) {
	return (event) => {
		for (const handler of handlers) {
			handler?.(event);
			if (event.defaultPrevented) return;
		}
	};
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/utils/themeProps.js
function toDataAttributeName(prop) {
	return `data-${prop.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()}`;
}
function classTokenForPropValue(prop, value) {
	return /^\d/.test(value) ? `${prop}-${value}` : value;
}
/**
* Build the astryx-* class name string for a component.
*
* Every component renders a stable base class (`astryx-button`, `astryx-card`,
* etc.) plus variant classes derived from visual props. Components also reflect
* those visual props as data attributes via `themeProps()` (`data-variant`,
* `data-size`, `data-level`, etc.) so consumers target stable data-attribute
* selectors rather than collision-prone bare class names.
*
* The `astryx-` prefix comes from the centralized naming module
* (`packages/core/src/naming.ts`) so the namespace lives in one place.
*
* <!-- SYNC: packages/core/src/naming.ts (namespace prefix source of truth) -->
* <!-- SYNC: packages/core/src/utils/parseStyleKey.ts -->
*
* Values starting with a digit get prefixed with the prop name since
* CSS class names can't start with a number (e.g. level=1 → "level-1").
* Data attributes keep the literal value (e.g. `data-level="1"`).
*
* @param component - Component name in lowercase (e.g. 'button', 'card')
* @param props - Visual prop values to include as variant classes
* @returns Class name string (e.g. "astryx-button secondary sm")
*
* @example
* ```ts
* buildClassName('button', { variant: 'secondary', size: 'sm' })
* // → "astryx-button secondary sm"
*
* buildClassName('heading', { level: 1 })
* // → "astryx-heading level-1"
*
* buildClassName('card')
* // → "astryx-card"
* ```
*/
function buildClassName(component, props) {
	const classes = [stableClassName(component)];
	if (props) for (const [prop, value] of Object.entries(props)) {
		if (value == null) continue;
		classes.push(classTokenForPropValue(prop, String(value)));
	}
	return classes.join(" ");
}
/**
* Reflect Astryx visual props as `data-*` attributes.
*
* Keys are kebab-cased (`listStyle` → `data-list-style`) and values are the
* literal prop values, including numeric values (`level: 1` → `data-level="1"`).
* Nullish values are omitted.
*/
function themeDataAttributes(props) {
	const attrs = {};
	if (props) for (const [prop, value] of Object.entries(props)) {
		if (value == null) continue;
		attrs[toDataAttributeName(prop)] = String(value);
	}
	return attrs;
}
/**
* Build the props object components should spread onto the same element that
* receives the stable Astryx class name.
*
* This emits the stable astryx class plus the data-attribute reflection
* surface. For example:
*
* ```ts
* themeProps('button', { variant: 'primary', size: 'sm' })
* // → { className: 'astryx-button primary sm', data-variant: 'primary', data-size: 'sm' }
* ```
*/
/**
* Options for {@link themeProps}.
*/
function themeProps(component, props, options) {
	const className = buildClassName(component, props);
	const legacy = options?.legacyNames?.map((name) => stableClassName(name)) ?? [];
	return {
		className: legacy.length > 0 ? [className, ...legacy].join(" ") : className,
		...themeDataAttributes(props)
	};
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/utils/sharedResizeObserver.js
/**
* @file sharedResizeObserver.ts
* @input ResizeObserver API
* @output Exports observeResize / unobserveResize for shared observation
* @position Utility; consumed by useTruncation, useOverflow, and any component
*   that needs resize observation without creating per-instance observers
*
* A single ResizeObserver can observe thousands of elements. Creating one
* per component (e.g. per table cell) is wasteful — browsers batch
* observations per observer instance, so a shared observer means one
* callback dispatch per animation frame instead of N.
*
* SYNC: When modified, update:
* - /packages/core/src/utils/index.ts (exports)
* - /packages/core/src/Text/useTruncation.ts (primary consumer)
*/
var observer = null;
var callbacks = /* @__PURE__ */ new Map();
/**
* The shared observer, or null where the API does not exist (jsdom, an old
* browser). Callers still get the one-shot measurement `observeResize` fires
* on registration; live resize updates are the part that needs the API.
*/
function getObserver() {
	if (typeof ResizeObserver === "undefined") return null;
	if (!observer) observer = new ResizeObserver((entries) => {
		for (const entry of entries) {
			const cb = callbacks.get(entry.target);
			if (cb) cb(entry);
		}
	});
	return observer;
}
/**
* Observe an element's size via a shared ResizeObserver singleton.
*
* Fires the callback once synchronously on registration (with a
* synthetic entry) so callers don't need separate initial-measurement
* logic. Subsequent callbacks fire on actual resizes.
*
* Call `unobserveResize` when the element unmounts or observation is
* no longer needed. The shared observer is destroyed when the last
* element is unobserved.
*
* @example
* ```
* observeResize(element, (entry) => {
*   console.log(entry.contentBoxSize);
* });
*
* // Cleanup:
* unobserveResize(element);
* ```
*/
function observeResize(element, callback) {
	callbacks.set(element, callback);
	getObserver()?.observe(element);
	callback({ target: element });
}
/**
* Stop observing an element. If no elements remain, the shared
* observer is disconnected and released for garbage collection.
*/
function unobserveResize(element) {
	callbacks.delete(element);
	if (observer) {
		observer.unobserve(element);
		if (callbacks.size === 0) {
			observer.disconnect();
			observer = null;
		}
	}
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/utils/isRenderable.js
/**
* @file isRenderable.ts
* @input A ReactNode value
* @output Boolean indicating whether the value will produce DOM output
* @position Utility for checking if a React slot prop has meaningful content.
*
* React treats null, undefined, true, false, and '' as empty — they render
* nothing. This utility checks if a ReactNode is NOT one of those values,
* meaning it will produce actual DOM output when rendered.
*
* Use this instead of `prop != null` when checking if a slot has content,
* since boolean/empty-string props also render nothing.
*/
/**
* Returns true if a ReactNode value will produce DOM output when rendered.
* Returns false for null, undefined, true, false, and empty string.
*
* @example
* ```tsx
* const hasSideNav = isRenderable(sideNav);
* const hasTopNav = isRenderable(topNav);
* ```
*/
function isRenderable(node) {
	return node != null && typeof node !== "boolean" && node !== "";
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/utils/inputAria.js
/**
* @file inputAria.ts
* @input Receives input label/description IDs and optional InputGroup context
* @output Exports helpers for consistent input ARIA composition
* @position Internal utility; used by inputs that compose labels/descriptions
*/
function joinAriaIDs(...values) {
	const ids = values.flatMap((value) => typeof value === "string" ? value.trim().split(/\s+/) : []).filter(Boolean);
	if (ids.length === 0) return;
	return Array.from(new Set(ids)).join(" ");
}
/**
* Builds ARIA label/description wiring for an input.
*
* Standalone inputs keep their normal native label association. Grouped inputs
* are named by the visible InputGroup label plus their own input label, and
* inherit group description/status text in addition to input-local text.
*/
function getInputARIA(labelID, describedByIDs = [], inputGroup) {
	return {
		ariaLabelledBy: inputGroup ? joinAriaIDs(inputGroup.labelID, labelID) : void 0,
		ariaDescribedBy: joinAriaIDs(inputGroup?.describedByIDs, ...describedByIDs)
	};
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/utils/rtlStyles.js
var _temp$7 = {
	kbCHJM: "x1nrll8i",
	k3aq6I: "xsqj5wx",
	"$$css": true
};
var rtlStyles = {
	mirror: {
		k3aq6I: "xgtlewx",
		$$css: true
	},
	centerInline: (blockOffset) => [_temp$7, { "--x-transform": `translate(-50%, ${blockOffset})` != null ? `translate(-50%, ${blockOffset})` : void 0 }]
};
//#endregion
//#region node_modules/@astryxdesign/core/dist/utils/focusOutline.stylex.js
/**
* @file focusOutline.stylex.ts
* @input Uses StyleX and theme color tokens
* @output Exports shared focus-outline prop builders
* @position Internal utility for consistent keyboard focus outlines across core components
*
* Centralizes the standard Astryx focus outline, shown only for keyboard focus.
* Every focusable surface drew the same 2px accent ring already; writing it per
* component meant dozens of identical definitions to keep in step, and they did
* not stay in step — offsets drifted and one ring was a border-width thick.
*
* Every ring in core and lab is drawn from here, with one exception recorded in
* Switch: its condition is a component-scoped ancestor marker, which cannot be
* shared without leaking focus state between components. A component may still
* override the OFFSET (a ring that must sit inset, or clear of a field border);
* width, style and color are not restated anywhere.
*
* Every value comes from the `--focus-outline-*` tokens, which is how a theme
* restyles the ring: one override reaches every component at once. The
* `:focus-visible` condition is not themeable and stays here, so a theme can
* change what the ring looks like but cannot show it to pointer users.
*/
var FOCUS_OUTLINE_WIDTH = focusVars["--focus-outline-width"];
var FOCUS_OUTLINE_STYLE = focusVars["--focus-outline-style"];
var FOCUS_OUTLINE_COLOR = focusVars["--focus-outline-color"];
focusVars["--focus-outline-offset"];
`${FOCUS_OUTLINE_WIDTH}${FOCUS_OUTLINE_STYLE}${FOCUS_OUTLINE_COLOR}`;
var focusOutlineStyles = {
	focusVisible: {
		kMeerF: "x1k57tk5 x1vidyx5",
		k3XXqK: "x1t137rt x1jhp3zv",
		kjBf7l: "xx47ajj",
		kInvED: "x1wfwxd8 x1vwwbsn",
		$$css: true
	},
	focusWithin: {
		kMeerF: "x1k57tk5 x11j6mr8",
		k3XXqK: "x1t137rt xciu248",
		kjBf7l: "x1uy843r",
		kInvED: "x1wfwxd8 x1jumodi",
		$$css: true
	},
	focusWithinFirstChild: {
		kMeerF: "x1k57tk5 xmmisi4",
		k3XXqK: "x1t137rt xfd04fr",
		kjBf7l: "xobxmqy",
		kInvED: "x1wfwxd8 x2vr5qc",
		$$css: true
	},
	suppressed: {
		kMeerF: "x1k57tk5",
		k3XXqK: "x1t137rt",
		kInvED: "x1wfwxd8",
		$$css: true
	},
	publishFocusVisibleVars: {
		"--_focus-outline": "x17wzz1v xqih627",
		"--_focus-outline-offset": "xgzxwq1 xqchwus",
		$$css: true
	},
	focusWithinOrPublished: {
		kI3sdo: "xaw4jrz x16s19ga",
		kInvED: "x1kvmbwa x1jumodi",
		$$css: true
	}
};
function makeFocusOutlineProps(style) {
	return (...styles) => props(style, ...styles);
}
var focusOutlineProps = {
	focusVisible: makeFocusOutlineProps(focusOutlineStyles.focusVisible),
	focusWithin: makeFocusOutlineProps(focusOutlineStyles.focusWithin),
	focusWithinFirstChild: makeFocusOutlineProps(focusOutlineStyles.focusWithinFirstChild),
	suppressed: makeFocusOutlineProps(focusOutlineStyles.suppressed),
	publishFocusVisibleVars: makeFocusOutlineProps(focusOutlineStyles.publishFocusVisibleVars),
	focusWithinOrPublished: makeFocusOutlineProps(focusOutlineStyles.focusWithinOrPublished)
};
//#endregion
//#region node_modules/@astryxdesign/core/dist/utils/ime.js
/**
* @file ime.ts
* @input Receives a keyboard event (React SyntheticEvent's `nativeEvent`, or a
*   native DOM KeyboardEvent) with optional `isComposing` / `keyCode`.
* @output Exports `isImeKeyEvent`, the canonical predicate for "this keydown is
*   part of an in-progress IME composition and must not be treated as a command".
* @position Shared low-level utility; consumed by every editable/overlay surface
*   that handles Enter/Escape/arrows in `onKeyDown` (Typeahead, PowerSearch,
*   Dialog, ContextMenu, Tooltip, Chat composer, focus-trap Escape, ...).
*
* ── Why this exists (read once, here — do not re-explain at call sites) ──
*
* When a CJK user (Korean / Japanese / Chinese) is composing text via an IME,
* the browser fires a `keydown` event to COMMIT or CANCEL the pending
* composition (Enter commits the highlighted candidate; Escape cancels it;
* ArrowUp/Down/Home/End navigate the candidate window). Crucially this
* `keydown` fires BEFORE the `compositionend` event that actually writes the
* committed text into the field. So a naive `onKeyDown` handler sees a bare
* "Enter" or "Escape" and misreads the composition-commit/cancel as an
* application command — accepting a typeahead suggestion, submitting a chat
* message, closing a dialog/menu/tooltip, or saving a filter — mid-composition.
* The fix is to detect the composing keydown and early-return before running
* any command logic.
*
* Two signals, both needed:
*
*  1. `event.isComposing === true` — the modern, spec'd signal
*     (https://www.w3.org/TR/uievents/#dom-keyboardevent-iscomposing). This is
*     the primary check and is reliable in current evergreen browsers.
*
*  2. `event.keyCode === 229` — the legacy fallback. `229` is the sentinel
*     keyCode browsers report for "the key event is being processed by an IME".
*     It is still load-bearing: some IMEs and older Safari fire the composing
*     `keydown` with `isComposing` NOT yet set to `true`, but DO report
*     keyCode 229. Keeping both makes the guard robust across the browser
*     matrix we support. Do not drop the 229 fallback without a browser-matrix
*     audit.
*
* ── Which event object to pass ──
*
* React's SyntheticEvent for KeyboardEvent *does* surface `isComposing`, but to
* avoid any cross-browser normalization gap prefer passing the *native* event
* (`e.nativeEvent`) from React handlers — that is what BaseTypeahead,
* PowerSearch, and the Chat composer do. Native DOM listeners (Dialog,
* ContextMenu, Tooltip, focus-trap) pass the DOM `KeyboardEvent` directly.
* The parameter is intentionally structurally typed so both shapes are accepted.
*
* Note: `keyCode` is deprecated on the DOM `KeyboardEvent` type but is still
* present at runtime; we read it defensively via the optional structural field.
*/
/**
* The sentinel `keyCode` browsers report while a key event is being processed
* by an IME (the composing keydown that fires before `compositionend`). See the
* file header for why this legacy signal is still load-bearing alongside
* `isComposing`.
*/
var IME_PROCESSING_KEY_CODE = 229;
function isImeKeyEvent(event) {
	return event.isComposing === true || event.keyCode === IME_PROCESSING_KEY_CODE;
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/Layout/padding.stylex.js
/**
* Maps numeric SpacingStep values to SpacingToken keys used by the container system.
*/
var spacingStepToToken = {
	0: "spacing0",
	.5: "spacing0_5",
	1: "spacing1",
	1.5: "spacing1_5",
	2: "spacing2",
	3: "spacing3",
	4: "spacing4",
	5: "spacing5",
	6: "spacing6",
	8: "spacing8",
	10: "spacing10"
};
/**
* Padding styles for all sides using spacing tokens.
* Each key applies uniform padding to all four sides.
*/
var paddingStyles = {
	"0": {
		kZCmMZ: "x18gyask",
		kwRFfy: "x1s0aq8i",
		kLKAdn: "x1ydh6w3",
		kGO01o: "x1l20ajd",
		$$css: true
	},
	"1": {
		kZCmMZ: "x1vsv5vr",
		kwRFfy: "x1nryj5t",
		kLKAdn: "xfsso4q",
		kGO01o: "xy143xn",
		$$css: true
	},
	"2": {
		kZCmMZ: "x12gdq22",
		kwRFfy: "x1djylfy",
		kLKAdn: "x1xye8es",
		kGO01o: "x1wesfrj",
		$$css: true
	},
	"3": {
		kZCmMZ: "x126nfab",
		kwRFfy: "x1t818jl",
		kLKAdn: "x1vlblms",
		kGO01o: "xvmdzux",
		$$css: true
	},
	"4": {
		kZCmMZ: "x1rey3nv",
		kwRFfy: "xnjyzlh",
		kLKAdn: "x1oa1p4a",
		kGO01o: "x1awphl8",
		$$css: true
	},
	"5": {
		kZCmMZ: "x1blguxw",
		kwRFfy: "xdbrk9v",
		kLKAdn: "xx7rijo",
		kGO01o: "x1hk98q",
		$$css: true
	},
	"6": {
		kZCmMZ: "x31w388",
		kwRFfy: "x1we12cn",
		kLKAdn: "x1adxfkp",
		kGO01o: "xjpqqx5",
		$$css: true
	},
	"8": {
		kZCmMZ: "x1j3hnjz",
		kwRFfy: "x1q91b2g",
		kLKAdn: "xoxd1wu",
		kGO01o: "x2oz4g1",
		$$css: true
	},
	"10": {
		kZCmMZ: "xqp078j",
		kwRFfy: "x160ivqr",
		kLKAdn: "xk6660b",
		kGO01o: "x2izi54",
		$$css: true
	},
	"0.5": {
		kZCmMZ: "x138rykx",
		kwRFfy: "x1le3yxw",
		kLKAdn: "xbx876j",
		kGO01o: "xij103a",
		$$css: true
	},
	"1.5": {
		kZCmMZ: "xfti1ec",
		kwRFfy: "x17hk9do",
		kLKAdn: "x1kwdpsa",
		kGO01o: "x1opdxmq",
		$$css: true
	}
};
/**
* Container padding inline CSS variable styles for edge compensation.
* Sets --container-padding-inline-start and --container-padding-inline-end so
* edge-compensating children know the inline padding to compensate against.
*/
var containerPaddingInlineVarStyles = {
	"0": {
		"--container-padding-inline-start": "x1gu2k80",
		"--container-padding-inline-end": "x91ghl5",
		$$css: true
	},
	"1": {
		"--container-padding-inline-start": "x1cvlban",
		"--container-padding-inline-end": "x2oyxnl",
		$$css: true
	},
	"2": {
		"--container-padding-inline-start": "x1xlrr2o",
		"--container-padding-inline-end": "xcas3b9",
		$$css: true
	},
	"3": {
		"--container-padding-inline-start": "xfdwxua",
		"--container-padding-inline-end": "xu0ipoa",
		$$css: true
	},
	"4": {
		"--container-padding-inline-start": "x1dlhslv",
		"--container-padding-inline-end": "xs0pscg",
		$$css: true
	},
	"5": {
		"--container-padding-inline-start": "x1s81nki",
		"--container-padding-inline-end": "xgkj7vj",
		$$css: true
	},
	"6": {
		"--container-padding-inline-start": "x1ep0dkj",
		"--container-padding-inline-end": "x94cj42",
		$$css: true
	},
	"8": {
		"--container-padding-inline-start": "xw1diwv",
		"--container-padding-inline-end": "x1b9k1pi",
		$$css: true
	},
	"10": {
		"--container-padding-inline-start": "xserb3f",
		"--container-padding-inline-end": "xx5lg5w",
		$$css: true
	},
	"0.5": {
		"--container-padding-inline-start": "x14ws0sr",
		"--container-padding-inline-end": "x1wz3t3y",
		$$css: true
	},
	"1.5": {
		"--container-padding-inline-start": "x176g23i",
		"--container-padding-inline-end": "xntetml",
		$$css: true
	}
};
/**
* Container padding block-start/block-end CSS variable styles for vertical bleed.
* Sets --container-padding-block-start and --container-padding-block-end so bleed children (Table, Divider, Section)
* know the block padding to compensate against when first/last child.
*/
var containerPaddingBlockStartVarStyles = {
	"0": {
		"--container-padding-block-start": "x1i3qcxz",
		$$css: true
	},
	"1": {
		"--container-padding-block-start": "xnsckjb",
		$$css: true
	},
	"2": {
		"--container-padding-block-start": "xa8b4fq",
		$$css: true
	},
	"3": {
		"--container-padding-block-start": "x11k4f5r",
		$$css: true
	},
	"4": {
		"--container-padding-block-start": "xm01sq8",
		$$css: true
	},
	"5": {
		"--container-padding-block-start": "xp8wdkl",
		$$css: true
	},
	"6": {
		"--container-padding-block-start": "x1hmud4d",
		$$css: true
	},
	"8": {
		"--container-padding-block-start": "xfv60at",
		$$css: true
	},
	"10": {
		"--container-padding-block-start": "x17h9kl7",
		$$css: true
	},
	"0.5": {
		"--container-padding-block-start": "xvdf9ev",
		$$css: true
	},
	"1.5": {
		"--container-padding-block-start": "x1kbx601",
		$$css: true
	}
};
var containerPaddingBlockEndVarStyles = {
	"0": {
		"--container-padding-block-end": "xkunwnr",
		$$css: true
	},
	"1": {
		"--container-padding-block-end": "x57a7ii",
		$$css: true
	},
	"2": {
		"--container-padding-block-end": "x1lsgcmx",
		$$css: true
	},
	"3": {
		"--container-padding-block-end": "x1q3ppug",
		$$css: true
	},
	"4": {
		"--container-padding-block-end": "x4hfsld",
		$$css: true
	},
	"5": {
		"--container-padding-block-end": "xbib2ws",
		$$css: true
	},
	"6": {
		"--container-padding-block-end": "x1q8d17g",
		$$css: true
	},
	"8": {
		"--container-padding-block-end": "x8lgq76",
		$$css: true
	},
	"10": {
		"--container-padding-block-end": "x15vxphk",
		$$css: true
	},
	"0.5": {
		"--container-padding-block-end": "x1cao3zv",
		$$css: true
	},
	"1.5": {
		"--container-padding-block-end": "xv53x8y",
		$$css: true
	}
};
/**
* Layout outer X padding CSS variable styles.
*/
var layoutPaddingOuterXVarStyles = {
	"0": {
		"--layout-padding-outer-x": "xswhm3q",
		$$css: true
	},
	"1": {
		"--layout-padding-outer-x": "xc96xmq",
		$$css: true
	},
	"2": {
		"--layout-padding-outer-x": "x15dxnc0",
		$$css: true
	},
	"3": {
		"--layout-padding-outer-x": "xadgj3j",
		$$css: true
	},
	"4": {
		"--layout-padding-outer-x": "x1v56qcf",
		$$css: true
	},
	"5": {
		"--layout-padding-outer-x": "x1nzs0gl",
		$$css: true
	},
	"6": {
		"--layout-padding-outer-x": "x1c3n52a",
		$$css: true
	},
	"8": {
		"--layout-padding-outer-x": "x1t3kfz",
		$$css: true
	},
	"10": {
		"--layout-padding-outer-x": "x1jdf5a4",
		$$css: true
	},
	"0.5": {
		"--layout-padding-outer-x": "xihiwg7",
		$$css: true
	},
	"1.5": {
		"--layout-padding-outer-x": "x1u93lgd",
		$$css: true
	}
};
/**
* Layout outer Y padding CSS variable styles.
*/
var layoutPaddingOuterYVarStyles = {
	"0": {
		"--layout-padding-outer-y": "x1mzf5mb",
		$$css: true
	},
	"1": {
		"--layout-padding-outer-y": "x1gpfxoh",
		$$css: true
	},
	"2": {
		"--layout-padding-outer-y": "x10pz7y9",
		$$css: true
	},
	"3": {
		"--layout-padding-outer-y": "x1p6yq3h",
		$$css: true
	},
	"4": {
		"--layout-padding-outer-y": "xx738ci",
		$$css: true
	},
	"5": {
		"--layout-padding-outer-y": "x6yxws5",
		$$css: true
	},
	"6": {
		"--layout-padding-outer-y": "x180vrwl",
		$$css: true
	},
	"8": {
		"--layout-padding-outer-y": "xid7e43",
		$$css: true
	},
	"10": {
		"--layout-padding-outer-y": "x26l4wa",
		$$css: true
	},
	"0.5": {
		"--layout-padding-outer-y": "x1vj96e0",
		$$css: true
	},
	"1.5": {
		"--layout-padding-outer-y": "xd3dqby",
		$$css: true
	}
};
/**
* Inline-only padding styles.
* Use when a component needs to set inline (horizontal) padding independently
* of block padding — e.g. the `paddingX` prop on Stack.
*/
var paddingInlineStyles = {
	"0": {
		kZCmMZ: "x18gyask",
		kwRFfy: "x1s0aq8i",
		$$css: true
	},
	"1": {
		kZCmMZ: "x1vsv5vr",
		kwRFfy: "x1nryj5t",
		$$css: true
	},
	"2": {
		kZCmMZ: "x12gdq22",
		kwRFfy: "x1djylfy",
		$$css: true
	},
	"3": {
		kZCmMZ: "x126nfab",
		kwRFfy: "x1t818jl",
		$$css: true
	},
	"4": {
		kZCmMZ: "x1rey3nv",
		kwRFfy: "xnjyzlh",
		$$css: true
	},
	"5": {
		kZCmMZ: "x1blguxw",
		kwRFfy: "xdbrk9v",
		$$css: true
	},
	"6": {
		kZCmMZ: "x31w388",
		kwRFfy: "x1we12cn",
		$$css: true
	},
	"8": {
		kZCmMZ: "x1j3hnjz",
		kwRFfy: "x1q91b2g",
		$$css: true
	},
	"10": {
		kZCmMZ: "xqp078j",
		kwRFfy: "x160ivqr",
		$$css: true
	},
	"0.5": {
		kZCmMZ: "x138rykx",
		kwRFfy: "x1le3yxw",
		$$css: true
	},
	"1.5": {
		kZCmMZ: "xfti1ec",
		kwRFfy: "x17hk9do",
		$$css: true
	}
};
/**
* Block-only padding override styles.
* Use when a component needs to override block padding independently
* of inline padding (e.g., Toolbar sets tight block padding while
* inheriting inline padding from its container).
*/
var paddingBlockStyles = {
	"0": {
		kLKAdn: "x1ydh6w3",
		kGO01o: "x1l20ajd",
		$$css: true
	},
	"1": {
		kLKAdn: "xfsso4q",
		kGO01o: "xy143xn",
		$$css: true
	},
	"2": {
		kLKAdn: "x1xye8es",
		kGO01o: "x1wesfrj",
		$$css: true
	},
	"3": {
		kLKAdn: "x1vlblms",
		kGO01o: "xvmdzux",
		$$css: true
	},
	"4": {
		kLKAdn: "x1oa1p4a",
		kGO01o: "x1awphl8",
		$$css: true
	},
	"5": {
		kLKAdn: "xx7rijo",
		kGO01o: "x1hk98q",
		$$css: true
	},
	"6": {
		kLKAdn: "x1adxfkp",
		kGO01o: "xjpqqx5",
		$$css: true
	},
	"8": {
		kLKAdn: "xoxd1wu",
		kGO01o: "x2oz4g1",
		$$css: true
	},
	"10": {
		kLKAdn: "xk6660b",
		kGO01o: "x2izi54",
		$$css: true
	},
	"0.5": {
		kLKAdn: "xbx876j",
		kGO01o: "xij103a",
		$$css: true
	},
	"1.5": {
		kLKAdn: "x1kwdpsa",
		kGO01o: "x1opdxmq",
		$$css: true
	}
};
/**
* Inline-start-only padding override styles.
* Use when a component needs to override the inline-start edge independently
* of inline-end. Logical, so it follows the writing direction (left in LTR,
* right in RTL).
*/
var paddingInlineStartStyles = {
	"0": {
		kZCmMZ: "x18gyask",
		$$css: true
	},
	"1": {
		kZCmMZ: "x1vsv5vr",
		$$css: true
	},
	"2": {
		kZCmMZ: "x12gdq22",
		$$css: true
	},
	"3": {
		kZCmMZ: "x126nfab",
		$$css: true
	},
	"4": {
		kZCmMZ: "x1rey3nv",
		$$css: true
	},
	"5": {
		kZCmMZ: "x1blguxw",
		$$css: true
	},
	"6": {
		kZCmMZ: "x31w388",
		$$css: true
	},
	"8": {
		kZCmMZ: "x1j3hnjz",
		$$css: true
	},
	"10": {
		kZCmMZ: "xqp078j",
		$$css: true
	},
	"0.5": {
		kZCmMZ: "x138rykx",
		$$css: true
	},
	"1.5": {
		kZCmMZ: "xfti1ec",
		$$css: true
	}
};
/**
* Inline-end-only padding override styles.
* The inline-end counterpart of paddingInlineStartStyles.
*/
var paddingInlineEndStyles = {
	"0": {
		kwRFfy: "x1s0aq8i",
		$$css: true
	},
	"1": {
		kwRFfy: "x1nryj5t",
		$$css: true
	},
	"2": {
		kwRFfy: "x1djylfy",
		$$css: true
	},
	"3": {
		kwRFfy: "x1t818jl",
		$$css: true
	},
	"4": {
		kwRFfy: "xnjyzlh",
		$$css: true
	},
	"5": {
		kwRFfy: "xdbrk9v",
		$$css: true
	},
	"6": {
		kwRFfy: "x1we12cn",
		$$css: true
	},
	"8": {
		kwRFfy: "x1q91b2g",
		$$css: true
	},
	"10": {
		kwRFfy: "x160ivqr",
		$$css: true
	},
	"0.5": {
		kwRFfy: "x1le3yxw",
		$$css: true
	},
	"1.5": {
		kwRFfy: "x17hk9do",
		$$css: true
	}
};
/**
* Container padding inline-start CSS variable style, set independently of
* inline-end so a per-edge override keeps edge-compensating children (Card,
* Divider, a nested Section) compensating against the padding actually
* applied on that edge.
*/
var containerPaddingInlineStartVarStyles = {
	"0": {
		"--container-padding-inline-start": "x1gu2k80",
		$$css: true
	},
	"1": {
		"--container-padding-inline-start": "x1cvlban",
		$$css: true
	},
	"2": {
		"--container-padding-inline-start": "x1xlrr2o",
		$$css: true
	},
	"3": {
		"--container-padding-inline-start": "xfdwxua",
		$$css: true
	},
	"4": {
		"--container-padding-inline-start": "x1dlhslv",
		$$css: true
	},
	"5": {
		"--container-padding-inline-start": "x1s81nki",
		$$css: true
	},
	"6": {
		"--container-padding-inline-start": "x1ep0dkj",
		$$css: true
	},
	"8": {
		"--container-padding-inline-start": "xw1diwv",
		$$css: true
	},
	"10": {
		"--container-padding-inline-start": "xserb3f",
		$$css: true
	},
	"0.5": {
		"--container-padding-inline-start": "x14ws0sr",
		$$css: true
	},
	"1.5": {
		"--container-padding-inline-start": "x176g23i",
		$$css: true
	}
};
/**
* Container padding inline-end CSS variable style, the counterpart of
* containerPaddingInlineStartVarStyles.
*/
var containerPaddingInlineEndVarStyles = {
	"0": {
		"--container-padding-inline-end": "x91ghl5",
		$$css: true
	},
	"1": {
		"--container-padding-inline-end": "x2oyxnl",
		$$css: true
	},
	"2": {
		"--container-padding-inline-end": "xcas3b9",
		$$css: true
	},
	"3": {
		"--container-padding-inline-end": "xu0ipoa",
		$$css: true
	},
	"4": {
		"--container-padding-inline-end": "xs0pscg",
		$$css: true
	},
	"5": {
		"--container-padding-inline-end": "xgkj7vj",
		$$css: true
	},
	"6": {
		"--container-padding-inline-end": "x94cj42",
		$$css: true
	},
	"8": {
		"--container-padding-inline-end": "x1b9k1pi",
		$$css: true
	},
	"10": {
		"--container-padding-inline-end": "xx5lg5w",
		$$css: true
	},
	"0.5": {
		"--container-padding-inline-end": "x1wz3t3y",
		$$css: true
	},
	"1.5": {
		"--container-padding-inline-end": "xntetml",
		$$css: true
	}
};
/**
* Block-start-only padding override styles.
* Use when a component needs to override the block-start (top) edge
* independently of block-end — e.g. a section that sits under a sticky
* header and needs less padding above than below.
*/
var paddingBlockStartStyles = {
	"0": {
		kLKAdn: "x1ydh6w3",
		$$css: true
	},
	"1": {
		kLKAdn: "xfsso4q",
		$$css: true
	},
	"2": {
		kLKAdn: "x1xye8es",
		$$css: true
	},
	"3": {
		kLKAdn: "x1vlblms",
		$$css: true
	},
	"4": {
		kLKAdn: "x1oa1p4a",
		$$css: true
	},
	"5": {
		kLKAdn: "xx7rijo",
		$$css: true
	},
	"6": {
		kLKAdn: "x1adxfkp",
		$$css: true
	},
	"8": {
		kLKAdn: "xoxd1wu",
		$$css: true
	},
	"10": {
		kLKAdn: "xk6660b",
		$$css: true
	},
	"0.5": {
		kLKAdn: "xbx876j",
		$$css: true
	},
	"1.5": {
		kLKAdn: "x1kwdpsa",
		$$css: true
	}
};
/**
* Block-end-only padding override styles.
* The block-end counterpart of paddingBlockStartStyles.
*/
var paddingBlockEndStyles = {
	"0": {
		kGO01o: "x1l20ajd",
		$$css: true
	},
	"1": {
		kGO01o: "xy143xn",
		$$css: true
	},
	"2": {
		kGO01o: "x1wesfrj",
		$$css: true
	},
	"3": {
		kGO01o: "xvmdzux",
		$$css: true
	},
	"4": {
		kGO01o: "x1awphl8",
		$$css: true
	},
	"5": {
		kGO01o: "x1hk98q",
		$$css: true
	},
	"6": {
		kGO01o: "xjpqqx5",
		$$css: true
	},
	"8": {
		kGO01o: "x2oz4g1",
		$$css: true
	},
	"10": {
		kGO01o: "x2izi54",
		$$css: true
	},
	"0.5": {
		kGO01o: "xij103a",
		$$css: true
	},
	"1.5": {
		kGO01o: "x1opdxmq",
		$$css: true
	}
};
/**
* Propagation styles for `--_section-padding-propagated`.
* When a parent section sets explicit padding, this propagates the value
* through the CSS custom property cascade so nested sections that use
* useThemeDefault inherit the parent's padding instead of the theme default.
*
* This is deliberately NOT the public `--astryx-section-padding` token. The
* two carry different authority: the public token is the THEME's section
* padding, set once at the theme root, while this one is one ancestor
* Section's padding, propagated down the tree. An overlay has to drop the
* inherited value at its boundary (see {@link overlayPaddingReset}) without
* dropping the theme's — impossible while both live under one name.
* `container.stylex.ts` reads this ahead of the public token, so a propagated
* value still wins over the theme for nested sections, as before.
*/
var sectionPaddingPropagationStyles = {
	"0": {
		"--_section-padding-propagated": "x7mo41q",
		$$css: true
	},
	"1": {
		"--_section-padding-propagated": "x1j3iakl",
		$$css: true
	},
	"2": {
		"--_section-padding-propagated": "xezgk69",
		$$css: true
	},
	"3": {
		"--_section-padding-propagated": "x1wtz8uf",
		$$css: true
	},
	"4": {
		"--_section-padding-propagated": "x5wdj8h",
		$$css: true
	},
	"5": {
		"--_section-padding-propagated": "xgjndll",
		$$css: true
	},
	"6": {
		"--_section-padding-propagated": "x15i4jqh",
		$$css: true
	},
	"8": {
		"--_section-padding-propagated": "xmb9lpv",
		$$css: true
	},
	"10": {
		"--_section-padding-propagated": "x4h2jfd",
		$$css: true
	},
	"0.5": {
		"--_section-padding-propagated": "x2ccaqq",
		$$css: true
	},
	"1.5": {
		"--_section-padding-propagated": "xxa843v",
		$$css: true
	}
};
/**
* Padding-variable reset for overlay roots (Dialog, BottomSheet, Drawer,
* MobileNav, Lightbox, and every layer surface).
*
* ## Why an overlay needs this
*
* The container padding system talks to descendants through inherited custom
* properties: a padded container announces its padding, and children read the
* value either to apply it or to cancel it with a negative margin
* (`Section`, `Divider`, `Layout`, `Table`).
*
* Inheritance follows the DOM, but an overlay leaves its parent's visual box —
* a fixed/top-layer `<dialog>` is a DOM descendant of the padded page while
* being nowhere near it on screen. It inherits values describing padding that
* is not there, and its content compensates against phantom space: a `Section`
* inside a 640px sheet rendered 672px wide and hung off both edges (#5208).
*
* Two families leak, and they need opposite treatments:
*
* - `--container-padding-*` -> `0px`. Descendants SUBTRACT these (bleed
*   margins). The overlay root has no padding of its own to escape, so the
*   honest answer is zero. Nested containers that do set padding (a Dialog's
*   content wrapper) re-announce their own values below this point, so
*   legitimate edge-to-edge bleed inside the overlay is unaffected.
* - `--layout-padding-*` and `--_section-padding-propagated` -> `initial`.
*   Descendants ADD these, so zeroing them would strip padding rather than
*   restore it. `initial` makes each guaranteed-invalid, so readers fall
*   through their own `var(…, fallback)` chain and land on the theme default —
*   which is what an overlay at the top of the tree should show.
*
* `initial` is also why propagation moved off `--astryx-section-padding`: that
* name is public theme surface, set at the theme root, and making it invalid
* here would blank the theme's own section padding inside every overlay.
*
* Apply on the overlay's outermost styled element.
*
* @example
* ```
* <dialog {...stylex.props(styles.dialog, overlayPaddingReset.reset)} />
* ```
*/
var overlayPaddingReset = { reset: {
	"--container-padding-inline-start": "xrhngw9",
	"--container-padding-inline-end": "xjsfl84",
	"--container-padding-block-start": "x1047aw6",
	"--container-padding-block-end": "xax9j7h",
	"--layout-padding-outer-x": "xdt8ak2",
	"--layout-padding-outer-y": "x1rs4lu4",
	"--layout-padding-inner-x": "x1qfll2g",
	"--layout-padding-inner-y": "xyvxpqs",
	"--_section-padding-propagated": "x1f17rg1",
	$$css: true
} };
//#endregion
//#region node_modules/@astryxdesign/core/dist/Layout/Layout.js
/**
* @file Layout.tsx
* @input Uses React, stack/stackItem utilities, LayoutAreaContext, LayoutSlotsContext
* @output Exports Layout component and LayoutProps, LayoutHeight types
* @position Page shell and app layout — use for any page with a header, sidebar, or content area.
*   Building a page with a sidebar? Use Layout with start/end slots.
*   Need a header + scrollable content? Use Layout with header + content slots.
*   Manages padding collapse, scroll containment, and responsive slot sizing automatically.
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/Layout/Layout.doc.mjs
* - /apps/storybook/stories/Layout.stories.tsx
* - /packages/cli/assets/templates/blocks/components/Layout/ (showcase blocks)
*/
/**
* Height behavior for the layout.
* - `fill`: Layout fills container height, content scrolls internally (default)
* - `auto`: Layout grows with content, container/page scrolls
*/
var styles$38 = {
	layoutOuter: {
		keTefX: "xojxgvx",
		k71WvV: "x1fcf3bl",
		keoZOQ: "x1sa9bsh",
		k1K539: "x6h7pi7",
		$$css: true
	},
	layoutInner: {
		"--container-padding-inline-start": "xrhngw9",
		"--container-padding-inline-end": "xjsfl84",
		"--container-padding-block-start": "x1047aw6",
		"--container-padding-block-end": "xax9j7h",
		$$css: true
	},
	fill: {
		kZKoxP: "x12qplqi",
		kskxy: "xenllk4",
		$$css: true
	},
	auto: {
		kAzted: "x1us19tq",
		$$css: true
	},
	middle: {
		kUk6DE: "x98rzlu",
		kAzted: "x2lwn1j",
		$$css: true
	},
	fullBleed: {
		"--layout-padding-outer-x": "x1wbjvqu",
		"--layout-padding-outer-y": "xzxxx64",
		$$css: true
	}
};
var _temp$6 = {
	kzqmXN: "xh8yej3",
	kUOVxO: "xvueqy4",
	"$$css": true
};
var dynamicStyles$14 = {
	contentWidthVar: (width) => [{
		"--layout-content-width": (typeof width === "number" ? `${width}px` : width) != null ? "x4906uf" : typeof width === "number" ? `${width}px` : width,
		$$css: true
	}, { "--x---layout-content-width": (typeof width === "number" ? `${width}px` : width) != null ? typeof width === "number" ? `${width}px` : width : void 0 }],
	contentWidth: (width) => [
		_temp$6,
		{
			ks0D6T: (typeof width === "number" ? `${width}px` : width) != null ? "xf68679" : typeof width === "number" ? `${width}px` : width,
			$$css: true
		},
		{ "--x-maxWidth": ((val) => typeof val === "number" ? val + "px" : val != null ? val : void 0)(typeof width === "number" ? `${width}px` : width) }
	]
};
/**
* Helper component to wrap content in layout area context.
*/
function AreaProvider({ area, children }) {
	if (children == null) return null;
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(LayoutAreaContext, {
		value: area,
		children
	});
}
/**
* Page shell with header, sidebar(s), content, and footer slots.
* Use this for full-page layouts, app shells, dashboard layouts, or any UI
* that needs a header bar, side navigation, scrollable content area, or action footer.
* Can be used standalone for page-level layouts, or inside a container
* (Card, Section) for content-level layouts.
*
* Handles padding collapse between adjacent slots, scroll containment in the
* content area, and automatic RTL support via CSS logical properties.
*
* Structure:
* ```
* ┌─────────────────────────────────────────┐
* │                 header                  │
* ├──────┬─────────────────────────┬────────┤
* │      │                         │        │
* │start │        content          │  end   │
* │      │                         │        │
* ├──────┴─────────────────────────┴────────┤
* │                 footer                  │
* └─────────────────────────────────────────┘
* ```
*
* When to use Layout vs raw flexbox:
* - Page with a sidebar → Layout with `start` slot
* - Dashboard with header + scrollable body → Layout with `header` + `content`
* - Settings page with nav panel → Layout with `start` + `content`
* - Simple vertical stack of items → use VStack instead
*
* @example
* ```
* <Layout
*   header={<LayoutHeader hasDivider>App Name</LayoutHeader>}
*   start={
*     <LayoutPanel hasDivider width={240} role="navigation">
*       <Navigation />
*     </LayoutPanel>
*   }
*   content={
*     <LayoutContent role="main">
*       <MainContent />
*     </LayoutContent>
*   }
* />
* ```
*/
var _temp2$1 = {
	"x-default-marker": "x-default-marker",
	$$css: true
};
function Layout({ children, content, contentWidth, defaultHasDividers, end, footer, header, height = "fill", padding, ref, start, xstyle, className, style }) {
	const isFill = height === "fill";
	const resolvedContent = content ?? children;
	const dividerCtxValue = (0, import_react.useMemo)(() => defaultHasDividers != null ? { defaultHasDividers } : null, [defaultHasDividers]);
	const hasHeader = header != null;
	const hasFooter = footer != null;
	const hasStart = start != null;
	const hasEnd = end != null;
	const slotsValue = (0, import_react.useMemo)(() => ({
		hasHeader,
		hasFooter,
		hasStart,
		hasEnd
	}), [
		hasHeader,
		hasFooter,
		hasStart,
		hasEnd
	]);
	const tree = /*#__PURE__*/ (0, import_jsx_runtime.jsx)(LayoutSlotsContext, {
		value: slotsValue,
		children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
			ref,
			...mergeProps(themeProps("layout", { height }), props(styles$38.layoutOuter, isFill ? styles$38.fill : styles$38.auto, xstyle), className, style),
			children: /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("div", {
				...props(_temp2$1, styles$38.layoutInner, ...stack({ direction: "vertical" }), isFill ? styles$38.fill : styles$38.auto, padding === 0 && styles$38.fullBleed, padding != null && layoutPaddingOuterXVarStyles[padding], padding != null && layoutPaddingOuterYVarStyles[padding], contentWidth != null && dynamicStyles$14.contentWidthVar(contentWidth)),
				children: [
					/*#__PURE__*/ (0, import_jsx_runtime.jsx)(AreaProvider, {
						area: "header",
						children: header
					}),
					/*#__PURE__*/ (0, import_jsx_runtime.jsxs)("div", {
						...props(...stack({ direction: "horizontal" }), styles$38.middle, contentWidth != null && dynamicStyles$14.contentWidth(contentWidth)),
						children: [
							/*#__PURE__*/ (0, import_jsx_runtime.jsx)(AreaProvider, {
								area: "start",
								children: start
							}),
							/*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
								...props(...stackItem({ size: "fill" })),
								children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)(AreaProvider, {
									area: "content",
									children: resolvedContent
								})
							}),
							/*#__PURE__*/ (0, import_jsx_runtime.jsx)(AreaProvider, {
								area: "end",
								children: end
							})
						]
					}),
					/*#__PURE__*/ (0, import_jsx_runtime.jsx)(AreaProvider, {
						area: "footer",
						children: footer
					})
				]
			})
		})
	});
	if (dividerCtxValue != null) return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(LayoutDividerContext, {
		value: dividerCtxValue,
		children: tree
	});
	return tree;
}
Layout.displayName = "Layout";
//#endregion
//#region node_modules/@astryxdesign/core/dist/Layout/LayoutHeader.js
/**
* @file LayoutHeader.tsx
* @input Uses React StyleX
* @output Exports LayoutHeader component and LayoutHeaderProps
* @position Top bar / header area for Layout. Use for page titles, app bars,
*   toolbar areas, or any fixed-height content at the top of a layout.
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/Layout/Layout.doc.mjs
* - /apps/storybook/stories/Layout.stories.tsx
* - /packages/cli/assets/templates/blocks/components/Layout/ (showcase blocks)
*/
var styles$37 = {
	header: {
		kmuXW: "x2lah0s",
		$$css: true
	},
	inner: {
		kB7OPa: "x9f619",
		ks0D6T: "xjl2t3p",
		kUOVxO: "xvueqy4",
		kZCmMZ: "x139j0dd",
		kwRFfy: "xpc6k2p",
		kLKAdn: "x81pis9",
		kGO01o: "xg476vw",
		"--container-padding-inline-start": "xdvaxxn",
		"--container-padding-inline-end": "xqpvj4r",
		"--container-padding-block-start": "xzz8v79",
		"--container-padding-block-end": "xi9ns85",
		$$css: true
	},
	fullBleed: {
		kZCmMZ: "x1c1uobl",
		kwRFfy: "xyri2b",
		kLKAdn: "xexx8yu",
		kGO01o: "x18d9i69",
		"--container-padding-inline-start": "xrhngw9",
		"--container-padding-inline-end": "xjsfl84",
		"--container-padding-block-start": "x1047aw6",
		"--container-padding-block-end": "xax9j7h",
		$$css: true
	},
	divider: {
		kt9PQ7: "xso031l",
		kfdmCh: "x1q0q8m5",
		kL6WhQ: "xw8gpjh",
		$$css: true
	}
};
var dynamicStyles$13 = { sizing: (height) => [{
	kZKoxP: height != null ? "x16ye13r" : height,
	$$css: true
}, { "--x-height": ((val) => typeof val === "number" ? val + "px" : val != null ? val : void 0)(height) }] };
/**
* Top bar / header for Layout. Use for page titles, app bars, or toolbars.
* Renders in the header slot with optional divider and padding control.
*
* Already provides its own padding — don't add padding to children.
* Use `padding={0}` if your content manages its own padding (e.g. TopNav).
*
* @example
* ```
* <LayoutContainer variant="card">
*   <Layout
*     header={<LayoutHeader hasDivider>Page Title</LayoutHeader>}
*     content={<LayoutContent>...</LayoutContent>}
*   />
* </LayoutContainer>
* ```
*/
function LayoutHeader({ children, hasDivider, height, label, padding, role, xstyle, className, style, ref, ...props$30 }) {
	const dividerCtx = (0, import_react.use)(LayoutDividerContext);
	const resolvedHasDivider = hasDivider ?? dividerCtx?.defaultHasDividers ?? false;
	const isZeroPadding = padding === 0;
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
		ref,
		role,
		"aria-label": label,
		"data-divider": resolvedHasDivider || void 0,
		...mergeProps(themeProps("layout-header"), props(styles$37.header, dynamicStyles$13.sizing(height ?? null), resolvedHasDivider && styles$37.divider, xstyle), className, style),
		...props$30,
		children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
			...props(styles$37.inner, isZeroPadding && styles$37.fullBleed, padding != null && paddingStyles[padding], padding != null && containerPaddingInlineVarStyles[padding], padding != null && containerPaddingBlockStartVarStyles[padding], padding != null && containerPaddingBlockEndVarStyles[padding]),
			children
		})
	});
}
LayoutHeader.displayName = "LayoutHeader";
//#endregion
//#region node_modules/@astryxdesign/core/dist/Layout/LayoutPanel.js
/**
* @file LayoutPanel.tsx
* @input Uses React StyleX, LayoutAreaContext, LayoutSlotsContext
* @output Exports LayoutPanel component and LayoutPanelProps
* @position Sidebar panel for Layout start/end slots. Use for navigation panels,
*   settings sidebars, detail panels, or any fixed-width side content.
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/Layout/Layout.doc.mjs
* - /apps/storybook/stories/Layout.stories.tsx
* - /packages/cli/assets/templates/blocks/components/Layout/ (showcase blocks)
*/
var styles$36 = {
	panel: {
		kB7OPa: "x9f619",
		kmuXW: "x2lah0s",
		kVQacm: "x7giv3",
		kZCmMZ: "xwjyata",
		kwRFfy: "x1peupej",
		kLKAdn: "xqty4a",
		kGO01o: "xg476vw",
		"--container-padding-inline-start": "x408pgh",
		"--container-padding-inline-end": "xikqloz",
		"--container-padding-block-start": "xjmgx01",
		"--container-padding-block-end": "xi9ns85",
		$$css: true
	},
	startPanel: {
		kZCmMZ: "x139j0dd",
		$$css: true
	},
	endPanel: {
		kwRFfy: "xpc6k2p",
		$$css: true
	},
	noHeader: {
		kLKAdn: "x81pis9",
		$$css: true
	},
	noFooter: {
		kGO01o: "xon7vh3",
		$$css: true
	},
	fullBleed: {
		kZCmMZ: "x1c1uobl",
		kwRFfy: "xyri2b",
		kLKAdn: "xexx8yu",
		kGO01o: "x18d9i69",
		"--container-padding-inline-start": "xrhngw9",
		"--container-padding-inline-end": "xjsfl84",
		"--container-padding-block-start": "x1047aw6",
		"--container-padding-block-end": "xax9j7h",
		$$css: true
	},
	scrollable: {
		kVQacm: "xysyzu8",
		$$css: true
	},
	dividerEnd: {
		ke9TFa: "x1lun4ml",
		k8ry5P: "x18b5jzi",
		kBCPoo: "x1gejf6u",
		$$css: true
	},
	dividerStart: {
		k2ei4v: "xpilrb4",
		kVhnKS: "x1t7ytsu",
		kGJrpR: "x1j92z86",
		$$css: true
	},
	collapseStart: {
		keTefX: "x1wim8z0",
		$$css: true
	},
	collapseEnd: {
		k71WvV: "x1kpg4um",
		$$css: true
	}
};
var dynamicStyles$12 = { sizing: (width) => [{
	kzqmXN: width != null ? "x5lhr3w" : width,
	$$css: true
}, { "--x-width": ((val) => typeof val === "number" ? val + "px" : val != null ? val : void 0)(width) }] };
/**
* Sidebar or side panel for Layout. Use in the `start` slot for left navigation
* or in the `end` slot for detail/inspector panels.
* Renders with optional divider and context-aware padding.
* Divider position is auto-detected based on which slot the panel is in.
*
* Already provides its own padding and scroll — don't add padding or
* overflow to children. Use `padding={0}` if you need edge-to-edge content.
*
* @example
* ```
* <LayoutContainer variant="card">
*   <Layout
*     start={
*       <LayoutPanel hasDivider role="navigation">
*         <Navigation />
*       </LayoutPanel>
*     }
*     content={<LayoutContent>Main content</LayoutContent>}
*     end={
*       <LayoutPanel hasDivider role="complementary">
*         <Sidebar />
*       </LayoutPanel>
*     }
*   />
* </LayoutContainer>
* ```
*/
function LayoutPanel({ children, hasDivider = false, isScrollable = true, label, padding, role, width, resizable, xstyle, className, style, ref, ...props$29 }) {
	const area = (0, import_react.use)(LayoutAreaContext);
	const { hasHeader, hasFooter } = (0, import_react.use)(LayoutSlotsContext);
	const effectiveWidth = resizable ? resizable._size : width;
	const isStartPanel = area === "start";
	const isEndPanel = area === "end";
	const isZeroPadding = padding === 0;
	const shouldCollapseSpacing = !hasDivider && !isZeroPadding && padding == null;
	const dividerStyle = isStartPanel ? styles$36.dividerEnd : isEndPanel ? styles$36.dividerStart : null;
	const collapseStyle = isStartPanel ? styles$36.collapseEnd : isEndPanel ? styles$36.collapseStart : null;
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
		ref,
		role,
		"aria-label": label,
		...mergeProps(themeProps("layout-panel"), props(styles$36.panel, dynamicStyles$12.sizing(effectiveWidth ?? null), isStartPanel && !isZeroPadding && padding == null && styles$36.startPanel, isEndPanel && !isZeroPadding && padding == null && styles$36.endPanel, !hasHeader && !isZeroPadding && padding == null && styles$36.noHeader, !hasFooter && !isZeroPadding && padding == null && styles$36.noFooter, isScrollable && styles$36.scrollable, isZeroPadding && styles$36.fullBleed, padding != null && paddingStyles[padding], padding != null && containerPaddingInlineVarStyles[padding], padding != null && containerPaddingBlockStartVarStyles[padding], padding != null && containerPaddingBlockEndVarStyles[padding], hasDivider && dividerStyle, shouldCollapseSpacing && collapseStyle, xstyle), className, style),
		...props$29,
		children
	});
}
LayoutPanel.displayName = "LayoutPanel";
//#endregion
//#region node_modules/@astryxdesign/core/dist/Layout/LayoutContent.js
/**
* @file LayoutContent.tsx
* @input Uses React StyleX, LayoutSlotsContext
* @output Exports LayoutContent component and LayoutContentProps
* @position Scrollable main content area for Layout. Wraps the primary body content
*   with automatic scroll containment and context-aware padding.
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/Layout/Layout.doc.mjs
* - /apps/storybook/stories/Layout.stories.tsx
* - /packages/cli/assets/templates/blocks/components/Layout/ (showcase blocks)
*/
var styles$35 = {
	content: {
		kB7OPa: "x9f619",
		kZKoxP: "x5yr21d",
		kUk6DE: "x98rzlu",
		kAzted: "x2lwn1j",
		kVQacm: "x7giv3",
		kZCmMZ: "xwjyata",
		kwRFfy: "x1peupej",
		kLKAdn: "xqty4a x1ioh5az",
		kGO01o: "xg476vw xsg11nj",
		"--container-padding-inline-start": "x408pgh",
		"--container-padding-inline-end": "xikqloz",
		"--container-padding-block-start": "xjmgx01",
		"--container-padding-block-end": "xi9ns85",
		$$css: true
	},
	noStart: {
		kZCmMZ: "x139j0dd",
		"--container-padding-inline-start": "xdvaxxn",
		"--container-padding-inline-end": "xqpvj4r",
		$$css: true
	},
	noEnd: {
		kwRFfy: "xpc6k2p",
		$$css: true
	},
	noHeader: {
		kLKAdn: "x81pis9",
		"--container-padding-block-start": "xzz8v79",
		$$css: true
	},
	noFooter: {
		kGO01o: "xon7vh3",
		"--container-padding-block-end": "x1xjq73n",
		$$css: true
	},
	scrollable: {
		kVQacm: "xysyzu8",
		$$css: true
	},
	fullBleed: {
		kZCmMZ: "x1c1uobl",
		kwRFfy: "xyri2b",
		kLKAdn: "xexx8yu",
		kGO01o: "x18d9i69",
		"--container-padding-inline-start": "xrhngw9",
		"--container-padding-inline-end": "xjsfl84",
		"--container-padding-block-start": "x1047aw6",
		"--container-padding-block-end": "xax9j7h",
		$$css: true
	}
};
/**
* Scrollable main content area for Layout. Wraps the primary body content
* with automatic scroll containment and context-aware padding.
*
* Already provides its own padding and scroll — don't add padding or
* overflow to children. Use `padding={0}` if you need edge-to-edge content.
*
* @example
* ```
* <LayoutContainer variant="card">
*   <Layout
*     header={<LayoutHeader>Title</LayoutHeader>}
*     content={<LayoutContent>Main body content</LayoutContent>}
*   />
* </LayoutContainer>
* <LayoutContainer variant="card">
*   <Layout
*     content={
*       <LayoutContent padding={0}>
*         <Table />
*       </LayoutContent>
*     }
*   />
* </LayoutContainer>
* <LayoutContainer variant="card">
*   <Layout
*     content={
*       <LayoutContent isScrollable={false}>
*         <StickyElement />
*       </LayoutContent>
*     }
*   />
* </LayoutContainer>
* ```
*/
function LayoutContent({ children, isScrollable = true, padding, label, role, xstyle, className, style, ref, ...props$28 }) {
	const { hasHeader, hasFooter, hasStart, hasEnd } = (0, import_react.use)(LayoutSlotsContext);
	const isZeroPadding = padding === 0;
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
		ref,
		role,
		"aria-label": label,
		...mergeProps(themeProps("layout-content"), props(styles$35.content, !hasStart && !isZeroPadding && padding == null && styles$35.noStart, !hasEnd && !isZeroPadding && padding == null && styles$35.noEnd, !hasHeader && !isZeroPadding && padding == null && styles$35.noHeader, !hasFooter && !isZeroPadding && padding == null && styles$35.noFooter, isScrollable && styles$35.scrollable, isZeroPadding && styles$35.fullBleed, padding != null && paddingStyles[padding], padding != null && containerPaddingInlineVarStyles[padding], padding != null && containerPaddingBlockStartVarStyles[padding], padding != null && containerPaddingBlockEndVarStyles[padding], xstyle), className, style),
		...props$28,
		children
	});
}
LayoutContent.displayName = "LayoutContent";
//#endregion
//#region node_modules/@astryxdesign/core/dist/Layer/anchorName.js
/**
* @file anchorName.ts
* @input HTMLElement with CSS anchor-name property
* @output Helpers for managing comma-separated anchor-name lists
* @position Utility; used by useLayer for multi-anchor support
*
* SYNC: When modified, update:
* - /packages/core/src/Layer/useLayer.tsx (imports from here)
*/
/**
* CSS `anchor-name` is a comma-separated list, so multiple layers can anchor to
* the same element (e.g. several TopNavMegaMenus anchored to one <nav>). These
* helpers add/remove a single layer's anchor id without clobbering the others —
* overwriting the whole property would break every sibling layer's positioning.
*/
function readAnchorNames(el) {
	return (el.style.anchorName ?? "").split(",").map((name) => name.trim()).filter(Boolean);
}
function writeAnchorNames(el, names) {
	el.style.anchorName = names.join(", ");
}
function addAnchorName(el, name) {
	const names = readAnchorNames(el);
	if (!names.includes(name)) {
		names.push(name);
		writeAnchorNames(el, names);
	}
}
function removeAnchorName(el, name) {
	writeAnchorNames(el, readAnchorNames(el).filter((existing) => existing !== name));
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/Layer/gestureCounter.js
/**
* @file gestureCounter.ts
* @input Listens for pointerdown, keydown, and click on the document
* @output Exports the current gesture identity and whether its click has run
* @position Internal to Layer; used by useLayer to tell a click that belongs
*   to a dismissing press from a fresh one
*
* A browser light-dismiss and the trigger's own click come from ONE press, and
* which of them React sees first is a race. Comparing timestamps against a
* window guesses; counting gestures does not. The counter advances on every
* new press or keystroke, so "the click from the gesture that dismissed the
* layer" is exactly "the click while the counter still reads what it read at
* the dismissal", no matter how long the main thread was blocked in between.
*/
var gesture = 0;
var clickedGesture = null;
var isListening$2 = false;
function advance() {
	gesture += 1;
}
function markClicked() {
	clickedGesture = gesture;
}
function listen() {
	if (isListening$2 || typeof document === "undefined") return;
	isListening$2 = true;
	document.addEventListener("pointerdown", advance, true);
	document.addEventListener("keydown", advance, true);
	document.addEventListener("click", markClicked, true);
}
/**
* Identifies the user gesture in flight. Two reads returning the same value
* happened within one press (or one keystroke).
*/
function currentGesture() {
	listen();
	return gesture;
}
/** Whether the click belonging to the current gesture already bubbled. */
function currentGestureHasClicked() {
	listen();
	return clickedGesture === gesture;
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/Layer/layerHost.js
/**
* @file layerHost.ts
* @input Uses the layer's intended inline parent element
* @output Exports resolveLayerPortalTarget, the corrective portal target
* @position Layer utility; used by useLayer to place the popover in the DOM
*
* SYNC: When modified, update:
* - /packages/core/src/Layer/layerHost.test.ts
*/
/**
* Ancestors a layer must not be hosted inside.
*
* Two overlapping reasons, both verified in Chrome:
*
* 1. The HTML parser owns server markup. `<p>` and the heading-ish elements
*    take phrasing content only, so a block element inside one makes the
*    parser close the paragraph and reparent the rest — the layer's content
*    ends up in the page instead of the popover. A nested `<a>` triggers the
*    same tearing through the adoption agency algorithm.
* 2. Interactive ancestors capture the layer's own interactions. A card
*    hosted inside an `<a>` or `<button>` puts its links and buttons inside
*    that control: clicking one navigates the wrapping link, and every
*    focusable in the card joins the control's own tab stop.
*
* Inline formatting elements are on the list for a third, milder reason: a
* layer hosted in one inherits its typography (font-size, text-align), so a
* card in a 13px centered paragraph renders 13px and centered.
*/
var UNSAFE_HOSTS = /* @__PURE__ */ new Set([
	"p",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"dt",
	"pre",
	"legend",
	"data",
	"dfn",
	"meter",
	"output",
	"progress",
	"option",
	"optgroup",
	"table",
	"thead",
	"tbody",
	"tfoot",
	"tr",
	"colgroup",
	"ul",
	"ol",
	"menu",
	"dl",
	"select",
	"datalist",
	"picture",
	"hgroup",
	"ruby",
	"rt",
	"rp",
	"a",
	"button",
	"label",
	"summary",
	"span",
	"em",
	"strong",
	"b",
	"i",
	"u",
	"s",
	"small",
	"mark",
	"code",
	"kbd",
	"samp",
	"var",
	"sub",
	"sup",
	"abbr",
	"cite",
	"q",
	"time",
	"bdi",
	"bdo",
	"ins",
	"del"
]);
/**
* Return the corrective portal target for a layer's intended inline parent.
*
* A null result means the inline parent and all of its ancestors are safe, so
* the layer should stay at its JSX position. Otherwise the result is the
* nearest element outside every unsafe ancestor around that position.
*
* Walking up from the actual render position (rather than the trigger, or
* portaling to `document.body`) keeps the two things a layer inherits there:
*
* - **Theme.** Theme scopes live on DOM ancestors. Staying as close as
*   possible to the intended render position preserves their component rules
*   and custom properties; `document.body` may sit outside a nested scope.
* - **Tab order.** Sequential focus follows DOM order, so a host near the
*   trigger keeps the layer's focusables next to it. (`show()` also passes
*   the trigger as the popover's invoker `source`, which pins focus order to
*   the invoker in browsers that support it.)
*
* The outermost unsafe ancestor matters. A safe div may itself sit inside an
* anchor; stopping at that div would still put the layer's buttons inside the
* link. Walking the whole chain ensures the target is outside both.
*/
function resolveLayerPortalTarget(inlineParent) {
	if (!inlineParent) return null;
	let outermostUnsafe = null;
	let node = inlineParent;
	while (node) {
		if (UNSAFE_HOSTS.has(node.tagName.toLowerCase())) outermostUnsafe = node;
		node = node.parentElement;
	}
	return outermostUnsafe?.parentElement ?? null;
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/Layer/useLayer.js
/**
* @file useLayer.tsx
* @input Uses React hooks, Popover API, CSS anchor positioning, typography tokens
* @output Exports the public useLayer hook plus internal trigger helpers.
* @position Core layer utility; used by useHoverCard, useTooltip, etc.
*
* SYNC: When modified, update:
* - /packages/core/src/Layer/useLayer.doc.mjs
* - /packages/core/src/Layer/useLayer.test.tsx
* - /packages/core/src/Layer/index.ts
*/
var _temp$5 = {
	keoZOQ: "x1vhfslr",
	k1K539: "xlm3tn6",
	"$$css": true
};
var styles$34 = {
	base: {
		keoZOQ: "xdj266r",
		k1K539: "xat24cr",
		keTefX: "x1lziwak",
		k71WvV: "x14z9mp",
		kLKAdn: "xexx8yu",
		kGO01o: "x18d9i69",
		kZCmMZ: "x1c1uobl",
		kwRFfy: "xyri2b",
		kMzoRj: "xc342km",
		ksu8eU: "xng3xce",
		kVQacm: "x1rea2x4",
		kMv6JI: "x9ynric",
		kGuDYH: "xjm74w1",
		kLWn49: "xw6l6zx",
		kWkggS: "xjbqb8w",
		$$css: true
	},
	fixed: {
		kVAEAm: "xixxii4",
		$$css: true
	},
	offsetBlock: (offset) => [_temp$5, {
		"--x-marginBlockStart": ((val) => typeof val === "number" ? val + "px" : val != null ? val : void 0)(offset),
		"--x-marginBlockEnd": ((val) => typeof val === "number" ? val + "px" : val != null ? val : void 0)(offset)
	}],
	offsetInline: (offset) => [{
		keTefX: offset != null ? "x4lel18" : offset,
		k71WvV: offset != null ? "x1c9tiao" : offset,
		$$css: true
	}, {
		"--x-marginInlineStart": ((val) => typeof val === "number" ? val + "px" : val != null ? val : void 0)(offset),
		"--x-marginInlineEnd": ((val) => typeof val === "number" ? val + "px" : val != null ? val : void 0)(offset)
	}]
};
/**
* Props for a control that sits on the trigger but must not dismiss the layer.
*/
/**
* Position placement relative to anchor.
* Logical: start/end resolve against the popover's own inherited direction
* via CSS (RTL contexts mirror automatically, no JS involved).
*/
/**
* Alignment along the placement axis
*/
/**
* Render props for context mode (anchor positioning)
*/
/**
* Render props for fixed mode (manual coordinates)
*/
/**
* Base options shared by both modes
*/
/**
* Options for context mode (CSS anchor positioning)
*/
/**
* Options for fixed mode (manual positioning)
*/
/**
* Return type for context mode
*/
/**
* Return type for fixed mode
*/
function toCssLength(value) {
	return typeof value === "number" ? `${value}px` : value;
}
function readPortalWritingContext(element, portalTarget) {
	const view = element.ownerDocument.defaultView;
	if (!view) return {};
	const sourceStyle = view.getComputedStyle(element);
	const targetStyle = view.getComputedStyle(portalTarget);
	return {
		...sourceStyle.direction !== targetStyle.direction && { direction: sourceStyle.direction },
		...sourceStyle.writingMode !== targetStyle.writingMode && { writingMode: sourceStyle.writingMode }
	};
}
/**
* Map logical placement/alignment to a CSS position-area value.
*
* Uses the self-* logical keyword family: the inline axis resolves against
* the popover's own direction (inherited inline or preserved when portaled),
* so it mirrors in RTL without placement-specific JS. The block axis is
* direction-neutral but must come from the same keyword family — mixing
* physical `top` with `self-inline-*` produces an invalid position-area
* (computes to `none`, which pins the popover to the viewport corner because
* styles.base zeroes the UA margins).
*
* Note the plain logical family (`inline-start`, no `self-`) is NOT a
* substitute: it resolves against the containing block — the page root for
* a top-layer popover — so it ignores `direction` set on a subtree, which
* is exactly #3389's repro.
*/
function getPositionArea(placement = "above", alignment = "center") {
	if (placement === "above" || placement === "below") {
		const block = placement === "above" ? "self-block-start" : "self-block-end";
		if (alignment === "start") return `${block} span-self-inline-end`;
		if (alignment === "end") return `${block} span-self-inline-start`;
		return block;
	}
	const inline = placement === "start" ? "self-inline-start" : "self-inline-end";
	if (alignment === "start") return `${inline} span-self-block-end`;
	if (alignment === "end") return `${inline} span-self-block-start`;
	return inline;
}
/**
* Compute the `position-try-fallbacks` list for a placement/alignment pair.
*
* Flips alone cannot rescue a centered layer — flipping along the alignment
* axis maps center → center, so overflow on that axis renders clipped
* (#3671). Centered alignments therefore append span-based fallbacks letting
* the browser slide the layer along the alignment axis as a last resort
* (same-side spans first). Flips already resolve non-centered alignments.
*/
function getPositionTryFallbacks(placement = "above", alignment = "center") {
	const flips = "flip-block, flip-inline, flip-block flip-inline";
	if (alignment !== "center") return flips;
	if (placement === "above" || placement === "below") {
		const [same, opposite] = placement === "above" ? ["top", "bottom"] : ["bottom", "top"];
		return `${flips}, ${same} span-left, ${same} span-right, ${opposite} span-left, ${opposite} span-right`;
	}
	const [same, opposite] = placement === "start" ? ["left", "right"] : ["right", "left"];
	return `${flips}, ${same} span-top, ${same} span-bottom, ${opposite} span-top, ${opposite} span-bottom`;
}
/**
* Core layer hook that handles popover behavior and positioning.
*
* Supports two positioning modes with type-safe render props:
* - `context`: CSS anchor positioning relative to a trigger element
* - `fixed`: Fixed positioning at specified coordinates
*
* @example
* ```
* const layer = useLayer({ mode: 'context' });
* <button ref={layer.ref}>Trigger</button>
* {layer.render(<Content />, { placement: 'above', alignment: 'center' })}
* ```
*/
function useLayerImplementation(options) {
	const { mode, onShow, onHide, lightDismiss = false } = options;
	const lazyMount = mode === "context" ? options.lazyMount ?? false : false;
	const id = (0, import_react.useId)();
	const anchorId = `--astryx-layer-${id.replace(/:/g, "")}`;
	const [isOpen, setIsOpen] = (0, import_react.useState)(false);
	const popoverRef = (0, import_react.useRef)(null);
	const openedPopoverRef = (0, import_react.useRef)(null);
	const triggerRef = (0, import_react.useRef)(null);
	const sentinelRef = (0, import_react.useRef)(null);
	const contextMountRef = (0, import_react.useRef)(null);
	const [contextMount, setContextMount] = (0, import_react.useState)(null);
	const pendingShowRef = (0, import_react.useRef)(false);
	const isOpenRef = (0, import_react.useRef)(false);
	const dismissedByGestureRef = (0, import_react.useRef)(null);
	const forgetDismissalRef = (0, import_react.useRef)(null);
	const wasJustDismissed = (0, import_react.useCallback)(() => {
		const gesture = currentGesture();
		return dismissedByGestureRef.current === gesture;
	}, []);
	const showPopoverElement = (0, import_react.useCallback)((popover) => {
		if (typeof popover.showPopover === "function") popover.showPopover({ source: triggerRef.current ?? void 0 });
		else popover.style.display = "block";
		openedPopoverRef.current = popover;
	}, []);
	const isCurrentContextPopover = (0, import_react.useCallback)((popover) => {
		if (mode !== "context") return true;
		const mount = contextMountRef.current;
		if (mount === null) return false;
		const expectedParent = mount.portalTarget ?? sentinelRef.current?.parentElement ?? null;
		return popover.parentElement === expectedParent;
	}, [mode]);
	const requestContextMount = (0, import_react.useCallback)(() => {
		if (mode !== "context") return;
		const sentinel = sentinelRef.current;
		const inlineParent = sentinel?.parentElement ?? null;
		if (!sentinel || !inlineParent) return;
		const portalTarget = resolveLayerPortalTarget(inlineParent);
		const mount = {
			portalTarget,
			portalStyle: portalTarget ? readPortalWritingContext(sentinel, portalTarget) : {}
		};
		contextMountRef.current = mount;
		setContextMount(mount);
	}, [mode]);
	const clearContextMount = (0, import_react.useCallback)(() => {
		if (mode !== "context" || !lazyMount) return;
		contextMountRef.current = null;
		setContextMount(null);
	}, [mode, lazyMount]);
	const show = (0, import_react.useCallback)(() => {
		if (wasJustDismissed()) return;
		const candidate = popoverRef.current;
		const popover = candidate && isCurrentContextPopover(candidate) ? candidate : null;
		if (!popover) {
			pendingShowRef.current = true;
			requestContextMount();
			return;
		}
		if (!isOpenRef.current) {
			showPopoverElement(popover);
			isOpenRef.current = true;
			setIsOpen(true);
			onShow?.();
		}
	}, [
		onShow,
		requestContextMount,
		showPopoverElement,
		isCurrentContextPopover,
		wasJustDismissed
	]);
	const hide = (0, import_react.useCallback)(() => {
		pendingShowRef.current = false;
		if (isOpenRef.current) {
			const el = popoverRef.current;
			openedPopoverRef.current = null;
			isOpenRef.current = false;
			if (el) {
				if (typeof el.hidePopover === "function") el.hidePopover();
				else el.style.display = "none";
			}
			setIsOpen(false);
			onHide?.();
		}
		clearContextMount();
	}, [onHide, clearContextMount]);
	const contextRef = (0, import_react.useCallback)((el) => {
		if (triggerRef.current && triggerRef.current !== el) removeAnchorName(triggerRef.current, anchorId);
		if (el) addAnchorName(el, anchorId);
		triggerRef.current = el;
	}, [anchorId]);
	const rememberDismissal = (0, import_react.useCallback)((doc) => {
		forgetDismissalRef.current?.();
		if (currentGestureHasClicked()) return;
		dismissedByGestureRef.current = currentGesture();
		const view = doc.defaultView;
		let forgetTimer = null;
		const forget = () => {
			dismissedByGestureRef.current = null;
			doc.removeEventListener("click", scheduleForget, true);
			if (forgetTimer !== null) {
				view?.clearTimeout(forgetTimer);
				forgetTimer = null;
			}
			if (forgetDismissalRef.current === forget) forgetDismissalRef.current = null;
		};
		const scheduleForget = () => {
			doc.removeEventListener("click", scheduleForget, true);
			if (view) forgetTimer = view.setTimeout(() => {
				forgetTimer = null;
				if (forgetDismissalRef.current === forget) forget();
			}, 0);
			else forget();
		};
		doc.addEventListener("click", scheduleForget, true);
		forgetDismissalRef.current = forget;
	}, []);
	(0, import_react.useEffect)(() => {
		currentGesture();
		return () => forgetDismissalRef.current?.();
	}, []);
	const handleToggle = (0, import_react.useCallback)((e) => {
		if (e.newState === "closed" && isOpenRef.current) {
			openedPopoverRef.current = null;
			isOpenRef.current = false;
			rememberDismissal(e.currentTarget?.ownerDocument ?? document);
			setIsOpen(false);
			onHide?.();
			clearContextMount();
		}
	}, [
		onHide,
		clearContextMount,
		rememberDismissal
	]);
	const listenedElRef = (0, import_react.useRef)(null);
	const listenedHandlerRef = (0, import_react.useRef)(null);
	const bindToggleListener = (0, import_react.useCallback)((el, handler) => {
		if (listenedElRef.current && listenedHandlerRef.current && (listenedElRef.current !== el || listenedHandlerRef.current !== handler)) {
			listenedElRef.current.removeEventListener("toggle", listenedHandlerRef.current);
			listenedElRef.current = null;
			listenedHandlerRef.current = null;
		}
		if (el && listenedElRef.current !== el) {
			el.addEventListener("toggle", handler);
			listenedElRef.current = el;
			listenedHandlerRef.current = handler;
		}
	}, []);
	const popoverRefCallback = (0, import_react.useCallback)((el) => {
		popoverRef.current = el;
		bindToggleListener(el, handleToggle);
		if (el && pendingShowRef.current) {
			pendingShowRef.current = false;
			show();
		} else if (el && isOpenRef.current && openedPopoverRef.current !== el && isCurrentContextPopover(el)) showPopoverElement(el);
	}, [
		handleToggle,
		bindToggleListener,
		show,
		showPopoverElement,
		isCurrentContextPopover
	]);
	const sentinelRefCallback = (0, import_react.useCallback)((el) => {
		sentinelRef.current = el;
		if (el && (!lazyMount || pendingShowRef.current || isOpenRef.current)) requestContextMount();
	}, [lazyMount, requestContextMount]);
	(0, import_react.useEffect)(() => {
		if (popoverRef.current) bindToggleListener(popoverRef.current, handleToggle);
		return () => {
			if (listenedElRef.current && listenedHandlerRef.current) {
				listenedElRef.current.removeEventListener("toggle", listenedHandlerRef.current);
				listenedElRef.current = null;
				listenedHandlerRef.current = null;
			}
		};
	}, [handleToggle, bindToggleListener]);
	const renderContext = (0, import_react.useCallback)((children, props$26) => {
		const sentinel = /*#__PURE__*/ (0, import_jsx_runtime.jsx)("template", { ref: sentinelRefCallback });
		if (contextMount === null) return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: sentinel });
		const { placement = "above", alignment = "center", positioning = "anchor", offset, role, "aria-label": ariaLabel, xstyle, className: extraClassName, style: extraStyle, as: Container = "div", onMouseEnter, onMouseLeave } = props$26 || {};
		const anchorStyle = positioning === "custom" ? { positionAnchor: anchorId } : {
			positionAnchor: anchorId,
			positionArea: getPositionArea(placement, alignment),
			positionTryFallbacks: getPositionTryFallbacks(placement, alignment)
		};
		const offsetStyle = positioning === "anchor" && offset ? placement === "above" || placement === "below" ? styles$34.offsetBlock(toCssLength(offset)) : styles$34.offsetInline(toCssLength(offset)) : null;
		const stylexResult = props(styles$34.base, overlayPaddingReset.reset, offsetStyle, xstyle);
		const combinedClassName = extraClassName ? `${extraClassName} ${stylexResult.className ?? ""}` : stylexResult.className;
		const layer = /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Container, {
			ref: popoverRefCallback,
			id,
			role,
			"aria-label": ariaLabel,
			popover: lightDismiss ? "auto" : "manual",
			className: combinedClassName,
			style: {
				...stylexResult.style,
				...anchorStyle,
				...contextMount.portalStyle,
				...extraStyle
			},
			onMouseEnter,
			onMouseLeave,
			children
		});
		return /*#__PURE__*/ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [sentinel, contextMount.portalTarget ? /*#__PURE__*/ (0, import_react_dom.createPortal)(layer, contextMount.portalTarget) : layer] });
	}, [
		anchorId,
		contextMount,
		id,
		lightDismiss,
		popoverRefCallback,
		sentinelRefCallback
	]);
	const renderFixed = (0, import_react.useCallback)((children, props$27) => {
		const { x, y, xstyle, className: extraClassName, style: extraStyle } = props$27;
		const positionStyle = {
			top: y,
			left: x
		};
		const stylexResult = props(styles$34.base, overlayPaddingReset.reset, styles$34.fixed, xstyle);
		const combinedClassName = extraClassName ? `${extraClassName} ${stylexResult.className ?? ""}` : stylexResult.className;
		return /*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
			ref: popoverRefCallback,
			id,
			popover: lightDismiss ? "auto" : "manual",
			className: combinedClassName,
			style: {
				...stylexResult.style,
				...positionStyle,
				...extraStyle
			},
			children
		});
	}, [
		popoverRefCallback,
		id,
		lightDismiss
	]);
	const contextResult = (0, import_react.useMemo)(() => ({
		ref: contextRef,
		anchorId,
		show,
		hide,
		isOpen,
		wasJustDismissed,
		id,
		render: renderContext
	}), [
		contextRef,
		anchorId,
		show,
		hide,
		isOpen,
		wasJustDismissed,
		id,
		renderContext
	]);
	const fixedResult = (0, import_react.useMemo)(() => ({
		ref: void 0,
		show,
		hide,
		isOpen,
		wasJustDismissed,
		id,
		render: renderFixed
	}), [
		show,
		hide,
		isOpen,
		wasJustDismissed,
		id,
		renderFixed
	]);
	return mode === "context" ? contextResult : fixedResult;
}
function useLayer(options) {
	const internalLayer = useLayerImplementation(options);
	return (0, import_react.useMemo)(() => {
		const { wasJustDismissed: _, ...layer } = internalLayer;
		return layer;
	}, [internalLayer]);
}
/** @internal Shared with usePopover; not exported from the package barrel. */
function useLayerInternal(options) {
	return useLayerImplementation(options);
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/utils/interactionModality.js
/**
* @file interactionModality.ts
* @input Global pointerdown/keydown events
* @output `getInteractionModality()` — how the user last interacted
* @position Internal utility; used where `:focus-visible` alone is too broad
*
* `:focus-visible` is the right selector for a focus ring and should stay the
* condition that draws one. It is not, on its own, "focused by keyboard":
* per CSS Selectors 4 a pointer-focused element that supports text entry
* matches it too, deliberately, so that a clicked text field still shows where
* typing will go. Measured in Chromium — a bare `<input>` clicked with a mouse
* matches `:focus-visible`.
*
* A component that wants a ring for keyboard focus ONLY therefore needs one bit
* `:focus-visible` cannot give it: which device moved focus. This records that,
* to be used as a gate ALONGSIDE `:focus-visible`, never as a replacement for
* it — the browser's heuristic still decides everything else, including
* `focus({focusVisible: true})`.
*
* Listeners are registered once for the document, in the capture phase so they
* run before the focus they explain, and are never removed: two passive
* listeners for the whole app, versus a pair per mounted input.
*/
var modality = "keyboard";
var isListening$1 = false;
function onPointerDown() {
	modality = "pointer";
}
function onKeyDown(event) {
	if (event.metaKey || event.altKey || event.ctrlKey) return;
	modality = "keyboard";
}
/**
* Start tracking, once per document. Safe to call repeatedly and on the server
* (where it does nothing).
*/
function trackInteractionModality() {
	if (isListening$1 || typeof document === "undefined") return;
	isListening$1 = true;
	document.addEventListener("pointerdown", onPointerDown, {
		capture: true,
		passive: true
	});
	document.addEventListener("keydown", onKeyDown, {
		capture: true,
		passive: true
	});
}
/** How the user last interacted with the page. */
function getInteractionModality() {
	return modality;
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/Layer/useTouchTrigger.js
/**
* @file useTouchTrigger.ts
* @input Touch trigger mode, layer open state, trigger ref, show/hide callbacks
* @output Exports useTouchTrigger hook, isActionTrigger, LayerTouchTrigger type
* @position Layer hook; shared touch behavior for useTooltip and useHoverCard
*
* SYNC: When modified, update:
* - /packages/core/src/Layer/index.ts
*
* Hover is the one trigger a touch screen cannot express. A tap synthesizes
* `mouseenter`, so an untreated hover layer either opens on every tap and
* lingers with nothing to close it, or swallows the tap the user aimed at the
* control underneath.
*
* What the trigger DOES decides which of those the tap deserves. A trigger
* that performs an action — a button, a link, a form control — keeps its tap:
* the layer stays shut, because the tap already has somewhere to go and a hint
* about a control the user just operated is noise. A trigger that performs no
* action — an info icon, an abbreviation, a truncated label — has nothing to
* lose, so the tap opens the layer and the next tap outside dismisses it. That
* is `auto`; `tap` and `none` state the choice outright, which is what an
* icon-button whose only job is to reveal the layer needs.
*/
/**
* How a hover layer behaves on a touch pointer.
*
* - `auto`: tap-to-open, unless the trigger performs an action of its own
* - `tap`: always tap-to-open, even on a trigger that performs an action
* - `none`: never open on touch
*/
/**
* Pointer types whose *press* is a tap rather than a click.
*
* A pen belongs here but not in the arrival path: in detection range it hovers
* — firing `pointerenter`/`pointermove` with no contact, exactly as a mouse
* does, on a device where `(hover: hover)` matches — and only becomes a tap
* once it lands. See `handlePointerEnter`.
*/
var TOUCH_POINTER_TYPES = /* @__PURE__ */ new Set(["touch", "pen"]);
/**
* ARIA roles that make an element do something when activated. An explicit
* role wins over the tag: `<button role="presentation">` is scenery, and a
* `<span role="button">` is a real control.
*/
var ACTION_ROLES = /* @__PURE__ */ new Set([
	"button",
	"checkbox",
	"combobox",
	"link",
	"menuitem",
	"menuitemcheckbox",
	"menuitemradio",
	"option",
	"radio",
	"searchbox",
	"slider",
	"spinbutton",
	"switch",
	"tab",
	"textbox"
]);
/**
* Whether activating this element does something other than reveal the layer.
*
* Deliberately narrower than "focusable": the wrapper a text-only Tooltip
* renders carries `tabindex=0` so keyboard users can reach the hint, and it
* still performs no action.
*
* True only decides that the layer stays shut — the tap itself is never
* swallowed. Nothing here calls `preventDefault` or `stopPropagation`, so an
* inert trigger that happens to carry its own `onClick` (a `<div onClick>`
* with no role) gets both: the layer opens and the handler runs.
*/
function isActionTrigger(element) {
	const role = element.getAttribute("role");
	if (role != null && role !== "") return ACTION_ROLES.has(role);
	switch (element.tagName) {
		case "BUTTON":
		case "INPUT":
		case "LABEL":
		case "SELECT":
		case "SUMMARY":
		case "TEXTAREA": return true;
		case "A":
		case "AREA": return element.hasAttribute("href");
		default: return isEditable(element);
	}
}
/**
* Whether typing into this element edits it. Reads the attribute as well as
* the property: jsdom does not implement `isContentEditable`, and an editor
* that is an action in the browser must not be inert under test.
*/
function isEditable(element) {
	if (element.isContentEditable === true) return true;
	const attribute = element.getAttribute("contenteditable");
	return attribute != null && attribute !== "false";
}
/**
* Touch behavior shared by the hover layers.
*
* @example
* ```
* const touch = useTouchTrigger({
*   touchTrigger,
*   isEnabled,
*   isControlled: isOpen !== undefined,
*   isOpen: layer.isOpen,
*   layerId: layer.id,
*   triggerRef,
*   show: showNow,
*   hide: hideNow,
* });
* ```
*/
function useTouchTrigger(options) {
	const { touchTrigger, isEnabled, isControlled, isOpen, layerId, triggerRef, show, hide } = options;
	const isTouchPointerRef = (0, import_react.useRef)(false);
	const isOpenRef = (0, import_react.useRef)(isOpen);
	isOpenRef.current = isOpen;
	const hideRef = (0, import_react.useRef)(hide);
	hideRef.current = hide;
	const layerIdRef = (0, import_react.useRef)(layerId);
	layerIdRef.current = layerId;
	const isTapOpenRef = (0, import_react.useRef)(false);
	const outsideListenerRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		trackInteractionModality();
	}, []);
	const disarmOutsideDismiss = (0, import_react.useCallback)(() => {
		isTapOpenRef.current = false;
		const listener = outsideListenerRef.current;
		if (listener == null) return;
		outsideListenerRef.current = null;
		document.removeEventListener("pointerdown", listener, true);
	}, []);
	const armOutsideDismiss = (0, import_react.useCallback)(() => {
		isTapOpenRef.current = true;
		if (outsideListenerRef.current != null) return;
		const handleOutsidePointerDown = (event) => {
			const target = event.target;
			if (target != null) {
				if (triggerRef.current?.contains(target) === true) return;
				if (document.getElementById(layerIdRef.current)?.contains(target) === true) return;
			}
			disarmOutsideDismiss();
			hideRef.current();
		};
		outsideListenerRef.current = handleOutsidePointerDown;
		document.addEventListener("pointerdown", handleOutsidePointerDown, true);
	}, [triggerRef, disarmOutsideDismiss]);
	(0, import_react.useEffect)(() => disarmOutsideDismiss, [disarmOutsideDismiss]);
	const isTouchInteraction = (0, import_react.useCallback)(() => isTouchPointerRef.current && getInteractionModality() === "pointer", []);
	const handlePointerEnter = (0, import_react.useCallback)((event) => {
		isTouchPointerRef.current = event.pointerType === "touch";
	}, []);
	const handlePointerDown = (0, import_react.useCallback)((event) => {
		const isTouch = TOUCH_POINTER_TYPES.has(event.pointerType);
		isTouchPointerRef.current = isTouch;
		if (!isTouch || isControlled) return false;
		const trigger = triggerRef.current;
		if ((touchTrigger === "auto" ? trigger != null && isActionTrigger(trigger) ? "none" : "tap" : touchTrigger) === "none" || !isEnabled) {
			disarmOutsideDismiss();
			hide();
			return true;
		}
		if (isOpenRef.current || isTapOpenRef.current) {
			disarmOutsideDismiss();
			hide();
			return true;
		}
		armOutsideDismiss();
		show();
		return true;
	}, [
		touchTrigger,
		isEnabled,
		isControlled,
		triggerRef,
		show,
		hide,
		armOutsideDismiss,
		disarmOutsideDismiss
	]);
	const wasOpenRef = (0, import_react.useRef)(isOpen);
	(0, import_react.useEffect)(() => {
		if (wasOpenRef.current && !isOpen) disarmOutsideDismiss();
		wasOpenRef.current = isOpen;
	}, [isOpen, disarmOutsideDismiss]);
	return {
		isTouchPointerRef,
		isTouchInteraction,
		handlePointerEnter,
		handlePointerDown,
		clearTapOpen: disarmOutsideDismiss
	};
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/Layer/layerAnimations.stylex.js
durationVars["--duration-fast-max"], easeVars["--ease-standard"];
/**
* Shared entry animation styles for layer-based components.
*
* Keyed by LayerPlacement ('above' | 'below' | 'start' | 'end')
* for easy lookup: `layerAnimations[placement]`.
*
* Each entry disables its keyframe animation under
* `prefers-reduced-motion: reduce` so the layer appears instantly instead of
* translating/scaling in (infra-6).
*/
var layerAnimations = {
	below: {
		kKVMdj: "xl1vlw0 x1aquc0h",
		k44tkh: "x9uej1z",
		kyAemX: "x128ha8g",
		kWV6AL: "xskzprw",
		$$css: true
	},
	above: {
		kKVMdj: "x3psbcj x1aquc0h",
		k44tkh: "x9uej1z",
		kyAemX: "x128ha8g",
		kWV6AL: "xskzprw",
		$$css: true
	},
	end: {
		kKVMdj: "x1i331go x1vxsm5i x1aquc0h",
		k44tkh: "x9uej1z",
		kyAemX: "x128ha8g",
		kWV6AL: "xskzprw",
		$$css: true
	},
	start: {
		kKVMdj: "xck01x9 x18lne9g x1aquc0h",
		k44tkh: "x9uej1z",
		kyAemX: "x128ha8g",
		kWV6AL: "xskzprw",
		$$css: true
	}
};
//#endregion
//#region node_modules/@astryxdesign/core/dist/Layer/LayerDepthContext.js
/**
* @file LayerDepthContext.tsx
* @input React context
* @output Exports LayerDepthContext, useLayerDepth, LayerDepthProvider
* @position Layer system; how the dismissal stack learns which layer is nested
*   inside which.
*
* SYNC: When modified, update:
* - /packages/core/src/Layer/index.ts
* - /packages/core/src/Layer/useLayerDismissal.ts
*
* Nesting is read from the React tree rather than the DOM. Two reasons:
*
* - **Portals.** A nested overlay routinely renders into `document.body` or the
*   native top layer, so DOM containment reports it as a sibling of the layer
*   it is logically inside. React context flows through `createPortal`, so the
*   tree keeps the relationship the DOM loses.
* - **Same-commit mounts.** Depth is fixed during render. Effect order is not
*   available then and is misleading anyway: React runs child effects before
*   parent effects, so an inner layer registers first and looks "older" than
*   the outer layer that contains it.
*
* There is nothing to mount at the app root: the context defaults to 0, and
* each layer provides depth for its OWN content, so nesting composes on its own.
*/
/**
* How many layers deep the current subtree is. 0 at the app root; each layer
* increments it for its own content.
*/
var LayerDepthContext = /*#__PURE__*/ (0, import_react.createContext)(0);
LayerDepthContext.displayName = "LayerDepthContext";
/**
* Read the current nesting depth. A layer calls this to learn its OWN depth —
* the depth of the subtree it is rendered into, before it pushes its content
* one level deeper.
*/
function useLayerDepth() {
	return (0, import_react.use)(LayerDepthContext);
}
/**
* Wrap a layer's content so any layer opened from inside it registers as
* nested. Takes no depth prop on purpose: it reads the ambient depth and adds
* one, so nesting composes without anyone tracking absolute numbers.
*
* Renders no DOM element — it is a context boundary only, which is why it takes
* no `xstyle`/`ref` and exposes no props interface.
*/
function LayerDepthProvider({ children }) {
	const depth = (0, import_react.use)(LayerDepthContext);
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(LayerDepthContext, {
		value: depth + 1,
		children
	});
}
LayerDepthProvider.displayName = "LayerDepthProvider";
//#endregion
//#region node_modules/@astryxdesign/core/dist/Layer/layerStack.js
/**
* @file layerStack.ts
* @input Uses the isImeKeyEvent predicate from utils/ime
* @output Exports the shared layer dismissal stack: registration, top-most
*   ordering, and the single document-level Escape listener
* @position Internal to the Layer system; consumed by useLayerDismissal, which
*   is what overlays actually call. Not exported from the package root.
*
* SYNC: When modified, update:
* - /packages/core/src/Layer/useLayerDismissal.ts
* - /packages/core/src/Layer/useLayerDismissal.test.tsx
*
* ## Why one stack
*
* Every overlay used to own its own Escape listener, so one press dismissed
* every open layer (a popover inside a Dialog closed both; a Modal opened from
* inside another Modal closed both). Patching this per primitive produced
* parallel registries — the focus-trap Escape stack, Drawer's LIFO registry,
* useScrollLock's counter. This module is the single registry those collapse
* into. One press dismisses exactly one layer.
*
* ## Only the top layer acts
*
* The stack owns ONE `keydown` listener on `document` and routes the press to
* the top-most layer itself. Overlays do not listen; they register and say what
* they want done. The alternative — every layer listens and filters itself out
* — is what forces `stopPropagation()` choreography between element-level and
* document-level listeners, and it silently breaks whenever a layer forgets.
*
* ## Bubble phase, not capture
*
* The listener is on the BUBBLE phase so content inside a layer can claim the
* press first, either by `stopPropagation()` (the press never reaches us) or by
* `preventDefault()` (we see it and stand down). Editors are the motivating
* case: Monaco and the rich-text editor use Escape to close their own find
* widget or autocomplete, and that must win over dismissing the Dialog they sit
* in. A capture-phase listener would take the press away from them.
*
* ## The stack, not the browser, decides
*
* When the stack handles a press it calls `preventDefault()`, which suppresses
* the browser's own close-watcher behavior — both `<dialog>`'s `cancel` event
* and `popover="auto"` light-dismiss (verified in Chromium; the default action
* runs after propagation, so a bubble-phase `preventDefault` still beats it).
* That is deliberate: the native top layer only covers `showModal()` and
* `popover="auto"`, so relying on it would leave non-modal `show()` drawers,
* `popover="manual"` layers, and older browsers on a second, differently-behaved
* code path. One code path, one ordering, everywhere.
*
* ## An Escape that cancels an IME composition
*
* That press is not a dismissal, so no layer acts on it — but the stack still
* claims it, because an unclaimed Escape is exactly what makes the browser
* raise a close request, and that request dismisses the layer through its
* `cancel` handler on the same keypress. Claiming is the whole fix; the guard
* that only returns measures identically to no guard at all.
*
* Close requests that arrive with no keydown to read — the Android back
* gesture, the platform close watcher — are answered by the hosts, which ask
* `isTextComposing()` through `useLayerDismissal`.
*/
/**
* What a layer does with an Escape press that reaches it.
*
* - `'close'` — dismiss this layer and consume the press. One Escape closes
*   exactly this layer. The default, and correct for every dismissible layer:
*   modals, popovers, menus, comboboxes, and hover layers alike.
* - `'block'` — consume the press WITHOUT dismissing. For a layer that requires
*   an explicit choice (`Dialog purpose="required"`): Escape must not dismiss
*   it, and must not fall through and dismiss something behind it either.
*
* There is deliberately no "dismiss but let the press continue" variant. Escape
* affects exactly one layer, always — a rule with no per-component exceptions
* is one users can predict. Hover layers were the tempting exception (the user
* never opened the tip, so why should it eat their press?), but guessing wrong
* that way is destructive: someone dismissing a stray tooltip over a form would
* lose the whole dialog. Guessing wrong the other way costs one keystroke.
*/
var entries = [];
var seqByToken = /* @__PURE__ */ new WeakMap();
var nextSeq = 0;
var isListening = false;
function seqFor(token) {
	const existing = seqByToken.get(token);
	if (existing !== void 0) return existing;
	const seq = nextSeq++;
	seqByToken.set(token, seq);
	return seq;
}
/**
* Order two entries: positive when `a` is above `b`, negative when below.
* Three keys, each earning its place:
*
* 1. **Depth.** The layer nested inside the other is on top. This is what makes
*    an inner-and-outer pair that mount in the SAME commit come out right;
*    registration order alone gets it backwards, because React runs child
*    effects before parent effects.
* 2. **DOM containment.** Depth only moves when a layer wraps its content in a
*    `LayerDepthProvider`, which a bare `useFocusTrap` cannot do — it renders
*    nothing. For those, containment recovers the nesting the tree did not
*    report.
* 3. **Registration order.** For unrelated layers, the one that registered
*    later is on top, matching how the browser's own top layer stacks. A layer
*    keeps its first place for as long as its identity lives, so one that
*    closes and reopens does not move to the top — see the known edge in the
*    pull request.
*
* Modality is deliberately NOT a key. Ranking modals above everything sounds
* right and is not: a hover tip shown inside a modal renders on top of it, so
* a modal-first rule would hand the press to the dialog and strand the tip.
* Nesting already covers the case modality was meant to catch — a layer opened
* from inside another is deeper, modal or not.
*
* Note this is a PARTIAL order: containment relates only nested pairs. Callers
* must resolve the top with a pairwise max scan, never `Array.sort`, whose
* result is undefined for a non-transitive comparator.
*/
function compareEntries(a, b) {
	if (a.depth !== b.depth) return a.depth - b.depth;
	const aEl = a.getContainer?.() ?? null;
	const bEl = b.getContainer?.() ?? null;
	if (aEl != null && bEl != null && aEl !== bEl) {
		if (bEl.contains(aEl)) return 1;
		if (aEl.contains(bEl)) return -1;
	}
	return a.seq - b.seq;
}
function isPresentEntry(entry) {
	return entry.isPresent?.() ?? true;
}
var isComposing = false;
/**
* Whether the user is part-way through composing text with an IME.
*
* The stack reads this to decide what an Escape means, and layers read it
* through `useLayerDismissal`'s `shouldDismissOnCloseRequest` for the close
* requests that arrive without a keydown to inspect — the Android back
* gesture, the platform close watcher, or a composing Escape whose keydown
* never reached this listener because content stopped it. Mid-composition,
* those are far more likely to be the user backing out of a half-formed
* character than a request to dismiss a layer, and guessing wrong that way
* costs them everything they have typed into it.
*
* Scope, deliberately page-wide: a composition in a field behind a non-modal
* layer also suppresses that layer's close requests. It is one keypress to
* recover from, and the alternative — matching the composing element against
* a layer's container — cannot work for the layers that do not have one.
*
* A composition already running when the first layer registers is invisible
* here: the listeners go on with the stack's own.
*/
function isTextComposing() {
	return isComposing;
}
function handleCompositionStart() {
	isComposing = true;
}
function handleCompositionEnd() {
	isComposing = false;
}
/** The top-most present layer, or null when nothing is on screen. */
function topPresentEntry() {
	let top = null;
	for (const entry of entries) {
		if (!isPresentEntry(entry)) continue;
		if (top == null || compareEntries(entry, top) > 0) top = entry;
	}
	return top;
}
/**
* Whether `token` identifies the top-most layer. Overlays that still own a
* dismissal channel the stack does not model yet (outside-press, swipe) can
* gate on this so every channel agrees on who is on top.
*/
function isTopmostLayer(token) {
	return topPresentEntry()?.token === token;
}
/** Resolve an Escape press against the stack. Returns whether it was handled. */
function dispatchEscape() {
	const top = topPresentEntry();
	if (top == null) return false;
	if (top.behavior === "block") return true;
	top.dismiss();
	return true;
}
function handleKeyDown(event) {
	if (event.key !== "Escape") return;
	if (isImeKeyEvent(event)) {
		if (topPresentEntry() != null) event.preventDefault();
		return;
	}
	if (event.defaultPrevented) return;
	if (dispatchEscape()) event.preventDefault();
}
function startListening() {
	if (isListening || typeof document === "undefined") return;
	document.addEventListener("keydown", handleKeyDown);
	document.addEventListener("compositionstart", handleCompositionStart, true);
	document.addEventListener("compositionend", handleCompositionEnd, true);
	document.addEventListener("blur", handleCompositionEnd, true);
	isListening = true;
}
function stopListening() {
	if (!isListening || typeof document === "undefined") return;
	document.removeEventListener("keydown", handleKeyDown);
	document.removeEventListener("compositionstart", handleCompositionStart, true);
	document.removeEventListener("compositionend", handleCompositionEnd, true);
	document.removeEventListener("blur", handleCompositionEnd, true);
	isComposing = false;
	isListening = false;
}
/**
* Add a layer to the stack for as long as it is active. Returns the unregister
* function; callers own calling it.
*/
function registerLayer(entry) {
	const full = {
		...entry,
		seq: seqFor(entry.token)
	};
	entries.push(full);
	startListening();
	return () => {
		const index = entries.indexOf(full);
		if (index !== -1) entries.splice(index, 1);
		if (entries.length === 0) stopListening();
	};
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/Layer/useLayerDismissal.js
/**
* @file useLayerDismissal.ts
* @input Uses React hooks, the layer stack, and LayerDepthContext
* @output Exports useLayerDismissal + its option/return types
* @position The API overlays use to join the shared dismissal stack. Wraps
*   layerStack (registration + the single Escape listener) and reads nesting
*   depth from LayerDepthContext.
*
* SYNC: When modified, update:
* - /packages/core/src/Layer/index.ts
* - /packages/core/src/Layer/useLayerDismissal.test.tsx
* - /packages/core/src/Layer/layerStack.ts
*/
/**
* Join the shared layer dismissal stack for as long as this layer is active.
*
* The layer does NOT attach a key listener — the stack owns one listener and
* routes each Escape press to the top-most REGISTERED layer, so one press
* dismisses exactly one of them. Dialog (and what is built on it), Popover and
* the menus built on it, Tooltip, HoverCard, Lightbox and MobileNav register
* today; `BottomSheetSwitcher` registers through its focus trap when modal and
* still handles its own press when not.
*
* `BottomSheet`, `CommandPalette`, `ContextMenu`, `DropdownMenuSubMenu`,
* `PowerSearchEditPopover` and lab's `Drawer` still run their own Escape
* listener. They stay safe next to the stack only because each claims the press
* at element level, and the stack stands down on an already-`defaultPrevented`
* press — but a registered layer opened INSIDE one of them does not get the
* press: the host takes it and closes instead. Migrating them is the fix.
*
* Wrap the layer's own content in `LayerDepthProvider` so anything opened from
* inside it registers as nested.
*
* @example
* ```tsx
* useLayerDismissal({
*   isActive: isOpen,
*   onDismiss: () => onOpenChange(false),
* });
* ```
*/
function useLayerDismissal(options) {
	const { isActive, onDismiss, escapeBehavior = "close", getContainer, isPresent, isEnabled = true } = options;
	const depth = useLayerDepth();
	const tokenRef = (0, import_react.useRef)({});
	const onDismissRef = (0, import_react.useRef)(onDismiss);
	const getContainerRef = (0, import_react.useRef)(getContainer);
	const isPresentRef = (0, import_react.useRef)(isPresent);
	(0, import_react.useEffect)(() => {
		onDismissRef.current = onDismiss;
		getContainerRef.current = getContainer;
		isPresentRef.current = isPresent;
	});
	const isRegistered = isActive && isEnabled;
	(0, import_react.useEffect)(() => {
		if (!isRegistered) return;
		return registerLayer({
			token: tokenRef.current,
			depth,
			behavior: escapeBehavior,
			getContainer: () => getContainerRef.current?.() ?? null,
			isPresent: () => isPresentRef.current?.() ?? true,
			dismiss: () => onDismissRef.current()
		});
	}, [
		isRegistered,
		depth,
		escapeBehavior
	]);
	return { shouldDismissOnCloseRequest: (0, import_react.useCallback)(() => isRegistered && !isTextComposing() && isTopmostLayer(tokenRef.current), [isRegistered]) };
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/Tooltip/useTooltip.js
/**
* @file useTooltip.tsx
* @input Uses useLayer, useTouchTrigger, React hooks
* @output Exports useTooltip hook for hover/focus/tap triggered tooltips
* @position Layer hook; builds on useLayer for tooltip behavior
*
* SYNC: When modified, update:
* - /packages/core/src/Tooltip/index.ts
*/
/**
* Grace period (ms) before hiding on pointer-leave when no explicit `hideDelay`
* is set, so the pointer can travel across the small gap from the trigger onto
* the tooltip surface without the tooltip disappearing (WCAG 1.4.13 hoverable).
*/
var HOVER_BRIDGE_DELAY = 100;
var styles$33 = { container: {
	kWkggS: "x19aspcf",
	kMwMTN: "xrkvqaz",
	kaIpWk: "x1hviunn",
	kMv6JI: "x9ynric",
	kGuDYH: "xjm74w1",
	kLWn49: "xw6l6zx",
	$$css: true
} };
/**
* Focus trigger behavior for tooltips
*/
/**
* Touch trigger behavior for tooltips
*/
/**
* Check if an element is naturally focusable
*/
function isFocusable(element) {
	if (element.hasAttribute("tabindex")) return element.tabIndex >= 0;
	if ([
		"A",
		"BUTTON",
		"INPUT",
		"SELECT",
		"TEXTAREA"
	].includes(element.tagName)) return !element.disabled;
	if (element.isContentEditable) return true;
	return false;
}
/**
* Hook for tooltip behavior with hover/focus triggers.
*
* Builds on useLayer to add:
* - Hover triggers with configurable delay
* - Focus triggers with auto-detection for focusable elements
* - Tap triggers on touch, where there is no hover (see useTouchTrigger)
* - Inverted color palette for high contrast
*
* Unlike HoverCard, tooltips:
* - Don't stay open when hovering the tooltip content
* - Have shorter delays
* - Use inverted colors (dark background, light text)
* - Are typically used for short, non-interactive text
*
* @example
* ```
* const tooltip = useTooltip({ placement: 'above' });
* <Button ref={tooltip.ref} aria-describedby={tooltip.describedBy}>
*   Hover me
* </Button>
* {tooltip.renderTooltip('Helpful tooltip text')}
* ```
*/
function useTooltip(options = {}) {
	const { placement = "above", alignment = "center", delay = 200, hideDelay = 0, focusTrigger = "auto", touchTrigger = "auto", isEnabled = true, isOpen, isDefaultOpen = false, onShow, onHide } = options;
	const layer = useLayer({
		mode: "context",
		onShow,
		onHide
	});
	const popoverXstyle = styles$33.container;
	const showTimeoutRef = (0, import_react.useRef)(null);
	const hideTimeoutRef = (0, import_react.useRef)(null);
	const triggerRef = (0, import_react.useRef)(null);
	const clearTimeouts = (0, import_react.useCallback)(() => {
		if (showTimeoutRef.current) {
			clearTimeout(showTimeoutRef.current);
			showTimeoutRef.current = null;
		}
		if (hideTimeoutRef.current) {
			clearTimeout(hideTimeoutRef.current);
			hideTimeoutRef.current = null;
		}
	}, []);
	const showNow = (0, import_react.useCallback)(() => {
		clearTimeouts();
		layer.show();
	}, [clearTimeouts, layer]);
	const hideNow = (0, import_react.useCallback)(() => {
		clearTimeouts();
		layer.hide();
	}, [clearTimeouts, layer]);
	const touch = useTouchTrigger({
		touchTrigger,
		isEnabled,
		isControlled: isOpen !== void 0,
		isOpen: layer.isOpen,
		layerId: layer.id,
		triggerRef,
		show: showNow,
		hide: hideNow
	});
	const scheduleShow = (0, import_react.useCallback)(() => {
		if (!isEnabled || isOpen === false) return;
		clearTimeouts();
		showTimeoutRef.current = setTimeout(() => {
			layer.show();
		}, delay);
	}, [
		isEnabled,
		isOpen,
		clearTimeouts,
		layer,
		delay
	]);
	const scheduleHide = (0, import_react.useCallback)(() => {
		if (isOpen === true) return;
		clearTimeouts();
		hideTimeoutRef.current = setTimeout(() => {
			layer.hide();
		}, hideDelay > 0 ? hideDelay : HOVER_BRIDGE_DELAY);
	}, [
		isOpen,
		clearTimeouts,
		layer,
		hideDelay
	]);
	const cancelHide = (0, import_react.useCallback)(() => {
		if (hideTimeoutRef.current) {
			clearTimeout(hideTimeoutRef.current);
			hideTimeoutRef.current = null;
		}
	}, []);
	const handleMouseEnter = (0, import_react.useCallback)(() => {
		if (touch.isTouchPointerRef.current) return;
		scheduleShow();
	}, [touch, scheduleShow]);
	const handleMouseLeave = (0, import_react.useCallback)(() => {
		if (touch.isTouchPointerRef.current) return;
		scheduleHide();
	}, [touch, scheduleHide]);
	const handleFocusIn = (0, import_react.useCallback)((e) => {
		if (!isEnabled) return;
		if (touch.isTouchInteraction()) return;
		if (!e.target.matches(":focus-visible")) return;
		clearTimeouts();
		layer.show();
	}, [
		isEnabled,
		touch,
		clearTimeouts,
		layer
	]);
	const handleFocusOut = (0, import_react.useCallback)(() => {
		scheduleHide();
	}, [scheduleHide]);
	const handlePointerDown = (0, import_react.useCallback)((event) => {
		if (touch.handlePointerDown(event)) return;
		if (isOpen !== void 0) return;
		clearTimeouts();
		layer.hide();
	}, [
		touch,
		isOpen,
		clearTimeouts,
		layer
	]);
	const { handlePointerEnter, clearTapOpen } = touch;
	const interactionRef = (0, import_react.useCallback)((el) => {
		if (triggerRef.current) {
			triggerRef.current.removeEventListener("mouseenter", handleMouseEnter);
			triggerRef.current.removeEventListener("mouseleave", handleMouseLeave);
			triggerRef.current.removeEventListener("focusin", handleFocusIn);
			triggerRef.current.removeEventListener("focusout", handleFocusOut);
			triggerRef.current.removeEventListener("pointerenter", handlePointerEnter);
			triggerRef.current.removeEventListener("pointerdown", handlePointerDown);
		}
		if (el) {
			el.addEventListener("pointerenter", handlePointerEnter);
			el.addEventListener("mouseenter", handleMouseEnter);
			el.addEventListener("mouseleave", handleMouseLeave);
			el.addEventListener("pointerdown", handlePointerDown);
			if (focusTrigger === "always" || focusTrigger === "auto" && isFocusable(el)) {
				el.addEventListener("focusin", handleFocusIn);
				el.addEventListener("focusout", handleFocusOut);
			}
		}
		triggerRef.current = el;
	}, [
		focusTrigger,
		handleMouseEnter,
		handleMouseLeave,
		handleFocusIn,
		handleFocusOut,
		handlePointerEnter,
		handlePointerDown
	]);
	const ref = (0, import_react.useCallback)((el) => {
		layer.ref(el);
		interactionRef(el);
	}, [layer, interactionRef]);
	(0, import_react.useEffect)(() => {
		return () => {
			clearTimeouts();
		};
	}, [clearTimeouts]);
	(0, import_react.useEffect)(() => {
		if (isDefaultOpen) layer.show();
	}, []);
	(0, import_react.useEffect)(() => {
		if (isOpen === void 0) return;
		if (isOpen) {
			clearTimeouts();
			layer.show();
		} else {
			clearTimeouts();
			layer.hide();
		}
	}, [
		isOpen,
		clearTimeouts,
		layer
	]);
	useLayerDismissal({
		isActive: true,
		isPresent: () => {
			const el = typeof document === "undefined" ? null : document.getElementById(layer.id);
			if (el == null) return false;
			try {
				return el.matches(":popover-open");
			} catch {
				return layer.isOpen;
			}
		},
		onDismiss: () => {
			clearTimeouts();
			clearTapOpen();
			if (isOpen !== void 0) {
				onHide?.();
				return;
			}
			layer.hide();
		}
	});
	const renderTooltip = (0, import_react.useCallback)((children, props) => {
		const renderPlacement = props?.placement ?? placement;
		const renderProps = {
			placement: renderPlacement,
			alignment: props?.alignment ?? alignment,
			offset: spacingVars["--spacing-1"],
			role: "tooltip",
			xstyle: [popoverXstyle, layerAnimations[renderPlacement]],
			className: themeProps("tooltip").className,
			onMouseEnter: cancelHide,
			onMouseLeave: scheduleHide
		};
		return layer.render(/*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
			className: "xfsso4q xy143xn x12gdq22 x1djylfy xw5ewwj x13faqbe",
			children
		}), renderProps);
	}, [
		layer,
		placement,
		alignment,
		popoverXstyle,
		cancelHide,
		scheduleHide
	]);
	return {
		ref,
		positionRef: layer.ref,
		interactionRef,
		anchorId: layer.anchorId,
		describedBy: layer.id,
		renderTooltip
	};
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/Text/text.stylex.js
var colorStyles$3 = {
	primary: {
		kMwMTN: "x1tgivj0",
		$$css: true
	},
	secondary: {
		kMwMTN: "xv1l7n4",
		$$css: true
	},
	disabled: {
		kMwMTN: "xnbbluu",
		$$css: true
	},
	placeholder: {
		kMwMTN: "xv1l7n4",
		$$css: true
	},
	accent: {
		kMwMTN: "xjse4m1",
		$$css: true
	},
	inherit: {
		kMwMTN: "x1heor9g",
		$$css: true
	}
};
var weightStyles = {
	normal: {
		k63SB2: "x1sodnla",
		$$css: true
	},
	medium: {
		k63SB2: "x1e4wzip",
		$$css: true
	},
	semibold: {
		k63SB2: "x2mo6ok",
		$$css: true
	},
	bold: {
		k63SB2: "x1lvx875",
		$$css: true
	}
};
var defaultWeightByTypeStyles = {
	body: {
		k63SB2: "xxovm9e",
		$$css: true
	},
	large: {
		k63SB2: "x149oux8",
		$$css: true
	},
	label: {
		k63SB2: "xmhvcl5",
		$$css: true
	},
	code: {
		k63SB2: "xx3eeay",
		$$css: true
	},
	supporting: {
		k63SB2: "xv8on6e",
		$$css: true
	},
	"display-1": {
		k63SB2: "x1txul5o",
		$$css: true
	},
	"display-2": {
		k63SB2: "x1y36c3f",
		$$css: true
	},
	"display-3": {
		k63SB2: "x1on40hk",
		$$css: true
	},
	inherit: {
		k63SB2: "x1pd3egz",
		$$css: true
	}
};
var sizeByTypeStyles = {
	body: {
		kGuDYH: "xjm74w1",
		kLWn49: "xw6l6zx",
		$$css: true
	},
	large: {
		kGuDYH: "x18juvz8",
		kLWn49: "xf74fhv",
		$$css: true
	},
	label: {
		kGuDYH: "xcr08ib",
		kLWn49: "x1kq96og",
		$$css: true
	},
	code: {
		kGuDYH: "xp03k98",
		kLWn49: "x17iicif",
		kMv6JI: "x9m5x89",
		$$css: true
	},
	supporting: {
		kGuDYH: "x141an7d",
		kLWn49: "x1ltkj2j",
		$$css: true
	},
	"display-1": {
		kGuDYH: "xsub3ws",
		kLWn49: "x112ttwr",
		$$css: true
	},
	"display-2": {
		kGuDYH: "x1yego12",
		kLWn49: "xh0iwvy",
		$$css: true
	},
	"display-3": {
		kGuDYH: "xlgnzhf",
		kLWn49: "x1ujwuaq",
		$$css: true
	},
	inherit: {
		kGuDYH: "x1qlqyl8",
		kLWn49: "x15bjb6t",
		$$css: true
	}
};
var sizeStyles$5 = {
	"4xs": {
		kGuDYH: "xxc45ev",
		$$css: true
	},
	"3xs": {
		kGuDYH: "x10p7juq",
		$$css: true
	},
	"2xs": {
		kGuDYH: "x16a80zy",
		$$css: true
	},
	xsm: {
		kGuDYH: "x51wmvv",
		$$css: true
	},
	sm: {
		kGuDYH: "x1eqnyfr",
		$$css: true
	},
	base: {
		kGuDYH: "x1j29vfg",
		$$css: true
	},
	lg: {
		kGuDYH: "xc7cgfe",
		$$css: true
	},
	xl: {
		kGuDYH: "x1wqms48",
		$$css: true
	},
	"2xl": {
		kGuDYH: "xhs0kqb",
		$$css: true
	},
	"3xl": {
		kGuDYH: "x10srzze",
		$$css: true
	},
	"4xl": {
		kGuDYH: "xqcvi3d",
		$$css: true
	}
};
var sizeByLevelStyles = {
	"1": {
		kGuDYH: "xcg7oai",
		kLWn49: "xfmsba7",
		k63SB2: "x1v68xuy",
		$$css: true
	},
	"2": {
		kGuDYH: "x1xvnhcw",
		kLWn49: "x1cpk1wn",
		k63SB2: "x12yy4cs",
		$$css: true
	},
	"3": {
		kGuDYH: "xii13ha",
		kLWn49: "xwjzt0u",
		k63SB2: "x1jcxfy8",
		$$css: true
	},
	"4": {
		kGuDYH: "x8tkxat",
		kLWn49: "xqerer",
		k63SB2: "x2hcmsi",
		$$css: true
	},
	"5": {
		kGuDYH: "xsgqta0",
		kLWn49: "xo3gurs",
		k63SB2: "xno150v",
		$$css: true
	},
	"6": {
		kGuDYH: "xw5ohdf",
		kLWn49: "xeixjfn",
		k63SB2: "x1pw4frv",
		$$css: true
	}
};
var displayStyles = {
	inline: {
		k1xSpc: "xt0psk2",
		$$css: true
	},
	block: {
		k1xSpc: "x1lliihq",
		$$css: true
	}
};
var truncationStyles = {
	singleLine: {
		kVQacm: "xb3r6kr",
		kg5iWk: "xlyipyv",
		khDVqt: "xuxw1ft",
		k1xSpc: "x1lliihq",
		$$css: true
	},
	multiLine: {
		kVQacm: "xb3r6kr",
		k1xSpc: "x104kibb",
		kgKLqz: "x1ua5tub",
		$$css: true
	}
};
var wordBreakStyles = {
	"break-word": {
		kTgw9: "x1lldw8n",
		kHjlTd: "x1mzt3pk",
		$$css: true
	},
	"break-all": {
		kTgw9: "x1yn0g08",
		$$css: true
	}
};
var textWrapStyles = {
	wrap: {
		kN2L0X: "xk4td0m",
		$$css: true
	},
	nowrap: {
		kN2L0X: "xebhuq6",
		$$css: true
	},
	balance: {
		kN2L0X: "x1w2vvpw",
		$$css: true
	},
	pretty: {
		kN2L0X: "x1fzhlzt",
		$$css: true
	}
};
var capsizeStyles = { enabled: {
	kxwWH2: "x1b2iylo",
	kzeHkT: "xwgcxoh",
	k1xSpc: "x1lliihq",
	$$css: true
} };
var decorationStyles = { strikethrough: {
	kybGjl: "xmqliwb",
	$$css: true
} };
var tabularNumbersStyle = { enabled: {
	kcqcaj: "xss6m8b",
	$$css: true
} };
var justifyStyles$1 = {
	start: {
		k9WMMc: "x1yc453h",
		$$css: true
	},
	center: {
		k9WMMc: "x2b8uid",
		$$css: true
	},
	end: {
		k9WMMc: "xp4054r",
		$$css: true
	}
};
var truncationTooltipStyles = { content: {
	ks0D6T: "xw5ewwj",
	kTgw9: "x13faqbe",
	$$css: true
} };
//#endregion
//#region node_modules/@astryxdesign/core/dist/Text/useTruncation.js
/**
* @file useTruncation.ts
* @input Uses React hooks, sharedResizeObserver
* @output Exports useTruncation hook for detecting text overflow
* @position Hook; consumed by Text.tsx, Heading.tsx
*
* SYNC: When modified, update:
* - /packages/core/src/Text/Text.doc.mjs
*/
/**
* Hook for detecting text overflow/truncation.
*
* Uses a shared ResizeObserver singleton (via observeResize/unobserveResize)
* for efficient detection when content or container changes. A single
* ResizeObserver instance is shared across all mounted useTruncation hooks,
* so even hundreds of table cells only create one observer.
*
* - Single-line: compares scrollWidth > offsetWidth
* - Multi-line: uses Range.getBoundingClientRect() to measure actual content
*   height, bypassing -webkit-line-clamp's clamped scrollHeight
*
* @example
* ```
* const truncation = useTruncation({ maxLines: 2 });
*
* <div ref={truncation.ref} style={{ WebkitLineClamp: 2 }}>
*   {text}
* </div>
*
* {truncation.isTruncated && <Tooltip>{truncation.fullText}</Tooltip>}
* ```
*/
function useTruncation(options) {
	const { maxLines } = options;
	const [isTruncated, setIsTruncated] = (0, import_react.useState)(false);
	const [fullText, setFullText] = (0, import_react.useState)("");
	const elementRef = (0, import_react.useRef)(null);
	const checkTruncation = (0, import_react.useCallback)((element) => {
		if (maxLines === 0) {
			setIsTruncated(false);
			return;
		}
		setFullText(element.textContent ?? "");
		if (maxLines === 1) setIsTruncated(element.scrollWidth > element.offsetWidth);
		else {
			let contentHeight = element.scrollHeight;
			try {
				const range = document.createRange();
				range.selectNodeContents(element);
				contentHeight = range.getBoundingClientRect().height;
				range.detach();
			} catch {}
			setIsTruncated(contentHeight > element.offsetHeight);
		}
	}, [maxLines]);
	return {
		ref: (0, import_react.useCallback)((element) => {
			if (elementRef.current) unobserveResize(elementRef.current);
			elementRef.current = element;
			if (element && maxLines > 0) {
				if (typeof ResizeObserver !== "undefined") observeResize(element, () => {
					checkTruncation(element);
				});
				else checkTruncation(element);
			} else {
				setIsTruncated(false);
				setFullText("");
			}
		}, [maxLines, checkTruncation]),
		isTruncated,
		fullText
	};
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/hooks/useMergedRefs.js
/**
* @file useMergedRefs.ts
* @input React refs to combine into one stable callback ref
* @output Exports useMergedRefs
* @position Core hook; use when one element must receive multiple refs
*
* SYNC: When modified, update:
* - /packages/core/src/hooks/index.ts
* - /packages/core/src/hooks/useMergedRefs.doc.mjs
* - /packages/core/src/hooks/useMergedRefs.test.tsx
*/
/**
* Combine up to six refs into a callback ref whose identity changes only when
* one of the input refs changes.
*/
function useMergedRefs(refA, refB, refC, refD, refE, refF) {
	return (0, import_react.useMemo)(() => mergeRefs(refA, refB, refC, refD, refE, refF), [
		refA,
		refB,
		refC,
		refD,
		refE,
		refF
	]);
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/Text/Text.js
/**
* @file Text.tsx
* @input Uses React, HTMLAttributes, ReactNode
* @output Exports Text component, TextProps, TextType, TextSize types
* @position Core implementation; consumed by index.ts, tested by Text.test.tsx
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/Text/Text.doc.mjs (props table, features, implementation notes)
* - /packages/core/src/Text/Text.test.tsx (tests for new/changed behavior)
* - /packages/core/src/Text/index.ts (exports if types change)
* - /apps/storybook/stories/Text.stories.tsx (storybook stories)
* - /packages/cli/assets/templates/blocks/components/Text/ (showcase blocks)
*/
var LazyXDSTooltip$1 = /*#__PURE__*/ (0, import_react.lazy)(async () => Promise.resolve().then(() => Tooltip_exports).then((mod) => ({ default: mod.Tooltip })));
var defaultColorByType = {
	body: "primary",
	large: "primary",
	label: "primary",
	supporting: "secondary",
	code: "primary",
	"display-1": "primary",
	"display-2": "primary",
	"display-3": "primary",
	inherit: "inherit"
};
/**
* Resolve the StyleX style key for a text type.
* Custom (theme-defined) types fall back to 'body' for baseline StyleX styles;
* their visual treatment comes from theme CSS overrides (.astryx-text.<type>).
*/
function resolveStyleType(type) {
	if (type in sizeByTypeStyles) return type;
	return "body";
}
/**
* Resolve the StyleX baseline color. Built-in colors map to their own color
* style; custom (theme-defined) colors fall back to the `primary` baseline —
* their actual color comes from theme CSS (`.astryx-text.<color>` /
* `.astryx-heading.<color>`), which the rendered `color` class targets.
*
* Exported so Heading applies the same custom-color fallback as Text.
*/
function resolveStyleColor(color) {
	if (color in colorStyles$3) return color;
	return "primary";
}
/**
* Semantic text component. Renders text with type-based styling from the theme.
*
* @example
* ```
* <Text type="body">Body text</Text>
* <Text type="large">Large body text</Text>
* <Text type="label">Form label</Text>
* <Text type="supporting">Helper text</Text>
* <Text type="code">{'const x = 1;'}</Text>
* <Text type="display-1" as="h1">Hero Title</Text>
* <Text type="display-2">$1.2M Revenue</Text>
* <Text type="body" maxLines={2}>Clamped text</Text>
* ```
*/
function Text({ type = "body", size, color, weight, display = "inline", maxLines = 0, hasTruncateTooltip = true, wordBreak, textWrap, justify = "start", hasCapsize = false, hasStrikethrough = false, hasTabularNumbers = false, xstyle, className, style, as: Component = "span", children, ref, ...props$25 }) {
	const resolvedColor = color ?? defaultColorByType[type] ?? "primary";
	const styleType = resolveStyleType(type);
	const styleColor = resolveStyleColor(resolvedColor);
	const resolvedWordBreak = wordBreak ?? (maxLines === 1 ? "break-all" : "break-word");
	const resolvedDisplay = maxLines > 0 || hasCapsize ? "block" : display;
	const truncation = useTruncation({ maxLines });
	const tooltipPlacement = typeof hasTruncateTooltip === "string" ? hasTruncateTooltip : "above";
	const tooltipEnabled = maxLines > 0 && hasTruncateTooltip !== false && truncation.isTruncated;
	const textRef = (0, import_react.useRef)(null);
	const mergedRef = useMergedRefs(ref, truncation.ref, textRef);
	const inlineStyle = maxLines > 1 ? { WebkitLineClamp: maxLines } : void 0;
	return /*#__PURE__*/ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/*#__PURE__*/ (0, import_jsx_runtime.jsx)(Component, {
		ref: mergedRef,
		...mergeProps(themeProps("text", {
			type,
			size,
			color: resolvedColor
		}), props(colorStyles$3[styleColor], sizeByTypeStyles[styleType], size && sizeStyles$5[size], defaultWeightByTypeStyles[styleType], weight && weightStyles[weight], maxLines === 1 ? truncationStyles.singleLine : maxLines > 1 ? truncationStyles.multiLine : displayStyles[resolvedDisplay], maxLines > 0 && wordBreakStyles[resolvedWordBreak], textWrap && textWrapStyles[textWrap], justify !== "start" && justifyStyles$1[justify], hasCapsize && capsizeStyles.enabled, hasStrikethrough && decorationStyles.strikethrough, hasTabularNumbers && tabularNumbersStyle.enabled, xstyle), className, {
			...style,
			...inlineStyle
		}),
		...props$25,
		children
	}), tooltipEnabled && /*#__PURE__*/ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
		fallback: null,
		children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)(LazyXDSTooltip$1, {
			anchorRef: textRef,
			content: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
				...props(truncationTooltipStyles.content),
				children: truncation.fullText
			}),
			placement: tooltipPlacement
		})
	})] });
}
Text.displayName = "Text";
//#endregion
//#region node_modules/@astryxdesign/core/dist/Spinner/Spinner.js
/**
* @file Spinner.tsx
* @input Uses React, StyleX, SVG rendering
* @output Exports Spinner component, SpinnerProps, SpinnerSize, SpinnerShade types
* @position Core implementation of spinner loading indicator
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/Spinner/Spinner.doc.mjs
* - /packages/core/src/Spinner/Spinner.test.tsx
* - /packages/core/src/Spinner/index.ts
* - /apps/storybook/stories/Spinner.stories.tsx
* - /packages/cli/assets/templates/blocks/components/Spinner/ (showcase blocks)
*/
/**
* Fraction of the ring the moving arc covers. The canvas ring this replaces
* swept 135deg, not the 270deg its constant's comment claimed.
*/
var ARC_FRACTION = .375;
var SIZES = {
	sm: {
		diameter: 10,
		border: 2
	},
	md: {
		diameter: 14,
		border: 3
	},
	lg: {
		diameter: 18,
		border: 3
	},
	xl: {
		diameter: 28,
		border: 4
	}
};
var RESOLVED_GEOMETRY_VARS = ["--_spinner-ring-diameter", "--_spinner-ring-stroke"];
/**
* The composed box size: diameter plus a stroke width on each side.
*
* It is deliberately NOT registered, unlike the pair above. The element reads
* it through an inline `width`/`height` with the size's own default as the
* `var()` fallback, so a render with no stylesheet — where nothing declares
* it — still sizes the box the way it always did. A registered property always
* has a value (its `initial-value`), which would swallow that fallback and
* collapse the box to zero.
*/
var BOX_SIZE = "--_spinner-box-size";
/**
* Register the resolved geometry vars as `<length>`.
*
* Both are consumed inside `calc()` — the box adds two stroke widths to a diameter,
* the circle halves one. Unregistered, a custom property substitutes as text,
* so whatever a theme wrote lands in the expression verbatim and a bare `0`
* (a valid length on its own, a `<number>` inside `calc()`) poisons the sum:
* `calc(28px + 0 * 2)` is invalid at computed-value time and the box loses its
* size. Registered, the value is already an absolute length by the time the
* `calc()` sees it, so `0` means `0px` — a zero-width stroke that paints
* nothing — rather than a bare `0` that invalidates the sum and leaves the box
* with no size at all. One `stroke-width` drives both circles, so a themed
* stroke width of `0` hides the arc along with the track; an arc with no track behind
* it is `--spinner-track-color: transparent`.
*
* Only these private vars are registered. The four public ones deliberately
* are not: a registered property has an `initial-value`, so every element in
* the document would report a value for it — and
* `.github/scripts/theme-var-reachability.js` finds a var's declaring element
* by exactly that test, so registering them would point the guard at `<html>`
* and report a var no theme can select.
*/
function registerSpinnerVars() {
	if (typeof CSS === "undefined" || typeof CSS.registerProperty !== "function") return;
	for (const name of RESOLVED_GEOMETRY_VARS) try {
		CSS.registerProperty({
			name,
			syntax: "<length>",
			inherits: true,
			initialValue: "0px"
		});
	} catch {}
}
registerSpinnerVars();
/**
* Pin every ring's rotation to the document timeline's origin instead of its
* own start time, so spinners mounted seconds apart turn in phase.
*
* Setting `startTime` is exact where arithmetic on a clock read is not: a
* negative `animation-delay` computed at mount is only as good as the gap
* between reading the clock and the frame the animation starts in, which at
* 10x CPU throttling measured 116deg of drift.
*
* Rings are collected and pinned in one frame because `getAnimations()`
* resolves style and `startTime` dirties it again, so pinning them one at a
* time makes each mount re-force what the previous one invalidated — 53 style
* recalcs for 38 spinners against 19 batched.
*/
var pendingRings = /* @__PURE__ */ new Set();
var flushScheduled = false;
function pinRingsToTimelineOrigin() {
	flushScheduled = false;
	const animations = [];
	for (const svg of pendingRings) animations.push(...svg.getAnimations());
	pendingRings.clear();
	for (const animation of animations) animation.startTime = 0;
}
/**
* Ref callback for the ring: the one place a mounted ring touches the DOM.
*
* It reads nothing back — the geometry is resolved by the cascade, not in JS.
*/
function syncRotationPhase(svg) {
	if (svg == null) return;
	if (typeof svg.getAnimations !== "function") return;
	pendingRings.add(svg);
	if (!flushScheduled) {
		flushScheduled = true;
		requestAnimationFrame(pinRingsToTimelineOrigin);
	}
	return () => {
		pendingRings.delete(svg);
	};
}
var styles$32 = {
	wrapper: {
		k1xSpc: "x3nfvp2",
		kXwgrk: "xdt5ytf",
		kGNEyG: "x6s0dn4",
		kOIVth: "x1txdalj",
		$$css: true
	},
	spinner: {
		k1xSpc: "xwz0xwf",
		kgQiWS: "x1ku5rj1",
		kVQacm: "xb3r6kr",
		kXLuUW: "xxymvpz",
		"--_spinner-ring-diameter": "x2lq4xu",
		"--_spinner-ring-stroke": "x10qssua",
		"--_spinner-box-size": "x69vvuq",
		$$css: true
	},
	circle: {
		kDwRjp: "xbh8q5q",
		kU5bRw: "x1owpc8m",
		kPFa82: "xio8zfp",
		kfJifR: "xgw3ha0",
		$$css: true
	},
	track: {
		kjVXCG: "xalkhop",
		$$css: true
	}
};
var sizeStyles$4 = {
	sm: {
		"--spinner-diameter": "x11wm0hx",
		"--spinner-stroke-width": "xls98ul",
		$$css: true
	},
	md: {
		"--spinner-diameter": "x15pu9g6",
		"--spinner-stroke-width": "xr0wkrm",
		$$css: true
	},
	lg: {
		"--spinner-diameter": "x1w424tr",
		"--spinner-stroke-width": "xr0wkrm",
		$$css: true
	},
	xl: {
		"--spinner-diameter": "x1orj1z9",
		"--spinner-stroke-width": "x7y2bof",
		$$css: true
	}
};
var shadeStyles = {
	default: {
		"--spinner-color": "xt1b8mc",
		"--spinner-track-color": "xspt9s2",
		$$css: true
	},
	subtle: {
		"--spinner-color": "x1jevo6s",
		"--spinner-track-color": "xspt9s2",
		$$css: true
	},
	onMedia: {
		"--spinner-color": "x13u6jys",
		"--spinner-track-color": "x1ufpcf6",
		$$css: true
	},
	inherit: {
		"--spinner-color": "x1uzk0gl",
		"--spinner-track-color": "xbfzqbu",
		$$css: true
	}
};
var trackOpacityStyles = {
	default: {
		kDd8S0: "x1g350g8",
		$$css: true
	},
	subtle: {
		kDd8S0: "x1g350g8",
		$$css: true
	},
	onMedia: {
		kDd8S0: "x1smxkh6",
		$$css: true
	},
	inherit: {
		kDd8S0: "x7bo2k",
		$$css: true
	}
};
/**
* An animated loading indicator. Available in four sizes and four color shades.
*
* @example
* ```
* <Spinner />
* <Spinner size="sm" />
* <Spinner size="lg" shade="onMedia" />
* <Spinner label="Loading..." />
* <Spinner aria-label="Loading data" />
* ```
*/
function Spinner({ size = "md", shade = "default", label, xstyle, className, style, "aria-label": ariaLabel, "data-testid": testId, ref, ...restProps }) {
	const { border, diameter } = SIZES[size];
	const frameSize = diameter + border * 2;
	const center = frameSize / 2;
	const circumference = Math.PI * diameter;
	const arcLength = circumference * ARC_FRACTION;
	const hasLabel = label != null;
	const labelId = (0, import_react.useId)();
	const namedByVisibleLabel = hasLabel && typeof label === "string" && ariaLabel == null;
	const spinner = /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
		ref: hasLabel ? void 0 : ref,
		role: "status",
		"aria-label": namedByVisibleLabel ? void 0 : ariaLabel ?? (typeof label === "string" ? label : void 0) ?? "Loading",
		"aria-labelledby": namedByVisibleLabel ? labelId : void 0,
		"data-testid": hasLabel ? void 0 : testId,
		...hasLabel ? {} : restProps,
		...mergeProps(hasLabel ? "" : themeProps("spinner", {
			size,
			shade
		}), props(styles$32.spinner, !hasLabel && sizeStyles$4[size], !hasLabel && shadeStyles[shade], !hasLabel && xstyle), hasLabel ? void 0 : className, {
			...hasLabel ? {} : style,
			width: `var(${BOX_SIZE}, ${frameSize}px)`,
			height: `var(${BOX_SIZE}, ${frameSize}px)`
		}),
		children: /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("svg", {
			ref: syncRotationPhase,
			width: frameSize,
			height: frameSize,
			viewBox: `0 0 ${frameSize} ${frameSize}`,
			"aria-hidden": "true",
			className: "xlp1x4z x1lliihq x1so62im x1rea2x4 x14qxm4i xnh0sag xa4qsjk x1ka1v4i x1esw782",
			children: [/*#__PURE__*/ (0, import_jsx_runtime.jsx)("circle", {
				cx: center,
				cy: center,
				r: diameter / 2,
				strokeWidth: border,
				...props(styles$32.circle, styles$32.track, trackOpacityStyles[shade])
			}), /*#__PURE__*/ (0, import_jsx_runtime.jsx)("circle", {
				cx: center,
				cy: center,
				r: diameter / 2,
				strokeWidth: border,
				strokeDasharray: `${arcLength} ${circumference - arcLength}`,
				transform: `rotate(-90 ${center} ${center})`,
				className: "xbh8q5q x1owpc8m xio8zfp xgw3ha0 xtve3lm x1vy8frr"
			})]
		})
	});
	if (!hasLabel) return spinner;
	return /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		"data-testid": testId,
		...restProps,
		...mergeProps(themeProps("spinner", {
			size,
			shade
		}), props(styles$32.wrapper, sizeStyles$4[size], shadeStyles[shade], xstyle), className, style),
		children: [spinner, typeof label === "string" ? /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Text, {
			id: labelId,
			type: "body",
			weight: "bold",
			children: label
		}) : label]
	});
}
Spinner.displayName = "Spinner";
//#endregion
//#region node_modules/@astryxdesign/core/dist/VisuallyHidden/VisuallyHidden.js
/**
* @file VisuallyHidden.tsx
* @input Uses React createElement/ElementType, stylex
* @output Exports VisuallyHidden component and VisuallyHiddenProps
* @position Accessibility primitive; renders content in the a11y tree while
*   hiding it visually (icon-only labels, aria-live regions, SR-only context)
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/VisuallyHidden/VisuallyHidden.doc.mjs
* - /packages/core/src/VisuallyHidden/VisuallyHidden.test.tsx
* - /apps/storybook/stories/VisuallyHidden.stories.tsx
* - /packages/cli/assets/templates/blocks/components/VisuallyHidden/ (showcase blocks)
*/
/**
* VisuallyHidden is deliberately styling-free: it exists to *not* be seen, so it
* intentionally omits `xstyle`/`className`/`style`. The clip block is fixed and
* non-overridable — styling a visually-hidden node is always a mistake. The
* accessibility pass-throughs from `BaseProps` (`aria-*`, `role`, `id`,
* `data-*`, event handlers) remain, since the live-region use case needs them.
*/
/**
* Renders its children in the accessibility tree while hiding them visually.
*
* Use for content that assistive technology must perceive but sighted users
* should not see: accessible names for icon-only controls, `aria-live`
* announcement regions, and supplementary screen-reader context.
*
* @example
* ```
* <IconButton icon="trash" label="">
*   <VisuallyHidden>Delete incident</VisuallyHidden>
* </IconButton>
* <VisuallyHidden as="div" aria-live="polite">
*   {`Moved ${task} to ${column}`}
* </VisuallyHidden>
* ```
*/
function VisuallyHidden({ children, as: element = "span", ref, ...props }) {
	return /*#__PURE__*/ (0, import_react.createElement)(element, {
		ref,
		...props,
		className: "x10l6tqk x1i1rx1s xjm9jq1 xkdpibf x1717udv xb3r6kr xzpqnlu xuxw1ft xng3xce x13vifvy x1o0tod x47corl x87ps6o"
	}, children);
}
VisuallyHidden.displayName = "VisuallyHidden";
//#endregion
//#region node_modules/@astryxdesign/core/dist/Layout/edgeCompensation.stylex.js
/**
* The data attribute that edge-compensatable components apply.
* Ghost buttons, tabs, and other transparent-padding components
* render this attribute so containers can detect them via `:has()`.
*/
var EDGE_COMP_ATTR = "data-astryx-edge-comp";
//#endregion
//#region node_modules/@astryxdesign/core/dist/SizeContext/SizeContext.js
/**
* @file SizeContext.ts
* @input React createContext, use
* @output Exports SizeContext, useSize, ElementSize, SizeProvider
* @position Context provider; consumed by Button, TextInput, TabList, Selector, etc.
*
* Generic size context that lets container components (Toolbar, TopNav, Card headers)
* cascade a default size to interactive children. Children use the context as a
* fallback — an explicit `size` prop always wins.
*/
/**
* Standard element sizes used across interactive components.
*/
/**
* Context for cascading a default size from container to children.
*
* `null` means no container is providing a size — components use their own default.
*/
var SizeContext = /*#__PURE__*/ (0, import_react.createContext)(null);
SizeContext.displayName = "SizeContext";
/**
* Resolve the effective size from an explicit prop, inherited context, or default.
*
* @param sizeProp - Explicit size prop from the component (wins if set)
* @param defaultSize - Fallback when neither prop nor context provides a size
* @returns The resolved size
*
* @example
* ```ts
* // In a component:
* const size = useSize(sizeProp, 'md');
* ```
*/
function useSize(sizeProp, defaultSize = "md") {
	const inherited = (0, import_react.use)(SizeContext);
	return sizeProp ?? inherited ?? defaultSize;
}
var SizeProvider = SizeContext.Provider;
//#endregion
//#region node_modules/@astryxdesign/core/dist/ButtonGroup/ButtonGroupContext.js
/**
* @file ButtonGroupContext.ts
* @input None (pure context definition)
* @output Exports ButtonGroup context and useButtonGroup hook
* @position Shared context; consumed by Button for group-aware styling
*/
var ButtonGroupContext = /*#__PURE__*/ (0, import_react.createContext)(null);
ButtonGroupContext.displayName = "ButtonGroupContext";
/**
* Hook for Button to detect when it's inside a ButtonGroup.
* Returns null when used outside a group.
*/
function useButtonGroup() {
	return (0, import_react.use)(ButtonGroupContext);
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/Link/LinkContext.js
/**
* @file LinkContext.ts
* @input React createContext, LinkComponentType
* @output Exports LinkContext and LinkContextValue
* @position Context definition for polymorphic link support
*
* Separated from LinkProvider.tsx to allow components to consume
* the context without pulling in the full provider implementation.
* Follows the ThemeContext.ts / Theme.tsx pattern.
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/Link/LinkProvider.tsx
* - /packages/core/src/Link/useLinkComponent.ts
* - /packages/core/src/Link/index.ts
* - /packages/core/src/Link/Link.doc.mjs
*/
/**
* Context value for the link provider.
*/
/**
* Context for providing a custom link component to all Astryx components.
* Defaults to null (components fall back to native `<a>`).
*/
var LinkContext = /*#__PURE__*/ (0, import_react.createContext)(null);
LinkContext.displayName = "LinkContext";
//#endregion
//#region node_modules/@astryxdesign/core/dist/Link/useLinkComponent.js
/**
* @file useLinkComponent.ts
* @input React use, useMemo, createElement, forwardRef, LinkContext, LinkComponentType
* @output Exports useLinkComponent hook
* @position Hook for resolving the link component in Astryx components
*
* Resolution order: per-component `as` prop > LinkProvider context > native `<a>`.
*
* When the resolved component is a custom component (not native `<a>`),
* wraps it to pass `to={href}` alongside `href`. This enables compatibility
* with routers that use `to` (React Router, TanStack Router)
* without requiring an adapter component.
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/Link/index.ts
* - /packages/core/src/Link/Link.doc.mjs
*/
/**
* Creates a wrapper component that passes both `href` and `to` props
* to the underlying link component. This enables routers that use `to`
* (React Router, TanStack Router) to work without an adapter.
*
* The wrapper is transparent: it forwards refs and all other props unchanged.
* Native `<a>` elements ignore the unknown `to` prop harmlessly.
*/
function createLinkWithTo(Component) {
	function LinkWithTo({ href, ref, ...rest }) {
		return /*#__PURE__*/ (0, import_react.createElement)(Component, {
			ref,
			href,
			to: href,
			...rest
		});
	}
	LinkWithTo.displayName = `LinkWithTo(${typeof Component === "string" ? Component : Component.displayName || Component.name || "Component"})`;
	return LinkWithTo;
}
/**
* Resolves the link component to use.
*
* Priority: `as` prop > `LinkProvider` context > native `<a>`.
*
* When the resolved component is a custom component (not the native `<a>`),
* it is wrapped to receive both `href` and `to` props set to the same value.
* This allows `to`-based routers (React Router, TanStack Router) to work
* out of the box without a manual adapter.
*
* @param as - Per-component override. If provided, takes highest priority.
* @returns The resolved link component (with `to` injection for custom components).
*
* @example
* ```
* function MyComponent({ as }: { as?: LinkComponentType }) {
*   const LinkComponent = useLinkComponent(as);
*   return <LinkComponent href="/foo">Click me</LinkComponent>;
* }
* ```
*/
function useLinkComponent(as) {
	const ctx = (0, import_react.use)(LinkContext);
	const resolved = as ?? ctx?.component ?? "a";
	return (0, import_react.useMemo)(() => {
		if (resolved === "a") return "a";
		return createLinkWithTo(resolved);
	}, [resolved]);
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/utils/interactionOverlay.stylex.js
`${colorVars["--color-overlay-hover"]}${colorVars["--color-overlay-hover"]}`;
`${colorVars["--color-overlay-pressed"]}${colorVars["--color-overlay-pressed"]}`;
`${colorVars["--color-neutral"]}${colorVars["--color-neutral"]}`;
var interactionOverlayStyles = {
	backgroundColor: {
		kWkggS: "xjbqb8w x1anq1lc xoevpu5 xprvw0a",
		$$css: true
	},
	backgroundImage: {
		kKwaWg: "x7uyq82 xmvprkv xetgvay",
		$$css: true
	},
	backgroundImageOnNeutral: {
		kKwaWg: "x14bno8m xzmimnh x1otsd3y xo3fi6e",
		$$css: true
	}
};
//#endregion
//#region node_modules/@formatjs/fast-memoize/index.js
function memoize(fn, options) {
	const cache = options && options.cache ? options.cache : cacheDefault;
	const serializer = options && options.serializer ? options.serializer : serializerDefault;
	return (options && options.strategy ? options.strategy : strategyDefault)(fn, {
		cache,
		serializer
	});
}
function isPrimitive(value) {
	return value == null || typeof value === "number" || typeof value === "boolean";
}
function monadic(fn, cache, serializer, arg) {
	const cacheKey = isPrimitive(arg) ? arg : serializer(arg);
	let computedValue = cache.get(cacheKey);
	if (typeof computedValue === "undefined") {
		computedValue = fn.call(this, arg);
		cache.set(cacheKey, computedValue);
	}
	return computedValue;
}
function variadic(fn, cache, serializer) {
	const args = Array.prototype.slice.call(arguments, 3);
	const cacheKey = serializer(args);
	let computedValue = cache.get(cacheKey);
	if (typeof computedValue === "undefined") {
		computedValue = fn.apply(this, args);
		cache.set(cacheKey, computedValue);
	}
	return computedValue;
}
function assemble(fn, context, strategy, cache, serialize) {
	return strategy.bind(context, fn, cache, serialize);
}
function strategyDefault(fn, options) {
	const strategy = fn.length === 1 ? monadic : variadic;
	return assemble(fn, this, strategy, options.cache.create(), options.serializer);
}
function strategyVariadic(fn, options) {
	return assemble(fn, this, variadic, options.cache.create(), options.serializer);
}
function strategyMonadic(fn, options) {
	return assemble(fn, this, monadic, options.cache.create(), options.serializer);
}
var serializerDefault = function() {
	return JSON.stringify(arguments);
};
var ObjectWithoutPrototypeCache = class {
	constructor() {
		this.cache = Object.create(null);
	}
	get(key) {
		return this.cache[key];
	}
	set(key, value) {
		this.cache[key] = value;
	}
};
var cacheDefault = { create: function create() {
	return new ObjectWithoutPrototypeCache();
} };
var strategies = {
	variadic: strategyVariadic,
	monadic: strategyMonadic
};
//#endregion
//#region node_modules/@formatjs/icu-skeleton-parser/index.js
/**
* https://unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
* Credit: https://github.com/caridy/intl-datetimeformat-pattern/blob/master/index.js
* with some tweaks
*/
var DATE_TIME_REGEX = /(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;
/**
* Parse Date time skeleton into Intl.DateTimeFormatOptions
* Ref: https://unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
* @public
* @param skeleton skeleton string
*/
function parseDateTimeSkeleton(skeleton) {
	const result = {};
	skeleton.replace(DATE_TIME_REGEX, (match) => {
		const len = match.length;
		switch (match[0]) {
			case "G":
				result.era = len === 4 ? "long" : len === 5 ? "narrow" : "short";
				break;
			case "y":
				result.year = len === 2 ? "2-digit" : "numeric";
				break;
			case "Y":
			case "u":
			case "U":
			case "r": throw new RangeError("`Y/u/U/r` (year) patterns are not supported, use `y` instead");
			case "q":
			case "Q": throw new RangeError("`q/Q` (quarter) patterns are not supported");
			case "M":
			case "L":
				result.month = [
					"numeric",
					"2-digit",
					"short",
					"long",
					"narrow"
				][len - 1];
				break;
			case "w":
			case "W": throw new RangeError("`w/W` (week) patterns are not supported");
			case "d":
				result.day = ["numeric", "2-digit"][len - 1];
				break;
			case "D":
			case "F":
			case "g": throw new RangeError("`D/F/g` (day) patterns are not supported, use `d` instead");
			case "E":
				result.weekday = len === 4 ? "long" : len === 5 ? "narrow" : "short";
				break;
			case "e":
				if (len < 4) throw new RangeError("`e..eee` (weekday) patterns are not supported");
				result.weekday = [
					"short",
					"long",
					"narrow",
					"short"
				][len - 3];
				break;
			case "c":
				if (len < 4) throw new RangeError("`c..ccc` (weekday) patterns are not supported");
				result.weekday = [
					"short",
					"long",
					"narrow",
					"short"
				][len - 3];
				break;
			case "a":
				result.hour12 = true;
				break;
			case "b":
			case "B": throw new RangeError("`b/B` (period) patterns are not supported, use `a` instead");
			case "h":
				result.hourCycle = "h12";
				result.hour = ["numeric", "2-digit"][len - 1];
				break;
			case "H":
				result.hourCycle = "h23";
				result.hour = ["numeric", "2-digit"][len - 1];
				break;
			case "K":
				result.hourCycle = "h11";
				result.hour = ["numeric", "2-digit"][len - 1];
				break;
			case "k":
				result.hourCycle = "h24";
				result.hour = ["numeric", "2-digit"][len - 1];
				break;
			case "j":
			case "J":
			case "C": throw new RangeError("`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead");
			case "m":
				result.minute = ["numeric", "2-digit"][len - 1];
				break;
			case "s":
				result.second = ["numeric", "2-digit"][len - 1];
				break;
			case "S":
			case "A": throw new RangeError("`S/A` (second) patterns are not supported, use `s` instead");
			case "z":
				result.timeZoneName = len < 4 ? "short" : "long";
				break;
			case "Z":
			case "O":
			case "v":
			case "V":
			case "X":
			case "x": throw new RangeError("`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead");
		}
		return "";
	});
	return result;
}
var WHITE_SPACE_REGEX = /[\t-\r \x85\u200E\u200F\u2028\u2029]/i;
function parseNumberSkeletonFromString(skeleton) {
	if (skeleton.length === 0) throw new Error("Number skeleton cannot be empty");
	const stringTokens = skeleton.split(WHITE_SPACE_REGEX).filter((x) => x.length > 0);
	const tokens = [];
	for (const stringToken of stringTokens) {
		let stemAndOptions = stringToken.split("/");
		if (stemAndOptions.length === 0) throw new Error("Invalid number skeleton");
		const [stem, ...options] = stemAndOptions;
		for (const option of options) if (option.length === 0) throw new Error("Invalid number skeleton");
		tokens.push({
			stem,
			options
		});
	}
	return tokens;
}
function icuUnitToEcma(unit) {
	return unit.replace(/^(.*?)-/, "");
}
var FRACTION_PRECISION_REGEX = /^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g;
var SIGNIFICANT_PRECISION_REGEX = /^(@+)?(\+|#+)?[rs]?$/g;
var INTEGER_WIDTH_REGEX = /(\*)(0+)|(#+)(0+)|(0+)/g;
var CONCISE_INTEGER_WIDTH_REGEX = /^(0+)$/;
function parseSignificantPrecision(str) {
	const result = {};
	if (str[str.length - 1] === "r") result.roundingPriority = "morePrecision";
	else if (str[str.length - 1] === "s") result.roundingPriority = "lessPrecision";
	str.replace(SIGNIFICANT_PRECISION_REGEX, function(_, g1, g2) {
		if (typeof g2 !== "string") {
			result.minimumSignificantDigits = g1.length;
			result.maximumSignificantDigits = g1.length;
		} else if (g2 === "+") result.minimumSignificantDigits = g1.length;
		else if (g1[0] === "#") result.maximumSignificantDigits = g1.length;
		else {
			result.minimumSignificantDigits = g1.length;
			result.maximumSignificantDigits = g1.length + (typeof g2 === "string" ? g2.length : 0);
		}
		return "";
	});
	return result;
}
function parseSign(str) {
	switch (str) {
		case "sign-auto": return { signDisplay: "auto" };
		case "sign-accounting":
		case "()": return { currencySign: "accounting" };
		case "sign-always":
		case "+!": return { signDisplay: "always" };
		case "sign-accounting-always":
		case "()!": return {
			signDisplay: "always",
			currencySign: "accounting"
		};
		case "sign-except-zero":
		case "+?": return { signDisplay: "exceptZero" };
		case "sign-accounting-except-zero":
		case "()?": return {
			signDisplay: "exceptZero",
			currencySign: "accounting"
		};
		case "sign-never":
		case "+_": return { signDisplay: "never" };
	}
}
function parseConciseScientificAndEngineeringStem(stem) {
	let result;
	if (stem[0] === "E" && stem[1] === "E") {
		result = { notation: "engineering" };
		stem = stem.slice(2);
	} else if (stem[0] === "E") {
		result = { notation: "scientific" };
		stem = stem.slice(1);
	}
	if (result) {
		const signDisplay = stem.slice(0, 2);
		if (signDisplay === "+!") {
			result.signDisplay = "always";
			stem = stem.slice(2);
		} else if (signDisplay === "+?") {
			result.signDisplay = "exceptZero";
			stem = stem.slice(2);
		}
		if (!CONCISE_INTEGER_WIDTH_REGEX.test(stem)) throw new Error("Malformed concise eng/scientific notation");
		result.minimumIntegerDigits = stem.length;
	}
	return result;
}
function parseNotationOptions(opt) {
	const result = {};
	const signOpts = parseSign(opt);
	if (signOpts) return signOpts;
	return result;
}
/**
* https://github.com/unicode-org/icu/blob/master/docs/userguide/format_parse/numbers/skeletons.md#skeleton-stems-and-options
*/
function parseNumberSkeleton(tokens) {
	let result = {};
	for (const token of tokens) {
		switch (token.stem) {
			case "percent":
			case "%":
				result.style = "percent";
				continue;
			case "%x100":
				result.style = "percent";
				result.scale = 100;
				continue;
			case "currency":
				result.style = "currency";
				result.currency = token.options[0];
				continue;
			case "group-off":
			case ",_":
				result.useGrouping = false;
				continue;
			case "precision-integer":
			case ".":
				result.maximumFractionDigits = 0;
				continue;
			case "measure-unit":
			case "unit":
				result.style = "unit";
				result.unit = icuUnitToEcma(token.options[0]);
				continue;
			case "compact-short":
			case "K":
				result.notation = "compact";
				result.compactDisplay = "short";
				continue;
			case "compact-long":
			case "KK":
				result.notation = "compact";
				result.compactDisplay = "long";
				continue;
			case "scientific":
				result = {
					...result,
					notation: "scientific",
					...token.options.reduce((all, opt) => ({
						...all,
						...parseNotationOptions(opt)
					}), {})
				};
				continue;
			case "engineering":
				result = {
					...result,
					notation: "engineering",
					...token.options.reduce((all, opt) => ({
						...all,
						...parseNotationOptions(opt)
					}), {})
				};
				continue;
			case "notation-simple":
				result.notation = "standard";
				continue;
			case "unit-width-narrow":
				result.currencyDisplay = "narrowSymbol";
				result.unitDisplay = "narrow";
				continue;
			case "unit-width-short":
				result.currencyDisplay = "code";
				result.unitDisplay = "short";
				continue;
			case "unit-width-full-name":
				result.currencyDisplay = "name";
				result.unitDisplay = "long";
				continue;
			case "unit-width-iso-code":
				result.currencyDisplay = "symbol";
				continue;
			case "scale":
				result.scale = parseFloat(token.options[0]);
				continue;
			case "rounding-mode-floor":
				result.roundingMode = "floor";
				continue;
			case "rounding-mode-ceiling":
				result.roundingMode = "ceil";
				continue;
			case "rounding-mode-down":
				result.roundingMode = "trunc";
				continue;
			case "rounding-mode-up":
				result.roundingMode = "expand";
				continue;
			case "rounding-mode-half-even":
				result.roundingMode = "halfEven";
				continue;
			case "rounding-mode-half-down":
				result.roundingMode = "halfTrunc";
				continue;
			case "rounding-mode-half-up":
				result.roundingMode = "halfExpand";
				continue;
			case "integer-width":
				if (token.options.length > 1) throw new RangeError("integer-width stems only accept a single optional option");
				token.options[0].replace(INTEGER_WIDTH_REGEX, function(_, g1, g2, g3, g4, g5) {
					if (g1) result.minimumIntegerDigits = g2.length;
					else if (g3 && g4) throw new Error("We currently do not support maximum integer digits");
					else if (g5) throw new Error("We currently do not support exact integer digits");
					return "";
				});
				continue;
		}
		if (CONCISE_INTEGER_WIDTH_REGEX.test(token.stem)) {
			result.minimumIntegerDigits = token.stem.length;
			continue;
		}
		if (FRACTION_PRECISION_REGEX.test(token.stem)) {
			if (token.options.length > 1) throw new RangeError("Fraction-precision stems only accept a single optional option");
			token.stem.replace(FRACTION_PRECISION_REGEX, function(_, g1, g2, g3, g4, g5) {
				if (g2 === "*") result.minimumFractionDigits = g1.length;
				else if (g3 && g3[0] === "#") result.maximumFractionDigits = g3.length;
				else if (g4 && g5) {
					result.minimumFractionDigits = g4.length;
					result.maximumFractionDigits = g4.length + g5.length;
				} else {
					result.minimumFractionDigits = g1.length;
					result.maximumFractionDigits = g1.length;
				}
				return "";
			});
			const opt = token.options[0];
			if (opt === "w") result = {
				...result,
				trailingZeroDisplay: "stripIfInteger"
			};
			else if (opt) result = {
				...result,
				...parseSignificantPrecision(opt)
			};
			continue;
		}
		if (SIGNIFICANT_PRECISION_REGEX.test(token.stem)) {
			result = {
				...result,
				...parseSignificantPrecision(token.stem)
			};
			continue;
		}
		const signOpts = parseSign(token.stem);
		if (signOpts) result = {
			...result,
			...signOpts
		};
		const conciseScientificAndEngineeringOpts = parseConciseScientificAndEngineeringStem(token.stem);
		if (conciseScientificAndEngineeringOpts) result = {
			...result,
			...conciseScientificAndEngineeringOpts
		};
	}
	return result;
}
//#endregion
//#region node_modules/@formatjs/icu-messageformat-parser/index.js
var ErrorKind = /* @__PURE__ */ function(ErrorKind) {
	/** Argument is unclosed (e.g. `{0`) */
	ErrorKind[ErrorKind["EXPECT_ARGUMENT_CLOSING_BRACE"] = 1] = "EXPECT_ARGUMENT_CLOSING_BRACE";
	/** Argument is empty (e.g. `{}`). */
	ErrorKind[ErrorKind["EMPTY_ARGUMENT"] = 2] = "EMPTY_ARGUMENT";
	/** Argument is malformed (e.g. `{foo!}``) */
	ErrorKind[ErrorKind["MALFORMED_ARGUMENT"] = 3] = "MALFORMED_ARGUMENT";
	/** Expect an argument type (e.g. `{foo,}`) */
	ErrorKind[ErrorKind["EXPECT_ARGUMENT_TYPE"] = 4] = "EXPECT_ARGUMENT_TYPE";
	/** Unsupported argument type (e.g. `{foo,foo}`) */
	ErrorKind[ErrorKind["INVALID_ARGUMENT_TYPE"] = 5] = "INVALID_ARGUMENT_TYPE";
	/** Expect an argument style (e.g. `{foo, number, }`) */
	ErrorKind[ErrorKind["EXPECT_ARGUMENT_STYLE"] = 6] = "EXPECT_ARGUMENT_STYLE";
	/** The number skeleton is invalid. */
	ErrorKind[ErrorKind["INVALID_NUMBER_SKELETON"] = 7] = "INVALID_NUMBER_SKELETON";
	/** The date time skeleton is invalid. */
	ErrorKind[ErrorKind["INVALID_DATE_TIME_SKELETON"] = 8] = "INVALID_DATE_TIME_SKELETON";
	/** Exepct a number skeleton following the `::` (e.g. `{foo, number, ::}`) */
	ErrorKind[ErrorKind["EXPECT_NUMBER_SKELETON"] = 9] = "EXPECT_NUMBER_SKELETON";
	/** Exepct a date time skeleton following the `::` (e.g. `{foo, date, ::}`) */
	ErrorKind[ErrorKind["EXPECT_DATE_TIME_SKELETON"] = 10] = "EXPECT_DATE_TIME_SKELETON";
	/** Unmatched apostrophes in the argument style (e.g. `{foo, number, 'test`) */
	ErrorKind[ErrorKind["UNCLOSED_QUOTE_IN_ARGUMENT_STYLE"] = 11] = "UNCLOSED_QUOTE_IN_ARGUMENT_STYLE";
	/** Missing select argument options (e.g. `{foo, select}`) */
	ErrorKind[ErrorKind["EXPECT_SELECT_ARGUMENT_OPTIONS"] = 12] = "EXPECT_SELECT_ARGUMENT_OPTIONS";
	/** Expecting an offset value in `plural` or `selectordinal` argument (e.g `{foo, plural, offset}`) */
	ErrorKind[ErrorKind["EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE"] = 13] = "EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE";
	/** Offset value in `plural` or `selectordinal` is invalid (e.g. `{foo, plural, offset: x}`) */
	ErrorKind[ErrorKind["INVALID_PLURAL_ARGUMENT_OFFSET_VALUE"] = 14] = "INVALID_PLURAL_ARGUMENT_OFFSET_VALUE";
	/** Expecting a selector in `select` argument (e.g `{foo, select}`) */
	ErrorKind[ErrorKind["EXPECT_SELECT_ARGUMENT_SELECTOR"] = 15] = "EXPECT_SELECT_ARGUMENT_SELECTOR";
	/** Expecting a selector in `plural` or `selectordinal` argument (e.g `{foo, plural}`) */
	ErrorKind[ErrorKind["EXPECT_PLURAL_ARGUMENT_SELECTOR"] = 16] = "EXPECT_PLURAL_ARGUMENT_SELECTOR";
	/** Expecting a message fragment after the `select` selector (e.g. `{foo, select, apple}`) */
	ErrorKind[ErrorKind["EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT"] = 17] = "EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT";
	/**
	* Expecting a message fragment after the `plural` or `selectordinal` selector
	* (e.g. `{foo, plural, one}`)
	*/
	ErrorKind[ErrorKind["EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT"] = 18] = "EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT";
	/** Selector in `plural` or `selectordinal` is malformed (e.g. `{foo, plural, =x {#}}`) */
	ErrorKind[ErrorKind["INVALID_PLURAL_ARGUMENT_SELECTOR"] = 19] = "INVALID_PLURAL_ARGUMENT_SELECTOR";
	/**
	* Duplicate selectors in `plural` or `selectordinal` argument.
	* (e.g. {foo, plural, one {#} one {#}})
	*/
	ErrorKind[ErrorKind["DUPLICATE_PLURAL_ARGUMENT_SELECTOR"] = 20] = "DUPLICATE_PLURAL_ARGUMENT_SELECTOR";
	/** Duplicate selectors in `select` argument.
	* (e.g. {foo, select, apple {apple} apple {apple}})
	*/
	ErrorKind[ErrorKind["DUPLICATE_SELECT_ARGUMENT_SELECTOR"] = 21] = "DUPLICATE_SELECT_ARGUMENT_SELECTOR";
	/** Plural or select argument option must have `other` clause. */
	ErrorKind[ErrorKind["MISSING_OTHER_CLAUSE"] = 22] = "MISSING_OTHER_CLAUSE";
	/** The tag is malformed. (e.g. `<bold!>foo</bold!>) */
	ErrorKind[ErrorKind["INVALID_TAG"] = 23] = "INVALID_TAG";
	/** The tag name is invalid. (e.g. `<123>foo</123>`) */
	ErrorKind[ErrorKind["INVALID_TAG_NAME"] = 25] = "INVALID_TAG_NAME";
	/** The closing tag does not match the opening tag. (e.g. `<bold>foo</italic>`) */
	ErrorKind[ErrorKind["UNMATCHED_CLOSING_TAG"] = 26] = "UNMATCHED_CLOSING_TAG";
	/** The opening tag has unmatched closing tag. (e.g. `<bold>foo`) */
	ErrorKind[ErrorKind["UNCLOSED_TAG"] = 27] = "UNCLOSED_TAG";
	return ErrorKind;
}({});
/**
* Type Guards
*/
function isLiteralElement(el) {
	return el.type === 0;
}
function isArgumentElement(el) {
	return el.type === 1;
}
function isNumberElement(el) {
	return el.type === 2;
}
function isDateElement(el) {
	return el.type === 3;
}
function isTimeElement(el) {
	return el.type === 4;
}
function isSelectElement(el) {
	return el.type === 5;
}
function isPluralElement(el) {
	return el.type === 6;
}
function isPoundElement(el) {
	return el.type === 7;
}
function isTagElement(el) {
	return el.type === 8;
}
function isNumberSkeleton(el) {
	return !!(el && typeof el === "object" && el.type === 0);
}
function isDateTimeSkeleton(el) {
	return !!(el && typeof el === "object" && el.type === 1);
}
var SPACE_SEPARATOR_REGEX = /[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/;
var timeData = {
	"001": ["H", "h"],
	"419": [
		"h",
		"H",
		"hB",
		"hb"
	],
	"AC": [
		"H",
		"h",
		"hb",
		"hB"
	],
	"AD": ["H", "hB"],
	"AE": [
		"h",
		"hB",
		"hb",
		"H"
	],
	"AF": [
		"H",
		"hb",
		"hB",
		"h"
	],
	"AG": [
		"h",
		"hb",
		"H",
		"hB"
	],
	"AI": [
		"H",
		"h",
		"hb",
		"hB"
	],
	"AL": [
		"h",
		"H",
		"hB"
	],
	"AM": ["H", "hB"],
	"AO": ["H", "hB"],
	"AR": [
		"h",
		"H",
		"hB",
		"hb"
	],
	"AS": ["h", "H"],
	"AT": ["H", "hB"],
	"AU": [
		"h",
		"hb",
		"H",
		"hB"
	],
	"AW": ["H", "hB"],
	"AX": ["H"],
	"AZ": [
		"H",
		"hB",
		"h"
	],
	"BA": [
		"H",
		"hB",
		"h"
	],
	"BB": [
		"h",
		"hb",
		"H",
		"hB"
	],
	"BD": [
		"h",
		"hB",
		"H"
	],
	"BE": ["H", "hB"],
	"BF": ["H", "hB"],
	"BG": [
		"H",
		"hB",
		"h"
	],
	"BH": [
		"h",
		"hB",
		"hb",
		"H"
	],
	"BI": ["H", "h"],
	"BJ": ["H", "hB"],
	"BL": ["H", "hB"],
	"BM": [
		"h",
		"hb",
		"H",
		"hB"
	],
	"BN": [
		"hb",
		"hB",
		"h",
		"H"
	],
	"BO": [
		"h",
		"H",
		"hB",
		"hb"
	],
	"BQ": ["H"],
	"BR": ["H", "hB"],
	"BS": [
		"h",
		"hb",
		"H",
		"hB"
	],
	"BT": ["h", "H"],
	"BW": [
		"H",
		"h",
		"hb",
		"hB"
	],
	"BY": ["H", "h"],
	"BZ": [
		"H",
		"h",
		"hb",
		"hB"
	],
	"CA": [
		"h",
		"hb",
		"H",
		"hB"
	],
	"CC": [
		"H",
		"h",
		"hb",
		"hB"
	],
	"CD": ["hB", "H"],
	"CF": [
		"H",
		"h",
		"hB"
	],
	"CG": ["H", "hB"],
	"CH": [
		"H",
		"hB",
		"h"
	],
	"CI": ["H", "hB"],
	"CK": [
		"H",
		"h",
		"hb",
		"hB"
	],
	"CL": [
		"h",
		"H",
		"hB",
		"hb"
	],
	"CM": [
		"H",
		"h",
		"hB"
	],
	"CN": [
		"H",
		"hB",
		"hb",
		"h"
	],
	"CO": [
		"h",
		"H",
		"hB",
		"hb"
	],
	"CP": ["H"],
	"CR": [
		"h",
		"H",
		"hB",
		"hb"
	],
	"CU": [
		"h",
		"H",
		"hB",
		"hb"
	],
	"CV": ["H", "hB"],
	"CW": ["H", "hB"],
	"CX": [
		"H",
		"h",
		"hb",
		"hB"
	],
	"CY": [
		"h",
		"H",
		"hb",
		"hB"
	],
	"CZ": ["H"],
	"DE": ["H", "hB"],
	"DG": [
		"H",
		"h",
		"hb",
		"hB"
	],
	"DJ": ["h", "H"],
	"DK": ["H"],
	"DM": [
		"h",
		"hb",
		"H",
		"hB"
	],
	"DO": [
		"h",
		"H",
		"hB",
		"hb"
	],
	"DZ": [
		"h",
		"hB",
		"hb",
		"H"
	],
	"EA": [
		"H",
		"h",
		"hB",
		"hb"
	],
	"EC": [
		"h",
		"H",
		"hB",
		"hb"
	],
	"EE": ["H", "hB"],
	"EG": [
		"h",
		"hB",
		"hb",
		"H"
	],
	"EH": [
		"h",
		"hB",
		"hb",
		"H"
	],
	"ER": ["h", "H"],
	"ES": [
		"H",
		"hB",
		"h",
		"hb"
	],
	"ET": [
		"hB",
		"hb",
		"h",
		"H"
	],
	"FI": ["H"],
	"FJ": [
		"h",
		"hb",
		"H",
		"hB"
	],
	"FK": [
		"H",
		"h",
		"hb",
		"hB"
	],
	"FM": [
		"h",
		"hb",
		"H",
		"hB"
	],
	"FO": ["H", "h"],
	"FR": ["H", "hB"],
	"GA": ["H", "hB"],
	"GB": [
		"H",
		"h",
		"hb",
		"hB"
	],
	"GD": [
		"h",
		"hb",
		"H",
		"hB"
	],
	"GE": [
		"H",
		"hB",
		"h"
	],
	"GF": ["H", "hB"],
	"GG": [
		"H",
		"h",
		"hb",
		"hB"
	],
	"GH": ["h", "H"],
	"GI": [
		"H",
		"h",
		"hb",
		"hB"
	],
	"GL": ["H", "h"],
	"GM": [
		"h",
		"hb",
		"H",
		"hB"
	],
	"GN": ["H", "hB"],
	"GP": ["H", "hB"],
	"GQ": [
		"H",
		"hB",
		"h",
		"hb"
	],
	"GR": [
		"h",
		"H",
		"hb",
		"hB"
	],
	"GS": [
		"H",
		"h",
		"hb",
		"hB"
	],
	"GT": [
		"h",
		"H",
		"hB",
		"hb"
	],
	"GU": [
		"h",
		"hb",
		"H",
		"hB"
	],
	"GW": ["H", "hB"],
	"GY": [
		"h",
		"hb",
		"H",
		"hB"
	],
	"HK": [
		"h",
		"hB",
		"hb",
		"H"
	],
	"HN": [
		"h",
		"H",
		"hB",
		"hb"
	],
	"HR": ["H", "hB"],
	"HU": ["H", "h"],
	"IC": [
		"H",
		"h",
		"hB",
		"hb"
	],
	"ID": ["H"],
	"IE": [
		"H",
		"h",
		"hb",
		"hB"
	],
	"IL": ["H", "hB"],
	"IM": [
		"H",
		"h",
		"hb",
		"hB"
	],
	"IN": ["h", "H"],
	"IO": [
		"H",
		"h",
		"hb",
		"hB"
	],
	"IQ": [
		"h",
		"hB",
		"hb",
		"H"
	],
	"IR": ["hB", "H"],
	"IS": ["H"],
	"IT": ["H", "hB"],
	"JE": [
		"H",
		"h",
		"hb",
		"hB"
	],
	"JM": [
		"h",
		"hb",
		"H",
		"hB"
	],
	"JO": [
		"h",
		"hB",
		"hb",
		"H"
	],
	"JP": [
		"H",
		"K",
		"h"
	],
	"KE": [
		"hB",
		"hb",
		"H",
		"h"
	],
	"KG": [
		"H",
		"h",
		"hB",
		"hb"
	],
	"KH": [
		"hB",
		"h",
		"H",
		"hb"
	],
	"KI": [
		"h",
		"hb",
		"H",
		"hB"
	],
	"KM": [
		"H",
		"h",
		"hB",
		"hb"
	],
	"KN": [
		"h",
		"hb",
		"H",
		"hB"
	],
	"KP": [
		"h",
		"H",
		"hB",
		"hb"
	],
	"KR": [
		"h",
		"H",
		"hB",
		"hb"
	],
	"KW": [
		"h",
		"hB",
		"hb",
		"H"
	],
	"KY": [
		"h",
		"hb",
		"H",
		"hB"
	],
	"KZ": ["H", "hB"],
	"LA": [
		"H",
		"hb",
		"hB",
		"h"
	],
	"LB": [
		"h",
		"hB",
		"hb",
		"H"
	],
	"LC": [
		"h",
		"hb",
		"H",
		"hB"
	],
	"LI": [
		"H",
		"hB",
		"h"
	],
	"LK": [
		"H",
		"h",
		"hB",
		"hb"
	],
	"LR": [
		"h",
		"hb",
		"H",
		"hB"
	],
	"LS": ["h", "H"],
	"LT": [
		"H",
		"h",
		"hb",
		"hB"
	],
	"LU": [
		"H",
		"h",
		"hB"
	],
	"LV": [
		"H",
		"hB",
		"hb",
		"h"
	],
	"LY": [
		"h",
		"hB",
		"hb",
		"H"
	],
	"MA": [
		"H",
		"h",
		"hB",
		"hb"
	],
	"MC": ["H", "hB"],
	"MD": ["H", "hB"],
	"ME": [
		"H",
		"hB",
		"h"
	],
	"MF": ["H", "hB"],
	"MG": ["H", "h"],
	"MH": [
		"h",
		"hb",
		"H",
		"hB"
	],
	"MK": [
		"H",
		"h",
		"hb",
		"hB"
	],
	"ML": ["H"],
	"MM": [
		"hB",
		"hb",
		"H",
		"h"
	],
	"MN": [
		"H",
		"h",
		"hb",
		"hB"
	],
	"MO": [
		"h",
		"hB",
		"hb",
		"H"
	],
	"MP": [
		"h",
		"hb",
		"H",
		"hB"
	],
	"MQ": ["H", "hB"],
	"MR": [
		"h",
		"hB",
		"hb",
		"H"
	],
	"MS": [
		"H",
		"h",
		"hb",
		"hB"
	],
	"MT": ["H", "h"],
	"MU": ["H", "h"],
	"MV": ["H", "h"],
	"MW": [
		"h",
		"hb",
		"H",
		"hB"
	],
	"MX": [
		"h",
		"H",
		"hB",
		"hb"
	],
	"MY": [
		"hb",
		"hB",
		"h",
		"H"
	],
	"MZ": ["H", "hB"],
	"NA": [
		"h",
		"H",
		"hB",
		"hb"
	],
	"NC": ["H", "hB"],
	"NE": ["H"],
	"NF": [
		"H",
		"h",
		"hb",
		"hB"
	],
	"NG": [
		"H",
		"h",
		"hb",
		"hB"
	],
	"NI": [
		"h",
		"H",
		"hB",
		"hb"
	],
	"NL": ["H", "hB"],
	"NO": ["H", "h"],
	"NP": [
		"H",
		"h",
		"hB"
	],
	"NR": [
		"H",
		"h",
		"hb",
		"hB"
	],
	"NU": [
		"H",
		"h",
		"hb",
		"hB"
	],
	"NZ": [
		"h",
		"hb",
		"H",
		"hB"
	],
	"OM": [
		"h",
		"hB",
		"hb",
		"H"
	],
	"PA": [
		"h",
		"H",
		"hB",
		"hb"
	],
	"PE": [
		"h",
		"H",
		"hB",
		"hb"
	],
	"PF": [
		"H",
		"h",
		"hB"
	],
	"PG": ["h", "H"],
	"PH": [
		"h",
		"hB",
		"hb",
		"H"
	],
	"PK": [
		"h",
		"hB",
		"H"
	],
	"PL": ["H", "h"],
	"PM": ["H", "hB"],
	"PN": [
		"H",
		"h",
		"hb",
		"hB"
	],
	"PR": [
		"h",
		"H",
		"hB",
		"hb"
	],
	"PS": [
		"h",
		"hB",
		"hb",
		"H"
	],
	"PT": ["H", "hB"],
	"PW": ["h", "H"],
	"PY": [
		"h",
		"H",
		"hB",
		"hb"
	],
	"QA": [
		"h",
		"hB",
		"hb",
		"H"
	],
	"RE": ["H", "hB"],
	"RO": ["H", "hB"],
	"RS": [
		"H",
		"hB",
		"h"
	],
	"RU": ["H"],
	"RW": ["H", "h"],
	"SA": [
		"h",
		"hB",
		"hb",
		"H"
	],
	"SB": [
		"h",
		"hb",
		"H",
		"hB"
	],
	"SC": [
		"H",
		"h",
		"hB"
	],
	"SD": [
		"h",
		"hB",
		"hb",
		"H"
	],
	"SE": ["H"],
	"SG": [
		"h",
		"hb",
		"H",
		"hB"
	],
	"SH": [
		"H",
		"h",
		"hb",
		"hB"
	],
	"SI": ["H", "hB"],
	"SJ": ["H"],
	"SK": ["H"],
	"SL": [
		"h",
		"hb",
		"H",
		"hB"
	],
	"SM": [
		"H",
		"h",
		"hB"
	],
	"SN": [
		"H",
		"h",
		"hB"
	],
	"SO": ["h", "H"],
	"SR": ["H", "hB"],
	"SS": [
		"h",
		"hb",
		"H",
		"hB"
	],
	"ST": ["H", "hB"],
	"SV": [
		"h",
		"H",
		"hB",
		"hb"
	],
	"SX": [
		"H",
		"h",
		"hb",
		"hB"
	],
	"SY": [
		"h",
		"hB",
		"hb",
		"H"
	],
	"SZ": [
		"h",
		"hb",
		"H",
		"hB"
	],
	"TA": [
		"H",
		"h",
		"hb",
		"hB"
	],
	"TC": [
		"h",
		"hb",
		"H",
		"hB"
	],
	"TD": [
		"h",
		"H",
		"hB"
	],
	"TF": [
		"H",
		"h",
		"hB"
	],
	"TG": ["H", "hB"],
	"TH": ["H", "h"],
	"TJ": ["H", "h"],
	"TL": [
		"H",
		"hB",
		"hb",
		"h"
	],
	"TM": ["H", "h"],
	"TN": [
		"h",
		"hB",
		"hb",
		"H"
	],
	"TO": ["h", "H"],
	"TR": ["H", "hB"],
	"TT": [
		"h",
		"hb",
		"H",
		"hB"
	],
	"TW": [
		"hB",
		"hb",
		"h",
		"H"
	],
	"TZ": [
		"hB",
		"hb",
		"H",
		"h"
	],
	"UA": [
		"H",
		"hB",
		"h"
	],
	"UG": [
		"hB",
		"hb",
		"H",
		"h"
	],
	"UM": [
		"h",
		"hb",
		"H",
		"hB"
	],
	"US": [
		"h",
		"hb",
		"H",
		"hB"
	],
	"UY": [
		"h",
		"H",
		"hB",
		"hb"
	],
	"UZ": [
		"H",
		"hB",
		"h"
	],
	"VA": [
		"H",
		"h",
		"hB"
	],
	"VC": [
		"h",
		"hb",
		"H",
		"hB"
	],
	"VE": [
		"h",
		"H",
		"hB",
		"hb"
	],
	"VG": [
		"h",
		"hb",
		"H",
		"hB"
	],
	"VI": [
		"h",
		"hb",
		"H",
		"hB"
	],
	"VN": ["H", "h"],
	"VU": ["h", "H"],
	"WF": ["H", "hB"],
	"WS": ["h", "H"],
	"XK": [
		"H",
		"hB",
		"h"
	],
	"YE": [
		"h",
		"hB",
		"hb",
		"H"
	],
	"YT": ["H", "hB"],
	"ZA": [
		"H",
		"h",
		"hb",
		"hB"
	],
	"ZM": [
		"h",
		"hb",
		"H",
		"hB"
	],
	"ZW": ["H", "h"],
	"af-ZA": [
		"H",
		"h",
		"hB",
		"hb"
	],
	"ar-001": [
		"h",
		"hB",
		"hb",
		"H"
	],
	"ca-ES": [
		"H",
		"h",
		"hB"
	],
	"en-001": [
		"h",
		"hb",
		"H",
		"hB"
	],
	"en-HK": [
		"h",
		"hb",
		"H",
		"hB"
	],
	"en-IL": [
		"H",
		"h",
		"hb",
		"hB"
	],
	"en-MY": [
		"h",
		"hb",
		"H",
		"hB"
	],
	"es-BR": [
		"H",
		"h",
		"hB",
		"hb"
	],
	"es-ES": [
		"H",
		"h",
		"hB",
		"hb"
	],
	"es-GQ": [
		"H",
		"h",
		"hB",
		"hb"
	],
	"fr-CA": [
		"H",
		"h",
		"hB"
	],
	"gl-ES": [
		"H",
		"h",
		"hB"
	],
	"gu-IN": [
		"hB",
		"hb",
		"h",
		"H"
	],
	"hi-IN": [
		"hB",
		"h",
		"H"
	],
	"it-CH": [
		"H",
		"h",
		"hB"
	],
	"it-IT": [
		"H",
		"h",
		"hB"
	],
	"kn-IN": [
		"hB",
		"h",
		"H"
	],
	"ku-SY": ["H", "hB"],
	"ml-IN": [
		"hB",
		"h",
		"H"
	],
	"mr-IN": [
		"hB",
		"hb",
		"h",
		"H"
	],
	"pa-IN": [
		"hB",
		"hb",
		"h",
		"H"
	],
	"ta-IN": [
		"hB",
		"h",
		"hb",
		"H"
	],
	"te-IN": [
		"hB",
		"h",
		"H"
	],
	"zu-ZA": [
		"H",
		"hB",
		"hb",
		"h"
	]
};
/**
* Returns the best matching date time pattern if a date time skeleton
* pattern is provided with a locale. Follows the Unicode specification:
* https://www.unicode.org/reports/tr35/tr35-dates.html#table-mapping-requested-time-skeletons-to-patterns
* @param skeleton date time skeleton pattern that possibly includes j, J or C
* @param locale
*/
function getBestPattern(skeleton, locale) {
	let skeletonCopy = "";
	for (let patternPos = 0; patternPos < skeleton.length; patternPos++) {
		const patternChar = skeleton.charAt(patternPos);
		if (patternChar === "j") {
			let extraLength = 0;
			while (patternPos + 1 < skeleton.length && skeleton.charAt(patternPos + 1) === patternChar) {
				extraLength++;
				patternPos++;
			}
			let hourLen = 1 + (extraLength & 1);
			let dayPeriodLen = extraLength < 2 ? 1 : 3 + (extraLength >> 1);
			let dayPeriodChar = "a";
			let hourChar = getDefaultHourSymbolFromLocale(locale);
			if (hourChar == "H" || hourChar == "k") dayPeriodLen = 0;
			while (dayPeriodLen-- > 0) skeletonCopy += dayPeriodChar;
			while (hourLen-- > 0) skeletonCopy = hourChar + skeletonCopy;
		} else if (patternChar === "J") skeletonCopy += "H";
		else skeletonCopy += patternChar;
	}
	return skeletonCopy;
}
/**
* Maps the [hour cycle type](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/hourCycle)
* of the given `locale` to the corresponding time pattern.
* @param locale
*/
function getDefaultHourSymbolFromLocale(locale) {
	let hourCycle = locale.hourCycle;
	if (hourCycle === void 0 && locale.hourCycles && locale.hourCycles.length) hourCycle = locale.hourCycles[0];
	if (hourCycle) switch (hourCycle) {
		case "h24": return "k";
		case "h23": return "H";
		case "h12": return "h";
		case "h11": return "K";
		default: throw new Error("Invalid hourCycle");
	}
	const languageTag = locale.language;
	let regionTag;
	if (languageTag !== "root") regionTag = locale.maximize().region;
	return (timeData[regionTag || ""] || timeData[languageTag || ""] || timeData[`${languageTag}-001`] || timeData["001"])[0];
}
var SPACE_SEPARATOR_START_REGEX = new RegExp(`^${SPACE_SEPARATOR_REGEX.source}*`);
var SPACE_SEPARATOR_END_REGEX = new RegExp(`${SPACE_SEPARATOR_REGEX.source}*$`);
function createLocation(start, end) {
	return {
		start,
		end
	};
}
var hasNativeFromEntries = !!Object.fromEntries;
var hasTrimStart = !!String.prototype.trimStart;
var hasTrimEnd = !!String.prototype.trimEnd;
var fromEntries = hasNativeFromEntries ? Object.fromEntries : function fromEntries(entries) {
	const obj = {};
	for (const [k, v] of entries) obj[k] = v;
	return obj;
};
var trimStart = hasTrimStart ? function trimStart(s) {
	return s.trimStart();
} : function trimStart(s) {
	return s.replace(SPACE_SEPARATOR_START_REGEX, "");
};
var trimEnd = hasTrimEnd ? function trimEnd(s) {
	return s.trimEnd();
} : function trimEnd(s) {
	return s.replace(SPACE_SEPARATOR_END_REGEX, "");
};
var IDENTIFIER_PREFIX_RE = /* @__PURE__ */ new RegExp("([^\\p{White_Space}\\p{Pattern_Syntax}]*)", "yu");
function matchIdentifierAtIndex(s, index) {
	IDENTIFIER_PREFIX_RE.lastIndex = index;
	return IDENTIFIER_PREFIX_RE.exec(s)[1] ?? "";
}
function plainTopLevelEndPosition(message) {
	if (message.length === 0) return null;
	let line = 1;
	let column = 1;
	for (let offset = 0; offset < message.length;) {
		const code = message.charCodeAt(offset);
		switch (code) {
			case 35:
			case 39:
			case 60:
			case 123:
			case 125: return null;
		}
		if (code === 10) {
			line++;
			column = 1;
			offset++;
		} else {
			column++;
			if (code >= 55296 && code <= 56319 && offset + 1 < message.length) {
				const next = message.charCodeAt(offset + 1);
				offset += next >= 56320 && next <= 57343 ? 2 : 1;
			} else offset++;
		}
	}
	return {
		offset: message.length,
		line,
		column
	};
}
var Parser = class {
	constructor(message, options = {}) {
		this.message = message;
		this.position = {
			offset: 0,
			line: 1,
			column: 1
		};
		this.ignoreTag = !!options.ignoreTag;
		this.locale = options.locale;
		this.requiresOtherClause = !!options.requiresOtherClause;
		this.shouldParseSkeletons = !!options.shouldParseSkeletons;
	}
	parse() {
		if (this.offset() !== 0) throw Error("parser can only be used once");
		if (this.message.length > 0) {
			const firstCode = this.message.charCodeAt(0);
			if (firstCode !== 35 && firstCode !== 39 && firstCode !== 60 && firstCode !== 123 && firstCode !== 125) {
				const plainEndPosition = plainTopLevelEndPosition(this.message);
				if (plainEndPosition) {
					const start = this.clonePosition();
					this.position = plainEndPosition;
					return {
						val: [{
							type: 0,
							value: this.message,
							location: createLocation(start, this.clonePosition())
						}],
						err: null
					};
				}
			}
		}
		return this.parseMessage(0, "", false);
	}
	parseMessage(nestingLevel, parentArgType, expectingCloseTag) {
		let elements = [];
		while (!this.isEOF()) {
			const char = this.char();
			if (char === 123) {
				const result = this.parseArgument(nestingLevel, expectingCloseTag);
				if (result.err) return result;
				elements.push(result.val);
			} else if (char === 125 && nestingLevel > 0) break;
			else if (char === 35 && (parentArgType === "plural" || parentArgType === "selectordinal")) {
				const position = this.clonePosition();
				this.bump();
				elements.push({
					type: 7,
					location: createLocation(position, this.clonePosition())
				});
			} else if (char === 60 && !this.ignoreTag && this.peek() === 47) if (expectingCloseTag) break;
			else return this.error(26, createLocation(this.clonePosition(), this.clonePosition()));
			else if (char === 60 && !this.ignoreTag && _isAlpha(this.peek() || 0)) {
				const result = this.parseTag(nestingLevel, parentArgType);
				if (result.err) return result;
				elements.push(result.val);
			} else {
				const result = this.parseLiteral(nestingLevel, parentArgType);
				if (result.err) return result;
				elements.push(result.val);
			}
		}
		return {
			val: elements,
			err: null
		};
	}
	/**
	* A tag name must start with an ASCII lower/upper case letter. The grammar is based on the
	* [custom element name][] except that a dash is NOT always mandatory and uppercase letters
	* are accepted:
	*
	* ```
	* tag ::= "<" tagName (whitespace)* "/>" | "<" tagName (whitespace)* ">" message "</" tagName (whitespace)* ">"
	* tagName ::= [a-z] (PENChar)*
	* PENChar ::=
	*     "-" | "." | [0-9] | "_" | [a-z] | [A-Z] | #xB7 | [#xC0-#xD6] | [#xD8-#xF6] | [#xF8-#x37D] |
	*     [#x37F-#x1FFF] | [#x200C-#x200D] | [#x203F-#x2040] | [#x2070-#x218F] | [#x2C00-#x2FEF] |
	*     [#x3001-#xD7FF] | [#xF900-#xFDCF] | [#xFDF0-#xFFFD] | [#x10000-#xEFFFF]
	* ```
	*
	* [custom element name]: https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name
	* NOTE: We're a bit more lax here since HTML technically does not allow uppercase HTML element but we do
	* since other tag-based engines like React allow it
	*/
	parseTag(nestingLevel, parentArgType) {
		const startPosition = this.clonePosition();
		this.bump();
		const tagName = this.parseTagName();
		this.bumpSpace();
		if (this.bumpIf("/>")) return {
			val: {
				type: 0,
				value: `<${tagName}/>`,
				location: createLocation(startPosition, this.clonePosition())
			},
			err: null
		};
		else if (this.bumpIf(">")) {
			const childrenResult = this.parseMessage(nestingLevel + 1, parentArgType, true);
			if (childrenResult.err) return childrenResult;
			const children = childrenResult.val;
			const endTagStartPosition = this.clonePosition();
			if (this.bumpIf("</")) {
				if (this.isEOF() || !_isAlpha(this.char())) return this.error(23, createLocation(endTagStartPosition, this.clonePosition()));
				const closingTagNameStartPosition = this.clonePosition();
				if (tagName !== this.parseTagName()) return this.error(26, createLocation(closingTagNameStartPosition, this.clonePosition()));
				this.bumpSpace();
				if (!this.bumpIf(">")) return this.error(23, createLocation(endTagStartPosition, this.clonePosition()));
				return {
					val: {
						type: 8,
						value: tagName,
						children,
						location: createLocation(startPosition, this.clonePosition())
					},
					err: null
				};
			} else return this.error(27, createLocation(startPosition, this.clonePosition()));
		} else return this.error(23, createLocation(startPosition, this.clonePosition()));
	}
	/**
	* This method assumes that the caller has peeked ahead for the first tag character.
	*/
	parseTagName() {
		const startOffset = this.offset();
		this.bump();
		while (!this.isEOF() && _isPotentialElementNameChar(this.char())) this.bump();
		return this.message.slice(startOffset, this.offset());
	}
	parseLiteral(nestingLevel, parentArgType) {
		const start = this.clonePosition();
		let value = "";
		while (true) {
			const parseQuoteResult = this.tryParseQuote(parentArgType);
			if (parseQuoteResult) {
				value += parseQuoteResult;
				continue;
			}
			const parseUnquotedResult = this.tryParseUnquoted(nestingLevel, parentArgType);
			if (parseUnquotedResult) {
				value += parseUnquotedResult;
				continue;
			}
			const parseLeftAngleResult = this.tryParseLeftAngleBracket();
			if (parseLeftAngleResult) {
				value += parseLeftAngleResult;
				continue;
			}
			break;
		}
		const location = createLocation(start, this.clonePosition());
		return {
			val: {
				type: 0,
				value,
				location
			},
			err: null
		};
	}
	tryParseLeftAngleBracket() {
		if (!this.isEOF() && this.char() === 60 && (this.ignoreTag || !_isAlphaOrSlash(this.peek() || 0))) {
			this.bump();
			return "<";
		}
		return null;
	}
	/**
	* Starting with ICU 4.8, an ASCII apostrophe only starts quoted text if it immediately precedes
	* a character that requires quoting (that is, "only where needed"), and works the same in
	* nested messages as on the top level of the pattern. The new behavior is otherwise compatible.
	*/
	tryParseQuote(parentArgType) {
		if (this.isEOF() || this.char() !== 39) return null;
		switch (this.peek()) {
			case 39:
				this.bump();
				this.bump();
				return "'";
			case 123:
			case 60:
			case 62:
			case 125: break;
			case 35:
				if (parentArgType === "plural" || parentArgType === "selectordinal") break;
				return null;
			default: return null;
		}
		this.bump();
		const codePoints = [this.char()];
		this.bump();
		while (!this.isEOF()) {
			const ch = this.char();
			if (ch === 39) if (this.peek() === 39) {
				codePoints.push(39);
				this.bump();
			} else {
				this.bump();
				break;
			}
			else codePoints.push(ch);
			this.bump();
		}
		return String.fromCodePoint(...codePoints);
	}
	tryParseUnquoted(nestingLevel, parentArgType) {
		if (this.isEOF()) return null;
		const ch = this.char();
		if (ch === 60 || ch === 123 || ch === 35 && (parentArgType === "plural" || parentArgType === "selectordinal") || ch === 125 && nestingLevel > 0) return null;
		else {
			this.bump();
			return String.fromCodePoint(ch);
		}
	}
	parseArgument(nestingLevel, expectingCloseTag) {
		const openingBracePosition = this.clonePosition();
		this.bump();
		this.bumpSpace();
		if (this.isEOF()) return this.error(1, createLocation(openingBracePosition, this.clonePosition()));
		if (this.char() === 125) {
			this.bump();
			return this.error(2, createLocation(openingBracePosition, this.clonePosition()));
		}
		let value = this.parseIdentifierIfPossible().value;
		if (!value) return this.error(3, createLocation(openingBracePosition, this.clonePosition()));
		this.bumpSpace();
		if (this.isEOF()) return this.error(1, createLocation(openingBracePosition, this.clonePosition()));
		switch (this.char()) {
			case 125:
				this.bump();
				return {
					val: {
						type: 1,
						value,
						location: createLocation(openingBracePosition, this.clonePosition())
					},
					err: null
				};
			case 44:
				this.bump();
				this.bumpSpace();
				if (this.isEOF()) return this.error(1, createLocation(openingBracePosition, this.clonePosition()));
				return this.parseArgumentOptions(nestingLevel, expectingCloseTag, value, openingBracePosition);
			default: return this.error(3, createLocation(openingBracePosition, this.clonePosition()));
		}
	}
	/**
	* Advance the parser until the end of the identifier, if it is currently on
	* an identifier character. Return an empty string otherwise.
	*/
	parseIdentifierIfPossible() {
		const startingPosition = this.clonePosition();
		const startOffset = this.offset();
		const value = matchIdentifierAtIndex(this.message, startOffset);
		const endOffset = startOffset + value.length;
		this.bumpTo(endOffset);
		return {
			value,
			location: createLocation(startingPosition, this.clonePosition())
		};
	}
	parseArgumentOptions(nestingLevel, expectingCloseTag, value, openingBracePosition) {
		let typeStartPosition = this.clonePosition();
		let argType = this.parseIdentifierIfPossible().value;
		let typeEndPosition = this.clonePosition();
		switch (argType) {
			case "": return this.error(4, createLocation(typeStartPosition, typeEndPosition));
			case "number":
			case "date":
			case "time": {
				this.bumpSpace();
				let styleAndLocation = null;
				if (this.bumpIf(",")) {
					this.bumpSpace();
					const styleStartPosition = this.clonePosition();
					const result = this.parseSimpleArgStyleIfPossible();
					if (result.err) return result;
					const style = trimEnd(result.val);
					if (style.length === 0) return this.error(6, createLocation(this.clonePosition(), this.clonePosition()));
					styleAndLocation = {
						style,
						styleLocation: createLocation(styleStartPosition, this.clonePosition())
					};
				}
				const argCloseResult = this.tryParseArgumentClose(openingBracePosition);
				if (argCloseResult.err) return argCloseResult;
				const location = createLocation(openingBracePosition, this.clonePosition());
				if (styleAndLocation && styleAndLocation.style.startsWith("::")) {
					let skeleton = trimStart(styleAndLocation.style.slice(2));
					if (argType === "number") {
						const result = this.parseNumberSkeletonFromString(skeleton, styleAndLocation.styleLocation);
						if (result.err) return result;
						return {
							val: {
								type: 2,
								value,
								location,
								style: result.val
							},
							err: null
						};
					} else {
						if (skeleton.length === 0) return this.error(10, location);
						let dateTimePattern = skeleton;
						if (this.locale) dateTimePattern = getBestPattern(skeleton, this.locale);
						const style = {
							type: 1,
							pattern: dateTimePattern,
							location: styleAndLocation.styleLocation,
							parsedOptions: this.shouldParseSkeletons ? parseDateTimeSkeleton(dateTimePattern) : {}
						};
						return {
							val: {
								type: argType === "date" ? 3 : 4,
								value,
								location,
								style
							},
							err: null
						};
					}
				}
				return {
					val: {
						type: argType === "number" ? 2 : argType === "date" ? 3 : 4,
						value,
						location,
						style: styleAndLocation?.style ?? null
					},
					err: null
				};
			}
			case "plural":
			case "selectordinal":
			case "select": {
				const typeEndPosition = this.clonePosition();
				this.bumpSpace();
				if (!this.bumpIf(",")) return this.error(12, createLocation(typeEndPosition, { ...typeEndPosition }));
				this.bumpSpace();
				let identifierAndLocation = this.parseIdentifierIfPossible();
				let pluralOffset = 0;
				if (argType !== "select" && identifierAndLocation.value === "offset") {
					if (!this.bumpIf(":")) return this.error(13, createLocation(this.clonePosition(), this.clonePosition()));
					this.bumpSpace();
					const result = this.tryParseDecimalInteger(13, 14);
					if (result.err) return result;
					this.bumpSpace();
					identifierAndLocation = this.parseIdentifierIfPossible();
					pluralOffset = result.val;
				}
				const optionsResult = this.tryParsePluralOrSelectOptions(nestingLevel, argType, expectingCloseTag, identifierAndLocation);
				if (optionsResult.err) return optionsResult;
				const argCloseResult = this.tryParseArgumentClose(openingBracePosition);
				if (argCloseResult.err) return argCloseResult;
				const location = createLocation(openingBracePosition, this.clonePosition());
				if (argType === "select") return {
					val: {
						type: 5,
						value,
						options: fromEntries(optionsResult.val),
						location
					},
					err: null
				};
				else return {
					val: {
						type: 6,
						value,
						options: fromEntries(optionsResult.val),
						offset: pluralOffset,
						pluralType: argType === "plural" ? "cardinal" : "ordinal",
						location
					},
					err: null
				};
			}
			default: return this.error(5, createLocation(typeStartPosition, typeEndPosition));
		}
	}
	tryParseArgumentClose(openingBracePosition) {
		if (this.isEOF() || this.char() !== 125) return this.error(1, createLocation(openingBracePosition, this.clonePosition()));
		this.bump();
		return {
			val: true,
			err: null
		};
	}
	/**
	* See: https://github.com/unicode-org/icu/blob/af7ed1f6d2298013dc303628438ec4abe1f16479/icu4c/source/common/messagepattern.cpp#L659
	*/
	parseSimpleArgStyleIfPossible() {
		let nestedBraces = 0;
		const startPosition = this.clonePosition();
		while (!this.isEOF()) switch (this.char()) {
			case 39: {
				this.bump();
				let apostrophePosition = this.clonePosition();
				if (!this.bumpUntil("'")) return this.error(11, createLocation(apostrophePosition, this.clonePosition()));
				this.bump();
				break;
			}
			case 123:
				nestedBraces += 1;
				this.bump();
				break;
			case 125:
				if (nestedBraces > 0) nestedBraces -= 1;
				else return {
					val: this.message.slice(startPosition.offset, this.offset()),
					err: null
				};
				break;
			default:
				this.bump();
				break;
		}
		return {
			val: this.message.slice(startPosition.offset, this.offset()),
			err: null
		};
	}
	parseNumberSkeletonFromString(skeleton, location) {
		let tokens = [];
		try {
			tokens = parseNumberSkeletonFromString(skeleton);
		} catch {
			return this.error(7, location);
		}
		return {
			val: {
				type: 0,
				tokens,
				location,
				parsedOptions: this.shouldParseSkeletons ? parseNumberSkeleton(tokens) : {}
			},
			err: null
		};
	}
	/**
	* @param nesting_level The current nesting level of messages.
	*     This can be positive when parsing message fragment in select or plural argument options.
	* @param parent_arg_type The parent argument's type.
	* @param parsed_first_identifier If provided, this is the first identifier-like selector of
	*     the argument. It is a by-product of a previous parsing attempt.
	* @param expecting_close_tag If true, this message is directly or indirectly nested inside
	*     between a pair of opening and closing tags. The nested message will not parse beyond
	*     the closing tag boundary.
	*/
	tryParsePluralOrSelectOptions(nestingLevel, parentArgType, expectCloseTag, parsedFirstIdentifier) {
		let hasOtherClause = false;
		const options = [];
		const parsedSelectors = /* @__PURE__ */ new Set();
		let { value: selector, location: selectorLocation } = parsedFirstIdentifier;
		while (true) {
			if (selector.length === 0) {
				const startPosition = this.clonePosition();
				if (parentArgType !== "select" && this.bumpIf("=")) {
					const result = this.tryParseDecimalInteger(16, 19);
					if (result.err) return result;
					selectorLocation = createLocation(startPosition, this.clonePosition());
					selector = this.message.slice(startPosition.offset, this.offset());
				} else break;
			}
			if (parsedSelectors.has(selector)) return this.error(parentArgType === "select" ? 21 : 20, selectorLocation);
			if (selector === "other") hasOtherClause = true;
			this.bumpSpace();
			const openingBracePosition = this.clonePosition();
			if (!this.bumpIf("{")) return this.error(parentArgType === "select" ? 17 : 18, createLocation(this.clonePosition(), this.clonePosition()));
			const fragmentResult = this.parseMessage(nestingLevel + 1, parentArgType, expectCloseTag);
			if (fragmentResult.err) return fragmentResult;
			const argCloseResult = this.tryParseArgumentClose(openingBracePosition);
			if (argCloseResult.err) return argCloseResult;
			options.push([selector, {
				value: fragmentResult.val,
				location: createLocation(openingBracePosition, this.clonePosition())
			}]);
			parsedSelectors.add(selector);
			this.bumpSpace();
			({value: selector, location: selectorLocation} = this.parseIdentifierIfPossible());
		}
		if (options.length === 0) return this.error(parentArgType === "select" ? 15 : 16, createLocation(this.clonePosition(), this.clonePosition()));
		if (this.requiresOtherClause && !hasOtherClause) return this.error(22, createLocation(this.clonePosition(), this.clonePosition()));
		return {
			val: options,
			err: null
		};
	}
	tryParseDecimalInteger(expectNumberError, invalidNumberError) {
		let sign = 1;
		const startingPosition = this.clonePosition();
		if (this.bumpIf("+")) {} else if (this.bumpIf("-")) sign = -1;
		let hasDigits = false;
		let decimal = 0;
		while (!this.isEOF()) {
			const ch = this.char();
			if (ch >= 48 && ch <= 57) {
				hasDigits = true;
				decimal = decimal * 10 + (ch - 48);
				this.bump();
			} else break;
		}
		const location = createLocation(startingPosition, this.clonePosition());
		if (!hasDigits) return this.error(expectNumberError, location);
		decimal *= sign;
		if (!Number.isSafeInteger(decimal)) return this.error(invalidNumberError, location);
		return {
			val: decimal,
			err: null
		};
	}
	offset() {
		return this.position.offset;
	}
	isEOF() {
		return this.offset() === this.message.length;
	}
	clonePosition() {
		return {
			offset: this.position.offset,
			line: this.position.line,
			column: this.position.column
		};
	}
	/**
	* Return the code point at the current position of the parser.
	* Throws if the index is out of bound.
	*/
	char() {
		const offset = this.position.offset;
		if (offset >= this.message.length) throw Error("out of bound");
		const code = this.message.codePointAt(offset);
		if (code === void 0) throw Error(`Offset ${offset} is at invalid UTF-16 code unit boundary`);
		return code;
	}
	error(kind, location) {
		return {
			val: null,
			err: {
				kind,
				message: this.message,
				location
			}
		};
	}
	/** Bump the parser to the next UTF-16 code unit. */
	bump() {
		if (this.isEOF()) return;
		const code = this.char();
		if (code === 10) {
			this.position.line += 1;
			this.position.column = 1;
			this.position.offset += 1;
		} else {
			this.position.column += 1;
			this.position.offset += code < 65536 ? 1 : 2;
		}
	}
	/**
	* If the substring starting at the current position of the parser has
	* the given prefix, then bump the parser to the character immediately
	* following the prefix and return true. Otherwise, don't bump the parser
	* and return false.
	*/
	bumpIf(prefix) {
		if (this.message.startsWith(prefix, this.offset())) {
			for (let i = 0; i < prefix.length; i++) this.bump();
			return true;
		}
		return false;
	}
	/**
	* Bump the parser until the pattern character is found and return `true`.
	* Otherwise bump to the end of the file and return `false`.
	*/
	bumpUntil(pattern) {
		const currentOffset = this.offset();
		const index = this.message.indexOf(pattern, currentOffset);
		if (index >= 0) {
			this.bumpTo(index);
			return true;
		} else {
			this.bumpTo(this.message.length);
			return false;
		}
	}
	/**
	* Bump the parser to the target offset.
	* If target offset is beyond the end of the input, bump the parser to the end of the input.
	*/
	bumpTo(targetOffset) {
		if (this.offset() > targetOffset) throw Error(`targetOffset ${targetOffset} must be greater than or equal to the current offset ${this.offset()}`);
		targetOffset = Math.min(targetOffset, this.message.length);
		while (true) {
			const offset = this.offset();
			if (offset === targetOffset) break;
			if (offset > targetOffset) throw Error(`targetOffset ${targetOffset} is at invalid UTF-16 code unit boundary`);
			this.bump();
			if (this.isEOF()) break;
		}
	}
	/** advance the parser through all whitespace to the next non-whitespace code unit. */
	bumpSpace() {
		while (!this.isEOF() && _isWhiteSpace(this.char())) this.bump();
	}
	/**
	* Peek at the *next* Unicode codepoint in the input without advancing the parser.
	* If the input has been exhausted, then this returns null.
	*/
	peek() {
		if (this.isEOF()) return null;
		const code = this.char();
		const offset = this.offset();
		return this.message.charCodeAt(offset + (code >= 65536 ? 2 : 1)) ?? null;
	}
};
/**
* This check if codepoint is alphabet (lower & uppercase)
* @param codepoint
* @returns
*/
function _isAlpha(codepoint) {
	return codepoint >= 97 && codepoint <= 122 || codepoint >= 65 && codepoint <= 90;
}
function _isAlphaOrSlash(codepoint) {
	return _isAlpha(codepoint) || codepoint === 47;
}
/** See `parseTag` function docs. */
function _isPotentialElementNameChar(c) {
	return c === 45 || c === 46 || c >= 48 && c <= 57 || c === 95 || c >= 97 && c <= 122 || c >= 65 && c <= 90 || c == 183 || c >= 192 && c <= 214 || c >= 216 && c <= 246 || c >= 248 && c <= 893 || c >= 895 && c <= 8191 || c >= 8204 && c <= 8205 || c >= 8255 && c <= 8256 || c >= 8304 && c <= 8591 || c >= 11264 && c <= 12271 || c >= 12289 && c <= 55295 || c >= 63744 && c <= 64975 || c >= 65008 && c <= 65533 || c >= 65536 && c <= 983039;
}
/**
* Code point equivalent of regex `\p{White_Space}`.
* From: https://www.unicode.org/Public/UCD/latest/ucd/PropList.txt
*/
function _isWhiteSpace(c) {
	return c >= 9 && c <= 13 || c === 32 || c === 133 || c >= 8206 && c <= 8207 || c === 8232 || c === 8233;
}
function pruneLocation(els) {
	els.forEach((el) => {
		delete el.location;
		if (isSelectElement(el) || isPluralElement(el)) for (const k in el.options) {
			delete el.options[k].location;
			pruneLocation(el.options[k].value);
		}
		else if (isNumberElement(el) && isNumberSkeleton(el.style)) delete el.style.location;
		else if ((isDateElement(el) || isTimeElement(el)) && isDateTimeSkeleton(el.style)) delete el.style.location;
		else if (isTagElement(el)) pruneLocation(el.children);
	});
}
function parse(message, opts = {}) {
	opts = {
		shouldParseSkeletons: true,
		requiresOtherClause: true,
		...opts
	};
	const result = new Parser(message, opts).parse();
	if (result.err) {
		const error = SyntaxError(ErrorKind[result.err.kind]);
		error.location = result.err.location;
		error.originalMessage = result.err.message;
		throw error;
	}
	if (!opts?.captureLocation) pruneLocation(result.val);
	return result.val;
}
//#endregion
//#region node_modules/intl-messageformat/index.js
var FormatError = class extends Error {
	constructor(msg, code, originalMessage) {
		super(msg);
		this.code = code;
		this.originalMessage = originalMessage;
	}
	toString() {
		return `[formatjs Error: ${this.code}] ${this.message}`;
	}
};
var InvalidValueError = class extends FormatError {
	constructor(variableId, value, options, originalMessage) {
		super(`Invalid values for "${variableId}": "${value}". Options are "${Object.keys(options).join("\", \"")}"`, "INVALID_VALUE", originalMessage);
	}
};
var InvalidValueTypeError = class extends FormatError {
	constructor(value, type, originalMessage) {
		super(`Value for "${value}" must be of type ${type}`, "INVALID_VALUE", originalMessage);
	}
};
var MissingValueError = class extends FormatError {
	constructor(variableId, originalMessage) {
		super(`The intl string context variable "${variableId}" was not provided to the string "${originalMessage}"`, "MISSING_VALUE", originalMessage);
	}
};
function mergeLiteral(parts) {
	if (parts.length < 2) return parts;
	return parts.reduce((all, part) => {
		const lastPart = all[all.length - 1];
		if (!lastPart || lastPart.type !== 0 || part.type !== 0) all.push(part);
		else lastPart.value += part.value;
		return all;
	}, []);
}
function isFormatXMLElementFn(el) {
	return typeof el === "function";
}
function formatToParts(els, locales, formatters, formats, values, currentPluralValue, originalMessage) {
	if (els.length === 1 && isLiteralElement(els[0])) return [{
		type: 0,
		value: els[0].value
	}];
	const result = [];
	for (const el of els) {
		if (isLiteralElement(el)) {
			result.push({
				type: 0,
				value: el.value
			});
			continue;
		}
		if (isPoundElement(el)) {
			if (typeof currentPluralValue === "number") result.push({
				type: 0,
				value: formatters.getNumberFormat(locales).format(currentPluralValue)
			});
			continue;
		}
		const { value: varName } = el;
		if (!(values && varName in values)) throw new MissingValueError(varName, originalMessage);
		let value = values[varName];
		if (isArgumentElement(el)) {
			if (!value || typeof value === "string" || typeof value === "number" || typeof value === "bigint") value = typeof value === "string" || typeof value === "number" || typeof value === "bigint" ? String(value) : "";
			result.push({
				type: typeof value === "string" ? 0 : 1,
				value
			});
			continue;
		}
		if (isDateElement(el)) {
			const style = typeof el.style === "string" ? formats.date[el.style] : isDateTimeSkeleton(el.style) ? el.style.parsedOptions : void 0;
			result.push({
				type: 0,
				value: formatters.getDateTimeFormat(locales, style).format(value)
			});
			continue;
		}
		if (isTimeElement(el)) {
			const style = typeof el.style === "string" ? formats.time[el.style] : isDateTimeSkeleton(el.style) ? el.style.parsedOptions : formats.time.medium;
			result.push({
				type: 0,
				value: formatters.getDateTimeFormat(locales, style).format(value)
			});
			continue;
		}
		if (isNumberElement(el)) {
			const style = typeof el.style === "string" ? formats.number[el.style] : isNumberSkeleton(el.style) ? el.style.parsedOptions : void 0;
			if (style && style.scale) {
				const scale = style.scale || 1;
				if (typeof value === "bigint") {
					if (!Number.isInteger(scale)) throw new TypeError(`Cannot apply fractional scale ${scale} to bigint value. Scale must be an integer when formatting bigint.`);
					value = value * BigInt(scale);
				} else value = value * scale;
			}
			result.push({
				type: 0,
				value: formatters.getNumberFormat(locales, style).format(value)
			});
			continue;
		}
		if (isTagElement(el)) {
			const { children, value } = el;
			const formatFn = values[value];
			if (!isFormatXMLElementFn(formatFn)) throw new InvalidValueTypeError(value, "function", originalMessage);
			let chunks = formatFn(formatToParts(children, locales, formatters, formats, values, currentPluralValue).map((p) => p.value));
			if (!Array.isArray(chunks)) chunks = [chunks];
			result.push(...chunks.map((c) => {
				return {
					type: typeof c === "string" ? 0 : 1,
					value: c
				};
			}));
		}
		if (isSelectElement(el)) {
			const key = value;
			const opt = (Object.prototype.hasOwnProperty.call(el.options, key) ? el.options[key] : void 0) || el.options.other;
			if (!opt) throw new InvalidValueError(el.value, value, Object.keys(el.options), originalMessage);
			result.push(...formatToParts(opt.value, locales, formatters, formats, values));
			continue;
		}
		if (isPluralElement(el)) {
			const exactKey = `=${value}`;
			let opt = Object.prototype.hasOwnProperty.call(el.options, exactKey) ? el.options[exactKey] : void 0;
			if (!opt) {
				if (!Intl.PluralRules) throw new FormatError(`Intl.PluralRules is not available in this environment.
Try polyfilling it using "@formatjs/intl-pluralrules"
`, "MISSING_INTL_API", originalMessage);
				const numericValue = typeof value === "bigint" ? Number(value) : value;
				const rule = formatters.getPluralRules(locales, { type: el.pluralType }).select(numericValue - (el.offset || 0));
				opt = (Object.prototype.hasOwnProperty.call(el.options, rule) ? el.options[rule] : void 0) || el.options.other;
			}
			if (!opt) throw new InvalidValueError(el.value, value, Object.keys(el.options), originalMessage);
			const numericValue = typeof value === "bigint" ? Number(value) : value;
			result.push(...formatToParts(opt.value, locales, formatters, formats, values, numericValue - (el.offset || 0)));
			continue;
		}
	}
	return mergeLiteral(result);
}
function mergeConfig(c1, c2) {
	if (!c2) return c1;
	return {
		...c1,
		...c2,
		...Object.keys(c1).reduce((all, k) => {
			all[k] = {
				...c1[k],
				...c2[k]
			};
			return all;
		}, {})
	};
}
function mergeConfigs(defaultConfig, configs) {
	if (!configs) return defaultConfig;
	return Object.keys(defaultConfig).reduce((all, k) => {
		all[k] = mergeConfig(defaultConfig[k], configs[k]);
		return all;
	}, { ...defaultConfig });
}
function createFastMemoizeCache(store) {
	return { create() {
		return {
			get(key) {
				return store[key];
			},
			set(key, value) {
				store[key] = value;
			}
		};
	} };
}
function createDefaultFormatters(cache = {
	number: {},
	dateTime: {},
	pluralRules: {}
}) {
	return {
		getNumberFormat: memoize((...args) => new Intl.NumberFormat(...args), {
			cache: createFastMemoizeCache(cache.number),
			strategy: strategies.variadic
		}),
		getDateTimeFormat: memoize((...args) => new Intl.DateTimeFormat(...args), {
			cache: createFastMemoizeCache(cache.dateTime),
			strategy: strategies.variadic
		}),
		getPluralRules: memoize((...args) => new Intl.PluralRules(...args), {
			cache: createFastMemoizeCache(cache.pluralRules),
			strategy: strategies.variadic
		})
	};
}
var intl_messageformat_default = class IntlMessageFormat {
	constructor(message, locales = IntlMessageFormat.defaultLocale, overrideFormats, opts) {
		this.formatterCache = {
			number: {},
			dateTime: {},
			pluralRules: {}
		};
		this.format = (values) => {
			const parts = this.formatToParts(values);
			if (parts.length === 1) return parts[0].value;
			const result = parts.reduce((all, part) => {
				if (!all.length || part.type !== 0 || typeof all[all.length - 1] !== "string") all.push(part.value);
				else all[all.length - 1] += part.value;
				return all;
			}, []);
			if (result.length <= 1) return result[0] || "";
			return result;
		};
		this.formatToParts = (values) => formatToParts(this.ast, this.locales, this.formatters, this.formats, values, void 0, this.message);
		this.resolvedOptions = () => ({ locale: this.resolvedLocale?.toString() || Intl.NumberFormat.supportedLocalesOf(this.locales)[0] });
		this.getAst = () => this.ast;
		this.locales = locales;
		this.resolvedLocale = IntlMessageFormat.resolveLocale(locales);
		if (typeof message === "string") {
			this.message = message;
			if (!IntlMessageFormat.__parse) throw new TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");
			const { ...parseOpts } = opts || {};
			this.ast = IntlMessageFormat.__parse(message, {
				...parseOpts,
				locale: this.resolvedLocale
			});
		} else this.ast = message;
		if (!Array.isArray(this.ast)) throw new TypeError("A message must be provided as a String or AST.");
		this.formats = mergeConfigs(IntlMessageFormat.formats, overrideFormats);
		this.formatters = opts && opts.formatters || createDefaultFormatters(this.formatterCache);
	}
	static {
		this.memoizedDefaultLocale = null;
	}
	static get defaultLocale() {
		if (!IntlMessageFormat.memoizedDefaultLocale) IntlMessageFormat.memoizedDefaultLocale = new Intl.NumberFormat().resolvedOptions().locale;
		return IntlMessageFormat.memoizedDefaultLocale;
	}
	static {
		this.resolveLocale = (locales) => {
			if (typeof Intl.Locale === "undefined") return;
			const supportedLocales = Intl.NumberFormat.supportedLocalesOf(locales);
			if (supportedLocales.length > 0) return new Intl.Locale(supportedLocales[0]);
			return new Intl.Locale(typeof locales === "string" ? locales : locales[0]);
		};
	}
	static {
		this.__parse = parse;
	}
	static {
		this.formats = {
			number: {
				integer: { maximumFractionDigits: 0 },
				currency: { style: "currency" },
				percent: { style: "percent" }
			},
			date: {
				short: {
					month: "numeric",
					day: "numeric",
					year: "2-digit"
				},
				medium: {
					month: "short",
					day: "numeric",
					year: "numeric"
				},
				long: {
					month: "long",
					day: "numeric",
					year: "numeric"
				},
				full: {
					weekday: "long",
					month: "long",
					day: "numeric",
					year: "numeric"
				}
			},
			time: {
				short: {
					hour: "numeric",
					minute: "numeric"
				},
				medium: {
					hour: "numeric",
					minute: "numeric",
					second: "numeric"
				},
				long: {
					hour: "numeric",
					minute: "numeric",
					second: "numeric",
					timeZoneName: "short"
				},
				full: {
					hour: "numeric",
					minute: "numeric",
					second: "numeric",
					timeZoneName: "short"
				}
			}
		};
	}
};
//#endregion
//#region node_modules/@astryxdesign/core/dist/i18n/resolve.js
/**
* @file resolve.ts
* @input Key + values + locale + catalog + overrides
* @output Formatted message string
* @position Shared lookup + ICU formatting core, used by useTranslator().
*
* Lookup order:
*   1. Per-locale override for the exact locale
*   2. Per-locale override for a parent locale (pt-BR → pt)
*   3. Shipped catalog entry for the exact locale
*   4. Shipped catalog entry for a parent locale (pt-BR → pt)
*   5. Shipped en catalog (the source of truth, always present)
*   6. The key itself (dev-visible fallback, warns once)
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/i18n/useTranslator.ts
* - /packages/core/src/i18n/__tests__/resolve.test.ts
*/
var EN_CATALOG = {
	"@astryx.pagination.label": {
		"defaultMessage": "Pagination",
		"description": "Aria label for the pagination navigation region."
	},
	"@astryx.pagination.previous": {
		"defaultMessage": "Go to previous page",
		"description": "Aria label for the previous-page button."
	},
	"@astryx.pagination.next": {
		"defaultMessage": "Go to next page",
		"description": "Aria label for the next-page button."
	},
	"@astryx.pagination.previousBy": {
		"defaultMessage": "Go back {step, number} {step, plural, one {page} other {pages}}",
		"description": "Aria label for the previous button when it advances more than one page per click (the `step` prop > 1). `step` is the number of pages skipped."
	},
	"@astryx.pagination.nextBy": {
		"defaultMessage": "Go forward {step, number} {step, plural, one {page} other {pages}}",
		"description": "Aria label for the next button when it advances more than one page per click (the `step` prop > 1). `step` is the number of pages skipped."
	},
	"@astryx.pagination.first": {
		"defaultMessage": "Go to first page",
		"description": "Aria label for the first-page button (« double chevron) in the input pagination variant."
	},
	"@astryx.pagination.last": {
		"defaultMessage": "Go to last page",
		"description": "Aria label for the last-page button (» double chevron) in the input pagination variant."
	},
	"@astryx.pagination.goToPage": {
		"defaultMessage": "Go to page {page, number}",
		"description": "Aria label for an individual page-number button. `page` is 1-based."
	},
	"@astryx.pagination.goToPageInput": {
		"defaultMessage": "Go to page",
		"description": "Aria label for the editable page/row number box in the input pagination variant. No number — the box holds the value itself."
	},
	"@astryx.pagination.pageLabel": {
		"defaultMessage": "Page",
		"description": "Visible label before the editable box in the input pagination variant. Example: \"Page [ 1 ] / 10\"."
	},
	"@astryx.pagination.ofTotalPages": {
		"defaultMessage": "/ {total, number}",
		"description": "Visible total shown after the editable box in the input pagination variant. Example: the \"/ 10\" in \"Page [ 1 ] / 10\"."
	},
	"@astryx.pagination.pageIndicators": {
		"defaultMessage": "Page indicators",
		"description": "Aria label for the dots-variant page-indicator group."
	},
	"@astryx.pagination.itemsPerPage": {
		"defaultMessage": "Items per page",
		"description": "Label for the page-size selector."
	},
	"@astryx.pagination.count": {
		"defaultMessage": "{from, number}–{to, number} of {total, number}",
		"description": "Visible range-of-total text on a pagination bar. Example: \"1–20 of 347\"; the en-dash is translator's choice."
	},
	"@astryx.pagination.pageOfTotal": {
		"defaultMessage": "Page {current, number} of {total, number}",
		"description": "Visible \"Page X of Y\" text on the compact pagination variant; also announced by screen readers. Keep short — sits in a compact toolbar."
	},
	"@astryx.pagination.pageAnnounce": {
		"defaultMessage": "Page {current, number}",
		"description": "Screen-reader announcement when a page changes and total is unknown."
	},
	"@astryx.powersearch.editor.field": {
		"defaultMessage": "Field",
		"description": "Noun form-label above the field-picker dropdown in the PowerSearch filter-builder popover (which data column to filter on). Not an action."
	},
	"@astryx.powersearch.editor.operator": {
		"defaultMessage": "Operator",
		"description": "Noun form-label above the operator dropdown in the PowerSearch filter-builder popover. Refers to a comparison verb (\"is\", \"contains\"), not a math or phone operator."
	},
	"@astryx.powersearch.editor.addFilter": {
		"defaultMessage": "+ Add filter",
		"description": "Button label inside a group in the PowerSearch filter-builder; adds another filter row (e.g. \"Status = Active\"). The leading \"+ \" is a plus-sign character."
	},
	"@astryx.powersearch.editor.removeFilter": {
		"defaultMessage": "Remove filter",
		"description": "Screen-reader-only label on the \"×\" icon button next to a filter row in the PowerSearch editor; removes that row. Imperative verb."
	},
	"@astryx.powersearch.editor.groupOperator": {
		"defaultMessage": "Group operator",
		"description": "Screen-reader-only label for the AND/OR toggle that combines sibling filters inside a filter group. Sighted users see just \"AND\" or \"OR\"."
	},
	"@astryx.powersearch.editor.group": {
		"defaultMessage": "Group",
		"description": "Fallback noun label shown on a nested filter-group chip when no AND/OR combining operator has been chosen. Use the noun (\"a cluster\"), not the verb \"to group\"."
	},
	"@astryx.powersearch.editor.delete": {
		"defaultMessage": "Delete",
		"description": "Button label inside the PowerSearch filter-editor popover; deletes the currently-edited filter row. Imperative verb form."
	},
	"@astryx.powersearch.editor.cancel": {
		"defaultMessage": "Cancel",
		"description": "Button label inside the PowerSearch filter-editor popover; closes the popover and discards pending edits. Imperative verb form."
	},
	"@astryx.powersearch.editor.apply": {
		"defaultMessage": "Apply",
		"description": "Primary button label inside the PowerSearch filter-editor popover; confirms the edited filter. Imperative verb; consumers may override to \"Save\"."
	},
	"@astryx.powersearch.valueEditor.value": {
		"defaultMessage": "Value",
		"description": "Noun form-label above a single free-text/number input in the PowerSearch value editor (e.g. the \"acme\" in `Name contains acme`). Not a verb or \"worth\"."
	},
	"@astryx.powersearch.valueEditor.values": {
		"defaultMessage": "Values",
		"description": "Plural noun form-label above a multi-value chip input in the PowerSearch value editor. Should match its singular counterpart `Value` in your language."
	},
	"@astryx.powersearch.valueEditor.time": {
		"defaultMessage": "Time",
		"description": "Noun form-label above a time-of-day (HH:MM) picker in the PowerSearch value editor. Clock time, not duration or era."
	},
	"@astryx.powersearch.valueEditor.date": {
		"defaultMessage": "Date",
		"description": "Noun form-label above a calendar-date picker in the PowerSearch value editor. Calendar date, not romantic date or fruit."
	},
	"@astryx.powersearch.valueEditor.relativeDate": {
		"defaultMessage": "Relative date",
		"description": "Label for the relative-date selector (e.g. \"Last 7 days\") in the PowerSearch value editor."
	},
	"@astryx.powersearch.valueEditor.startDate": {
		"defaultMessage": "Start date",
		"description": "Noun form-label above the start-of-range date picker in the PowerSearch value editor. Pairs with `End date` — keep the two parallel in your language."
	},
	"@astryx.powersearch.valueEditor.endDate": {
		"defaultMessage": "End date",
		"description": "Noun form-label above the end-of-range date picker in the PowerSearch value editor. Pairs with `Start date` — keep the two parallel."
	},
	"@astryx.powersearch.valueEditor.entities": {
		"defaultMessage": "Entities",
		"description": "\"Entities\" is jargon — plural noun form-label above an entity picker (people, teams, projects). Prefer a natural collective like \"items\" if your language has no equivalent."
	},
	"@astryx.powersearch.valueEditor.searchPlaceholder": {
		"defaultMessage": "Search…",
		"description": "Placeholder inside the search input in the PowerSearch entity/typeahead picker. Imperative verb; trailing `…` is one character."
	},
	"@astryx.powersearch.valueEditor.enterValuePlaceholder": {
		"defaultMessage": "Enter value…",
		"description": "Placeholder inside a free-text single-value input in the PowerSearch value editor. Imperative verb; trailing `…` is one character."
	},
	"@astryx.powersearch.valueEditor.addValuesPlaceholder": {
		"defaultMessage": "Add values…",
		"description": "Placeholder inside a multi-value chip input where the user types items and presses Enter to add each as a chip. Imperative verb; trailing `…` is one character."
	},
	"@astryx.powersearch.valueEditor.enterNumberPlaceholder": {
		"defaultMessage": "Enter number…",
		"description": "Placeholder inside a numeric input in the PowerSearch value editor. Imperative verb; trailing `…` is one character."
	},
	"@astryx.powersearch.valueEditor.selectValuesPlaceholder": {
		"defaultMessage": "Select values…",
		"description": "Placeholder on a dropdown for choosing values from a fixed enum list in the PowerSearch value editor. Imperative verb (user selects, not types)."
	},
	"@astryx.powersearch.operator.contains": {
		"defaultMessage": "contains",
		"description": "PowerSearch string operator, rendered inline as `<field> contains <value>` (e.g. `Name contains acme`). Lowercase verb form."
	},
	"@astryx.powersearch.operator.notContains": {
		"defaultMessage": "does not contain",
		"description": "PowerSearch negated string operator. Example: `Name does not contain test`. Lowercase; pairs with `contains`."
	},
	"@astryx.powersearch.operator.startsWith": {
		"defaultMessage": "starts with",
		"description": "PowerSearch string prefix operator. Example: `Email starts with admin@`. Lowercase."
	},
	"@astryx.powersearch.operator.notStartsWith": {
		"defaultMessage": "does not start with",
		"description": "PowerSearch negated prefix operator. Example: `Email does not start with test`. Lowercase; pairs with `starts with`."
	},
	"@astryx.powersearch.operator.endsWith": {
		"defaultMessage": "ends with",
		"description": "PowerSearch string suffix operator. Example: `Email ends with @meta.com`. Lowercase."
	},
	"@astryx.powersearch.operator.notEndsWith": {
		"defaultMessage": "does not end with",
		"description": "PowerSearch negated suffix operator. Example: `Email does not end with @gmail.com`. Lowercase; pairs with `ends with`."
	},
	"@astryx.powersearch.operator.is": {
		"defaultMessage": "is",
		"description": "PowerSearch equality operator for strings/enums. Example: `Status is Active`. Separate from `operator.equals` (numbers) — translations may diverge."
	},
	"@astryx.powersearch.operator.isNot": {
		"defaultMessage": "is not",
		"description": "PowerSearch inequality operator for strings/enums. Example: `Status is not Draft`. Pairs with `is`; separate from `operator.notEquals`."
	},
	"@astryx.powersearch.operator.equals": {
		"defaultMessage": "is",
		"description": "PowerSearch numeric equality operator. Example: `Age is 30`. Ships same English \"is\" as `operator.is` but is separate so numbers may diverge (e.g. \"equals\")."
	},
	"@astryx.powersearch.operator.notEquals": {
		"defaultMessage": "is not",
		"description": "PowerSearch numeric inequality operator. Example: `Count is not 0`. Same divergence option as `operator.equals`."
	},
	"@astryx.powersearch.operator.greaterThan": {
		"defaultMessage": "is greater than",
		"description": "PowerSearch numeric operator, strictly greater than. Example: `Age is greater than 18`. Lowercase."
	},
	"@astryx.powersearch.operator.lessThan": {
		"defaultMessage": "is less than",
		"description": "PowerSearch numeric operator, strictly less than. Example: `Priority is less than 5`. Lowercase."
	},
	"@astryx.powersearch.operator.greaterThanOrEqual": {
		"defaultMessage": "is greater than or equal to",
		"description": "PowerSearch numeric operator, ≥. Example: `Age is greater than or equal to 21`. A shorter form (e.g. \"≥\") is fine if idiomatic."
	},
	"@astryx.powersearch.operator.lessThanOrEqual": {
		"defaultMessage": "is less than or equal to",
		"description": "PowerSearch numeric operator, ≤. Example: `Priority is less than or equal to 3`. A shorter form is fine if idiomatic."
	},
	"@astryx.powersearch.operator.before": {
		"defaultMessage": "is before",
		"description": "PowerSearch date operator, strictly earlier. Example: `Created is before 2024-01-01`. Temporal, not spatial."
	},
	"@astryx.powersearch.operator.after": {
		"defaultMessage": "is after",
		"description": "PowerSearch date operator, strictly later. Example: `Updated is after 2024-06-01`. Temporal."
	},
	"@astryx.powersearch.operator.between": {
		"defaultMessage": "is between",
		"description": "PowerSearch date operator, inclusive range. Example: `Created is between 2024-01-01 and 2024-06-30`. The `and <end>` portion is composed separately."
	},
	"@astryx.powersearch.operator.isTrue": {
		"defaultMessage": "is true",
		"description": "PowerSearch boolean operator: matches truthy. Example: `Is admin is true`. Pairs with `is false`; field may be affirmative or a yes/no question."
	},
	"@astryx.powersearch.operator.isFalse": {
		"defaultMessage": "is false",
		"description": "PowerSearch boolean operator: matches falsy. Example: `Is admin is false`. Pairs with `is true`."
	},
	"@astryx.powersearch.operator.isAnyOf": {
		"defaultMessage": "is any of",
		"description": "PowerSearch list operator: value is in the set. Example: `Status is any of [Active, Paused, Draft]`. The value list is composed separately; pairs with `is none of`."
	},
	"@astryx.powersearch.operator.isNoneOf": {
		"defaultMessage": "is none of",
		"description": "PowerSearch negated list operator: value not in the set. Example: `Status is none of [Archived, Deleted]`. Pairs with `is any of`."
	},
	"@astryx.powersearch.valueEditor.itemsCount": {
		"defaultMessage": "{count, number} {count, plural, one {item} other {items}}",
		"description": "Overflow summary on a compact filter chip when the list of selected items is too long. Example: `3 items` or `1 item`."
	},
	"@astryx.powersearch.valueEditor.entitiesCount": {
		"defaultMessage": "{count, number} {count, plural, one {entity} other {entities}}",
		"description": "Overflow summary on a compact filter chip when the list of selected entities is too long. Example: `5 entities` or `1 entity`. Pair with `itemsCount` translation."
	},
	"@astryx.powersearch.valueEditor.dateRange": {
		"defaultMessage": "date range",
		"description": "Fallback lowercase noun rendered inline in a filter chip when a date-range value can't be formatted (e.g. `Created is between date range`). Keep lowercase."
	},
	"@astryx.powersearch.valueEditor.filtersCount": {
		"defaultMessage": "{count, number} {count, plural, one {filter} other {filters}}",
		"description": "Summary inside a filter chip when the value is a nested set of filters. Example: `3 filters` or `1 filter`."
	},
	"@astryx.powersearch.resultCount": {
		"defaultMessage": "{count, number} {count, plural, one {result} other {results}}",
		"description": "Live result-count text next to the PowerSearch input, announced to screen readers on change. Example: `12 results`, `1 result`; keep compact."
	},
	"@astryx.alertDialog.cancel": {
		"defaultMessage": "Cancel",
		"description": "Button label on the secondary/dismiss button of an AlertDialog (modal confirmation). Imperative verb; consumers usually override with task-specific text."
	},
	"@astryx.appShell.mobileNavigation": {
		"defaultMessage": "Mobile navigation",
		"description": "Screen-reader-only accessible name for the mobile-only navigation region on small viewports. \"Mobile\" = phone/tablet (small screen), not \"movable\"."
	},
	"@astryx.appShell.skipToContent": {
		"defaultMessage": "Skip to content",
		"description": "Text of the skip link — the first focusable element on the page, visible only while keyboard-focused. Activating it jumps focus past the navigation to the main content area. Imperative verb; keep short."
	},
	"@astryx.avatar.nameWithStatus": {
		"defaultMessage": "{name}, {status}",
		"description": "Screen-reader accessible name for an Avatar showing a status indicator; composes the person's name with the status label, e.g. \"Jane Doe, Online\". {name} = the avatar's name/alt text, {status} = the status dot's label. Adjust separator and order per locale."
	},
	"@astryx.avatarGroup.label": {
		"defaultMessage": "Avatars",
		"description": "Screen-reader-only fallback name for a horizontal cluster of user avatar images. Plural noun; consumers usually override with \"Team members\", \"Attendees\", etc."
	},
	"@astryx.avatarGroup.keyboardHint": {
		"defaultMessage": "Use arrow keys to move between avatars",
		"description": "Screen-reader-only instruction attached (via aria-describedby) to a group of interactive avatars that share a single Tab stop. Tells keyboard users the Left/Right arrow keys move focus between the avatars. Only announced when the group has interactive (link/button) avatars."
	},
	"@astryx.avatarGroup.overflow": {
		"defaultMessage": "{count, number} more",
		"description": "Accessible name for the \"+N\" overflow indicator at the end of an AvatarGroup — announces how many additional avatars are not shown. Example: `5 more`. The visible \"+N\" text is unaffected; this is the aria-label only."
	},
	"@astryx.banner.dismiss": {
		"defaultMessage": "Dismiss",
		"description": "\"Dismiss\" = close/hide this notification (not \"reject a person\"). Tooltip on the small X button on a Banner, and its aria label when the banner's title is not plain text."
	},
	"@astryx.banner.dismissTitled": {
		"defaultMessage": "{dismiss} {title}",
		"description": "Aria label on the small X button on a Banner, naming which banner it closes so stacked banners are distinguishable. `{dismiss}` is the already-translated tooltip text from `banner.dismiss`; keep it verbatim in the message so visible and accessible labels match. `{title}` is the banner's own title text — example: `Dismiss Upload failed`. Reorder the placeholders freely."
	},
	"@astryx.calendar.previousMonth": {
		"defaultMessage": "Previous month",
		"description": "Screen-reader-only label on the left-arrow button in a Calendar's month header (navigates one month back). Pairs with `calendar.nextMonth`."
	},
	"@astryx.calendar.nextMonth": {
		"defaultMessage": "Next month",
		"description": "Screen-reader-only label on the right-arrow button in a Calendar's month header (navigates one month forward). Pairs with `calendar.previousMonth`."
	},
	"@astryx.calendar.daySelected": {
		"defaultMessage": "{date}, selected",
		"description": "Accessible name for the Calendar day button that is the current single-mode selection. `{date}` is the localized full date, e.g. \"Thursday, January 15, 2026\". The trailing state word tells screen-reader users the focused day is selected."
	},
	"@astryx.calendar.dayRangeStart": {
		"defaultMessage": "{date}, range start",
		"description": "Accessible name for the Calendar day button that begins the selected date range (or the first pick of an in-progress range). `{date}` is the localized full date."
	},
	"@astryx.calendar.dayRangeEnd": {
		"defaultMessage": "{date}, range end",
		"description": "Accessible name for the Calendar day button that ends the selected date range. `{date}` is the localized full date. Pairs with `calendar.dayRangeStart`."
	},
	"@astryx.calendar.dayRangeStartAndEnd": {
		"defaultMessage": "{date}, range start and range end",
		"description": "Accessible name for a Calendar day button that both begins and ends a completed one-day range. `{date}` is the localized full date."
	},
	"@astryx.calendar.dayInRange": {
		"defaultMessage": "{date}, in range",
		"description": "Accessible name for a Calendar day button strictly inside the selected date range (not an endpoint). `{date}` is the localized full date."
	},
	"@astryx.calendar.rangeStartAnnounce": {
		"defaultMessage": "Start date {date}. Select an end date.",
		"description": "Screen-reader announcement after the first pick of a Calendar range selection. `{date}` is the localized full date. Prompts the user that a second pick completes the range."
	},
	"@astryx.calendar.rangeCompleteAnnounce": {
		"defaultMessage": "Selected range: {start} to {end}.",
		"description": "Screen-reader announcement after the second pick completes a Calendar range selection. `{start}` and `{end}` are localized full dates in chronological order."
	},
	"@astryx.calendar.rangeClearedAnnounce": {
		"defaultMessage": "Cleared start date {date}. Select a start date.",
		"description": "Screen-reader announcement when the user clicks the in-progress range start again, which clears it instead of completing a zero-length range. `{date}` is the localized full date."
	},
	"@astryx.carousel.label": {
		"defaultMessage": "Carousel",
		"description": "Screen-reader-only fallback name for a horizontally-scrolling row of items. If \"carousel\" is unfamiliar in your locale, prefer the standard term (e.g. \"slider\")."
	},
	"@astryx.carousel.scrollLeft": {
		"defaultMessage": "Scroll left",
		"description": "Screen-reader-only label on the left arrow button in a Carousel. Pairs with `carousel.scrollRight`; in RTL locales, coordinate the two so left/right match layout."
	},
	"@astryx.carousel.scrollRight": {
		"defaultMessage": "Scroll right",
		"description": "Screen-reader-only label on the right arrow button in a Carousel. Pairs with `carousel.scrollLeft`; same RTL note."
	},
	"@astryx.carousel.slideLabel": {
		"defaultMessage": "Slide {current, number} of {total, number}",
		"description": "Screen-reader accessible name for one slide in a Carousel, giving its position. `current` is the 1-based slide number; `total` is the slide count."
	},
	"@astryx.chat.status.sending": {
		"defaultMessage": "Sending",
		"description": "Chat send-status caption under an outgoing message while it is being transmitted. Part of the set sending → sent → delivered → read (or failed) — keep tense/aspect consistent."
	},
	"@astryx.chat.status.sent": {
		"defaultMessage": "Sent",
		"description": "Chat send-status caption shown once the message reaches the server. Part of the set sending → **sent** → delivered → read (or failed) — keep tense consistent."
	},
	"@astryx.chat.status.delivered": {
		"defaultMessage": "Delivered",
		"description": "Chat send-status caption shown once the recipient's device received the message. Part of the set sending → sent → **delivered** → read (or failed)."
	},
	"@astryx.chat.status.read": {
		"defaultMessage": "Read",
		"description": "Chat send-status caption shown once the recipient opened the message. English past-participle (\"has been read\", /rɛd/), not the present verb — part of the set sending → sent → delivered → **read**."
	},
	"@astryx.chat.status.failed": {
		"defaultMessage": "Failed",
		"description": "Chat send-status caption shown when the send attempt errored. Part of the set — the terminal failure branch, orthogonal to the sent → delivered → read success track."
	},
	"@astryx.chat.messageAriaLabel": {
		"defaultMessage": "Message {status}",
		"description": "Screen-reader-only accessible name for a chat message row. `{status}` interpolates the localized status word (e.g. `Message sent`, `Message delivered`) — reorder if needed."
	},
	"@astryx.chat.pastedText.expand": {
		"defaultMessage": "Expand",
		"description": "Button label on a chip in the chat composer representing a long pasted text block; clicking reveals full content. \"Expand\" here means reveal more, not grow physically."
	},
	"@astryx.checkboxList.item.checkbox": {
		"defaultMessage": "Checkbox",
		"description": "Screen-reader-only last-ditch fallback name for a checkbox inside a list item when no label is provided. Should almost never render — consumers should supply a real label."
	},
	"@astryx.commandPalette.emptySearch": {
		"defaultMessage": "No results",
		"description": "Fallback empty-state text inside a CommandPalette when the user's query has no matches. Very short (2 words); neutral tone."
	},
	"@astryx.commandPalette.emptyBootstrap": {
		"defaultMessage": "Type to search",
		"description": "Onboarding empty-state text shown inside a CommandPalette on first open, before the user has typed anything. Imperative sentence fragment."
	},
	"@astryx.commandPalette.resultCount": {
		"defaultMessage": "{count, number} {count, plural, one {result} other {results}}",
		"description": "Screen-reader-only announcement of how many commands match the CommandPalette query as the user types. Example: `12 results`, `1 result`; keep compact."
	},
	"@astryx.commandPalette.noResultsFor": {
		"defaultMessage": "No results for {query}",
		"description": "Screen-reader-only announcement when a CommandPalette query matches nothing. `{query}` is the user's verbatim search text; keep it last if your language allows so truncation-by-AT still conveys the outcome."
	},
	"@astryx.commandPalette.loading": {
		"defaultMessage": "Loading",
		"description": "Screen-reader-only announcement that a CommandPalette search has started and results are being fetched. Present-progressive form; matches the visible spinner."
	},
	"@astryx.dateRangeInput.presetDateRanges": {
		"defaultMessage": "Preset date ranges",
		"description": "Screen-reader-only accessible name for the sidebar of quick-pick preset ranges inside a DateRangeInput popover (e.g. \"Last 7 days\", \"This month\")."
	},
	"@astryx.dateTimeInput.timePlaceholder": {
		"defaultMessage": "Select a time",
		"description": "Grey placeholder inside the empty time-of-day slot in a DateTimeInput. \"Time\" = clock time (HH:MM), not duration."
	},
	"@astryx.dialog.close": {
		"defaultMessage": "Close",
		"description": "\"Close\" = shut/dismiss the dialog, not \"nearby\" (English homograph). Aria label AND tooltip on the X at the top-right of a Dialog."
	},
	"@astryx.dropdownMenu.label": {
		"defaultMessage": "Menu",
		"description": "Screen-reader-only fallback name for a dropdown menu popover. Very generic; consumers usually override. Noun (\"a menu\"), not the imperative."
	},
	"@astryx.lightbox.close": {
		"defaultMessage": "Close",
		"description": "\"Close\" = shut/dismiss (not \"nearby\"). Screen-reader-only label on the X button that dismisses a Lightbox."
	},
	"@astryx.lightbox.previous": {
		"defaultMessage": "Previous",
		"description": "Screen-reader-only label on the left-arrow button in a Lightbox (navigates to previous media item). Pairs with `lightbox.next`."
	},
	"@astryx.lightbox.next": {
		"defaultMessage": "Next",
		"description": "Screen-reader-only label on the right-arrow button in a Lightbox (navigates to next media item). Pairs with `lightbox.previous`."
	},
	"@astryx.listInput.emptyTitle": {
		"defaultMessage": "No {itemName}s yet",
		"description": "EmptyState title shown inside a lab ListInput when its collection has no records. `{itemName}` is the consumer's singular noun for one record (e.g. \"guest\"); the source appends a literal \"s\" to pluralize it, which only works for regular English plurals. If your language cannot pluralize an interpolated noun this way, rephrase around `{itemName}` instead (e.g. \"No {itemName} added yet\")."
	},
	"@astryx.listInput.emptyDescription": {
		"defaultMessage": "Add a {itemName} to get started.",
		"description": "EmptyState supporting text shown inside a lab ListInput when its collection has no records. `{itemName}` is the consumer's singular noun for one record (e.g. \"guest\")."
	},
	"@astryx.listInput.addItem": {
		"defaultMessage": "Add {itemName}",
		"description": "Accessible label on the button that appends a new record to a lab ListInput. `{itemName}` is the consumer's singular noun for one record (e.g. \"guest\")."
	},
	"@astryx.listInput.removeItem": {
		"defaultMessage": "Remove {itemName} {position, number}",
		"description": "Accessible label and tooltip on the button that deletes one record from a lab ListInput. `{itemName}` is the consumer's singular noun for one record; `{position}` is its 1-based row number (e.g. \"Remove guest 2\")."
	},
	"@astryx.listInput.removeUnavailable": {
		"defaultMessage": "Remove is unavailable while the list is disabled",
		"description": "Tooltip shown on the Remove button when the ListInput is disabled or loading, explaining why the action cannot be performed."
	},
	"@astryx.listInput.reorderItem": {
		"defaultMessage": "Reorder {itemName} {position, number}",
		"description": "Accessible label on the drag-handle button that reorders one record in a lab ListInput. `{itemName}` is the consumer's singular noun for one record; `{position}` is its 1-based row number (e.g. \"Reorder guest 2\")."
	},
	"@astryx.listInput.fieldLabelWithPosition": {
		"defaultMessage": "{header}, {itemName} {position, number} of {total, number}",
		"description": "Accessible name for a field inside a lab ListInput row after the first row, disambiguating repeated column labels. `{header}` is the column's own label (e.g. \"Name\"); `{itemName}` is the consumer's singular noun for one record; `{position}`/`{total}` are the row's 1-based index and the total row count (e.g. \"Name, guest 2 of 3\")."
	},
	"@astryx.listInput.reorderInstructions": {
		"defaultMessage": "Use Arrow Up or Arrow Down to move this item one position. Press Space or Enter to pick it up for extended keyboard reordering.",
		"description": "Visually-hidden instructions describing how to use a lab ListInput row's keyboard reorder handle, referenced via aria-describedby from every reorder button."
	},
	"@astryx.listInput.announceAdded": {
		"defaultMessage": "Added {itemName} {position, number}.",
		"description": "Screen-reader-only live announcement after a new record is appended to a lab ListInput. `{itemName}` is the consumer's singular noun for one record; `{position}` is the new record's 1-based row number."
	},
	"@astryx.listInput.announceRemoved": {
		"defaultMessage": "Removed {itemName} {position, number}.",
		"description": "Screen-reader-only live announcement after a record is deleted from a lab ListInput. `{itemName}` is the consumer's singular noun for one record; `{position}` is the removed record's former 1-based row number."
	},
	"@astryx.listInput.announceGrabbed": {
		"defaultMessage": "{itemName} {position, number} grabbed. Use arrow keys to move, Space or Enter to drop, and Escape to cancel.",
		"description": "Screen-reader-only live announcement when a lab ListInput record's keyboard reorder handle enters extended \"lift\" mode. `{itemName}` is the consumer's singular noun for one record; `{position}` is its 1-based row number."
	},
	"@astryx.listInput.announceMovedToPosition": {
		"defaultMessage": "{itemName} moved to position {position, number} of {total, number}.",
		"description": "Screen-reader-only live announcement each time a lab ListInput record's reorder position changes (arrow-key step, keyboard lift-mode preview, or pointer drag). `{itemName}` is the consumer's singular noun for one record; `{position}`/`{total}` are the record's new 1-based position and the total row count."
	},
	"@astryx.listInput.announceReorderCancelled": {
		"defaultMessage": "Reordering cancelled.",
		"description": "Screen-reader-only live announcement when a lab ListInput reorder in progress is cancelled (Escape key, blur, or the collection becoming disabled/loading mid-drag)."
	},
	"@astryx.listInput.announceReturnedToPosition": {
		"defaultMessage": "{itemName} returned to position {position, number}.",
		"description": "Screen-reader-only live announcement when a lab ListInput reorder is committed without the record's position actually changing. `{itemName}` is the consumer's singular noun for one record; `{position}` is its unchanged 1-based row number."
	},
	"@astryx.listInput.announceDropped": {
		"defaultMessage": "{itemName} dropped at position {position, number} of {total, number}.",
		"description": "Screen-reader-only live announcement when a lab ListInput reorder is committed with the record's position actually changing. `{itemName}` is the consumer's singular noun for one record; `{position}`/`{total}` are its new 1-based position and the total row count."
	},
	"@astryx.listInput.announceAlreadyAtBoundary": {
		"defaultMessage": "This {itemName} is already {boundary, select, first {first} last {last} other {}}.",
		"description": "Screen-reader-only live announcement when an arrow-key reorder attempt has no effect because the record is already at that end of the list. `{itemName}` is the consumer's singular noun for one record; `{boundary}` is always exactly \"first\" or \"last\"."
	},
	"@astryx.markdown.taskList": {
		"defaultMessage": "Task list",
		"description": "Screen-reader-only accessible name for a GitHub-flavored Markdown task list (rendered from `- [ ] item` / `- [x] done` syntax)."
	},
	"@astryx.markdown.table": {
		"defaultMessage": "Table",
		"description": "Screen-reader-only accessible name for a table rendered inside a Markdown block. Noun (\"a table\"), not the verb. Separate from `@astryx.table.label` — translations may diverge."
	},
	"@astryx.mobileNav.closeNavigation": {
		"defaultMessage": "Close navigation",
		"description": "Screen-reader-only label on the X/close button that dismisses the MobileNav overlay. Pairs with `mobileNav.toggle.open`."
	},
	"@astryx.multiSelector.selectAll": {
		"defaultMessage": "Select all",
		"description": "Label on the checkbox/toggle at the top of a MultiSelector dropdown that selects every option. \"All\" is a determiner here (as in \"all the options\"), not the pronoun."
	},
	"@astryx.multiSelector.searchPlaceholder": {
		"defaultMessage": "Search…",
		"description": "Placeholder inside the search input at the top of a MultiSelector's dropdown panel. Imperative verb; trailing `…` is one character."
	},
	"@astryx.multiSelector.searchOptions": {
		"defaultMessage": "Search options",
		"description": "Screen-reader-only accessible name for that same search input inside a MultiSelector."
	},
	"@astryx.multiSelector.empty": {
		"defaultMessage": "No options",
		"description": "Shown in a MultiSelector's dropdown panel when it was given no options at all, and announced in a polite live region on open. Very short (2 words); neutral tone, not error-y."
	},
	"@astryx.multiSelector.selectAllPartiallySelected": {
		"defaultMessage": "{label}, partially selected",
		"description": "Accessible name for the MultiSelector select-all option while only some options are selected. `{label}` is the visible select-all label (e.g. \"Select all\"). ARIA forbids aria-selected=\"mixed\" on options, so the indeterminate state is conveyed through the name instead. \"Partially\" = some but not all."
	},
	"@astryx.popover.close": {
		"defaultMessage": "Close popover",
		"description": "\"Close\" = shut/dismiss, not \"nearby\". Screen-reader-only label on the close button inside a Popover."
	},
	"@astryx.selector.searchPlaceholder": {
		"defaultMessage": "Search…",
		"description": "Placeholder inside the search input at the top of a Selector's dropdown panel (for filtering options). Imperative verb; trailing `…` is one character."
	},
	"@astryx.selector.searchOptions": {
		"defaultMessage": "Search options",
		"description": "\"Options\" = the list of choices in the dropdown. Screen-reader-only accessible name for the search input inside a Selector."
	},
	"@astryx.selector.empty": {
		"defaultMessage": "No options",
		"description": "Shown in a Selector's dropdown panel when it was given no options at all, and announced in a polite live region on open. Very short (2 words); neutral tone, not error-y."
	},
	"@astryx.sideNav.label": {
		"defaultMessage": "Side navigation",
		"description": "Screen-reader-only accessible name for the primary vertical sidebar nav (usually on the left)."
	},
	"@astryx.sideNav.resizeSidebar": {
		"defaultMessage": "Resize sidebar",
		"description": "Screen-reader-only label on the vertical drag handle at the right edge of the SideNav that lets the user resize the sidebar's width."
	},
	"@astryx.sideNav.heading.openMenu": {
		"defaultMessage": "Open menu",
		"description": "Screen-reader-only label on the `⋯` overflow-menu button embedded in a SideNav section heading. Same string as `topNav.heading.openMenu` — translations may share."
	},
	"@astryx.tabList.label": {
		"defaultMessage": "Tabs",
		"description": "Screen-reader-only fallback name for a horizontal tab bar. Plural noun; \"Tabs\" here = UI tab panels, not browser tabs or the Tab key."
	},
	"@astryx.table.label": {
		"defaultMessage": "Table",
		"description": "Fallback screen-reader-only accessible name for a data-table region when the consumer provides none. Noun (\"a table\"), not the verb \"to table\"."
	},
	"@astryx.table.noData": {
		"defaultMessage": "No data",
		"description": "Fallback empty-state text in the table body when there are zero rows. Neutral tone (not error-y); consumers commonly override with something specific like \"No results\"."
	},
	"@astryx.table.filter.allPlaceholder": {
		"defaultMessage": "All",
		"description": "Placeholder on a per-column filter dropdown when nothing is selected, meaning \"no filter — all rows match\". Determiner form (as in \"all values\"), not the pronoun."
	},
	"@astryx.table.filter.reset": {
		"defaultMessage": "Reset",
		"description": "Button label inside a table's filter panel/popover; clears pending filter values back to defaults. Imperative verb."
	},
	"@astryx.table.filter.apply": {
		"defaultMessage": "Apply",
		"description": "Primary button label inside a table's filter panel/popover; commits pending filter values. Imperative verb; pairs with `Reset`."
	},
	"@astryx.table.rowStatus.columnHeader": {
		"defaultMessage": "Row status",
		"description": "Screen-reader-only column header for the narrow status-indicator gutter a Table gains from useTableRowStatus. Sighted users see a blank gutter; assistive tech announces this as the column name."
	},
	"@astryx.table.selection.selectAllRows": {
		"defaultMessage": "Select all rows",
		"description": "Aria label for the \"select all rows\" checkbox in a Table header."
	},
	"@astryx.table.selection.selectRow": {
		"defaultMessage": "Select row",
		"description": "Aria label for the \"select row\" checkbox on a Table row."
	},
	"@astryx.table.selection.selectRowNamed": {
		"defaultMessage": "Select {label}",
		"description": "Aria label for a Table row's selection checkbox when a per-row label is available (via getRowLabel). `label` is the row's human-readable identity, e.g. \"Alice\"."
	},
	"@astryx.table.sort.ascending": {
		"defaultMessage": "Sort ascending",
		"description": "Screen-reader-only label on a column header button that will sort the column ascending. Part of a set with `sort.descending` and `sort.clear` — keep parallel."
	},
	"@astryx.table.sort.descending": {
		"defaultMessage": "Sort descending",
		"description": "Screen-reader-only label on a column header button that will sort the column descending. Part of a set with `sort.ascending` and `sort.clear`."
	},
	"@astryx.table.sort.clear": {
		"defaultMessage": "Clear sort",
		"description": "Screen-reader-only label on a column header button that will remove the current sort. \"Clear\" here means remove, not transparent. Part of the sort set."
	},
	"@astryx.table.sort.direction.ascending": {
		"defaultMessage": "ascending",
		"description": "Localized direction word interpolated as `direction` into @astryx.table.sort.sortedBy and @astryx.table.sort.sortedByWithPriority."
	},
	"@astryx.table.sort.direction.descending": {
		"defaultMessage": "descending",
		"description": "Localized direction word interpolated as `direction` into @astryx.table.sort.sortedBy and @astryx.table.sort.sortedByWithPriority."
	},
	"@astryx.table.sort.sortBy": {
		"defaultMessage": "Sort by {label}",
		"description": "Aria label for a sortable Table header button when the column is unsorted. `label` is the column header text."
	},
	"@astryx.table.sort.sortedBy": {
		"defaultMessage": "Sort by {label}, sorted {direction}",
		"description": "Aria label for a sorted Table header button. `direction` is the localized direction word from @astryx.table.sort.direction.*."
	},
	"@astryx.table.sort.sortedByWithPriority": {
		"defaultMessage": "Sort by {label}, sorted {direction}, priority {rank, number} of {total, number}",
		"description": "Aria label for a sorted Table header button in multi-sort. `rank` is the 1-based position of this column in the sort order; `total` is the number of sorted columns."
	},
	"@astryx.toast.dismiss": {
		"defaultMessage": "Dismiss notification",
		"description": "Screen-reader-only label on the X button of a Toast (transient notification popup). Distinct from `banner.dismiss` (persistent banner)."
	},
	"@astryx.toast.viewport": {
		"defaultMessage": "Notifications",
		"description": "Screen-reader-only accessible name for the invisible landmark region hosting the stack of Toast popups (usually pinned to a screen corner)."
	},
	"@astryx.tokenizer.clearAll": {
		"defaultMessage": "Clear all",
		"description": "Label on the \"×\" button that removes every token/chip from a Tokenizer input. Imperative verb + determiner \"all\"; short."
	},
	"@astryx.topNav.heading.openMenu": {
		"defaultMessage": "Open menu",
		"description": "Screen-reader-only label on the `⋯` overflow button in a TopNav section heading. Kept separate from `sideNav.heading.openMenu` so translations may diverge."
	},
	"@astryx.topNav.landmarkLabel": {
		"defaultMessage": "Top navigation",
		"description": "Default accessible name (aria-label) for the <nav> landmark rendered by TopNav when no label is provided."
	},
	"@astryx.treeList.toggleChildren": {
		"defaultMessage": "Toggle children",
		"description": "\"Children\" = child nodes in the tree, not human children. Screen-reader-only label on the chevron next to a TreeList item that has children — toggles the sub-list."
	},
	"@astryx.typeahead.emptySearchResults": {
		"defaultMessage": "No results found",
		"description": "Fallback empty-state message inside a Typeahead's suggestion popover when the current query has no matches. Neutral tone (not error-y)."
	},
	"@astryx.typeahead.loading": {
		"defaultMessage": "Loading",
		"description": "Screen-reader-only name for a spinner shown inside a Typeahead dropdown while suggestions are being fetched. Present-progressive form."
	},
	"@astryx.typeahead.searchResults": {
		"defaultMessage": "Search results",
		"description": "Screen-reader-only accessible name for the list of suggestions inside a Typeahead dropdown."
	},
	"@astryx.typeahead.clearSelection": {
		"defaultMessage": "Clear selection",
		"description": "\"Selection\" = the chosen value (not highlighted text). Screen-reader-only label on the X that clears the currently-selected value from a Typeahead."
	},
	"@astryx.breadcrumbs.label": {
		"defaultMessage": "Breadcrumb",
		"description": "Screen-reader-only fallback name for the breadcrumb trail (e.g. `Home > Section > Page`). Singular in English per ARIA convention; plural is fine if natural in your locale."
	},
	"@astryx.chat.composer.placeholder": {
		"defaultMessage": "Type a message…",
		"description": "Grey placeholder text inside the empty chat composer textarea. Imperative verb; trailing `…` is one character."
	},
	"@astryx.chat.composerDrawer.label": {
		"defaultMessage": "Items",
		"description": "Fallback aria label for the ChatComposerDrawer — a horizontal list of attachment/tool chips. Consumers usually override with \"Attachments\", \"Tools\", etc."
	},
	"@astryx.chat.composerInput.label": {
		"defaultMessage": "Message input",
		"description": "Screen-reader-only accessible name for the chat composer textarea. Reorder freely if your language uses one word for \"message field\"."
	},
	"@astryx.chat.speechRecognition.noSpeechDetected": {
		"defaultMessage": "No speech was detected.",
		"description": "Full-sentence error shown inline in the chat composer after voice input captured silence. Soft-error tone (not alarming); keep terminal period."
	},
	"@astryx.commandPalette.label": {
		"defaultMessage": "Command palette",
		"description": "Screen-reader-only fallback name for a keyboard-driven command menu (usually opened with Cmd/Ctrl-K). If unfamiliar, prefer a natural equivalent like \"quick actions\"."
	},
	"@astryx.commandPalette.input.placeholder": {
		"defaultMessage": "Search…",
		"description": "Grey placeholder inside the CommandPalette's search input. Imperative verb; trailing `…` is one character."
	},
	"@astryx.commandPalette.list.label": {
		"defaultMessage": "Commands",
		"description": "\"Command\" = an app action a user can invoke (metaphor from CLI), not a Unix command. Screen-reader-only name for the matching-commands list."
	},
	"@astryx.contextMenu.label": {
		"defaultMessage": "Context menu",
		"description": "Screen-reader-only fallback name for the right-click / long-press popup menu. \"Context\" = context-specific to the activated element, not linguistic context."
	},
	"@astryx.dateInput.placeholder": {
		"defaultMessage": "Select a date",
		"description": "Grey placeholder inside an empty DateInput field. \"Date\" = calendar date, not romantic or fruit. Imperative verb."
	},
	"@astryx.dateInput.dialogLabel": {
		"defaultMessage": "Choose date",
		"description": "Screen-reader-only accessible name for the popover dialog opened from a DateInput's calendar toggle. Imperative verb + noun."
	},
	"@astryx.dateInput.closeCalendar": {
		"defaultMessage": "Close calendar",
		"description": "Screen-reader-only label on the X inside the DateInput calendar popover (dismisses the popover). Distinct from `dateInput.toggleCalendarClose`, which labels the outer toggle."
	},
	"@astryx.dateInput.openCalendar": {
		"defaultMessage": "Open calendar",
		"description": "Aria label for the DateInput / DateRangeInput / DateTimeInput calendar toggle button when the popover is closed."
	},
	"@astryx.dateInput.toggleCalendarClose": {
		"defaultMessage": "Close calendar",
		"description": "Aria label for the DateInput / DateRangeInput / DateTimeInput calendar toggle button when the popover is open. Distinct from closeCalendar (which labels the X inside the popover) so translators can differentiate the toggle vs the close-X UI."
	},
	"@astryx.dateInput.clear": {
		"defaultMessage": "Clear {label}",
		"description": "Aria label for the clear-value button in DateInput / DateRangeInput / DateTimeInput. `{label}` is the field's own label so screen readers announce e.g. 'Clear Start date'."
	},
	"@astryx.dateInput.invalidDate": {
		"defaultMessage": "Invalid date",
		"description": "Screen-reader-only live-region alert in DateInput / DateTimeInput when the typed date cannot be parsed. The field silently reverts on blur, so this is the only rejection feedback a screen-reader user gets."
	},
	"@astryx.dateInput.resetPicking": {
		"defaultMessage": "Reset",
		"description": "Ghost button in the mobile date picker's header, at the trailing corner beside the month arrows. Removes the chosen date AND returns the calendar to the current month — it undoes the picking done so far and puts the picker back to how it opens, so prefer a word covering both, not one that only means emptying a field. Not cancel: the picker stays open afterwards and nothing is dismissed. Keep it short; it shares one line with the month title and two arrows."
	},
	"@astryx.dateInput.savePicking": {
		"defaultMessage": "Save",
		"description": "Full-width primary button that closes the mobile date picker, on the calendar. The date is already committed by the tap that chose it, so this only dismisses — but it is worded as saving because that is how the action reads to someone finishing a form. Use the word your platform uses for accepting and closing a sheet."
	},
	"@astryx.dateInput.doneChoosingMonth": {
		"defaultMessage": "Done",
		"description": "Full-width button under the month and year wheels in the mobile date picker. It does NOT close the picker — it returns to the calendar, having set the month. Word it as finishing this step, not as finishing the whole task; the calendar's own button is the one that closes."
	},
	"@astryx.dateInput.chooseMonthYear": {
		"defaultMessage": "{monthYear}, Choose month and year",
		"description": "Accessible name for the mobile date picker's header button, which swaps the calendar for month and year wheels. {monthYear} is the currently shown month and year, already localized (e.g. \"March 2026\"). The whole label is one string so the separator and word order can change per locale."
	},
	"@astryx.dateInput.monthWheel": {
		"defaultMessage": "Month",
		"description": "Accessible name for the scrollable month column in the mobile date picker. Single word; a calendar month, not a duration."
	},
	"@astryx.dateInput.yearWheel": {
		"defaultMessage": "Year",
		"description": "Accessible name for the scrollable year column in the mobile date picker. Single word; a calendar year, not a duration."
	},
	"@astryx.dateTimeInput.timeHint12h": {
		"defaultMessage": "e.g., 2:30 PM",
		"description": "Placeholder hint shown in the DateTimeInput time field when focused and empty with 12-hour format. Gives an example of expected input format."
	},
	"@astryx.dateTimeInput.timeHint24h": {
		"defaultMessage": "e.g., 14:30",
		"description": "Placeholder hint shown in the DateTimeInput time field when focused and empty with 24-hour format. Gives an example of expected input format."
	},
	"@astryx.dateTimeInput.timeSuffix": {
		"defaultMessage": "{label} time",
		"description": "Screen-reader-only accessible name for the time-of-day slot in a DateTimeInput. Example: `Start date time`; reorder freely (e.g. \"time of {label}\")."
	},
	"@astryx.dateTimeInput.timeOptionsLabel": {
		"defaultMessage": "{label} options",
		"description": "Screen-reader-only accessible name for the list of preset times that drops down from a DateTimeInput's time slot. `{label}` is the accessible name of the time field itself, already ending in the word for time — example: `Meeting time options`. Plural: the list holds every selectable time."
	},
	"@astryx.dateRangeInput.placeholder": {
		"defaultMessage": "Select date range",
		"description": "Grey placeholder inside an empty DateRangeInput field. Represents picking a start–end date pair. Imperative verb."
	},
	"@astryx.dateRangeInput.dialogLabel": {
		"defaultMessage": "Choose date range",
		"description": "Screen-reader-only accessible name for the popover dialog opened from a DateRangeInput. Imperative verb + noun phrase."
	},
	"@astryx.dateTimeInput.placeholder": {
		"defaultMessage": "Select a date",
		"description": "Grey placeholder inside an empty DateTimeInput field. Note: the English says only \"date\" though the field is date+time — do not add \"and time\" unless natural."
	},
	"@astryx.dateTimeInput.dialogLabel": {
		"defaultMessage": "Choose date and time",
		"description": "Screen-reader-only accessible name for the DateTimeInput picker dialog. On desktop this labels the date calendar popover inside the date+time field; on touch devices it labels the full Date/Time bottom sheet."
	},
	"@astryx.dateTimeInput.pickerMode": {
		"defaultMessage": "Date/time section",
		"description": "Screen-reader-only label for the segmented Date/Time switch at the top of the mobile DateTimeInput bottom sheet."
	},
	"@astryx.dateTimeInput.dateTab": {
		"defaultMessage": "Date",
		"description": "Visible label for the Date segment in the mobile DateTimeInput bottom sheet."
	},
	"@astryx.dateTimeInput.timeTab": {
		"defaultMessage": "Time",
		"description": "Visible label for the Time segment in the mobile DateTimeInput bottom sheet."
	},
	"@astryx.dateTimeInput.openTimePicker": {
		"defaultMessage": "Open {label}",
		"description": "Aria label for the clock button in the mobile DateTimeInput closed time segment. `{label}` is the accessible name of the time input, for example `Meeting time`."
	},
	"@astryx.dateTimeInput.saveDatePicking": {
		"defaultMessage": "Save date",
		"description": "Primary button at the bottom of the Date panel in the mobile DateTimeInput bottom sheet. It does not close the sheet; it accepts the date step and moves to the Time panel. Use sentence case in English and title case only when appropriate for the locale."
	},
	"@astryx.dateTimeInput.hourWheel": {
		"defaultMessage": "Hour",
		"description": "Accessible name for the hour wheel in the mobile DateTimeInput bottom sheet."
	},
	"@astryx.dateTimeInput.minuteWheel": {
		"defaultMessage": "Minute",
		"description": "Accessible name for the minute wheel in the mobile DateTimeInput bottom sheet."
	},
	"@astryx.dateTimeInput.secondWheel": {
		"defaultMessage": "Second",
		"description": "Accessible name for the optional seconds wheel in the mobile DateTimeInput bottom sheet."
	},
	"@astryx.dateTimeInput.meridiemWheel": {
		"defaultMessage": "AM/PM",
		"description": "Accessible name for the AM/PM wheel in the mobile DateTimeInput bottom sheet when using 12-hour time."
	},
	"@astryx.dateTimeInput.meridiemAM": {
		"defaultMessage": "AM",
		"description": "Label for the morning half of the AM/PM wheel in the mobile DateTimeInput bottom sheet. Use the locale's concise ante-meridiem marker."
	},
	"@astryx.dateTimeInput.meridiemPM": {
		"defaultMessage": "PM",
		"description": "Label for the afternoon/evening half of the AM/PM wheel in the mobile DateTimeInput bottom sheet. Use the locale's concise post-meridiem marker."
	},
	"@astryx.link.newTab": {
		"defaultMessage": "(opens in new tab)",
		"description": "Visually-hidden (screen-reader-only) suffix appended to a Link's accessible name when it opens in a new tab. Example: `Documentation (opens in new tab)`."
	},
	"@astryx.mobileNav.toggle.open": {
		"defaultMessage": "Open navigation",
		"description": "Screen-reader-only label on the hamburger button that opens the MobileNav overlay (rendered when the overlay is closed). Pairs with `mobileNav.closeNavigation`."
	},
	"@astryx.moreMenu.label": {
		"defaultMessage": "More options",
		"description": "Screen-reader-only name for the small `⋯` (three-dots) overflow button that opens a menu of additional actions. Very short — sits on a tiny icon button."
	},
	"@astryx.multiSelector.selectPlaceholder": {
		"defaultMessage": "Select…",
		"description": "Placeholder on an empty MultiSelector trigger button. Same English as `selector.placeholder` but a separate key — plural phrasing like \"Choose items…\" is fine."
	},
	"@astryx.outline.label": {
		"defaultMessage": "Table of contents",
		"description": "Screen-reader-only fallback name for a page's outline / table-of-contents sidebar (list of in-page headings). Rendered as `aria-label` on a `<nav>` landmark."
	},
	"@astryx.powersearch.label": {
		"defaultMessage": "Search",
		"description": "Screen-reader-only accessible name for the PowerSearch input (a filter-builder). The visible placeholder is separate; noun form often reads better than the verb."
	},
	"@astryx.powersearch.placeholder": {
		"defaultMessage": "Search…",
		"description": "Grey placeholder text inside the empty PowerSearch input. Imperative verb; trailing `…` is one character."
	},
	"@astryx.resizable.collapsed": {
		"defaultMessage": "Collapsed",
		"description": "aria-valuetext for the Resizable drag handle (role=separator) while its panel is collapsed to zero size. Replaces the numeric value announcement, since the numeric value is clamped to the minimum while collapsed. Adjective describing the panel state, not a verb/command."
	},
	"@astryx.resizable.handle.label": {
		"defaultMessage": "Resize handle",
		"description": "Screen-reader-only accessible name for the small draggable divider between two Resizable panels (users drag it to change the split ratio)."
	},
	"@astryx.selector.placeholder": {
		"defaultMessage": "Select…",
		"description": "Placeholder text on an empty Selector trigger button (a dropdown). Imperative verb; trailing `…` is one character. Very short — appears on the button face."
	},
	"@astryx.sideNav.heading.dialogLabel": {
		"defaultMessage": "Navigation menu",
		"description": "Screen-reader-only accessible name for the dropdown dialog opened from a SideNavHeading's overflow menu."
	},
	"@astryx.table.pagination.label": {
		"defaultMessage": "Table pagination",
		"description": "Screen-reader-only accessible name for a table's pagination `<nav>` (rendered below and/or above the table per the plugin's position config). Kept separate from `@astryx.pagination.label` so translations may diverge. When position='both', this string is interpolated as the {label} value into `@astryx.table.pagination.labelAbove`/`labelBelow` — keep it compatible with those suffix templates."
	},
	"@astryx.table.pagination.labelAbove": {
		"defaultMessage": "{label} (top)",
		"description": "Accessible name for the pagination `<nav>` rendered above the table when position='both' renders two navs. `label` is the resolved base label (default \"Table pagination\" or consumer-supplied); the suffix keeps the two same-type landmarks distinguishable."
	},
	"@astryx.table.pagination.labelBelow": {
		"defaultMessage": "{label} (bottom)",
		"description": "Accessible name for the pagination `<nav>` rendered below the table when position='both' renders two navs. `label` is the resolved base label (default \"Table pagination\" or consumer-supplied); the suffix keeps the two same-type landmarks distinguishable."
	},
	"@astryx.timeInput.placeholder": {
		"defaultMessage": "Select a time",
		"description": "\"Time\" = clock time (HH:MM), not duration or era. Grey placeholder inside an empty TimeInput field; imperative verb."
	},
	"@astryx.timeInput.invalidTime": {
		"defaultMessage": "Invalid time",
		"description": "Screen-reader-only live-region alert in TimeInput / DateTimeInput when the typed time cannot be parsed. \"Time\" = clock time (HH:MM). The field silently reverts on blur, so this is the only rejection feedback a screen-reader user gets."
	},
	"@astryx.topNav.heading.dialogLabel": {
		"defaultMessage": "Navigation menu",
		"description": "Screen-reader-only accessible name for the dropdown dialog opened from a TopNavHeading's overflow menu. Kept separate from the SideNav sibling."
	},
	"@astryx.typeahead.searchPlaceholder": {
		"defaultMessage": "Search…",
		"description": "Placeholder inside an empty Typeahead input (a search field that suggests results as the user types). Imperative verb; trailing `…` is one character."
	},
	"@astryx.banner.collapse": {
		"defaultMessage": "Collapse",
		"description": "\"Collapse\" = fold up, not crumble. Aria label AND tooltip on the Banner expand/collapse toggle when currently expanded. Pairs with `banner.expand`."
	},
	"@astryx.banner.expand": {
		"defaultMessage": "Expand",
		"description": "\"Expand\" = reveal more, not grow physically. Aria label AND tooltip on the same toggle when currently collapsed. Pairs with `banner.collapse`."
	},
	"@astryx.button.loading": {
		"defaultMessage": "Loading",
		"description": "Screen-reader-only live-region announcement while a Button is in its loading state (spinner shown, action in flight). Progressive sense (\"work in progress\"), not a noun. Kept separate from `typeahead.loading` — translations may diverge."
	},
	"@astryx.chatComposerDrawer.expand": {
		"defaultMessage": "Expand {label}",
		"description": "Screen-reader-only label on the ChatComposerDrawer toggle when the drawer is collapsed. `{label}` is the drawer's visible name — example: `Expand Attachments`. Pairs with `collapse`."
	},
	"@astryx.chatComposerDrawer.collapse": {
		"defaultMessage": "Collapse {label}",
		"description": "Screen-reader-only label on the ChatComposerDrawer toggle when the drawer is expanded. Example: `Collapse Attachments`. Pairs with `expand`."
	},
	"@astryx.chatDictationButton.startDictation": {
		"defaultMessage": "Start dictation",
		"description": "Accessible label for the microphone button when idle (not listening)."
	},
	"@astryx.chatDictationButton.stopDictation": {
		"defaultMessage": "Stop dictation",
		"description": "Accessible label for the microphone button when actively listening."
	},
	"@astryx.chatLayout.newMessages": {
		"defaultMessage": "New messages",
		"description": "Text on a floating pill at the bottom of a chat viewport when unseen messages arrive below the fold; clicking scrolls to bottom. Keep short — narrow pill."
	},
	"@astryx.chatLayoutScrollButton.scrollToBottom": {
		"defaultMessage": "Scroll to bottom",
		"description": "Visible tooltip AND screen-reader label for a small down-arrow button that scrolls the chat viewport to its latest message."
	},
	"@astryx.chatMessage.messageFrom": {
		"defaultMessage": "Message from {sender}",
		"description": "Screen-reader-only accessible name for a chat message when the sender name isn't visible. Example: `Message from Sarah`, `Message from Bot` — reorder freely."
	},
	"@astryx.chatSendButton.stop": {
		"defaultMessage": "Stop",
		"description": "Button label that replaces `Send` on the chat send button while an AI response is streaming; clicking aborts generation. Short — appears on a small button."
	},
	"@astryx.chatSendButton.send": {
		"defaultMessage": "Send",
		"description": "Primary button label on the chat submit button (paperplane icon). Imperative verb; pairs with `Stop`. Very short."
	},
	"@astryx.chatToolCalls.error": {
		"defaultMessage": "Error: {message}",
		"description": "Screen-reader text for a tool call that failed. {message} is the error detail."
	},
	"@astryx.chatToolCalls.groupLabel": {
		"defaultMessage": "{count} tool calls",
		"description": "Summary label shown in the group header when multiple tool calls are expanded. {count} is the number of calls."
	},
	"@astryx.chatTriggerMenu.suggestions": {
		"defaultMessage": "Suggestions",
		"description": "Screen-reader-only fallback label for the popover listbox opened by a trigger character (`@`, `/`) in the chat composer when the trigger provides no specific label."
	},
	"@astryx.citation.label": {
		"defaultMessage": "Citation {number}: {title}",
		"description": "Screen-reader-only accessible name for a Citation chip (a small numbered link to a source). Example: `Citation 1: OpenAI research paper`. Reorder freely."
	},
	"@astryx.codeBlock.copied": {
		"defaultMessage": "Copied",
		"description": "Screen-reader-only label on the CodeBlock copy button for ~2s after a successful copy. Past-participle (\"has been copied\"); pairs with `codeBlock.copyCode`."
	},
	"@astryx.codeBlock.copyCode": {
		"defaultMessage": "Copy code",
		"description": "\"Code\" = source code. Aria label AND tooltip on the CodeBlock copy button in its default state. Pairs with `codeBlock.copied` (post-click state)."
	},
	"@astryx.codeBlock.code": {
		"defaultMessage": "Code",
		"description": "Screen-reader-only fallback name for a code-snippet scroll container when the code's language is unknown. \"Code\" = source code, not secret code or code of conduct."
	},
	"@astryx.field.optional": {
		"defaultMessage": "Optional",
		"description": "Visible indicator shown next to a form field's label when the field is optional (isOptional). Mutually exclusive with the required indicator. Very short — appears inline after the label text."
	},
	"@astryx.field.required": {
		"defaultMessage": "Required",
		"description": "Visible indicator shown next to a form field's label when the field must be filled in (isRequired). Mutually exclusive with the optional indicator. Very short — appears inline after the label text."
	},
	"@astryx.fileInput.clearLabel": {
		"defaultMessage": "Clear {label}",
		"description": "Screen-reader-only label on the X that removes the selected file from a FileInput. Example: `Clear Attachment`, `Clear Résumé`."
	},
	"@astryx.fileInput.dropHint": {
		"defaultMessage": "Drop files here",
		"description": "Text shown in the dropzone area when a user is dragging files over the FileInput."
	},
	"@astryx.fileInput.errorInvalidType": {
		"defaultMessage": "\"{fileName}\" is not an accepted file type",
		"description": "Validation error shown when a selected file does not match the accepted types."
	},
	"@astryx.fileInput.errorMaxFiles": {
		"defaultMessage": "Maximum {maxFiles} files allowed",
		"description": "Validation error shown when the number of selected files exceeds the maximum."
	},
	"@astryx.fileInput.errorMaxSize": {
		"defaultMessage": "\"{fileName}\" exceeds {maxSize} limit",
		"description": "Validation error shown when a selected file exceeds the maximum size. {maxSize} is a formatted size string like \"2.0 MB\"."
	},
	"@astryx.fileInput.fileSelected": {
		"defaultMessage": "1 file selected: {fileName}",
		"description": "Live-region announcement when a single file is successfully selected."
	},
	"@astryx.fileInput.filesSelected": {
		"defaultMessage": "{count} files selected",
		"description": "Live-region announcement when multiple files are successfully selected."
	},
	"@astryx.fileInput.placeholder": {
		"defaultMessage": "Choose file",
		"description": "Default placeholder text shown when no file is selected in a single-file FileInput."
	},
	"@astryx.fileInput.placeholderMultiple": {
		"defaultMessage": "Choose files",
		"description": "Default placeholder text shown when no files are selected in a multi-file FileInput."
	},
	"@astryx.fileInput.required": {
		"defaultMessage": "Required",
		"description": "Screen-reader-only description on the FileInput trigger indicating the field must be filled in. Mirrors the visible `Required` indicator next to the field label; conveyed via description because aria-required is not supported on role=\"button\"."
	},
	"@astryx.fileInput.triggerWithFiles": {
		"defaultMessage": "{label}, {fileNames}",
		"description": "Accessible name for a FileInput trigger that has files attached, composing the field label with the selected filenames. Example: `Attachments, report.pdf, notes.txt`."
	},
	"@astryx.keyboardHint.toNavigate": {
		"defaultMessage": "to navigate",
		"description": "Trailing text in the keyboard-hint badge, shown after arrow-key icons — reads as `← → to navigate`. Lowercase sentence fragment completing the visual phrase; the badge is aria-hidden, so this is for sighted users only."
	},
	"@astryx.lightbox.mediaViewer": {
		"defaultMessage": "Media viewer",
		"description": "Screen-reader-only fallback name for the Lightbox dialog when the current media item has no alt text. Should rarely render — consumers should provide alt."
	},
	"@astryx.lightbox.zoom": {
		"defaultMessage": "Zoom",
		"description": "Screen-reader-only label on the Lightbox image acting as a zoom toggle button (aria-pressed reflects zoomed state). Verb (\"to zoom\"), very short."
	},
	"@astryx.lightbox.zoomedIn": {
		"defaultMessage": "Zoomed in, use arrow keys to pan",
		"description": "Polite screen-reader announcement after zooming into a Lightbox image, including a hint that arrow keys pan while zoomed. Pairs with `lightbox.zoomedOut`."
	},
	"@astryx.lightbox.zoomedOut": {
		"defaultMessage": "Zoomed out",
		"description": "Polite screen-reader announcement after zooming back out of a Lightbox image. Pairs with `lightbox.zoomedIn`."
	},
	"@astryx.metadataList.showMore": {
		"defaultMessage": "Show more",
		"description": "Button label under a MetadataList that reveals items hidden beyond the configured maximum. Toggles with `metadataList.showLess` — keep the pair parallel in your language."
	},
	"@astryx.metadataList.showLess": {
		"defaultMessage": "Show less",
		"description": "Button label under a MetadataList that re-hides the extra items revealed by `metadataList.showMore`. Keep the pair parallel."
	},
	"@astryx.mobileNav.navigation": {
		"defaultMessage": "Navigation",
		"description": "Screen-reader-only fallback name for the MobileNav overlay dialog when no explicit label was passed."
	},
	"@astryx.multiSelector.clearAll": {
		"defaultMessage": "Clear all {label}",
		"description": "Screen-reader-only label on the X that clears every selected value from a MultiSelector. Example: `Clear all Countries`. `{label}` is typically already plural in English."
	},
	"@astryx.input.statusButton.error": {
		"defaultMessage": "Error details",
		"description": "Accessible name for the focusable status icon button inside an input when statusVariant is 'tooltip' and the status type is error. Activating or focusing the button reveals the error message in a tooltip. Keep it short — it labels an icon-only button."
	},
	"@astryx.input.statusButton.warning": {
		"defaultMessage": "Warning details",
		"description": "Accessible name for the focusable status icon button inside an input when statusVariant is 'tooltip' and the status type is warning. Activating or focusing the button reveals the warning message in a tooltip."
	},
	"@astryx.input.statusButton.success": {
		"defaultMessage": "Success details",
		"description": "Accessible name for the focusable status icon button inside an input when statusVariant is 'tooltip' and the status type is success. Activating or focusing the button reveals the success message in a tooltip."
	},
	"@astryx.numberInput.clearLabel": {
		"defaultMessage": "Clear {label}",
		"description": "Screen-reader-only label on the X that clears the value from a NumberInput. Example: `Clear Age`, `Clear Quantity`."
	},
	"@astryx.numberInput.decrementLabel": {
		"defaultMessage": "Decrement {label}",
		"description": "Accessible label for the NumberInput button that decreases the value by one configured step. Example: `Decrement Quantity`."
	},
	"@astryx.numberInput.incrementLabel": {
		"defaultMessage": "Increment {label}",
		"description": "Accessible label for the NumberInput button that increases the value by one configured step. Example: `Increment Quantity`."
	},
	"@astryx.selector.clearLabel": {
		"defaultMessage": "Clear {label}",
		"description": "Screen-reader-only label on the X that clears the selected value from a Selector. `{label}` is the selector's visible label — example: `Clear Country`."
	},
	"@astryx.sideNavCollapseButton.expandSidebar": {
		"defaultMessage": "Expand sidebar",
		"description": "Aria label AND tooltip on the SideNav collapse/expand toggle when the sidebar is currently collapsed (clicking expands it). Pairs with `collapseSidebar`."
	},
	"@astryx.sideNavCollapseButton.collapseSidebar": {
		"defaultMessage": "Collapse sidebar",
		"description": "Aria label AND tooltip on the same toggle when the sidebar is currently expanded (clicking collapses it). Pairs with `expandSidebar`."
	},
	"@astryx.sideNavItem.expand": {
		"defaultMessage": "Expand {label}",
		"description": "Screen-reader-only label on the chevron next to a SideNav item with children when the group is collapsed. Example: `Expand Settings`. Pairs with `sideNavItem.collapse`."
	},
	"@astryx.sideNavItem.collapse": {
		"defaultMessage": "Collapse {label}",
		"description": "Screen-reader-only label on the same chevron when the group is expanded. Example: `Collapse Settings`. Pairs with `sideNavItem.expand`."
	},
	"@astryx.sideNavItem.submenuLabel": {
		"defaultMessage": "{label} submenu",
		"description": "Accessible name for the flyout dialog that opens from a collapsed (icon-only) SideNav item to show its sub-items. {label} is the parent item's label. Example: `Settings submenu`."
	},
	"@astryx.tableFiltering.filterByColumn": {
		"defaultMessage": "Filter {header}",
		"description": "Triple-use string on per-column filter controls: visible label, placeholder, AND aria label. `{header}` is the column header — example: `Filter Name`. Keep short."
	},
	"@astryx.tableGroupedRows.expandGroup": {
		"defaultMessage": "Expand group {groupKey}",
		"description": "Screen-reader-only label on the chevron next to a grouped table's group header when collapsed. Example: `Expand group Q1 2024`. Pairs with `collapseGroup`."
	},
	"@astryx.tableGroupedRows.collapseGroup": {
		"defaultMessage": "Collapse group {groupKey}",
		"description": "Screen-reader-only label on the same chevron when the group is expanded. Example: `Collapse group Q1 2024`. Pairs with `expandGroup`."
	},
	"@astryx.tableRowExpansion.collapseRow": {
		"defaultMessage": "Collapse row",
		"description": "Screen-reader-only label on the row-expand chevron when the row is currently expanded. Part of the four-way expand/collapse set."
	},
	"@astryx.tableRowExpansion.expandRow": {
		"defaultMessage": "Expand row",
		"description": "Screen-reader-only label on the row-expand chevron when the row is currently collapsed. Part of a four-way set with `collapseRow`, `expandAllRows`, `collapseAllRows`."
	},
	"@astryx.tableRowExpansion.columnHeader": {
		"defaultMessage": "Row expansion",
		"description": "Screen-reader-only header for the leading column that holds the per-row expand/collapse chevrons. The column shows no visible label."
	},
	"@astryx.tableRowExpansion.collapseAllRows": {
		"defaultMessage": "Collapse all rows",
		"description": "Screen-reader-only label on the same header button when every row is expanded. Part of the four-way set."
	},
	"@astryx.tableRowExpansion.expandAllRows": {
		"defaultMessage": "Expand all rows",
		"description": "Screen-reader-only label on the header expand-all/collapse-all button when at least one row is collapsed (clicking expands every expandable row). Part of the four-way set."
	},
	"@astryx.stepper.label": {
		"defaultMessage": "Progress",
		"description": "Screen-reader-only fallback name for the Stepper's ordered list of steps, describing the sequence as a whole (e.g. `Progress`). Used as the aria-label when the consumer does not pass a `label`. Singular per ARIA convention."
	},
	"@astryx.step.goToStep": {
		"defaultMessage": "Go to step {stepNumber, number}: {label}",
		"description": "Accessible name for a clickable step in the Stepper. {stepNumber} is the 1-based position, {label} is the step's visible label."
	},
	"@astryx.step.goToStepWithStatus": {
		"defaultMessage": "Go to step {stepNumber, number}: {label}, {status}",
		"description": "Accessible name for a clickable Stepper step that also carries a status. {status} is one of the translated `step.status.*` words (completed/warning/error). Keep the pattern parallel to `step.goToStep`."
	},
	"@astryx.step.optional": {
		"defaultMessage": "Optional",
		"description": "Visible indicator appended after a Stepper step's label when the step is optional (isOptional). Very short; appears inline after the label text."
	},
	"@astryx.step.status.completed": {
		"defaultMessage": "completed",
		"description": "Screen-reader-only status word rendered next to a Stepper step label when the step is done (either progress-completed or status=success). Lowercase adjective; it is read mid-sentence after the step label."
	},
	"@astryx.step.status.warning": {
		"defaultMessage": "warning",
		"description": "Screen-reader-only status word rendered next to a Stepper step label when status=warning. Lowercase noun/adjective; read mid-sentence after the step label."
	},
	"@astryx.step.status.error": {
		"defaultMessage": "error",
		"description": "Screen-reader-only status word rendered next to a Stepper step label when status=error. Lowercase noun; read mid-sentence after the step label."
	},
	"@astryx.tableTree.collapseRow": {
		"defaultMessage": "Collapse row",
		"description": "Aria label for the Table tree-data expander chevron when the row is currently expanded."
	},
	"@astryx.tableTree.expandRow": {
		"defaultMessage": "Expand row",
		"description": "Aria label for the Table tree-data expander chevron when the row is currently collapsed."
	},
	"@astryx.tableTree.collapseAllRows": {
		"defaultMessage": "Collapse all rows",
		"description": "Aria label for the Table tree-data header toggle when all rows are expanded and clicking it collapses them."
	},
	"@astryx.tableTree.expandAllRows": {
		"defaultMessage": "Expand all rows",
		"description": "Aria label for the Table tree-data header toggle when rows are collapsed and clicking it expands them."
	},
	"@astryx.textArea.charactersRemaining": {
		"defaultMessage": "{count, number} {count, plural, one {character} other {characters}} remaining",
		"description": "Screen-reader-only announcement of how many characters the user can still type before hitting a TextArea's maxLength. Announced politely as the count nears the limit. `{count}` is the number remaining — example: `12 characters remaining`."
	},
	"@astryx.textArea.charactersOverLimit": {
		"defaultMessage": "{count, number} {count, plural, one {character} other {characters}} over the limit",
		"description": "Screen-reader-only assertive announcement when the user has typed past a TextArea's maxLength. `{count}` is how many characters over — example: `3 characters over the limit`."
	},
	"@astryx.textInput.clearLabel": {
		"defaultMessage": "Clear {label}",
		"description": "Screen-reader-only label on the X that clears the value from a TextInput. Example: `Clear Email`, `Clear Name`."
	},
	"@astryx.thumbnail.remove": {
		"defaultMessage": "Remove {accessibleName}",
		"description": "Screen-reader-only label on the \"×\" on a Thumbnail (image preview chip). `{accessibleName}` is the thumbnail's name — example: `Remove profile.jpg`."
	},
	"@astryx.thumbnail.open": {
		"defaultMessage": "Open {accessibleName}",
		"description": "\"Open\" = launch/reveal (not \"unfold\" or the adjective). Screen-reader-only name on a clickable Thumbnail — example: `Open Sunset photo`."
	},
	"@astryx.thumbnail.fallbackName": {
		"defaultMessage": "Thumbnail",
		"description": "Generic screen-reader name for a Thumbnail (image preview) that has no `alt` or `label`. Last-resort fallback so the control is never nameless; prefer a real name via `alt` or `label`."
	},
	"@astryx.timeInput.clearLabel": {
		"defaultMessage": "Clear {label}",
		"description": "Screen-reader-only label on the X that clears the value from a TimeInput. Example: `Clear Start time`."
	},
	"@astryx.timestamp.copyValue": {
		"defaultMessage": "Copy {value}",
		"description": "Aria label on a Timestamp copyable-hover-card row's copy button, in its default state. `value` is the formatted instant that row shows (e.g. `Copy February 19, 2026 at 5:00:00 PM UTC`). Imperative verb. Pairs with `timestamp.copied` (post-click state)."
	},
	"@astryx.timestamp.copy": {
		"defaultMessage": "Copy",
		"description": "Short label shown in the tooltip on a Timestamp copyable-hover-card row's copy button (hover/focus), in its default state. Imperative verb. Pairs with `timestamp.copied` (post-click state). The full `copyValue` string remains the button's aria-label for assistive tech."
	},
	"@astryx.timestamp.copied": {
		"defaultMessage": "Copied",
		"description": "Aria label on a Timestamp copy button for ~1.5s after a successful copy, and the text announced to a polite live region. Past-participle (\"has been copied\"); pairs with `timestamp.copyValue`."
	},
	"@astryx.timestamp.detailsLabel": {
		"defaultMessage": "Timestamp details",
		"description": "Accessible name for the Timestamp copyable hover card popup, which lists the instant in the configured time zones/formats with a copy button per row."
	},
	"@astryx.token.remove": {
		"defaultMessage": "Remove {label}",
		"description": "Screen-reader-only label on the \"×\" on an individual Token/chip. Example: `Remove John Smith`, `Remove Active`. Imperative verb."
	},
	"@astryx.commandPalette.footer.navigate": {
		"defaultMessage": "Navigate",
		"description": "Keyboard hint in the CommandPalette footer, paired with up/down arrow key icons. Tells users arrow keys move between items."
	},
	"@astryx.commandPalette.footer.select": {
		"defaultMessage": "Select",
		"description": "Keyboard hint in the CommandPalette footer, paired with the Enter key icon. Tells users Enter activates the highlighted item."
	},
	"@astryx.commandPalette.footer.close": {
		"defaultMessage": "Close",
		"description": "Keyboard hint in the CommandPalette footer, paired with the Escape key icon. Tells users Escape dismisses the palette."
	},
	"@astryx.multiSelector.selectionCleared": {
		"defaultMessage": "Selection cleared",
		"description": "Polite screen-reader announcement after the last selected option in a MultiSelector is deselected. Live-region text, never shown on screen; past participle (\"has been cleared\")."
	},
	"@astryx.multiSelector.allSelected": {
		"defaultMessage": "All selected",
		"description": "Polite screen-reader announcement after every option in a MultiSelector becomes selected. Live-region text, never shown on screen; \"all\" is a determiner (as in \"all the options\")."
	},
	"@astryx.multiSelector.selectionCount": {
		"defaultMessage": "{count, number} of {total, number} selected",
		"description": "Polite screen-reader announcement of how many MultiSelector options are selected out of the total, spoken after each toggle. Live-region text, never shown on screen; example: `3 of 12 selected`."
	},
	"@astryx.multiSelector.emptySearchResults": {
		"defaultMessage": "No results found",
		"description": "Shown in a MultiSelector's dropdown panel when the search query matches no options, and announced in a polite live region at the same time. Short; neutral tone (not error-y)."
	},
	"@astryx.multiSelector.resultCount": {
		"defaultMessage": "{count, number} {count, plural, one {result} other {results}}",
		"description": "Polite screen-reader announcement of how many MultiSelector options match the search query, spoken as the user types. Live-region text, never shown on screen; example: `1 result`, `12 results`."
	},
	"@astryx.selector.emptySearchResults": {
		"defaultMessage": "No results found",
		"description": "Shown in a Selector's dropdown panel when the search query matches no options, and announced in a polite live region at the same time. Short; neutral tone (not error-y)."
	},
	"@astryx.selector.resultCount": {
		"defaultMessage": "{count, number} {count, plural, one {result} other {results}}",
		"description": "Polite screen-reader announcement of how many Selector options match the search query, spoken as the user types. Live-region text, never shown on screen; example: `1 result`, `12 results`."
	},
	"@astryx.typeahead.resultCount": {
		"defaultMessage": "{count, number} {count, plural, one {result} other {results}}",
		"description": "Polite screen-reader announcement of how many suggestions a Typeahead search returned. Live-region text, never shown on screen; example: `1 result`, `12 results`."
	},
	"@astryx.tokenizer.tokenAdded": {
		"defaultMessage": "Added {label}",
		"description": "Polite screen-reader announcement after a token is added to a Tokenizer, either picked from the suggestions or newly created. Live-region text, never shown on screen; `{label}` is the token's visible text."
	},
	"@astryx.tokenizer.tokenRemoved": {
		"defaultMessage": "Removed {label}",
		"description": "Polite screen-reader announcement after a token is removed from a Tokenizer, by its × button or by Backspace. Live-region text, never shown on screen; `{label}` is the token's visible text."
	},
	"@astryx.lightbox.imagePosition": {
		"defaultMessage": "Image {index, number} of {total, number}",
		"description": "Polite screen-reader announcement when a Lightbox moves to a media item that has no alt text. Live-region text, never shown on screen; `{index}` is 1-based, example: `Image 3 of 12`."
	},
	"@astryx.lightbox.mediaPosition": {
		"defaultMessage": "{alt}, {index, number} of {total, number}",
		"description": "Polite screen-reader announcement when a Lightbox moves to a media item that has alt text, composing that alt with the item's position. Live-region text, never shown on screen; example: `Sunset over the bay, 3 of 12`."
	},
	"@astryx.transferList.selectedLabel": {
		"defaultMessage": "Selected",
		"description": "Default heading above the right-hand panel of a lab TransferList, which holds the options the user has chosen. Consumers usually override this with a domain noun (e.g. \"Shown columns\")."
	},
	"@astryx.transferList.availableLabel": {
		"defaultMessage": "Available",
		"description": "Default heading above the left-hand panel of a lab TransferList, which holds the options not yet chosen. Consumers usually override this with a domain noun (e.g. \"Hidden columns\")."
	},
	"@astryx.transferList.ungroupedLabel": {
		"defaultMessage": "Other",
		"description": "Heading for the bucket of available options that have no `group` set, shown only when some options are grouped and some are not so the ungrouped ones still have a heading."
	},
	"@astryx.transferList.searchPlaceholder": {
		"defaultMessage": "Search…",
		"description": "Placeholder in the single search field that filters both panels of a lab TransferList. Same English as `selector.searchPlaceholder` but a separate key so it can be phrased for two lists."
	},
	"@astryx.transferList.searchLabel": {
		"defaultMessage": "Search {label}",
		"description": "Screen-reader-only label on the search field of a lab TransferList, naming what is being searched. `{label}` is the component's own label (e.g. \"Search Table columns\")."
	},
	"@astryx.transferList.selectedEmpty": {
		"defaultMessage": "No selected options",
		"description": "Message shown inside the selected panel of a lab TransferList when the user has chosen nothing yet."
	},
	"@astryx.transferList.availableEmpty": {
		"defaultMessage": "No available options",
		"description": "Message shown inside the available panel of a lab TransferList when every option has already been moved to the selected panel."
	},
	"@astryx.transferList.noResults": {
		"defaultMessage": "No results",
		"description": "Message shown inside either panel of a lab TransferList when the search query matches nothing in that panel."
	},
	"@astryx.transferList.clear": {
		"defaultMessage": "Clear",
		"description": "Label on the bulk action in a lab TransferList's selected-panel header that removes every option that is allowed to be removed. Locked options stay."
	},
	"@astryx.transferList.addAll": {
		"defaultMessage": "Add all",
		"description": "Label on the bulk action in a lab TransferList's available-panel header that moves every remaining option into the selected panel."
	},
	"@astryx.transferList.addOption": {
		"defaultMessage": "Add {label}",
		"description": "Accessible label on the per-row + button that moves one option into the selected panel of a lab TransferList. `{label}` is that option's visible text (e.g. \"Add Owner\")."
	},
	"@astryx.transferList.removeOption": {
		"defaultMessage": "Remove {label}",
		"description": "Accessible label on the per-row × button that moves one option out of the selected panel of a lab TransferList. `{label}` is that option's visible text (e.g. \"Remove Name\")."
	},
	"@astryx.transferList.reorderOption": {
		"defaultMessage": "Reorder {label}",
		"description": "Accessible label on the per-row drag handle that reorders one option within the selected panel of a lab TransferList. `{label}` is that option's visible text (e.g. \"Reorder Name\")."
	},
	"@astryx.transferList.transferDisabled": {
		"defaultMessage": "{label} cannot be moved",
		"description": "Default tooltip explaining why a locked option in a lab TransferList cannot be transferred between panels. `{label}` is the option's visible text. Consumers may override per option."
	},
	"@astryx.transferList.reorderDisabled": {
		"defaultMessage": "{label} cannot be reordered",
		"description": "Default tooltip explaining why a locked option in a lab TransferList cannot be moved within the selected panel. `{label}` is the option's visible text. Consumers may override per option."
	},
	"@astryx.transferList.reorderInstructions": {
		"defaultMessage": "Press Space or Enter to pick up an item. Use Arrow Up, Arrow Down, Home, or End to move it. Press Space or Enter to drop, or Escape to cancel.",
		"description": "Screen-reader-only instructions describing the keyboard reorder contract, referenced by every drag handle in a lab TransferList. Never shown on screen. Name the actual keys your locale's users press."
	},
	"@astryx.transferList.announceAdded": {
		"defaultMessage": "{label} added. {count, number} {count, plural, one {item} other {items}} selected.",
		"description": "Polite screen-reader announcement after one option moves into the selected panel of a lab TransferList. Live-region text, never shown on screen; `{label}` is the option's visible text and `{count}` is the new selected total."
	},
	"@astryx.transferList.announceRemoved": {
		"defaultMessage": "{label} removed. {count, number} {count, plural, one {item} other {items}} selected.",
		"description": "Polite screen-reader announcement after one option moves out of the selected panel of a lab TransferList. Live-region text, never shown on screen; `{label}` is the option's visible text and `{count}` is the new selected total."
	},
	"@astryx.transferList.announceBulkAdded": {
		"defaultMessage": "{count, number} {count, plural, one {item} other {items}} added.",
		"description": "Polite screen-reader announcement after the Add all bulk action in a lab TransferList. Live-region text, never shown on screen; `{count}` is how many options moved."
	},
	"@astryx.transferList.announceBulkRemoved": {
		"defaultMessage": "{count, number} {count, plural, one {item} other {items}} removed.",
		"description": "Polite screen-reader announcement after the Clear bulk action in a lab TransferList. Live-region text, never shown on screen; `{count}` is how many options moved."
	},
	"@astryx.transferList.announceGrabbed": {
		"defaultMessage": "{label} picked up, position {position, number} of {total, number}. Use arrow keys to move, Space or Enter to drop, or Escape to cancel.",
		"description": "Polite screen-reader announcement when a lab TransferList row enters keyboard reorder mode. Live-region text, never shown on screen; `{position}` is 1-based within the selected panel."
	},
	"@astryx.transferList.announceMoveCancelled": {
		"defaultMessage": "{label} move cancelled.",
		"description": "Polite screen-reader announcement when a lab TransferList reorder is abandoned with Escape or a cancelled pointer drag, restoring the original order. Live-region text, never shown on screen."
	},
	"@astryx.transferList.announceDropped": {
		"defaultMessage": "{label} dropped at position {position, number} of {total, number}.",
		"description": "Polite screen-reader announcement when a lab TransferList reorder commits at a new position. Live-region text, never shown on screen; `{position}` is 1-based within the selected panel."
	},
	"@astryx.transferList.announceReturned": {
		"defaultMessage": "{label} returned to position {position, number}.",
		"description": "Polite screen-reader announcement when a lab TransferList pointer drag ends where it began, so the order did not change. Live-region text, never shown on screen; `{position}` is 1-based."
	},
	"@astryx.transferList.announceMovedToPosition": {
		"defaultMessage": "{label}, position {position, number} of {total, number}.",
		"description": "Polite screen-reader announcement after each arrow-key step of an in-progress lab TransferList reorder. Live-region text, never shown on screen; `{position}` is 1-based within the selected panel."
	},
	"@astryx.transferList.announceSearchResults": {
		"defaultMessage": "{count, number} {count, plural, one {item} other {items}} found.",
		"description": "Polite screen-reader announcement of how many options a lab TransferList search matched across both panels. Live-region text, never shown on screen."
	},
	"@astryx.transferListSelector.apply": {
		"defaultMessage": "Apply",
		"description": "Label on the button that commits the staged draft of a lab TransferListSelector and closes it. Only rendered in staged commit mode."
	},
	"@astryx.transferListSelector.cancel": {
		"defaultMessage": "Cancel",
		"description": "Label on the button that discards the staged draft of a lab TransferListSelector and closes it. Only rendered in staged commit mode."
	},
	"@astryx.transferListSelector.triggerLabel": {
		"defaultMessage": "{count, number} selected",
		"description": "Default summary on the closed trigger of a lab TransferListSelector, stating how many options are currently chosen. Consumers usually override this with a domain phrase (e.g. \"7 columns\")."
	}
};
/**
* Cache of parsed ICU MessageFormat objects keyed by `${locale}::${message}`.
* IntlMessageFormat parsing is non-trivial; caching avoids reparsing on every
* render. The cache is unbounded in principle but bounded in practice by the
* static set of astryx keys.
*/
var formatterCache = /* @__PURE__ */ new Map();
function getFormatter(message, locale) {
	const cacheKey = `${locale}::${message}`;
	let f = formatterCache.get(cacheKey);
	if (f === void 0) {
		f = new intl_messageformat_default(message, locale);
		formatterCache.set(cacheKey, f);
	}
	return f;
}
/**
* Walk a BCP 47 tag from most-specific to least-specific.
* Input is canonicalized via `Intl.Locale.baseName` so `pt-br` and `PT-BR`
* both produce `['pt-BR', 'pt']`.
*
* Examples:
*   'pt-BR'      → ['pt-BR', 'pt']
*   'zh-Hans-CN' → ['zh-Hans-CN', 'zh-Hans', 'zh']
*   'en'         → ['en']
*
* `en` is intentionally NOT appended here — the caller falls back to the
* shipped en catalog separately as the final source-of-truth.
*/
function resolveLocaleChain(locale) {
	let canonical;
	try {
		canonical = new Intl.Locale(locale).baseName;
	} catch {
		canonical = locale;
	}
	const parts = canonical.split("-");
	const chain = [];
	for (let i = parts.length; i > 0; i--) chain.push(parts.slice(0, i).join("-"));
	return chain;
}
function getLookup(locale, messages, overrides) {
	const lookup = {};
	const chain = resolveLocaleChain(locale);
	if (overrides !== void 0) {
		for (const tag of chain) if (overrides[tag]) {
			for (const [key, value] of Object.entries(overrides[tag])) if (lookup[key] === void 0 && value !== null) lookup[key] = value;
		}
	}
	for (const tag of chain) if (messages[tag]) {
		for (const [key, value] of Object.entries(messages[tag])) if (lookup[key] === void 0 && value?.defaultMessage !== null) lookup[key] = value?.defaultMessage;
	}
	return lookup;
}
function getResolve(locale, messages, overrides) {
	const lookup = getLookup(locale, messages, overrides);
	return (key, values) => {
		const result = lookup[key] ?? EN_CATALOG[key]?.defaultMessage;
		if (result === void 0) {
			`${locale}${key}`, `${key}${locale}`;
			return key;
		}
		if (values === void 0) return result;
		return getFormatter(result, locale).format(values);
	};
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/i18n/InternationalizationContext.js
/**
* @file InternationalizationContext.ts
* @input React createContext, i18n types
* @output Exports InternationalizationContext and InternationalizationContextValue
* @position Context definition for client-side locale + messages
*
* Separated from InternationalizationProvider.tsx so components can consume
* the context without pulling in the full provider implementation.
* Follows the LinkContext.ts / ThemeContext.ts pattern.
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/i18n/InternationalizationProvider.tsx
* - /packages/core/src/i18n/t.client.ts
* - /packages/core/src/i18n/useDirection.ts
* - /packages/core/src/i18n/useLocale.ts
* - /packages/core/src/i18n/useCollator.ts
* - /packages/core/src/i18n/getLocaleDirection.ts
* - /packages/core/src/i18n/index.ts
*/
/**
* Default value falls through to the shipped en catalog in resolve().
* A consumer that doesn't render a provider still gets English defaults.
*/
var InternationalizationContext = /*#__PURE__*/ (0, import_react.createContext)({
	locale: "en",
	direction: "ltr",
	messages: {},
	translate: getResolve("en", {})
});
InternationalizationContext.displayName = "InternationalizationContext";
//#endregion
//#region node_modules/@astryxdesign/core/dist/i18n/useTranslator.js
/**
* @file useTranslator.ts
* @input InternationalizationContext (via use())
* @output Exports useTranslator hook returning a stable translator function
* @position Client-side hook for translating outside of render (event handlers,
*   effects, non-component code) while still resolving against the current
*   provider's locale.
*
* Prefer `t()` for translations at the callsite during render. When you need
* to translate inside an event handler or effect, capture a translator during
* render via useTranslator() and call it later.
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/i18n/index.ts
* - /packages/core/src/i18n/t.client.ts
*/
/**
* Returns a translator function bound to the current provider's locale.
* Safe to call from event handlers and effects.
*
* @example
* ```
* function MyComponent() {
*   const translate = useTranslator();
*   const onClick = () => announce(translate('@astryx.pagination.pageAnnounce', {current: 1}));
* }
* ```
*/
function useTranslator() {
	return (0, import_react.use)(InternationalizationContext).translate;
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/Button/Button.js
/**
* @file Button.tsx
* @input Uses React, ButtonHTMLAttributes, ReactNode, i18n (useTranslator)
* @output Exports Button component, ButtonProps, ButtonVariant types
* @position Core implementation; consumed by index.ts, tested by Button.test.tsx
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/Button/Button.doc.mjs (props table, features, implementation notes)
* - /packages/core/src/Button/Button.test.tsx (tests for new/changed behavior)
* - /packages/core/src/Button/index.ts (exports if types change)
* - /apps/storybook/stories/Button.stories.tsx (storybook stories)
* - /packages/cli/assets/templates/blocks/components/Button/ (showcase blocks)
*
* Last synced props: label, variant, size, isDisabled, isLoading, isInterruptible, clickAction, icon, isIconOnly, width, children, tooltip, endContent, href, as, target, rel
*/
/**
* Base button styles
* Pseudo-classes are nested within properties per StyleX recommendation:
* https://stylexjs.com/docs/learn/styling-ui/defining-styles#pseudo-classes
*/
var styles$31 = {
	base: {
		"--button-focus-offset": "x16bblx1",
		kInvED: "x1wfwxd8 x13aywxo",
		kVAEAm: "x1n2onr6",
		k1xSpc: "x3nfvp2",
		kGNEyG: "x6s0dn4",
		kjj79g: "xl56j7k",
		kOIVth: "x1txdalj",
		k8WAf4: "xce4md1",
		kg3NbH: "xrrkdod",
		kMzoRj: "xc342km",
		ksu8eU: "xng3xce",
		kaIpWk: "x1jxw6zd",
		kMv6JI: "xjb2p0i",
		kGuDYH: "xcr08ib",
		kLWn49: "x1kq96og",
		k63SB2: "x1e4wzip",
		khDVqt: "xuxw1ft",
		kkrTdU: "x1ypdohk x16khyan",
		k1ekBW: "xrafxwg",
		kIyJzY: "xuedmi6 x12w9bfk",
		kAMwcw: "xlr8y92",
		$$css: true
	},
	pressable: {
		k3aq6I: "x3oybdh xk4oym4",
		$$css: true
	},
	disabled: {
		kkrTdU: "xt0e3qv",
		kSiTet: "xbyyjgo",
		kKwaWg: "x18o3ruo",
		k3aq6I: "x1c071of x1pdlv7q",
		$$css: true
	},
	ariaDisabled: {
		kKwaWg: "x18o3ruo xuqm82a",
		$$css: true
	},
	iconOnly: {
		"--button-icon-only-aspect": "x1v15ycx",
		kOBAk4: "xioom0i",
		kg3NbH: "xnjsko4",
		k8WAf4: "xt970qd",
		$$css: true
	},
	iconWrapper: {
		k1xSpc: "x3nfvp2",
		kGNEyG: "x6s0dn4",
		kjj79g: "xl56j7k",
		kmuXW: "x2lah0s",
		$$css: true
	},
	contentWrapper: {
		k1xSpc: "xjp7ctv",
		$$css: true
	},
	link: {
		kybGjl: "x1hl2dhg",
		$$css: true
	}
};
var dynamicStyles$11 = { width: (width) => [{
	kzqmXN: width != null ? "x5lhr3w" : width,
	$$css: true
}, { "--x-width": ((val) => typeof val === "number" ? val + "px" : val != null ? val : void 0)(width) }] };
var sizeStyles$3 = {
	sm: {
		kZKoxP: "x6k0iem",
		$$css: true
	},
	md: {
		kZKoxP: "x1ueg155",
		$$css: true
	},
	lg: {
		kZKoxP: "xssyfek",
		$$css: true
	}
};
/**
* Icon size per button size.
* Matches Icon sizing: sm/md=16px, lg=20px.
* fontSize is set so emoji and text-based icons scale correctly.
*/
var iconSizeStyles = {
	sm: {
		kzqmXN: "x1kky2od",
		kZKoxP: "xlup9mm",
		kGuDYH: "x1j61zf2",
		$$css: true
	},
	md: {
		kzqmXN: "x1kky2od",
		kZKoxP: "xlup9mm",
		kGuDYH: "x1j61zf2",
		$$css: true
	},
	lg: {
		kzqmXN: "xw4jnvo",
		kZKoxP: "x1qx5ct2",
		kGuDYH: "xwsyq91",
		$$css: true
	}
};
/**
* Resting elevation for floating buttons (e.g. a FAB). `none` is the default
* flat button; `low`/`med`/`high` map to the shadow token scale. 'none' stays
* a literal so it never conflicts with a variant's background layering.
*/
var elevationStyles$1 = {
	none: {
		kGVxlE: "x1gnnqk1",
		$$css: true
	},
	low: {
		kGVxlE: "x1i5ehqx",
		$$css: true
	},
	med: {
		kGVxlE: "x14hfi27",
		$$css: true
	},
	high: {
		kGVxlE: "x1kcpxr7",
		$$css: true
	}
};
/**
* Variant styles using backgroundImage for layered colors
* Pseudo-classes are nested within properties per StyleX recommendation
* Overlay is stacked on top of base color using multiple linear-gradients
* Focus outline is shared across variants for consistent keyboard affordance.
*/
var variants = {
	primary: {
		kWkggS: "x1ewilqj",
		kMwMTN: "x17wrial",
		$$css: true
	},
	secondary: {
		kWkggS: "x17x4s8c",
		kMwMTN: "x1tgivj0",
		$$css: true
	},
	ghost: {
		kWkggS: "xjbqb8w",
		kMwMTN: "x1tgivj0",
		$$css: true
	},
	destructive: {
		kWkggS: "x1pjz0fi",
		kMwMTN: "x1m024r3",
		kjBf7l: "x1e0x2sz",
		$$css: true
	}
};
durationVars["--duration-medium-min"];
var loadingStyles = {
	hiddenContent: {
		kMwMTN: "x19co3pv",
		$$css: true
	},
	hiddenContentDelayed: {
		kKVMdj: "x1ffowhz",
		k44tkh: "xjlvqhv",
		kWV6AL: "x10e4vud",
		kKxzle: "x17yabm6 x14q22ui",
		$$css: true
	}
};
var groupStyles$1 = {
	horizontal: {
		krdFHd: "x15mokao x8eehn2",
		kVL7Gh: "xbiv7yw x1xrp5p4",
		kfmiAY: "x1ga7v0g x1tzxhge",
		kT0f0o: "x16uus16 x1rmb4wm",
		k2ei4v: "xgbv0en x1pjv70x",
		kVhnKS: "x1t7ytsu xyf0ibl",
		kGJrpR: "x1j92z86",
		$$css: true
	},
	vertical: {
		krdFHd: "x15mokao x8eehn2",
		kfmiAY: "x1ga7v0g x2qxyot",
		kVL7Gh: "xbiv7yw xturttb",
		kT0f0o: "x16uus16 x1rmb4wm",
		kEafiO: "x11xkdxz x1g31smg",
		kPef9Z: "x13fuv20 x1d9v4yf",
		kLZC3w: "x1pc3f07",
		$$css: true
	},
	onSolidHorizontal: {
		kGJrpR: "xrvmtm5",
		$$css: true
	},
	onSolidVertical: {
		kLZC3w: "x11npmm7",
		$$css: true
	}
};
/**
* A versatile button component with multiple variants.
*
* Styles use Astryx theme tokens via StyleX.
* Wrap your app in <Theme> to apply a theme.
* Themes can provide component-level variant overrides via theme.components.button.variants
*
* When `href` is provided (and the button is not disabled), renders as an `<a>`
* element (or custom link component) with full button styling, enabling native
* browser behaviors like right-click → open in new tab and Cmd+Click.
*
* @example
* ```
* <Button label="Click me" />
* <Button label="Primary action" variant="primary" />
* <Button label="Delete" variant="destructive" />
* <Button label="Settings" icon={<GearIcon />} variant="ghost" isIconOnly />
* <Button label="Pick emoji" icon={<span>🚀</span>} variant="ghost" size="sm" isIconOnly />
* <Button label="Edit" icon={<PencilIcon />} />
* <Button label="Messages" endContent={<Badge label={3} />} />
* <Button label="Edit" icon={<PencilIcon />} endContent={<Badge label="New" />} />
* <Button label="Sign in" variant="primary" width="100%" />
* <Button label="Visit site" href="https://example.com" variant="primary" />
* <Button label="Open in new tab" href="https://example.com" target="_blank" rel="noopener noreferrer" />
* ```
*/
function Button({ label, variant = "secondary", size: sizeProp, type = "button", isDisabled = false, isLoading = false, isInterruptible = false, clickAction, icon, isIconOnly = false, width, elevation = "none", children, endContent, tooltip, href, as, target, rel, xstyle, className, style, ref, ...props$24 }) {
	const t = useTranslator();
	const size = useSize(sizeProp, "md");
	const buttonGroup = useButtonGroup();
	const [isPending, startTransition] = (0, import_react.useTransition)();
	const actionInFlightRef = (0, import_react.useRef)(false);
	const isLoadingState = isLoading || isPending;
	const delaySpinner = isPending || isInterruptible;
	const groupDisabled = buttonGroup?.isDisabled ?? false;
	const buttonDisabled = isDisabled || groupDisabled || isLoadingState && !isInterruptible;
	const LinkComponent = useLinkComponent(as);
	const renderAsLink = href != null && !buttonDisabled;
	const useAriaDisabled = tooltip != null && buttonDisabled;
	const tooltipHook = useTooltip({
		placement: "above",
		isEnabled: tooltip != null
	});
	const handleClick = (e) => {
		if (buttonDisabled || actionInFlightRef.current && !isInterruptible) {
			e.preventDefault();
			return;
		}
		props$24.onClick?.(e);
		if (clickAction && !e.defaultPrevented) {
			actionInFlightRef.current = true;
			startTransition(async () => {
				try {
					await clickAction(e);
				} finally {
					actionInFlightRef.current = false;
				}
			});
		}
	};
	const handleKeyDown = useAriaDisabled ? (e) => {
		if (e.key === "Enter" || e.key === " ") e.preventDefault();
		else props$24.onKeyDown?.(e);
	} : void 0;
	const edgeCompAttr = variant === "ghost" ? { [EDGE_COMP_ATTR]: "" } : null;
	const sharedStylexProps = focusOutlineProps.focusVisible(styles$31.base, sizeStyles$3[size], isIconOnly && styles$31.iconOnly, interactionOverlayStyles.backgroundImage, buttonDisabled && styles$31.disabled, useAriaDisabled && styles$31.ariaDisabled, renderAsLink && styles$31.link, !buttonGroup && styles$31.pressable, buttonGroup && (buttonGroup.orientation === "horizontal" ? groupStyles$1.horizontal : groupStyles$1.vertical), buttonGroup && (variant === "primary" || variant === "destructive") && (buttonGroup.orientation === "horizontal" ? groupStyles$1.onSolidHorizontal : groupStyles$1.onSolidVertical), !buttonGroup && elevationStyles$1[elevation], width != null && dynamicStyles$11.width(width), variants[variant], xstyle);
	const sharedMergedProps = mergeProps(themeProps("button", {
		variant,
		size,
		elevation: buttonGroup ? "none" : elevation
	}), sharedStylexProps, className, style);
	const buttonContent = /*#__PURE__*/ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		isLoadingState && /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
			...{
				0: { className: "x10l6tqk x13vifvy x1o0tod xtijo5x x1ey2m1c xrvj5dj x1ku5rj1" },
				1: { className: "x10l6tqk x13vifvy x1o0tod xtijo5x x1ey2m1c xrvj5dj x1ku5rj1 xqcmdr3 xb2rp9n xskzprw x17yabm6 x14q22ui" }
			}[!!delaySpinner << 0],
			"aria-hidden": "true",
			children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Spinner, {
				size: "sm",
				shade: "inherit"
			})
		}),
		/*#__PURE__*/ (0, import_jsx_runtime.jsxs)("span", {
			...props(styles$31.contentWrapper, isLoadingState && (delaySpinner ? loadingStyles.hiddenContentDelayed : loadingStyles.hiddenContent)),
			"aria-hidden": isLoadingState || void 0,
			children: [
				icon && /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
					...props(styles$31.iconWrapper, iconSizeStyles[size]),
					children: icon
				}),
				isIconOnly ? null : /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
					className: "xb3r6kr xlyipyv xeuugli",
					children: children ?? label
				}),
				!isIconOnly && endContent && /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
					className: "x3nfvp2 x6s0dn4 x1heor9g",
					children: endContent
				})
			]
		}),
		/*#__PURE__*/ (0, import_jsx_runtime.jsx)(VisuallyHidden, {
			role: "status",
			"aria-live": "polite",
			children: isLoadingState ? t("@astryx.button.loading") : ""
		})
	] });
	const ariaLabelProp = isIconOnly && label !== "" || isLoadingState && !isIconOnly || children != null && children !== label ? { "aria-label": label } : null;
	const describedByProp = tooltip != null ? { "aria-describedby": [props$24["aria-describedby"], tooltipHook.describedBy].filter(Boolean).join(" ") || void 0 } : null;
	const mergedButtonRef = useMergedRefs(ref, tooltip != null ? tooltipHook.ref : void 0);
	let element;
	if (renderAsLink) element = /*#__PURE__*/ (0, import_jsx_runtime.jsx)(LinkComponent, {
		ref: mergedButtonRef,
		href,
		target,
		rel,
		...sharedMergedProps,
		...props$24,
		...ariaLabelProp,
		...describedByProp,
		...edgeCompAttr,
		"aria-busy": isLoadingState || void 0,
		onClick: handleClick,
		children: buttonContent
	});
	else element = /*#__PURE__*/ (0, import_jsx_runtime.jsx)("button", {
		ref: mergedButtonRef,
		type,
		disabled: useAriaDisabled ? void 0 : buttonDisabled,
		...sharedMergedProps,
		...props$24,
		...ariaLabelProp,
		...describedByProp,
		...edgeCompAttr,
		"aria-busy": isLoadingState || void 0,
		"aria-disabled": useAriaDisabled || void 0,
		onClick: handleClick,
		...handleKeyDown ? { onKeyDown: handleKeyDown } : null,
		children: buttonContent
	});
	if (tooltip) return /*#__PURE__*/ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [element, tooltipHook.renderTooltip(tooltip)] });
	return element;
}
Button.displayName = "Button";
//#endregion
//#region node_modules/@astryxdesign/core/dist/Icon/defaultIcons.js
/**
* @file defaultIcons.tsx
* @input Uses React JSX for inline SVGs
* @output Exports defaultIcons registry with lightweight SVG fallbacks
* @position Fallback icons used when no theme provides an icon registry
*
* These are intentionally minimal inline SVGs (~1.4KB total) that provide
* basic visual completeness without any external icon library dependency.
* Themes should override these with higher-quality icons from a proper
* icon library (heroicons, lucide, Material Symbols, etc.).
*
* All icons:
* - Use a 24x24 viewBox
* - Use currentColor for stroke/fill (inherits from parent)
* - Are aria-hidden (decorative by default)
* - Use stroke-based rendering with 1.5px stroke width (matching heroicons outline style)
* - Status icons (checkCircle, xCircle, warning, info) use solid fills for better color visibility
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/Icon/globalIconRegistry.tsx (IconName type if names change)
* - /packages/core/src/Icon/Icon.doc.mjs (fallback icon documentation)
*/
var svgProps = {
	xmlns: "http://www.w3.org/2000/svg",
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 1.5,
	strokeLinecap: "round",
	strokeLinejoin: "round",
	width: "1em",
	height: "1em",
	"aria-hidden": true
};
/**
* Props for solid/filled SVG icons.
* Status icons (checkCircle, xCircle, warning, info) use solid fills for better
* color visibility at small sizes, matching the heroicons solid style
* used by themes.
*/
var solidSvgProps = {
	xmlns: "http://www.w3.org/2000/svg",
	viewBox: "0 0 24 24",
	fill: "currentColor",
	width: "1em",
	height: "1em",
	"aria-hidden": true
};
var defaultIcons = {
	/** ✕ — two diagonal lines */
	close: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("svg", {
		...svgProps,
		children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("path", { d: "M6 6l12 12M6 18L18 6" })
	}),
	/** ▾ — downward chevron */
	chevronDown: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("svg", {
		...svgProps,
		children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("path", { d: "M6 9l6 6 6-6" })
	}),
	/** ⌄ — compact NumberInput stepper chevron */
	"numberInput:stepperDown": /*#__PURE__*/ (0, import_jsx_runtime.jsx)("svg", {
		...svgProps,
		children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("path", { d: "M7.5 9.75l4.5 4.5 4.5-4.5" })
	}),
	/** ‹ — left chevron */
	chevronLeft: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("svg", {
		...svgProps,
		children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("path", { d: "M15 6l-6 6 6 6" })
	}),
	/** › — right chevron */
	chevronRight: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("svg", {
		...svgProps,
		children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("path", { d: "M9 6l6 6-6 6" })
	}),
	/** « — double left chevron (first / jump to start) */
	chevronsLeft: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("svg", {
		...svgProps,
		children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("path", { d: "M18 6l-6 6 6 6M11 6l-6 6 6 6" })
	}),
	/** » — double right chevron (last / jump to end) */
	chevronsRight: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("svg", {
		...svgProps,
		children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("path", { d: "M6 6l6 6-6 6M13 6l6 6-6 6" })
	}),
	/** ✓ — checkmark */
	check: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("svg", {
		...svgProps,
		children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("path", { d: "M5 13l4 4L19 7" })
	}),
	/** ✓ in circle — success state (solid fill for status visibility) */
	success: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("svg", {
		...solidSvgProps,
		children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("path", {
			fillRule: "evenodd",
			clipRule: "evenodd",
			d: "M12 3a9 9 0 100 18 9 9 0 000-18zm4.06 6.56a.75.75 0 00-1.12-1l-3.94 4.4-1.94-1.94a.75.75 0 00-1.06 1.06l2.5 2.5a.75.75 0 001.09-.03l4.47-5z"
		})
	}),
	/** ✕ in circle — error state (solid fill for status visibility) */
	error: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("svg", {
		...solidSvgProps,
		children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("path", {
			fillRule: "evenodd",
			clipRule: "evenodd",
			d: "M12 3a9 9 0 100 18 9 9 0 000-18zm-2.47 5.47a.75.75 0 00-1.06 1.06L10.94 12l-2.47 2.47a.75.75 0 101.06 1.06L12 13.06l2.47 2.47a.75.75 0 101.06-1.06L13.06 12l2.47-2.47a.75.75 0 00-1.06-1.06L12 10.94l-2.47-2.47z"
		})
	}),
	/** △ with ! — warning (solid fill for status visibility) */
	warning: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("svg", {
		...solidSvgProps,
		children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("path", {
			fillRule: "evenodd",
			clipRule: "evenodd",
			d: "M10.29 3.86L2.07 19.05A2 2 0 003.78 22h16.44a2 2 0 001.71-2.95L13.71 3.86a2 2 0 00-3.42 0zM12 9a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0112 9zm0 9a1 1 0 100-2 1 1 0 000 2z"
		})
	}),
	/** ⓘ — information (solid fill for status visibility) */
	info: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("svg", {
		...solidSvgProps,
		children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("path", {
			fillRule: "evenodd",
			clipRule: "evenodd",
			d: "M12 3a9 9 0 100 18 9 9 0 000-18zm0 4a1 1 0 100 2 1 1 0 000-2zm-.75 3.75a.75.75 0 011.5 0v5.5a.75.75 0 01-1.5 0v-5.5z"
		})
	}),
	/** 📅 — calendar */
	calendar: /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("svg", {
		...svgProps,
		children: [/*#__PURE__*/ (0, import_jsx_runtime.jsx)("rect", {
			x: "3",
			y: "4",
			width: "18",
			height: "18",
			rx: "2"
		}), /*#__PURE__*/ (0, import_jsx_runtime.jsx)("path", { d: "M16 2v4M8 2v4M3 10h18" })]
	}),
	/** 🕐 — clock */
	clock: /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("svg", {
		...svgProps,
		children: [/*#__PURE__*/ (0, import_jsx_runtime.jsx)("circle", {
			cx: "12",
			cy: "12",
			r: "9"
		}), /*#__PURE__*/ (0, import_jsx_runtime.jsx)("path", { d: "M12 7v5l3 3" })]
	}),
	/** ↗ — external link arrow */
	externalLink: /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("svg", {
		...svgProps,
		children: [
			/*#__PURE__*/ (0, import_jsx_runtime.jsx)("path", { d: "M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" }),
			/*#__PURE__*/ (0, import_jsx_runtime.jsx)("path", { d: "M15 3h6v6" }),
			/*#__PURE__*/ (0, import_jsx_runtime.jsx)("path", { d: "M10 14L21 3" })
		]
	}),
	/** ☰ — hamburger menu (three horizontal lines) */
	menu: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("svg", {
		...svgProps,
		strokeWidth: 2,
		children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("path", { d: "M4 6h16M4 12h16M4 18h16" })
	}),
	/** ⋯ — three horizontal dots (more/overflow) */
	moreHorizontal: /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("svg", {
		...solidSvgProps,
		children: [
			/*#__PURE__*/ (0, import_jsx_runtime.jsx)("circle", {
				cx: "5",
				cy: "12",
				r: "1.5"
			}),
			/*#__PURE__*/ (0, import_jsx_runtime.jsx)("circle", {
				cx: "12",
				cy: "12",
				r: "1.5"
			}),
			/*#__PURE__*/ (0, import_jsx_runtime.jsx)("circle", {
				cx: "19",
				cy: "12",
				r: "1.5"
			})
		]
	}),
	/** 🔍 — magnifying glass (search) */
	search: /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("svg", {
		...svgProps,
		children: [/*#__PURE__*/ (0, import_jsx_runtime.jsx)("circle", {
			cx: "11",
			cy: "11",
			r: "8"
		}), /*#__PURE__*/ (0, import_jsx_runtime.jsx)("path", { d: "M21 21l-4.35-4.35" })]
	}),
	/** ↑ — arrow up (sort ascending) */
	arrowUp: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("svg", {
		...svgProps,
		children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("path", { d: "M12 19V5m0 0l-7 7m7-7l7 7" })
	}),
	/** ↓ — arrow down (sort descending) */
	arrowDown: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("svg", {
		...svgProps,
		children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("path", { d: "M12 5v14m0 0l7-7m-7 7l-7-7" })
	}),
	/** ↕ — arrows up-down (unsorted / sortable indicator) */
	arrowsUpDown: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("svg", {
		...svgProps,
		children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("path", { d: "M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" })
	}),
	/** 🔽 — funnel (filter indicator) */
	funnel: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("svg", {
		...svgProps,
		children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("path", { d: "M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" })
	}),
	/** 👁‍🗨 — eye with slash (hidden column) */
	eyeSlash: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("svg", {
		...svgProps,
		children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("path", { d: "M3.98 8.223A10.477 10.477 0 001.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" })
	}),
	/** ☐☐ — view columns (column settings) */
	viewColumns: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("svg", {
		...svgProps,
		children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("path", { d: "M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z" })
	}),
	/** clipboard — copy to clipboard */
	copy: /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("svg", {
		...svgProps,
		children: [/*#__PURE__*/ (0, import_jsx_runtime.jsx)("path", { d: "M8 4v12a2 2 0 002 2h8a2 2 0 002-2V7.242a2 2 0 00-.602-1.43L16.083 2.57A2 2 0 0014.685 2H10a2 2 0 00-2 2z" }), /*#__PURE__*/ (0, import_jsx_runtime.jsx)("path", { d: "M16 18v2a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2h2" })]
	}),
	/** ✓✓ — double checkmark (delivered/read) */
	checkDouble: /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("svg", {
		...svgProps,
		children: [/*#__PURE__*/ (0, import_jsx_runtime.jsx)("path", { d: "M2 13l4 4L14 7" }), /*#__PURE__*/ (0, import_jsx_runtime.jsx)("path", { d: "M9 13l4 4L21 7" })]
	}),
	wrench: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("svg", {
		...svgProps,
		children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("path", { d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" })
	}),
	/** ■ — stop (rounded square, solid fill for media control) */
	stop: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("svg", {
		...solidSvgProps,
		children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("rect", {
			x: "6",
			y: "6",
			width: "12",
			height: "12",
			rx: "2"
		})
	}),
	/** 🎤 — microphone (voice input / dictation) */
	microphone: /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("svg", {
		...svgProps,
		children: [
			/*#__PURE__*/ (0, import_jsx_runtime.jsx)("path", { d: "M12 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3z" }),
			/*#__PURE__*/ (0, import_jsx_runtime.jsx)("path", { d: "M19 10v1a7 7 0 01-14 0v-1" }),
			/*#__PURE__*/ (0, import_jsx_runtime.jsx)("path", { d: "M12 18v4m-4 0h8" })
		]
	})
};
//#endregion
//#region node_modules/@astryxdesign/core/dist/Icon/globalIconRegistry.js
/**
* @file globalIconRegistry.tsx
* @input None (pure module-level state)
* @output Exports registerIcons, getIconRegistry, getIcon, resetIcons, IconName, IconRegistry
* @position Global and theme-scoped icon registry; works in server and client environments
*
* This module has NO 'use client' directive — it's importable from RSC.
* Components resolve semantic icons through getIcon() or the client useIcon() hook.
*/
/**
* Semantic icon names used internally by Astryx components.
*
* These represent the functional purpose of each icon, not a specific
* visual representation. Themes provide the actual icon components.
*/
/**
* A namespaced extension key, `'<namespace>:<name>'`.
*
* This is the tier for a glyph that belongs to one component or library rather
* than to the system: `'richtext:bold'`, `'numberInput:stepperDown'`. A theme
* overrides it by key through `registerIcons` or `defineTheme({icons})`,
* exactly as it overrides a built-in name, and the core {@link IconName} union
* stays reserved for glyphs the whole system shares.
*
* Accepted anywhere a built-in name is, including `<Icon icon>` — which is
* what lets a namespaced glyph keep `size`, `color` and `xstyle`.
*/
/**
* A semantic icon name — either one of the built-in {@link IconName}s or an
* arbitrary string key contributed by a library/app.
*
* The `(string & {})` intersection keeps the built-in names available for
* autocomplete while still allowing any string, so downstream libraries can
* register and resolve their own keys (e.g. `'richtext:bold'`) without having
* to widen the core `IconName` union.
*/
/**
* Icon registry mapping semantic names to React nodes.
*/
var globalRegistry = {};
function getThemeIconOverrides(source) {
	if (source == null) return null;
	if (typeof source === "string") return getRegisteredTheme(source)?.icons ?? null;
	return source.icons ?? null;
}
/**
* Get an icon by name from the global registry, falling back to defaults.
*
* Works in both server and client environments.
* Falls back to built-in default icons when no override is registered.
*
* Accepts extension keys (any string) in addition to the built-in
* {@link IconName}s — useful for library-contributed icons. For a
* caller-supplied fallback when a key isn't registered, use
* {@link getExtendedIcon}.
*/
function getIcon(name, source) {
	return getThemeIconOverrides(source)?.[name] ?? globalRegistry[name] ?? defaultIcons[name];
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/Icon/Icon.js
/**
* @file Icon.tsx
* @input Uses ReactSVGProps, icon components or semantic icon names
* @output Exports Icon component, IconProps, IconColor, IconSize, IconType types
* @position Core implementation; consumed by index.ts, tested by Icon.test.tsx
*
* Supports two modes:
* - Component mode: Pass an SVG icon component (e.g. from @heroicons/react) — rendered
*   directly with and spread SVG props.
* - String mode: Pass a semantic name (e.g. 'close', 'chevronDown') — resolved from the
*   theme's icon registry (or built-in fallback SVGs) and wrapped in a styled span.
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/Icon/Icon.doc.mjs (props table, features, implementation notes)
* - /packages/core/src/Icon/Icon.test.tsx (tests for new/changed behavior)
* - /packages/core/src/Icon/index.ts (exports if types change)
* - /apps/storybook/stories/Icon.stories.tsx (storybook stories)
* - /packages/cli/assets/templates/blocks/components/Icon/ (showcase blocks)
*/
var styles$30 = {
	root: {
		kmuXW: "x2lah0s",
		$$css: true
	},
	span: {
		k1xSpc: "x3nfvp2",
		kGNEyG: "x6s0dn4",
		kjj79g: "xl56j7k",
		kmuXW: "x2lah0s",
		$$css: true
	}
};
var colorStyles$2 = {
	primary: {
		kMwMTN: "xtbr613",
		$$css: true
	},
	secondary: {
		kMwMTN: "xv9yike",
		$$css: true
	},
	tertiary: {
		kMwMTN: "xv9yike",
		$$css: true
	},
	disabled: {
		kMwMTN: "xqa6c3m",
		$$css: true
	},
	accent: {
		kMwMTN: "xqwr325",
		$$css: true
	},
	success: {
		kMwMTN: "xtjic6",
		$$css: true
	},
	error: {
		kMwMTN: "xjt36v0",
		$$css: true
	},
	warning: {
		kMwMTN: "xs3pv69",
		$$css: true
	},
	inherit: {
		kMwMTN: "x1heor9g",
		$$css: true
	},
	blue: {
		kMwMTN: "x1fns2mt",
		$$css: true
	},
	red: {
		kMwMTN: "xeffzf7",
		$$css: true
	},
	green: {
		kMwMTN: "xmxeech",
		$$css: true
	},
	gray: {
		kMwMTN: "x1eyinzz",
		$$css: true
	},
	cyan: {
		kMwMTN: "x157w0xa",
		$$css: true
	},
	teal: {
		kMwMTN: "x1f3zxcb",
		$$css: true
	},
	yellow: {
		kMwMTN: "x1g6zdft",
		$$css: true
	},
	orange: {
		kMwMTN: "xxu74a4",
		$$css: true
	},
	pink: {
		kMwMTN: "x1kxxfg5",
		$$css: true
	},
	purple: {
		kMwMTN: "xzdw94u",
		$$css: true
	}
};
/**
* Size styles for direct SVG icon components.
* Uses width/height only — SVG components handle their own viewBox scaling.
*
* Sizes are expressed in `rem` (relative to the root font-size) so icons scale
* in step with text when the document font-size changes, matching the rest of
* the design system's rem-based type scale. Values are the px-equivalents at a
* 16px root: 12px → 0.75rem, 16px → 1rem, 20px → 1.25rem, 24px → 1.5rem.
*/
var sizeStyles$2 = {
	xsm: {
		kzqmXN: "x1jw3ynk",
		kZKoxP: "xvle69y",
		$$css: true
	},
	sm: {
		kzqmXN: "xcdlrvm",
		kZKoxP: "x1l36t39",
		$$css: true
	},
	md: {
		kzqmXN: "xwqq7k2",
		kZKoxP: "xmll18r",
		$$css: true
	},
	lg: {
		kzqmXN: "xp8d6y2",
		kZKoxP: "xam5rvr",
		$$css: true
	}
};
/**
* Size styles for string-based (registry) icons.
* Includes fontSize so that 1em-based icons from the registry scale correctly.
*
* Expressed in `rem` for the same reason as {@link sizeStyles} — icons track the
* root font-size instead of being locked to absolute pixels.
*/
var spanSizeStyles = {
	xsm: {
		kzqmXN: "x1jw3ynk",
		kZKoxP: "xvle69y",
		kGuDYH: "xboafo0",
		$$css: true
	},
	sm: {
		kzqmXN: "xcdlrvm",
		kZKoxP: "x1l36t39",
		kGuDYH: "x1jchvi3",
		$$css: true
	},
	md: {
		kzqmXN: "xwqq7k2",
		kZKoxP: "xmll18r",
		kGuDYH: "x1603h9y",
		$$css: true
	},
	lg: {
		kzqmXN: "xp8d6y2",
		kZKoxP: "xam5rvr",
		kGuDYH: "xngnso2",
		$$css: true
	}
};
/**
* Type for icon components that can be passed to Icon.
* Use this type when accepting an icon prop in other components.
*/
/**
* Props for Icon component.
* Extends SVGProps to allow passing additional SVG attributes (used when icon is a component).
*/
/**
* Derives the ARIA attributes for an icon from its `label` prop.
*
* - Non-empty `label` → meaningful image: `role="img"` + `aria-label`, and no
*   `aria-hidden` (an `aria-hidden` element is removed from the accessibility
*   tree, so its accessible name would be ignored).
* - Omitted or empty `label` → decorative default: `aria-hidden="true"`.
*
* The result is spread BEFORE `{...props}` in both render modes so an explicit
* `aria-hidden` / `role` / `aria-label` from the consumer always wins.
*/
function getIconA11yProps(label) {
	return label != null && label !== "" ? {
		role: "img",
		"aria-label": label
	} : { "aria-hidden": "true" };
}
/**
* Renders an icon from the icon registry or a custom SVG component.
*
* @example
* ```
* <Icon icon="close" size="md" color="primary" />
* ```
*/
function Icon({ icon, color = "inherit", size = "md", label, ref, className, style, xstyle, ...props$23 }) {
	const a11yProps = getIconA11yProps(label);
	if (typeof icon === "string") return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(IconFromRegistry, {
		name: icon,
		color,
		size,
		a11yProps,
		className,
		style,
		xstyle,
		spanProps: props$23
	});
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(icon, {
		ref,
		...a11yProps,
		...mergeProps(themeProps("icon", {
			size,
			color
		}), props(styles$30.root, colorStyles$2[color], sizeStyles$2[size], xstyle), className ?? void 0, style),
		...props$23
	});
}
Icon.displayName = "Icon";
/**
* Internal component that resolves a semantic icon name from the registry
* and renders it in a styled span with proper sizing.
*
* Extracted as a separate component so getIcon is only called
* when the icon prop is a string.
*/
function IconFromRegistry({ name, color, size, a11yProps, className, style, xstyle, spanProps }) {
	const resolvedIcon = getIcon(name, useThemeName());
	if (resolvedIcon == null) return null;
	const restSpanProps = spanProps ?? {};
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
		...a11yProps,
		...restSpanProps,
		...mergeProps(themeProps("icon", {
			size,
			color
		}), props(styles$30.span, colorStyles$2[color], spanSizeStyles[size], xstyle), className ?? void 0, style),
		children: resolvedIcon
	});
}
/**
* Renders an icon slot value. Handles semantic names, ReactNode values, and
* component types:
* - If the value is a semantic icon name string, wraps it in Icon.
* - If the value is a component (function or forwardRef object), wraps it in Icon.
* - Otherwise, renders the ReactNode directly.
*/
function renderIconSlot(icon, props) {
	if (typeof icon === "string") return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Icon, {
		icon,
		...props
	});
	if (typeof icon === "function" || typeof icon === "object" && icon !== null && "render" in icon) return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Icon, {
		icon,
		...props
	});
	return icon;
}
var AppShellMobileContext = /*#__PURE__*/ (0, import_react.createContext)({
	isMobile: false,
	isMobileNavOpen: false,
	toggleMobileNav: () => {},
	openMobileNav: () => {},
	closeMobileNav: () => {},
	isMobileNavEnabled: false,
	hasAutoToggle: true
});
AppShellMobileContext.displayName = "AppShellMobileContext";
/**
* Hook to access mobile nav state from anywhere in the AppShell tree.
*/
function useAppShellMobile() {
	return (0, import_react.use)(AppShellMobileContext);
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/MobileNav/MobileNavToggle.js
/**
* @file MobileNavToggle.tsx
* @input Uses React, Button, Icon, AppShell mobile context
* @output Exports MobileNavToggle component
* @position Standalone toggle button; can be placed anywhere in the AppShell tree.
*
* Hamburger button that opens/closes the mobile nav drawer.
* Reads from AppShell mobile context — renders nothing above the mobile breakpoint.
* Can be placed anywhere in the component tree (TopNav, content area, custom toolbar, etc.).
*/
/**
* Mobile nav toggle button. Reads from AppShell context to open/close
* the mobile navigation drawer.
*
* Renders nothing when above the mobile breakpoint — safe to include
* unconditionally in your layout.
*
* @example
* ```
* <div className="my-toolbar">
*   <MobileNavToggle />
*   <h1>Page Title</h1>
* </div>
* <MobileNavToggle label="Menu">
*   <MyCustomMenuIcon />
* </MobileNavToggle>
* ```
*/
function MobileNavToggle({ ref, children, label: labelFromProps, "data-testid": testId, xstyle, className, style }) {
	const t = useTranslator();
	const label = labelFromProps ?? t("@astryx.mobileNav.toggle.open");
	const { isMobile, isMobileNavEnabled, isMobileNavOpen, mobileNavId, toggleMobileNav } = useAppShellMobile();
	if (!isMobile || !isMobileNavEnabled) return null;
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Button, {
		ref,
		variant: "ghost",
		label,
		icon: children ?? /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Icon, {
			icon: "menu",
			color: "inherit"
		}),
		onClick: toggleMobileNav,
		"aria-expanded": isMobileNavOpen,
		"aria-controls": mobileNavId || void 0,
		"data-testid": testId ?? "mobile-nav-toggle",
		xstyle,
		className,
		style,
		isIconOnly: true
	});
}
MobileNavToggle.displayName = "MobileNavToggle";
//#endregion
//#region node_modules/@astryxdesign/core/dist/SideNav/SideNavRenderContext.js
/**
* @file SideNavRenderContext.ts
* @input React createContext, use
* @output Exports SideNavRenderContext and useSideNavRenderMode hook
* @position Internal context for controlling SideNav rendering mode
*
* When AppShell renders the SideNav in multiple locations (inline, top bar,
* mobile drawer), this context tells SideNav which parts to render:
* - 'default': full sidebar (desktop inline)
* - 'topbar': heading + footerIcons only, laid out horizontally (mobile top bar)
* - 'drawer': children only, skip heading + footerIcons (mobile drawer)
*/
var SideNavRenderContext = /*#__PURE__*/ (0, import_react.createContext)("default");
SideNavRenderContext.displayName = "SideNavRenderContext";
/**
* Read the current SideNav render mode from context.
*/
function useSideNavRenderMode() {
	return (0, import_react.use)(SideNavRenderContext);
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/TopNav/TopNavRenderContext.js
/**
* @file TopNavRenderContext.ts
* @input React createContext, use
* @output Exports TopNavRenderContext and useTopNavRenderMode hook
* @position Internal context for controlling TopNav rendering mode
*
* When AppShell renders TopNav in multiple locations (top bar, mobile drawer),
* this context tells TopNav and its children which parts to render:
* - 'default': full top bar (desktop)
* - 'mobile-bar': heading + endContent + toggle, hide nav items (mobile top bar)
* - 'drawer': nav items as vertical list elements (mobile drawer)
*/
var TopNavRenderContext = /*#__PURE__*/ (0, import_react.createContext)("default");
TopNavRenderContext.displayName = "TopNavRenderContext";
//#endregion
//#region node_modules/@astryxdesign/core/dist/TopNav/TopNavMobileContentContext.js
/**
* @file TopNavMobileContentContext.ts
* @input React createContext, use
* @output Exports TopNavMobileContentContext and useTopNavMobileContent
* @position Internal context for passing additional drawer content to TopNav
*
* When both TopNav and SideNav exist, AppShell passes the SideNav content
* to TopNav via this context. TopNav renders it below its own items in the
* mobile drawer, producing a single combined drawer.
*/
var TopNavMobileContentContext = /*#__PURE__*/ (0, import_react.createContext)(null);
TopNavMobileContentContext.displayName = "TopNavMobileContentContext";
//#endregion
//#region node_modules/@astryxdesign/core/dist/AppShell/AppShell.js
/**
* @file AppShell.tsx
* @input Uses React, Layout, LayoutHeader, LayoutPanel, LayoutContent, StyleX
* @output Exports AppShell component and AppShellProps type
* @position Application-level layout shell — the top-level wrapper for any app.
*   Composes Layout internally to provide header, sideNav, and main content areas.
*   Use for any app that needs a top nav, side navigation, and scrollable content.
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/AppShell/AppShell.doc.mjs
* - /packages/core/src/AppShell/index.ts
* - /packages/core/src/AppShell/AppShell.test.tsx
* - /apps/storybook/stories/AppShell.stories.tsx
* - /packages/cli/assets/templates/blocks/components/AppShell/ (showcase blocks)
*/
var ActivityWrapper = typeof import_react.Activity !== "undefined" ? ({ mode, children }) => /*#__PURE__*/ (0, import_jsx_runtime.jsx)(import_react.Activity, {
	mode,
	children
}) : ({ children }) => /*#__PURE__*/ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
var BREAKPOINT_VALUES = {
	sm: 640,
	md: 768,
	lg: 1024,
	none: 0
};
var MAIN_CONTENT_ID = "astryx-app-shell-main";
/**
* SideNav breakpoint options.
* - `sm`: 640px
* - `md`: 768px
* - `lg`: 1024px
* - `none`: Never auto-collapse
*/
/**
* Navigation background style:
* - `wash`: Nav areas use wash background, no dividers
* - `surface`: Nav areas use surface background, no dividers
* - `section`: Dividers between nav and content (classic look)
* - `elevated`: Wash nav background with elevated surface content + border radius
* @default 'elevated'
*/
/**
* Navigation background style. Extensible via module augmentation of AppShellVariantMap.
*/
/**
* Configuration object for mobile navigation behavior.
* Used when you need to customize the auto mobile nav without replacing it entirely.
*/
var styles$29 = {
	root: {
		k1xSpc: "x78zum5",
		kXwgrk: "xdt5ytf",
		kVAEAm: "x1n2onr6",
		$$css: true
	},
	variantWash: {
		kWkggS: "x1eiddq6",
		$$css: true
	},
	variantSurface: {
		kWkggS: "x10xzikg",
		$$css: true
	},
	variantSection: {
		kWkggS: "x10xzikg",
		$$css: true
	},
	variantElevated: {
		kWkggS: "x1eiddq6",
		$$css: true
	},
	rootFill: {
		kZKoxP: "xtdtrs8",
		$$css: true
	},
	rootAuto: {
		kAzted: "x1ov3xa9",
		$$css: true
	},
	skipLink: {
		kVAEAm: "x10l6tqk x1xrnuwo",
		kzqmXN: "x1i1rx1s x1jqxupm",
		kZKoxP: "xjm9jq1 x15cytp8",
		k8WAf4: "xt970qd xh2mrf5",
		kg3NbH: "xnjsko4 x1cf3d6k",
		kogj98: "xkdpibf x1y5lnwp",
		kVQacm: "xb3r6kr xomzh7y",
		kz4h6p: "x1hyvwdk x1rsz1da",
		khDVqt: "xuxw1ft x1hbpcn8",
		kMzoRj: "xc342km",
		k87sOh: "x13vifvy x1rw3289",
		kLqNvP: "x1o0tod xodanix",
		kWkggS: "x10xzikg",
		kMwMTN: "xjse4m1",
		kY2c9j: "x1q2oy4v",
		kybGjl: "x1hl2dhg",
		k63SB2: "x2mo6ok",
		kGuDYH: "xjm74w1",
		$$css: true
	},
	mainFocusTarget: {
		kI3sdo: "x1uvtmcs",
		$$css: true
	},
	contentBgSurface: {
		kWkggS: "x10xzikg",
		$$css: true
	},
	contentBgWash: {
		kWkggS: "x1eiddq6",
		$$css: true
	},
	contentBgTransparent: {
		kWkggS: "xjbqb8w",
		kHBbk8: "xc8icb0",
		$$css: true
	},
	navAreaWash: {
		kWkggS: "x1eiddq6",
		$$css: true
	},
	navAreaSurface: {
		kWkggS: "x10xzikg",
		$$css: true
	},
	banner: {
		kmuXW: "x2lah0s",
		$$css: true
	},
	headerSticky: {
		kVAEAm: "x7wzq59",
		k87sOh: "x13vifvy",
		kY2c9j: "x1vjfegm",
		$$css: true
	},
	panelAutoFill: {
		kUk6DE: "x98rzlu",
		kVQacm: "xysyzu8",
		$$css: true
	}
};
/**
* Application-level layout shell. Provides the structural frame for an app:
* top navigation, side navigation, and main content area.
*
* Slot-based API with `topNav`, `sideNav`, `banner`, and `children`.
* Supports two height modes (`fill` and `auto`), responsive side nav
* collapse, and mobile overlay with backdrop.
*
* @example
* ```
* <AppShell
*   topNav={<TopNav label="Navigation" heading={<TopNavHeading heading="My App" />} />}
*   sideNav={<SideNav>{navSections}</SideNav>}
*   mobileNav={
*     <MobileNav isOpen={mobileOpen} onOpenChange={(open) => setMobileOpen(open)} header="My App">
*       {navSections}
*     </MobileNav>
*   }>
*   <Content />
* </AppShell>
* ```
*/
function AppShell({ variant = "elevated", banner, children, contentPadding, "data-testid": dataTestId, height = "fill", mobileNav, sideNav, topNav, xstyle, className, style, ref, ...rest }) {
	const t = useTranslator();
	const mobileNavDisabled = mobileNav === false;
	const mobileNavConfig = mobileNav != null && mobileNav !== false && typeof mobileNav === "object" && !/*#__PURE__*/ (0, import_react.isValidElement)(mobileNav) ? mobileNav : null;
	const sideNavBreakpoint = mobileNavConfig?.breakpoint ?? "md";
	const mobileNavReactNode = mobileNav != null && mobileNav !== false && (/*#__PURE__*/ (0, import_react.isValidElement)(mobileNav) || typeof mobileNav === "string") ? mobileNav : null;
	const mobileNavConfigContent = mobileNavConfig?.content ?? null;
	const mobileNavHasToggle = mobileNavConfig?.hasToggle !== false;
	const mobileNavIsControlled = mobileNavConfig?.isOpen !== void 0;
	const isBelowBreakpoint = useMediaQuery(sideNavBreakpoint === "none" ? "(max-width: 0px)" : `(max-width: ${BREAKPOINT_VALUES[sideNavBreakpoint]}px)`, mobileNavConfig?.defaultIsMobile);
	const [uncontrolledMobileOpen, setUncontrolledMobileOpen] = (0, import_react.useState)(false);
	const isMobileNavOpen = mobileNavConfig?.isOpen ?? uncontrolledMobileOpen;
	const mobileNavOnOpenChange = mobileNavConfig?.onOpenChange;
	const setMobileNavOpen = (0, import_react.useCallback)((open) => {
		if (!mobileNavIsControlled) setUncontrolledMobileOpen(open);
		mobileNavOnOpenChange?.(open);
	}, [mobileNavIsControlled, mobileNavOnOpenChange]);
	const handleSkipLinkClick = (0, import_react.useCallback)(() => {
		document.getElementById(MAIN_CONTENT_ID)?.focus();
	}, []);
	const isFill = height === "fill";
	const isAuto = height === "auto";
	const hasBanner = isRenderable(banner);
	const hasTopNav = isRenderable(topNav);
	const hasSideNav = isRenderable(sideNav);
	const mobileNavEnabled = !mobileNavDisabled && (hasTopNav || hasSideNav) && mobileNavReactNode == null;
	const navHasDividers = variant === "section";
	const isElevated = variant === "elevated";
	const navAreaStyle = variant === "wash" || variant === "elevated" ? styles$29.navAreaWash : variant === "surface" ? styles$29.navAreaSurface : void 0;
	const contentAreaStyle = variant === "wash" ? styles$29.contentBgWash : variant === "elevated" && hasTopNav && hasSideNav && !isBelowBreakpoint ? styles$29.contentBgTransparent : variant === "surface" || variant === "elevated" ? styles$29.contentBgSurface : void 0;
	const stickyBgStyle = navAreaStyle ?? styles$29.navAreaSurface;
	const headerRef = (0, import_react.useRef)(null);
	const shellRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!isAuto || !headerRef.current || !shellRef.current) return;
		const headerEl = headerRef.current;
		const shellEl = shellRef.current;
		const updateHeight = () => {
			const height = headerEl.getBoundingClientRect().height;
			shellEl.style.setProperty("--_app-shell-header-height", `${height}px`);
		};
		observeResize(headerEl, () => updateHeight());
		return () => unobserveResize(headerEl);
	}, [isAuto]);
	const showSideNavInline = hasSideNav && !isBelowBreakpoint;
	const shouldRenderMobileNavReactNode = mobileNavReactNode != null;
	const shouldRenderConfigContent = mobileNavEnabled && mobileNavConfigContent != null && isBelowBreakpoint;
	const mobileNavId = (0, import_react.useId)();
	const mobileContextValue = (0, import_react.useMemo)(() => ({
		isMobile: isBelowBreakpoint,
		isMobileNavOpen,
		mobileNavId,
		toggleMobileNav: () => mobileNavEnabled && setMobileNavOpen(!isMobileNavOpen),
		openMobileNav: () => mobileNavEnabled && setMobileNavOpen(true),
		closeMobileNav: () => setMobileNavOpen(false),
		isMobileNavEnabled: mobileNavEnabled,
		hasAutoToggle: mobileNavHasToggle
	}), [
		isBelowBreakpoint,
		isMobileNavOpen,
		mobileNavId,
		setMobileNavOpen,
		mobileNavEnabled,
		mobileNavHasToggle
	]);
	const mobileContentValue = hasSideNav && mobileNavHasToggle ? /*#__PURE__*/ (0, import_jsx_runtime.jsx)(SideNavRenderContext, {
		value: "drawer-content",
		children: sideNav
	}) : null;
	const drawerMobileContentValue = hasSideNav ? /*#__PURE__*/ (0, import_jsx_runtime.jsx)(SideNavRenderContext, {
		value: "drawer-content",
		children: sideNav
	}) : null;
	const topNavContent = hasTopNav ? isBelowBreakpoint && !mobileNavDisabled && mobileNavReactNode == null ? /*#__PURE__*/ (0, import_jsx_runtime.jsx)(TopNavMobileContentContext, {
		value: mobileContentValue,
		children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)(TopNavRenderContext, {
			value: "mobile-bar",
			children: topNav
		})
	}) : topNav : null;
	const headerInner = hasTopNav || hasBanner ? /*#__PURE__*/ (0, import_jsx_runtime.jsxs)(LayoutHeader, {
		padding: 0,
		hasDivider: navHasDividers && hasTopNav,
		children: [hasBanner && /*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
			...props(styles$29.banner, navAreaStyle),
			children: banner
		}), hasTopNav && topNavContent]
	}) : void 0;
	const headerContent = isRenderable(headerInner) ? /*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
		ref: headerRef,
		role: "banner",
		...mergeProps(themeProps("app-shell-header", { variant }), props(navAreaStyle, isAuto && styles$29.headerSticky)),
		children: headerInner
	}) : void 0;
	const sideNavPanel = showSideNavInline ? /*#__PURE__*/ (0, import_jsx_runtime.jsx)(LayoutPanel, {
		padding: 0,
		hasDivider: navHasDividers,
		isScrollable: isFill,
		...themeProps("app-shell-sidenav", { variant }),
		xstyle: [
			navAreaStyle,
			isAuto && stickyBgStyle,
			isAuto && styles$29.panelAutoFill
		],
		children: sideNav
	}) : void 0;
	const sideNavContent = sideNavPanel != null && isAuto ? /*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
		className: "x2lah0s x7giv3 x7wzq59 xht72ud xpa73km x78zum5 xdt5ytf",
		children: sideNavPanel
	}) : sideNavPanel;
	const shouldElevateWithCorner = isElevated && hasTopNav && showSideNavInline;
	const mainInner = /*#__PURE__*/ (0, import_jsx_runtime.jsx)(LayoutContent, {
		padding: contentPadding ?? 0,
		role: "main",
		id: MAIN_CONTENT_ID,
		tabIndex: -1,
		isScrollable: isFill,
		xstyle: [contentAreaStyle, styles$29.mainFocusTarget],
		children
	});
	const mainContent = shouldElevateWithCorner ? /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("div", {
		className: "x1n2onr6 x78zum5 x98rzlu x2lwn1j x5yr21d",
		children: [/*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", { className: "x10l6tqk x10a8y8t x10xzikg x183tx6i x47corl" }), mainInner]
	}) : mainInner;
	const autoMobileTopBar = !mobileNavDisabled && mobileNavHasToggle && isBelowBreakpoint && !hasTopNav && hasSideNav ? /*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
		role: headerContent == null ? "banner" : void 0,
		...mergeProps(themeProps("app-shell-header", { variant }), props(navAreaStyle, isAuto && styles$29.headerSticky)),
		children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)(LayoutHeader, {
			padding: 0,
			hasDivider: navHasDividers,
			children: /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("div", {
				className: "x78zum5 x6s0dn4 x1k15mir xf314gf",
				role: "navigation",
				"aria-label": t("@astryx.appShell.mobileNavigation"),
				children: [/*#__PURE__*/ (0, import_jsx_runtime.jsx)(SideNavRenderContext, {
					value: "topbar",
					children: sideNav
				}), /*#__PURE__*/ (0, import_jsx_runtime.jsx)(MobileNavToggle, {})]
			})
		})
	}) : void 0;
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(AppShellMobileContext, {
		value: mobileContextValue,
		children: /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("div", {
			...rest,
			ref: useMergedRefs(ref, shellRef),
			"data-testid": dataTestId,
			...mergeProps(themeProps("app-shell", { variant }), props(styles$29.root, variant === "wash" ? styles$29.variantWash : variant === "surface" ? styles$29.variantSurface : variant === "section" ? styles$29.variantSection : styles$29.variantElevated, isFill ? styles$29.rootFill : styles$29.rootAuto, xstyle), className, style),
			children: [
				/*#__PURE__*/ (0, import_jsx_runtime.jsx)("a", {
					href: `#${MAIN_CONTENT_ID}`,
					onClick: handleSkipLinkClick,
					...focusOutlineProps.focusVisible(styles$29.skipLink),
					"data-testid": "skip-to-content",
					children: t("@astryx.appShell.skipToContent")
				}),
				/*#__PURE__*/ (0, import_jsx_runtime.jsx)(Layout, {
					height,
					padding: 0,
					header: /*#__PURE__*/ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [headerContent, autoMobileTopBar] }),
					start: sideNavContent,
					content: mainContent
				}),
				shouldRenderMobileNavReactNode && mobileNavReactNode,
				shouldRenderConfigContent && mobileNavConfigContent,
				isBelowBreakpoint && !mobileNavDisabled && mobileNavReactNode == null && !mobileNavConfigContent && /*#__PURE__*/ (0, import_jsx_runtime.jsxs)(ActivityWrapper, {
					mode: isMobileNavOpen ? "visible" : "hidden",
					children: [hasSideNav && !hasTopNav && /*#__PURE__*/ (0, import_jsx_runtime.jsx)(SideNavRenderContext, {
						value: "drawer",
						children: sideNav
					}), hasTopNav && /*#__PURE__*/ (0, import_jsx_runtime.jsx)(TopNavMobileContentContext, {
						value: drawerMobileContentValue,
						children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)(TopNavRenderContext, {
							value: "drawer",
							children: topNav
						})
					})]
				})
			]
		})
	});
}
AppShell.displayName = "AppShell";
//#endregion
//#region node_modules/@astryxdesign/core/dist/hooks/useDevWarning.js
/**
* @file useDevWarning.ts
* @input A component name, a message, and a boolean condition
* @output Fires a dev-only `Component: message` warning once per mount
* @position Core hook; the render-safe way to warn the builder from a component
*
* The right way to surface a dev guardrail from inside a component. A naive
* `if (condition) console.warn(...)` in the render body repeats on every
* render, and reaching for `useState` to gate it adds needless state and
* re-renders. This hook uses a ref + effect: the warning fires once per mount
* when the condition holds, never during render, and never triggers a
* re-render. Messages use the standardized `Component: message` format.
*
* SYNC: When modified, update:
* - /packages/core/src/hooks/index.ts
* - /packages/core/src/utils/devWarning.ts (the imperative counterpart)
*/
/**
* Fire a dev-only warning once per mount while `condition` is true.
*
* @param component - Component or hook name (message prefix)
* @param message - What went wrong and how to fix it
* @param condition - Whether to warn; defaults to `true`
*
* @example
* ```
* useDevWarning(
*   'Field',
*   'isOptional and isRequired are mutually exclusive. isOptional takes precedence.',
*   isOptional && isRequired,
* );
* ```
*/
function useDevWarning(component, message, condition = true) {
	const hasWarnedRef = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (condition && !hasWarnedRef.current) hasWarnedRef.current = true;
	}, [
		component,
		message,
		condition
	]);
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/hooks/isRtlElement.js
/**
* @file isRtlElement.ts
* @input DOM element (nullable)
* @output Exports isRtlElement helper resolving an element's computed text
*   direction
* @position Internal hook utility; used by useListFocus and useGridFocus to
*   auto-detect RTL for arrow-key navigation (same getComputedStyle precedent
*   as Resizable's ResizeHandle drag deltas).
*/
/**
* Whether `el` renders right-to-left, per its computed `direction`.
*
* SSR-safe: returns false when `el` is null or no DOM is available. Callers
* should invoke this lazily (on keydown, not on render) so getComputedStyle
* runs only when a horizontal arrow key is actually handled.
*/
function isRtlElement(el) {
	if (!el || typeof window === "undefined") return false;
	return window.getComputedStyle(el).direction === "rtl";
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/hooks/useListFocus.js
/**
* @file useListFocus.ts
* @input Uses React useCallback, useRef, useIsomorphicLayoutEffect,
*   isRtlElement
* @output Exports useListFocus hook for linear list keyboard navigation
* @position Core hook; used by TabMenu for dropdown menu navigation, Toolbar
*   for roving tabindex, ButtonGroup, ContextMenu, NavHeadingMenu, and more.
*   Auto-detects RTL from the container's computed direction so horizontal
*   arrow keys follow visual direction (WCAG 1.3.2).
*
* SYNC: When modified, update:
* - /packages/core/src/hooks/index.ts
* - /packages/core/src/hooks/useListFocus.doc.mjs
* - /packages/core/src/hooks/useListFocus.test.tsx
*/
/**
* Navigation orientation for a linear list.
* - `'horizontal'`: ArrowLeft/ArrowRight move between items.
* - `'vertical'`: ArrowUp/ArrowDown move between items.
* - `'both'`: all four arrows move between items (in linear DOM order).
*/
/**
* Configuration for list focus behavior
*/
/**
* Return type for useListFocus hook
*/
var TEXT_INPUT_TYPES = /* @__PURE__ */ new Set([
	"text",
	"search",
	"url",
	"tel",
	"email",
	"password",
	"number"
]);
/**
* The nearest `contenteditable` root for `el`, or null when `el` is not inside
* an editable region. Prefers the browser's `isContentEditable` property and
* falls back to the closest `[contenteditable]` ancestor whose value is not
* `"false"` (so environments without `isContentEditable` still work).
*/
function getContentEditableRoot(el) {
	if (el.isContentEditable) return el;
	const candidate = el.closest("[contenteditable]");
	if (candidate && candidate.getAttribute("contenteditable") !== "false") return candidate;
	return null;
}
/**
* Whether an arrow/Home/End key should be left to the browser because the
* event target is a text-editing element whose caret is not yet at the boundary
* in the direction of travel (or a selection is present). Returns true when the
* list should NOT steal the key.
*
* Covers three editing surfaces:
* - `<textarea>` and text-type `<input>` — use `selectionStart`/`selectionEnd`
*   to steal only at the boundary in the travel direction.
* - `contenteditable` (rich-text editor / chat composer) — precise caret
*   boundary detection in an arbitrary editable subtree is fragile, so we err
*   on the side of never hijacking an active editor: defer on every caret key
*   whenever focus is inside a non-empty contenteditable. (An empty editable
*   has nothing to caret through, so navigation may proceed.)
*/
function shouldDeferToCaret(target, key) {
	if (!(target instanceof HTMLElement)) return false;
	const editableRoot = getContentEditableRoot(target);
	if (editableRoot) {
		const selection = typeof window !== "undefined" ? window.getSelection() : null;
		if (selection && selection.rangeCount > 0 && !selection.isCollapsed) return true;
		return (editableRoot.textContent ?? "").length > 0;
	}
	const isTextarea = target.tagName === "TEXTAREA";
	const isTextInput = target.tagName === "INPUT" && TEXT_INPUT_TYPES.has(target.type);
	if (!isTextarea && !isTextInput) return false;
	const { selectionStart, selectionEnd, value } = target;
	if (selectionStart !== selectionEnd) return true;
	if (selectionStart == null) return true;
	if (key === "ArrowLeft" || key === "ArrowUp" || key === "Home") return selectionStart > 0;
	if (key === "ArrowRight" || key === "ArrowDown" || key === "End") return selectionStart < value.length;
	return false;
}
/**
* Hook for managing keyboard navigation within a linear list.
*
* Implements WAI-ARIA menu/listbox/toolbar pattern:
* - ArrowDown/ArrowRight: Move to next item (wraps to first)
* - ArrowUp/ArrowLeft: Move to previous item (wraps to last)
* - Home: Move to first item
* - End: Move to last item
* - Escape: runs `onEscape` and consumes the key. With no `onEscape` the key
*   is left alone, so a surrounding layer can still dismiss on it.
*
* By default the hook only *moves* focus and leaves `tabindex` management to
* the caller. Opt into {@link UseListFocusOptions.hasRovingTabIndex} for a hook
* that owns a single tab stop (roving tabindex) across the items — stamping and
* repairing it as items mount/unmount or toggle disabled — for toolbars,
* segmented controls, tab strips, and similar composite widgets.
*
* @example
* ```
* const {listRef, handleKeyDown} = useListFocus({
*   onEscape: () => layer.hide(),
* });
*
* <div ref={listRef} role="menu" onKeyDown={handleKeyDown}>
*   {items.map(item => <div role="menuitem" tabIndex={0}>{item}</div>)}
* </div>
* ```
*
* Roving-tabindex composite (e.g. a toolbar):
*
* @example
* ```
* const {listRef, handleKeyDown, handleFocus} = useListFocus<HTMLDivElement>({
*   itemSelector: 'button, input, [tabindex]',
*   orientation: 'horizontal',
*   hasRovingTabIndex: true,
*   hasCaretGuard: true,
* });
*
* <div ref={listRef} role="toolbar" onKeyDown={handleKeyDown} onFocus={handleFocus}>
*   {children}
* </div>
* ```
*/
function useListFocus(options = {}) {
	const { itemSelector = "[role=\"menuitem\"]", boundarySelector, wrap = true, onEscape, orientation = "vertical", hasHomeEnd = true, isRtl, hasRovingTabIndex = false, hasCaretGuard = false } = options;
	const listRef = (0, import_react.useRef)(null);
	/**
	* Whether an item is disabled and therefore cannot receive DOM focus.
	* A `.focus()` call on such an element silently no-ops, so navigation must
	* skip these to avoid freezing on a disabled item (menus-4, navigation-5).
	*/
	const isItemDisabled = (0, import_react.useCallback)((el) => {
		return el.getAttribute("aria-disabled") === "true" || el.disabled === true || el.hasAttribute("disabled");
	}, []);
	/**
	* Get all focusable items in the list.
	*/
	const getItems = (0, import_react.useCallback)(() => {
		const listEl = listRef.current;
		if (!listEl) return [];
		const matched = Array.from(listEl.querySelectorAll(itemSelector));
		if (!boundarySelector) return matched;
		return matched.filter((el) => el.closest(boundarySelector) === listEl);
	}, [itemSelector, boundarySelector]);
	/**
	* Whether a key event belongs to this list level rather than a nested list.
	* With a boundary set, an event that originated inside a nested boundary
	* (e.g. a submenu flyout) has bubbled up to us and must be ignored so we
	* don't double-handle navigation. Without a boundary, every event is ours.
	*/
	const ownsEvent = (0, import_react.useCallback)((e) => {
		const listEl = listRef.current;
		if (!listEl || !boundarySelector) return true;
		const target = e.target;
		if (!target) return true;
		return target.closest(boundarySelector) === listEl;
	}, [boundarySelector]);
	/**
	* Find the next enabled item index from `start`, moving by `step`, optionally
	* wrapping. Returns -1 when no enabled item exists in range. Skipping
	* disabled items here (rather than relying on the selector) keeps navigation
	* from stalling on an item whose `.focus()` silently no-ops.
	*/
	const findEnabledIndex = (0, import_react.useCallback)((items, start, step, shouldWrap) => {
		const count = items.length;
		if (count === 0) return -1;
		let index = start;
		for (let i = 0; i < count; i++) {
			if (index < 0 || index >= count) {
				if (!shouldWrap) return -1;
				index = (index + count) % count;
			}
			const item = items[index];
			if (item && !isItemDisabled(item)) return index;
			index += step;
		}
		return -1;
	}, [isItemDisabled]);
	/**
	* Get the currently focused item index.
	*/
	const getCurrentIndex = (0, import_react.useCallback)(() => {
		const items = getItems();
		const active = document.activeElement;
		return items.findIndex((item) => item === active || item.contains(active));
	}, [getItems]);
	/**
	* Set `tabindex` on an item, but only when it differs (avoids redundant DOM
	* writes). Uses setAttribute so the value reflects even for elements (like
	* `<button>`) whose default tabIndex is already 0.
	*/
	const setTabIndex = (0, import_react.useCallback)((el, value) => {
		if (el.getAttribute("tabindex") !== String(value)) el.setAttribute("tabindex", String(value));
	}, []);
	/**
	* Stamp the roving tab stop: exactly one enabled item is tabbable (0), the
	* rest are -1. Prefer keeping the currently-tabbable item if it is still
	* enabled; otherwise promote the first enabled item (tab-stop repair).
	*/
	const syncTabStops = (0, import_react.useCallback)(() => {
		const items = getItems();
		const enabled = items.filter((el) => !isItemDisabled(el));
		if (enabled.length === 0) return;
		const tabbable = enabled.find((el) => el.getAttribute("tabindex") === "0") ?? enabled[0];
		for (const el of items) setTabIndex(el, el === tabbable ? 0 : -1);
	}, [
		getItems,
		isItemDisabled,
		setTabIndex
	]);
	useIsomorphicLayoutEffect(() => {
		if (hasRovingTabIndex) syncTabStops();
	});
	/**
	* Move focus to `items[index]`. When roving tabindex is enabled, also move
	* the tab stop so `index` becomes the sole tabbable item.
	*/
	const focusIndex = (0, import_react.useCallback)((items, index) => {
		const target = items[index];
		if (!target) return;
		if (hasRovingTabIndex) for (const el of items) setTabIndex(el, el === target ? 0 : -1);
		target.focus();
	}, [hasRovingTabIndex, setTabIndex]);
	/**
	* Focus an item by index, clamping to valid range.
	*/
	const focusItem = (0, import_react.useCallback)((index) => {
		const items = getItems();
		if (items.length === 0) return;
		const clampedIndex = Math.max(0, Math.min(index, items.length - 1));
		focusIndex(items, clampedIndex);
	}, [getItems, focusIndex]);
	/**
	* Focus the first enabled item. Returns true when an item was focused.
	*/
	const focusFirst = (0, import_react.useCallback)(() => {
		const items = getItems();
		const index = findEnabledIndex(items, 0, 1, false);
		if (index !== -1) {
			focusIndex(items, index);
			return true;
		}
		return false;
	}, [
		getItems,
		findEnabledIndex,
		focusIndex
	]);
	/**
	* Focus the last enabled item. Returns true when an item was focused.
	*/
	const focusLast = (0, import_react.useCallback)(() => {
		const items = getItems();
		const index = findEnabledIndex(items, items.length - 1, -1, false);
		if (index !== -1) {
			focusIndex(items, index);
			return true;
		}
		return false;
	}, [
		getItems,
		findEnabledIndex,
		focusIndex
	]);
	/**
	* Keep the roving stop pointing at whatever ended up focused (e.g. a click
	* or programmatic focus) so the next Tab behaves correctly. No-op unless
	* roving tabindex is enabled.
	*/
	const handleFocus = (0, import_react.useCallback)(() => {
		if (hasRovingTabIndex) syncTabStops();
	}, [hasRovingTabIndex, syncTabStops]);
	return {
		listRef,
		handleKeyDown: (0, import_react.useCallback)((e) => {
			if (e.ctrlKey || e.metaKey || e.altKey) return;
			if (!ownsEvent(e)) return;
			if (e.key === "Escape") {
				if (onEscape) {
					e.preventDefault();
					onEscape();
				}
				return;
			}
			const horizontal = orientation === "horizontal" || orientation === "both";
			const vertical = orientation === "vertical" || orientation === "both";
			const nextKeys = [];
			const prevKeys = [];
			if (horizontal) {
				const rtl = e.key === "ArrowLeft" || e.key === "ArrowRight" ? isRtl ?? isRtlElement(listRef.current) : false;
				nextKeys.push(rtl ? "ArrowLeft" : "ArrowRight");
				prevKeys.push(rtl ? "ArrowRight" : "ArrowLeft");
			}
			if (vertical) {
				nextKeys.push("ArrowDown");
				prevKeys.push("ArrowUp");
			}
			const isNext = nextKeys.includes(e.key);
			const isPrev = prevKeys.includes(e.key);
			const isHome = hasHomeEnd && e.key === "Home";
			const isEnd = hasHomeEnd && e.key === "End";
			if (!isNext && !isPrev && !isHome && !isEnd) return;
			if (hasCaretGuard && (shouldDeferToCaret(e.target, e.key) || shouldDeferToCaret(document.activeElement, e.key))) return;
			const currentIndex = getCurrentIndex();
			const items = getItems();
			if (isNext) {
				const from = currentIndex === -1 ? 0 : currentIndex + 1;
				const next = findEnabledIndex(items, from, 1, wrap);
				if (next !== -1) focusIndex(items, next);
			} else if (isPrev) {
				const from = currentIndex === -1 ? items.length - 1 : currentIndex - 1;
				const prev = findEnabledIndex(items, from, -1, wrap);
				if (prev !== -1) focusIndex(items, prev);
			} else if (isHome) focusFirst();
			else if (isEnd) focusLast();
			e.preventDefault();
		}, [
			getCurrentIndex,
			getItems,
			wrap,
			orientation,
			isRtl,
			hasHomeEnd,
			hasCaretGuard,
			findEnabledIndex,
			focusIndex,
			focusFirst,
			focusLast,
			onEscape,
			ownsEvent
		]),
		handleFocus,
		focusItem,
		focusFirst,
		focusLast,
		ownsEvent,
		getItems
	};
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/hooks/focusableSelector.js
/**
* @file focusableSelector.ts
* @input None (a plain CSS selector string constant)
* @output Exports FOCUSABLE_SELECTOR
* @position Internal utility; the canonical CSS selector for focusable
*   elements, shared by focus-management hooks (e.g. useFocusTrap) so the
*   selector isn't duplicated across components/hooks. Not exported from the
*   public barrel — internal implementation detail.
*/
/**
* Canonical CSS selector for commonly focusable elements. Includes the
* tabbable natives (button/link/input/select/textarea/[tabindex]) plus
* editable and media elements the browser also puts in the tab order —
* contenteditable, media with controls, iframe, and an open <details>'s
* <summary> — which a naive selector misses, letting Tab escape a trap whose
* only interactive content is (e.g.) a contenteditable composer (infra-8).
*
* This is the canonical focusable selector; prefer importing it here over
* re-declaring the string so behavior stays consistent across hooks.
*/
var FOCUSABLE_SELECTOR = "button:not([disabled]), a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex=\"-1\"]):not([disabled]), [contenteditable]:not([contenteditable=\"false\"]), audio[controls], video[controls], iframe, details > summary:first-child";
//#endregion
//#region node_modules/@astryxdesign/core/dist/hooks/useFocusTrap.js
/**
* @file useFocusTrap.ts
* @input Uses React useCallback, useEffect, useRef
* @output Exports useFocusTrap hook for trapping focus within a container and
*   restoring focus to the previously-focused element on deactivation
* @position Core hook; used by dialogs, modals, date pickers
*
* Based on WAI-ARIA dialog pattern:
* https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
*
* SYNC: When modified, update:
* - /packages/core/src/hooks/index.ts
*/
var activeEscapeTrapCount = 0;
/**
* Whether an element is currently perceivable/focusable — excludes ones hidden
* via `display:none`/`visibility:hidden` or inside an `inert`/`hidden` subtree,
* which the browser skips for Tab, and ones inside an `aria-hidden="true"`
* subtree, which sighted-keyboard users could Tab to while AT skips them
* (WCAG 4.1.2 — focusable content must be exposed to assistive tech).
*/
function isVisiblyFocusable(el) {
	if (el.hasAttribute("inert") || el.closest("[inert]")) return false;
	if (el.hidden || el.closest("[hidden]")) return false;
	if (el.closest("[aria-hidden=\"true\"]")) return false;
	if (typeof window !== "undefined" && window.getComputedStyle) {
		const style = window.getComputedStyle(el);
		if (style.visibility === "hidden" || style.display === "none") return false;
	}
	return true;
}
/**
* Get all focusable elements within a container.
*/
function getFocusableElements(container) {
	return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(isVisiblyFocusable);
}
/**
* Attempt to focus an element. Returns true if focus was successful.
*/
function attemptFocus(element) {
	try {
		element.focus();
	} catch {}
	return document.activeElement === element;
}
/**
* Focus the first focusable descendant of a container.
* Returns true if a focusable element was found and focused.
*/
function focusFirstDescendant(container) {
	const focusable = getFocusableElements(container);
	for (const element of focusable) if (attemptFocus(element)) return true;
	return false;
}
/**
* Focus the last focusable descendant of a container.
* Returns true if a focusable element was found and focused.
*/
function focusLastDescendant(container) {
	const focusable = getFocusableElements(container);
	for (let i = focusable.length - 1; i >= 0; i--) if (attemptFocus(focusable[i])) return true;
	return false;
}
/**
* Configuration for focus trap behavior
*/
/**
* Return type for useFocusTrap hook
*/
/**
* Hook for trapping focus within a container element.
*
* Implements the WAI-ARIA dialog focus trap pattern:
* - Listens to focus events on the document
* - Redirects focus back into the container if it escapes
* - Handles both Tab and Shift+Tab navigation
* - Restores focus to the element that was focused before activation when the
*   trap deactivates or unmounts, unless focus was already moved elsewhere
*   (so consumers that restore focus themselves are unaffected)
*
* @example
* ```
* const {containerRef, focusFirst} = useFocusTrap({
*   isActive: isOpen,
*   onEscape: () => setIsOpen(false),
* });
*
* useEffect(() => {
*   if (isOpen) {
*     focusFirst();
*   }
* }, [isOpen, focusFirst]);
*
* <div ref={containerRef}>
*   <button>First</button>
*   <button>Last</button>
* </div>
* ```
*/
function useFocusTrap(options) {
	const { isActive, onEscape } = options;
	const containerRef = (0, import_react.useRef)(null);
	const lastFocusRef = (0, import_react.useRef)(null);
	const isKeyboardNavigationRef = (0, import_react.useRef)(false);
	const isEscapeTrap = isActive && onEscape != null;
	useLayerDismissal({
		isActive: isEscapeTrap,
		onDismiss: () => {
			onEscape?.();
		},
		getContainer: () => containerRef.current
	});
	(0, import_react.useEffect)(() => {
		if (!isEscapeTrap) return;
		activeEscapeTrapCount += 1;
		return () => {
			activeEscapeTrapCount -= 1;
		};
	}, [isEscapeTrap]);
	/**
	* Focus the first focusable element.
	*/
	const focusFirst = (0, import_react.useCallback)(() => {
		if (containerRef.current) focusFirstDescendant(containerRef.current);
	}, []);
	/**
	* Capture the element focused before the trap activated, and restore focus to
	* it when the trap deactivates (or the component unmounts). Overlays are
	* opened imperatively (e.g. `showPopover()`), so the browser's declarative
	* popover focus restoration does not apply — without this, closing a Popover
	* via Escape or light dismiss drops keyboard focus to `<body>`.
	*
	* The restore is guarded so it never steals focus a consumer moved on
	* purpose: it only runs when focus would otherwise be lost — i.e. the active
	* element is nothing, the document body/root, or still inside the (possibly
	* now-unmounted) trap container. If focus already moved to some other element
	* outside the trap (the user clicked elsewhere, or a consumer such as
	* DropdownMenu already refocused its trigger), the restore is a no-op.
	*/
	(0, import_react.useEffect)(() => {
		if (!isActive) return;
		const previouslyFocused = document.activeElement;
		const container = containerRef.current;
		return () => {
			const active = document.activeElement;
			if (!(active == null || active === document.body || active === document.documentElement || container != null && container.contains(active))) return;
			if (previouslyFocused != null && previouslyFocused.isConnected && typeof previouslyFocused.focus === "function") previouslyFocused.focus();
		};
	}, [isActive]);
	/**
	* Handle focus events - redirect focus back into container if it escapes.
	* Only redirects for keyboard navigation, not mouse clicks.
	*/
	(0, import_react.useEffect)(() => {
		if (!isActive) return;
		const handleFocus = (event) => {
			const container = containerRef.current;
			if (!container) return;
			const target = event.target;
			if (container.contains(target)) lastFocusRef.current = target;
			else if (isKeyboardNavigationRef.current) {
				const focusedFirst = focusFirstDescendant(container);
				if (focusedFirst && lastFocusRef.current === document.activeElement) focusLastDescendant(container);
				else if (!focusedFirst && lastFocusRef.current instanceof HTMLElement && container.contains(lastFocusRef.current)) attemptFocus(lastFocusRef.current);
				lastFocusRef.current = document.activeElement;
			}
			isKeyboardNavigationRef.current = false;
		};
		document.addEventListener("focus", handleFocus, true);
		return () => {
			document.removeEventListener("focus", handleFocus, true);
		};
	}, [isActive]);
	/**
	* Handle Tab key to wrap focus at boundaries. Also tracks that keyboard
	* navigation is occurring.
	*
	* No Escape here, and no IME guard: the shared stack owns the press, claims
	* a composing Escape so no close request follows, and dismisses the trap
	* through `onEscape` above. The trap renders no element of its own, so it
	* has no `cancel` to answer either.
	*/
	(0, import_react.useEffect)(() => {
		if (!isActive) return;
		const handleKeyDown = (event) => {
			const container = containerRef.current;
			if (!container) return;
			if (event.key === "Tab") {
				isKeyboardNavigationRef.current = true;
				const focusable = getFocusableElements(container);
				if (focusable.length === 0) {
					const active = document.activeElement;
					if (!(active instanceof HTMLElement) || !container.contains(active)) return;
					event.preventDefault();
					lastFocusRef.current = active;
					isKeyboardNavigationRef.current = false;
					return;
				}
				const first = focusable[0];
				const last = focusable[focusable.length - 1];
				if (event.shiftKey) {
					if (document.activeElement === first) {
						event.preventDefault();
						last.focus();
					}
				} else if (document.activeElement === last) {
					event.preventDefault();
					first.focus();
				}
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [isActive, onEscape]);
	return {
		containerRef,
		focusFirst
	};
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/hooks/useAnnounce.js
/**
* @file useAnnounce.ts
* @input Uses React useCallback; DOM APIs for a singleton live-region pair
* @output Exports useAnnounce hook and AnnouncePoliteness type
* @position Core a11y hook; provides imperative screen-reader announcements
*   via persistently-mounted polite/assertive live regions; regions are
*   auto-cleared shortly after announcing so stale status text does not
*   linger in the accessibility tree
*
* SYNC: When modified, update:
* - /packages/core/src/hooks/index.ts
*/
/**
* Announcement urgency:
* - `'polite'` (default): announced when the screen reader is idle. Use for
*   status updates, result counts, "no results", non-urgent confirmations.
* - `'assertive'`: interrupts the current announcement. Reserve for errors and
*   time-sensitive alerts.
*/
/**
* Imperative screen-reader announcement function.
*/
var CONTAINER_ATTR = "data-astryx-live-region";
var VISUALLY_HIDDEN_CSS = "position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;inset-block-start:0;inset-inline-start:0;pointer-events:none;user-select:none;";
/**
* How long an announcement stays in its region before being auto-cleared.
* Long enough for screen readers to pick the message up and finish reading
* it; clearing afterwards keeps stale status text out of the accessibility
* tree for users who browse the DOM later. Each announce resets the timer.
*/
var CLEAR_DELAY_MS = 2e3;
var clearTimers = {
	polite: null,
	assertive: null
};
function cancelScheduledClear(politeness) {
	const timer = clearTimers[politeness];
	if (timer != null) {
		clearTimeout(timer);
		clearTimers[politeness] = null;
	}
}
function scheduleClear(politeness, target) {
	cancelScheduledClear(politeness);
	clearTimers[politeness] = setTimeout(() => {
		clearTimers[politeness] = null;
		target.textContent = "";
	}, CLEAR_DELAY_MS);
}
var regions = null;
function createRegion(politeness) {
	const el = document.createElement("div");
	el.setAttribute(CONTAINER_ATTR, politeness);
	el.setAttribute("aria-live", politeness);
	el.setAttribute("aria-atomic", "true");
	el.setAttribute("role", politeness === "assertive" ? "alert" : "status");
	el.style.cssText = VISUALLY_HIDDEN_CSS;
	document.body.appendChild(el);
	return el;
}
function getRegions() {
	if (typeof document === "undefined") return null;
	if (regions) {
		if (!regions.polite.isConnected) document.body.appendChild(regions.polite);
		if (!regions.assertive.isConnected) document.body.appendChild(regions.assertive);
		return regions;
	}
	regions = {
		polite: createRegion("polite"),
		assertive: createRegion("assertive")
	};
	return regions;
}
function announceMessage(message, politeness) {
	const r = getRegions();
	if (!r) return;
	const target = politeness === "assertive" ? r.assertive : r.polite;
	target.textContent = "";
	requestAnimationFrame(() => {
		target.textContent = message;
	});
	scheduleClear(politeness, target);
}
/**
* Clear any pending announcement from a region without announcing anything new.
* Used when the triggering context goes away (e.g. a search query is cleared),
* so stale status text does not linger in the accessibility tree.
*/
function clearRegion(politeness) {
	cancelScheduledClear(politeness);
	if (!regions) return;
	const target = politeness === "assertive" ? regions.assertive : regions.polite;
	target.textContent = "";
}
/**
* Returns an imperative `announce(message, politeness?)` function that speaks a
* message through a persistently-mounted, visually-hidden live region.
*
* The polite and assertive regions are created once on first use and kept
* mounted, so announcements are reliable even for messages that appear
* immediately (unlike a live region rendered together with its content).
* Each message is automatically cleared a couple of seconds after being
* announced, so users browsing the DOM later do not encounter stale status
* text; announcing again before the clear simply resets the countdown.
*
* @example
* ```
* function Search() {
*   const announce = useAnnounce();
*   const onResults = (n: number) => {
*     announce(n === 0 ? 'No results found' : `${n} results`);
*   };
*   // ...
* }
* ```
*/
function useAnnounce() {
	return (0, import_react.useCallback)((message, politeness = "polite") => {
		if (!message) {
			clearRegion(politeness);
			return;
		}
		announceMessage(message, politeness);
	}, []);
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/hooks/useTypeahead.js
/**
* @file useTypeahead.ts
* @input Uses React useCallback/useRef
* @output Exports useTypeahead hook for first-character (type-to-focus) search
* @position Core hook; adds APG typeahead to menus, listboxes, and other
*   collections. Composes with useListFocus/useGridFocus (or any collection)
*   via a caller-supplied getItemLabels + onMatch.
*
* SYNC: When modified, update:
* - /packages/core/src/hooks/index.ts
*/
/**
* Whether a key event represents a single printable character (a type-to-focus
* candidate) rather than a control/navigation key or a shortcut chord.
*/
function isPrintableCharacter(e) {
	return e.key.length === 1 && !e.ctrlKey && !e.metaKey && e.key !== " ";
}
/**
* First-character ("type-ahead") search for a collection.
*
* Buffers printable keystrokes (resetting after `resetMs` of inactivity),
* matches items whose label starts with the buffer, and cycles from the
* current index — so pressing "s" repeatedly walks through the "s" items
* instead of sticking on the first. Space is reserved for activation and is
* only treated as typeahead while a buffer is already active.
*
* Additive and collection-agnostic: it does not move focus itself; the caller
* wires `onMatch` to its own focus/selection (e.g. `useListFocus.focusItem`).
*
* @example
* ```
* const {listRef, handleKeyDown, focusItem, getItems} = useListFocus(...);
* const typeahead = useTypeahead({
*   getItemLabels: () => getItems().map(el => el.textContent),
*   onMatch: focusItem,
*   getCurrentIndex: () => getItems().findIndex(el => el === document.activeElement),
* });
* const onKeyDown = (e) => { if (!typeahead.onKeyDown(e)) handleKeyDown(e); };
* ```
*/
function useTypeahead(options) {
	const { getItemLabels, onMatch, getCurrentIndex, resetMs = 750, isDisabled } = options;
	const bufferRef = (0, import_react.useRef)("");
	const timeoutRef = (0, import_react.useRef)(void 0);
	const reset = (0, import_react.useCallback)(() => {
		bufferRef.current = "";
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = void 0;
		}
	}, []);
	const scheduleReset = (0, import_react.useCallback)(() => {
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => {
			bufferRef.current = "";
			timeoutRef.current = void 0;
		}, resetMs);
	}, [resetMs]);
	return {
		onKeyDown: (0, import_react.useCallback)((e) => {
			const isSpaceMidType = e.key === " " && !e.ctrlKey && !e.metaKey && bufferRef.current.length > 0;
			if (!isPrintableCharacter(e) && !isSpaceMidType) return false;
			const labels = getItemLabels();
			if (labels.length === 0) return false;
			const char = e.key.toLowerCase();
			const nextBuffer = bufferRef.current.length > 0 && bufferRef.current.split("").every((c) => c === char) ? char : bufferRef.current + char;
			bufferRef.current = nextBuffer;
			scheduleReset();
			const current = getCurrentIndex?.() ?? -1;
			const count = labels.length;
			const hasCurrent = current >= 0;
			const start = hasCurrent ? current : 0;
			const offset = hasCurrent && nextBuffer.length === 1 ? 1 : 0;
			for (let i = 0; i < count; i++) {
				const index = (start + offset + i + count) % count;
				if (isDisabled?.(index)) continue;
				const label = labels[index];
				if (label != null && label.trim().toLowerCase().startsWith(nextBuffer)) {
					onMatch(index);
					return true;
				}
			}
			return true;
		}, [
			getItemLabels,
			onMatch,
			getCurrentIndex,
			scheduleReset,
			isDisabled
		]),
		reset
	};
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/hooks/scrollbarGutter.js
/**
* @file scrollbarGutter.ts
* @input The element a scroll lock pins, plus live layout measurements
* @output Exports holdScrollbarGutter and the ScrollbarGutterHold it returns
* @position Internal hook utility; used by useScrollLock and MobileNav so that
*   locking background scroll does not resize the layout viewport.
*
* Locking scroll hides the document's scrollbar. Where that scrollbar is a
* classic (space-taking) one — Windows/Linux desktop, and macOS set to
* "Always" show scroll bars — hiding it widens the layout viewport by the
* scrollbar's width and the whole page jumps sideways behind the overlay.
*
* The fix is `scrollbar-gutter: stable`, which holds the gutter open once the
* scrollbar goes away. Being a real layout change it holds `position: fixed`
* chrome (sticky headers, toast viewports) as well as in-flow content, which
* padding fundamentally cannot: fixed elements resolve against the viewport,
* not against the padded element.
*
* Padding is kept only as a fallback for engines without `scrollbar-gutter`
* (Safari shipped it in 18.2), and it is applied by measuring whether the
* element actually moved rather than by assuming it did.
*/
var NOOP = {
	settle() {},
	release() {}
};
/**
* Keeps `element`'s content box the width it is right now, across a scroll
* lock that is about to hide the document's scrollbar.
*
* Call it *before* applying the lock's styles, then {@link
* ScrollbarGutterHold.settle} immediately after, and {@link
* ScrollbarGutterHold.release} on unlock:
*
* ```
* const hold = holdScrollbarGutter(document.body);
* body.style.position = 'fixed';
* hold.settle();
* ```
*
* Overlay scrollbars (mobile, default macOS) take no layout space, so there is
* nothing to hold and nothing is touched.
*/
function holdScrollbarGutter(element) {
	if (typeof window === "undefined" || typeof document === "undefined") return NOOP;
	const root = document.documentElement;
	const viewportWidth = root.clientWidth;
	if (viewportWidth === 0) return NOOP;
	const previousGutter = root.style.scrollbarGutter;
	const previousPadding = element.style.paddingRight;
	const widthBefore = element.getBoundingClientRect().width;
	let heldGutter = false;
	let padded = false;
	let settled = false;
	if (window.innerWidth > viewportWidth) {
		root.style.scrollbarGutter = "stable";
		heldGutter = true;
	}
	return {
		settle() {
			if (settled) return;
			settled = true;
			const grew = element.getBoundingClientRect().width - widthBefore;
			if (grew <= 0) return;
			const existing = Number.parseFloat(window.getComputedStyle(element).paddingRight) || 0;
			element.style.paddingRight = `${existing + grew}px`;
			padded = true;
		},
		release() {
			if (padded) {
				element.style.paddingRight = previousPadding;
				padded = false;
			}
			if (heldGutter) {
				root.style.scrollbarGutter = previousGutter;
				heldGutter = false;
			}
		}
	};
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/hooks/useScrollLock.js
/**
* @file useScrollLock.ts
* @input Uses React useEffect
* @output Exports useScrollLock hook for locking body scroll
* @position Core hook; used by Dialog to prevent background scrolling
*
* Locks body scroll when active by pinning the body with position:fixed.
* This is needed because overscroll-behavior:contain doesn't work on iOS Safari.
*
* SYNC: When modified, update:
* - /packages/core/src/hooks/index.ts
* - /packages/core/src/hooks/scrollbarGutter.ts
*/
var lockCount = 0;
var originalBodyState = null;
/**
* Locks body scroll when `isLocked` is true.
*
* Pins the body with `position: fixed` to prevent background scrolling,
* which is necessary for iOS Safari where `overscroll-behavior: contain`
* does not prevent body scroll behind modals. Restores scroll position
* on unlock.
*
* Pinning also hides the document's scrollbar, so the gutter that scrollbar
* occupied is held open for the duration of the lock — without it the page
* reflows sideways by ~15px the moment an overlay opens.
*
* @example
* ```
* useScrollLock(isOpen);
* ```
*/
function useScrollLock(isLocked) {
	(0, import_react.useEffect)(() => {
		if (!isLocked) return;
		const { body } = document;
		if (lockCount === 0) {
			const scrollX = window.scrollX;
			const scrollY = window.scrollY;
			const gutter = holdScrollbarGutter(body);
			originalBodyState = {
				scrollX,
				scrollY,
				overflow: body.style.overflow,
				position: body.style.position,
				top: body.style.top,
				left: body.style.left,
				right: body.style.right,
				gutter
			};
			body.style.overflow = "hidden";
			body.style.position = "fixed";
			body.style.top = `-${scrollY}px`;
			body.style.left = "0";
			body.style.right = "0";
			gutter.settle();
		}
		lockCount += 1;
		return () => {
			lockCount -= 1;
			if (lockCount !== 0 || originalBodyState == null) return;
			const state = originalBodyState;
			originalBodyState = null;
			body.style.overflow = state.overflow;
			body.style.position = state.position;
			body.style.top = state.top;
			body.style.left = state.left;
			body.style.right = state.right;
			state.gutter.release();
			window.scrollTo(state.scrollX, state.scrollY);
		};
	}, [isLocked]);
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/hooks/useEntryAnimation.js
/**
* @file useEntryAnimation.ts
* @input Uses React, StyleX, theme tokens
* @output Exports useEntryAnimation hook for mount-only entry animations
* @position Hook utility; consumed by FieldStatus and available to consumers
*
* Provides entry animations for conditionally rendered elements.
* Only animates when the element is dynamically mounted after the initial
* page paint — statically rendered elements on page load are not animated.
*/
var initialPaintComplete = false;
if (typeof window !== "undefined") requestAnimationFrame(() => {
	initialPaintComplete = true;
});
var styles$28 = {
	slideDown: {
		kKVMdj: "x1srr2gu x1aquc0h",
		k44tkh: "x9uej1z",
		kyAemX: "x128ha8g",
		kWV6AL: "xskzprw",
		$$css: true
	},
	slideUp: {
		kKVMdj: "x1dvww92 x1aquc0h",
		k44tkh: "x9uej1z",
		kyAemX: "x128ha8g",
		kWV6AL: "xskzprw",
		$$css: true
	},
	fadeIn: {
		kKVMdj: "xqcmdr3 x1aquc0h",
		k44tkh: "x9uej1z",
		kyAemX: "x128ha8g",
		kWV6AL: "xskzprw",
		$$css: true
	},
	scaleIn: {
		kKVMdj: "x97zbip x1aquc0h",
		k44tkh: "x9uej1z",
		kyAemX: "x128ha8g",
		kWV6AL: "xskzprw",
		$$css: true
	}
};
/**
* Returns a StyleX style for animating an element on mount.
*
* Only animates when the element is dynamically inserted after the initial
* page paint. Elements rendered on page load are not animated.
*
* @example
* ```
* const entryStyle = useEntryAnimation('slideDown');
* <div {...stylex.props(entryStyle)}>Animated content</div>
* ```
*/
function useEntryAnimation(preset = "slideDown") {
	const [animate] = (0, import_react.useState)(() => initialPaintComplete);
	return animate ? styles$28[preset] : null;
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/hooks/useClickableContainer.js
/**
* @file useClickableContainer.ts
* @input Container ref, interactive element ref, click/href handlers
* @output onClick and onMouseUp handlers for the container; INTERACTIVE_SELECTORS list
* @position Core hook for clickable containers that safely handle nested interactive elements
*
* Solves the "nested interactive elements" problem: when a card is clickable
* but contains buttons/links, clicking those should NOT trigger the card's action.
*
* SYNC: When modified, update:
* - /packages/core/src/hooks/index.ts (export)
*/
/**
* Canonical list of interactive element selectors — native controls plus
* role-based interactive elements. Clicks on these (or their descendants)
* should NOT bubble to a clickable container's click handler.
*
* Exported so other focus/interaction utilities can share one comprehensive
* definition of "interactive target" rather than hand-rolling divergent lists.
* Note: this list is about "don't bubble clicks", not focus-eligibility —
* consumers that need focusable elements must additionally exclude
* unfocusable/disabled targets (e.g. `[tabindex="-1"]`, `:disabled`).
*/
var INTERACTIVE_SELECTORS = [
	"button",
	"a",
	"input",
	"select",
	"textarea",
	"[role=\"button\"]",
	"[role=\"link\"]",
	"[role=\"checkbox\"]",
	"[role=\"radio\"]",
	"[role=\"switch\"]",
	"[role=\"tab\"]",
	"[role=\"menuitem\"]",
	"[role=\"option\"]",
	"[role=\"combobox\"]",
	"[role=\"listbox\"]",
	"[role=\"slider\"]",
	"[role=\"spinbutton\"]",
	"[data-pressable-container]"
].join(",");
var NON_INTERACTIVE_SELECTORS = "[aria-readonly=\"true\"]";
/**
* Check whether an element has an interactive ancestor between it and the root.
* If the click target is inside a nested button/link/etc., we should NOT
* handle it at the container level.
*/
function hasInteractiveAncestor(el, rootEl) {
	let current = el;
	while (current != null && current !== rootEl && current !== document.body) {
		if (current.matches(INTERACTIVE_SELECTORS) && !current.matches(NON_INTERACTIVE_SELECTORS)) return true;
		current = current.parentElement;
	}
	return false;
}
/** Check if there's a text selection inside the node (don't navigate on text select) */
function hasTextSelection(node) {
	if (typeof document === "undefined" || !("getSelection" in document)) return false;
	const selection = document.getSelection();
	if (selection == null || selection.isCollapsed) return false;
	return node.contains(selection.anchorNode);
}
/**
* Hook that makes a container element clickable while preserving
* nested interactive element behavior.
*
* When the user clicks the container surface (not on a nested button/link),
* the hook fires the onClick handler or navigates to href.
* When the user clicks a nested interactive element, it does nothing —
* the nested element handles its own event.
*
* @compositionHint Use inside ClickableCard or SelectableCard.
* For custom interactive containers, pair with a ref to the outer div.
*
* @example
* ```
* const containerRef = useRef<HTMLDivElement>(null);
* const { onClick, onMouseUp } = useClickableContainer({
*   containerRef,
*   onClick: () => console.log('card clicked'),
* });
* return (
*   <div ref={containerRef} onClick={onClick} onMouseUp={onMouseUp}>
*     <p>Click anywhere on this card</p>
*     <button onClick={() => alert('button')}>Nested button</button>
*   </div>
* );
* ```
*/
function useClickableContainer({ containerRef, interactiveRef, onClick: onClickProp, href, target, disabled = false }) {
	(0, import_react.useEffect)(() => {
		const el = containerRef.current;
		if (el) el.setAttribute("data-pressable-container", "true");
	}, [containerRef]);
	return {
		onClick: (0, import_react.useCallback)((event) => {
			if (disabled) return;
			const containerEl = containerRef.current;
			if (!containerEl) return;
			if (hasTextSelection(containerEl)) return;
			const eventTarget = event.target;
			if (!(eventTarget instanceof Element)) return;
			if (eventTarget !== event.currentTarget && hasInteractiveAncestor(eventTarget, containerEl)) return;
			onClickProp?.(event);
			if (event.defaultPrevented) return;
			if (href != null) {
				if (target === "_blank" || event.ctrlKey || event.metaKey) window.open(href, "_blank", "noopener");
				else if (interactiveRef?.current) interactiveRef.current.click();
				else window.location.href = href;
			}
			if (href == null && onClickProp == null && interactiveRef?.current) {
				const clickEvent = new MouseEvent("click", {
					bubbles: event.bubbles,
					cancelable: event.cancelable,
					ctrlKey: event.ctrlKey,
					metaKey: event.metaKey,
					shiftKey: event.shiftKey,
					altKey: event.altKey,
					button: event.button
				});
				interactiveRef.current.dispatchEvent(clickEvent);
				event.stopPropagation();
			}
		}, [
			containerRef,
			interactiveRef,
			onClickProp,
			href,
			target,
			disabled
		]),
		onMouseUp: (0, import_react.useCallback)((event) => {
			if (disabled) return;
			const containerEl = containerRef.current;
			if (!containerEl) return;
			const eventTarget = event.target;
			if (!(eventTarget instanceof Element)) return;
			if (event.button === 1 && href != null && (eventTarget === event.currentTarget || !hasInteractiveAncestor(eventTarget, containerEl))) window.open(href, "_blank", "noopener");
		}, [
			containerRef,
			href,
			disabled
		])
	};
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/hooks/useInputContainer.js
/**
* @file useInputContainer.ts
* @input Container ref, input ref
* @output onClick and onMouseUp handlers for the input container wrapper
* @position Hook for input wrapper containers that delegate focus to the inner input/textarea
*
* Uses useClickableContainer to safely handle nested interactive elements
* (clear buttons, calendar toggles, etc.) while focusing the input when
* clicking non-interactive areas (icons, padding, status indicators).
*/
/**
* Input types that should receive `.focus()` when the container is clicked.
* Other input types (e.g. checkbox, radio, file) use `.click()` instead.
*/
var FOCUS_INPUT_TYPES = /* @__PURE__ */ new Set([
	"text",
	"password",
	"email",
	"number",
	"search",
	"tel",
	"url",
	"date",
	"datetime-local",
	"month",
	"time",
	"week"
]);
/**
* `aria-haspopup` values that advertise a control opens a popup on activation.
* https://www.w3.org/TR/wai-aria-1.2/#aria-haspopup
*/
var HASPOPUP_VALUES = /* @__PURE__ */ new Set([
	"true",
	"menu",
	"listbox",
	"tree",
	"grid",
	"dialog"
]);
/**
* Whether an element is a popup trigger — a combobox or any control that
* advertises `aria-haspopup`. Such controls activate their popup on *click*
* (e.g. DateInput's `<input type="text" role="combobox" aria-haspopup="dialog">`
* opens its calendar via `onClick`, with no `onFocus` opener). Forwarding a
* container click to `.focus()` would focus the control but leave the popup
* closed — so we `.click()` these instead. Plain text inputs (no popup) are
* unaffected and keep `.focus()`.
*/
function isPopupTrigger(el) {
	if (el.getAttribute("role") === "combobox") return true;
	const haspopup = el.getAttribute("aria-haspopup");
	return haspopup != null && HASPOPUP_VALUES.has(haspopup);
}
/**
* Hook that makes an input container wrapper clickable, delegating focus
* to the inner input/textarea when the user clicks non-interactive areas
* (icons, padding, status indicators).
*
* Nested interactive elements (clear buttons, links) are handled safely
* via useClickableContainer — clicking them does NOT steal focus.
*
* @compositionHint Use inside input wrapper components (TextInput,
* NumberInput, TimeInput, TextArea, etc.).
*
* @example
* ```
* const containerRef = useRef<HTMLDivElement>(null);
* const inputRef = useRef<HTMLInputElement>(null);
* const { onClick, onMouseUp } = useInputContainer({
*   containerRef,
*   inputRef,
* });
* return (
*   <div ref={containerRef} onClick={onClick} onMouseUp={onMouseUp}>
*     <Icon icon="search" />
*     <input ref={inputRef} />
*   </div>
* );
* ```
*/
function useInputContainer({ containerRef, inputRef, disabled = false }) {
	return useClickableContainer({
		containerRef,
		interactiveRef: inputRef,
		onClick: (0, import_react.useCallback)(() => {
			const input = inputRef.current;
			if (input == null) return;
			if (input instanceof HTMLElement && isPopupTrigger(input)) input.click();
			else if (input instanceof HTMLInputElement && FOCUS_INPUT_TYPES.has(input.type)) input.focus();
			else if (input instanceof HTMLTextAreaElement) input.focus();
			else if (input instanceof HTMLElement) input.click();
			else if ("focus" in input) input.focus();
		}, [inputRef]),
		disabled
	});
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/Tooltip/Tooltip.js
/**
* @file Tooltip.tsx
* @input Uses React, useTooltip hook
* @output Exports Tooltip component for hover/focus triggered tooltips
* @position Layer component; uses display:contents wrapper to avoid cloneElement
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/Tooltip/index.ts
* - /apps/storybook/stories/Tooltip.stories.tsx
* - /packages/cli/assets/templates/blocks/components/Tooltip/ (showcase blocks)
*/
var Tooltip_exports = /* @__PURE__ */ __exportAll({ Tooltip: () => Tooltip });
/**
* Check if children are text-only (no React elements)
*/
function isTextOnly(children) {
	return typeof children === "string" || typeof children === "number";
}
/**
* Utility to merge ARIA ID strings
*/
function mergeIds(...ids) {
	const filtered = ids.filter(Boolean);
	return filtered.length > 0 ? filtered.join(" ") : void 0;
}
/**
* Tooltip component for displaying informative text on hover/focus.
*
* Uses inverted colors (dark background, light text) for high contrast.
* Uses a display:contents wrapper so children refs are preserved.
* Uses CSS anchor positioning and the Popover API for optimal performance.
*
* @example
* ```
* <Tooltip content="Helpful tooltip text" placement="above">
*   <Button>Hover me</Button>
* </Tooltip>
* ```
*/
function Tooltip({ children, anchorRef, content, placement = "above", alignment = "center", delay = 200, hideDelay = 0, focusTrigger = "auto", touchTrigger = "auto", isEnabled = true, onOpenChange, hasHoverIndication = "auto", isOpen, isDefaultOpen }) {
	const wrapperRef = (0, import_react.useRef)(null);
	const textOnly = children != null ? isTextOnly(children) : false;
	const showHoverIndication = hasHoverIndication === true || hasHoverIndication === "auto" && textOnly;
	const tooltip = useTooltip({
		placement,
		alignment,
		delay,
		hideDelay,
		focusTrigger,
		touchTrigger,
		isEnabled,
		isOpen,
		isDefaultOpen,
		onShow: (0, import_react.useCallback)(() => {
			onOpenChange?.(true);
		}, [onOpenChange]),
		onHide: (0, import_react.useCallback)(() => {
			onOpenChange?.(false);
		}, [onOpenChange])
	});
	useIsomorphicLayoutEffect(() => {
		if (!anchorRef) return;
		const el = anchorRef.current;
		if (!el) return;
		tooltip.ref(el);
		const existingDescribedBy = el.getAttribute("aria-describedby");
		el.setAttribute("aria-describedby", mergeIds(existingDescribedBy, tooltip.describedBy) ?? "");
		return () => {
			tooltip.ref(null);
			if (existingDescribedBy) el.setAttribute("aria-describedby", existingDescribedBy);
			else el.removeAttribute("aria-describedby");
		};
	}, [
		anchorRef,
		tooltip.ref,
		tooltip.describedBy
	]);
	useIsomorphicLayoutEffect(() => {
		if (anchorRef) return;
		if (textOnly) return;
		const wrapper = wrapperRef.current;
		if (!wrapper) return;
		const firstChild = wrapper.firstElementChild;
		if (!firstChild) return;
		tooltip.ref(firstChild);
		const existingDescribedBy = firstChild.getAttribute("aria-describedby");
		firstChild.setAttribute("aria-describedby", mergeIds(existingDescribedBy, tooltip.describedBy) ?? "");
		return () => {
			tooltip.ref(null);
			if (existingDescribedBy) firstChild.setAttribute("aria-describedby", existingDescribedBy);
			else firstChild.removeAttribute("aria-describedby");
		};
	}, [
		anchorRef,
		textOnly,
		tooltip.ref,
		tooltip.describedBy
	]);
	if (anchorRef && children == null) return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: tooltip.renderTooltip(content) });
	if (textOnly) return /*#__PURE__*/ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
		ref: tooltip.ref,
		tabIndex: 0,
		"aria-describedby": tooltip.describedBy,
		...{
			0: { className: "xt0psk2" },
			1: { className: "xt0psk2 xujl8zx xev0dqp xycaml9 xrys4gj" }
		}[!!showHoverIndication << 0],
		children
	}), tooltip.renderTooltip(content)] });
	return /*#__PURE__*/ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
		ref: wrapperRef,
		className: "xjp7ctv",
		children
	}), tooltip.renderTooltip(content)] });
}
Tooltip.displayName = "Tooltip";
//#endregion
//#region node_modules/@astryxdesign/core/dist/hooks/useInputStatusIcon.js
/**
* @file useInputStatusIcon.tsx
* @input Input status, statusVariant, and InputGroup awareness
* @output The on-field status icon element (with tooltip) and aria-describedby wiring
* @position Shared hook for bordered inputs that render a status affordance inside the control
*
* SYNC: When modified, update:
* - /packages/core/src/hooks/index.ts (exports)
*
* Centralizes the on-field status icon across the bordered inputs (TextInput,
* TextArea, NumberInput, DateInput, DateTimeInput, DateRangeInput, TimeInput,
* FileInput) so the three statusVariants behave consistently:
*
* - `attached`  → icon sits inside the control; the message box below carries
*   the text.
* - `detached`  → the detached message box renders its OWN leading icon, so the
*   on-field icon is suppressed here to avoid a duplicate glyph.
* - `tooltip`   → no message box renders; the status is surfaced through an
*   info-tip on the on-field icon. The icon is a real focusable `<button>` so
*   the status is reachable by every user, not just those with hover or a
*   screen reader:
*     - Keyboard (no AT): the button is in the tab order (WCAG 2.1.1) with a
*       visible focus ring (WCAG 2.4.7); focusing it opens the tooltip.
*     - Pointer: hover opens it (guarded to fine pointers).
*     - Touch: hover is unavailable, so a tap toggles the tooltip open/closed.
*     - Assistive tech: the button has an accessible name (its status type,
*       WCAG 4.1.2) and is described by the message via `aria-describedby`.
*     - Dismissible with Escape and hoverable (WCAG 1.4.13) via useTooltip.
*/
/**
* Maps each status type to its glyph. Shared so every input shows the same icon
* for a given status, matching the detached message box's leading icon.
*/
var STATUS_ICON = {
	warning: "warning",
	error: "error",
	success: "success"
};
/**
* Accessible-name i18n keys for the focusable status button, keyed by type.
*/
var STATUS_BUTTON_LABEL_KEY = {
	warning: "@astryx.input.statusButton.warning",
	error: "@astryx.input.statusButton.error",
	success: "@astryx.input.statusButton.success"
};
var styles$27 = { statusButton: {
	k1xSpc: "x3nfvp2",
	kGNEyG: "x6s0dn4",
	kjj79g: "xl56j7k",
	kmVPX3: "x1717udv",
	kogj98: "x1ghz6dp",
	kMwMTN: "x1heor9g",
	kkrTdU: "x1ypdohk x16khyan",
	kfzvcC: "x67bb7w",
	kaIpWk: "xjspbzw",
	kInvED: "x7s97pk",
	$$css: true
} };
/**
* Builds the on-field status icon and its accessibility wiring for a bordered
* input. See the file header for the per-variant behavior.
*/
function useInputStatusIcon({ status, statusVariant = "attached", isInGroup = false, size = "md" }) {
	const t = useTranslator();
	const hasTooltip = statusVariant === "tooltip" && !!status?.message;
	const [tapOpen, setTapOpen] = (0, import_react.useState)(void 0);
	const tooltip = useTooltip({
		placement: "above",
		isEnabled: hasTooltip,
		isOpen: tapOpen
	});
	const handleButtonBlur = (0, import_react.useCallback)(() => {
		setTapOpen(void 0);
	}, []);
	const handleButtonClick = (0, import_react.useCallback)(() => {
		if (typeof window === "undefined" || typeof window.matchMedia !== "function" || !window.matchMedia("(hover: none)").matches) return;
		setTapOpen((prev) => prev === true ? false : true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (tapOpen !== true) return;
		const onKeyDown = (e) => {
			if (e.key === "Escape") setTapOpen(void 0);
		};
		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [tapOpen]);
	if (!(!!status && !isInGroup && statusVariant !== "detached")) return {
		statusIcon: null,
		describedBy: void 0
	};
	const icon = /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Icon, {
		icon: STATUS_ICON[status.type],
		size,
		color: status.type,
		...themeProps("input-status-icon", {
			size,
			status: status.type
		})
	});
	if (!hasTooltip) return {
		statusIcon: icon,
		describedBy: void 0
	};
	return {
		statusIcon: /*#__PURE__*/ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/*#__PURE__*/ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			ref: tooltip.ref,
			"aria-label": t(STATUS_BUTTON_LABEL_KEY[status.type]),
			"aria-describedby": tooltip.describedBy,
			onClick: handleButtonClick,
			onBlur: handleButtonBlur,
			...props(focusOutlineStyles.focusVisible, styles$27.statusButton),
			children: icon
		}), tooltip.renderTooltip(status.message)] }),
		describedBy: tooltip.describedBy
	};
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/InteractiveRoleContext/InteractiveRoleContext.js
/**
* @file InteractiveRoleContext.ts
* @input React createContext, use
* @output Exports InteractiveRoleContext, useInteractiveRoleContext
* @position Context primitive; consumed by useInteractiveRole hook
*
* Provides a role override to optionally-interactive child components.
* When a parent (Popover, DropdownMenu, etc.) needs its child to render
* as a button, it wraps the child in this context with role = 'button'.
*
* Components don't consume this directly — they use `useInteractiveRole`
* which checks this context as one of its decision inputs.
*
* Follows the same pattern as SizeContext:
*   SizeContext provides size → useSize resolves it
*   InteractiveRoleContext provides role → useInteractiveRole resolves it
*
* SYNC: When modified, update:
* - /packages/core/src/InteractiveRoleContext/index.ts
*/
/**
* Context that provides a role override to child components.
*
* Provided by containers that need their child to be interactive:
* - Popover → 'button' (click to open popover)
* - DropdownMenu → 'button' (click to open menu)
* - Any future component that wraps an optionally-interactive trigger
*
* `null` means no parent is overriding — resolve based on own props.
*/
var InteractiveRoleContext = /*#__PURE__*/ (0, import_react.createContext)(null);
InteractiveRoleContext.displayName = "InteractiveRoleContext";
/**
* Read the role override from context, if any.
*
* Most components should use `useInteractiveRole` instead of calling
* this directly — it incorporates this signal alongside href/onClick.
*
* @returns The overridden role, or `null` if no parent is providing one.
*/
function useInteractiveRoleContext() {
	return (0, import_react.use)(InteractiveRoleContext);
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/hooks/useInteractiveRole.js
/**
* @file useInteractiveRole.ts
* @input Uses useInteractiveTrigger
* @output Exports useInteractiveRole hook and InteractiveRole type
* @position Hook utility; consumed by Token, Thumbnail, Item, ClickableCard, etc.
*
* Centralizes the "what element should I render as?" decision for
* polymorphic components. The priority order:
*
*   1. href → 'link' (navigation always wins, unless disabled)
*   2. onClick → 'button' (explicit interactivity)
*   3. interactive trigger context → 'button' (implicit via parent)
*   4. else → 'inert' (non-interactive)
*
* A disabled `href` is excluded at step 1 and therefore resolves via the
* remaining steps — 'inert' when no onClick or context applies.
*
* This hook is the single place to add new context-based triggers
* (e.g., Popover, DropdownMenu, Disclosure). Components that consume
* this hook never need updating when new trigger contexts are added.
*
* SYNC: When modified, update:
* - /packages/core/src/hooks/index.ts (export)
*/
/**
* The resolved interactive role for a polymorphic component.
*
* - `'link'` — render as `<a>` (via LinkComponent)
* - `'button'` — render as `<button>`
* - `'inert'` — render as `<span>` or `<div>` (non-interactive)
*/
/**
* Determines the interactive role for a polymorphic component.
*
* Centralizes the element-type decision so that adding new context-based
* triggers (popover, dropdown, etc.) only requires updating this hook —
* all consuming components inherit the new behavior automatically.
*
* @example
* ```ts
* function Token({ href, onClick, ... }) {
*   const role = useInteractiveRole({ href, onClick });
*
*   switch (role) {
*     case 'link': return <LinkComponent href={href} ...>{content}</LinkComponent>;
*     case 'button': return <button ...>{content}</button>;
*     case 'inert': return <span ...>{content}</span>;
*   }
* }
* ```
*/
function useInteractiveRole({ href, onClick, isDisabled = false }) {
	const contextRole = useInteractiveRoleContext();
	if (href != null && !isDisabled) return "link";
	if (onClick != null) return "button";
	if (contextRole != null) return contextRole;
	return "inert";
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/hooks/useLongPress.js
/**
* @file useLongPress.ts
* @input Long-press options: onLongPress callback, disabled, delayMs, moveCancelPx
* @output Touch handlers to spread onto an element
* @position Core hook for touch long-press invocation; used by ContextMenu
*
* SYNC: When modified, update the hooks barrel /packages/core/src/hooks/index.ts
*
* Detects a single-finger long-press: fires `onLongPress` with the touch
* start point after `delayMs`. Cancels if the finger moves past
* `moveCancelPx` (treated as a scroll/drag), lifts, or the touch is
* cancelled. The pending timer is also cleared on unmount.
*
* Motivation: iOS Safari never synthesizes a `contextmenu` event on
* long-press, so long-press is the only touch affordance for opening
* cursor-positioned surfaces.
*/
var DEFAULT_DELAY_MS = 500;
var DEFAULT_MOVE_CANCEL_PX = 10;
function useLongPress(options) {
	const { onLongPress, disabled = false, delayMs = DEFAULT_DELAY_MS, moveCancelPx = DEFAULT_MOVE_CANCEL_PX } = options;
	const timerRef = (0, import_react.useRef)(null);
	const startRef = (0, import_react.useRef)(null);
	const onLongPressRef = (0, import_react.useRef)(onLongPress);
	onLongPressRef.current = onLongPress;
	const clear = (0, import_react.useCallback)(() => {
		if (timerRef.current != null) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}
		startRef.current = null;
	}, []);
	const onTouchStart = (0, import_react.useCallback)((e) => {
		if (disabled) return;
		if (e.touches.length !== 1) {
			clear();
			return;
		}
		const touch = e.touches[0];
		clear();
		startRef.current = {
			x: touch.clientX,
			y: touch.clientY
		};
		timerRef.current = setTimeout(() => {
			const start = startRef.current;
			if (start == null) return;
			onLongPressRef.current({
				x: start.x,
				y: start.y
			});
		}, delayMs);
	}, [
		disabled,
		delayMs,
		clear
	]);
	const onTouchMove = (0, import_react.useCallback)((e) => {
		const start = startRef.current;
		if (start == null) return;
		if (e.touches.length !== 1) {
			clear();
			return;
		}
		const touch = e.touches[0];
		if (Math.abs(touch.clientX - start.x) > moveCancelPx || Math.abs(touch.clientY - start.y) > moveCancelPx) clear();
	}, [moveCancelPx, clear]);
	(0, import_react.useEffect)(() => clear, [clear]);
	return {
		onTouchStart,
		onTouchMove,
		onTouchEnd: clear,
		onTouchCancel: clear
	};
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/Popover/usePopover.js
/**
* @file usePopover.tsx
* @input Uses useLayer, useFocusTrap, React hooks
* @output Exports usePopover and a package-internal trigger-aware variant.
* @position Higher-level layer utility; used by DatePicker, Combobox, etc.
*
* Combines popover layer behavior with focus trap for dialog-like popovers.
* Use this for interactive popover content that should trap focus.
*
* SYNC: When modified, update:
* - /packages/core/src/Popover/index.ts
*/
var styles$26 = {
	surface: {
		kWkggS: "x1prclbq",
		"--_popover-radius": "xiki222",
		kaIpWk: "x11m9jtl",
		kGVxlE: "x1i5ehqx",
		$$css: true
	},
	contentWrapper: {
		kVAEAm: "x1n2onr6",
		$$css: true
	},
	closeButtonWrapper: {
		kVAEAm: "x10l6tqk",
		krVfgx: "x1ey2m1c",
		kY2c9j: "x1vjfegm",
		kzqmXN: "x1i1rx1s x10okhzq",
		kZKoxP: "xjm9jq1 x132qfvm",
		kVQacm: "xb3r6kr x1dordxg",
		kz4h6p: "x1hyvwdk x10wafsz",
		kfzvcC: "x47corl xbt4iw",
		kLKAdn: "xexx8yu x1kw28su",
		$$css: true
	}
};
/**
* Options for usePopover
*/
/**
* Return type for usePopover
*/
/**
* Hook for creating popover dialogs with focus trapping.
*
* Combines:
* - `useLayer` for popover positioning using CSS anchor positioning
* - `useFocusTrap` for trapping focus within the popover content
* - Auto-focus first element on open
* - Escape key to close (configurable via hasEscapeDismiss)
* - Hidden close button that reveals on focus for accessibility
*
* The render function automatically wraps your content in a focus trap container
* and appends a hidden close button. The button appears at the end of the popover,
* is visually hidden until focused, then shows a tooltip-like message (default: "Close popover").
*
* @example
* ```
* function DatePickerExample() {
*   const inputRef = useRef<HTMLInputElement>(null);
*   const popover = usePopover({
*     onHide: () => inputRef.current?.focus(),
*     closeButtonLabel: 'Close calendar',
*   });
*   return (
*     <>
*       <input ref={inputRef} />
*       <button
*         ref={popover.triggerRef}
*         onClick={popover.toggle}
*         {...popover.triggerProps}>
*         Open Calendar
*       </button>
*       {popover.render(
*         <Calendar />,
*         { placement: 'below', alignment: 'start' }
*       )}
*     </>
*   );
* }
* ```
*/
function usePopoverImplementation(options = {}) {
	const { onShow, onHide, xstyle, className, style, hasLightDismiss = true, hasEscapeDismiss = true, hasAutoFocus = true, hasSurface = true, surfaceTarget, hasCloseButton = true, closeButtonLabel: closeButtonLabelFromProps, dialogLabel, role = "dialog", isModal = true } = options;
	const t = useTranslator();
	const closeButtonLabel = closeButtonLabelFromProps ?? t("@astryx.popover.close");
	const triggerElementRef = (0, import_react.useRef)(null);
	const skipAutoFocusRef = (0, import_react.useRef)(false);
	const layer = useLayerInternal({
		mode: "context",
		lightDismiss: hasLightDismiss,
		onShow,
		onHide
	});
	const { containerRef: contentRef, focusFirst } = useFocusTrap({
		isActive: layer.isOpen,
		onEscape: hasEscapeDismiss || hasLightDismiss ? layer.hide : void 0
	});
	(0, import_react.useEffect)(() => {
		if (layer.isOpen && hasAutoFocus && !skipAutoFocusRef.current) requestAnimationFrame(() => {
			focusFirst();
		});
		if (!layer.isOpen) skipAutoFocusRef.current = false;
	}, [
		layer.isOpen,
		hasAutoFocus,
		focusFirst
	]);
	const triggerRef = (0, import_react.useCallback)((el) => {
		triggerElementRef.current = el;
		layer.ref(el);
	}, [layer]);
	const show = (0, import_react.useCallback)((showOptions) => {
		skipAutoFocusRef.current = showOptions?.skipAutoFocus ?? false;
		layer.show();
	}, [layer]);
	const toggle = (0, import_react.useCallback)(() => {
		if (layer.wasJustDismissed()) return;
		if (layer.isOpen) layer.hide();
		else show();
	}, [layer, show]);
	const triggerProps = {
		"aria-haspopup": role === "dialog" ? "dialog" : "true",
		"aria-expanded": layer.isOpen,
		"aria-controls": layer.id
	};
	useDevWarning("usePopover", "role=\"dialog\" without a `dialogLabel` renders an unnamed dialog. Pass `dialogLabel`, or use `role: \"none\"` for listbox/menu popups whose content already carries its own role.", role === "dialog" && !dialogLabel);
	const render = (0, import_react.useCallback)((children, props$22) => {
		const surfaceProps = themeProps("popover-surface");
		const surfaceClassName = surfaceTarget != null ? `${surfaceProps.className} ${stableClassName(surfaceTarget)}` : surfaceProps.className;
		return layer.render(/*#__PURE__*/ (0, import_jsx_runtime.jsx)(LayerDepthProvider, { children: /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("div", {
			ref: contentRef,
			role: role === "dialog" ? "dialog" : void 0,
			"aria-modal": role === "dialog" && isModal ? true : void 0,
			"aria-label": role === "dialog" ? dialogLabel : void 0,
			...mergeProps({
				...surfaceProps,
				className: surfaceClassName
			}, props(styles$26.contentWrapper, hasSurface && styles$26.surface, xstyle), className, style),
			children: [children, hasCloseButton && /*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
				...props(styles$26.closeButtonWrapper, rtlStyles.centerInline("100%")),
				children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					label: closeButtonLabel,
					onClick: layer.hide
				})
			})]
		}) }), {
			...props$22,
			xstyle: props$22?.xstyle
		});
	}, [
		layer,
		hasCloseButton,
		hasSurface,
		surfaceTarget,
		className,
		style,
		closeButtonLabel,
		contentRef,
		dialogLabel,
		role,
		isModal,
		xstyle
	]);
	return {
		triggerRef,
		contentRef,
		anchorId: layer.anchorId,
		show,
		hide: layer.hide,
		toggle,
		wasJustDismissed: layer.wasJustDismissed,
		isOpen: layer.isOpen,
		id: layer.id,
		render,
		triggerProps
	};
}
function usePopover(options = {}) {
	const { wasJustDismissed: _, ...popover } = usePopoverImplementation(options);
	return popover;
}
/** @internal Used by trigger components; not exported from package barrels. */
function usePopoverInternal(options = {}) {
	return usePopoverImplementation(options);
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/Link/computeTargetAndRel.js
/**
* @file computeTargetAndRel.ts
* @input Link target and rel values
* @output Exports helper for normalizing target/rel link props
* @position Internal utility; consumed by link-rendering components
*/
var BLANK_TARGET_REL_TOKENS = ["noopener", "noreferrer"];
function computeTargetAndRel(target, rel) {
	if (target !== "_blank") return {
		target,
		rel
	};
	const tokens = rel?.split(/\s+/).filter(Boolean) ?? [];
	for (const token of BLANK_TARGET_REL_TOKENS) if (!tokens.includes(token)) tokens.push(token);
	return {
		target,
		rel: tokens.join(" ")
	};
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/Item/Item.js
/**
* @file Item.tsx
* @input Uses React, ReactNode, StyleXStyles, theme tokens, useClickableContainer
* @output Exports Item component, ItemProps type
* @position Core layout primitive; consumed by index.ts, tested by Item.test.tsx
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/Item/Item.doc.mjs
* - /packages/core/src/Item/Item.test.tsx
* - /packages/core/src/Item/index.ts
* - /apps/storybook/stories/Item.stories.tsx
* - /packages/cli/assets/templates/blocks/components/Item/ (showcase blocks)
*/
/**
* Roles on which WAI-ARIA permits the aria-selected attribute.
* https://www.w3.org/TR/wai-aria-1.2/#aria-selected
*/
var ARIA_SELECTED_ROLES = /* @__PURE__ */ new Set([
	"option",
	"tab",
	"row",
	"gridcell",
	"columnheader",
	"rowheader",
	"treeitem"
]);
var styles$25 = {
	root: {
		k1xSpc: "x78zum5",
		kGNEyG: "x6s0dn4",
		kOIVth: "x1txdalj",
		kg3NbH: "xf314gf",
		kVAEAm: "x1n2onr6",
		kB7OPa: "x9f619",
		k9WMMc: "x1yc453h",
		kaIpWk: "xh6dtrn",
		$$css: true
	},
	alignStart: {
		kGNEyG: "x1cy8zhl",
		$$css: true
	},
	interactive: {
		kkrTdU: "x1ypdohk x16khyan",
		k1ekBW: "x15406qy",
		kIyJzY: "xkvfbh3",
		kAMwcw: "xlr8y92",
		$$css: true
	},
	highlighted: {
		kWkggS: "x1lmrjuc",
		$$css: true
	},
	selected: {
		kWkggS: "xgcxg3y",
		$$css: true
	},
	disabled: {
		kkrTdU: "xt0e3qv",
		kfzvcC: "x47corl",
		$$css: true
	},
	inlineLabel: {
		kmuXW: "x2lah0s",
		$$css: true
	},
	inlineDescription: {
		kmuXW: "xs83m0k",
		k7Eaqz: "xeuugli",
		$$css: true
	},
	label: {
		kMwMTN: "x5tbw38",
		kGuDYH: "xjm74w1",
		kLWn49: "xw6l6zx",
		$$css: true
	},
	labelSingleTruncate: {
		kVQacm: "xb3r6kr",
		kg5iWk: "xlyipyv",
		khDVqt: "xuxw1ft",
		$$css: true
	},
	labelMultiTruncate: {
		kVQacm: "xb3r6kr",
		k1xSpc: "x104kibb",
		kgKLqz: "x1ua5tub",
		$$css: true
	},
	description: {
		kMwMTN: "x1gb3s7i",
		kGuDYH: "x141an7d",
		kLWn49: "x1ltkj2j",
		$$css: true
	},
	descriptionSingleTruncate: {
		kVQacm: "xb3r6kr",
		kg5iWk: "xlyipyv",
		khDVqt: "xuxw1ft",
		$$css: true
	},
	descriptionMultiTruncate: {
		kVQacm: "xb3r6kr",
		k1xSpc: "x104kibb",
		kgKLqz: "x1ua5tub",
		$$css: true
	}
};
var dynamicStyles$10 = { lineClamp: (lines) => [{
	kJFfOR: lines != null ? "x1yhjpo9" : lines,
	$$css: true
}, { "--x-WebkitLineClamp": lines != null ? lines : void 0 }] };
var densityStyles$2 = {
	compact: {
		k8WAf4: "xu0wf1k",
		$$css: true
	},
	balanced: {
		k8WAf4: "xce4md1",
		$$css: true
	},
	spacious: {
		k8WAf4: "x8o8v82",
		kg3NbH: "xrrkdod",
		$$css: true
	}
};
/**
* A universal item primitive that unifies the "start content + label +
* description + end content" layout pattern. Use as a building block for list items,
* menu items, contact rows, notification items, and more.
*
* @example
* ```
* <Item
*   startContent={<Avatar src={user.avatar} size="sm" />}
*   label={user.name}
*   description={user.role}
*   endContent={<Badge>Admin</Badge>}
*   onClick={() => navigate(`/users/${user.id}`)}
* />
* ```
*/
function Item({ as: Component = "div", marker, startContent, label, description, endContent, align = "center", density = "balanced", labelLines, descriptionLines, layout = "stacked", onClick, interactiveRef, href, target: targetFromProps, rel: relFromProps, isHighlighted = false, isSelected = false, isDisabled = false, xstyle, className, style, ref, role, ...restProps }) {
	const LinkComponent = useLinkComponent();
	const isDelegate = interactiveRef != null;
	const containerRef = (0, import_react.useRef)(null);
	const { onClick: delegatedOnClick } = useClickableContainer({
		containerRef,
		interactiveRef: interactiveRef ?? void 0,
		disabled: isDisabled
	});
	useDevWarning("Item", "`interactiveRef` is mutually exclusive with `onClick`/`href`. In delegation mode the row only forwards clicks to the referenced control, so `onClick`/`href` are ignored. Drop one of them.", isDelegate && (onClick != null || href != null));
	const isInteractive = onClick != null || href != null || isDelegate;
	const { target, rel } = computeTargetAndRel(targetFromProps, relFromProps);
	const hasParentRole = role != null;
	const allowsAriaSelected = role != null && ARIA_SELECTED_ROLES.has(role);
	const isStringLabel = typeof label === "string";
	const isStringDescription = typeof description === "string";
	const labelTruncateStyle = labelLines != null ? labelLines === 1 ? styles$25.labelSingleTruncate : styles$25.labelMultiTruncate : isStringLabel ? styles$25.labelSingleTruncate : null;
	const isInline = layout === "inline" && description != null;
	const descriptionTruncateStyle = descriptionLines != null ? descriptionLines === 1 ? styles$25.descriptionSingleTruncate : styles$25.descriptionMultiTruncate : isStringDescription || isInline ? styles$25.descriptionSingleTruncate : null;
	const labelAndDescription = /*#__PURE__*/ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
		...props(styles$25.label, isInline && styles$25.inlineLabel, labelTruncateStyle, labelLines != null && labelLines > 1 && dynamicStyles$10.lineClamp(labelLines)),
		children: label
	}), description != null && /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
		...props(styles$25.description, isInline && styles$25.inlineDescription, descriptionTruncateStyle, descriptionLines != null && descriptionLines > 1 && dynamicStyles$10.lineClamp(descriptionLines)),
		children: description
	})] });
	const handleContainerClick = (e) => {
		if (isDisabled) return;
		if (e.target.closest("button, a, input, select, textarea")) return;
		onClick?.(e);
	};
	const innerContent = /*#__PURE__*/ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		marker,
		startContent != null && /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
			className: "x3psx0u x78zum5",
			children: startContent
		}),
		hasParentRole || isDelegate ? /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
			...{
				0: { className: "x78zum5 xdt5ytf x98rzlu xeuugli x1yc453h" },
				2: { className: "x78zum5 x98rzlu xeuugli x1yc453h x1q0g3np x6s0dn4 x1lfs0n9" },
				1: { className: "x78zum5 xdt5ytf x98rzlu xeuugli x1yc453h xbyyjgo" },
				3: { className: "x78zum5 x98rzlu xeuugli x1yc453h x1q0g3np x6s0dn4 x1lfs0n9 xbyyjgo" }
			}[!!isInline << 1 | !!isDisabled << 0],
			children: labelAndDescription
		}) : href != null ? /*#__PURE__*/ (0, import_jsx_runtime.jsx)(LinkComponent, {
			href,
			target,
			rel,
			"aria-disabled": isDisabled || void 0,
			tabIndex: isDisabled ? -1 : void 0,
			...{
				0: { className: "xmper1u x16khyan xln7xf2 x1heor9g x78zum5 xdt5ytf x98rzlu xeuugli x1yc453h x1hl2dhg x1a2a7pz" },
				2: { className: "xmper1u x16khyan xln7xf2 x1heor9g x78zum5 x98rzlu xeuugli x1yc453h x1hl2dhg x1a2a7pz x1q0g3np x6s0dn4 x1lfs0n9" },
				1: { className: "xmper1u x16khyan xln7xf2 x1heor9g x78zum5 xdt5ytf x98rzlu xeuugli x1yc453h x1hl2dhg x1a2a7pz xbyyjgo" },
				3: { className: "xmper1u x16khyan xln7xf2 x1heor9g x78zum5 x98rzlu xeuugli x1yc453h x1hl2dhg x1a2a7pz x1q0g3np x6s0dn4 x1lfs0n9 xbyyjgo" }
			}[!!isInline << 1 | !!isDisabled << 0],
			children: labelAndDescription
		}) : onClick != null ? /*#__PURE__*/ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick,
			disabled: isDisabled,
			...{
				0: { className: "xmper1u x16khyan xln7xf2 x1heor9g x78zum5 xdt5ytf x98rzlu xeuugli x1yc453h x1a2a7pz" },
				2: { className: "xmper1u x16khyan xln7xf2 x1heor9g x78zum5 x98rzlu xeuugli x1yc453h x1a2a7pz x1q0g3np x6s0dn4 x1lfs0n9" },
				1: { className: "xmper1u x16khyan xln7xf2 x1heor9g x78zum5 xdt5ytf x98rzlu xeuugli x1yc453h x1a2a7pz xbyyjgo" },
				3: { className: "xmper1u x16khyan xln7xf2 x1heor9g x78zum5 x98rzlu xeuugli x1yc453h x1a2a7pz x1q0g3np x6s0dn4 x1lfs0n9 xbyyjgo" }
			}[!!isInline << 1 | !!isDisabled << 0],
			children: labelAndDescription
		}) : /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
			...{
				0: { className: "x78zum5 xdt5ytf x98rzlu xeuugli x1yc453h" },
				2: { className: "x78zum5 x98rzlu xeuugli x1yc453h x1q0g3np x6s0dn4 x1lfs0n9" },
				1: { className: "x78zum5 xdt5ytf x98rzlu xeuugli x1yc453h xbyyjgo" },
				3: { className: "x78zum5 x98rzlu xeuugli x1yc453h x1q0g3np x6s0dn4 x1lfs0n9 xbyyjgo" }
			}[!!isInline << 1 | !!isDisabled << 0],
			children: labelAndDescription
		}),
		endContent != null && /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
			...{
				0: { className: "x3psx0u x78zum5 xvc5jky" },
				1: { className: "x3psx0u x78zum5 xvc5jky xbyyjgo" }
			}[!!isDisabled << 0],
			children: endContent
		})
	] });
	const mergedRef = useMergedRefs(ref, containerRef);
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Component, {
		ref: isDelegate ? mergedRef : ref,
		...restProps,
		"aria-selected": allowsAriaSelected && isSelected || void 0,
		"aria-current": restProps["aria-current"] ?? (isSelected && !allowsAriaSelected ? true : void 0),
		"aria-disabled": isDisabled || void 0,
		...mergeProps(themeProps("item", {
			density,
			align
		}), focusOutlineProps.focusWithin(styles$25.root, densityStyles$2[density], align === "start" && styles$25.alignStart, isInteractive && styles$25.interactive, isInteractive && interactionOverlayStyles.backgroundColor, isHighlighted && styles$25.highlighted, isSelected && styles$25.selected, isDisabled && !hasParentRole && styles$25.disabled, xstyle), className, style),
		role,
		onClick: isDelegate ? delegatedOnClick : hasParentRole ? onClick : isInteractive ? handleContainerClick : void 0,
		children: innerContent
	});
}
Item.displayName = "Item";
//#endregion
//#region node_modules/@astryxdesign/core/dist/DropdownMenu/DropdownMenuContext.js
/**
* @file DropdownMenuContext.tsx
* @output Exports context and hook for compound-component menu coordination
* @position Internal; used by DropdownMenu and DropdownMenuItem
*
* Provides menu state (close callback, size) to compound children.
* Keyboard navigation is handled by useListFocus on the menu container —
* items don't need to register themselves.
*/
/** Menu size, derived from the trigger button size. */
var DropdownMenuContext = /*#__PURE__*/ (0, import_react.createContext)(null);
DropdownMenuContext.displayName = "DropdownMenuContext";
/**
* Hook for compound menu items to access menu state.
* Returns null outside of a DropdownMenu.
*/
function useDropdownMenuContext() {
	return (0, import_react.use)(DropdownMenuContext);
}
var DropdownMenuRadioGroupContext = /*#__PURE__*/ (0, import_react.createContext)(null);
DropdownMenuRadioGroupContext.displayName = "DropdownMenuRadioGroupContext";
//#endregion
//#region node_modules/@astryxdesign/core/dist/DropdownMenu/menuItemHover.js
/**
* @file menuItemHover.ts
* @output Exports focusMenuItemOnHover
* @position Shared helper for DropdownMenu/ContextMenu item components
*
* Menus keep a single highlighted item by using DOM focus as the sole
* highlight source. Mouse hover moves focus onto the pointed-at item so the
* one focus highlight follows the pointer — instead of a separate `:hover`
* background leaving the keyboard-focused item highlighted at the same time.
*
* SYNC: When modified, update the item components that use it:
* - /packages/core/src/DropdownMenu/DropdownMenuItem.tsx
* - /packages/core/src/DropdownMenu/DropdownMenuCheckboxItem.tsx
* - /packages/core/src/DropdownMenu/DropdownMenuRadioItem.tsx
* - /packages/core/src/DropdownMenu/DropdownMenuSubMenu.tsx
*/
/**
* Move focus to a menu item as the pointer moves over it, so hover and
* keyboard navigation share a single focus-driven highlight. Only reacts to a
* real mouse (not touch/pen, which have no hover), and skips disabled items.
*/
function focusMenuItemOnHover(e, isDisabled) {
	if (isDisabled || e.pointerType !== "mouse") return;
	const el = e.currentTarget;
	if (el !== el.ownerDocument.activeElement) el.focus();
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/DropdownMenu/DropdownMenuItem.js
/**
* @file DropdownMenuItem.tsx
* @output Exports DropdownMenuItem component
* @position Sub-component; used inside DropdownMenu
*
* Interactive menu item with role="menuitem". Keyboard navigation
* is handled by useListFocus on the parent menu container.
*
* Composes Item for the shared start content + label + description + end content layout.
* Passes role="menuitem" so Item puts onClick on the root div instead of
* creating an invisible button (keyboard access is provided by the parent menu).
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/DropdownMenu/DropdownMenu.doc.mjs
* - /packages/core/src/DropdownMenu/DropdownMenuItem.doc.mjs
* - /packages/core/src/DropdownMenu/DropdownMenu.test.tsx
* - /packages/core/src/DropdownMenu/index.ts
* - /apps/storybook/stories/DropdownMenu.stories.tsx
* - /packages/cli/assets/templates/blocks/components/DropdownMenu/ (showcase blocks)
*/
var menuItemStyles = {
	root: {
		kB7OPa: "x9f619",
		kzqmXN: "xh8yej3",
		k8WAf4: "xce4md1",
		kg3NbH: "xf314gf",
		kaIpWk: "x1ws5lxm",
		kMv6JI: "x9ynric",
		kGuDYH: "xcr08ib",
		kMwMTN: "x1tgivj0",
		kWkggS: "xjbqb8w x1c52tdz",
		kkrTdU: "x1ypdohk x16khyan",
		k9WMMc: "x1yc453h",
		kI3sdo: "x1a2a7pz",
		$$css: true
	},
	disabled: {
		kSiTet: "xbyyjgo",
		kkrTdU: "xt0e3qv",
		$$css: true
	},
	destructive: {
		kMwMTN: "xjt36v0",
		"--_item-label-color": "xufyqxy",
		"--_item-description-color": "xqlix59",
		$$css: true
	}
};
var itemSizeStyles = {
	sm: {
		k8WAf4: "xu0wf1k",
		kg3NbH: "xf314gf",
		$$css: true
	},
	md: {
		k8WAf4: "x1vofgu7",
		$$css: true
	},
	lg: { $$css: true }
};
/**
* An interactive dropdown menu item with icon, label, and optional description.
*
* Must be used inside DropdownMenu. Keyboard navigation is provided
* automatically by the parent via useListFocus.
*
* @example
* ```
* <DropdownMenu button={{ label: 'Actions' }}>
*   <DropdownMenuItem icon={PencilIcon} label="Edit" onClick={handleEdit} />
*   <DropdownMenuItem label="Delete" variant="destructive" onClick={handleDelete} />
* </DropdownMenu>
* ```
*/
function DropdownMenuItem({ icon, label, description, onClick, isDisabled = false, endContent, hasCloseOnSelect = true, variant = "default", xstyle, className, style }) {
	const ctx = useDropdownMenuContext();
	const menuSize = ctx?.menuSize ?? "md";
	const handleClick = (0, import_react.useCallback)(() => {
		if (isDisabled) return;
		onClick?.();
		if (hasCloseOnSelect) ctx?.closeMenu();
	}, [
		isDisabled,
		onClick,
		hasCloseOnSelect,
		ctx
	]);
	const handlePointerMove = (0, import_react.useCallback)((e) => focusMenuItemOnHover(e, isDisabled), [isDisabled]);
	const isDestructive = variant === "destructive";
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Item, {
		role: "menuitem",
		tabIndex: isDisabled ? void 0 : -1,
		onPointerMove: handlePointerMove,
		startContent: icon ? renderIconSlot(icon, {
			size: "sm",
			color: isDestructive ? "error" : "secondary"
		}) : void 0,
		label,
		description,
		endContent,
		onClick: handleClick,
		isDisabled,
		xstyle: [
			menuItemStyles.root,
			itemSizeStyles[menuSize],
			isDestructive && menuItemStyles.destructive,
			isDisabled && menuItemStyles.disabled,
			xstyle
		],
		...mergeProps(themeProps("dropdown-menu-item", {
			size: menuSize,
			variant: isDestructive ? "destructive" : null
		}), {
			className,
			style
		})
	});
}
DropdownMenuItem.displayName = "DropdownMenuItem";
//#endregion
//#region node_modules/@astryxdesign/core/dist/Divider/Divider.js
/**
* @file Divider.tsx
* @input Uses React, stylex, spacing and color tokens
* @output Exports Divider component and DividerProps
* @position Divider component; provides visual separation with optional label
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/Divider/Divider.doc.mjs
* - /packages/core/src/Divider/Divider.test.tsx
* - /apps/storybook/stories/Divider.stories.tsx
* - /packages/cli/assets/templates/blocks/components/Divider/ (showcase blocks)
*/
/**
* Divider variant type. Extensible via module augmentation of DividerVariantMap.
*/
var baseStyles$2 = {
	horizontal: {
		k1xSpc: "x78zum5",
		kGNEyG: "x6s0dn4",
		kzqmXN: "xh8yej3",
		$$css: true
	},
	vertical: {
		k1xSpc: "x3nfvp2",
		kXwgrk: "xdt5ytf",
		kGNEyG: "x6s0dn4",
		kZKoxP: "x5yr21d",
		$$css: true
	}
};
var lineStyles = {
	horizontalLine: {
		kZKoxP: "xsyqizj",
		kzQI83: "x1iyjqo2",
		kmuXW: "xs83m0k",
		$$css: true
	},
	verticalLine: {
		kzqmXN: "xjk4fl7",
		kzQI83: "x1iyjqo2",
		kmuXW: "xs83m0k",
		$$css: true
	},
	subtle: {
		kWkggS: "x1m4xfpy",
		$$css: true
	},
	strong: {
		kWkggS: "x7njt3n",
		$$css: true
	}
};
var fullBleedStyles = {
	horizontal: {
		keTefX: "xojxgvx",
		k71WvV: "x1fcf3bl",
		kzqmXN: "xx6qvi6",
		$$css: true
	},
	vertical: {
		keoZOQ: "x1sa9bsh",
		k1K539: "x6h7pi7",
		kZKoxP: "x12qplqi",
		$$css: true
	}
};
/**
* Divider component for visual separation of content.
*
* Provides horizontal and vertical dividers with optional labels.
* Uses Astryx design tokens for colors and spacing.
*
* @example
* ```
* <Divider label="or" />
* ```
*/
function Divider({ orientation = "horizontal", label, variant = "subtle", isFullBleed = false, xstyle, className, style, ref, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, ...props$21 }) {
	const isHorizontal = orientation === "horizontal";
	const labelId = (0, import_react.useId)();
	const resolvedLabelledBy = ariaLabelledBy ?? (label && ariaLabel == null ? labelId : void 0);
	return /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		...props$21,
		role: "separator",
		"aria-orientation": orientation,
		"aria-label": ariaLabel,
		"aria-labelledby": resolvedLabelledBy,
		...mergeProps(themeProps("divider", {
			variant,
			orientation
		}), props(isHorizontal ? baseStyles$2.horizontal : baseStyles$2.vertical, isFullBleed && (isHorizontal ? fullBleedStyles.horizontal : fullBleedStyles.vertical), xstyle), className, style),
		children: [
			/*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", { ...props(isHorizontal ? lineStyles.horizontalLine : lineStyles.verticalLine, lineStyles[variant]) }),
			label && /*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
				id: labelId,
				...{
					0: { className: "x2lah0s xrrkdod x141an7d x1ltkj2j xv1l7n4" },
					1: { className: "x2lah0s x141an7d x1ltkj2j xv1l7n4 xnjsko4 x8o8v82" }
				}[!!!isHorizontal << 0],
				children: label
			}),
			label && /*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", { ...props(isHorizontal ? lineStyles.horizontalLine : lineStyles.verticalLine, lineStyles[variant]) })
		]
	});
}
Divider.displayName = "Divider";
//#endregion
//#region node_modules/@astryxdesign/core/dist/DropdownMenu/DropdownMenuDivider.js
var styles$24 = { divider: {
	kqGvvJ: "xsq74q5",
	$$css: true
} };
var THEME_CLASS_NAME = themeProps("dropdown-menu-divider").className;
/**
* A horizontal rule separating groups of menu rows.
*
* Renders `role="separator"`, so it is never a stop in the menu's arrow-key
* order. Equivalent to `{type: 'divider'}` in the `items` data API.
*
* @example
* ```
* <DropdownMenu button={{ label: 'Actions' }}>
*   <DropdownMenuItem label="Edit" onClick={handleEdit} />
*   <DropdownMenuDivider />
*   <DropdownMenuItem label="Delete" variant="destructive" onClick={handleDelete} />
* </DropdownMenu>
* ```
*/
function DropdownMenuDivider({ xstyle, className, style, ref }) {
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Divider, {
		ref,
		xstyle: [styles$24.divider, xstyle],
		className: className ? `${THEME_CLASS_NAME} ${className}` : THEME_CLASS_NAME,
		style
	});
}
DropdownMenuDivider.displayName = "DropdownMenuDivider";
//#endregion
//#region node_modules/@astryxdesign/core/dist/hooks/useMenuHover.js
/**
* @file useMenuHover.ts
* @input Uses React hooks, useListFocus, useMediaQuery
* @output Exports useMenuHover hook
* @position Internal hook; used by nav heading components, TopNavMenu,
*           TopNavMegaMenu and DropdownMenuSubMenu
*
* Hover as a progressive enhancement over standard popover behavior: click
* toggles, Escape and outside-click close, arrows navigate; on top of that,
* mouseenter opens after a delay and mouseleave closes one that hover opened.
*
* Three behaviors here are not obvious and are load-bearing:
*
* 1. Hover→click guard (#3121). A hover-opened menu is already open under the
*    cursor when the pointer arrives, so the click that naturally follows would
*    toggle it shut. Within `clickGuardMs` a click instead confirms it: the menu
*    pins and behaves like a click-open from then on.
*
* 2. Focus moves synchronously. `useLayer.show()` calls `showPopover()` in the
*    same tick and the layer's children are always mounted, so items are
*    focusable the moment `show()` returns — a `requestAnimationFrame` here
*    lands after paint and races anything else moving focus. Hover-opens are the
*    exception: the pointer is driving, so focus stays on the trigger. The hook
*    always passes `skipAutoFocus` and owns focus itself, because the popover's
*    auto-focus targets the first *tabbable* node while a menu wants its first
*    item — under roving tabindex those are different elements.
*
* 3. Native light dismiss. A `popover="auto"` is dismissed by the browser on
*    pointer interaction outside the panel, and a trigger outside the panel
*    counts — before React's click handler runs. `popoverId` makes the trigger
*    the panel's invoker, which exempts it. jsdom implements neither light
*    dismiss nor invokers, so that wiring is only verifiable in a browser.
*/
var DEFAULT_CLICK_GUARD_MS = 500;
/**
* How long after a close a mouseenter on the trigger is ignored.
*
* A panel positioned over its own trigger puts that trigger back under a
* stationary pointer when it closes, and the browser fires a fresh mouseenter —
* which reopened the menu the user had just dismissed. Time-bounded rather than
* a one-shot flag, so a deliberate re-hover seconds later still opens; a real
* mouseleave clears it early.
*/
var REOPEN_SUPPRESS_MS = 300;
function useMenuHover(options) {
	const { show, hide, isOpen, isEnabled, showDelay = 150, hideDelay = 200, clickGuardMs = DEFAULT_CLICK_GUARD_MS, itemSelector, popoverId, ownsFocus = true } = options;
	const hasHover = useMediaQuery("(hover: hover)");
	const showTimerRef = (0, import_react.useRef)(null);
	const hideTimerRef = (0, import_react.useRef)(null);
	const triggerElRef = (0, import_react.useRef)(null);
	/** Menu was hover-opened, so mouseleave may close it. */
	const hoverModeRef = (0, import_react.useRef)(false);
	const closedAtRef = (0, import_react.useRef)(0);
	/** When the current open began as a hover-open; 0 once confirmed or closed. */
	const hoverOpenedAtRef = (0, import_react.useRef)(0);
	const prevIsOpenRef = (0, import_react.useRef)(isOpen);
	useIsomorphicLayoutEffect(() => {
		const wasOpen = prevIsOpenRef.current;
		prevIsOpenRef.current = isOpen;
		if (wasOpen && !isOpen) {
			hoverModeRef.current = false;
			hoverOpenedAtRef.current = 0;
			closedAtRef.current = Date.now();
		}
	}, [isOpen]);
	const clearTimeouts = (0, import_react.useCallback)(() => {
		if (showTimerRef.current) {
			clearTimeout(showTimerRef.current);
			showTimerRef.current = null;
		}
		if (hideTimerRef.current) {
			clearTimeout(hideTimerRef.current);
			hideTimerRef.current = null;
		}
	}, []);
	const escapeHandlerRef = (0, import_react.useRef)(() => {});
	const { listRef: menuRef, handleKeyDown: handleListKeyDown, focusFirst } = useListFocus({
		itemSelector,
		onEscape: () => escapeHandlerRef.current()
	});
	const hideAndRestoreFocus = (0, import_react.useCallback)(() => {
		const menuHadFocus = menuRef.current?.contains(document.activeElement) ?? false;
		hide();
		if (menuHadFocus) triggerElRef.current?.focus();
	}, [hide, menuRef]);
	(0, import_react.useEffect)(() => {
		escapeHandlerRef.current = () => {
			clearTimeouts();
			hideAndRestoreFocus();
		};
	}, [clearTimeouts, hideAndRestoreFocus]);
	(0, import_react.useEffect)(() => {
		return () => clearTimeouts();
	}, [clearTimeouts]);
	const focusMenu = (0, import_react.useCallback)(() => {
		if (!focusFirst()) menuRef.current?.focus();
	}, [focusFirst, menuRef]);
	const openAndFocus = (0, import_react.useCallback)(() => {
		if (!ownsFocus) {
			show();
			return;
		}
		show({ skipAutoFocus: true });
		focusMenu();
	}, [
		ownsFocus,
		show,
		focusMenu
	]);
	const confirmHoverOpen = (0, import_react.useCallback)(() => {
		if (!(clickGuardMs > 0 && hoverOpenedAtRef.current > 0 && Date.now() - hoverOpenedAtRef.current < clickGuardMs)) return false;
		hoverModeRef.current = false;
		hoverOpenedAtRef.current = 0;
		return true;
	}, [clickGuardMs]);
	const handleClick = (0, import_react.useCallback)((event) => {
		if (popoverId) event?.preventDefault();
		clearTimeouts();
		if (event != null && event.detail === 0) {
			closedAtRef.current = 0;
			hoverModeRef.current = false;
			hoverOpenedAtRef.current = 0;
			if (isOpen) {
				if (ownsFocus) focusMenu();
			} else openAndFocus();
			return;
		}
		if (!isOpen) {
			closedAtRef.current = 0;
			hoverModeRef.current = false;
			hoverOpenedAtRef.current = 0;
			openAndFocus();
			return;
		}
		if (confirmHoverOpen()) {
			if (ownsFocus) focusMenu();
			return;
		}
		hideAndRestoreFocus();
	}, [
		popoverId,
		clearTimeouts,
		isOpen,
		ownsFocus,
		confirmHoverOpen,
		openAndFocus,
		focusMenu,
		hideAndRestoreFocus
	]);
	const handleMouseEnter = (0, import_react.useCallback)(() => {
		if (!hasHover) return;
		if (closedAtRef.current > 0 && Date.now() - closedAtRef.current < REOPEN_SUPPRESS_MS) return;
		if (isOpen) {
			clearTimeouts();
			return;
		}
		hoverModeRef.current = true;
		clearTimeouts();
		const openByHover = () => {
			hoverOpenedAtRef.current = Date.now();
			show({ skipAutoFocus: true });
		};
		if (showDelay > 0) showTimerRef.current = setTimeout(openByHover, showDelay);
		else openByHover();
	}, [
		hasHover,
		isOpen,
		clearTimeouts,
		show,
		showDelay
	]);
	const handleMouseLeave = (0, import_react.useCallback)(() => {
		closedAtRef.current = 0;
		if (!hoverModeRef.current) return;
		clearTimeouts();
		hideTimerRef.current = setTimeout(() => {
			hide();
		}, hideDelay);
	}, [
		clearTimeouts,
		hide,
		hideDelay
	]);
	const handleContentMouseEnter = (0, import_react.useCallback)(() => {
		clearTimeouts();
	}, [clearTimeouts]);
	const setTriggerRef = (0, import_react.useCallback)((el) => {
		triggerElRef.current = el;
	}, []);
	const noop = (0, import_react.useCallback)(() => {}, []);
	const noopRef = (0, import_react.useCallback)((_el) => {}, []);
	const noopKeyDown = (0, import_react.useCallback)((_e) => {}, []);
	if (!isEnabled) return {
		triggerProps: {
			onClick: noop,
			onMouseEnter: noop,
			onMouseLeave: noop
		},
		contentProps: {
			onMouseEnter: noop,
			onMouseLeave: noop,
			onKeyDown: noopKeyDown
		},
		menuRef,
		focusFirst,
		focusMenu,
		confirmHoverOpen,
		close: hideAndRestoreFocus,
		setTriggerEl: noopRef
	};
	return {
		triggerProps: {
			onClick: handleClick,
			onMouseEnter: handleMouseEnter,
			onMouseLeave: handleMouseLeave,
			...popoverId ? { popoverTarget: popoverId } : null
		},
		contentProps: {
			onMouseEnter: handleContentMouseEnter,
			onMouseLeave: handleMouseLeave,
			onKeyDown: handleListKeyDown
		},
		menuRef,
		focusFirst,
		focusMenu,
		confirmHoverOpen,
		close: hideAndRestoreFocus,
		setTriggerEl: setTriggerRef
	};
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/DropdownMenu/menuItemRoles.js
/**
* @file menuItemRoles.ts
* @output Shared menu-item role set + focus selector.
* @position Internal; used by DropdownMenu and ContextMenu so their
*   roving-focus, typeahead, and Enter/Space activation stay in sync.
*
* Includes the selectable items (menuitemradio/menuitemcheckbox) alongside
* plain menuitem so checkbox/radio rows are reachable by arrow keys, typeahead,
* and Enter/Space — not just role="menuitem".
*/
var MENU_ITEM_ROLES = /* @__PURE__ */ new Set([
	"menuitem",
	"menuitemradio",
	"menuitemcheckbox"
]);
var MENU_ITEM_SELECTOR = [...MENU_ITEM_ROLES].map((role) => `[role="${role}"]:not([aria-disabled="true"])`).join(",");
/**
* Boundary selector for a single menu level. A menu and its submenu flyouts
* both use `role="menu"`, and flyouts render inline (native popover, not a
* portal), so a nested menu's items and key events would otherwise be picked
* up by the parent. Pass this as `useListFocus`'s `boundarySelector` so each
* level scopes item collection and key handling to its own container.
*/
var MENU_BOUNDARY_SELECTOR = "[role=\"menu\"]";
//#endregion
//#region node_modules/@astryxdesign/core/dist/DropdownMenu/DropdownMenuSubMenu.js
/**
* @file DropdownMenuSubMenu.tsx
* @input React, stylex, useLayer (context mode), useListFocus, useMenuHover,
*   useTypeahead, Item, Icon, Spinner, DropdownMenu context + item roles.
* @output Exports DropdownMenuSubMenu — a single menu row that reveals a nested
*   flyout menu of its own children/items.
* @position Sub-component; place inside a DropdownMenu (or ContextMenu)
*   alongside plain items.
*
* One component, not three. The row itself adopts DropdownMenuItem semantics
* (label / icon / description / isDisabled) and its children become the
* flyout's content. This mirrors how SideNavItem / TreeListItem promote a
* normal row into a nested surface when given children, rather than the Radix
* Sub / SubTrigger / SubContent split. Data-driven menus never touch this
* component directly — renderDropdownItems renders it from a nested `items`
* array and passes the rendered children in.
*
* Built on existing primitives — no bespoke floating code:
* - Positioning: useLayer context mode opens the flyout inline-end with
*   viewport auto-flip via CSS anchor positioning (RTL-correct by default).
* - Pointer: useMenuHover for open/close intent.
* - Keyboard: a per-level useListFocus + useTypeahead. Right (Left in RTL) /
*   Enter / Space opens the flyout and focuses its first item; Left (Right in
*   RTL) / Escape closes it and returns focus to the trigger row.
*
* Prior art: legacy internal XDS `XDSDropdownSubMenuItem` (APG menubar-
* navigation submenu). This re-expresses the same contract on Astryx primitives.
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/DropdownMenu/DropdownMenuSubMenu.doc.mjs
* - /packages/core/src/DropdownMenu/DropdownMenuSubMenu.test.tsx
* - /packages/core/src/DropdownMenu/index.ts
* - /apps/storybook/stories/DropdownMenu.stories.tsx
* - /packages/cli/assets/templates/blocks/components/DropdownMenu/ (showcase blocks)
*/
var triggerStyles = {
	root: {
		kB7OPa: "x9f619",
		kzqmXN: "xh8yej3",
		k8WAf4: "xce4md1",
		kg3NbH: "xf314gf",
		kaIpWk: "x1ws5lxm",
		kMv6JI: "x9ynric",
		kGuDYH: "xcr08ib",
		kMwMTN: "x1tgivj0",
		kWkggS: "xjbqb8w x1c52tdz",
		kkrTdU: "x1ypdohk x16khyan",
		k9WMMc: "x1yc453h",
		kI3sdo: "x1a2a7pz",
		$$css: true
	},
	open: {
		kWkggS: "x1lmrjuc",
		$$css: true
	},
	disabled: {
		kSiTet: "xbyyjgo",
		kkrTdU: "xt0e3qv",
		$$css: true
	}
};
var triggerSizeStyles = {
	sm: {
		k8WAf4: "xu0wf1k",
		kg3NbH: "xf314gf",
		$$css: true
	},
	md: {
		k8WAf4: "x1vofgu7",
		$$css: true
	},
	lg: { $$css: true }
};
var flyoutStyles = {
	popover: {
		k7Eaqz: "x5w4yej",
		$$css: true
	},
	popoverCustomWidth: (width) => [{
		k7Eaqz: (typeof width === "number" ? `${width}px` : width) != null ? "xkj4a21" : typeof width === "number" ? `${width}px` : width,
		$$css: true
	}, { "--x-minWidth": ((val) => typeof val === "number" ? val + "px" : val != null ? val : void 0)(typeof width === "number" ? `${width}px` : width) }]
};
/**
* A single menu row that reveals a nested flyout of its own items. The row
* adopts DropdownMenuItem semantics (label / icon / description / isDisabled);
* its `children` become the flyout content. Place inside a DropdownMenu (or
* ContextMenu) alongside plain items.
*
* For data-driven menus, don't use this directly — give a menu item a nested
* `items` array and DropdownMenu/ContextMenu renders the submenu for you.
*
* @example
* ```
* <DropdownMenu button={{label: 'Actions'}}>
*   <DropdownMenuItem label="Rename" onClick={rename} />
*   <DropdownMenuSubMenu label="Move to" icon="folder">
*     <DropdownMenuItem label="Folder A" onClick={() => move('a')} />
*     <DropdownMenuItem label="Folder B" onClick={() => move('b')} />
*   </DropdownMenuSubMenu>
* </DropdownMenu>
* ```
*/
function DropdownMenuSubMenu(props) {
	const { icon, label, description, isDisabled = false, hasSpinner = false, menuWidth, onOpenChange, children, xstyle, className, style, "data-testid": testId, menuDataTestId } = props;
	const menuCtx = useDropdownMenuContext();
	const menuSize = menuCtx?.menuSize ?? "md";
	const canOpen = !isDisabled;
	const contentId = (0, import_react.useId)();
	const triggerId = (0, import_react.useId)();
	const triggerRef = (0, import_react.useRef)(null);
	const [isOpen, setIsOpen] = (0, import_react.useState)(false);
	const layer = useLayer({
		mode: "context",
		lightDismiss: false,
		onShow: (0, import_react.useCallback)(() => {
			setIsOpen(true);
			onOpenChange?.(true);
		}, [onOpenChange]),
		onHide: (0, import_react.useCallback)(() => {
			setIsOpen(false);
			onOpenChange?.(false);
		}, [onOpenChange])
	});
	const showLayer = (0, import_react.useCallback)(() => {
		if (canOpen) layer.show();
	}, [canOpen, layer]);
	const hideLayer = (0, import_react.useCallback)(() => {
		layer.hide();
	}, [layer]);
	const { listRef: menuRef, handleKeyDown: listNavKeyDown, focusFirst, focusItem, ownsEvent, getItems } = useListFocus({
		itemSelector: MENU_ITEM_SELECTOR,
		boundarySelector: MENU_BOUNDARY_SELECTOR,
		wrap: false,
		onEscape: () => close({ focusTrigger: true })
	});
	const typeahead = useTypeahead({
		getItemLabels: () => getItems().map((el) => el.textContent),
		onMatch: focusItem,
		getCurrentIndex: () => getItems().findIndex((el) => el === document.activeElement || el.contains(document.activeElement))
	});
	const { triggerProps, contentProps, confirmHoverOpen } = useMenuHover({
		show: showLayer,
		hide: hideLayer,
		isOpen,
		isEnabled: canOpen
	});
	const open = (0, import_react.useCallback)((options) => {
		if (!canOpen) return;
		layer.show();
		if (options?.focusFirst) {
			if (!focusFirst()) menuRef.current?.focus();
		}
	}, [
		canOpen,
		layer,
		focusFirst,
		menuRef
	]);
	const close = (0, import_react.useCallback)((options) => {
		layer.hide();
		if (options?.focusTrigger !== false) triggerRef.current?.focus();
	}, [layer]);
	const setTriggerEl = (0, import_react.useCallback)((el) => {
		triggerRef.current = el;
		layer.ref(el);
	}, [layer]);
	const handleTriggerClick = (0, import_react.useCallback)(() => {
		if (isDisabled) return;
		if (isOpen) {
			if (confirmHoverOpen()) {
				if (!focusFirst()) menuRef.current?.focus();
				return;
			}
			close({ focusTrigger: true });
		} else open({ focusFirst: true });
	}, [
		isDisabled,
		isOpen,
		open,
		close,
		confirmHoverOpen,
		focusFirst,
		menuRef
	]);
	const handleTriggerKeyDown = (0, import_react.useCallback)((e) => {
		if (isDisabled) return;
		const openKey = (typeof window !== "undefined" && triggerRef.current ? window.getComputedStyle(triggerRef.current).direction === "rtl" : false) ? "ArrowLeft" : "ArrowRight";
		if (e.key === openKey || e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			e.stopPropagation();
			open({ focusFirst: true });
		}
	}, [isDisabled, open]);
	const handlePointerMove = (0, import_react.useCallback)((e) => focusMenuItemOnHover(e, isDisabled), [isDisabled]);
	const handleContentKeyDown = (0, import_react.useCallback)((e) => {
		if (!ownsEvent(e)) return;
		if (e.key === "Escape") {
			e.preventDefault();
			e.stopPropagation();
			close({ focusTrigger: true });
			return;
		}
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			const focused = document.activeElement;
			if (focused && MENU_ITEM_ROLES.has(focused.getAttribute("role") ?? "")) focused.click();
			return;
		}
		const closeKey = (typeof window !== "undefined" && menuRef.current ? window.getComputedStyle(menuRef.current).direction === "rtl" : false) ? "ArrowRight" : "ArrowLeft";
		if (e.key === closeKey) {
			e.preventDefault();
			close({ focusTrigger: true });
			return;
		}
		if (typeahead.onKeyDown(e)) {
			e.preventDefault();
			return;
		}
		listNavKeyDown(e);
	}, [
		ownsEvent,
		close,
		listNavKeyDown,
		typeahead,
		menuRef
	]);
	const nestedMenuContext = (0, import_react.useMemo)(() => ({
		menuSize,
		closeMenu: () => {
			close({ focusTrigger: false });
			menuCtx?.closeMenu();
		}
	}), [
		menuSize,
		close,
		menuCtx
	]);
	const endAffordance = hasSpinner ? /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
		className: "x78zum5 x6s0dn4",
		children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Spinner, { size: "sm" })
	}) : /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
		className: "x78zum5 x6s0dn4",
		children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Icon, {
			icon: "chevronRight",
			size: "sm",
			color: "secondary",
			...themeProps("dropdown-menu-indicator-icon")
		})
	});
	const popoverXstyle = menuWidth ? flyoutStyles.popoverCustomWidth(menuWidth) : flyoutStyles.popover;
	return /*#__PURE__*/ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/*#__PURE__*/ (0, import_jsx_runtime.jsx)(Item, {
		ref: (el) => setTriggerEl(el),
		id: triggerId,
		role: "menuitem",
		tabIndex: isDisabled ? void 0 : -1,
		"aria-haspopup": "menu",
		"aria-expanded": isOpen,
		"aria-controls": isOpen ? contentId : void 0,
		"aria-disabled": isDisabled || void 0,
		"data-testid": testId,
		onMouseEnter: triggerProps.onMouseEnter,
		onMouseLeave: triggerProps.onMouseLeave,
		onPointerMove: handlePointerMove,
		startContent: icon ? renderIconSlot(icon, {
			size: "sm",
			color: "secondary"
		}) : void 0,
		label,
		description,
		endContent: endAffordance,
		onClick: handleTriggerClick,
		onKeyDown: handleTriggerKeyDown,
		isDisabled,
		xstyle: [
			triggerStyles.root,
			triggerSizeStyles[menuSize],
			isOpen && triggerStyles.open,
			isDisabled && triggerStyles.disabled,
			xstyle
		],
		...mergeProps(themeProps("dropdown-menu-item", { size: menuSize }), {
			className,
			style
		})
	}), layer.render(/*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
		ref: menuRef,
		id: contentId,
		role: "menu",
		tabIndex: -1,
		"aria-labelledby": triggerId,
		onKeyDown: handleContentKeyDown,
		onMouseEnter: contentProps.onMouseEnter,
		onMouseLeave: contentProps.onMouseLeave,
		"data-testid": menuDataTestId,
		...mergeProps(themeProps("dropdown-menu"), { className: "x9f619 x78zum5 xdt5ytf x1lsbc85 xuyqlj2 x1odjw0f x1fcsqxe xgory14 x9epnlk x1n97fys x1prclbq x1i5ehqx x1hc1fzr x19991ni xuedmi6 xlr8y92" }),
		children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)(DropdownMenuContext, {
			value: nestedMenuContext,
			children
		})
	}), {
		placement: "end",
		alignment: "start",
		offset: spacingVars["--spacing-1"],
		xstyle: [popoverXstyle, layerAnimations.end]
	})] });
}
DropdownMenuSubMenu.displayName = "DropdownMenuSubMenu";
//#endregion
//#region node_modules/@astryxdesign/core/dist/DropdownMenu/renderDropdownItems.js
function getItemKey(item, index) {
	return `item-${item.id ?? index}`;
}
function getSectionKey(section, index) {
	return `section-${section.id ?? index}`;
}
/**
* Renders one leaf row as a `DropdownMenuItem`.
*
* Keyed by `item.id` when the caller supplies one, else by position. NOT by
* label: an item that reports its own result (a copy row swapping to "Copied")
* would change key mid-interaction, remounting the row and dropping keyboard
* focus. Position is the safe default because a menu's rows are usually fixed;
* a menu whose items reorder or filter needs `id` for the same reason.
*
* `items` selects the submenu shape rather than being an item prop, and `id` is
* identity for React rather than something `DropdownMenuItem` renders, so both
* are stripped. Every remaining field of `DropdownMenuItemData` is a
* `DropdownMenuItem` prop by construction (the type is `Pick`ed from
* `DropdownMenuItemProps`), so the data path forwards them wholesale and can't
* silently drop a field the data API advertises.
*/
function renderLeafItem(item, index) {
	const { items: _submenuItems, id: _id, ...itemProps } = item;
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(DropdownMenuItem, { ...itemProps }, getItemKey(item, index));
}
/**
* Converts data-driven items into DropdownMenuItem components,
* so both modes share the same rendering and keyboard navigation path.
*/
function renderDropdownItems(items) {
	const elements = [];
	for (let i = 0; i < items.length; i++) {
		const option = items[i];
		if ("type" in option && option.type === "divider") elements.push(/*#__PURE__*/ (0, import_jsx_runtime.jsx)(DropdownMenuDivider, {}, `divider-${i}`));
		else if ("type" in option && option.type === "section") elements.push(/*#__PURE__*/ (0, import_jsx_runtime.jsxs)("div", {
			role: "group",
			"aria-label": option.title,
			children: [option.title && /*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
				"aria-hidden": "true",
				...mergeProps(themeProps("dropdown-menu-section-heading"), { className: "xu0wf1k xf314gf x9ynric x141an7d x1ltkj2j xv1l7n4 x87ps6o" }),
				children: option.title
			}), option.items.map(renderLeafItem)]
		}, getSectionKey(option, i)));
		else if (!("type" in option)) {
			if (option.items && option.items.length > 0) elements.push(/*#__PURE__*/ (0, import_jsx_runtime.jsx)(DropdownMenuSubMenu, {
				icon: option.icon,
				label: option.label,
				isDisabled: option.isDisabled,
				children: renderDropdownItems(option.items)
			}, getItemKey(option, i)));
			else elements.push(renderLeafItem(option, i));
		}
	}
	return elements;
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/IconButton/IconButton.js
/**
* @file IconButton.tsx
* @input Uses Button, ButtonProps
* @output Exports IconButton component, IconButtonProps type
* @position Composition wrapper over Button for icon-only buttons
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/IconButton/IconButton.doc.mjs (props table, features)
* - /packages/core/src/IconButton/IconButton.test.tsx (tests)
* - /packages/core/src/IconButton/index.ts (exports if types change)
* - /apps/storybook/stories/IconButton.stories.tsx (storybook stories)
* - /packages/cli/assets/templates/blocks/components/IconButton/ (showcase blocks)
*/
/**
* Props for IconButton.
*
* Omits `isIconOnly` (always true), `children` and `endContent` (not applicable
* for icon-only buttons). `icon` is required.
*/
/**
* An icon-only button — a thin wrapper around Button with `isIconOnly`
* always set to true.
*
* Use this instead of `<Button isIconOnly>` for explicit, greppable,
* and codemod-safe icon-only button usage.
*
* @example
* ```
* <IconButton label="Settings" icon={<GearIcon />} variant="ghost" />
* <IconButton label="Delete" icon={<TrashIcon />} variant="destructive" />
* <IconButton label="Emoji" icon={<span>🚀</span>} variant="ghost" size="sm" />
* ```
*/
function IconButton({ icon, ...props }) {
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Button, {
		...props,
		icon,
		isIconOnly: true
	});
}
IconButton.displayName = "IconButton";
//#endregion
//#region node_modules/@astryxdesign/core/dist/Layout/container.stylex.js
/**
* Spacing token keys for padding props.
*/
var baseStyles$1 = { container: {
	kB7OPa: "x9f619",
	kZCmMZ: "x1c35znw",
	kwRFfy: "x64h4k7",
	kLKAdn: "x14m0hsi",
	kGO01o: "xc1wllq",
	$$css: true
} };
/**
* Component-scoped padding tokens.
*
* Each container component (card, section, dialog) has public CSS custom
* properties that themes can set. The pipeline emits the `--astryx-*` names,
* which the component reads via `var(--astryx-…, …)`:
*
*   --astryx-card-padding          (shorthand — all sides)
*   --astryx-card-padding-inline
*   --astryx-card-padding-inline-start
*   --astryx-card-padding-inline-end
*   --astryx-card-padding-block-start
*   --astryx-card-padding-block-end
*
* The theme build pipeline maps `padding: '20px'` on a container component
* to these tokens. The component reads them with var() fallbacks to --spacing-4.
*
* This indirection exists because StyleX's useCSSLayers emits priority-0
* custom property assignments outside any @layer, making them impossible
* to override from @layer astryx-theme. By reading from a higher-level token,
* the theme CSS sets the token value and the component picks it up via
* CSS custom property cascade — no layer competition.
*/
var SP4 = spacingVars["--spacing-4"];
var cardShorthand = `var(--astryx-card-padding, ${SP4})`;
var cardInline = `var(--astryx-card-padding-inline, ${cardShorthand})`;
`${cardInline}`;
`${cardInline}`;
`${cardShorthand}`;
`${cardShorthand}`;
var sectionShorthand = `var(--_section-padding-propagated, ${`var(--astryx-section-padding, ${SP4})`})`;
var sectionInline = `var(--astryx-section-padding-inline, ${sectionShorthand})`;
`${sectionInline}`;
`${sectionInline}`;
`${sectionShorthand}`;
`${sectionShorthand}`;
var dialogShorthand = `var(--astryx-dialog-padding, ${SP4})`;
var dialogInline = `var(--astryx-dialog-padding-inline, ${dialogShorthand})`;
`${dialogInline}`;
`${dialogInline}`;
`${dialogShorthand}`;
`${dialogShorthand}`;
/**
* Map from component name to its theme default padding styles.
* Each component reads from its own public CSS custom property.
*/
var themeDefaultStyles = {
	card: {
		containerPaddingInlineStart: {
			"--container-padding-inline-start": "xjmlhfd",
			$$css: true
		},
		containerPaddingInlineEnd: {
			"--container-padding-inline-end": "x1ihxwbr",
			$$css: true
		},
		containerPaddingBlockStart: {
			"--container-padding-block-start": "x1rqz8me",
			$$css: true
		},
		containerPaddingBlockEnd: {
			"--container-padding-block-end": "x1omyuck",
			$$css: true
		},
		layoutPaddingOuterX: {
			"--layout-padding-outer-x": "x14rzhog",
			$$css: true
		},
		layoutPaddingOuterY: {
			"--layout-padding-outer-y": "xjej9fs",
			$$css: true
		},
		layoutPaddingInnerX: {
			"--layout-padding-inner-x": "x4poyjn",
			$$css: true
		},
		layoutPaddingInnerY: {
			"--layout-padding-inner-y": "x1u1kw4e",
			$$css: true
		}
	},
	section: {
		containerPaddingInlineStart: {
			"--container-padding-inline-start": "x19lemt0",
			$$css: true
		},
		containerPaddingInlineEnd: {
			"--container-padding-inline-end": "xu1wldr",
			$$css: true
		},
		containerPaddingBlockStart: {
			"--container-padding-block-start": "xnw7zt4",
			$$css: true
		},
		containerPaddingBlockEnd: {
			"--container-padding-block-end": "xek4msv",
			$$css: true
		},
		layoutPaddingOuterX: {
			"--layout-padding-outer-x": "x15i0zw9",
			$$css: true
		},
		layoutPaddingOuterY: {
			"--layout-padding-outer-y": "x1vw4zgg",
			$$css: true
		},
		layoutPaddingInnerX: {
			"--layout-padding-inner-x": "x1v3gmnx",
			$$css: true
		},
		layoutPaddingInnerY: {
			"--layout-padding-inner-y": "x15yx5hm",
			$$css: true
		}
	},
	dialog: {
		containerPaddingInlineStart: {
			"--container-padding-inline-start": "x1tewnwq",
			$$css: true
		},
		containerPaddingInlineEnd: {
			"--container-padding-inline-end": "x11h1f2o",
			$$css: true
		},
		containerPaddingBlockStart: {
			"--container-padding-block-start": "x1g2kccc",
			$$css: true
		},
		containerPaddingBlockEnd: {
			"--container-padding-block-end": "x1gvthzm",
			$$css: true
		},
		layoutPaddingOuterX: {
			"--layout-padding-outer-x": "x1hsjncj",
			$$css: true
		},
		layoutPaddingOuterY: {
			"--layout-padding-outer-y": "x1pui4bz",
			$$css: true
		},
		layoutPaddingInnerX: {
			"--layout-padding-inner-x": "x2so38",
			$$css: true
		},
		layoutPaddingInnerY: {
			"--layout-padding-inner-y": "xinu7xd",
			$$css: true
		}
	}
};
/**
* Container inline padding styles for edge compensation.
* Sets --container-padding-inline-start and --container-padding-inline-end so
* edge-compensating children (bleed tables, dividers, etc.) know the inline
* padding to compensate against.
*/
var containerPaddingInlineStartStyles = {
	spacing0: {
		"--container-padding-inline-start": "x1gu2k80",
		$$css: true
	},
	spacing0_5: {
		"--container-padding-inline-start": "x14ws0sr",
		$$css: true
	},
	spacing1: {
		"--container-padding-inline-start": "x1cvlban",
		$$css: true
	},
	spacing1_5: {
		"--container-padding-inline-start": "x176g23i",
		$$css: true
	},
	spacing2: {
		"--container-padding-inline-start": "x1xlrr2o",
		$$css: true
	},
	spacing3: {
		"--container-padding-inline-start": "xfdwxua",
		$$css: true
	},
	spacing4: {
		"--container-padding-inline-start": "x1dlhslv",
		$$css: true
	},
	spacing5: {
		"--container-padding-inline-start": "x1s81nki",
		$$css: true
	},
	spacing6: {
		"--container-padding-inline-start": "x1ep0dkj",
		$$css: true
	},
	spacing7: {
		"--container-padding-inline-start": "x157xojc",
		$$css: true
	},
	spacing8: {
		"--container-padding-inline-start": "xw1diwv",
		$$css: true
	},
	spacing9: {
		"--container-padding-inline-start": "xraca2a",
		$$css: true
	},
	spacing10: {
		"--container-padding-inline-start": "xserb3f",
		$$css: true
	},
	spacing11: {
		"--container-padding-inline-start": "xziclwo",
		$$css: true
	},
	spacing12: {
		"--container-padding-inline-start": "x1iiwihq",
		$$css: true
	}
};
var containerPaddingInlineEndStyles = {
	spacing0: {
		"--container-padding-inline-end": "x91ghl5",
		$$css: true
	},
	spacing0_5: {
		"--container-padding-inline-end": "x1wz3t3y",
		$$css: true
	},
	spacing1: {
		"--container-padding-inline-end": "x2oyxnl",
		$$css: true
	},
	spacing1_5: {
		"--container-padding-inline-end": "xntetml",
		$$css: true
	},
	spacing2: {
		"--container-padding-inline-end": "xcas3b9",
		$$css: true
	},
	spacing3: {
		"--container-padding-inline-end": "xu0ipoa",
		$$css: true
	},
	spacing4: {
		"--container-padding-inline-end": "xs0pscg",
		$$css: true
	},
	spacing5: {
		"--container-padding-inline-end": "xgkj7vj",
		$$css: true
	},
	spacing6: {
		"--container-padding-inline-end": "x94cj42",
		$$css: true
	},
	spacing7: {
		"--container-padding-inline-end": "x11tj35w",
		$$css: true
	},
	spacing8: {
		"--container-padding-inline-end": "x1b9k1pi",
		$$css: true
	},
	spacing9: {
		"--container-padding-inline-end": "x19w02kr",
		$$css: true
	},
	spacing10: {
		"--container-padding-inline-end": "xx5lg5w",
		$$css: true
	},
	spacing11: {
		"--container-padding-inline-end": "x1nmgbqg",
		$$css: true
	},
	spacing12: {
		"--container-padding-inline-end": "x1wsfsk2",
		$$css: true
	}
};
/**
* Container block-start/block-end padding styles for vertical bleed.
* Split into start and end because Layout areas have asymmetric block padding
* (e.g., Header: block-start=outer-y, block-end=inner-y).
*/
var containerPaddingBlockStartStyles = {
	spacing0: {
		"--container-padding-block-start": "x1i3qcxz",
		$$css: true
	},
	spacing0_5: {
		"--container-padding-block-start": "xvdf9ev",
		$$css: true
	},
	spacing1: {
		"--container-padding-block-start": "xnsckjb",
		$$css: true
	},
	spacing1_5: {
		"--container-padding-block-start": "x1kbx601",
		$$css: true
	},
	spacing2: {
		"--container-padding-block-start": "xa8b4fq",
		$$css: true
	},
	spacing3: {
		"--container-padding-block-start": "x11k4f5r",
		$$css: true
	},
	spacing4: {
		"--container-padding-block-start": "xm01sq8",
		$$css: true
	},
	spacing5: {
		"--container-padding-block-start": "xp8wdkl",
		$$css: true
	},
	spacing6: {
		"--container-padding-block-start": "x1hmud4d",
		$$css: true
	},
	spacing7: {
		"--container-padding-block-start": "x1c00sag",
		$$css: true
	},
	spacing8: {
		"--container-padding-block-start": "xfv60at",
		$$css: true
	},
	spacing9: {
		"--container-padding-block-start": "x14fzdu7",
		$$css: true
	},
	spacing10: {
		"--container-padding-block-start": "x17h9kl7",
		$$css: true
	},
	spacing11: {
		"--container-padding-block-start": "x1rdjxae",
		$$css: true
	},
	spacing12: {
		"--container-padding-block-start": "xecwdl6",
		$$css: true
	}
};
var containerPaddingBlockEndStyles = {
	spacing0: {
		"--container-padding-block-end": "xkunwnr",
		$$css: true
	},
	spacing0_5: {
		"--container-padding-block-end": "x1cao3zv",
		$$css: true
	},
	spacing1: {
		"--container-padding-block-end": "x57a7ii",
		$$css: true
	},
	spacing1_5: {
		"--container-padding-block-end": "xv53x8y",
		$$css: true
	},
	spacing2: {
		"--container-padding-block-end": "x1lsgcmx",
		$$css: true
	},
	spacing3: {
		"--container-padding-block-end": "x1q3ppug",
		$$css: true
	},
	spacing4: {
		"--container-padding-block-end": "x4hfsld",
		$$css: true
	},
	spacing5: {
		"--container-padding-block-end": "xbib2ws",
		$$css: true
	},
	spacing6: {
		"--container-padding-block-end": "x1q8d17g",
		$$css: true
	},
	spacing7: {
		"--container-padding-block-end": "x1yqogew",
		$$css: true
	},
	spacing8: {
		"--container-padding-block-end": "x8lgq76",
		$$css: true
	},
	spacing9: {
		"--container-padding-block-end": "x1f7f9rt",
		$$css: true
	},
	spacing10: {
		"--container-padding-block-end": "x15vxphk",
		$$css: true
	},
	spacing11: {
		"--container-padding-block-end": "x4bg2x9",
		$$css: true
	},
	spacing12: {
		"--container-padding-block-end": "x186mjxr",
		$$css: true
	}
};
var paddingOuterXStyles = {
	spacing0: {
		"--layout-padding-outer-x": "xswhm3q",
		$$css: true
	},
	spacing0_5: {
		"--layout-padding-outer-x": "xihiwg7",
		$$css: true
	},
	spacing1: {
		"--layout-padding-outer-x": "xc96xmq",
		$$css: true
	},
	spacing1_5: {
		"--layout-padding-outer-x": "x1u93lgd",
		$$css: true
	},
	spacing2: {
		"--layout-padding-outer-x": "x15dxnc0",
		$$css: true
	},
	spacing3: {
		"--layout-padding-outer-x": "xadgj3j",
		$$css: true
	},
	spacing4: {
		"--layout-padding-outer-x": "x1v56qcf",
		$$css: true
	},
	spacing5: {
		"--layout-padding-outer-x": "x1nzs0gl",
		$$css: true
	},
	spacing6: {
		"--layout-padding-outer-x": "x1c3n52a",
		$$css: true
	},
	spacing7: {
		"--layout-padding-outer-x": "x1gfiokx",
		$$css: true
	},
	spacing8: {
		"--layout-padding-outer-x": "x1t3kfz",
		$$css: true
	},
	spacing9: {
		"--layout-padding-outer-x": "xzr4qsh",
		$$css: true
	},
	spacing10: {
		"--layout-padding-outer-x": "x1jdf5a4",
		$$css: true
	},
	spacing11: {
		"--layout-padding-outer-x": "x1hct0t0",
		$$css: true
	},
	spacing12: {
		"--layout-padding-outer-x": "x11cyqoe",
		$$css: true
	}
};
var paddingOuterYStyles = {
	spacing0: {
		"--layout-padding-outer-y": "x1mzf5mb",
		$$css: true
	},
	spacing0_5: {
		"--layout-padding-outer-y": "x1vj96e0",
		$$css: true
	},
	spacing1: {
		"--layout-padding-outer-y": "x1gpfxoh",
		$$css: true
	},
	spacing1_5: {
		"--layout-padding-outer-y": "xd3dqby",
		$$css: true
	},
	spacing2: {
		"--layout-padding-outer-y": "x10pz7y9",
		$$css: true
	},
	spacing3: {
		"--layout-padding-outer-y": "x1p6yq3h",
		$$css: true
	},
	spacing4: {
		"--layout-padding-outer-y": "xx738ci",
		$$css: true
	},
	spacing5: {
		"--layout-padding-outer-y": "x6yxws5",
		$$css: true
	},
	spacing6: {
		"--layout-padding-outer-y": "x180vrwl",
		$$css: true
	},
	spacing7: {
		"--layout-padding-outer-y": "x1q6rme1",
		$$css: true
	},
	spacing8: {
		"--layout-padding-outer-y": "xid7e43",
		$$css: true
	},
	spacing9: {
		"--layout-padding-outer-y": "x1t5kicu",
		$$css: true
	},
	spacing10: {
		"--layout-padding-outer-y": "x26l4wa",
		$$css: true
	},
	spacing11: {
		"--layout-padding-outer-y": "x10zktp0",
		$$css: true
	},
	spacing12: {
		"--layout-padding-outer-y": "x1yz3n6a",
		$$css: true
	}
};
var paddingInnerXStyles = {
	spacing0: {
		"--layout-padding-inner-x": "xj1bl4l",
		$$css: true
	},
	spacing0_5: {
		"--layout-padding-inner-x": "xlriy2h",
		$$css: true
	},
	spacing1: {
		"--layout-padding-inner-x": "x6uuyak",
		$$css: true
	},
	spacing1_5: {
		"--layout-padding-inner-x": "xd38f90",
		$$css: true
	},
	spacing2: {
		"--layout-padding-inner-x": "xxqksqd",
		$$css: true
	},
	spacing3: {
		"--layout-padding-inner-x": "x1fyui2f",
		$$css: true
	},
	spacing4: {
		"--layout-padding-inner-x": "x1i2ajwi",
		$$css: true
	},
	spacing5: {
		"--layout-padding-inner-x": "x1tac27u",
		$$css: true
	},
	spacing6: {
		"--layout-padding-inner-x": "x1ntgf3t",
		$$css: true
	},
	spacing7: {
		"--layout-padding-inner-x": "xhjd9tl",
		$$css: true
	},
	spacing8: {
		"--layout-padding-inner-x": "xn7c84u",
		$$css: true
	},
	spacing9: {
		"--layout-padding-inner-x": "xeqkbsz",
		$$css: true
	},
	spacing10: {
		"--layout-padding-inner-x": "x1vf4qco",
		$$css: true
	},
	spacing11: {
		"--layout-padding-inner-x": "xsmamsf",
		$$css: true
	},
	spacing12: {
		"--layout-padding-inner-x": "x2xk2xj",
		$$css: true
	}
};
var paddingInnerYStyles = {
	spacing0: {
		"--layout-padding-inner-y": "xwuefyo",
		$$css: true
	},
	spacing0_5: {
		"--layout-padding-inner-y": "x180h0y5",
		$$css: true
	},
	spacing1: {
		"--layout-padding-inner-y": "xmpug6m",
		$$css: true
	},
	spacing1_5: {
		"--layout-padding-inner-y": "x1g8jpzm",
		$$css: true
	},
	spacing2: {
		"--layout-padding-inner-y": "x1lksgje",
		$$css: true
	},
	spacing3: {
		"--layout-padding-inner-y": "x4j7gld",
		$$css: true
	},
	spacing4: {
		"--layout-padding-inner-y": "x1s3ehtl",
		$$css: true
	},
	spacing5: {
		"--layout-padding-inner-y": "x1rj5eim",
		$$css: true
	},
	spacing6: {
		"--layout-padding-inner-y": "x1ftgg6u",
		$$css: true
	},
	spacing7: {
		"--layout-padding-inner-y": "x1ho74vh",
		$$css: true
	},
	spacing8: {
		"--layout-padding-inner-y": "xm2cs6f",
		$$css: true
	},
	spacing9: {
		"--layout-padding-inner-y": "x1vsq92b",
		$$css: true
	},
	spacing10: {
		"--layout-padding-inner-y": "x18gbwmk",
		$$css: true
	},
	spacing11: {
		"--layout-padding-inner-y": "x14zymzj",
		$$css: true
	},
	spacing12: {
		"--layout-padding-inner-y": "xzfpkx9",
		$$css: true
	}
};
var maxHeightStyles = { containerMaxHeight: (maxHeight) => [{
	"--container-max-height": maxHeight != null ? "x18nyedi" : maxHeight,
	$$css: true
}, { "--x---container-max-height": maxHeight != null ? maxHeight : void 0 }] };
/**
* StyleX utility to add layout container styles to any element.
*
* Sets CSS variables for padding that child layout components read:
* - `--container-padding-inline-start` / `--container-padding-inline-end` — Inline padding for edge compensation and bleed
* - `--container-padding-block-start` / `--container-padding-block-end` — Block padding for vertical bleed
* - `--layout-padding-outer-x`, `--layout-padding-outer-y` (internal)
* - `--layout-padding-inner-x`, `--layout-padding-inner-y` (internal)
*
* Themes should use `padding` (or `paddingBlock`/`paddingInline`) in
* component overrides to adjust padding. Do not reference
* `--layout-padding-*` variables directly.
*
* @example
* ```
* import { container } from '@astryxdesign/core/Layout';
* import * as stylex from '@stylexjs/stylex';
*
* // Card container with default padding (theme-overridable via padding shorthand)
* <div {...stylex.props(...container({ useThemeDefault: 'card' }))}>
*   <Layout ... />
* </div>
*
* // Uniform padding
* <div {...stylex.props(...container({ padding: 'spacing3' }))}>
*   <Layout ... />
* </div>
*
* // Asymmetric — padding as base, paddingOuterY overrides vertical
* <div {...stylex.props(
*   ...container({ padding: 'spacing3', paddingOuterY: 'spacing2' }),
*   customStyles.card
* )}>
*   <Layout ... />
* </div>
* ```
*/
function container({ padding = "spacing4", paddingOuterX, paddingOuterY, paddingInnerX, paddingInnerY, useThemeDefault, maxHeight }) {
	const outerX = paddingOuterX ?? padding;
	const outerY = paddingOuterY ?? padding;
	const innerX = paddingInnerX ?? padding;
	const innerY = paddingInnerY ?? padding;
	const maxHeightStyle = maxHeight ? maxHeightStyles.containerMaxHeight(maxHeight) : null;
	if (useThemeDefault) {
		const defaults = themeDefaultStyles[useThemeDefault];
		return [
			baseStyles$1.container,
			defaults.containerPaddingInlineStart,
			defaults.containerPaddingInlineEnd,
			defaults.containerPaddingBlockStart,
			defaults.containerPaddingBlockEnd,
			defaults.layoutPaddingOuterX,
			defaults.layoutPaddingOuterY,
			defaults.layoutPaddingInnerX,
			defaults.layoutPaddingInnerY,
			maxHeightStyle
		];
	}
	return [
		baseStyles$1.container,
		containerPaddingInlineStartStyles[outerX],
		containerPaddingInlineEndStyles[outerX],
		containerPaddingBlockStartStyles[outerY],
		containerPaddingBlockEndStyles[outerY],
		paddingOuterXStyles[outerX],
		paddingOuterYStyles[outerY],
		paddingInnerXStyles[innerX],
		paddingInnerYStyles[innerY],
		maxHeightStyle
	];
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/Card/Card.js
/**
* @file Card.tsx
* @input Uses container utility, StyleX
* @output Exports Card component, CardProps, CardVariant types
* @position Core card container component
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/Card/Card.doc.mjs (props table, features)
* - /packages/core/src/Card/index.ts (exports if types change)
* - /apps/storybook/stories/Card.stories.tsx (storybook stories)
* - /packages/cli/assets/templates/blocks/components/Card/ (showcase blocks)
*/
/**
* Background color variant for Card, derived from CardVariantMap.
* Extensible via module augmentation of CardVariantMap.
*
* - `default`: standard card background with visible border
* - `transparent`: no background, no visible border — for grouping content without visual weight
* - `muted`: subtle muted background for de-emphasised cards
* - Non-semantic palette: `blue | cyan | gray | green | orange | pink | purple | red | teal | yellow`
*   Each uses the corresponding `--color-background-<name>` token (20% opacity tint).
*
* Only `default` draws a visible border. Its border width is subtracted from
* the padding so the total inset (border + padding) equals the padding token —
* keeping content geometry faithful to the spacing scale and identical to the
* borderless variants. Themes can override borderWidth/borderColor.
*/
var styles$23 = {
	card: {
		"--_card-radius": "x2kkz0m",
		kaIpWk: "x153u1i6",
		kVQacm: "x7giv3",
		kGVxlE: "x1p8z4y0",
		$$css: true
	},
	withBorder: {
		kMzoRj: "x1litavf",
		ksu8eU: "x1y0btm7",
		kVAM5u: "x14i3s5s",
		kZCmMZ: "xs19ii7",
		kwRFfy: "x12frdag",
		kLKAdn: "x1nex4ik",
		kGO01o: "xbv1mwh",
		$$css: true
	},
	scrollable: {
		kVQacm: "xysyzu8",
		$$css: true
	}
};
var variantStyles$1 = {
	default: {
		kWkggS: "x1de1mus",
		$$css: true
	},
	transparent: {
		kWkggS: "xjbqb8w",
		$$css: true
	},
	muted: {
		kWkggS: "xwmxj5m",
		$$css: true
	},
	blue: {
		kWkggS: "x1o0wnni",
		$$css: true
	},
	cyan: {
		kWkggS: "x1rgj867",
		$$css: true
	},
	gray: {
		kWkggS: "xspzpui",
		$$css: true
	},
	green: {
		kWkggS: "x1sqjeoo",
		$$css: true
	},
	orange: {
		kWkggS: "x1e9xt6e",
		$$css: true
	},
	pink: {
		kWkggS: "xnpoty2",
		$$css: true
	},
	purple: {
		kWkggS: "x16i6n6f",
		$$css: true
	},
	red: {
		kWkggS: "x1cibrc5",
		$$css: true
	},
	teal: {
		kWkggS: "x1jtji5o",
		$$css: true
	},
	yellow: {
		kWkggS: "x1bo7t0x",
		$$css: true
	}
};
var elevationStyles = {
	none: {
		"--_card-elevation": "xw28qpl",
		$$css: true
	},
	low: {
		"--_card-elevation": "x1nn8khe",
		$$css: true
	},
	med: {
		"--_card-elevation": "x1ovzxg0",
		$$css: true
	},
	high: {
		"--_card-elevation": "xnpe7fx",
		$$css: true
	}
};
var dynamicStyles$9 = { sizing: (width, height, maxWidth, minHeight) => [{
	kzqmXN: width != null ? "x5lhr3w" : width,
	kZKoxP: height != null ? "x16ye13r" : height,
	ks0D6T: maxWidth != null ? "xf68679" : maxWidth,
	kAzted: minHeight != null ? "x82snj4" : minHeight,
	$$css: true
}, {
	"--x-width": ((val) => typeof val === "number" ? val + "px" : val != null ? val : void 0)(width),
	"--x-height": ((val) => typeof val === "number" ? val + "px" : val != null ? val : void 0)(height),
	"--x-maxWidth": ((val) => typeof val === "number" ? val + "px" : val != null ? val : void 0)(maxWidth),
	"--x-minHeight": ((val) => typeof val === "number" ? val + "px" : val != null ? val : void 0)(minHeight)
}] };
/**
* A card container with border and themed styling.
*
* Applies card-specific appearance (background, border, border-radius)
* and sets CSS variables for child layout components.
*
* @compositionHint Use as a top-level container for elevated content.
* Pair with Layout for structured header/content/footer layouts.
*
* @example
* ```
* <Card width={400} height={300}>
*   <Layout
*     header={<LayoutHeader hasDivider>Title</LayoutHeader>}
*     content={<LayoutContent>Content</LayoutContent>}
*     footer={<LayoutFooter hasDivider>Actions</LayoutFooter>}
*   />
* </Card>
* ```
*
* @example
* ```
* <Card variant="blue" width={300}>
*   <p>Blue tinted card</p>
* </Card>
* ```
*
* @example
* ```
* <Card variant="muted" width={300}>
*   <p>Subtle de-emphasised card</p>
* </Card>
* ```
*/
function Card({ width, height, maxWidth, minHeight, children, padding, variant = "default", elevation = "none", xstyle, className, style, ref, ...props$20 }) {
	const hasFixedHeight = height != null && height !== "auto";
	const paddingToken = padding == null ? void 0 : spacingStepToToken[padding];
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
		ref,
		...mergeProps(themeProps("card", {
			variant,
			elevation
		}), props(styles$23.card, variantStyles$1[variant], elevationStyles[elevation], hasFixedHeight && styles$23.scrollable, dynamicStyles$9.sizing(width ?? null, height ?? null, maxWidth ?? null, minHeight ?? null), ...container(paddingToken == null ? { useThemeDefault: "card" } : {
			paddingInnerX: paddingToken,
			paddingInnerY: paddingToken,
			paddingOuterX: paddingToken,
			paddingOuterY: paddingToken
		}), variant === "default" && styles$23.withBorder, xstyle), className, style),
		...props$20,
		children
	});
}
Card.displayName = "Card";
//#endregion
//#region node_modules/@astryxdesign/core/dist/Center/Center.js
/**
* @file Center.tsx
* @input Uses React, StyleX for centering styles, Layout padding.stylex for spacing-scale padding
* @output Exports Center component and CenterProps
* @position Center component for centering children horizontally/vertically
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/Center/Center.doc.mjs
* - /packages/core/src/Center/Center.test.tsx
* - /apps/storybook/stories/Center.stories.tsx
* - /packages/cli/assets/templates/blocks/components/Center/ (showcase blocks)
*/
var styles$22 = {
	base: {
		k1xSpc: "x78zum5",
		$$css: true
	},
	inline: {
		k1xSpc: "x3nfvp2",
		$$css: true
	},
	alignItemsCenter: {
		kGNEyG: "x6s0dn4",
		$$css: true
	},
	justifyContentCenter: {
		kjj79g: "xl56j7k",
		$$css: true
	}
};
var dynamicStyles$8 = { sizing: (width, height, maxWidth, minHeight) => [{
	kzqmXN: width != null ? "x5lhr3w" : width,
	kZKoxP: height != null ? "x16ye13r" : height,
	ks0D6T: maxWidth != null ? "xf68679" : maxWidth,
	kAzted: minHeight != null ? "x82snj4" : minHeight,
	$$css: true
}, {
	"--x-width": ((val) => typeof val === "number" ? val + "px" : val != null ? val : void 0)(width),
	"--x-height": ((val) => typeof val === "number" ? val + "px" : val != null ? val : void 0)(height),
	"--x-maxWidth": ((val) => typeof val === "number" ? val + "px" : val != null ? val : void 0)(maxWidth),
	"--x-minHeight": ((val) => typeof val === "number" ? val + "px" : val != null ? val : void 0)(minHeight)
}] };
/**
* Center component for centering children horizontally and/or vertically.
*
* Uses flexbox for centering. By default, centers on both axes.
* Use the `axis` prop to center on only one axis.
*
* @example
* ```
* <Center width={300} height={200}>
*   <Content />
* </Center>
* ```
*/
function Center({ axis = "both", width, height, maxWidth, minHeight, padding, paddingInline, paddingInlineStart, paddingInlineEnd, paddingBlock, paddingBlockStart, paddingBlockEnd, isInline = false, children, xstyle, className, style, ref, ...props$19 }) {
	const resolvedPaddingInlineStart = paddingInlineStart ?? paddingInline ?? padding;
	const resolvedPaddingInlineEnd = paddingInlineEnd ?? paddingInline ?? padding;
	const resolvedPaddingBlockStart = paddingBlockStart ?? paddingBlock ?? padding;
	const resolvedPaddingBlockEnd = paddingBlockEnd ?? paddingBlock ?? padding;
	const stylexProps = mergeProps(themeProps("center", { axis }), props(isInline ? styles$22.inline : styles$22.base, (axis === "both" || axis === "vertical") && styles$22.alignItemsCenter, (axis === "both" || axis === "horizontal") && styles$22.justifyContentCenter, dynamicStyles$8.sizing(width ?? null, height ?? null, maxWidth ?? null, minHeight ?? null), resolvedPaddingInlineStart != null && paddingInlineStartStyles[resolvedPaddingInlineStart], resolvedPaddingInlineEnd != null && paddingInlineEndStyles[resolvedPaddingInlineEnd], resolvedPaddingBlockStart != null && paddingBlockStartStyles[resolvedPaddingBlockStart], resolvedPaddingBlockEnd != null && paddingBlockEndStyles[resolvedPaddingBlockEnd], xstyle), className, style);
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
		ref,
		...stylexProps,
		...props$19,
		children
	});
}
Center.displayName = "Center";
//#endregion
//#region node_modules/@astryxdesign/core/dist/Dialog/DialogContext.js
/**
* @file DialogContext.ts
* @input React context
* @output Internal dialog context for child focus behavior and default labelling
* @position Dialog internals; consumed by focus-managing children and DialogHeader
*/
var DialogContext = /*#__PURE__*/ (0, import_react.createContext)(null);
DialogContext.displayName = "DialogContext";
function useDialogContext() {
	return (0, import_react.use)(DialogContext);
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/Dialog/Dialog.js
/**
* @file Dialog.tsx
* @input Uses React, DialogHTMLAttributes, ReactNode, container (Layout), DialogContext
* @output Exports Dialog component, DialogProps, DialogVariant, DialogPurpose types
* @position Core implementation; consumed by index.ts, tested by Dialog.test.tsx
*
* The standard variant treats `width` as the preferred surface width, then
* clamps it to the dynamic viewport with spacing-token gutters so narrow
* viewports keep content and controls on screen without changing the public API.
* Fullscreen dialogs add safe-area protection to the default padding fallback
* while preserving explicit prop/theme padding overrides, and fade in without
* the centered-dialog translate/scale motion.
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/Dialog/Dialog.doc.mjs (props table, features, implementation notes)
* - /packages/core/src/Dialog/Dialog.test.tsx (tests for new/changed behavior)
* - /packages/core/src/Dialog/index.ts (exports if types change)
* - /apps/storybook/stories/Dialog.stories.tsx (storybook stories)
* - /packages/cli/assets/templates/blocks/components/Dialog/ (showcase blocks)
*/
/**
* Calculate a directional translate offset for dialog entry animation.
* Returns a normalized vector from the trigger element toward the viewport
* center, scaled to the given distance.
*/
function getDialogDirection(triggerEl, distance = 16) {
	const rect = triggerEl.getBoundingClientRect();
	const dx = rect.left + rect.width / 2 - window.innerWidth / 2;
	const dy = rect.top + rect.height / 2 - window.innerHeight / 2;
	const dist = Math.sqrt(dx * dx + dy * dy) || 1;
	return {
		x: Math.round(dx / dist * distance),
		y: Math.round(dy / dist * distance)
	};
}
`${spacingVars["--spacing-4"]}`;
`${spacingVars["--spacing-4"]}`;
`${spacingVars["--spacing-4"]}`;
`${spacingVars["--spacing-4"]}`;
`${spacingVars["--spacing-4"]}`;
`${spacingVars["--spacing-4"]}`;
/**
* Dialog styles using native <dialog> element
* Uses ::backdrop pseudo-element for overlay
*/
var styles$21 = {
	dialog: {
		kVAEAm: "xixxii4",
		kogj98: "x1bpp3o7",
		kmVPX3: "x1717udv",
		kWkggS: "x10xzikg",
		"--_dialog-radius": "xvuvksw",
		kaIpWk: "xuacgfc",
		kGVxlE: "x1kcpxr7",
		k1xSpc: "x1s85apg",
		kXwgrk: "xdt5ytf",
		kZKoxP: "xg7h5cd",
		kZeWKH: "xish69e",
		kSiTet: "xg01cxk",
		k44tkh: "xqgcaz",
		kyAemX: "x128ha8g",
		kWV6AL: "xskzprw",
		$$css: true
	},
	open: {
		k1xSpc: "x78zum5",
		kSiTet: "x1hc1fzr",
		kKVMdj: "x1ewfqum x1aquc0h",
		$$css: true
	},
	backdrop: {
		kGyWv1: "xnixb3f",
		kba3nw: "x1abwkk1",
		$$css: true
	},
	fullscreen: {
		kzqmXN: "x1o6l61p",
		kZKoxP: "xtdtrs8",
		ks0D6T: "xlbgzzq",
		kskxy: "x1wj9ous",
		kaIpWk: "x2u8bby",
		kogj98: "x1ghz6dp",
		kpwlN0: "x10a8y8t",
		$$css: true
	},
	fullscreenOpen: {
		kKVMdj: "xqcmdr3 x1aquc0h",
		$$css: true
	},
	fullscreenSafeArea: {
		kLKAdn: "x15ld1ci",
		kGO01o: "x1rgxemn",
		kZCmMZ: "xqmdmw x1i7f2ot",
		kwRFfy: "x1by8st6 xtjjor6",
		$$css: true
	},
	inner: {
		k1xSpc: "x78zum5",
		kXwgrk: "xdt5ytf",
		kUk6DE: "x12lumcd",
		kAzted: "x2lwn1j",
		kVQacm: "xb3r6kr",
		kaIpWk: "x1pjcqnp",
		$$css: true
	},
	inlineWrapper: {
		kmVPX3: "x1717udv",
		kWkggS: "x10xzikg",
		"--_dialog-radius": "xvuvksw",
		kaIpWk: "xuacgfc",
		kGVxlE: "x1kcpxr7",
		k1xSpc: "x78zum5",
		kXwgrk: "xdt5ytf",
		kZKoxP: "xg7h5cd",
		kZeWKH: "xish69e",
		$$css: true
	}
};
var STANDARD_DIALOG_VIEWPORT_GUTTER = spacingVars["--spacing-4"];
var STANDARD_DIALOG_MAX_WIDTH = `min(100%, ${`calc(100dvw - ${STANDARD_DIALOG_VIEWPORT_GUTTER} - ${STANDARD_DIALOG_VIEWPORT_GUTTER})`})`;
function formatSizeValue(value) {
	return typeof value === "number" ? `${value}px` : value;
}
function resolveDialogSizing(width, maxHeight) {
	return {
		width: formatSizeValue(width),
		maxWidth: STANDARD_DIALOG_MAX_WIDTH,
		maxHeight: formatSizeValue(maxHeight)
	};
}
var _temp$4 = {
	kogj98: "x1ghz6dp",
	"$$css": true
};
var dynamicStyles$7 = {
	sizing: (width, maxWidth, maxHeight) => [{
		kzqmXN: width != null ? "x5lhr3w" : width,
		ks0D6T: maxWidth != null ? "xf68679" : maxWidth,
		kskxy: maxHeight != null ? "x1jols5v" : maxHeight,
		$$css: true
	}, {
		"--x-width": ((val) => typeof val === "number" ? val + "px" : val != null ? val : void 0)(width),
		"--x-maxWidth": ((val) => typeof val === "number" ? val + "px" : val != null ? val : void 0)(maxWidth),
		"--x-maxHeight": ((val) => typeof val === "number" ? val + "px" : val != null ? val : void 0)(maxHeight)
	}],
	position: (top, insetInlineStart, insetInlineEnd, bottom) => [
		_temp$4,
		{
			k87sOh: top != null ? "xjbys53" : top,
			kLqNvP: insetInlineStart != null ? "x1lxsm33" : insetInlineStart,
			kt4wiu: insetInlineEnd != null ? "xqxgn94" : insetInlineEnd,
			krVfgx: bottom != null ? "x1nqzi6q" : bottom,
			$$css: true
		},
		{
			"--x-top": ((val) => typeof val === "number" ? val + "px" : val != null ? val : void 0)(top),
			"--x-insetInlineStart": ((val) => typeof val === "number" ? val + "px" : val != null ? val : void 0)(insetInlineStart),
			"--x-insetInlineEnd": ((val) => typeof val === "number" ? val + "px" : val != null ? val : void 0)(insetInlineEnd),
			"--x-bottom": ((val) => typeof val === "number" ? val + "px" : val != null ? val : void 0)(bottom)
		}
	]
};
/**
* Format position value - numbers become pixels, strings pass through, undefined becomes null
*/
function formatPosition(value) {
	return typeof value === "number" ? `${value}px` : value;
}
/**
* Map a {@link DialogPosition} to resolved CSS offsets. Logical `start`/`end`
* become `inset-inline-*` (mirror under RTL); each unset offset falls back to
* `auto`.
*
* Not re-exported from the package; internal to Dialog. Directly unit-tested
* so the mapping is verified without StyleX class compilation.
*
* @see DialogPosition
*/
function resolveDialogPositionOffsets(position) {
	const { top, bottom, start, end } = position;
	return {
		top: top !== void 0 ? formatPosition(top) : "auto",
		bottom: bottom !== void 0 ? formatPosition(bottom) : "auto",
		insetInlineStart: start !== void 0 ? formatPosition(start) : "auto",
		insetInlineEnd: end !== void 0 ? formatPosition(end) : "auto"
	};
}
/**
* A dialog component using the native <dialog> element.
*
* Designed to be used with Layout as its child for structured content.
* Uses the browser's built-in modal behavior for optimal accessibility.
* When a DialogHeader is rendered inside, its title automatically names the
* dialog via aria-labelledby; pass `aria-label` or `aria-labelledby` to
* override.
*
* @example
* ```
* const [isOpen, setIsOpen] = useState(false);
* <Dialog isOpen={isOpen} onOpenChange={open => setIsOpen(open)}>
*   <Layout
*     header={<DialogHeader title="Title" onOpenChange={open => setIsOpen(open)} />}
*     content={<LayoutContent>Content</LayoutContent>}
*     footer={<LayoutFooter hasDivider>Actions</LayoutFooter>}
*   />
* </Dialog>
* ```
*/
function Dialog({ isOpen, isInline = false, onOpenChange, width = 400, maxHeight = "75dvh", position, variant = "standard", purpose = "info", padding, children, xstyle, className, style, ref, ...props$18 }) {
	const useThemeDefault = padding == null;
	const effectivePadding = padding ?? 4;
	const paddingToken = spacingStepToToken[effectivePadding];
	const isFullscreen = variant === "fullscreen";
	const standardSizing = isFullscreen ? null : resolveDialogSizing(width, maxHeight);
	const titleId = (0, import_react.useId)();
	const dialogContextValue = (0, import_react.useMemo)(() => ({
		isInline,
		titleId
	}), [isInline, titleId]);
	const hasConsumerName = props$18["aria-label"] != null || props$18["aria-labelledby"] != null;
	const dialogRef = (0, import_react.useRef)(null);
	const mergedDialogRef = useMergedRefs(ref, (0, import_react.useCallback)((node) => {
		dialogRef.current = node;
		if (!node || hasConsumerName) return;
		if (node.querySelector(`#${CSS.escape(titleId)}`) != null) node.setAttribute("aria-labelledby", titleId);
		else node.removeAttribute("aria-labelledby");
	}, [titleId, hasConsumerName]));
	const triggerElementRef = (0, import_react.useRef)(null);
	const allowEscape = purpose !== "required";
	const allowBackdropClick = purpose === "info";
	(0, import_react.useEffect)(() => {
		if (isInline) return;
		const dialog = dialogRef.current;
		if (!dialog) return;
		if (isOpen) {
			triggerElementRef.current = document.activeElement;
			const trigger = triggerElementRef.current;
			if (trigger && trigger !== document.body) {
				const dir = getDialogDirection(trigger);
				dialog.style.setProperty("--dialog-dir-x", `${dir.x}px`);
				dialog.style.setProperty("--dialog-dir-y", `${dir.y}px`);
			} else {
				dialog.style.setProperty("--dialog-dir-x", "0px");
				dialog.style.setProperty("--dialog-dir-y", "16px");
			}
			if (!dialog.open) {
				dialog.showModal();
				const autofocusTarget = dialog.querySelector("[data-autofocus]");
				if (autofocusTarget) autofocusTarget.focus();
			}
		} else {
			if (dialog.open) dialog.close();
			triggerElementRef.current?.focus();
			triggerElementRef.current = null;
		}
	}, [isOpen, isInline]);
	useScrollLock(isOpen && !isInline);
	const { shouldDismissOnCloseRequest } = useLayerDismissal({
		isActive: isOpen,
		isEnabled: !isInline,
		escapeBehavior: allowEscape ? "close" : "block",
		onDismiss: () => {
			onOpenChange(false);
		}
	});
	const warnedUnnamedDialogRef = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		const hasHeaderTitle = dialogRef.current?.querySelector(`#${CSS.escape(titleId)}`) != null;
		if (isOpen && !isInline && !hasConsumerName && !hasHeaderTitle && !warnedUnnamedDialogRef.current) warnedUnnamedDialogRef.current = true;
	}, [
		isOpen,
		isInline,
		hasConsumerName,
		titleId
	]);
	const handleClick = (event) => {
		if (event.target === event.currentTarget && allowBackdropClick) onOpenChange(false);
	};
	const handleCancel = (event) => {
		event.preventDefault();
		if (!shouldDismissOnCloseRequest()) return;
		if (allowEscape) onOpenChange(false);
	};
	const innerContent = /*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
		...props(styles$21.inner, ...container(useThemeDefault ? {
			useThemeDefault: "dialog",
			maxHeight: standardSizing?.maxHeight
		} : {
			paddingInnerX: paddingToken,
			paddingInnerY: paddingToken,
			paddingOuterX: paddingToken,
			paddingOuterY: paddingToken,
			maxHeight: standardSizing?.maxHeight
		}), !useThemeDefault && effectivePadding !== 4 && paddingStyles[effectivePadding], !useThemeDefault && effectivePadding !== 4 && containerPaddingInlineVarStyles[effectivePadding], !useThemeDefault && effectivePadding !== 4 && containerPaddingBlockStartVarStyles[effectivePadding], !useThemeDefault && effectivePadding !== 4 && containerPaddingBlockEndVarStyles[effectivePadding], isFullscreen && useThemeDefault && styles$21.fullscreenSafeArea),
		children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)(DialogContext, {
			value: dialogContextValue,
			children
		})
	});
	const hasPosition = position != null && !isFullscreen;
	const { open: _open, ...safeProps } = props$18;
	if (isInline) {
		if (!isOpen) return null;
		return /*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
			...safeProps,
			...mergeProps(themeProps("dialog", { variant }), props(styles$21.inlineWrapper, overlayPaddingReset.reset, standardSizing && dynamicStyles$7.sizing(standardSizing.width, standardSizing.maxWidth, standardSizing.maxHeight), isFullscreen && styles$21.fullscreen, xstyle), className, style),
			"data-testid": props$18["data-testid"],
			children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)(LayerDepthProvider, { children: innerContent })
		});
	}
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)("dialog", {
		ref: mergedDialogRef,
		...safeProps,
		...mergeProps(themeProps("dialog", { variant }), focusOutlineProps.focusVisible(styles$21.dialog, overlayPaddingReset.reset, isOpen && styles$21.open, styles$21.backdrop, standardSizing && dynamicStyles$7.sizing(standardSizing.width, standardSizing.maxWidth, standardSizing.maxHeight), hasPosition && (() => {
			const o = resolveDialogPositionOffsets(position);
			return dynamicStyles$7.position(o.top, o.insetInlineStart, o.insetInlineEnd, o.bottom);
		})(), isFullscreen && styles$21.fullscreen, isFullscreen && isOpen && styles$21.fullscreenOpen, xstyle), className, style),
		onClick: handleClick,
		onCancel: handleCancel,
		"aria-modal": "true",
		...purpose === "required" ? { role: "alertdialog" } : void 0,
		children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)(LayerDepthProvider, { children: innerContent })
	});
}
Dialog.displayName = "Dialog";
//#endregion
//#region node_modules/@astryxdesign/core/dist/Heading/Heading.js
/**
* @file Heading.tsx
* @input Uses React, HTMLAttributes, ReactNode
* @output Exports Heading component, HeadingProps, HeadingLevel types
* @position Core implementation; lives in own Heading/ dir, re-exported by Text/
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/Text/Text.doc.mjs (props table, features, implementation notes)
* - /packages/core/src/Heading/Heading.test.tsx (tests for new/changed behavior)
* - /packages/core/src/Text/index.ts (exports if types change)
* - /apps/storybook/stories/Text.stories.tsx (storybook stories)
* - /packages/cli/assets/templates/blocks/components/Heading/ (showcase blocks)
* - /packages/cli/assets/templates/blocks/components/Text/ (showcase blocks)
*/
var LazyXDSTooltip = /*#__PURE__*/ (0, import_react.lazy)(async () => Promise.resolve().then(() => Tooltip_exports).then((mod) => ({ default: mod.Tooltip })));
/**
* Heading level (1-6). Determines both visual styling and semantic HTML element.
*/
/**
* Display type variants for headings. Applies display-scale sizing
* (larger, lighter) while preserving the semantic heading element.
*/
var levelToTag = {
	1: "h1",
	2: "h2",
	3: "h3",
	4: "h4",
	5: "h5",
	6: "h6"
};
/**
* Heading - Semantic heading component
*
* Renders headings with semantic HTML (h1-h6) and themed styling.
*
* @example
* ```
* <Heading level={1}>Page Title</Heading>
* <Heading level={2}>Section</Heading>
* <Heading level={2} accessibilityLevel={3}>Sidebar Section</Heading>
* <Heading level={1} type="display-1">Hero Title</Heading>
* <Heading level={2} type="display-2">$1.2M Revenue</Heading>
* <Heading level={2} maxLines={1}>Very Long Section Title...</Heading>
* <Heading level={3} color="secondary">Muted Heading</Heading>
* ```
*/
function Heading({ level, type, accessibilityLevel, color = "primary", display = "block", maxLines = 0, hasTruncateTooltip = true, wordBreak, textWrap, justify = "start", hasCapsize = false, hasStrikethrough = false, xstyle, className, style, children, ref, ...props$17 }) {
	const Component = levelToTag[level];
	const ariaProps = accessibilityLevel && accessibilityLevel !== level ? { "aria-level": accessibilityLevel } : {};
	const resolvedWordBreak = wordBreak ?? (maxLines === 1 ? "break-all" : "break-word");
	const resolvedDisplay = maxLines > 0 || hasCapsize ? "block" : display;
	const truncation = useTruncation({ maxLines });
	const tooltipPlacement = typeof hasTruncateTooltip === "string" ? hasTruncateTooltip : "above";
	const tooltipEnabled = maxLines > 0 && hasTruncateTooltip !== false && truncation.isTruncated;
	const headingRef = (0, import_react.useRef)(null);
	const mergedRef = useMergedRefs(ref, truncation.ref, headingRef);
	const inlineStyle = maxLines > 1 ? { WebkitLineClamp: maxLines } : void 0;
	return /*#__PURE__*/ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/*#__PURE__*/ (0, import_jsx_runtime.jsx)(Component, {
		ref: mergedRef,
		...mergeProps(themeProps("heading", {
			level,
			color,
			...type && { type }
		}), props(colorStyles$3[resolveStyleColor(color)], type ? sizeByTypeStyles[type] : sizeByLevelStyles[level], type && defaultWeightByTypeStyles[type], maxLines === 1 ? truncationStyles.singleLine : maxLines > 1 ? truncationStyles.multiLine : displayStyles[resolvedDisplay], maxLines > 0 && wordBreakStyles[resolvedWordBreak], textWrap && textWrapStyles[textWrap], justify !== "start" && justifyStyles$1[justify], hasCapsize && capsizeStyles.enabled, hasStrikethrough && decorationStyles.strikethrough, xstyle), className, {
			...style,
			...inlineStyle
		}),
		...ariaProps,
		...props$17,
		children
	}), tooltipEnabled && /*#__PURE__*/ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
		fallback: null,
		children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)(LazyXDSTooltip, {
			anchorRef: headingRef,
			content: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
				...props(truncationTooltipStyles.content),
				children: truncation.fullText
			}),
			placement: tooltipPlacement
		})
	})] });
}
Heading.displayName = "Heading";
//#endregion
//#region node_modules/@astryxdesign/core/dist/Dialog/DialogHeader.js
/**
* @file DialogHeader.tsx
* @input Uses React, useEffect, useRef, LayoutHeader, Button, Icon, Heading, Text, DialogContext
* @output Exports DialogHeader component and DialogHeaderProps
* @position Dialog header component; used with Dialog and Layout
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/Dialog/Dialog.doc.mjs
* - /packages/core/src/Dialog/DialogHeader.test.tsx
* - /packages/core/src/Dialog/index.ts
* - /apps/storybook/stories/Dialog.stories.tsx
* - /packages/cli/assets/templates/blocks/components/Dialog/ (showcase blocks)
*/
var styles$20 = { titleFocusable: {
	kI3sdo: "x1a2a7pz",
	$$css: true
} };
/**
* Header component designed specifically for Dialog.
*
* Renders a title that receives focus when a modal dialog opens (for screen reader accessibility)
* and an optional close button. Inline documentation previews suppress this autofocus.
* The title is an h2 element with tabIndex={-1} so it can be programmatically focused but
* doesn't appear in the tab order. The title also names the parent Dialog via
* aria-labelledby (unless the Dialog receives an explicit aria-label/aria-labelledby).
*
* Uses LayoutHeader internally for consistent styling with other layout headers.
*
* @example
* ```
* <Dialog isOpen={isOpen} onOpenChange={open => setIsOpen(open)}>
*   <Layout
*     header={<DialogHeader title="Modal Title" onOpenChange={open => setIsOpen(open)} />}
*     content={<LayoutContent>Content</LayoutContent>}
*     footer={<LayoutFooter hasDivider>Actions</LayoutFooter>}
*   />
* </Dialog>
* ```
*/
function DialogHeader({ title, subtitle, onOpenChange, startContent, endContent, hasDivider, xstyle, className, style, ref, ...rest }) {
	const t = useTranslator();
	const titleRef = (0, import_react.useRef)(null);
	const dialogContext = useDialogContext();
	const shouldAutoFocus = dialogContext?.isInline !== true;
	const titleId = dialogContext?.titleId;
	(0, import_react.useEffect)(() => {
		if (shouldAutoFocus && titleRef.current) titleRef.current.focus();
	}, [shouldAutoFocus]);
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(LayoutHeader, {
		ref,
		hasDivider,
		xstyle,
		className,
		style,
		...rest,
		children: /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("div", {
			className: "x78zum5 x1cy8zhl x1qughib xjcht0a",
			children: [
				startContent && /*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
					className: "x78zum5 x6s0dn4 x1txdalj x2lah0s",
					children: startContent
				}),
				/*#__PURE__*/ (0, import_jsx_runtime.jsxs)("div", {
					className: "x98rzlu xeuugli xqixskq",
					children: [/*#__PURE__*/ (0, import_jsx_runtime.jsx)(Heading, {
						ref: titleRef,
						id: titleId,
						level: 2,
						tabIndex: -1,
						xstyle: styles$20.titleFocusable,
						children: title
					}), subtitle && /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Text, {
						type: "body",
						size: "sm",
						color: "secondary",
						children: subtitle
					})]
				}),
				(endContent || onOpenChange) && /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("div", {
					...{
						0: { className: "x78zum5 x6s0dn4 x1txdalj x2lah0s" },
						1: { className: "x78zum5 x6s0dn4 x1txdalj x2lah0s xhzvc8f x3kzqx6" }
					}[!!onOpenChange << 0],
					children: [endContent, onOpenChange && /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						label: t("@astryx.dialog.close"),
						tooltip: t("@astryx.dialog.close"),
						icon: /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Icon, {
							icon: "close",
							color: "inherit"
						}),
						onClick: () => {
							onOpenChange?.(false);
						},
						isIconOnly: true
					})]
				})
			]
		})
	});
}
DialogHeader.displayName = "DialogHeader";
//#endregion
//#region node_modules/@astryxdesign/core/dist/Stack/Stack.js
/**
* @file Stack.tsx
* @input Uses React, ElementType, stack utility
* @output Exports Stack polymorphic component and StackProps
* @position Layout/Stack component; uses stack.stylex.ts
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/Stack/Stack.doc.mjs
* - /apps/storybook/stories/Stack.stories.tsx
* - /packages/cli/assets/templates/blocks/components/Stack/ (showcase blocks)
*/
var overflowStyles$2 = { scrollable: {
	kVQacm: "xysyzu8",
	$$css: true
} };
/**
* Alignment values accepted by Stack.
*
* The full union of main-axis and cross-axis alignment values.
* Which values are valid depends on direction and axis:
* - Main axis (hAlign for horizontal, vAlign for vertical):
*   `'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'`
* - Cross axis (vAlign for horizontal, hAlign for vertical):
*   `'start' | 'center' | 'end' | 'stretch'`
*/
/**
* Unified stack component for arranging items in a horizontal or vertical layout.
*
* Replaces `HStack` and `VStack` with a single component that accepts
* a `direction` prop. Defaults to `'vertical'` since most layouts stack
* top-to-bottom.
*
* The `hAlign` and `vAlign` props automatically map to the correct CSS axis
* based on the direction:
* - `direction='horizontal'`: hAlign → justify-content, vAlign → align-items
* - `direction='vertical'`: hAlign → align-items, vAlign → justify-content
*
* @example
* ```
* <Stack gap={2}>
*   <Item />
*   <Item />
* </Stack>
* <Stack direction="horizontal" gap={4} vAlign="center">
*   <Item />
*   <Item />
* </Stack>
* ```
*/
function Stack({ direction = "vertical", hAlign, vAlign, justify, align, gap, padding, paddingInline, paddingInlineStart, paddingInlineEnd, paddingBlock, paddingBlockStart, paddingBlockEnd, isScrollable, width, height, maxWidth, minHeight, wrap, as: element = "div", xstyle, className, style, children, ref, ...props$16 }) {
	const resolvedHAlign = hAlign ?? (direction === "horizontal" ? justify : align);
	const resolvedVAlign = vAlign ?? (direction === "horizontal" ? align : justify);
	const mainAlign = direction === "horizontal" ? resolvedHAlign : resolvedVAlign;
	const crossAlign = direction === "horizontal" ? resolvedVAlign : resolvedHAlign;
	const resolvedPaddingInlineStart = paddingInlineStart ?? paddingInline ?? padding;
	const resolvedPaddingInlineEnd = paddingInlineEnd ?? paddingInline ?? padding;
	const resolvedPaddingBlockStart = paddingBlockStart ?? paddingBlock ?? padding;
	const resolvedPaddingBlockEnd = paddingBlockEnd ?? paddingBlock ?? padding;
	const stylexProps = props(...stack({
		direction,
		crossAlign,
		mainAlign,
		gap,
		wrap
	}), resolvedPaddingInlineStart != null && paddingInlineStartStyles[resolvedPaddingInlineStart], resolvedPaddingInlineEnd != null && paddingInlineEndStyles[resolvedPaddingInlineEnd], resolvedPaddingBlockStart != null && paddingBlockStartStyles[resolvedPaddingBlockStart], resolvedPaddingBlockEnd != null && paddingBlockEndStyles[resolvedPaddingBlockEnd], isScrollable && overflowStyles$2.scrollable, xstyle);
	const sizingStyle = {
		...width != null && { width: typeof width === "number" ? `${width}px` : width },
		...height != null && { height: typeof height === "number" ? `${height}px` : height },
		...maxWidth != null && { maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth },
		...minHeight != null && { minHeight: typeof minHeight === "number" ? `${minHeight}px` : minHeight }
	};
	return /*#__PURE__*/ (0, import_react.createElement)(element, {
		ref,
		...mergeProps(themeProps("stack", {
			direction,
			gap,
			wrap
		}), stylexProps, className, {
			...style,
			...sizingStyle
		}),
		...props$16
	}, children);
}
Stack.displayName = "Stack";
//#endregion
//#region node_modules/@astryxdesign/core/dist/HStack/HStack.js
/**
* @file HStack.tsx
* @input Uses Stack component
* @output Exports HStack as a thin wrapper around Stack
* @position Layout/Stack component; wraps Stack with direction='horizontal'
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/Stack/Stack.doc.mjs
* - /packages/core/src/HStack/HStack.test.tsx
* - /packages/cli/assets/templates/blocks/components/HStack/ (showcase blocks)
*/
/**
* Horizontal stack component for arranging items left-to-right.
* Convenience wrapper around `Stack` with `direction="horizontal"`.
*
* @example
* ```
* <HStack gap={2}>
*   <Item />
*   <Item />
* </HStack>
* ```
*/
function HStack({ ref, justify, align, hAlign, vAlign, ...props }) {
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Stack, {
		...props,
		direction: "horizontal",
		hAlign: hAlign ?? justify,
		vAlign: vAlign ?? align,
		ref
	});
}
HStack.displayName = "HStack";
//#endregion
//#region node_modules/@astryxdesign/core/dist/VStack/VStack.js
/**
* @file VStack.tsx
* @input Uses Stack component
* @output Exports VStack as a thin wrapper around Stack
* @position Layout/Stack component; wraps Stack with direction='vertical'
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/Stack/Stack.doc.mjs
* - /packages/core/src/VStack/VStack.test.tsx
* - /packages/cli/assets/templates/blocks/components/VStack/ (showcase blocks)
*/
/**
* Vertical stack component for arranging items top-to-bottom.
* Convenience wrapper around `Stack` with `direction="vertical"`.
*
* @example
* ```
* <VStack gap={2}>
*   <Item />
*   <Item />
* </VStack>
* ```
*/
function VStack({ ref, justify, align, hAlign, vAlign, ...props }) {
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Stack, {
		...props,
		direction: "vertical",
		hAlign: hAlign ?? align,
		vAlign: vAlign ?? justify,
		ref
	});
}
VStack.displayName = "VStack";
//#endregion
//#region node_modules/@astryxdesign/core/dist/Stack/StackItem.js
/**
* @file StackItem.tsx
* @input Uses React, ElementType, stackItem utility
* @output Exports StackItem polymorphic component and StackItemProps
* @position Layout/Stack component; uses stackItem.stylex.ts
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/Stack/Stack.doc.mjs
* - /packages/cli/assets/templates/blocks/components/Stack/ (showcase blocks)
*/
var overflowStyles$1 = { scrollable: {
	kVQacm: "xysyzu8",
	$$css: true
} };
/**
* Stack item component for controlling individual item behavior within a stack.
*
* Supports polymorphic rendering via the `as` prop.
*
* @example
* ```
* <HStack gap={2}>
*   <StackItem size="static">Logo</StackItem>
*   <StackItem size="fill">Content</StackItem>
*   <StackItem size="static">Actions</StackItem>
* </HStack>
* ```
*/
function StackItem({ crossAlignSelf, size, isScrollable, as: element = "div", xstyle, className, style, children, ref, ...props$15 }) {
	const stylexProps = props(...stackItem({
		crossAlignSelf,
		size
	}), isScrollable && overflowStyles$1.scrollable, xstyle);
	return /*#__PURE__*/ (0, import_react.createElement)(element, {
		ref,
		...mergeProps(themeProps("stack-item", { size }), stylexProps, className, style),
		...props$15
	}, children);
}
StackItem.displayName = "StackItem";
//#endregion
//#region node_modules/@astryxdesign/core/dist/Section/Section.js
/**
* @file Section.tsx
* @input Uses container utility, StyleX
* @output Exports Section component and SectionProps
* @position Core section container component
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/Section/Section.doc.mjs (props table, features)
* - /packages/core/src/Section/index.ts (exports if types change)
* - /apps/storybook/stories/Section.stories.tsx (storybook stories)
* - /packages/cli/assets/templates/blocks/components/Section/ (showcase blocks)
*/
/**
* Visual variant for the section.
* Extensible via module augmentation of SectionVariantMap.
*/
var variantStyles = {
	section: {
		kWkggS: "x10xzikg",
		$$css: true
	},
	transparent: {
		kWkggS: "xjbqb8w",
		$$css: true
	},
	muted: {
		kWkggS: "xwmxj5m",
		$$css: true
	}
};
var nestedStyles = {
	outer: {
		keTefX: "xojxgvx",
		k71WvV: "x1fcf3bl",
		keoZOQ: "xkibk3",
		k1K539: "xlayyun",
		$$css: true
	},
	inner: {
		"--container-padding-inline-start": "xrhngw9",
		"--container-padding-inline-end": "xjsfl84",
		"--container-padding-block-start": "x1047aw6",
		"--container-padding-block-end": "xax9j7h",
		kZKoxP: "x5yr21d",
		$$css: true
	}
};
var dividerStyles = {
	top: {
		kEafiO: "x178xt8z",
		kPef9Z: "x13fuv20",
		kLZC3w: "x1pc3f07",
		$$css: true
	},
	bottom: {
		kt9PQ7: "xso031l",
		kfdmCh: "x1q0q8m5",
		kL6WhQ: "xw8gpjh",
		$$css: true
	},
	start: {
		k2ei4v: "xpilrb4",
		kVhnKS: "x1t7ytsu",
		kGJrpR: "x1j92z86",
		$$css: true
	},
	end: {
		ke9TFa: "x1lun4ml",
		k8ry5P: "x18b5jzi",
		kBCPoo: "x1gejf6u",
		$$css: true
	}
};
var dynamicStyles$6 = { sizing: (width, height, maxWidth, minHeight) => [{
	kzqmXN: width != null ? "x5lhr3w" : width,
	kZKoxP: height != null ? "x16ye13r" : height,
	ks0D6T: maxWidth != null ? "xf68679" : maxWidth,
	kAzted: minHeight != null ? "x82snj4" : minHeight,
	$$css: true
}, {
	"--x-width": ((val) => typeof val === "number" ? val + "px" : val != null ? val : void 0)(width),
	"--x-height": ((val) => typeof val === "number" ? val + "px" : val != null ? val : void 0)(height),
	"--x-maxWidth": ((val) => typeof val === "number" ? val + "px" : val != null ? val : void 0)(maxWidth),
	"--x-minHeight": ((val) => typeof val === "number" ? val + "px" : val != null ? val : void 0)(minHeight)
}] };
/**
* A section container with background variants.
*
* Applies section-specific appearance based on the variant prop
* and sets CSS variables for child layout components.
*
* @compositionHint Use inside Card to create visually distinct regions.
* Sections automatically escape parent container padding for edge-to-edge fills.
*
* @example
* ```
* <Section variant="muted" width={300} height={250}>
*   <Layout
*     content={<LayoutContent>Content in muted section</LayoutContent>}
*   />
* </Section>
* ```
*/
function Section({ variant = "section", width, height, maxWidth, minHeight, children, dividers, padding, paddingInline, paddingInlineStart, paddingInlineEnd, paddingBlock, paddingBlockStart, paddingBlockEnd, xstyle, className, style, ref, ...props$14 }) {
	const useThemeDefault = padding == null;
	const effectivePadding = padding ?? 4;
	const paddingToken = spacingStepToToken[effectivePadding];
	const outerStylex = props(nestedStyles.outer, dynamicStyles$6.sizing(width ?? null, height ?? null, maxWidth ?? null, minHeight ?? null), xstyle);
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
		ref,
		className: [outerStylex.className, className].filter(Boolean).join(" ") || void 0,
		style: style && outerStylex.style ? {
			...outerStylex.style,
			...style
		} : style || outerStylex.style,
		...props$14,
		children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
			...mergeProps(themeProps("section", { variant }), props(nestedStyles.inner, ...container(useThemeDefault ? { useThemeDefault: "section" } : {
				paddingInnerX: paddingToken,
				paddingInnerY: paddingToken,
				paddingOuterX: paddingToken,
				paddingOuterY: paddingToken
			}), !useThemeDefault && effectivePadding !== 4 && paddingStyles[effectivePadding], !useThemeDefault && effectivePadding !== 4 && containerPaddingInlineVarStyles[effectivePadding], !useThemeDefault && effectivePadding !== 4 && containerPaddingBlockStartVarStyles[effectivePadding], !useThemeDefault && effectivePadding !== 4 && containerPaddingBlockEndVarStyles[effectivePadding], !useThemeDefault && sectionPaddingPropagationStyles[effectivePadding], paddingInline != null && paddingInlineStyles[paddingInline], paddingInline != null && containerPaddingInlineVarStyles[paddingInline], paddingBlock != null && paddingBlockStyles[paddingBlock], paddingBlock != null && containerPaddingBlockStartVarStyles[paddingBlock], paddingBlock != null && containerPaddingBlockEndVarStyles[paddingBlock], paddingBlockStart != null && paddingBlockStartStyles[paddingBlockStart], paddingBlockStart != null && containerPaddingBlockStartVarStyles[paddingBlockStart], paddingBlockEnd != null && paddingBlockEndStyles[paddingBlockEnd], paddingBlockEnd != null && containerPaddingBlockEndVarStyles[paddingBlockEnd], paddingInlineStart != null && paddingInlineStartStyles[paddingInlineStart], paddingInlineStart != null && containerPaddingInlineStartVarStyles[paddingInlineStart], paddingInlineEnd != null && paddingInlineEndStyles[paddingInlineEnd], paddingInlineEnd != null && containerPaddingInlineEndVarStyles[paddingInlineEnd], variantStyles[variant], dividers?.includes("top") && dividerStyles.top, dividers?.includes("bottom") && dividerStyles.bottom, dividers?.includes("start") && dividerStyles.start, dividers?.includes("end") && dividerStyles.end)),
			children
		})
	});
}
Section.displayName = "Section";
//#endregion
//#region node_modules/@astryxdesign/core/dist/Layout/LayoutFooter.js
/**
* @file LayoutFooter.tsx
* @input Uses React StyleX
* @output Exports LayoutFooter component and LayoutFooterProps
* @position Bottom bar / footer area for Layout. Use for action bars,
*   pagination, status bars, or any fixed-height content at the bottom of a layout.
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/Layout/Layout.doc.mjs
* - /apps/storybook/stories/Layout.stories.tsx
* - /packages/cli/assets/templates/blocks/components/Layout/ (showcase blocks)
*/
var styles$19 = {
	footer: {
		kmuXW: "x2lah0s",
		$$css: true
	},
	inner: {
		kB7OPa: "x9f619",
		ks0D6T: "xjl2t3p",
		kUOVxO: "xvueqy4",
		kZCmMZ: "x139j0dd",
		kwRFfy: "xpc6k2p",
		kLKAdn: "xqty4a",
		kGO01o: "xon7vh3",
		"--container-padding-inline-start": "xdvaxxn",
		"--container-padding-inline-end": "xqpvj4r",
		"--container-padding-block-start": "xjmgx01",
		"--container-padding-block-end": "x1xjq73n",
		$$css: true
	},
	fullBleed: {
		kZCmMZ: "x1c1uobl",
		kwRFfy: "xyri2b",
		kLKAdn: "xexx8yu",
		kGO01o: "x18d9i69",
		"--container-padding-inline-start": "xrhngw9",
		"--container-padding-inline-end": "xjsfl84",
		"--container-padding-block-start": "x1047aw6",
		"--container-padding-block-end": "xax9j7h",
		$$css: true
	},
	divider: {
		kEafiO: "x178xt8z",
		kPef9Z: "x13fuv20",
		kLZC3w: "x1pc3f07",
		$$css: true
	}
};
var dynamicStyles$5 = { sizing: (height) => [{
	kZKoxP: height != null ? "x16ye13r" : height,
	$$css: true
}, { "--x-height": ((val) => typeof val === "number" ? val + "px" : val != null ? val : void 0)(height) }] };
/**
* Bottom bar / footer for Layout. Use for action bars, pagination, or status bars.
* Renders in the footer slot with optional divider and padding control.
*
* Already provides its own padding — don't add padding to children.
* Use `padding={0}` if your content manages its own padding.
*
* @example
* ```
* <LayoutContainer variant="card">
*   <Layout
*     content={<LayoutContent>...</LayoutContent>}
*     footer={<LayoutFooter hasDivider>Actions</LayoutFooter>}
*   />
* </LayoutContainer>
* ```
*/
function LayoutFooter({ children, hasDivider, height, label, padding, role, xstyle, className, style, ref, ...props$13 }) {
	const dividerCtx = (0, import_react.use)(LayoutDividerContext);
	const resolvedHasDivider = hasDivider ?? dividerCtx?.defaultHasDividers ?? false;
	const isZeroPadding = padding === 0;
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
		ref,
		role,
		"aria-label": label,
		"data-divider": resolvedHasDivider || void 0,
		...mergeProps(themeProps("layout-footer"), props(styles$19.footer, dynamicStyles$5.sizing(height ?? null), resolvedHasDivider && styles$19.divider, xstyle), className, style),
		...props$13,
		children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
			...props(styles$19.inner, isZeroPadding && styles$19.fullBleed, padding != null && paddingStyles[padding], padding != null && containerPaddingInlineVarStyles[padding], padding != null && containerPaddingBlockStartVarStyles[padding], padding != null && containerPaddingBlockEndVarStyles[padding]),
			children
		})
	});
}
LayoutFooter.displayName = "LayoutFooter";
//#endregion
//#region node_modules/@astryxdesign/core/dist/FormLayout/FormLayoutContext.js
/**
* @file FormLayoutContext.ts
* @input Uses React createContext
* @output Exports FormLayoutContext, FormLayoutDirection, and FormOptionality types
* @position Context for form layout direction + default-optionality detection
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/FormLayout/FormLayout.tsx (prop + context value)
* - /packages/core/src/Field/FieldLabel.tsx (indicator resolution)
* - /packages/core/src/FormLayout/index.ts (exports if types change)
*/
/**
* Direction of form field arrangement.
*
* - `'vertical'` — Fields stack top-to-bottom (default). Most common.
* - `'horizontal'` — Fields arrange left-to-right, wrapping when needed.
* - `'horizontal-labels'` — Fields stack vertically but labels sit to the left
*   of their inputs (settings/admin panel pattern).
*/
/**
* Which state a form treats as its default, so only the *exception* carries a
* visible optional/required indicator.
*
* - `'optional'` — fields are optional unless a field opts into `isRequired`;
*   only required fields show an indicator.
* - `'required'` — fields are required unless a field opts into `isOptional`;
*   only optional fields show an indicator.
*/
/**
* Context for detecting which form layout a component is rendered in. Children
* can use this to adapt their rendering based on the parent layout — direction
* for spatial arrangement, and `defaultOptionality` so a field can suppress the
* indicator that merely restates the form-wide default.
*/
var FormLayoutContext = /*#__PURE__*/ (0, import_react.createContext)({ direction: "vertical" });
FormLayoutContext.displayName = "FormLayoutContext";
//#endregion
//#region node_modules/@astryxdesign/core/dist/Field/FieldLabel.js
/**
* @file FieldLabel.tsx
* @input Uses React, Icon, IconType, useTranslator, FormLayoutContext
* @output Exports FieldLabel component, FieldLabelProps
* @position Core label implementation; used by Field, CheckboxInput, Switch
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/Field/Field.doc.mjs (props table, features, implementation notes)
* - /packages/core/src/Field/index.ts (exports if types change)
* - /packages/core/src/FormLayout/FormLayoutContext.ts (defaultOptionality drives the indicator)
* - /packages/cli/assets/templates/blocks/components/Field/ (showcase blocks)
* - /packages/core/locales/en.json (@astryx.field.required / @astryx.field.optional)
*/
var styles$18 = {
	label: {
		k1xSpc: "x78zum5",
		kGNEyG: "x6s0dn4",
		kOIVth: "xzye2dw",
		kMv6JI: "x9ynric",
		kGuDYH: "xcr08ib",
		kLWn49: "x1kq96og",
		k63SB2: "x1e4wzip",
		kMwMTN: "xv1l7n4",
		kkrTdU: "x1ypdohk x16khyan",
		$$css: true
	},
	labelDisabled: {
		kMwMTN: "xnbbluu",
		kkrTdU: "xt0e3qv",
		$$css: true
	},
	srOnly: {
		ksu8eU: "xng3xce",
		kMcinP: "xzpqnlu",
		kZKoxP: "xjm9jq1",
		kLqNvP: "x1o0tod",
		kogj98: "xkdpibf",
		kVQacm: "xb3r6kr",
		kmVPX3: "x1717udv",
		kfzvcC: "x47corl",
		kVAEAm: "x10l6tqk",
		k87sOh: "x13vifvy",
		kfSwDN: "x87ps6o",
		khDVqt: "xuxw1ft",
		kzqmXN: "x1i1rx1s",
		$$css: true
	}
};
/**
* Label + description group for form fields. Handles sr-only hiding,
* disabled styling, optional/required indicators, icons, and tooltips.
*
* When `isLabelHidden` is true the entire group uses sr-only positioning
* so it takes up zero layout space — no wrapper div left in flow.
*
* @example
* ```
* <FieldLabel label="Email" inputID={inputId} description="We won't share it" />
* <FieldLabel label="Search" inputID={inputId} isLabelHidden />
* ```
*/
function FieldLabel({ label, inputID, labelID, isGroupLabel = false, isLabelHidden = false, isDisabled = false, isOptional = false, isRequired = false, labelIcon, labelTooltip, description, descriptionID, className, style, xstyle, ref, ...rest }) {
	const t = useTranslator();
	const { defaultOptionality } = (0, import_react.use)(FormLayoutContext);
	const statusText = isOptional && defaultOptionality !== "optional" ? t("@astryx.field.optional") : isRequired && defaultOptionality !== "required" ? t("@astryx.field.required") : null;
	const LabelElement = isGroupLabel ? "span" : "label";
	const forwardsDescriptionClick = !isGroupLabel && inputID != null;
	const descriptionRef = (0, import_react.useRef)(null);
	const descriptionClickProps = useInputContainer({
		containerRef: descriptionRef,
		inputRef: (0, import_react.useMemo)(() => ({
			get current() {
				return inputID == null ? null : descriptionRef.current?.ownerDocument.getElementById(inputID) ?? null;
			},
			set current(_value) {}
		}), [inputID]),
		disabled: !forwardsDescriptionClick
	});
	const labelContent = /*#__PURE__*/ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		labelIcon && renderIconSlot(labelIcon, {
			size: "sm",
			color: "inherit"
		}),
		label,
		statusText && /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("span", {
			className: "x1sodnla x141an7d x1ltkj2j xv1l7n4",
			children: [/*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": "true",
				children: " ∙ "
			}), statusText]
		}),
		labelTooltip && /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Tooltip, {
			content: labelTooltip,
			placement: "above",
			children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Icon, {
				icon: "info",
				size: "sm",
				color: "inherit"
			})
		})
	] });
	return /*#__PURE__*/ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/*#__PURE__*/ (0, import_jsx_runtime.jsx)(LabelElement, {
		ref,
		id: labelID,
		htmlFor: isGroupLabel ? void 0 : inputID,
		...rest,
		...mergeProps(themeProps("field-label"), props(styles$18.label, isDisabled && styles$18.labelDisabled, isLabelHidden && styles$18.srOnly, xstyle), className, style),
		children: labelContent
	}), description && /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
		ref: forwardsDescriptionClick ? descriptionRef : void 0,
		id: descriptionID,
		...forwardsDescriptionClick ? descriptionClickProps : void 0,
		...{
			0: { className: "x9ynric x141an7d x1ltkj2j x1sodnla xv1l7n4" },
			2: { className: "x9ynric x141an7d x1ltkj2j x1sodnla xv1l7n4 x1ypdohk x16khyan" },
			1: { className: "x9ynric x141an7d x1ltkj2j x1sodnla xv1l7n4 xng3xce xzpqnlu xjm9jq1 x1o0tod xkdpibf xb3r6kr x1717udv x47corl x10l6tqk x13vifvy x87ps6o xuxw1ft x1i1rx1s" },
			3: { className: "x9ynric x141an7d x1ltkj2j x1sodnla xv1l7n4 x1ypdohk x16khyan xng3xce xzpqnlu xjm9jq1 x1o0tod xkdpibf xb3r6kr x1717udv x47corl x10l6tqk x13vifvy x87ps6o xuxw1ft x1i1rx1s" }
		}[!!forwardsDescriptionClick << 1 | !!isLabelHidden << 0],
		children: description
	})] });
}
FieldLabel.displayName = "FieldLabel";
//#endregion
//#region node_modules/@astryxdesign/core/dist/FieldStatus/FieldStatus.js
/**
* @file FieldStatus.tsx
* @input Uses React, stylex, theme tokens, useAnnounce, Icon
* @output Exports FieldStatus component, FieldStatusProps
* @position Core implementation; consumed by Field, Switch, CheckboxInput, and the FieldStatus entrypoint
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/FieldStatus/FieldStatus.doc.mjs (props table, features, implementation notes)
* - /packages/core/src/Field/Field.doc.mjs (compat docs when public API changes)
* - /packages/core/src/FieldStatus/index.ts (exports if types change)
* - /packages/core/src/Field/index.ts (compat re-export if public API changes)
* - /packages/cli/assets/templates/blocks/components/FieldStatus/ (showcase blocks)
*/
/**
* Maps each status type to its status glyph. Mirrors the mapping the input
* controls already use for the on-field status affordance, so the detached
* message shows the same icon a consumer sees elsewhere for that status.
*/
var statusIconMap = {
	warning: "warning",
	error: "error",
	success: "success"
};
var styles$17 = {
	base: {
		kMv6JI: "x9ynric",
		kGuDYH: "x141an7d",
		kLWn49: "x1ltkj2j",
		$$css: true
	},
	attached: {
		keoZOQ: "x1c40v9y",
		kLKAdn: "x1ak3mig",
		kGO01o: "x1wesfrj",
		kg3NbH: "xf314gf",
		kVL7Gh: "xquck67",
		kT0f0o: "x14i3lts",
		$$css: true
	},
	detached: {
		keoZOQ: "xcsaf9d",
		k8WAf4: "xce4md1",
		kg3NbH: "xf314gf",
		kaIpWk: "xh6dtrn",
		$$css: true
	}
};
var colorStyles$1 = {
	warning: {
		kWkggS: "x24i8r5",
		kMwMTN: "xdhq94a",
		$$css: true
	},
	error: {
		kWkggS: "x1pritpl",
		kMwMTN: "x1joocv1",
		$$css: true
	},
	success: {
		kWkggS: "xu13z74",
		kMwMTN: "xltfdvo",
		$$css: true
	}
};
/**
* FieldStatus variant type. Extensible via module augmentation of FieldStatusVariantMap.
*/
/**
* A status message component for form fields.
*
* The `detached` variant renders a leading status icon before the message so
* status is not conveyed by color or position alone (WCAG 1.4.1). The icon is
* decorative for assistive tech (`aria-hidden`): the message text already names
* the status in words and is announced through the live region. The `attached`
* variant keeps its status affordance on the bordered input, so it renders no
* icon here to avoid a duplicate. The `tooltip` variant renders no message box
* at all — the input surfaces the status through a tooltip on its on-field
* icon — so callers skip rendering FieldStatus for it.
*
* Screen-reader announcements go through the persistent `useAnnounce` live
* regions (assertive for errors, polite otherwise) rather than `role`/
* `aria-live` on the rendered element. Live regions that mount together with
* their content are not reliably announced by assistive technology, and
* FieldStatus is almost always conditionally rendered by its callers. The
* message is announced whenever it appears — including on first mount — and
* whenever it changes.
*
* @example
* ```
* <FieldStatus
*   type="error"
*   message="This field is required"
* />
* <FieldStatus
*   type="warning"
*   message="This will be visible to others"
*   variant="detached"
* />
* ```
*/
function FieldStatus({ ref, type, message, id, variant = "attached", xstyle, className, style, ...rest }) {
	const entryStyle = useEntryAnimation("slideDown");
	const announce = useAnnounce();
	(0, import_react.useEffect)(() => {
		if (message) announce(message, type === "error" ? "assertive" : "polite");
	}, [
		announce,
		message,
		type
	]);
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
		ref,
		id,
		...rest,
		...mergeProps(themeProps("field-status", {
			type,
			variant
		}), props(styles$17.base, entryStyle, variant === "attached" ? styles$17.attached : styles$17.detached, colorStyles$1[type], xstyle), className, style),
		children: variant === "detached" ? /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("span", {
			className: "x78zum5 x1cy8zhl xzye2dw",
			children: [/*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
				className: "x3nfvp2 x6s0dn4 x14o5nre x2lah0s",
				children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Icon, {
					icon: statusIconMap[type],
					size: "sm",
					color: "inherit",
					...themeProps("field-status-icon", { type })
				})
			}), /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", { children: message })]
		}) : message
	});
}
FieldStatus.displayName = "FieldStatus";
//#endregion
//#region node_modules/@astryxdesign/core/dist/Field/Field.js
/**
* @file Field.tsx
* @input Uses React, HTMLAttributes, ReactNode, FieldLabel, IconType
* @output Exports Field component, FieldProps
* @position Core implementation; consumed by index.ts, tested by Field.test.tsx
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/Field/Field.doc.mjs (props table, features, implementation notes)
* - /packages/core/src/Field/Field.test.tsx (tests for new/changed behavior)
* - /packages/core/src/Field/index.ts (exports if types change)
* - /apps/storybook/stories/Field.stories.tsx (storybook stories)
* - /packages/cli/assets/templates/blocks/components/Field/ (showcase blocks)
*/
var styles$16 = {
	container: {
		k1xSpc: "x78zum5",
		kXwgrk: "xdt5ytf",
		$$css: true
	},
	containerGap: {
		kOIVth: "xzye2dw",
		$$css: true
	},
	horizontalLabels: {
		k1xSpc: "xjp7ctv",
		$$css: true
	}
};
var dynamicStyles$4 = { width: (width) => [{
	kzqmXN: width != null ? "x5lhr3w" : width,
	$$css: true
}, { "--x-width": ((val) => typeof val === "number" ? val + "px" : val != null ? val : void 0)(width) }] };
/**
* A form field wrapper that provides label and description.
*
* @example
* ```
* const id = useId();
* const descID = useId();
* <Field label="Email" description="We'll never share your email" inputID={id} descriptionID={descID}>
*   <input id={id} aria-describedby={descID} />
* </Field>
* ```
*/
function Field({ label, isLabelHidden = false, description, inputID, labelID, isGroupLabel = false, descriptionID, isOptional = false, isRequired = false, isDisabled = false, labelIcon, status, labelTooltip, statusVariant = "attached", width, xstyle, children, className, style, ref, ...props$12 }) {
	const { direction } = (0, import_react.use)(FormLayoutContext);
	const isHorizontalLabels = direction === "horizontal-labels";
	const resolvedDescriptionID = descriptionID ?? (description ? `${inputID}-desc` : void 0);
	const resolvedMessageID = status?.messageID ?? (status?.message ? `${inputID}-status` : void 0);
	useDevWarning("Field", "isOptional and isRequired are mutually exclusive. isOptional takes precedence.", isOptional && isRequired);
	const labelNode = /*#__PURE__*/ (0, import_jsx_runtime.jsx)(FieldLabel, {
		label,
		inputID,
		labelID,
		isGroupLabel,
		isLabelHidden,
		isDisabled,
		isOptional,
		isRequired,
		labelIcon,
		labelTooltip,
		description: isHorizontalLabels ? void 0 : description,
		descriptionID: isHorizontalLabels ? void 0 : resolvedDescriptionID
	});
	const statusNode = status?.message && statusVariant !== "tooltip" ? /*#__PURE__*/ (0, import_jsx_runtime.jsx)(FieldStatus, {
		type: status.type,
		message: status.message,
		id: resolvedMessageID,
		variant: statusVariant
	}) : null;
	if (isHorizontalLabels) return /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		...mergeProps(themeProps("field", { layout: "horizontal-labels" }), props(styles$16.horizontalLabels, xstyle), className, style),
		...props$12,
		children: [/*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
			className: "x1enrzb7",
			children: labelNode
		}), /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("div", {
			className: "x78zum5 xdt5ytf xc8icb0",
			children: [
				description && /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Text, {
					type: "supporting",
					display: "block",
					id: resolvedDescriptionID,
					children: description
				}),
				children,
				statusNode
			]
		})]
	});
	return /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		...mergeProps(themeProps("field"), props(styles$16.container, !isLabelHidden && styles$16.containerGap, width != null && dynamicStyles$4.width(width), xstyle), className, style),
		...props$12,
		children: [labelNode, statusVariant === "attached" ? /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("div", {
			className: "x78zum5 xdt5ytf xc8icb0",
			children: [children, statusNode]
		}) : /*#__PURE__*/ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [children, statusNode] })]
	});
}
Field.displayName = "Field";
//#endregion
//#region node_modules/@astryxdesign/core/dist/Field/inputStyles.stylex.js
/**
* Base wrapper styles shared by all input components.
* Components apply these as a foundation and override specific properties
* (e.g. padding, alignItems, gap) as needed.
*/
var inputWrapperStyles = {
	base: {
		kB7OPa: "x9f619",
		kVAEAm: "x1n2onr6",
		kY2c9j: "x1vjfegm",
		k1xSpc: "x78zum5",
		kGNEyG: "x6s0dn4",
		kOIVth: "x1txdalj",
		k8WAf4: "xu0wf1k",
		kg3NbH: "xf314gf",
		kMzoRj: "x1litavf",
		ksu8eU: "x1y0btm7",
		kVAM5u: "xvy26l8 x6q1khz",
		"--_field-radius": "x1832zxr",
		kaIpWk: "xvdfih8",
		kWkggS: "x10xzikg",
		k1ekBW: "x12zzom9",
		kIyJzY: "xuedmi6 x12w9bfk",
		kAMwcw: "xlr8y92",
		kGVxlE: "x1gnnqk1 x1xqjsvb xuihb5h",
		kI3sdo: "x1a2a7pz",
		$$css: true
	},
	disabled: {
		kkrTdU: "xt0e3qv",
		kSiTet: "xbyyjgo",
		kVAM5u: "xvy26l8",
		kGVxlE: "x1gnnqk1",
		$$css: true
	}
};
/**
* Status border colors for input wrappers.
* Keyed by InputStatusType.
*/
var inputStatusBorderStyles = {
	warning: {
		kVAM5u: "x8wg1ba",
		$$css: true
	},
	error: {
		kVAM5u: "x1ofxpqo",
		$$css: true
	},
	success: {
		kVAM5u: "x16m2moy",
		$$css: true
	}
};
/**
* Status hover shadow styles for input wrappers.
* Keyed by InputStatusType.
*/
var inputStatusHoverShadowStyles = {
	warning: {
		kGVxlE: "x1gnnqk1 x9156jc",
		$$css: true
	},
	error: {
		kGVxlE: "x1gnnqk1 x1bgmis8",
		$$css: true
	},
	success: {
		kGVxlE: "x1gnnqk1 x8wp45d",
		$$css: true
	}
};
/**
* Status focus border styles using :focus-within.
* Used by input wrappers that contain a child input/textarea element.
* Keyed by InputStatusType.
*/
var inputStatusFocusWithinStyles = {
	warning: {
		kVAM5u: "x8wg1ba xa1yw2k",
		$$css: true
	},
	error: {
		kVAM5u: "x1ofxpqo xk2sxw7",
		$$css: true
	},
	success: {
		kVAM5u: "x16m2moy xyq33ac",
		$$css: true
	}
};
//#endregion
//#region node_modules/@astryxdesign/core/dist/Field/InputClearButton.js
var styles$15 = { button: {
	kZKoxP: "x1qx5ct2",
	kmuXW: "x2lah0s",
	kVAEAm: "x1n2onr6",
	"--_input-clear-hit-inset": "xtoycft x181bpwf",
	"--_input-clear-hit-content": "xqxtgf4 xp8r40j",
	k5JduY: "xh3pasq",
	kwXMNM: "x1j6awrg",
	kv0HGH: "xht581f",
	$$css: true
} };
function renderInputClearButton({ label, onClick, onPointerDown, onClickCapture, xstyle, iconClassName }) {
	const { className: iconTargetClassName } = themeProps("input-clear-icon");
	const { className: buttonTargetClassName } = themeProps("input-clear-button");
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Button, {
		variant: "ghost",
		size: "sm",
		label,
		className: buttonTargetClassName,
		icon: /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Icon, {
			icon: "close",
			size: "sm",
			color: "secondary",
			className: iconClassName != null ? `${iconTargetClassName} ${iconClassName}` : iconTargetClassName
		}),
		onClick,
		onPointerDown,
		onClickCapture,
		isIconOnly: true,
		xstyle: [styles$15.button, xstyle]
	});
}
function InputClearButton(props) {
	return renderInputClearButton(props);
}
InputClearButton.displayName = "InputClearButton";
//#endregion
//#region node_modules/@astryxdesign/core/dist/hooks/useResolvedRequired.js
/**
* @file useResolvedRequired.ts
* @input Uses React, FormLayoutContext
* @output Exports useResolvedRequired
* @position Resolves a field's effective aria-required against the form default
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/FormLayout/FormLayoutContext.ts (defaultOptionality source)
* - /packages/core/src/FormLayout/FormLayout.tsx (prop doc: aria-required behavior)
*/
/**
* Resolve a field's effective *required* state for `aria-required`, honoring a
* surrounding `FormLayout`'s `defaultOptionality`.
*
* Under `defaultOptionality="required"` a field is required unless it opts out
* with `isOptional`. The visible indicator is suppressed for the unmarked
* majority, so those fields must still expose `aria-required` — otherwise a
* sighted user reads them as required (form-wide default, no indicator) while a
* screen reader hears "not required". This closes that mismatch.
*
* Semantics only: this drives `aria-required`, never the native `required`
* attribute, so a layout-level default can't silently switch on browser
* validation bubbles. `isOptional` takes precedence, matching `FieldLabel`.
*/
function useResolvedRequired({ isRequired = false, isOptional = false }) {
	const { defaultOptionality } = (0, import_react.use)(FormLayoutContext);
	return !isOptional && (isRequired || defaultOptionality === "required");
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/InputGroup/groupStyles.js
var groupStyles = { inGroup: {
	kUk6DE: "x98rzlu",
	k7Eaqz: "xeuugli",
	kZKoxP: "x5yr21d",
	keTefX: "xd10s4z x1pwwqoy",
	krdFHd: "x15mokao x8eehn2",
	kVL7Gh: "xbiv7yw x1xrp5p4",
	kfmiAY: "x1ga7v0g x1tzxhge",
	kT0f0o: "x16uus16 x1rmb4wm",
	kXnDq0: "x1rm9qnc",
	$$css: true
} };
//#endregion
//#region node_modules/@astryxdesign/core/dist/InputGroup/InputGroupContext.js
/**
* @file InputGroupContext.ts
* @input React createContext/use
* @output Exports InputGroup context and useInputGroup hook
* @position Shared context; consumed by input components for group-aware styling and ARIA associations
*/
var InputGroupContext = /*#__PURE__*/ (0, import_react.createContext)(null);
InputGroupContext.displayName = "InputGroupContext";
/**
* Hook for input components to detect when inside an InputGroup.
* Returns null when used outside a group.
*/
function useInputGroup() {
	return (0, import_react.use)(InputGroupContext);
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/List/ListContext.js
/**
* @file ListContext.tsx
* @input Uses React createContext
* @output Exports ListContext for sharing density between List and ListItem
* @position Internal context; consumed by List.tsx and ListItem.tsx
*/
var ListContext = /*#__PURE__*/ (0, import_react.createContext)(null);
ListContext.displayName = "ListContext";
//#endregion
//#region node_modules/@astryxdesign/core/dist/List/List.js
/**
* @file List.tsx
* @input Uses React, ReactNode, StyleXStyles, theme tokens, ListContext
* @output Exports List component, ListProps, ListDensity, ListStyle types
* @position Core implementation; consumed by index.ts, tested by List.test.tsx
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/List/List.doc.mjs
* - /packages/core/src/List/List.test.tsx
* - /packages/core/src/List/index.ts
* - /apps/storybook/stories/List.stories.tsx
* - /packages/cli/assets/templates/blocks/components/List/ (showcase blocks)
*/
var styles$14 = {
	list: {
		kogj98: "x1ghz6dp",
		kZCmMZ: "x1c1uobl",
		kH6xsr: "x3ct3a4",
		k1xSpc: "x78zum5",
		kXwgrk: "xdt5ytf",
		kOIVth: "x1lsbc85",
		$$css: true
	},
	withDividers: {
		kOIVth: "xxhr3t",
		$$css: true
	},
	withCounter: {
		kt6KFK: "xif0320",
		$$css: true
	}
};
var _temp$3 = {
	kt6KFK: "x1khind5",
	"$$css": true
};
var dynamicStyles$3 = { counterStart: (value) => [_temp$3, { "--x-counterReset": `astryx-list ${value}` != null ? `astryx-list ${value}` : void 0 }] };
/**
* A vertical list component for rendering collections of items.
*
* Renders semantic `<ul>` or `<ol>` elements with configurable density,
* dividers, marker styles, and an optional header.
*
* @example
* ```
* <List>
*   <ListItem label="Notifications" description="Manage your alerts" />
*   <ListItem label="Privacy" description="Control your data" />
* </List>
* <List listStyle="decimal" density="compact">
*   <ListItem label="First step" />
*   <ListItem label="Second step" />
* </List>
* ```
*/
function List({ children, density = "balanced", hasDividers = false, header, listStyle = "none", start, xstyle, className, style, "data-testid": testId, ref, ...props$11 }) {
	const headerId = (0, import_react.useId)();
	const isOrdered = listStyle === "decimal";
	const Tag = isOrdered ? "ol" : "ul";
	const contextValue = (0, import_react.useMemo)(() => ({
		density,
		hasDividers,
		listStyle
	}), [
		density,
		hasDividers,
		listStyle
	]);
	const listElement = /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Tag, {
		ref,
		...props$11,
		"data-testid": testId,
		...header != null ? { "aria-labelledby": headerId } : null,
		...isOrdered && start != null && start !== 1 ? { start } : {},
		role: "list",
		...mergeProps(themeProps("list", {
			density,
			listStyle
		}), props(styles$14.list, hasDividers && styles$14.withDividers, listStyle !== "none" && (start != null && start !== 1 ? dynamicStyles$3.counterStart(start - 1) : styles$14.withCounter), xstyle), className, style),
		children
	});
	if (header == null) return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(ListContext, {
		value: contextValue,
		children: listElement
	});
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(ListContext, {
		value: contextValue,
		children: /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("div", {
			className: "x78zum5 xdt5ytf",
			children: [/*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
				id: headerId,
				className: "x1p37lm5",
				children: header
			}), listElement]
		})
	});
}
List.displayName = "List";
//#endregion
//#region node_modules/@astryxdesign/core/dist/List/ListItem.js
/**
* @file ListItem.tsx
* @input Uses React, ReactNode, StyleXStyles, theme tokens
* @output Exports ListItem component, ListItemProps type
* @position Core implementation; consumed by List, index.ts, tested by List.test.tsx
*
* Composes Item for the shared start content + label + description + end content layout
* and the invisible button/anchor interactive pattern.
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/List/List.doc.mjs
* - /packages/core/src/List/List.test.tsx
* - /packages/core/src/List/index.ts
* - /apps/storybook/stories/List.stories.tsx
* - /packages/cli/assets/templates/blocks/components/List/ (showcase blocks)
*/
var styles$13 = {
	withCounter: {
		kAmcRD: "xfrknyr",
		$$css: true
	},
	withDivider: {
		kt9PQ7: "x92x3c3",
		kfdmCh: "x1q0q8m5",
		kL6WhQ: "xw8gpjh",
		$$css: true
	}
};
var embeddedStyles = { noRadius: {
	kaIpWk: "x2u8bby",
	$$css: true
} };
/**
* A list item component for use within List.
*
* Renders structured content with label, description, start/end content areas.
* When `onClick` is provided, uses the invisible button pattern for accessibility.
* When `href` is provided, uses an invisible anchor pattern.
*
* @example
* ```
* <ListItem label="Settings" description="Manage your preferences" />
* <ListItem label="Profile" onClick={() => navigate('/profile')} />
* <ListItem label="Docs" href="/docs" target="_blank" rel="noreferrer" />
* ```
*/
function ListItem({ label, description, startContent, endContent, onClick, interactiveRef, href, target, rel, isDisabled = false, isSelected = false, xstyle, className, style, ref, ...restProps }) {
	const ctx = (0, import_react.use)(ListContext);
	const density = ctx?.density ?? "balanced";
	const hasDividers = ctx?.hasDividers ?? false;
	const listStyle = ctx?.listStyle ?? "none";
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Item, {
		as: "li",
		ref,
		marker: listStyle === "disc" ? /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
			className: "xoi2r2e x9f619 x78zum5 x6s0dn4 xl56j7k x2lah0s x12xnipv x1233pnv",
			children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", { className: "x1v4s8kt xols6we x16rqkct x19aspcf" })
		}) : listStyle === "circle" ? /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
			className: "xoi2r2e x9f619 x78zum5 x6s0dn4 xl56j7k x2lah0s x12xnipv x1233pnv",
			children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", { className: "x1v4s8kt xols6we x16rqkct xmkeg23 x1y0btm7 xqcx1ss xjbqb8w" })
		}) : listStyle === "decimal" ? /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", { className: "xoi2r2e x2lah0s x1tgivj0 xjm74w1 xw6l6zx x12xnipv xc2ndz5" }) : null,
		startContent,
		label,
		description,
		endContent,
		onClick,
		interactiveRef,
		href,
		target,
		rel,
		isDisabled,
		isSelected,
		density,
		xstyle: [
			listStyle !== "none" && styles$13.withCounter,
			hasDividers && styles$13.withDivider,
			hasDividers && embeddedStyles.noRadius,
			xstyle
		],
		...mergeProps(themeProps("list-item"), {
			className,
			style
		}),
		...restProps
	});
}
ListItem.displayName = "ListItem";
/**
* Pre-computed width information for a single column.
* Produced by `resolveColumnWidths()`, consumed by header cell rendering.
*/
/**
* Result of `resolveColumnWidths()` — contains per-column width styles
* and the aggregate table min-width. Computed once and shared between
* the table min-width calculation and header cell rendering.
*/
/**
* Resolve column widths for the entire table in a single pass.
*
* Computes:
* - Per-column inline styles (`width`, `minWidth`) for `<th>` elements
* - Aggregate `tableMinWidth` for the `<table>` element
*
* This consolidates width logic that was previously duplicated between
* the `tableMinWidth` IIFE and the header cell rendering loop.
*
* @param columns - Resolved column definitions (after auto-generation)
* @returns Pre-computed widths for each column and the table minimum width
*/
function resolveColumnWidths(columns) {
	let totalProportion = 0;
	let pixelTotal = 0;
	const proportionalCols = [];
	for (const col of columns) {
		const w = col.width;
		if (w?.type === "pixel") pixelTotal += w.value;
		else {
			const proportion = w?.value ?? 1;
			const minW = w != null ? w.minWidth ?? 120 : 0;
			totalProportion += proportion;
			proportionalCols.push({
				key: col.key,
				proportion,
				minWidth: minW
			});
		}
	}
	let maxProportionalSpace = 0;
	if (totalProportion > 0) for (const col of proportionalCols) {
		const required = col.minWidth * totalProportion / col.proportion;
		if (required > maxProportionalSpace) maxProportionalSpace = required;
	}
	const tableMinWidth = pixelTotal + maxProportionalSpace;
	const result = /* @__PURE__ */ new Map();
	for (const col of columns) {
		const w = col.width;
		const style = {};
		if (w?.type === "pixel") {
			style.width = `${w.value}px`;
			style.minWidth = `${w.value}px`;
		} else {
			const proportion = w?.value ?? 1;
			if (totalProportion > 0) style.width = `${proportion / totalProportion * 100}%`;
			if (w != null) style.minWidth = `${w.minWidth ?? 120}px`;
		}
		result.set(col.key, { style });
	}
	return {
		columns: result,
		tableMinWidth
	};
}
/**
* Create a proportional column width (fr-like).
* Columns share available space proportionally.
* Applies `DEFAULT_MIN_COLUMN_WIDTH` when no explicit minWidth is provided.
*
* @example
* ```
* proportional(2) // twice as wide as proportional(1)
* proportional(1, { minWidth: 200 }) // explicit min
* ```
*/
function proportional(value = 1, options) {
	return {
		type: "proportional",
		value,
		minWidth: options?.minWidth ?? 120
	};
}
/**
* Capitalize the first letter of a string.
* Used for auto-generating header text from data keys.
*/
function capitalize(str) {
	if (str.length === 0) return str;
	const first = firstCharacter(str);
	return first.toUpperCase() + str.slice(first.length);
}
/**
* Default cell renderer — converts the value at `item[key]` to a string.
*/
function defaultCellRenderer(item, key) {
	const value = item[key];
	if (value == null) return "";
	if (value instanceof Date) return value.toISOString();
	if (typeof value === "string" || typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") return String(value);
	return "";
}
/**
* Estimate the display width of a value in characters.
* Only measures string and number values — objects, arrays, and other
* complex types return 0 (fall back to equal proportioning for that cell).
*/
function estimateContentLength(value) {
	if (value == null) return 0;
	if (typeof value === "string") return value.length;
	if (typeof value === "number" || typeof value === "boolean") return String(value).length;
	return 0;
}
/**
* Find the longest single word in a value (for min-width estimation).
* A "word" is a contiguous non-whitespace sequence.
* Only measures string and number values — complex types return 0.
*/
function longestWord(value) {
	if (value == null) return 0;
	if (typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean") return 0;
	const str = String(value);
	let max = 0;
	let current = 0;
	for (let i = 0; i <= str.length; i++) if (i === str.length || str[i] === " " || str[i] === "	" || str[i] === "\n") {
		if (current > max) max = current;
		current = 0;
	} else current++;
	return max;
}
/** Minimum floor for any column (px). Prevents collapse on narrow viewports. */
var MIN_COLUMN_FLOOR = 60;
/** Scale factor: approximate px per character for min-width calculation. */
var PX_PER_CHAR = 8;
/**
* Auto-generate column definitions from the keys of the first data item.
* Derives content-proportional widths by analyzing the header and first
* few rows of data. Min-width is based on the longer of: header text
* or the longest single word in values.
*/
function generateColumns(data) {
	if (data.length === 0) return [];
	const firstItem = data[0];
	const keys = Object.keys(firstItem);
	const sampleRows = data.slice(0, Math.min(5, data.length));
	return keys.map((key) => {
		const headerLen = capitalize(key).length;
		let maxContentLen = headerLen;
		let maxWordLen = headerLen;
		for (const row of sampleRows) {
			const contentLen = estimateContentLength(row[key]);
			if (contentLen > maxContentLen) maxContentLen = contentLen;
			const wordLen = longestWord(row[key]);
			if (wordLen > maxWordLen) maxWordLen = wordLen;
		}
		return {
			key,
			headerLen,
			maxContentLen,
			maxWordLen
		};
	}).map((m) => {
		const proportion = m.maxContentLen <= 6 ? 1 : m.maxContentLen <= 15 ? 2 : 3;
		const minWidth = Math.max(Math.max(m.headerLen, m.maxWordLen) * PX_PER_CHAR, MIN_COLUMN_FLOOR);
		return {
			key: m.key,
			header: capitalize(m.key),
			width: proportional(proportion, { minWidth })
		};
	});
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/Table/table.stylex.js
/**
* Scoped marker for table row ancestor selectors.
*
* Applied to each `<tr>` via TableRow so that cell-level
* `stylex.when.ancestor(':last-child', tableRowMarker)` only matches
* the parent row — not other ancestors like `<tbody>` or `<table>`.
*/
var tableRowMarker = {
	x139im0d: "x139im0d",
	$$css: true
};
/**
* Overflow truncation for table cells.
*
* Applied at the <td>/<th> level when textOverflow is 'truncate'.
* For data-driven tables in truncate mode, the default renderer wraps
* content in <Text maxLines={1}> for smart tooltips that only appear
* when text is actually overflowing.
*/
var overflowStyles = { cell: {
	kVQacm: "xb3r6kr",
	kg5iWk: "xlyipyv",
	khDVqt: "xuxw1ft",
	ks0D6T: "x1m189uc",
	$$css: true
} };
/**
* Wrap styles for table cells.
*
* Applied at the <td>/<th> level when textOverflow is 'wrap'.
* Text wraps naturally and the row grows taller to fit. No content is hidden.
*/
var wrapStyles = { cell: {
	kVQacm: "xb3r6kr",
	kHjlTd: "x1mzt3pk",
	kTgw9: "x13faqbe",
	ks0D6T: "x1m189uc",
	$$css: true
} };
/**
* Container edge compensation for table cells.
*
* When a table is inside a Card, Section, or Layout area, the table
* element applies negative inline margins to bleed edge-to-edge
* (see Table.tsx containerBleed style). These styles ensure the
* first and last columns' outer padding aligns with the container's
* content inset, with a minimum of --spacing-2 (8px).
*
* Each density variant uses its own paddingInline as the fallback,
* so standalone tables (where --container-padding-inline-start/end are unset)
* keep their normal density-based cell padding unchanged.
*/
var containerEdgeStyles = {
	compact: {
		kZCmMZ: "x5uh4xs",
		kwRFfy: "xbg7gas",
		$$css: true
	},
	balanced: {
		kZCmMZ: "x9bi00s",
		kwRFfy: "xpilulx",
		$$css: true
	},
	spacious: {
		kZCmMZ: "x18c6q21",
		kwRFfy: "x1wzlfcn",
		$$css: true
	}
};
//#endregion
//#region node_modules/@astryxdesign/core/dist/Table/TableContext.js
/**
* @file TableContext.ts
* @input React
* @output Exports TableContext and TableContextValue
* @position Context layer; connects Table styling to sub-components (TableRow, TableCell)
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/Table/Table.tsx (provider)
* - /packages/core/src/Table/TableRow.tsx (consumer)
* - /packages/core/src/Table/TableCell.tsx (consumer)
* - /packages/core/src/Table/index.ts (exports if types change)
*/
var TableContext = /*#__PURE__*/ (0, import_react.createContext)(null);
TableContext.displayName = "TableContext";
//#endregion
//#region node_modules/@astryxdesign/core/dist/Table/TableRow.js
/**
* @file TableRow.tsx
* @input React, StyleX, TableContext, theme tokens
* @output Exports TableRow component, TableRowProps
* @position Sub-component; used inside a Table section (TableHeader /
*   TableBody / TableFooter) in children mode
*
* SYNC: When modified, update:
* - /packages/core/src/Table/Table.doc.mjs
* - /packages/core/src/Table/index.ts
* - /packages/cli/assets/templates/blocks/components/Table/ (showcase blocks)
*/
/** Props for TableRow — thin `<tr>` wrapper */
var stripedRowStyles = { row: {
	kWkggS: "x1dnou9g",
	"--table-row-overlay": "x1rht92",
	$$css: true
} };
var hoverRowStyles = { row: {
	kWkggS: "xoevpu5",
	"--table-row-overlay": "xc01ov8",
	k1ekBW: "x15406qy",
	kIyJzY: "xuedmi6",
	kAMwcw: "xlr8y92",
	$$css: true
} };
var stripedHoverRowStyles = { row: {
	kWkggS: "x1dnou9g xoevpu5",
	"--table-row-overlay": "x1rht92 xc01ov8",
	k1ekBW: "x15406qy",
	kIyJzY: "xuedmi6",
	kAMwcw: "xlr8y92",
	$$css: true
} };
/**
* TableRow — a `<tr>` wrapper for children/streaming mode.
*
* When used inside `<Table>`, inherits styling from the table context
* (striped, hover, divider overrides). When used standalone, renders a plain `<tr>`.
*
* Rows go inside a section — `<TableBody>`, `<TableHeader>`, or
* `<TableFooter>`. `<table>` cannot contain a `<tr>` directly: the HTML parser
* inserts an implied `<tbody>` when it parses server-rendered markup and React
* does not when it renders on the client, so the two trees mismatch on
* hydration. Children mode passes children straight through, so the section is
* the caller's to supply — the data-driven `data={...}` mode renders it for
* you.
*
* @example
* ```
* <Table>
*   <TableBody>
*     <TableRow>
*       <TableCell>Alice</TableCell>
*       <TableCell>30</TableCell>
*     </TableRow>
*   </TableBody>
* </Table>
* ```
*/
function TableRow({ children, xstyle, ref, isHeaderRow = false, className: incomingClassName, style: incomingStyle, ...props$10 }) {
	const ctx = (0, import_react.use)(TableContext);
	if (!ctx) return /*#__PURE__*/ (0, import_jsx_runtime.jsx)("tr", {
		ref,
		...props$10,
		...mergeProps(themeProps("table-row"), props(tableRowMarker, xstyle), incomingClassName, incomingStyle),
		children
	});
	const rowStyles = [];
	if (!isHeaderRow) {
		if (ctx.isStriped && ctx.hasHover) rowStyles.push(stripedHoverRowStyles.row);
		else if (ctx.isStriped) rowStyles.push(stripedRowStyles.row);
		else if (ctx.hasHover) rowStyles.push(hoverRowStyles.row);
	}
	if (ctx.dividers === "rows" || ctx.dividers === "grid") {}
	if (xstyle) rowStyles.push(...xstyle);
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)("tr", {
		ref,
		...props$10,
		...mergeProps(themeProps("table-row"), props(tableRowMarker, ...rowStyles), incomingClassName, incomingStyle),
		children
	});
}
TableRow.displayName = "TableRow";
//#endregion
//#region node_modules/@astryxdesign/core/dist/ContextMenu/ContextMenu.js
/**
* @file ContextMenu.tsx
* @input Uses React, StyleX, useLayer (context mode), useListFocus
* @output Exports ContextMenu component
* @position Core implementation; consumed by index.ts
*
* Right-click context menu positioned at the cursor. The cursor point is
* captured as an offset *inside the trigger* and materialized as a zero-size
* anchor element, so the menu is positioned relative to the trigger's context
* (via CSS anchor positioning) rather than the viewport. It therefore follows
* the content on scroll and auto-flips at viewport edges, while still appearing
* under the cursor.
* Reuses DropdownMenu item rendering and keyboard navigation.
*
* Supports two content modes with a single keyboard/focus path:
* - **Data-driven**: pass `items` array (converted to components internally)
* - **Compound-component**: pass `menuContent` JSX directly
*
* Both modes use useListFocus for DOM-based keyboard navigation.
* Open state is managed internally — right-click opens, click-outside/Escape closes.
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/ContextMenu/ContextMenu.doc.mjs
* - /packages/core/src/ContextMenu/ContextMenu.test.tsx
* - /packages/core/src/ContextMenu/index.ts
* - /apps/storybook/stories/ContextMenu.stories.tsx
* - /packages/cli/assets/templates/blocks/components/ContextMenu/ (showcase blocks)
*/
var styles$12 = {
	trigger: {
		kVAEAm: "x1n2onr6",
		k7VYTy: "xpdipgo",
		$$css: true
	},
	menu: {
		kB7OPa: "x9f619",
		k1xSpc: "x78zum5",
		kXwgrk: "xdt5ytf",
		kOIVth: "x1lsbc85",
		kskxy: "xuyqlj2",
		kORKVm: "x1odjw0f",
		"--_dropdown-menu-radius": "x1fcsqxe",
		"--_dropdown-menu-padding": "xgory14",
		kmVPX3: "x9epnlk",
		kaIpWk: "x1n97fys",
		kWkggS: "x1prclbq",
		kGVxlE: "x1i5ehqx",
		kSiTet: "x1hc1fzr",
		k1ekBW: "x19991ni",
		kIyJzY: "xuedmi6",
		kAMwcw: "xlr8y92",
		kfSwDN: "x87ps6o",
		$$css: true
	},
	popover: {
		k7Eaqz: "x5w4yej",
		$$css: true
	},
	popoverCustomWidth: (width) => [{
		k7Eaqz: (typeof width === "number" ? `${width}px` : width) != null ? "xkj4a21" : typeof width === "number" ? `${width}px` : width,
		$$css: true
	}, { "--x-minWidth": ((val) => typeof val === "number" ? val + "px" : val != null ? val : void 0)(typeof width === "number" ? `${width}px` : width) }]
};
/**
* A context menu component that appears on right-click at cursor position.
*
* Supports two modes:
* - **Data-driven**: pass `items` for static menus
* - **Compound-component**: pass `menuContent` JSX for dynamic menus
*
* Both modes share the same DOM-based keyboard navigation via useListFocus.
*
* @example
* ```
* <ContextMenu
*   items={[
*     { label: 'Cut', onClick: () => handleCut() },
*     { label: 'Copy', onClick: () => handleCopy() },
*     { type: 'divider' },
*     { label: 'Paste', onClick: () => handlePaste() },
*   ]}
* >
*   <div>Right-click this area</div>
* </ContextMenu>
* ```
*/
function ContextMenu({ children, menuWidth, size = "md", label: labelFromProps, isDisabled = false, onOpenChange, ref, className, style, xstyle, triggerXstyle, "data-testid": testId, ...rest }) {
	const t = useTranslator();
	const label = labelFromProps ?? t("@astryx.contextMenu.label");
	const { items: itemsProp, menuContent: menuContentProp, ...triggerProps } = rest;
	const items = itemsProp ?? [];
	const menuContent = menuContentProp;
	const menuId = (0, import_react.useId)();
	const positionRef = (0, import_react.useRef)({
		x: 0,
		y: 0
	});
	const cursorAnchorRef = (0, import_react.useRef)(null);
	const triggerRef = (0, import_react.useRef)(null);
	const triggerFocusRef = (0, import_react.useRef)(null);
	const [isOpen, setIsOpen] = (0, import_react.useState)(false);
	const layer = useLayer({
		mode: "context",
		onHide: (0, import_react.useCallback)(() => {
			setIsOpen(false);
			onOpenChange?.(false);
			const toRestore = triggerFocusRef.current;
			triggerFocusRef.current = null;
			if (toRestore && document.contains(toRestore)) toRestore.focus();
		}, [onOpenChange]),
		onShow: (0, import_react.useCallback)(() => {
			setIsOpen(true);
			onOpenChange?.(true);
		}, [onOpenChange]),
		lightDismiss: false
	});
	const closeMenu = (0, import_react.useCallback)(() => {
		layer.hide();
	}, [layer]);
	const { listRef, handleKeyDown: listNavKeyDown, focusFirst, focusItem, ownsEvent, getItems: getMenuItems } = useListFocus({
		itemSelector: MENU_ITEM_SELECTOR,
		boundarySelector: MENU_BOUNDARY_SELECTOR,
		wrap: false,
		onEscape: closeMenu
	});
	const typeahead = useTypeahead({
		getItemLabels: () => getMenuItems().map((el) => el.textContent),
		onMatch: focusItem,
		getCurrentIndex: () => getMenuItems().findIndex((el) => el === document.activeElement || el.contains(document.activeElement))
	});
	(0, import_react.useEffect)(() => {
		if (!isOpen) return;
		const handleClickOutside = (e) => {
			const menu = listRef.current;
			if (menu && !menu.contains(e.target)) closeMenu();
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [
		isOpen,
		closeMenu,
		listRef
	]);
	(0, import_react.useEffect)(() => {
		if (!isOpen) return;
		const handleEscape = (e) => {
			if (e.key !== "Escape") return;
			if (isImeKeyEvent(e)) return;
			e.preventDefault();
			closeMenu();
		};
		document.addEventListener("keydown", handleEscape);
		return () => {
			document.removeEventListener("keydown", handleEscape);
		};
	}, [isOpen, closeMenu]);
	const listKeyDown = (0, import_react.useCallback)((e) => {
		if (!ownsEvent(e)) return;
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			const focused = document.activeElement;
			if (focused && MENU_ITEM_ROLES.has(focused.getAttribute("role") ?? "")) focused.click();
			return;
		}
		if (e.key === "Tab") {
			closeMenu();
			return;
		}
		if (typeahead.onKeyDown(e)) {
			e.preventDefault();
			return;
		}
		listNavKeyDown(e);
	}, [
		listNavKeyDown,
		closeMenu,
		typeahead,
		ownsEvent
	]);
	const openAtLocalPoint = (0, import_react.useCallback)((localX, localY, focusEl) => {
		positionRef.current = {
			x: localX,
			y: localY
		};
		const anchorEl = cursorAnchorRef.current;
		if (anchorEl) {
			anchorEl.style.left = `${localX}px`;
			anchorEl.style.top = `${localY}px`;
		}
		triggerFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : focusEl;
		layer.show();
		requestAnimationFrame(() => focusFirst());
	}, [layer, focusFirst]);
	const handleContextMenu = (0, import_react.useCallback)((e) => {
		if (isDisabled) return;
		e.preventDefault();
		const rect = triggerRef.current?.getBoundingClientRect();
		const isKeyboardInvoked = e.clientX === 0 && e.clientY === 0 && e.detail === 0;
		const localX = isKeyboardInvoked || !rect ? 0 : e.clientX - rect.left;
		const localY = isKeyboardInvoked || !rect ? rect?.height ?? 0 : e.clientY - rect.top;
		openAtLocalPoint(localX, localY, e.currentTarget);
	}, [isDisabled, openAtLocalPoint]);
	const longPressHandlers = useLongPress({
		disabled: isDisabled,
		onLongPress: (0, import_react.useCallback)((point) => {
			const rect = triggerRef.current?.getBoundingClientRect();
			openAtLocalPoint(rect ? point.x - rect.left : point.x, rect ? point.y - rect.top : point.y, triggerRef.current);
		}, [openAtLocalPoint])
	});
	const popoverXstyle = menuWidth ? styles$12.popoverCustomWidth(menuWidth) : styles$12.popover;
	const contextValue = (0, import_react.useMemo)(() => ({
		closeMenu,
		menuSize: size
	}), [closeMenu, size]);
	const resolvedMenuContent = itemsProp !== void 0 ? renderDropdownItems(items) : menuContent;
	return /*#__PURE__*/ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/*#__PURE__*/ (0, import_jsx_runtime.jsxs)("div", {
		ref: useMergedRefs(ref, triggerRef),
		...triggerProps,
		onContextMenu: handleContextMenu,
		...longPressHandlers,
		"data-testid": testId,
		...props(styles$12.trigger, ...triggerXstyle ? Array.isArray(triggerXstyle) ? triggerXstyle : [triggerXstyle] : []),
		children: [children, /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
			ref: useMergedRefs(cursorAnchorRef, layer.ref),
			"aria-hidden": "true",
			...mergeProps({ className: "x10l6tqk xnalus7 xqtp20y x47corl" }, { style: {
				left: `${positionRef.current.x}px`,
				top: `${positionRef.current.y}px`
			} })
		})]
	}), layer.render(/*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
		ref: listRef,
		id: menuId,
		role: "menu",
		"aria-label": label,
		onKeyDown: listKeyDown,
		onContextMenu: (e) => e.preventDefault(),
		...mergeProps(themeProps("context-menu"), props(styles$12.menu, xstyle), className, style),
		children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)(DropdownMenuContext, {
			value: contextValue,
			children: resolvedMenuContent
		})
	}), {
		placement: "below",
		alignment: "start",
		xstyle: [popoverXstyle, layerAnimations.below]
	})] });
}
ContextMenu.displayName = "ContextMenu";
//#endregion
//#region node_modules/@astryxdesign/core/dist/Table/tableContextMenu.js
/**
* @file tableContextMenu.tsx
* @input React, ContextMenu, Icon, types
* @output wrapInTableContextMenu helper
* @position Renders the aggregated `contextMenuActions` for a header cell / row
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/Table/BaseTable.tsx (call sites)
* - /packages/core/src/Table/types.ts (TableContextAction)
*/
/**
* Convert the flat action list into ContextMenu options, inserting a divider
* between groups (first-seen group order). Ungrouped actions form a trailing
* group. A `checked` action shows a trailing check icon.
*/
function toContextMenuOptions(actions) {
	const order = [];
	const buckets = /* @__PURE__ */ new Map();
	for (const action of actions) {
		const key = action.group ?? "__ungrouped__";
		let bucket = buckets.get(key);
		if (!bucket) {
			bucket = [];
			buckets.set(key, bucket);
			order.push(key);
		}
		bucket.push(action);
	}
	const options = [];
	order.forEach((key, groupIndex) => {
		if (groupIndex > 0) options.push({ type: "divider" });
		for (const action of buckets.get(key) ?? []) options.push({
			label: typeof action.label === "string" ? action.label : action.id,
			icon: action.checked ? /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Icon, {
				icon: "check",
				size: "xsm",
				"aria-hidden": true
			}) : action.icon,
			isDisabled: action.disabled,
			onClick: action.onSelect,
			variant: action.variant
		});
	});
	return options;
}
/**
* Wrap a table element (a header cell's content or a row) in a right-click
* context menu rendering the aggregated `actions`. When no plugin contributes
* actions the element is returned untouched so the native browser menu passes
* through.
*/
/**
* A context menu whose actions are resolved lazily — only when the user opens
* the menu (right-click). Deferring the work means plugins that pass a getter
* don't build an action array (with its closures) for every cell on every
* render; it's computed on demand and memoized until the menu closes.
*/
function LazyTableContextMenu({ element, getActions, triggerXstyle }) {
	const [options, setOptions] = (0, import_react.useState)(null);
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(ContextMenu, {
		items: options ?? [],
		triggerXstyle,
		onOpenChange: (open) => {
			setOptions(open ? toContextMenuOptions(getActions()) : null);
		},
		children: element
	});
}
/**
* Wrap a table element (a header cell's content or a body cell) in a right-click
* context menu rendering the aggregated `actions`. Accepts a static array or a
* getter (resolved lazily on open). When there are no actions the element is
* returned untouched so the native browser menu passes through.
*
* `triggerXstyle` styles the right-click target wrapper. Cells pass a fill +
* padding style so the entire cell (padding included) opens the menu.
*/
function wrapInTableContextMenu(element, actions, triggerXstyle) {
	if (typeof actions === "function") return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(LazyTableContextMenu, {
		element,
		getActions: actions,
		triggerXstyle
	});
	if (!actions || actions.length === 0) return element;
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(ContextMenu, {
		items: toContextMenuOptions(actions),
		triggerXstyle,
		children: element
	});
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/Table/useTableCellStyles.js
/**
* @file useTableCellStyles.ts
* @input React, StyleX, TableContext, theme tokens
* @output Exports shared cell styling utilities
* @position Utility layer; consumed by TableCell and TableHeaderCell
*
* Consolidates the shared pattern of building divider style arrays
* and merging consumer xstyle. Eliminates structural duplication
* between body cells and header cells.
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/Table/TableCell.tsx
* - /packages/core/src/Table/TableHeaderCell.tsx
*/
/**
* Build the divider styles array for a cell based on context.
* Shared between body cells and header cells — both apply row/column
* dividers the same way.
*/
function buildDividerStyles(ctx, dividerRowStyle, dividerColumnStyle) {
	const result = [];
	if (ctx.dividers === "rows" || ctx.dividers === "grid") result.push(dividerRowStyle);
	if (ctx.dividers === "columns" || ctx.dividers === "grid") result.push(dividerColumnStyle);
	return result;
}
/**
* Merge consumer xstyle (single or array) into a styles array.
* Handles the polymorphic xstyle prop that both cell components accept.
*/
function mergeXStyle(styles, xstyle) {
	if (!xstyle) return styles;
	if (Array.isArray(xstyle)) return [...styles, ...xstyle];
	return [...styles, xstyle];
}
/**
* Read the TableContext. Returns null when outside Table,
* signaling that the component should render unstyled.
*/
function useTableContext() {
	return (0, import_react.use)(TableContext);
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/Table/TableCell.js
/**
* @file TableCell.tsx
* @input React, StyleX, TableContext, theme tokens, useTableCellStyles
* @output Exports TableCell component, TableCellProps
* @position Sub-component; used inside Table children mode
*
* SYNC: When modified, update:
* - /packages/core/src/Table/Table.doc.mjs
* - /packages/core/src/Table/index.ts
* - /packages/cli/assets/templates/blocks/components/Table/ (showcase blocks)
*/
/** Props for TableCell — thin `<td>` wrapper */
var densityStyles$1 = {
	compact: {
		k8WAf4: "xu0wf1k",
		kg3NbH: "xf314gf",
		kGuDYH: "xjm74w1",
		kB7OPa: "x9f619",
		$$css: true
	},
	balanced: {
		k8WAf4: "xce4md1",
		kg3NbH: "xrrkdod",
		kGuDYH: "xjm74w1",
		kB7OPa: "x9f619",
		$$css: true
	},
	spacious: {
		k8WAf4: "x8o8v82",
		kg3NbH: "x1pzlopt",
		kGuDYH: "xjm74w1",
		kB7OPa: "x9f619",
		$$css: true
	}
};
var densityTextStyles = {
	compact: {
		kGuDYH: "xjm74w1",
		kB7OPa: "x9f619",
		$$css: true
	},
	balanced: {
		kGuDYH: "xjm74w1",
		kB7OPa: "x9f619",
		$$css: true
	},
	spacious: {
		kGuDYH: "xjm74w1",
		kB7OPa: "x9f619",
		$$css: true
	}
};
var densityPaddingStyles = {
	compact: {
		k8WAf4: "xu0wf1k",
		kg3NbH: "xf314gf",
		$$css: true
	},
	balanced: {
		k8WAf4: "xce4md1",
		kg3NbH: "xrrkdod",
		$$css: true
	},
	spacious: {
		k8WAf4: "x8o8v82",
		kg3NbH: "x1pzlopt",
		$$css: true
	}
};
var triggerFillStyles = { fill: {
	k1xSpc: "x1lliihq",
	kB7OPa: "x9f619",
	kZKoxP: "x5yr21d",
	kzqmXN: "xh8yej3",
	$$css: true
} };
var contextMenuCellStyles = { cell: {
	kZKoxP: "x5yr21d",
	$$css: true
} };
var dividerRowStyles = { cell: {
	kt9PQ7: "x92x3c3 x1wp2rvj",
	kfdmCh: "x1q0q8m5",
	kL6WhQ: "xw8gpjh",
	$$css: true
} };
var dividerColumnStyles$1 = { cell: {
	ke9TFa: "xw8tdv1 x1qlsc9e",
	k8ry5P: "x18b5jzi",
	kBCPoo: "x1gejf6u",
	$$css: true
} };
var verticalAlignStyles = {
	middle: {
		kXLuUW: "xxymvpz",
		$$css: true
	},
	top: {
		kXLuUW: "x16dsc37",
		$$css: true
	},
	bottom: {
		kXLuUW: "x3ajldb",
		$$css: true
	}
};
/**
* TableCell — a `<td>` wrapper for children/streaming mode.
*
* When used inside `<Table>`, inherits styling from the table context
* (density padding, divider borders). When used standalone, renders a plain `<td>`.
*
* @example
* ```
* <TableRow>
*   <TableCell>Alice</TableCell>
*   <TableCell>30</TableCell>
* </TableRow>
* ```
*/
function TableCell({ children, xstyle, ref, className: incomingClassName, style: incomingStyle, contextMenuActions, ...props$9 }) {
	const ctx = useTableContext();
	const hasContextMenu = typeof contextMenuActions === "function" || Array.isArray(contextMenuActions) && contextMenuActions.length > 0;
	const cellStyles = ctx ? [
		hasContextMenu ? densityTextStyles[ctx.density] : densityStyles$1[ctx.density],
		ctx.textOverflow === "truncate" ? overflowStyles.cell : wrapStyles.cell,
		containerEdgeStyles[ctx.density],
		verticalAlignStyles[ctx.verticalAlign],
		...buildDividerStyles(ctx, dividerRowStyles.cell, dividerColumnStyles$1.cell),
		...hasContextMenu ? [contextMenuCellStyles.cell] : []
	] : [];
	const content = wrapInTableContextMenu(children, contextMenuActions, hasContextMenu && ctx ? [triggerFillStyles.fill, densityPaddingStyles[ctx.density]] : hasContextMenu ? triggerFillStyles.fill : void 0);
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)("td", {
		ref,
		...props$9,
		...mergeProps(themeProps("table-cell", { density: ctx?.density }), props(...mergeXStyle(cellStyles, xstyle)), incomingClassName, incomingStyle),
		children: content
	});
}
TableCell.displayName = "TableCell";
//#endregion
//#region node_modules/@astryxdesign/core/dist/Table/TableHeaderCell.js
/**
* @file TableHeaderCell.tsx
* @input React, StyleX, TableContext, theme tokens, useTableCellStyles
* @output Exports TableHeaderCell component, TableHeaderCellProps
* @position Sub-component; used inside Table for header cells
*
* SYNC: When modified, update:
* - /packages/core/src/Table/Table.doc.mjs
* - /packages/core/src/Table/index.ts
* - /packages/cli/assets/templates/blocks/components/Table/ (showcase blocks)
*/
/** Props for TableHeaderCell — `<th>` wrapper with context-aware styling */
var densityStyles = {
	compact: {
		k8WAf4: "xu0wf1k",
		kg3NbH: "xf314gf",
		kGuDYH: "xcr08ib",
		kB7OPa: "x9f619",
		$$css: true
	},
	balanced: {
		k8WAf4: "xce4md1",
		kg3NbH: "xrrkdod",
		kGuDYH: "xcr08ib",
		kB7OPa: "x9f619",
		$$css: true
	},
	spacious: {
		k8WAf4: "x8o8v82",
		kg3NbH: "x1pzlopt",
		kGuDYH: "xcr08ib",
		kB7OPa: "x9f619",
		$$css: true
	}
};
var headerStyles = { cell: {
	k63SB2: "x2mo6ok",
	kMwMTN: "xv1l7n4",
	k9WMMc: "x1yc453h",
	$$css: true
} };
var headerDividerStyles = { cell: {
	kt9PQ7: "x92x3c3",
	kfdmCh: "x1q0q8m5",
	kL6WhQ: "xw8gpjh",
	$$css: true
} };
var dividerColumnStyles = { cell: {
	ke9TFa: "xw8tdv1 x1qlsc9e",
	k8ry5P: "x18b5jzi",
	kBCPoo: "x1gejf6u",
	$$css: true
} };
/**
* TableHeaderCell — a `<th>` wrapper for header cells.
*
* When used inside `<Table>`, inherits styling from the table context
* (density padding, header font weight/color, divider borders).
* When used standalone, renders a plain `<th>`.
*
* Accepts `xstyle` for plugin-provided styles that merge on top.
*
* @example
* ```
* <thead>
*   <tr>
*     <TableHeaderCell>Name</TableHeaderCell>
*     <TableHeaderCell>Age</TableHeaderCell>
*   </tr>
* </thead>
* ```
*/
function TableHeaderCell({ children, xstyle, ref, className: incomingClassName, style: incomingStyle, contextMenuActions, ...props$8 }) {
	const ctx = useTableContext();
	const cellStyles = [];
	if (ctx) {
		cellStyles.push(headerStyles.cell, densityStyles[ctx.density], headerDividerStyles.cell, overflowStyles.cell, containerEdgeStyles[ctx.density]);
		if (ctx.dividers === "columns" || ctx.dividers === "grid") cellStyles.push(dividerColumnStyles.cell);
	}
	const content = wrapInTableContextMenu(children, contextMenuActions);
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)("th", {
		ref,
		...props$8,
		...mergeProps(themeProps("table-header-cell", { density: ctx?.density }), props(...mergeXStyle(cellStyles, xstyle)), incomingClassName, incomingStyle),
		children: content
	});
}
TableHeaderCell.displayName = "TableHeaderCell";
//#endregion
//#region node_modules/@astryxdesign/core/dist/Table/TableHeader.js
function TableHeader({ ref, children, xstyle, className, style, ...rest }) {
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)("thead", {
		ref,
		...mergeProps(themeProps("table-header"), props(xstyle), className, style),
		...rest,
		children
	});
}
TableHeader.displayName = "TableHeader";
//#endregion
//#region node_modules/@astryxdesign/core/dist/Table/TableBody.js
function TableBody({ ref, children, xstyle, className, style, ...rest }) {
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)("tbody", {
		ref,
		...mergeProps(themeProps("table-body"), props(xstyle), className, style),
		...rest,
		children
	});
}
TableBody.displayName = "TableBody";
//#endregion
//#region node_modules/@astryxdesign/core/dist/EmptyState/EmptyState.js
/**
* @file EmptyState.tsx
* @input Uses React, HTMLAttributes
* @output Exports EmptyState component, EmptyStateProps type
* @position Core implementation; consumed by index.ts
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/EmptyState/EmptyState.doc.mjs (props table, features, implementation notes)
* - /packages/core/src/EmptyState/EmptyState.test.tsx (tests for new/changed behavior)
* - /packages/core/src/EmptyState/index.ts (exports if types change)
* - /apps/storybook/stories/EmptyState.stories.tsx (storybook stories)
* - /packages/cli/assets/templates/blocks/components/EmptyState/ (showcase blocks)
*/
var styles$11 = {
	container: {
		k1xSpc: "x78zum5",
		kXwgrk: "xdt5ytf",
		kGNEyG: "x6s0dn4",
		kjj79g: "xl56j7k",
		k9WMMc: "x2b8uid",
		kOIVth: "x18g69wz",
		k8WAf4: "xmfvnks",
		kg3NbH: "xm7rs69",
		$$css: true
	},
	containerCompact: {
		kOIVth: "x1txdalj",
		k8WAf4: "x1na6nto",
		kg3NbH: "x1pzlopt",
		$$css: true
	}
};
/**
* An empty state placeholder for content areas with no data.
* Displays an icon or illustration, title, optional description, and action buttons.
*
* Uses `role="status"` to announce content to screen readers.
* Styles use Astryx theme tokens via StyleX. Wrap your app in <Theme> to apply a theme.
*
* @example
* ```
* <EmptyState
*   title="No results found"
*   description="Try adjusting your search or filters."
* />
* <EmptyState
*   icon={<Icon icon={InboxIcon} size="lg" />}
*   title="No messages"
*   description="You're all caught up!"
*   actions={<Button label="Compose" variant="primary" />}
* />
* ```
*/
function EmptyState({ title, description, icon, actions, headingLevel = 3, isCompact = false, xstyle, className, style, ref, ...props$7 }) {
	const HeadingTag = `h${headingLevel}`;
	return /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		...props$7,
		role: "status",
		...mergeProps(themeProps("empty-state", { variant: isCompact ? "compact" : null }), props(styles$11.container, isCompact && styles$11.containerCompact, xstyle), className, style),
		children: [
			icon != null && /*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
				"aria-hidden": "true",
				children: icon
			}),
			/*#__PURE__*/ (0, import_jsx_runtime.jsxs)("div", {
				className: "x78zum5 xdt5ytf x6s0dn4 xxc7z9f",
				children: [/*#__PURE__*/ (0, import_react.createElement)(HeadingTag, mergeProps(themeProps("empty-state-title", { variant: isCompact ? "compact" : null }), {
					0: { className: "x1ghz6dp xjb2p0i x18juvz8 x2mo6ok xf74fhv x1tgivj0" },
					1: { className: "x1ghz6dp xjb2p0i x2mo6ok xf74fhv x1tgivj0 xcr08ib" }
				}[!!isCompact << 0]), title), description != null && /*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
					...mergeProps(themeProps("empty-state-description", { variant: isCompact ? "compact" : null }), {
						0: { className: "x1ghz6dp xjb2p0i xjm74w1 x1sodnla xw6l6zx xv1l7n4" },
						1: { className: "x1ghz6dp xjb2p0i x1sodnla xw6l6zx xv1l7n4 x141an7d" }
					}[!!isCompact << 0]),
					children: description
				})]
			}),
			actions != null && /*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
				...{
					0: { className: "x78zum5 x1q0g3np x6s0dn4 x1txdalj xcsaf9d" },
					1: { className: "x78zum5 x6s0dn4 x1txdalj xcsaf9d xdt5ytf" }
				}[!!isCompact << 0],
				children: actions
			})
		]
	});
}
EmptyState.displayName = "EmptyState";
//#endregion
//#region node_modules/@astryxdesign/core/dist/Table/BaseTable.js
/**
* @file BaseTable.tsx
* @input React, types.ts, columnUtils.ts
* @output Exports BaseTable component
* @position Core structural component; wrapped by Table.tsx
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/Table/Table.doc.mjs (component description, props)
* - /packages/core/src/Table/Table.test.tsx (tests for new/changed behavior)
* - /packages/core/src/Table/index.ts (exports if types change)
* - /packages/cli/assets/templates/blocks/components/Table/ (showcase blocks)
*/
var styles$10 = {
	table: {
		kzqmXN: "xh8yej3",
		kLvRdT: "x1mwwwfo",
		kheTzg: "x1gukg7c",
		kPzzVL: "x140o2bo",
		$$css: true
	},
	tableAutoLayout: {
		kPzzVL: "x1drmoe9",
		$$css: true
	}
};
/**
* Run a value through a pipeline of plugin transform functions.
* Wraps each transform in a try-catch so a single broken plugin
* doesn't crash the entire table. In development, logs a warning
* with the plugin index and error details.
*/
function applyPlugins(plugins, getter, initial, ...args) {
	return plugins.reduce((acc, plugin, index) => {
		const transform = getter(plugin);
		if (!transform) return acc;
		try {
			return transform(acc, ...args);
		} catch (error) {
			devError("Table", `Plugin at index ${index} threw in transform:`, error);
			return acc;
		}
	}, initial);
}
var EMPTY_PLUGINS = [];
/**
* Shallow-compare two arrays by element identity.
* Used to stabilize the resolved columns array across renders.
*/
function areArraysShallowEqual(a, b) {
	if (a === b) return true;
	if (a.length !== b.length) return false;
	for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
	return true;
}
/**
* Memoized table row component.
* Only re-renders when the specific row's data changes.
* Uses component props for context-based styling, with plugin support.
*/
function TableRowInner({ item, rowIndex, rowKey, columns, plugins, textOverflow, RowComponent, CellComponent, ariaRowIndex }) {
	const cells = columns.map((col, columnIndex) => {
		const initialCellHtmlProps = {};
		if (col.align) initialCellHtmlProps.style = { textAlign: col.align };
		const cellRenderProps = applyPlugins(plugins, (p) => p.transformBodyCell, {
			htmlProps: initialCellHtmlProps,
			xstyle: [],
			columnIndex,
			columns
		}, col, item, columnIndex, columns);
		const isDefaultRenderer = !col.renderCell;
		let rawContent = null;
		if (!cellRenderProps.isContentSuppressed) rawContent = isDefaultRenderer ? defaultCellRenderer(item, col.key) : col.renderCell?.(item) ?? null;
		let content;
		if (isDefaultRenderer && textOverflow === "truncate" && typeof rawContent === "string" && rawContent.length > 0) content = /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Text, {
			type: "body",
			maxLines: 1,
			children: rawContent
		});
		else content = rawContent;
		return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(CellComponent, {
			...cellRenderProps.htmlProps,
			contextMenuActions: cellRenderProps.contextMenuActions,
			xstyle: cellRenderProps.xstyle,
			children: content
		}, col.key);
	});
	const rowRenderProps = applyPlugins(plugins, (p) => p.transformBodyRow, {
		htmlProps: ariaRowIndex == null ? {} : { "aria-rowindex": ariaRowIndex },
		xstyle: [],
		children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: cells })
	}, item, rowIndex);
	const row = /*#__PURE__*/ (0, import_jsx_runtime.jsx)(RowComponent, {
		ref: rowRenderProps.ref,
		...rowRenderProps.htmlProps,
		xstyle: rowRenderProps.xstyle,
		children: rowRenderProps.children
	}, rowKey);
	if (rowRenderProps.afterRow) return /*#__PURE__*/ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [row, rowRenderProps.afterRow] });
	return row;
}
/**
* Compares TableRowProps to determine if re-render is needed.
* Shallow compares the item object and checks if columns/plugins references changed.
*
* Includes rowIndex in the comparison so that plugins using the index
* (e.g. for row numbering or conditional formatting) get correct values
* after insertions/deletions. This also future-proofs for tree grid
* index paths where structural position matters.
*/
function areRowPropsEqual(prevProps, nextProps) {
	if (prevProps.rowKey !== nextProps.rowKey) return false;
	if (prevProps.rowIndex !== nextProps.rowIndex) return false;
	if (prevProps.ariaRowIndex !== nextProps.ariaRowIndex) return false;
	if (prevProps.columns !== nextProps.columns) return false;
	if (prevProps.plugins !== nextProps.plugins) return false;
	if (prevProps.textOverflow !== nextProps.textOverflow) return false;
	if (prevProps.RowComponent !== nextProps.RowComponent) return false;
	if (prevProps.CellComponent !== nextProps.CellComponent) return false;
	if (prevProps.item === nextProps.item) return true;
	const prevItem = prevProps.item;
	const nextItem = nextProps.item;
	const keys = Object.keys(nextItem);
	if (Object.keys(prevItem).length !== keys.length) return false;
	for (const key of keys) if (prevItem[key] !== nextItem[key]) return false;
	return true;
}
var MemoizedTableRow = /*#__PURE__*/ (0, import_react.memo)(TableRowInner, areRowPropsEqual);
/**
* Inner BaseTable implementation (generic-preserving).
*/
function BaseTableInner({ data, columns: columnsProp, idKey, plugins: pluginsProp, children, textOverflow = "wrap", scrollWrapper: ScrollWrapper, emptyState, rowIndexStart, rowCount, xstyle, className, style, ref, ...rest }) {
	const t = useTranslator();
	const plugins = pluginsProp ?? EMPTY_PLUGINS;
	const ariaRowIndexingEnabled = rowIndexStart != null || rowCount != null;
	const firstRowAriaIndex = rowIndexStart ?? 1;
	const ariaRowCount = ariaRowIndexingEnabled ? rowCount ?? -1 : void 0;
	const RowComponent = TableRow;
	const CellComponent = TableCell;
	const HeaderCellComponent = TableHeaderCell;
	const transformedColumns = applyPlugins(plugins, (p) => p.transformColumns, columnsProp ?? (data ? generateColumns(data) : []));
	const resolvedColumnsRef = (0, import_react.useRef)(transformedColumns);
	if (!areArraysShallowEqual(resolvedColumnsRef.current, transformedColumns)) resolvedColumnsRef.current = transformedColumns;
	const resolvedColumns = resolvedColumnsRef.current;
	const resolvedWidths = resolveColumnWidths(resolvedColumns);
	const tableRenderProps = applyPlugins(plugins, (p) => p.transformTable, {
		htmlProps: {},
		xstyle: children ? [styles$10.table, styles$10.tableAutoLayout] : [styles$10.table]
	});
	const headerCells = resolvedColumns.map((col, columnIndex) => {
		const headerContent = col.header ?? col.key;
		const initialHeaderHtmlProps = {
			"data-column-key": col.key,
			scope: "col"
		};
		if (col.align) initialHeaderHtmlProps.style = { textAlign: col.align };
		const cellRenderProps = applyPlugins(plugins, (p) => p.transformHeaderCell, {
			htmlProps: initialHeaderHtmlProps,
			xstyle: [],
			content: headerContent,
			columnIndex,
			columns: resolvedColumns
		}, col, columnIndex, resolvedColumns);
		const widthStyle = resolvedWidths.columns.get(col.key)?.style ?? {};
		const existingStyle = cellRenderProps.htmlProps.style;
		const mergedHtmlProps = {
			...cellRenderProps.htmlProps,
			style: existingStyle ? {
				...widthStyle,
				...existingStyle
			} : widthStyle
		};
		const resolvedContent = cellRenderProps.content ?? headerContent;
		const headerTitleProp = typeof resolvedContent === "string" && resolvedContent.length > 0 ? { title: resolvedContent } : {};
		const { before, after, overlay, below } = cellRenderProps;
		const headerInner = before != null || after != null || overlay != null || below != null ? /*#__PURE__*/ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			before,
			after != null ? /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("div", {
				className: "x3nfvp2 x6s0dn4 xzye2dw xeuugli",
				children: [resolvedContent, after]
			}) : resolvedContent,
			overlay,
			below
		] }) : resolvedContent;
		return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(HeaderCellComponent, {
			...mergedHtmlProps,
			...headerTitleProp,
			contextMenuActions: cellRenderProps.contextMenuActions,
			xstyle: cellRenderProps.xstyle,
			children: headerInner
		}, col.key);
	});
	const headerRowRenderProps = applyPlugins(plugins, (p) => p.transformHeaderRow, {
		htmlProps: {},
		xstyle: [],
		children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: headerCells })
	});
	const hasData = data != null && data.length > 0;
	const hasColumns = resolvedColumns.length > 0;
	const tableStyle = {
		...tableRenderProps.htmlProps.style,
		...style,
		...resolvedWidths.tableMinWidth > 0 ? { minWidth: `${resolvedWidths.tableMinWidth}px` } : null
	};
	let tableElement = /*#__PURE__*/ (0, import_jsx_runtime.jsx)("table", {
		ref,
		...ariaRowCount != null ? { "aria-rowcount": ariaRowCount } : null,
		...tableRenderProps.htmlProps,
		...mergeProps(themeProps("table", void 0, { legacyNames: ["base-table"] }), props(...tableRenderProps.xstyle, xstyle), [tableRenderProps.htmlProps.className, className].filter(Boolean).join(" ") || void 0, tableStyle),
		...rest,
		children: children ? children : /*#__PURE__*/ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [hasColumns && /*#__PURE__*/ (0, import_jsx_runtime.jsx)(TableHeader, { children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)(RowComponent, {
			...headerRowRenderProps.htmlProps,
			isHeaderRow: true,
			xstyle: headerRowRenderProps.xstyle,
			children: headerRowRenderProps.children
		}) }), /*#__PURE__*/ (0, import_jsx_runtime.jsx)(TableBody, { children: hasData ? data.map((item, rowIndex) => {
			const rowKey = idKey == null ? rowIndex : typeof idKey === "function" ? idKey(item) : String(item[idKey]);
			return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(MemoizedTableRow, {
				item,
				rowIndex,
				rowKey,
				columns: resolvedColumns,
				plugins,
				textOverflow,
				RowComponent,
				CellComponent,
				ariaRowIndex: ariaRowIndexingEnabled ? firstRowAriaIndex + rowIndex : void 0
			}, rowKey);
		}) : data != null && emptyState !== false && /*#__PURE__*/ (0, import_jsx_runtime.jsx)("tr", { children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("td", {
			colSpan: resolvedColumns.length,
			children: emptyState ?? /*#__PURE__*/ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: t("@astryx.table.noData"),
				isCompact: true
			})
		}) }) })] })
	});
	if (ScrollWrapper) {
		const scrollWrapperRenderProps = applyPlugins(plugins, (p) => p.transformScrollWrapper, {
			htmlProps: {},
			xstyle: []
		});
		tableElement = /*#__PURE__*/ (0, import_jsx_runtime.jsx)(ScrollWrapper, {
			htmlProps: scrollWrapperRenderProps.htmlProps,
			xstyle: scrollWrapperRenderProps.xstyle,
			beforeTable: scrollWrapperRenderProps.beforeTable,
			afterTable: scrollWrapperRenderProps.afterTable,
			children: tableElement
		});
	}
	for (let i = plugins.length - 1; i >= 0; i--) {
		const plugin = plugins[i];
		if (plugin.transformTableContext) try {
			tableElement = plugin.transformTableContext(tableElement);
		} catch (error) {
			devError("Table", "Plugin threw in transformTableContext:", error);
		}
	}
	return tableElement;
}
/**
* BaseTable — an unstyled, generic `<table>` component.
*
* Supports data-driven rendering (via `data` + `columns`) and children mode.
* Applies plugins as a transform pipeline over render props.
* Accepts a `components` prop to render styled components instead of raw elements.
*
* @example
* ```
* <BaseTable
*   data={[{ name: 'Alice', age: 30 }]}
*   columns={[
*     { key: 'name', header: 'Name' },
*     { key: 'age', header: 'Age', width: pixel(80) },
*   ]}
* />
* ```
*/
var BaseTable = BaseTableInner;
BaseTable.displayName = "BaseTable";
//#endregion
//#region node_modules/@astryxdesign/core/dist/Table/useBaseTablePlugins.js
/**
* @file useBaseTablePlugins.ts
* @input React, types.ts
* @output Exports useBaseTablePlugins hook
* @position Utility hook; used by Table to convert named plugin records to stable arrays
*
* ## Plugin Ordering
*
* First-party plugins are sorted into a canonical order so that plugin
* interactions are deterministic regardless of how the consumer writes
* their `plugins={{ ... }}` record. Unknown/custom plugin names are
* appended after the known set in their original record order.
*
* Canonical order:
*   1. columnSettings — column filtering (future: transformColumns)
*   2. sort           — header cell sort controls
*   3. tree           — indent + expander on the tree column
*   4. selection      — checkbox column + row selection
*   5. pagination     — pagination controls around the table
*
* Rationale:
* - columnSettings filters columns before sort/selection see them
* - sort adds header cell UI before selection adds its header column
* - tree wraps the first *user* column before selection prepends its
*   checkbox column, so the expander never lands in the checkbox column
* - selection adds its column after sort so the checkbox header
*   doesn't get a sort button
* - pagination wraps the table in context last (outermost provider)
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/Table/index.ts (exports)
* - /packages/core/src/Table/Table.tsx (primary consumer)
*/
/**
* Canonical ordering for first-party plugin names.
* Plugins are sorted by their position in this array.
* Unknown names are appended after the known set.
*
* This decides LAYOUT — which column lands left of which, who wraps whom. It
* must never decide whether the table works: a plugin that renders in one
* order and crashes in the other is broken, and adding it here buys a lucky
* order rather than a fix.
*/
var PLUGIN_ORDER = [
	"columnSettings",
	"sort",
	"tree",
	"selection",
	"pagination"
];
/** Lookup map for O(1) ordering checks. */
var PLUGIN_ORDER_MAP = new Map(PLUGIN_ORDER.map((name, index) => [name, index]));
/**
* Sort plugin entries into canonical order.
* Known plugins are sorted by PLUGIN_ORDER; unknown plugins preserve
* their original record insertion order and appear after all known plugins.
*/
function sortPluginEntries(entries) {
	const unknownBase = PLUGIN_ORDER.length;
	return entries.sort(([a], [b]) => {
		return (PLUGIN_ORDER_MAP.get(a) ?? unknownBase) - (PLUGIN_ORDER_MAP.get(b) ?? unknownBase);
	});
}
/** Known transform method names on the TablePlugin interface. */
var VALID_TRANSFORM_KEYS = /* @__PURE__ */ new Set([
	"transformColumns",
	"transformTable",
	"transformHeaderRow",
	"transformHeaderCell",
	"transformBodyRow",
	"transformBodyCell",
	"transformScrollWrapper",
	"transformTableContext"
]);
/**
* Validate a plugin object in development mode.
* Warns about common mistakes like misspelled transform names,
* non-function values where functions are expected, or
* completely empty plugins that add pipeline overhead for nothing.
*/
function validatePlugin(name, plugin) {
	const keys = Object.keys(plugin);
	for (const key of keys) if (!VALID_TRANSFORM_KEYS.has(key)) `${name}${key}${[...VALID_TRANSFORM_KEYS].join(", ")}`;
	for (const key of keys) if (VALID_TRANSFORM_KEYS.has(key)) {
		const value = plugin[key];
		if (value != null && typeof value !== "function") `${name}${key}`;
	}
	if (!keys.some((key) => VALID_TRANSFORM_KEYS.has(key) && typeof plugin[key] === "function")) `${name}`;
}
/**
* Converts a named plugin record (`Record<string, TablePlugin>`) to a stable
* memoized array for `BaseTable`. Compares plugin values by identity so
* that inline `plugins={{ selection: stablePlugin }}` doesn't break row
* memoization — only produces a new array when a plugin value actually changes.
*
* Plugins are sorted into a canonical order (see PLUGIN_ORDER) so that
* interactions between first-party plugins are deterministic.
*
* @param basePlugins - Stable array of built-in plugins (e.g. Astryx style plugin)
* @param userPlugins - Named plugin record from the consumer
* @returns Stable array of plugins suitable for BaseTable
*
* @example
* ```
* const plugins = useBaseTablePlugins([tablePlugin], userPlugins);
* <BaseTable plugins={plugins} ... />
* ```
*/
function useBaseTablePlugins(basePlugins, userPlugins) {
	const prevRef = (0, import_react.useRef)(null);
	if (prevRef.current != null) {
		const prev = prevRef.current;
		if (prev.basePlugins === basePlugins && prev.userPlugins === userPlugins) return prev.result;
		if (prev.basePlugins === basePlugins && arePluginRecordsEqual(prev.userPlugins, userPlugins)) {
			prev.userPlugins = userPlugins;
			return prev.result;
		}
	}
	const sortedUserPlugins = userPlugins ? sortPluginEntries(Object.entries(userPlugins)).map(([, plugin]) => plugin) : [];
	const result = [...basePlugins, ...sortedUserPlugins];
	if (userPlugins) for (const [name, plugin] of Object.entries(userPlugins)) validatePlugin(name, plugin);
	prevRef.current = {
		basePlugins,
		userPlugins,
		result
	};
	return result;
}
/**
* Compares two plugin records by checking that they have the same keys
* and each key maps to the same plugin instance (by reference).
*/
function arePluginRecordsEqual(a, b) {
	if (a === b) return true;
	if (a == null || b == null) return false;
	const keysA = Object.keys(a);
	const keysB = Object.keys(b);
	if (keysA.length !== keysB.length) return false;
	for (const key of keysA) if (a[key] !== b[key]) return false;
	return true;
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/Table/Table.js
/**
* @file Table.tsx
* @input React, StyleX, BaseTable, theme tokens, types, components
* @output Exports Table component, TableProps, TableDensity, TableDividers types
* @position Styled wrapper; the primary table API for consumers
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/Table/Table.doc.mjs (props table, features, usage examples)
* - /packages/core/src/Table/Table.test.tsx (tests for new/changed behavior)
* - /packages/core/src/Table/index.ts (exports if types change)
* - /apps/storybook/stories/Table.stories.tsx (storybook stories)
* - /packages/cli/assets/templates/blocks/components/Table/ (showcase blocks)
*/
/** Row density controlling padding and font size */
/** Divider style between cells */
/** How body cell text behaves when it exceeds column width */
/**
* Props for the styled Table component.
* Supports both data-driven mode and children mode with TableRow/Cell.
*
* @template T - The row data type
*/
var tableStyles = { base: {
	kMv6JI: "xjb2p0i",
	kMwMTN: "x1tgivj0",
	$$css: true
} };
var scrollWrapperStyles = {
	base: {
		kXHlph: "xw2csxc",
		kuHK5b: "x5lxg6s",
		$$css: true
	},
	containerBleed: {
		keTefX: "xojxgvx",
		k71WvV: "x1fcf3bl",
		kzqmXN: "xx6qvi6",
		keoZOQ: "xkibk3",
		k1K539: "xlayyun",
		$$css: true
	}
};
function TableScrollWrapper({ children, htmlProps, xstyle: pluginStyles, beforeTable, afterTable }) {
	const t = useTranslator();
	const { ref, ...restHtmlProps } = htmlProps ?? {};
	return /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		tabIndex: 0,
		role: "group",
		"aria-label": t("@astryx.table.label"),
		...restHtmlProps,
		...mergeProps(themeProps("table-scroll-wrapper"), props(scrollWrapperStyles.base, scrollWrapperStyles.containerBleed, ...pluginStyles ?? [])),
		children: [
			beforeTable,
			children,
			afterTable
		]
	});
}
function buildTableStylePlugin() {
	return { transformTable(props) {
		return {
			...props,
			xstyle: [...props.xstyle, tableStyles.base]
		};
	} };
}
function TableInner({ density = "balanced", dividers = "rows", isStriped = false, hasHover = false, verticalAlign = "middle", textOverflow = "wrap", plugins: userPlugins, columns, data, ref, ...rest }) {
	const tablePlugin = (0, import_react.useMemo)(() => buildTableStylePlugin(), []);
	const mergedPlugins = useBaseTablePlugins((0, import_react.useMemo)(() => [tablePlugin], [tablePlugin]), userPlugins);
	const contextValue = (0, import_react.useMemo)(() => ({
		density,
		dividers,
		isStriped,
		hasHover,
		verticalAlign,
		textOverflow
	}), [
		density,
		dividers,
		isStriped,
		hasHover,
		verticalAlign,
		textOverflow
	]);
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(TableContext, {
		value: contextValue,
		children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)(BaseTable, {
			ref,
			data,
			columns,
			plugins: mergedPlugins,
			textOverflow,
			scrollWrapper: TableScrollWrapper,
			...rest
		})
	});
}
/**
* Table — a styled, data-driven table component.
*
* Wraps BaseTable with styled components (TableRow, TableCell,
* TableHeaderCell) that read appearance configuration from TableContext.
* Density, dividers, striped rows, and hover effects are applied via
* design tokens in the component styles.
*
* @compositionHint Use renderCell on columns to compose rich cell content.
* Combine with Badge (status labels), StatusDot (colored indicators),
* Text (formatted values), Avatar (user cells), and HStack/VStack
* (multi-element cell layouts). Without renderCell, cells render as plain text.
* Always set explicit width on columns using proportional() or pixel() — omitting
* width skips the minimum width floor, which can cause columns to collapse on mobile.
*
* @example
* ```
* <Table
*   data={users}
*   columns={[
*     { key: 'name', header: 'Name', width: proportional(1), renderCell: (u) => (
*       <HStack gap={2} align="center">
*         <Avatar name={u.name} size="md" />
*         <Text weight="semibold">{u.name}</Text>
*       </HStack>
*     )},
*     { key: 'status', header: 'Status', width: proportional(1), renderCell: (u) => (
*       <Badge variant={u.active ? 'success' : 'error'} label={u.active ? 'Active' : 'Inactive'} />
*     )},
*   ]}
*   density="compact"
*   dividers="grid"
*   hasHover
* />
* ```
*/
var Table = TableInner;
Table.displayName = "Table";
//#endregion
//#region node_modules/@astryxdesign/core/dist/Resizable/useResizable.js
/**
* @file useResizable.ts
* @input Resize configuration (defaultSize, minSizePx, maxSizePx, snaps) and
*   collapse configuration (collapsible, defaultIsCollapsed, isCollapsed)
* @output Hook return: size, isCollapsed, collapse/expand/resize methods, props for handle
* @position Public hook; consumed by layout components via `resizable` prop
*/
/**
* Shared config shape for any component that integrates built-in resize
* (e.g. SideNav `resizable` prop). Provides a simplified API surface
* over the full ResizableRegionConfig.
*/
var DEFAULT_MIN = 50;
var DEFAULT_COLLAPSED_SIZE = 40;
var STORAGE_PREFIX = "astryx-resizable:";
function clampSize(size, min, max, snaps) {
	const clamped = Math.min(max, Math.max(min, size));
	if (snaps.length > 0) {
		let nearest = snaps[0];
		let nearestDist = Math.abs(clamped - nearest);
		for (let i = 1; i < snaps.length; i++) {
			const dist = Math.abs(clamped - snaps[i]);
			if (dist < nearestDist) {
				nearest = snaps[i];
				nearestDist = dist;
			}
		}
		return Math.min(max, Math.max(min, nearest));
	}
	return clamped;
}
/**
* Reads a persisted entry. Three formats exist in storage:
* - `{size, isCollapsed}` — the current format; `size` is the expanded size,
*   so the pre-collapse width survives a collapsed session
* - a plain non-zero number — a legacy width-only entry that never recorded
*   collapse, so `isCollapsed` is null (unknown)
* - a plain `0` — written by legacy collapse, which restored the region as a
*   zero-width expanded panel (#4790); read as "collapsed, no saved size"
*/
function loadPersistedState(key) {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem(STORAGE_PREFIX + key);
		if (raw == null) return null;
		const parsed = JSON.parse(raw);
		if (typeof parsed === "number") {
			if (!Number.isFinite(parsed)) return null;
			return parsed === 0 ? {
				size: null,
				isCollapsed: true
			} : {
				size: parsed,
				isCollapsed: null
			};
		}
		if (typeof parsed === "object" && parsed != null) {
			const { size, isCollapsed } = parsed;
			const hasSize = typeof size === "number" && Number.isFinite(size) && size > 0;
			if (hasSize || isCollapsed === true) return {
				size: hasSize ? size : null,
				isCollapsed: isCollapsed === true
			};
		}
	} catch {}
	return null;
}
function persistState(key, state) {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(state));
	} catch {}
}
function resolveDefaultSize(defaultSize) {
	if (defaultSize == null) return 250;
	if (typeof defaultSize === "number") return defaultSize;
	if (defaultSize.endsWith("%")) {
		const pct = parseFloat(defaultSize);
		if (!isNaN(pct)) {
			const approx = typeof window !== "undefined" ? window.innerWidth : 1200;
			return Math.round(pct / 100 * approx);
		}
	}
	return 250;
}
function useSingleResizable(config) {
	const { defaultSize, minSizePx = DEFAULT_MIN, maxSizePx = Infinity, collapsible = false, collapsedSize = DEFAULT_COLLAPSED_SIZE, snaps: configuredSnaps, autoSaveId, defaultIsCollapsed, isCollapsed: controlledIsCollapsed, onSizeChange, onCollapseChange } = config;
	const emptySnapsRef = (0, import_react.useRef)([]);
	const snaps = configuredSnaps ?? emptySnapsRef.current;
	const resolvedDefault = resolveDefaultSize(defaultSize);
	const persisted = autoSaveId ? loadPersistedState(autoSaveId) : null;
	const initial = persisted?.size ?? resolvedDefault;
	const [size, setSize] = (0, import_react.useState)(() => clampSize(initial, minSizePx, maxSizePx, snaps));
	const [uncontrolledIsCollapsed, setUncontrolledIsCollapsed] = (0, import_react.useState)(() => persisted?.isCollapsed ?? defaultIsCollapsed ?? false);
	const isControlled = controlledIsCollapsed !== void 0;
	const isCollapsed = collapsible && (isControlled ? controlledIsCollapsed : uncontrolledIsCollapsed);
	const dragStartSizeRef = (0, import_react.useRef)(size);
	const isCollapsedRef = (0, import_react.useRef)(isCollapsed);
	isCollapsedRef.current = isCollapsed;
	const setCollapsed = (0, import_react.useCallback)((value) => {
		if (!isControlled) {
			isCollapsedRef.current = value;
			setUncontrolledIsCollapsed(value);
		}
	}, [isControlled]);
	(0, import_react.useEffect)(() => {
		if (autoSaveId) persistState(autoSaveId, {
			size,
			isCollapsed
		});
	}, [
		size,
		isCollapsed,
		autoSaveId
	]);
	const collapse = (0, import_react.useCallback)(() => {
		if (!collapsible || isCollapsedRef.current) return;
		setCollapsed(true);
		onCollapseChange?.(true);
		onSizeChange?.(0);
	}, [
		collapsible,
		setCollapsed,
		onCollapseChange,
		onSizeChange
	]);
	const expand = (0, import_react.useCallback)(() => {
		const wasCollapsed = isCollapsedRef.current;
		setCollapsed(false);
		if (wasCollapsed) onCollapseChange?.(false);
		onSizeChange?.(size);
	}, [
		setCollapsed,
		size,
		onCollapseChange,
		onSizeChange
	]);
	const resize = (0, import_react.useCallback)((newSize) => {
		const clamped = clampSize(newSize, minSizePx, maxSizePx, snaps);
		const wasCollapsed = isCollapsedRef.current;
		setSize(clamped);
		setCollapsed(false);
		if (wasCollapsed) onCollapseChange?.(false);
		onSizeChange?.(clamped);
	}, [
		minSizePx,
		maxSizePx,
		snaps,
		setCollapsed,
		onCollapseChange,
		onSizeChange
	]);
	const onResizeStart = (0, import_react.useCallback)(() => {
		dragStartSizeRef.current = isCollapsedRef.current ? 0 : size;
	}, [size]);
	const onResizeMove = (0, import_react.useCallback)((delta) => {
		const raw = dragStartSizeRef.current + delta;
		if (collapsible && raw < collapsedSize) {
			if (!isCollapsedRef.current) {
				setCollapsed(true);
				onCollapseChange?.(true);
				onSizeChange?.(0);
			}
			return;
		}
		if (isCollapsedRef.current && raw >= collapsedSize) {
			setCollapsed(false);
			onCollapseChange?.(false);
		}
		const clamped = clampSize(raw, minSizePx, maxSizePx, snaps);
		setSize(clamped);
		onSizeChange?.(clamped);
	}, [
		collapsible,
		collapsedSize,
		setCollapsed,
		minSizePx,
		maxSizePx,
		snaps,
		onSizeChange,
		onCollapseChange
	]);
	const onResizeEnd = (0, import_react.useCallback)(() => {}, []);
	return {
		size: isCollapsed ? 0 : size,
		isCollapsed,
		collapse,
		expand,
		resize,
		props: {
			_size: isCollapsed ? 0 : size,
			_isCollapsed: isCollapsed,
			_onResizeStart: onResizeStart,
			_onResizeMove: onResizeMove,
			_onResizeEnd: onResizeEnd,
			_minSizePx: minSizePx,
			_maxSizePx: maxSizePx,
			_snaps: snaps,
			_collapsedSize: collapsedSize,
			_collapsible: collapsible,
			_isResizableProps: true
		}
	};
}
/**
* Multi-region hook — delegates to individual useSingleResizable calls.
* Region keys must be stable across renders (same count and order).
* This is enforced by the caller providing a static `regions` object.
*/
function useMultiResizable(config) {
	const { regions, autoSaveId } = config;
	const regionEntries = Object.entries(regions);
	const regionResults = regionEntries.map(([key, regionConfig]) => useSingleResizable({
		...regionConfig,
		autoSaveId: autoSaveId ? `${autoSaveId}:${key}` : void 0
	}));
	const result = {};
	regionEntries.forEach(([key], i) => {
		result[key] = regionResults[i];
	});
	return result;
}
function useResizable(config) {
	if ("regions" in config) return useMultiResizable(config);
	return useSingleResizable(config);
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/Resizable/ResizeHandle.js
/**
* @file ResizeHandle.tsx
* @input direction, isReversed, hasDivider, isAlwaysVisible, pillPlacement, ResizableProps
* @output Styled drag handle with WAI-ARIA separator role and keyboard support
* @position Between resizable panels; consumed directly by builders
*
* The handle element is 1px wide (the divider line itself), with an
* absolutely-positioned wider hit area for pointer interaction.
* Pill grip indicator can sit on either side of the divider (or centered)
* via pillPlacement. Default 'auto' places the pill on the panel side and
* flips when the panel collapses to 0px so it stays accessible.
*
* Pill placement uses a single stylex dynamic style that accepts a direction
* multiplier (-1 or 1). The pill element has its own themeProps
* ('resize-handle-pill') so themes can target size/shape directly.
*
* While the panel is collapsed, aria-valuenow is clamped to aria-valuemin
* (a value below the minimum is invalid per WCAG 4.1.2) and a localized
* "Collapsed" aria-valuetext announces the real state.
*/
var KEYBOARD_STEP = 10;
var KEYBOARD_LARGE_STEP = 50;
function resolveEffectiveSide(pillPlacement, isReversed, isCollapsed) {
	if (pillPlacement !== "auto") return pillPlacement;
	const panelSide = isReversed ? "end" : "start";
	if (isCollapsed) return panelSide === "start" ? "end" : "start";
	return panelSide;
}
/**
* Hit-area inline bias, expressed as a fraction of the pill's per-side offset.
*
* The visible pill is placed by `pillOffsetX`/`pillOffsetY`: anchored at the
* divider's inline-start edge and pushed one grip-width-plus-gap toward the
* panel side via a PHYSICAL translate (dir −1 = start, +1 = end). Because that
* offset is physical, the pill sits on the same physical side of the divider in
* both LTR and RTL. The grab zone must sit OVER that pill, so it has to use the
* exact same anchor + physical-offset construction as the pill (just wider) —
* anchoring the hit area at the divider centre (`insetInlineStart: 50%`) and
* biasing with a percentage translate mixes a logical anchor (which flips under
* RTL) with a physical translate (which doesn't), leaving the grab zone stranded
* to one side under RTL. Returning the pill's `dir` here lets the hit area reuse
* `pillOffsetX`/`pillOffsetY` so the two elements are positioned identically.
*/
function hitAreaBiasDir(effectiveSide) {
	if (effectiveSide === "center") return null;
	return effectiveSide === "start" ? -1 : 1;
}
var styles$9 = {
	handle: {
		kVAEAm: "x1n2onr6",
		kmuXW: "x2lah0s",
		k1xSpc: "x78zum5",
		kGNEyG: "x6s0dn4",
		kjj79g: "xl56j7k",
		kWkggS: "x1m4xfpy",
		k1ekBW: "x15406qy",
		kIyJzY: "xuedmi6",
		kAMwcw: "xlr8y92",
		$$css: true
	},
	overlay: {
		kVAEAm: "x10l6tqk",
		kY2c9j: "xhtitgo",
		kWkggS: "xjbqb8w",
		$$css: true
	},
	overlayHorizontal: {
		kt4wiu: "xtijo5x",
		k87sOh: "x13vifvy",
		krVfgx: "x1ey2m1c",
		kzqmXN: "xkhob8h",
		$$css: true
	},
	overlayVertical: {
		krVfgx: "x1ey2m1c",
		kLqNvP: "x1o0tod",
		kt4wiu: "xtijo5x",
		kZKoxP: "x5kfih4",
		$$css: true
	},
	horizontal: {
		kzqmXN: "x1i1rx1s",
		kZKoxP: "x5yr21d",
		kkrTdU: "xicojor x16khyan",
		$$css: true
	},
	vertical: {
		kZKoxP: "xjm9jq1",
		kzqmXN: "xh8yej3",
		kkrTdU: "xyozgr7 x16khyan",
		$$css: true
	},
	noDividerHorizontal: {
		kWkggS: "xjbqb8w",
		kzqmXN: "xnalus7",
		$$css: true
	},
	noDividerVertical: {
		kWkggS: "xjbqb8w",
		kZKoxP: "xqtp20y",
		$$css: true
	},
	handleHover: {
		kWkggS: "x1m4xfpy",
		$$css: true
	},
	handleActive: {
		kWkggS: "x7njt3n",
		$$css: true
	},
	disabled: {
		kkrTdU: "xt0e3qv",
		kfzvcC: "x47corl",
		$$css: true
	},
	hitArea: {
		kVAEAm: "x10l6tqk",
		kY2c9j: "x1vjfegm",
		kFalU9: "x5ve5x3",
		kfSwDN: "x87ps6o",
		$$css: true
	},
	hitAreaHorizontal: {
		kzqmXN: "x12xnipv",
		k87sOh: "x13vifvy",
		krVfgx: "x1ey2m1c",
		kkrTdU: "xicojor x16khyan",
		$$css: true
	},
	hitAreaVertical: {
		kZKoxP: "x6b6gus",
		kLqNvP: "x1o0tod",
		kt4wiu: "xtijo5x",
		kkrTdU: "xyozgr7 x16khyan",
		$$css: true
	},
	hitAreaCenteredY: {
		k87sOh: "xwa60dl",
		k3aq6I: "x1cb1t30",
		$$css: true
	},
	pill: {
		kVAEAm: "x10l6tqk",
		kY2c9j: "xhtitgo",
		kfzvcC: "x47corl",
		kaIpWk: "xjspbzw",
		kWkggS: "x1m4xfpy",
		k1ekBW: "x1wbls7o",
		kIyJzY: "xuedmi6",
		kAMwcw: "xlr8y92",
		k87sOh: "xwa60dl",
		$$css: true
	},
	pillHorizontal: {
		kzqmXN: "x1g8rjiy",
		kZKoxP: "x18to7ep",
		$$css: true
	},
	pillVertical: {
		kzqmXN: "xgc8j7m",
		kZKoxP: "xuoj239",
		$$css: true
	},
	pillHidden: {
		kSiTet: "xg01cxk",
		$$css: true
	},
	pillVisible: {
		kSiTet: "x1hc1fzr",
		$$css: true
	},
	pillHover: {
		kSiTet: "x1hc1fzr",
		kWkggS: "x1m4xfpy",
		$$css: true
	},
	pillActive: {
		kSiTet: "x1hc1fzr",
		kWkggS: "x7njt3n",
		$$css: true
	}
};
var _temp$2 = {
	kLqNvP: "x1o0tod",
	k3aq6I: "x11wx31z x75qhwu",
	"$$css": true
};
var _temp2 = {
	k87sOh: "x13vifvy",
	k3aq6I: "xsqj5wx",
	"$$css": true
};
var _temp3 = {
	kLqNvP: "x1o0tod",
	k3aq6I: "xsqj5wx",
	"$$css": true
};
var _temp4 = {
	k87sOh: "x13vifvy",
	k3aq6I: "xsqj5wx",
	"$$css": true
};
var dynamicStyles$2 = {
	hitAreaOffsetX: (dir) => [_temp$2, {
		"--x-qthpiu": `translateX(calc(${dir} * (3px + ${spacingVars["--spacing-1"]}) - 6.5px))` != null ? `translateX(calc(${dir} * (3px + ${spacingVars["--spacing-1"]}) - 6.5px))` : void 0,
		"--x-sj6hyi": `translateX(calc(${dir} * (3px + ${spacingVars["--spacing-1"]}) + 6.5px))` != null ? `translateX(calc(${dir} * (3px + ${spacingVars["--spacing-1"]}) + 6.5px))` : void 0
	}],
	hitAreaOffsetY: (dir) => [_temp2, { "--x-transform": `translateY(calc(${dir} * (3px + ${spacingVars["--spacing-1"]}) - 6.5px))` != null ? `translateY(calc(${dir} * (3px + ${spacingVars["--spacing-1"]}) - 6.5px))` : void 0 }],
	pillOffsetX: (dir) => [_temp3, { "--x-transform": `translate(calc(${dir} * (100% + ${spacingVars["--spacing-1"]})), -50%)` != null ? `translate(calc(${dir} * (100% + ${spacingVars["--spacing-1"]})), -50%)` : void 0 }],
	pillOffsetY: (dir) => [_temp4, { "--x-transform": `translate(-50%, calc(${dir} * (100% + ${spacingVars["--spacing-1"]})))` != null ? `translate(-50%, calc(${dir} * (100% + ${spacingVars["--spacing-1"]})))` : void 0 }]
};
/**
* Draggable resize handle placed between resizable panels. Renders as a thin
* divider line with a wider invisible hit area and optional pill grip indicator.
* Supports keyboard resizing via arrow keys and WAI-ARIA separator role.
*
* The pill element uses class `astryx-resize-handle-pill` for theme targeting.
*
* @example
* ```
* <ResizeHandle
*   resizable={sidebar.props}
*   direction="horizontal"
*   hasDivider />
* ```
*/
function ResizeHandle({ direction = "horizontal", position: positionMode = "inline", isReversed = false, isDisabled = false, hasDivider = false, isAlwaysVisible = true, pillPlacement = "auto", label: labelFromProps, resizable, children, xstyle, className, ref, ...props$6 }) {
	const t = useTranslator();
	const label = labelFromProps ?? t("@astryx.resizable.handle.label");
	const handleRef = (0, import_react.useRef)(null);
	const dragCleanupRef = (0, import_react.useRef)(null);
	const [isDragging, setIsDragging] = (0, import_react.useState)(false);
	const [isHovered, setIsHovered] = (0, import_react.useState)(false);
	const [isFocused, setIsFocused] = (0, import_react.useState)(false);
	const isHorizontal = direction === "horizontal";
	const isOverlay = positionMode === "overlay";
	const sign = isReversed ? -1 : 1;
	const effectiveSide = resolveEffectiveSide(pillPlacement, isReversed, resizable?._isCollapsed ?? false);
	const hitBiasDir = hitAreaBiasDir(effectiveSide);
	const getRTLMultiplier = (0, import_react.useCallback)(() => {
		const el = handleRef.current;
		if (!el) return 1;
		return getComputedStyle(el).direction === "rtl" ? -1 : 1;
	}, []);
	const isInteracting = isHovered || isFocused;
	const handlePointerDown = (0, import_react.useCallback)((e) => {
		if (isDisabled || !resizable) return;
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
		resizable._onResizeStart();
		const startPos = isHorizontal ? e.clientX : e.clientY;
		const rtl = isHorizontal ? getRTLMultiplier() : 1;
		document.body.style.cursor = isHorizontal ? "col-resize" : "row-resize";
		document.body.style.userSelect = "none";
		const onMove = (ev) => {
			const delta = ((isHorizontal ? ev.clientX : ev.clientY) - startPos) * rtl * sign;
			resizable._onResizeMove(delta);
		};
		const onUp = () => {
			cleanup();
			setIsDragging(false);
			resizable._onResizeEnd();
			document.body.style.cursor = "";
			document.body.style.userSelect = "";
		};
		const onCancel = () => {
			cleanup();
			setIsDragging(false);
			document.body.style.cursor = "";
			document.body.style.userSelect = "";
		};
		function cleanup() {
			window.removeEventListener("pointermove", onMove);
			window.removeEventListener("pointerup", onUp);
			window.removeEventListener("pointercancel", onCancel);
			dragCleanupRef.current = null;
		}
		window.addEventListener("pointermove", onMove);
		window.addEventListener("pointerup", onUp);
		window.addEventListener("pointercancel", onCancel);
		dragCleanupRef.current = cleanup;
	}, [
		isDisabled,
		resizable,
		isHorizontal,
		getRTLMultiplier,
		sign
	]);
	const handleKeyDown = (0, import_react.useCallback)((e) => {
		if (isDisabled || !resizable) return;
		const step = e.shiftKey ? KEYBOARD_LARGE_STEP : KEYBOARD_STEP;
		const rtl = isHorizontal ? getRTLMultiplier() : 1;
		switch (e.key) {
			case "ArrowRight":
			case "ArrowDown":
				e.preventDefault();
				resizable._onResizeStart();
				resizable._onResizeMove(step * (isHorizontal ? rtl : 1) * sign);
				resizable._onResizeEnd();
				break;
			case "ArrowLeft":
			case "ArrowUp":
				e.preventDefault();
				resizable._onResizeStart();
				resizable._onResizeMove(-step * (isHorizontal ? rtl : 1) * sign);
				resizable._onResizeEnd();
				break;
			case "Home":
				e.preventDefault();
				resizable._onResizeStart();
				resizable._onResizeMove(resizable._minSizePx - resizable._size);
				resizable._onResizeEnd();
				break;
			case "End":
				e.preventDefault();
				if (resizable._maxSizePx !== Infinity) {
					resizable._onResizeStart();
					resizable._onResizeMove(resizable._maxSizePx - resizable._size);
					resizable._onResizeEnd();
				}
				break;
			case "Enter":
				e.preventDefault();
				if (resizable._collapsible) {
					resizable._onResizeStart();
					resizable._onResizeMove(resizable._isCollapsed ? resizable._minSizePx : -resizable._size);
					resizable._onResizeEnd();
				}
		}
	}, [
		isDisabled,
		resizable,
		isHorizontal,
		getRTLMultiplier,
		sign
	]);
	const handleDoubleClick = (0, import_react.useCallback)(() => {
		if (isDisabled || !resizable || !resizable._collapsible) return;
		resizable._onResizeStart();
		resizable._onResizeMove(resizable._isCollapsed ? resizable._minSizePx : -resizable._size);
		resizable._onResizeEnd();
	}, [isDisabled, resizable]);
	(0, import_react.useEffect)(() => {
		return () => {
			if (dragCleanupRef.current) {
				dragCleanupRef.current();
				document.body.style.cursor = "";
				document.body.style.userSelect = "";
			}
		};
	}, []);
	const isCollapsed = resizable?._isCollapsed ?? false;
	const ariaValueNow = resizable ? isCollapsed ? Math.max(resizable._size, resizable._minSizePx) : resizable._size : void 0;
	const ariaValueMin = resizable ? resizable._minSizePx : void 0;
	const ariaValueMax = resizable && resizable._maxSizePx !== Infinity ? resizable._maxSizePx : void 0;
	const ariaValueText = resizable && isCollapsed ? t("@astryx.resizable.collapsed") : void 0;
	return /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("div", {
		ref: useMergedRefs(ref, handleRef),
		role: "separator",
		"aria-orientation": isHorizontal ? "vertical" : "horizontal",
		"aria-valuenow": ariaValueNow,
		"aria-valuemin": ariaValueMin,
		"aria-valuemax": ariaValueMax,
		"aria-valuetext": ariaValueText,
		"aria-label": label,
		"aria-disabled": isDisabled || void 0,
		tabIndex: isDisabled ? -1 : 0,
		onDoubleClick: handleDoubleClick,
		onFocus: () => setIsFocused(true),
		onBlur: () => setIsFocused(false),
		"data-resizing": isDragging || void 0,
		...mergeProps(themeProps("resize-handle"), focusOutlineProps.focusVisible(styles$9.handle, isOverlay && styles$9.overlay, isOverlay && (isHorizontal ? styles$9.overlayHorizontal : styles$9.overlayVertical), !isOverlay && (isHorizontal ? styles$9.horizontal : styles$9.vertical), !isOverlay && !hasDivider && (isHorizontal ? styles$9.noDividerHorizontal : styles$9.noDividerVertical), !isOverlay && hasDivider && isInteracting && !isDragging && styles$9.handleHover, !isOverlay && hasDivider && isDragging && styles$9.handleActive, isDisabled && styles$9.disabled, xstyle), className),
		...props$6,
		onKeyDown: (e) => {
			props$6.onKeyDown?.(e);
			handleKeyDown(e);
		},
		children: [/*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
			...props(styles$9.hitArea, isHorizontal ? styles$9.hitAreaHorizontal : styles$9.hitAreaVertical, hitBiasDir == null ? isHorizontal ? rtlStyles.centerInline("0px") : styles$9.hitAreaCenteredY : isHorizontal ? dynamicStyles$2.hitAreaOffsetX(hitBiasDir) : dynamicStyles$2.hitAreaOffsetY(hitBiasDir), isDisabled && styles$9.disabled),
			onPointerDown: handlePointerDown,
			onPointerEnter: () => setIsHovered(true),
			onPointerLeave: () => {
				if (!isDragging) setIsHovered(false);
			}
		}), children ?? /*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", { ...mergeProps(themeProps("resize-handle-pill"), props(styles$9.pill, isHorizontal ? styles$9.pillHorizontal : styles$9.pillVertical, effectiveSide === "center" ? rtlStyles.centerInline("-50%") : isHorizontal ? dynamicStyles$2.pillOffsetX(effectiveSide === "start" ? -1 : 1) : dynamicStyles$2.pillOffsetY(effectiveSide === "start" ? -1 : 1), isAlwaysVisible ? styles$9.pillVisible : styles$9.pillHidden, isInteracting && !isDragging && styles$9.pillHover, isDragging && styles$9.pillActive)) })]
	});
}
ResizeHandle.displayName = "ResizeHandle";
//#endregion
//#region node_modules/@astryxdesign/core/dist/Link/Link.js
/**
* Base link styles
*/
var styles$8 = {
	base: {
		k1xSpc: "x3nfvp2",
		kGNEyG: "x6s0dn4",
		kOIVth: "x1lsbc85",
		kMv6JI: "xjb2p0i",
		kGuDYH: "x1qlqyl8",
		kLWn49: "x15bjb6t",
		k63SB2: "x1pd3egz",
		kybGjl: "x1hl2dhg x13nosk6",
		kkrTdU: "x1ypdohk x16khyan",
		k1ekBW: "x1mpt4pi",
		kIyJzY: "xuedmi6",
		kAMwcw: "xlr8y92",
		$$css: true
	},
	buttonReset: {
		kWkggS: "xjbqb8w",
		ksu8eU: "xng3xce",
		kmVPX3: "x1717udv",
		kfzvcC: "x67bb7w",
		kVAEAm: "x1n2onr6",
		$$css: true
	},
	hasUnderline: {
		kybGjl: "x1bvjpef",
		$$css: true
	},
	disabled: {
		kkrTdU: "xt0e3qv",
		kSiTet: "xbyyjgo",
		kfzvcC: "x47corl",
		$$css: true
	},
	standalone: {
		kGuDYH: "xjm74w1",
		kLWn49: "xw6l6zx",
		$$css: true
	}
};
/**
* Link color styles — applied to the <a> element so the underline
* and icon colors match the text color set by Text.
*/
var linkColorStyles = {
	primary: {
		kMwMTN: "x1tgivj0 xcunlro",
		$$css: true
	},
	secondary: {
		kMwMTN: "xv1l7n4 x7jm8ul",
		$$css: true
	},
	disabled: {
		kMwMTN: "xnbbluu",
		$$css: true
	},
	placeholder: {
		kMwMTN: "xv1l7n4",
		$$css: true
	},
	accent: {
		kMwMTN: "xjse4m1 x1rfoswn",
		$$css: true
	},
	inherit: {
		kMwMTN: "x1heor9g",
		$$css: true
	}
};
/**
* Click handler for disabled links. The disabled anchor renders without an
* href, so there is no navigation to block in practice; preventDefault is a
* defensive guard against synthetic/programmatic clicks.
*/
function preventDefaultClick(event) {
	event.preventDefault();
}
/**
* A styled anchor link component.
*
* Uses Text internally for typography styling.
* Wrap your app in <Theme> to apply a theme.
*
* @example
* ```
* <Link href="/docs">Documentation</Link>
* <Link href="https://github.com" isExternalLink>GitHub</Link>
* <Link href="/settings" color="secondary">Settings</Link>
* <Link href="/privacy" hasUnderline>Privacy Policy</Link>
* <Link label="Close dialog" href="/home"><Icon icon="x" /></Link>
* <Text type="large">
*   Read our <Link href="/terms" type="inherit">terms</Link> first.
* </Text>
* ```
*/
function Link({ as, label, href, hasUnderline = false, isDisabled = false, isExternalLink = false, newTabLabel: newTabLabelFromProps, target: targetFromProps, onClick, tooltip, isStandalone = false, type = "body", size, weight, color = "accent", display = "inline", maxLines = 0, children, rel: relFromProps, xstyle, className, style, ref, ...props }) {
	const t = useTranslator();
	const newTabLabel = newTabLabelFromProps ?? t("@astryx.link.newTab");
	const LinkComponent = useLinkComponent(as);
	const role = useInteractiveRole({
		href,
		onClick,
		isDisabled
	});
	const { target, rel } = computeTargetAndRel(isExternalLink ? "_blank" : targetFromProps, relFromProps);
	const renderAsButton = role === "button" || role === "inert" && href == null;
	const sharedContent = /*#__PURE__*/ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/*#__PURE__*/ (0, import_jsx_runtime.jsx)(Text, {
		type,
		size,
		weight,
		color,
		display,
		maxLines,
		children
	}), isExternalLink && !renderAsButton && /*#__PURE__*/ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/*#__PURE__*/ (0, import_jsx_runtime.jsx)(Icon, {
		icon: "externalLink",
		size: "xsm",
		color: "inherit"
	}), /*#__PURE__*/ (0, import_jsx_runtime.jsx)(VisuallyHidden, { children: newTabLabel })] })] });
	let linkElement;
	if (renderAsButton) linkElement = /*#__PURE__*/ (0, import_jsx_runtime.jsx)("button", {
		ref,
		type: "button",
		onClick,
		"aria-label": label || void 0,
		"aria-disabled": isDisabled || void 0,
		tabIndex: isDisabled ? -1 : void 0,
		disabled: isDisabled,
		...mergeProps(themeProps("link", { color }), focusOutlineProps.focusVisible(styles$8.base, styles$8.buttonReset, linkColorStyles[color], hasUnderline && styles$8.hasUnderline, isStandalone && styles$8.standalone, isDisabled && styles$8.disabled, xstyle), className, style),
		...props,
		children: sharedContent
	});
	else if (isDisabled) linkElement = /*#__PURE__*/ (0, import_jsx_runtime.jsx)("a", {
		ref,
		onClick: preventDefaultClick,
		"aria-label": label || void 0,
		"aria-disabled": true,
		tabIndex: -1,
		...mergeProps(themeProps("link", { color }), focusOutlineProps.focusVisible(styles$8.base, linkColorStyles[color], hasUnderline && styles$8.hasUnderline, isStandalone && styles$8.standalone, styles$8.disabled, xstyle), className, style),
		...props,
		children: sharedContent
	});
	else linkElement = /*#__PURE__*/ (0, import_jsx_runtime.jsx)(LinkComponent, {
		ref,
		href,
		target,
		rel,
		onClick,
		"aria-label": label || void 0,
		"aria-disabled": isDisabled || void 0,
		tabIndex: isDisabled ? -1 : void 0,
		...mergeProps(themeProps("link", { color }), focusOutlineProps.focusVisible(styles$8.base, linkColorStyles[color], hasUnderline && styles$8.hasUnderline, isStandalone && styles$8.standalone, isDisabled && styles$8.disabled, xstyle), className, style),
		...props,
		children: sharedContent
	});
	if (tooltip) return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Tooltip, {
		content: tooltip,
		placement: "above",
		children: linkElement
	});
	return linkElement;
}
Link.displayName = "Link";
//#endregion
//#region node_modules/@astryxdesign/core/dist/NavMenu/NavMenuContext.js
/**
* @file NavMenuContext.tsx
* @input Uses React createContext/use
* @output Exports NavHeadingCloseContext, NavHeadingMenuContext, and hooks
* @position Context providers; consumed by NavHeadingMenu and NavHeadingMenuItem
*
* SYNC: When modified, update:
* - /packages/core/src/NavMenu/index.ts
*/
/**
* Close callback provided by the nav heading popover.
* NavHeadingMenu reads this to dismiss the popover on item selection
* and on Escape.
*/
var NavHeadingCloseContext = /*#__PURE__*/ (0, import_react.createContext)(null);
NavHeadingCloseContext.displayName = "NavHeadingCloseContext";
/**
* Size and close context provided by NavHeadingMenu to its children.
* Items read this for consistent padding and dismiss-on-click.
*/
var NavHeadingMenuContext = /*#__PURE__*/ (0, import_react.createContext)(null);
NavHeadingMenuContext.displayName = "NavHeadingMenuContext";
//#endregion
//#region node_modules/@astryxdesign/core/dist/Grid/Grid.js
/**
* @file Grid.tsx
* @input Uses React, stylex, spacing tokens
* @output Exports Grid component, GridProps, and GridColumns
* @position Grid component; provides CSS Grid-based layout
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/Grid/Grid.doc.mjs
* - /packages/core/src/Grid/Grid.test.tsx
* - /apps/storybook/stories/Grid.stories.tsx
* - /packages/cli/assets/templates/blocks/components/Grid/ (showcase blocks)
*/
/**
* Grid alignment options for align-items and justify-items.
*/
/**
* Column configuration for Grid.
*
* - `number` — fixed equal-width columns (e.g. `columns={3}`)
* - `object` — responsive columns based on minimum child width:
*   - `minWidth` — minimum width (px) for each column track
*   - `repeat` — `'fill'` (default) preserves empty tracks for consistent widths;
*     `'fit'` collapses empty tracks so items stretch to fill
*   - `max` — caps the maximum number of columns. The grid stretches to 100%
*     of its parent and the columns that are present always fill the row, so a
*     layout collapsing to a single column on mobile stretches to full width
*     (no dead space on the right).
*/
var baseStyles = { grid: {
	k1xSpc: "xrvj5dj",
	$$css: true
} };
var _temp$1 = {
	kJBjZk: "xhij9v2",
	"$$css": true
};
var dynamicStyles$1 = {
	templateColumns: (value) => [{
		kumcoG: value != null ? "xqketvx" : value,
		$$css: true
	}, { "--x-gridTemplateColumns": value != null ? value : void 0 }],
	autoRows: (value) => [_temp$1, { "--x-gridAutoRows": `${value}px` != null ? `${value}px` : void 0 }]
};
var alignStyles = {
	start: {
		kGNEyG: "x7a106z",
		$$css: true
	},
	center: {
		kGNEyG: "x6s0dn4",
		$$css: true
	},
	end: {
		kGNEyG: "xpqajaz",
		$$css: true
	},
	stretch: {
		kGNEyG: "x1qjc9v5",
		$$css: true
	}
};
var justifyStyles = {
	start: {
		kAPf3g: "x619ttb",
		$$css: true
	},
	center: {
		kAPf3g: "x1o2pa38",
		$$css: true
	},
	end: {
		kAPf3g: "x4xo5sw",
		$$css: true
	},
	stretch: {
		kAPf3g: "xl4xnwh",
		$$css: true
	}
};
var gapStyles = {
	"0": {
		kOIVth: "xsn7fz1",
		$$css: true
	},
	"1": {
		kOIVth: "xzye2dw",
		$$css: true
	},
	"2": {
		kOIVth: "x1txdalj",
		$$css: true
	},
	"3": {
		kOIVth: "xjcht0a",
		$$css: true
	},
	"4": {
		kOIVth: "x18g69wz",
		$$css: true
	},
	"5": {
		kOIVth: "x9mgr7n",
		$$css: true
	},
	"6": {
		kOIVth: "x1qh66ti",
		$$css: true
	},
	"8": {
		kOIVth: "x4t41sb",
		$$css: true
	},
	"10": {
		kOIVth: "x3hoi3v",
		$$css: true
	},
	"0.5": {
		kOIVth: "x1lsbc85",
		$$css: true
	},
	"1.5": {
		kOIVth: "x1s4dlld",
		$$css: true
	}
};
var rowGapStyles = {
	"0": {
		khm7nJ: "x6yxi7o",
		$$css: true
	},
	"1": {
		khm7nJ: "x1ngg2t4",
		$$css: true
	},
	"2": {
		khm7nJ: "x1x7z4sm",
		$$css: true
	},
	"3": {
		khm7nJ: "x4olc9o",
		$$css: true
	},
	"4": {
		khm7nJ: "xtx9w7w",
		$$css: true
	},
	"5": {
		khm7nJ: "x1iu6piu",
		$$css: true
	},
	"6": {
		khm7nJ: "xczp1bk",
		$$css: true
	},
	"8": {
		khm7nJ: "xgx0vcf",
		$$css: true
	},
	"10": {
		khm7nJ: "x1xpicb7",
		$$css: true
	},
	"0.5": {
		khm7nJ: "x1tw44j4",
		$$css: true
	},
	"1.5": {
		khm7nJ: "xhq53yo",
		$$css: true
	}
};
var columnGapStyles = {
	"0": {
		k1C7PZ: "x1o57wo1",
		$$css: true
	},
	"1": {
		k1C7PZ: "x1lfs0n9",
		$$css: true
	},
	"2": {
		k1C7PZ: "xak3so",
		$$css: true
	},
	"3": {
		k1C7PZ: "xewh9hi",
		$$css: true
	},
	"4": {
		k1C7PZ: "xty4p9g",
		$$css: true
	},
	"5": {
		k1C7PZ: "x1eqhezk",
		$$css: true
	},
	"6": {
		k1C7PZ: "x3qlgwd",
		$$css: true
	},
	"8": {
		k1C7PZ: "xicv188",
		$$css: true
	},
	"10": {
		k1C7PZ: "x1p37tyl",
		$$css: true
	},
	"0.5": {
		k1C7PZ: "x1kihgfc",
		$$css: true
	},
	"1.5": {
		k1C7PZ: "x1thn6ci",
		$$css: true
	}
};
/**
* Spacing token CSS var names for gap calculation in track-max expressions.
*/
var spacingVarNames = {
	0: "--spacing-0",
	.5: "--spacing-0-5",
	1: "--spacing-1",
	1.5: "--spacing-1-5",
	2: "--spacing-2",
	3: "--spacing-3",
	4: "--spacing-4",
	5: "--spacing-5",
	6: "--spacing-6",
	8: "--spacing-8",
	10: "--spacing-10"
};
/**
* Build a grid-template-columns value that caps the column *count* at `max`
* while still letting the columns that are actually present stretch to fill
* the row.
*
* The cap lives on the track's **min** size, not its max: each track is at
* least `perColumn = (100% - (max-1) * gap) / max`, so more than `max` columns
* can never fit. The track **max** stays `1fr`, so whenever fewer than `max`
* columns fit (most importantly a lone column on mobile) they still grow to
* fill the whole row — no dead space on the right.
*
* The track min is `max(minWidth, perColumn)` so an explicit `minWidth` is
* still honored, wrapped in `min(100%, …)` so a single column on a viewport
* narrower than `minWidth`/`perColumn` shrinks to the container instead of
* overflowing it.
*/
function buildCappedTemplate(minWidth, maxCols, repeatMode, gap, columnGap) {
	const gapVar = columnGap != null ? spacingVarNames[columnGap] : gap != null ? spacingVarNames[gap] : null;
	return `repeat(${repeatMode}, minmax(${`min(100%, max(${minWidth}px, ${gapVar ? `calc((100% - ${maxCols - 1} * var(${gapVar})) / ${maxCols})` : `calc(100% / ${maxCols})`}))`}, 1fr))`;
}
/**
* Grid component for CSS Grid-based layouts.
*
* Supports fixed-column and responsive layouts via the `columns` prop:
* - `columns={3}` — fixed 3-column grid
* - `columns={{minWidth: 280}}` — responsive auto-fill (consistent widths)
* - `columns={{minWidth: 280, repeat: 'fit'}}` — responsive auto-fit (stretch)
* - `columns={{minWidth: 280, max: 4}}` — responsive, capped at 4 columns
*
* @example
* ```
* <Grid columns={3} gap={4}>
*   <Item />
*   <Item />
*   <Item />
* </Grid>
* ```
*/
function Grid({ columns, rowHeight, width, height, maxWidth, minHeight, gap, rowGap, columnGap, align, justify, xstyle, className, style, children, ref, ...props$5 }) {
	let gridTemplateColumns;
	if (typeof columns === "object" && columns != null) {
		const repeatMode = columns.repeat === "fit" ? "auto-fit" : "auto-fill";
		if (columns.max != null && columns.max > 0) gridTemplateColumns = buildCappedTemplate(columns.minWidth, columns.max, repeatMode, gap, columnGap);
		else gridTemplateColumns = `repeat(${repeatMode}, minmax(${columns.minWidth}px, 1fr))`;
	} else if (typeof columns === "number" && columns > 0) gridTemplateColumns = `repeat(${columns}, 1fr)`;
	else gridTemplateColumns = "1fr";
	const inlineStyle = {
		...width != null && { width: typeof width === "number" ? `${width}px` : width },
		...height != null && { height: typeof height === "number" ? `${height}px` : height },
		...maxWidth != null && { maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth },
		...minHeight != null && { minHeight: typeof minHeight === "number" ? `${minHeight}px` : minHeight }
	};
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
		ref,
		...mergeProps(themeProps("grid", {
			columns: typeof columns === "number" ? columns : typeof columns === "object" ? void 0 : void 0,
			gap,
			align,
			justify
		}), props(baseStyles.grid, dynamicStyles$1.templateColumns(gridTemplateColumns), rowHeight != null && dynamicStyles$1.autoRows(rowHeight), gap != null && gapStyles[gap], rowGap != null && rowGapStyles[rowGap], columnGap != null && columnGapStyles[columnGap], align != null && alignStyles[align], justify != null && justifyStyles[justify], xstyle), className, {
			...style,
			...inlineStyle
		}),
		...props$5,
		children
	});
}
Grid.displayName = "Grid";
//#endregion
//#region node_modules/@astryxdesign/core/dist/TextInput/TextInput.js
/**
* @file TextInput.tsx
* @input Uses React, useId, ChangeEvent, Field, Icon, InputGroupContext
* @output Exports TextInput component, TextInputProps
* @position Core implementation; consumed by index.ts, tested by TextInput.test.tsx
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/TextInput/TextInput.doc.mjs (props table, features, implementation notes)
* - /packages/core/src/TextInput/TextInput.test.tsx (tests for new/changed behavior)
* - /packages/core/src/TextInput/index.ts (exports if types change)
* - /apps/storybook/stories/TextInput.stories.tsx (storybook stories)
* - /packages/cli/assets/templates/blocks/components/TextInput/ (showcase blocks)
*/
var sizeStyles$1 = {
	sm: {
		kZKoxP: "x6k0iem",
		$$css: true
	},
	md: {
		kZKoxP: "x1ueg155",
		$$css: true
	},
	lg: {
		kZKoxP: "xssyfek",
		$$css: true
	}
};
/**
* A text input component for collecting user input.
*
* @example
* ```
* <TextInput label="Name" value={name} onChange={setName} />
* <TextInput label="Search" isLabelHidden value={query} onChange={setQuery} />
* ```
*/
function TextInput({ type = "text", label, isLabelHidden = false, description, isOptional = false, isRequired = false, isDisabled = false, isReadOnly = false, disabledMessage, startIcon, status, statusVariant = "attached", size: sizeProp, onChange, changeAction, isLoading = false, value, placeholder, labelTooltip, hasClear = false, hasAutoFocus = false, htmlName, onEnter, onKeyDown, width, xstyle, className, style, ref, ...rest }) {
	const t = useTranslator();
	const isEffectivelyRequired = useResolvedRequired({
		isRequired,
		isOptional
	});
	const size = useSize(sizeProp, "md");
	const id = (0, import_react.useId)();
	const inputLabelID = (0, import_react.useId)();
	const descriptionID = (0, import_react.useId)();
	const statusMessageID = (0, import_react.useId)();
	const inputRef = (0, import_react.useRef)(null);
	const containerRef = (0, import_react.useRef)(null);
	const inputGroup = useInputGroup();
	const [, startTransition] = (0, import_react.useTransition)();
	const [optimisticValue, setOptimisticValue] = (0, import_react.useOptimistic)(value);
	const isBusy = isLoading || optimisticValue !== value;
	const showsDisabledMessage = isDisabled && !!disabledMessage;
	const disabledMessageTooltip = useTooltip({
		placement: "above",
		focusTrigger: "always",
		isEnabled: showsDisabledMessage
	});
	const { statusIcon, describedBy: statusTooltipDescribedBy } = useInputStatusIcon({
		status,
		statusVariant,
		isInGroup: !!inputGroup
	});
	const { ariaLabelledBy, ariaDescribedBy } = getInputARIA(inputLabelID, [
		description ? descriptionID : null,
		!inputGroup && statusVariant !== "tooltip" && status?.message ? statusMessageID : null,
		statusTooltipDescribedBy,
		showsDisabledMessage ? disabledMessageTooltip.describedBy : null
	], inputGroup);
	const handleChange = (e) => {
		if (isDisabled || isReadOnly) return;
		const newValue = e.target.value;
		onChange?.(newValue, e);
		if (changeAction && !e.defaultPrevented) startTransition(async () => {
			setOptimisticValue(newValue);
			await changeAction(newValue, e);
		});
	};
	const handleClear = (0, import_react.useCallback)(() => {
		onChange?.("", null);
		inputRef.current?.focus();
	}, [onChange]);
	const { onClick: handleWrapperClick, onMouseUp: handleWrapperMouseUp } = useInputContainer({
		containerRef,
		inputRef,
		disabled: isDisabled
	});
	const inputWrapper = /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("div", {
		ref: (el) => {
			containerRef.current = el;
			disabledMessageTooltip.ref(el);
		},
		onClick: handleWrapperClick,
		onMouseUp: handleWrapperMouseUp,
		...mergeProps(themeProps("text-input", {
			size,
			status: status?.type ?? null,
			disabled: isDisabled ? "disabled" : null,
			readonly: isReadOnly ? "readonly" : null
		}), props(inputWrapperStyles.base, sizeStyles$1[size], isDisabled && inputWrapperStyles.disabled, status && inputStatusBorderStyles[status.type], status && !isDisabled && inputStatusHoverShadowStyles[status.type], status && inputStatusFocusWithinStyles[status.type], inputGroup && groupStyles.inGroup, xstyle), className, style),
		children: [
			startIcon && renderIconSlot(startIcon, {
				size: "sm",
				color: "secondary"
			}),
			inputGroup && /*#__PURE__*/ (0, import_jsx_runtime.jsx)(VisuallyHidden, {
				id: inputLabelID,
				children: label
			}),
			/*#__PURE__*/ (0, import_jsx_runtime.jsx)("input", {
				...rest,
				ref: useMergedRefs(ref, inputRef),
				id,
				name: isDisabled ? void 0 : htmlName,
				type,
				value: optimisticValue,
				onChange: handleChange,
				onKeyDown: onEnter || onKeyDown ? (e) => {
					if (e.key === "Enter") onEnter?.();
					onKeyDown?.(e);
				} : void 0,
				placeholder,
				disabled: isDisabled && !showsDisabledMessage,
				"aria-disabled": showsDisabledMessage ? "true" : void 0,
				readOnly: isReadOnly || showsDisabledMessage || void 0,
				autoFocus: hasAutoFocus,
				"data-autofocus": hasAutoFocus || void 0,
				"aria-describedby": ariaDescribedBy,
				"aria-required": isEffectivelyRequired ? "true" : void 0,
				"aria-invalid": status?.type === "error" ? "true" : void 0,
				"aria-busy": isBusy || void 0,
				"aria-labelledby": ariaLabelledBy,
				...{
					0: { className: "x1lliihq x98rzlu xeuugli xc342km xng3xce x1717udv x9ynric xjm74w1 x6pjikd xw6l6zx x1tgivj0 xjbqb8w x1a2a7pz xeyghm5" },
					1: { className: "x1lliihq x98rzlu xeuugli xc342km xng3xce x1717udv x9ynric xjm74w1 x6pjikd xw6l6zx x1tgivj0 xjbqb8w x1a2a7pz xeyghm5 xt0e3qv" }
				}[!!isDisabled << 0]
			}),
			hasClear && value !== "" && !isDisabled && !isReadOnly && /*#__PURE__*/ (0, import_jsx_runtime.jsx)(InputClearButton, {
				label: t("@astryx.textInput.clearLabel", { label }),
				onClick: handleClear
			}),
			isBusy && /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Spinner, { size: "sm" }),
			statusIcon
		]
	});
	if (inputGroup) return /*#__PURE__*/ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [inputWrapper, showsDisabledMessage && disabledMessageTooltip.renderTooltip(disabledMessage)] });
	return /*#__PURE__*/ (0, import_jsx_runtime.jsxs)(Field, {
		label,
		isLabelHidden,
		description,
		inputID: id,
		descriptionID: description ? descriptionID : void 0,
		isOptional,
		isRequired,
		isDisabled,
		status: status ? {
			type: status.type,
			message: status.message,
			messageID: status.message ? statusMessageID : void 0
		} : void 0,
		statusVariant,
		labelTooltip,
		width,
		children: [inputWrapper, showsDisabledMessage && disabledMessageTooltip.renderTooltip(disabledMessage)]
	});
}
TextInput.displayName = "TextInput";
//#endregion
//#region node_modules/@astryxdesign/core/dist/Token/TokenLink.js
/**
* @file TokenLink.tsx
* @input Rendered token pieces (icon, label, endContent, remove button) plus
*   container/link styling props and the resolved LinkComponent
* @output Exports TokenLink, the interactive container for the href+onRemove Token variant
* @position Internal to Token; keeps Token.tsx presentational
*
* Token is a presentational component (see
* /internal/eslint-plugin-astryx/presentational-component.js) and must not use
* refs or effects. When a Token has both `href` and `onRemove`, the remove
* <button> must be a sibling of the link (nesting a button inside an anchor is
* invalid HTML — WCAG 4.1.2), so the surface becomes a clickable container that
* delegates to an inner link. That delegation needs refs, so it lives here.
*
* useClickableContainer gives the container middle-click and cmd/ctrl-click
* open-in-new-tab behavior for the link, ignores clicks on nested interactive
* elements (the remove button), and skips activation during text selection.
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/Token/Token.tsx (renders TokenLink for the href+onRemove case)
* - /packages/core/src/Token/Token.test.tsx (tests for delegated behavior)
*/
/**
* Interactive container for a Token that is both a link and removable.
*
* Renders a `<span>` wrapping an invisible inner link and the remove button as
* siblings. useClickableContainer delegates clicks on the surface to the link
* (including middle-click / cmd+click to open in a new tab) while the remove
* button keeps handling its own clicks.
*/
function TokenLink({ ref, href, isDisabled, LinkComponent, linkStyleProps, labelContent, icon, endContent, removeButton, onClick: onClickProp, onMouseUp: onMouseUpProp, ...containerProps }) {
	const containerRef = (0, import_react.useRef)(null);
	const linkRef = (0, import_react.useRef)(null);
	const { onClick, onMouseUp } = useClickableContainer({
		containerRef,
		interactiveRef: linkRef,
		href,
		disabled: isDisabled
	});
	return /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("span", {
		ref: useMergedRefs(ref, containerRef),
		...containerProps,
		onClick: isDisabled ? onClickProp : composeEventHandlers(onClickProp, onClick),
		onMouseUp: isDisabled ? onMouseUpProp : composeEventHandlers(onMouseUpProp, onMouseUp),
		children: [
			icon,
			/*#__PURE__*/ (0, import_jsx_runtime.jsx)(LinkComponent, {
				ref: linkRef,
				href,
				"aria-disabled": isDisabled || void 0,
				...linkStyleProps,
				children: labelContent
			}),
			endContent,
			removeButton
		]
	});
}
TokenLink.displayName = "TokenLink";
//#endregion
//#region node_modules/@astryxdesign/core/dist/Token/Token.js
/**
* @file Token.tsx
* @input Uses React, ReactNode, StyleXStyles
* @output Exports Token component, TokenProps, TokenColor, TokenColorMap types
* @position Core implementation; consumed by index.ts, tested by Token.test.tsx
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/Token/TokenLink.tsx (interactive wrapper for href+onRemove)
* - /packages/core/src/Token/Token.doc.mjs (props table, features, implementation notes)
* - /packages/core/src/Token/Token.test.tsx (tests for new/changed behavior)
* - /packages/core/src/Token/index.ts (exports if types change)
* - /apps/storybook/stories/Token.stories.tsx (storybook stories)
* - /packages/cli/assets/templates/blocks/components/Token/ (showcase blocks)
*/
/**
* Token color type derived from TokenColorMap.
* Extensible via module augmentation of TokenColorMap.
*/
var styles$7 = {
	base: {
		k1xSpc: "x3nfvp2",
		kGNEyG: "x6s0dn4",
		kOIVth: "xzye2dw",
		k8WAf4: "xt970qd",
		kMzoRj: "xc342km",
		ksu8eU: "xng3xce",
		kaIpWk: "xx3sua9",
		kMv6JI: "xjb2p0i",
		kGuDYH: "x141an7d",
		kLWn49: "x1ltkj2j",
		k63SB2: "x1e4wzip",
		khDVqt: "xuxw1ft",
		kybGjl: "x1hl2dhg",
		ks0D6T: "x193iq5w",
		kVQacm: "xb3r6kr",
		$$css: true
	},
	interactive: {
		kkrTdU: "x1ypdohk x16khyan",
		k1ekBW: "x12qzo2w",
		kIyJzY: "xuedmi6",
		kAMwcw: "xlr8y92",
		$$css: true
	},
	disabled: {
		kkrTdU: "xt0e3qv",
		kSiTet: "xbyyjgo",
		kfzvcC: "x47corl",
		$$css: true
	},
	removeButton: {
		k1xSpc: "x3nfvp2",
		kGNEyG: "x6s0dn4",
		kjj79g: "xl56j7k",
		kVAEAm: "x1n2onr6",
		kmVPX3: "x1717udv",
		k71WvV: "xkd40ry",
		kkrTdU: "x1ypdohk x16khyan",
		kaIpWk: "xjspbzw",
		kzqmXN: "x1kky2od",
		kZKoxP: "xlup9mm",
		kMwMTN: "x1heor9g",
		k5JduY: "x1s928wv",
		kwXMNM: "x1j6awrg",
		kv0HGH: "x1xsm0q9",
		$$css: true
	}
};
var sizeStyles = {
	sm: {
		kZKoxP: "xzydfjl",
		kGuDYH: "x141an7d",
		kg3NbH: "xf314gf",
		$$css: true
	},
	md: {
		kZKoxP: "xrmxcn7",
		kg3NbH: "xf314gf",
		$$css: true
	},
	lg: {
		kZKoxP: "x102lyln",
		kg3NbH: "xf314gf",
		$$css: true
	}
};
var colorStyles = {
	default: {
		kWkggS: "x17x4s8c",
		kMwMTN: "x1tgivj0",
		$$css: true
	},
	red: {
		kWkggS: "x1cibrc5",
		kMwMTN: "x1joocv1",
		$$css: true
	},
	orange: {
		kWkggS: "x1e9xt6e",
		kMwMTN: "xm47u9q",
		$$css: true
	},
	yellow: {
		kWkggS: "x1bo7t0x",
		kMwMTN: "xdhq94a",
		$$css: true
	},
	green: {
		kWkggS: "x1sqjeoo",
		kMwMTN: "xltfdvo",
		$$css: true
	},
	teal: {
		kWkggS: "x1jtji5o",
		kMwMTN: "x9x0lbs",
		$$css: true
	},
	cyan: {
		kWkggS: "x1rgj867",
		kMwMTN: "x1txnczv",
		$$css: true
	},
	blue: {
		kWkggS: "x1o0wnni",
		kMwMTN: "x1vvqiwl",
		$$css: true
	},
	purple: {
		kWkggS: "x16i6n6f",
		kMwMTN: "x1m9wyeb",
		$$css: true
	},
	pink: {
		kWkggS: "xnpoty2",
		kMwMTN: "xiuofww",
		$$css: true
	},
	gray: {
		kWkggS: "xspzpui",
		kMwMTN: "xru1t7f",
		$$css: true
	}
};
/**
* A chip/tag component for displaying entities inline.
*
* Renders as a `<span>` by default, `<a>` when `href` is provided, or a
* `<span>` container with an invisible `<button>` when `onClick` is provided.
* The invisible button pattern provides real button semantics for accessibility
* while the container uses `:focus-within` to show focus outlines around the
* entire token. When both `href` and `onRemove` are provided, the same
* container pattern is used with an invisible `<a>` so the remove `<button>`
* renders as a sibling of the link rather than nested inside it.
*
* @example
* ```
* <Token label="Tag" />
* <Token label="Status" color="green" />
* <Token label="Removable" onRemove={() => {}} />
* <Token label="Clickable" onClick={() => {}} />
* <Token label="Link" href="/path" />
* ```
*/
function Token({ label, size = "md", color = "default", icon, isDisabled = false, onRemove, onClick, href, description, endContent, isLabelHidden = false, xstyle, className, style, "data-testid": testId, ref, ...rest }) {
	const t = useTranslator();
	const LinkComponent = useLinkComponent();
	const role = useInteractiveRole({
		href,
		onClick,
		isDisabled
	});
	const effectiveOnClick = onClick ?? (role === "button" ? () => {} : null);
	const removeButton = onRemove != null && /*#__PURE__*/ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": t("@astryx.token.remove", { label }),
		onClick: (e) => {
			e.stopPropagation();
			onRemove(e);
		},
		disabled: isDisabled,
		...focusOutlineProps.focusVisible(styles$7.removeButton),
		children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Icon, {
			icon: "close",
			size: "xsm",
			color: "inherit"
		})
	});
	const content = /*#__PURE__*/ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		icon,
		/*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
			...{
				0: { className: "xb3r6kr xlyipyv xuxw1ft xeuugli" },
				1: { className: "xlyipyv xeuugli x10l6tqk x1i1rx1s xjm9jq1 x1717udv xkdpibf xb3r6kr x1hyvwdk xuxw1ft xc342km" }
			}[!!isLabelHidden << 0],
			children: label
		}),
		endContent,
		removeButton
	] });
	const sharedProps = {
		"data-testid": testId,
		...isLabelHidden ? { "aria-label": label } : {},
		...description != null ? { "aria-description": description } : {}
	};
	if (role === "link") {
		if (onRemove == null) return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(LinkComponent, {
			ref,
			href,
			...mergeProps(themeProps("token", {
				color,
				size
			}), focusOutlineProps.focusVisible(styles$7.base, sizeStyles[size], colorStyles[color], styles$7.interactive, interactionOverlayStyles.backgroundImage, isDisabled && styles$7.disabled, xstyle), className, style),
			...rest,
			...isDisabled ? { "aria-disabled": true } : {},
			...sharedProps,
			children: content
		});
		return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(TokenLink, {
			ref,
			href,
			isDisabled,
			LinkComponent,
			icon,
			endContent,
			removeButton,
			linkStyleProps: { className: "xmper1u x16khyan xln7xf2 x1heor9g x1a2a7pz xb3r6kr xeuugli" },
			labelContent: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
				...{
					0: { className: "xb3r6kr xlyipyv xuxw1ft xeuugli" },
					1: { className: "xlyipyv xeuugli x10l6tqk x1i1rx1s xjm9jq1 x1717udv xkdpibf xb3r6kr x1hyvwdk xuxw1ft xc342km" }
				}[!!isLabelHidden << 0],
				children: label
			}),
			...mergeProps(themeProps("token", {
				color,
				size
			}), focusOutlineProps.focusWithin(styles$7.base, sizeStyles[size], colorStyles[color], styles$7.interactive, interactionOverlayStyles.backgroundImage, isDisabled && styles$7.disabled, xstyle), className, style),
			...rest,
			...sharedProps
		});
	}
	if (effectiveOnClick != null) {
		const handleContainerClick = (e) => {
			if (e.target.closest("button, a")) return;
			effectiveOnClick(e);
		};
		return /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("span", {
			ref,
			onClick: isDisabled ? void 0 : handleContainerClick,
			...mergeProps(themeProps("token", {
				color,
				size
			}), focusOutlineProps.focusWithin(styles$7.base, sizeStyles[size], colorStyles[color], styles$7.interactive, interactionOverlayStyles.backgroundImage, isDisabled && styles$7.disabled, xstyle), className, style),
			...rest,
			...sharedProps,
			children: [
				icon,
				/*#__PURE__*/ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: effectiveOnClick,
					disabled: isDisabled,
					className: "xmper1u x16khyan xln7xf2 x1heor9g x1a2a7pz xb3r6kr xeuugli",
					children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
						...{
							0: { className: "xb3r6kr xlyipyv xuxw1ft xeuugli" },
							1: { className: "xlyipyv xeuugli x10l6tqk x1i1rx1s xjm9jq1 x1717udv xkdpibf xb3r6kr x1hyvwdk xuxw1ft xc342km" }
						}[!!isLabelHidden << 0],
						children: label
					})
				}),
				endContent,
				removeButton
			]
		});
	}
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
		ref,
		...mergeProps(themeProps("token", {
			color,
			size
		}), props(styles$7.base, sizeStyles[size], colorStyles[color], isDisabled && styles$7.disabled, xstyle), className, style),
		...rest,
		...sharedProps,
		children: content
	});
}
Token.displayName = "Token";
//#endregion
//#region node_modules/@astryxdesign/core/dist/DropdownMenu/DropdownMenu.js
/**
* @file DropdownMenu.tsx
* @input Uses React, StyleX, usePopover, Button, Icon, useListFocus
* @output Exports DropdownMenu component
* @position Core implementation; consumed by index.ts
*
* Supports two modes with a single keyboard/focus path:
* - **Data-driven**: pass `items` array (converted to components internally)
* - **Compound-component**: pass JSX children directly
*
* Both modes use useListFocus for DOM-based keyboard navigation.
*
* Initial focus on open follows the input modality: a keyboard open
* (Enter / Space / ArrowDown on the trigger) focuses the first enabled item
* (APG menu-button); a pointer open focuses the menu container itself so no
* item reads as pre-selected, and the first ArrowDown then moves to item 1.
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/DropdownMenu/DropdownMenu.doc.mjs
* - /packages/core/src/DropdownMenu/DropdownMenu.test.tsx
* - /packages/core/src/DropdownMenu/index.ts
* - /apps/storybook/stories/DropdownMenu.stories.tsx
* - /packages/cli/assets/templates/blocks/components/DropdownMenu/ (showcase blocks)
*/
var styles$6 = {
	dropdown: {
		kB7OPa: "x9f619",
		k1xSpc: "x78zum5",
		kXwgrk: "xdt5ytf",
		kOIVth: "x1lsbc85",
		kskxy: "xuyqlj2",
		kORKVm: "x1odjw0f",
		"--_dropdown-menu-radius": "x1fcsqxe",
		"--_dropdown-menu-padding": "xgory14",
		kmVPX3: "x9epnlk",
		kaIpWk: "x1n97fys",
		kSiTet: "x1hc1fzr",
		k1ekBW: "x19991ni",
		kIyJzY: "xuedmi6",
		kAMwcw: "xlr8y92",
		$$css: true
	},
	popover: {
		k7Eaqz: "xrzjruh",
		$$css: true
	},
	popoverCustomWidth: (width) => [{
		k7Eaqz: (typeof width === "number" ? `${width}px` : width) != null ? "xkj4a21" : typeof width === "number" ? `${width}px` : width,
		$$css: true
	}, { "--x-minWidth": ((val) => typeof val === "number" ? val + "px" : val != null ? val : void 0)(typeof width === "number" ? `${width}px` : width) }]
};
/**
* Data-mode shape for one menu row.
*
* The item fields are sourced from `DropdownMenuItemProps` — data mode renders
* through `DropdownMenuItem`, so the two APIs describe the same thing and must
* not drift. Only the fields listed here are part of the data API; add a key to
* the `Pick` to expose more of the item's props to `items`.
*/
/**
* Data-mode shape for a divider row. The compound-mode peer is the
* `DropdownMenuDivider` component, which both modes render.
*/
/**
* A dropdown menu component that displays a list of actionable items.
*
* Supports two modes:
* - **Data-driven**: pass `items` for static menus with optional custom rendering
* - **Compound-component**: pass JSX children for dynamic, stateful, or lazy-loaded menus
*
* Both modes share the same DOM-based keyboard navigation via useListFocus.
*
* @example
* ```
* <DropdownMenu
*   button={{ label: 'Actions' }}
*   items={[
*     { label: 'Edit', onClick: () => handleEdit() },
*     { label: 'Delete', onClick: () => handleDelete() },
*   ]}
* />
* ```
*/
var DEFAULT_BUTTON_I18N_KEY = "@astryx.dropdownMenu.label";
function DropdownMenu({ button: buttonFromProps, isMenuOpen: controlledIsOpen, onOpenChange, menuWidth, onClick, hasChevron = true, placement = "below", alignment = "start", className, style, xstyle, "data-testid": testId, ...props$4 }) {
	const t = useTranslator();
	const button = buttonFromProps ?? { label: t(DEFAULT_BUTTON_I18N_KEY) };
	const items = ("items" in props$4 ? props$4.items : void 0) ?? [];
	const children = props$4.children;
	const { items: _items, children: _children, ...rest } = props$4;
	const menuId = (0, import_react.useId)();
	const menuSize = button.size ?? "md";
	const buttonRef = (0, import_react.useRef)(null);
	const [internalIsOpen, setInternalIsOpen] = (0, import_react.useState)(false);
	const isControlled = controlledIsOpen !== void 0;
	const isOpen = isControlled ? controlledIsOpen : internalIsOpen;
	const handleLayerHide = (0, import_react.useCallback)(() => {
		onOpenChange?.(false);
		if (!isControlled) setInternalIsOpen(false);
		buttonRef.current?.focus();
	}, [isControlled, onOpenChange]);
	const shouldFocusOnOpenRef = (0, import_react.useRef)(false);
	const openModalityRef = (0, import_react.useRef)("keyboard");
	const popover = usePopoverInternal({
		onHide: handleLayerHide,
		onShow: (0, import_react.useCallback)(() => {
			onOpenChange?.(true);
			if (!isControlled) setInternalIsOpen(true);
		}, [isControlled, onOpenChange]),
		hasLightDismiss: true,
		hasCloseButton: false,
		hasAutoFocus: false,
		role: "none"
	});
	const closeMenu = (0, import_react.useCallback)(() => {
		popover.hide();
	}, [popover]);
	const { listRef, handleKeyDown: listNavKeyDown, focusFirst, focusItem, ownsEvent, getItems: getMenuItems } = useListFocus({
		itemSelector: MENU_ITEM_SELECTOR,
		boundarySelector: MENU_BOUNDARY_SELECTOR,
		wrap: false,
		onEscape: closeMenu
	});
	const typeahead = useTypeahead({
		getItemLabels: () => getMenuItems().map((el) => el.textContent),
		onMatch: focusItem,
		getCurrentIndex: () => getMenuItems().findIndex((el) => el === document.activeElement || el.contains(document.activeElement))
	});
	(0, import_react.useEffect)(() => {
		if (isControlled) {
			if (controlledIsOpen && !popover.isOpen) {
				shouldFocusOnOpenRef.current = true;
				popover.show();
			} else if (!controlledIsOpen && popover.isOpen) popover.hide();
		}
	}, [
		controlledIsOpen,
		isControlled,
		popover
	]);
	(0, import_react.useEffect)(() => {
		if (!popover.isOpen || !shouldFocusOnOpenRef.current) return;
		shouldFocusOnOpenRef.current = false;
		requestAnimationFrame(() => {
			if (openModalityRef.current === "pointer" || !focusFirst()) listRef.current?.focus();
			openModalityRef.current = "keyboard";
		});
	}, [
		popover.isOpen,
		focusFirst,
		listRef
	]);
	const listKeyDown = (0, import_react.useCallback)((e) => {
		if (!ownsEvent(e)) return;
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			const focused = document.activeElement;
			if (focused && MENU_ITEM_ROLES.has(focused.getAttribute("role") ?? "")) focused.click();
			return;
		}
		if (e.key === "Tab") {
			closeMenu();
			return;
		}
		if (typeahead.onKeyDown(e)) {
			e.preventDefault();
			return;
		}
		listNavKeyDown(e);
	}, [
		listNavKeyDown,
		closeMenu,
		typeahead,
		ownsEvent
	]);
	const openAndFocus = (0, import_react.useCallback)((modality = "keyboard") => {
		openModalityRef.current = modality;
		shouldFocusOnOpenRef.current = true;
		popover.show();
	}, [popover]);
	const handleButtonClick = (0, import_react.useCallback)((e) => {
		if (popover.wasJustDismissed()) return;
		onClick?.();
		const modality = e.detail === 0 ? "keyboard" : "pointer";
		if (isControlled) {
			if (!controlledIsOpen) openModalityRef.current = modality;
			onOpenChange?.(!controlledIsOpen);
		} else if (popover.isOpen) popover.hide();
		else openAndFocus(modality);
	}, [
		onClick,
		isControlled,
		onOpenChange,
		controlledIsOpen,
		popover,
		openAndFocus
	]);
	const handleButtonKeyDown = (0, import_react.useCallback)((e) => {
		if (!popover.isOpen) {
			if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				openAndFocus();
			}
		}
	}, [popover.isOpen, openAndFocus]);
	const isIconOnly = button.isIconOnly === true;
	const resolvedEndContent = button.endContent ?? (hasChevron && !isIconOnly ? /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Icon, {
		icon: "chevronDown",
		size: "sm",
		color: "inherit"
	}) : void 0);
	const popoverXstyle = menuWidth ? styles$6.popoverCustomWidth(menuWidth) : styles$6.popover;
	const contextValue = (0, import_react.useMemo)(() => ({
		closeMenu,
		menuSize
	}), [closeMenu, menuSize]);
	const menuContent = props$4.items !== void 0 ? renderDropdownItems(items) : children;
	return /*#__PURE__*/ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/*#__PURE__*/ (0, import_jsx_runtime.jsx)(Button, {
		...button,
		ref: (el) => {
			buttonRef.current = el;
			popover.triggerRef(el);
			const consumerRef = button.ref;
			if (typeof consumerRef === "function") consumerRef(el);
			else if (consumerRef) consumerRef.current = el;
		},
		tooltip: isOpen ? void 0 : button.tooltip,
		endContent: resolvedEndContent,
		onClick: handleButtonClick,
		onKeyDown: handleButtonKeyDown,
		"aria-haspopup": "menu",
		"aria-expanded": isOpen,
		"aria-controls": menuId,
		"data-testid": testId
	}), popover.render(/*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
		...rest,
		ref: listRef,
		id: menuId,
		role: "menu",
		tabIndex: -1,
		"aria-label": button.label,
		onKeyDown: listKeyDown,
		...mergeProps(themeProps("dropdown-menu"), props(styles$6.dropdown, xstyle), className, style),
		children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)(DropdownMenuContext, {
			value: contextValue,
			children: menuContent
		})
	}), {
		placement,
		alignment,
		offset: spacingVars["--spacing-1"],
		xstyle: [popoverXstyle, layerAnimations[placement]]
	})] });
}
DropdownMenu.displayName = "DropdownMenu";
//#endregion
//#region node_modules/@astryxdesign/core/dist/MobileNav/MobileNav.js
/**
* @file MobileNav.tsx
* @input Uses React, useEffect, useRef, useCallback, ReactNode, StyleX
* @output Exports MobileNav component and MobileNavProps
* @position Core implementation; consumed by index.ts
*
* Full-height slide-out drawer overlay for mobile navigation.
* The mobile counterpart to SideNav — accepts the same children
* (SideNavSection, SideNavItem, or any ReactNode).
*
* Uses the native `<dialog>` element with `showModal()` for top-layer rendering.
* This eliminates z-index stacking issues — the drawer renders above everything
* without manual z-index management. The browser provides:
* - Top layer promotion (no z-index needed)
* - `::backdrop` pseudo-element
* - Body scroll lock
* - Focus trapping
*
* Escape is owned by the shared dismissal stack (`useLayerDismissal`), so a
* drawer opened over another layer takes the press and nothing behind it
* closes. The native `cancel` event still handles the dismissals the browser
* starts itself, such as the Android back gesture.
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/MobileNav/index.ts (exports if types change)
* - /packages/core/src/Layer/useLayerDismissal.ts (dismissal stack)
* - /packages/core/src/hooks/scrollbarGutter.ts (shared scroll-lock gutter)
* - /packages/cli/assets/templates/blocks/components/MobileNav/ (showcase blocks)
*/
var styles$5 = {
	dialog: {
		kVAEAm: "xixxii4",
		kogj98: "x1ghz6dp",
		kmVPX3: "x1717udv",
		ks0D6T: "x1x1rfll",
		kskxy: "x7ab17h",
		kpwlN0: "x10a8y8t",
		kzqmXN: "xn9wirt",
		kZKoxP: "xtdtrs8",
		kWkggS: "xjbqb8w",
		kVQacm: "x7giv3",
		kZeWKH: "xish69e",
		kFalU9: "x5ve5x3",
		kI3sdo: "x1a2a7pz",
		k1xSpc: "x1s85apg",
		k1ekBW: "xrgi2yo",
		kIyJzY: "x80gvsz",
		kzIqYQ: "xd00j3c",
		$$css: true
	},
	open: {
		k1xSpc: "x78zum5",
		$$css: true
	},
	backdrop: {
		kGyWv1: "xnixb3f",
		kba3nw: "x1abwkk1",
		k5sjJv: "xph5o2a",
		kND0Po: "x167zut7",
		k9an0g: "xft5bk6",
		kb4ib: "x15h3t91",
		kA5Tbj: "x1viac0w",
		$$css: true
	},
	backdropOpen: {
		k5sjJv: "xb3n6bw xxiuuzi",
		$$css: true
	},
	drawer: {
		kVAEAm: "x10l6tqk",
		k87sOh: "x13vifvy",
		krVfgx: "x1ey2m1c",
		k1xSpc: "x78zum5",
		kXwgrk: "xdt5ytf",
		kWkggS: "x10xzikg",
		kB7OPa: "x9f619",
		kVQacm: "xb3r6kr",
		k1ekBW: "x11xpdln",
		kIyJzY: "x80gvsz",
		kAMwcw: "xlr8y92",
		kI3sdo: "x1a2a7pz",
		k6CgDc: "xzg1mie",
		$$css: true
	},
	drawerStart: {
		kLqNvP: "x1o0tod",
		ke9TFa: "xw8tdv1",
		k8ry5P: "x18b5jzi",
		kBCPoo: "x1gejf6u",
		k3aq6I: "x5i6ehr xttggg",
		$$css: true
	},
	drawerStartOpen: {
		k3aq6I: "xbryuvx x6mt36l x14gflnl",
		$$css: true
	},
	drawerEnd: {
		kt4wiu: "xtijo5x",
		k2ei4v: "xgbv0en",
		kVhnKS: "x1t7ytsu",
		kGJrpR: "x1j92z86",
		k3aq6I: "xumwmo6 x1df3fe5",
		$$css: true
	},
	drawerEndOpen: {
		k3aq6I: "xbryuvx x1yqmsfc x1lymnkk",
		$$css: true
	},
	headerText: {
		keTefX: "x11g1kdw",
		$$css: true
	}
};
var _temp = {
	kzqmXN: "xn9wirt",
	ks0D6T: "xf68679",
	"$$css": true
};
var dynamicStyles = { width: (w) => [_temp, { "--x-maxWidth": ((val) => typeof val === "number" ? val + "px" : val != null ? val : void 0)(`${w}px`) }] };
/** Longest the drawer will wait before closing, however long the hold is. */
var MAX_CLOSE_DELAY_MS = 250;
/** Fraction of the hold to close at, so the close never lands on its boundary. */
var CLOSE_WITHIN_HOLD = .6;
/**
* Shortest duration in a `transition-duration` list, in ms; null if unreadable.
*
* Browsers serialise computed `<time>` values in seconds — an authored `410ms`
* reads back as `"0.41s"` and a list as `"0.41s, 0.12s"` — so the seconds branch
* is the one that runs outside tests. jsdom echoes an inline `250ms` back as-is
* and never resolves `var()`, so both units and the unreadable case are covered
* directly in MobileNavCloseTiming.test.ts rather than through the component.
*
* @internal Exported for unit tests.
*/
function parseShortestDurationMs(value) {
	const durations = value.split(",").map((part) => {
		const trimmed = part.trim();
		const ms = Number.parseFloat(trimmed);
		if (!Number.isFinite(ms)) return null;
		return trimmed.endsWith("ms") ? ms : trimmed.endsWith("s") ? ms * 1e3 : null;
	}).filter((ms) => ms !== null);
	return durations.length ? Math.min(...durations) : null;
}
/**
* How long to wait before closing the native dialog.
*
* The drawer is only rendered for as long as its `display` transition runs, and
* closing an unrendered modal dialog is what leaves the page inert (#4290). So
* the close has to land inside that hold. The hold is `--duration-medium`,
* which themes rewrite — the shipped y2k theme sets it to exactly 250ms — so
* read the hold in effect rather than assuming it.
*/
function resolveCloseDelay(dialog) {
	const cap = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : MAX_CLOSE_DELAY_MS;
	const hold = parseShortestDurationMs(window.getComputedStyle(dialog).transitionDuration);
	if (hold === null) return cap;
	return hold <= 0 ? 0 : Math.min(cap, hold * CLOSE_WITHIN_HOLD);
}
/**
* A slide-out drawer overlay for mobile navigation.
*
* The mobile counterpart to SideNav. Renders a full-height drawer that slides
* in from the start (left in LTR) or end (right in LTR) edge of the viewport,
* with a semi-transparent backdrop behind it.
*
* Uses the native `<dialog>` element with `showModal()` for top-layer rendering,
* which provides built-in focus trapping, body scroll lock, and `::backdrop`.
* No manual z-index needed — the browser's top layer handles stacking.
*
* When used inside AppShell, `isOpen` and `onOpenChange` are managed
* automatically via context. When used standalone, provide them as props.
*
* @example
* ```
* <AppShell mobileNav={
*   <MobileNav header="Navigation">
*     <SideNavItem label="Home" href="/" />
*   </MobileNav>
* }>
* <MobileNav isOpen={isOpen} onOpenChange={setIsOpen} header="Navigation">
*   <SideNavItem label="Home" href="/" />
* </MobileNav>
* ```
*/
function MobileNav({ isOpen: isOpenProp, onOpenChange: onOpenChangeProp, children, header, width = 320, side = "auto", label, "data-testid": testId, xstyle, className, style, onClick: onClickProp, ref, ...rest }) {
	const t = useTranslator();
	const appShellMobile = useAppShellMobile();
	const isOpen = isOpenProp ?? appShellMobile.isMobileNavOpen;
	const fallbackId = (0, import_react.useId)();
	const dialogId = appShellMobile.mobileNavId || fallbackId;
	const onOpenChange = (0, import_react.useMemo)(() => onOpenChangeProp ?? ((open) => {
		if (open) appShellMobile.openMobileNav();
		else appShellMobile.closeMobileNav();
	}), [onOpenChangeProp, appShellMobile]);
	const dialogRef = (0, import_react.useRef)(null);
	const closeTimeoutRef = (0, import_react.useRef)(null);
	const gutterRef = (0, import_react.useRef)(null);
	const releaseGutter = (0, import_react.useCallback)(() => {
		if (gutterRef.current) {
			gutterRef.current.release();
			gutterRef.current = null;
		}
	}, []);
	const [resolvedSide, setResolvedSide] = (0, import_react.useState)(side === "auto" ? "end" : side);
	(0, import_react.useEffect)(() => {
		if (!isOpen) return;
		if (side === "auto") {
			const trigger = document.activeElement;
			if (trigger && trigger !== document.body) {
				const rect = trigger.getBoundingClientRect();
				const triggerCenter = rect.left + rect.width / 2;
				setResolvedSide(triggerCenter < window.innerWidth / 2 ? "start" : "end");
			}
		} else setResolvedSide(side);
	}, [isOpen, side]);
	(0, import_react.useEffect)(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;
		if (isOpen) {
			gutterRef.current ??= holdScrollbarGutter(document.documentElement);
			if (!dialog.open) dialog.showModal();
			document.documentElement.style.overflow = "clip";
			gutterRef.current.settle();
		} else if (dialog.open) {
			document.documentElement.style.overflow = "";
			releaseGutter();
			closeTimeoutRef.current = setTimeout(() => {
				dialog.close();
			}, resolveCloseDelay(dialog));
		}
		return () => {
			if (closeTimeoutRef.current) {
				clearTimeout(closeTimeoutRef.current);
				closeTimeoutRef.current = null;
			}
			document.documentElement.style.overflow = "";
			releaseGutter();
		};
	}, [isOpen, releaseGutter]);
	(0, import_react.useEffect)(() => {
		const dialog = dialogRef.current;
		return () => {
			if (dialog?.open) dialog.close();
		};
	}, []);
	const { shouldDismissOnCloseRequest } = useLayerDismissal({
		isActive: isOpen,
		onDismiss: () => onOpenChange(false)
	});
	const handleCancel = (0, import_react.useCallback)((event) => {
		event.preventDefault();
		if (!shouldDismissOnCloseRequest()) return;
		onOpenChange(false);
	}, [onOpenChange, shouldDismissOnCloseRequest]);
	const handleDialogClick = (0, import_react.useCallback)((event) => {
		if (event.target === event.currentTarget) onOpenChange(false);
	}, [onOpenChange]);
	const isStart = resolvedSide === "start";
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)("dialog", {
		ref: useMergedRefs(ref, dialogRef),
		id: dialogId,
		...mergeProps(themeProps("mobile-nav", { side: resolvedSide }), props(styles$5.dialog, overlayPaddingReset.reset, isOpen && styles$5.open, styles$5.backdrop, isOpen && styles$5.backdropOpen, xstyle), className, style),
		...rest,
		"data-testid": testId,
		"aria-label": label ?? (typeof header === "string" ? header : t("@astryx.mobileNav.navigation")),
		onClick: composeEventHandlers(onClickProp, handleDialogClick),
		onCancel: handleCancel,
		children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)(LayerDepthProvider, { children: /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("div", {
			tabIndex: -1,
			...props(styles$5.drawer, dynamicStyles.width(width), isStart && styles$5.drawerStart, isStart && isOpen && styles$5.drawerStartOpen, !isStart && styles$5.drawerEnd, !isStart && isOpen && styles$5.drawerEndOpen),
			children: [/*#__PURE__*/ (0, import_jsx_runtime.jsxs)("div", {
				...{
					0: { className: "x78zum5 x6s0dn4 x1qughib x1k15mir xf314gf x2lah0s x92x3c3 x1q0q8m5 xw8gpjh" },
					1: { className: "x78zum5 x6s0dn4 x1k15mir xf314gf x2lah0s x92x3c3 x1q0q8m5 xw8gpjh x13a6bvl" }
				}[!!!header << 0],
				children: [typeof header === "string" ? /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Heading, {
					level: 2,
					xstyle: styles$5.headerText,
					children: header
				}) : header ?? null, /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					label: t("@astryx.mobileNav.closeNavigation"),
					icon: /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Icon, {
						icon: "close",
						color: "inherit"
					}),
					onClick: () => onOpenChange(false),
					isIconOnly: true
				})]
			}), /*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
				className: "x98rzlu x1odjw0f x6ikm8r xish69e xx69xxh xf314gf xce4md1",
				children
			})]
		}) })
	});
}
MobileNav.displayName = "MobileNav";
//#endregion
//#region node_modules/@astryxdesign/core/dist/NavItem/navItemStyles.stylex.js
/**
* Base styles shared by all nav item components.
* Apply as a foundation and override specific properties as needed.
*
* @example
* ```
* import {navItemStyles} from '@astryxdesign/core/navItemStyles';
*
* const styles = stylex.create({
*   indented: { paddingInlineStart: spacingVars['--spacing-6'] },
* });
*
* <a {...stylex.props(navItemStyles.item, styles.indented)}>
*   Dashboard
* </a>
* ```
*/
var navItemStyles = {
	item: {
		k1xSpc: "x78zum5",
		kGNEyG: "x6s0dn4",
		kOIVth: "x1txdalj",
		kzqmXN: "xh8yej3",
		kZKoxP: "x1ueg155",
		kg3NbH: "xf314gf",
		k8WAf4: "xt970qd",
		kaIpWk: "xh6dtrn",
		kMzoRj: "xc342km",
		ksu8eU: "xng3xce",
		kWkggS: "xjbqb8w",
		kMwMTN: "x1tgivj0",
		kybGjl: "x1hl2dhg",
		kkrTdU: "x1ypdohk x16khyan",
		kMv6JI: "xjb2p0i",
		kGuDYH: "xcr08ib",
		k63SB2: "x1sodnla",
		kLWn49: "x1kq96og",
		k9WMMc: "x1yc453h",
		kB7OPa: "x9f619",
		$$css: true
	},
	selected: {
		kWkggS: "x17x4s8c x1jzqe4",
		kMwMTN: "x1k5gbb1",
		k63SB2: "x1e4wzip",
		kRL5z6: "xcu6dpe x1d42zcn",
		kSReZ0: "xjtnuge x1vo6n7o",
		$$css: true
	},
	disabled: {
		kMwMTN: "xnbbluu",
		kkrTdU: "xt0e3qv",
		kfzvcC: "x47corl",
		$$css: true
	},
	sm: {
		kZKoxP: "x6k0iem",
		kg3NbH: "x7a5moj",
		$$css: true
	},
	md: {
		kZKoxP: "x1ueg155",
		kg3NbH: "xf314gf",
		$$css: true
	},
	lg: {
		kZKoxP: "xssyfek",
		kg3NbH: "xf314gf",
		$$css: true
	}
};
//#endregion
//#region node_modules/@astryxdesign/core/dist/SideNav/SideNavCollapseContext.js
/**
* @file SideNavCollapseContext.ts
* @input React createContext, use
* @output Exports SideNavCollapseContext and useSideNavCollapse hook
* @position Internal context for sidenav collapse state
*
* Provides collapse state to SideNavCollapseButton and other
* sidenav children. Set by SideNav when isCollapsible is true.
* A button rendered outside the SideNav tree is out of context's reach and
* takes the controlled `collapsible` config as a prop instead.
*/
/** Object form of SideNav's `collapsible` prop. */
/**
* The controlled form: the consumer holds the state, so it can be handed to
* both SideNav and a SideNavCollapseButton rendered outside it.
*/
/**
* @deprecated Pass the same controlled `collapsible` config to SideNav and to
* the out-of-tree SideNavCollapseButton instead. The state then reaches the
* button through props rather than through a ref.
*/
var SideNavCollapseContext = /*#__PURE__*/ (0, import_react.createContext)({
	isCollapsed: false,
	toggle: () => {},
	isCollapsible: false
});
SideNavCollapseContext.displayName = "SideNavCollapseContext";
/**
* Read the sidenav collapse state from context.
* Returns { isCollapsed, toggle, isCollapsible }.
* When used outside a sidenav with isCollapsible, isCollapsible is false.
*/
function useSideNavCollapse() {
	return (0, import_react.use)(SideNavCollapseContext);
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/SideNav/SideNavCollapseButton.js
/**
* @file SideNavCollapseButton.tsx
* @input Uses React, StyleX, SideNavCollapseContext, Icon
* @output Exports SideNavCollapseButton component
* @position Composable toggle button for sidenav collapse
*
* Place inside SideNav (reads context automatically) or outside
* (pass the same controlled `collapsible` config both get).
*
* SYNC: When modified, update:
* - /packages/core/src/SideNav/SideNav.doc.mjs
* - /packages/core/src/SideNav/index.ts
* - /packages/cli/assets/templates/blocks/components/SideNav/ (showcase blocks)
*/
var styles$4 = {
	chevronMirror: {
		k1xSpc: "x78zum5",
		kGNEyG: "x6s0dn4",
		kjj79g: "xl56j7k",
		$$css: true
	},
	chevron: {
		k1xSpc: "x3nfvp2",
		kGNEyG: "x6s0dn4",
		k1ekBW: "x11xpdln",
		kIyJzY: "xuedmi6 x12w9bfk",
		kAMwcw: "xlr8y92",
		$$css: true
	},
	chevronCollapsed: {
		k3aq6I: "x19jd1h0",
		$$css: true
	}
};
/**
* Composable toggle button for sidenav collapse.
*
* Place anywhere inside SideNav (header, topContent, footer, footerIcons)
* and it reads collapse state from context automatically. For placement
* outside the sidenav (e.g. in TopNav or content area), hold the state and
* hand the same `collapsible` config to both.
*
* @example
* ```
* <SideNav isCollapsible footerIcons={<SideNavCollapseButton />}>
*   ...
* </SideNav>
* ```
*
* @example
* ```
* const [isCollapsed, setIsCollapsed] = useState(false);
* const collapsible = {isCollapsed, onCollapsedChange: setIsCollapsed};
* <TopNav endContent={<SideNavCollapseButton collapsible={collapsible} />} />
* <SideNav collapsible={{...collapsible, hasButton: false}}>...</SideNav>
* ```
*/
function SideNavCollapseButton({ ref, collapsible, handleRef, label, size, children, onClick: onClickProp, ...props$3 }) {
	const t = useTranslator();
	const { isCollapsed, toggle, isCollapsible } = useSideNavCollapseState(collapsible, handleRef);
	const { isMobile } = useAppShellMobile();
	if (!isCollapsible || isMobile) return null;
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Button, {
		ref,
		label: label ?? (isCollapsed ? t("@astryx.sideNavCollapseButton.expandSidebar") : t("@astryx.sideNavCollapseButton.collapseSidebar")),
		variant: "ghost",
		size,
		...props$3,
		onClick: composeEventHandlers(onClickProp, toggle),
		icon: children ?? /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
			...props(styles$4.chevronMirror, rtlStyles.mirror),
			children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Icon, {
				icon: "chevronLeft",
				size: "sm",
				color: "inherit",
				xstyle: [styles$4.chevron, isCollapsed && styles$4.chevronCollapsed]
			})
		}),
		isIconOnly: true
	});
}
SideNavCollapseButton.displayName = "SideNavCollapseButton";
function useSideNavCollapseState(collapsible, handleRef) {
	const contextCollapseState = useSideNavCollapse();
	const { isCollapsed, onCollapsedChange } = collapsible ?? {};
	const toggleCollapsible = (0, import_react.useCallback)(() => onCollapsedChange?.(!isCollapsed), [isCollapsed, onCollapsedChange]);
	const toggleHandle = (0, import_react.useCallback)(() => {
		handleRef?.current?.getCollapseState()?.toggle();
	}, [handleRef]);
	if (collapsible != null) return {
		isCollapsed: isCollapsed ?? false,
		toggle: toggleCollapsible,
		isCollapsible: true
	};
	if (handleRef == null) return contextCollapseState;
	const externalCollapseState = handleRef.current?.getCollapseState() ?? null;
	return {
		isCollapsed: externalCollapseState?.isCollapsed ?? false,
		toggle: toggleHandle,
		isCollapsible: externalCollapseState?.isCollapsible ?? true
	};
}
//#endregion
//#region node_modules/@astryxdesign/core/dist/SideNav/SideNav.js
/**
* @file SideNav.tsx
* @input Uses React, HTMLAttributes, ReactNode, StyleX
* @output Exports SideNav component and SideNavProps
* @position Core implementation; consumed by index.ts, tested by SideNav.test.tsx
*
* Sidebar navigation container with five zones: header + topContent (sticky together),
* children (scrollable), footer, and footerIcons (sticky bottom).
*
* Supports optional resize via drag handle at the inline-end edge.
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/SideNav/SideNav.doc.mjs
* - /packages/core/src/SideNav/SideNav.test.tsx
* - /packages/core/src/SideNav/index.ts
* - /apps/storybook/stories/SideNav.stories.tsx
* - /packages/cli/assets/templates/blocks/components/SideNav/ (showcase blocks)
*/
/** Width below which dragging collapses the sidebar (when collapsible). */
var COLLAPSE_THRESHOLD = 160;
/**
* `collapsible` and `resizable` can each carry collapse state, so they are
* normalized here into one config with one owner — two independently
* initialized copies of the same boolean is what rendered an expanded nav at
* width 0 in #4790. `resizable` is the superset, so its keys win.
*/
function resolveCollapseConfig(collapsible, resizable) {
	const fromCollapsible = typeof collapsible === "object" ? collapsible : {};
	const fromResizable = typeof resizable === "object" ? resizable : {};
	const resizableCarriesCollapse = fromResizable.defaultIsCollapsed !== void 0 || fromResizable.isCollapsed !== void 0 || fromResizable.onCollapseChange !== void 0;
	return {
		isCollapsible: !!collapsible || resizableCarriesCollapse,
		defaultIsCollapsed: (resizableCarriesCollapse ? fromResizable.defaultIsCollapsed : fromCollapsible.defaultIsCollapsed) ?? false,
		isCollapsed: resizableCarriesCollapse ? fromResizable.isCollapsed : fromCollapsible.isCollapsed,
		onCollapsedChange: resizableCarriesCollapse ? fromResizable.onCollapseChange : fromCollapsible.onCollapsedChange,
		conflict: describeCollapseConflict(fromCollapsible, fromResizable)
	};
}
/**
* Names the keys that address the same collapse state on both props, and
* which one won. Silent for the common non-overlapping combinations —
* `collapsible: true` alongside a resize config is not a conflict.
*/
function describeCollapseConflict(collapsible, resizable) {
	const collapsibleKeys = [
		collapsible.defaultIsCollapsed !== void 0 && "defaultIsCollapsed",
		collapsible.isCollapsed !== void 0 && "isCollapsed",
		collapsible.onCollapsedChange !== void 0 && "onCollapsedChange"
	].filter((key) => key !== false);
	const resizableKeys = [
		resizable.defaultIsCollapsed !== void 0 && "defaultIsCollapsed",
		resizable.isCollapsed !== void 0 && "isCollapsed",
		resizable.onCollapseChange !== void 0 && "onCollapseChange"
	].filter((key) => key !== false);
	if (collapsibleKeys.length === 0 || resizableKeys.length === 0) return null;
	return `${collapsibleKeys.map((key) => `collapsible.${key}`).join(", ")} and ${resizableKeys.map((key) => `resizable.${key}`).join(", ")} address the same collapse state. resizable wins; the collapsible ${collapsibleKeys.length === 1 ? "value is" : "values are"} ignored.`;
}
var styles$3 = {
	root: {
		k1xSpc: "x78zum5",
		kXwgrk: "xdt5ytf",
		kZKoxP: "x5yr21d",
		kzqmXN: "x1hfn5x7",
		kWkggS: "xgcd1z6",
		kB7OPa: "x9f619",
		kVQacm: "xb3r6kr",
		$$css: true
	},
	rootCollapsed: {
		kzqmXN: "xhgvbfk",
		$$css: true
	},
	topbar: {
		k1xSpc: "x78zum5",
		kXwgrk: "x1q0g3np",
		kGNEyG: "x6s0dn4",
		kjj79g: "x1qughib",
		kZKoxP: "xsdox4t",
		kzqmXN: "xh8yej3",
		kWkggS: "xgcd1z6",
		kB7OPa: "x9f619",
		kVQacm: "xb3r6kr",
		$$css: true
	}
};
/**
* Cascaded to the icon rows through `SizeContext` so the built-in collapse
* button and the consumer's `footerIcons` come out one height. An explicit
* `size` on a child still wins.
*/
var FOOTER_ICON_SIZE = "sm";
/**
* Sidebar navigation container for application pages.
*
* Five vertical zones: sticky header + action area at top,
* scrollable nav content in the middle, and sticky footer + icon bar at bottom.
*
* @example
* ```
* <SideNav
*   header={<SideNavHeading heading="My App" headingHref="/" />}
*   topContent={<Button label="Create new" variant="primary" />}>
*   <SideNavSection heading="Main">
*     <SideNavItem label="Dashboard" isSelected href="/dashboard" />
*     <SideNavItem label="Projects" href="/projects" />
*   </SideNavSection>
* </SideNav>
* ```
*/
function SideNav({ header, topContent, children, footer, footerIcons, collapsible = false, resizable = false, xstyle, className, style, "data-testid": testId, ref, handleRef, ...props$2 }) {
	const t = useTranslator();
	const hasCollapseButton = (typeof collapsible === "object" ? collapsible : {}).hasButton ?? true;
	const resizableConfig = typeof resizable === "object" ? resizable : {};
	const isResizable = !!resizable;
	const collapseConfig = resolveCollapseConfig(collapsible, resizable);
	const { isCollapsible, onCollapsedChange } = collapseConfig;
	useDevWarning("SideNav", collapseConfig.conflict ?? "", collapseConfig.conflict != null);
	const mergedNavRef = useMergedRefs(ref, (0, import_react.useRef)(null));
	const collapseStateRef = (0, import_react.useRef)({
		isCollapsed: false,
		toggle: () => {},
		isCollapsible
	});
	const resizableHook = useResizable({
		defaultSize: resizableConfig.defaultWidth ?? 260,
		minSizePx: resizableConfig.minWidth ?? 180,
		maxSizePx: resizableConfig.maxWidth ?? 480,
		collapsible: isCollapsible,
		collapsedSize: COLLAPSE_THRESHOLD,
		autoSaveId: resizableConfig.autoSaveId,
		defaultIsCollapsed: collapseConfig.defaultIsCollapsed,
		isCollapsed: collapseConfig.isCollapsed,
		onSizeChange: resizableConfig.onWidthChange,
		onCollapseChange: onCollapsedChange
	});
	const collapsed = resizableHook.isCollapsed;
	const toggle = (0, import_react.useCallback)(() => {
		const next = !collapsed;
		collapseStateRef.current = {
			...collapseStateRef.current,
			isCollapsed: next
		};
		if (next) resizableHook.collapse();
		else resizableHook.expand();
	}, [collapsed, resizableHook]);
	const showResizeHandle = isResizable && !collapsed;
	collapseStateRef.current = {
		isCollapsed: collapsed,
		toggle,
		isCollapsible
	};
	const collapseContext = {
		isCollapsed: collapsed,
		toggle,
		isCollapsible
	};
	(0, import_react.useImperativeHandle)(handleRef, () => ({ getCollapseState: () => collapseStateRef.current }), []);
	const renderMode = useSideNavRenderMode();
	if (renderMode === "topbar") return /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("div", {
		"data-testid": testId,
		...mergeProps(themeProps("side-nav", { mode: "topbar" }), props(styles$3.topbar, xstyle), className, style),
		children: [header, /*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
			className: "x78zum5 x6s0dn4 xzye2dw xvc5jky",
			children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)(SizeProvider, {
				value: FOOTER_ICON_SIZE,
				children: footerIcons
			})
		})]
	});
	const hasDrawerFooter = !!(footer || footerIcons);
	if (renderMode === "drawer") return /*#__PURE__*/ (0, import_jsx_runtime.jsxs)(MobileNav, {
		header,
		"data-testid": testId,
		xstyle,
		className,
		style,
		...props$2,
		children: [
			topContent,
			children,
			hasDrawerFooter && /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("div", {
				className: "x78zum5 xdt5ytf xr1yuqi x1txdalj x1xye8es",
				children: [footer, footerIcons && /*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
					className: "x78zum5 x6s0dn4 xzye2dw",
					children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)(SizeProvider, {
						value: FOOTER_ICON_SIZE,
						children: footerIcons
					})
				})]
			})
		]
	});
	if (renderMode === "drawer-content") return /*#__PURE__*/ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		topContent,
		children,
		hasDrawerFooter && /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("div", {
			className: "x78zum5 xdt5ytf xr1yuqi x1txdalj x1xye8es",
			children: [footer, footerIcons && /*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
				className: "x78zum5 x6s0dn4 xzye2dw",
				children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)(SizeProvider, {
					value: FOOTER_ICON_SIZE,
					children: footerIcons
				})
			})]
		})
	] });
	const hasStickyTop = !!(header || topContent);
	const hasStickyBottom = !!(footer || footerIcons);
	const showCollapseButton = isCollapsible && hasCollapseButton;
	const resizableNavStyle = isResizable ? {
		...style ?? {},
		width: collapsed ? void 0 : resizableHook.size
	} : style;
	const navElement = /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("nav", {
		ref: mergedNavRef,
		role: "navigation",
		"aria-label": t("@astryx.sideNav.label"),
		"data-testid": testId,
		...mergeProps(themeProps("side-nav"), props(styles$3.root, collapsed && styles$3.rootCollapsed, xstyle), className, resizableNavStyle),
		...props$2,
		children: [
			hasStickyTop && /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("div", {
				...{
					0: { className: "x78zum5 xdt5ytf x2lah0s x7wzq59 x13vifvy x1vjfegm xgcd1z6 x1xye8es x1wesfrj xf314gf x1txdalj" },
					1: { className: "x78zum5 xdt5ytf x2lah0s x7wzq59 x13vifvy x1vjfegm xgcd1z6 x1xye8es x1wesfrj xf314gf x1txdalj x6s0dn4" }
				}[!!collapsed << 0],
				children: [header, topContent && /*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", { children: topContent })]
			}),
			/*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
				...{
					0: { className: "x98rzlu x1odjw0f x6ikm8r xf314gf x1xye8es x1wesfrj" },
					4: { className: "x98rzlu x1odjw0f x6ikm8r xf314gf x78zum5 xdt5ytf x6s0dn4 x1xye8es x1wesfrj" },
					2: { className: "x98rzlu x1odjw0f x6ikm8r xf314gf xfsso4q x1wesfrj" },
					6: { className: "x98rzlu x1odjw0f x6ikm8r xf314gf x78zum5 xdt5ytf x6s0dn4 xfsso4q x1wesfrj" },
					1: { className: "x98rzlu x1odjw0f x6ikm8r xf314gf x1xye8es xy143xn" },
					5: { className: "x98rzlu x1odjw0f x6ikm8r xf314gf x78zum5 xdt5ytf x6s0dn4 x1xye8es xy143xn" },
					3: { className: "x98rzlu x1odjw0f x6ikm8r xf314gf xfsso4q xy143xn" },
					7: { className: "x98rzlu x1odjw0f x6ikm8r xf314gf x78zum5 xdt5ytf x6s0dn4 xfsso4q xy143xn" }
				}[!!collapsed << 2 | !!hasStickyTop << 1 | !!hasStickyBottom << 0],
				children
			}),
			(hasStickyBottom || showCollapseButton) && /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("div", {
				...{
					0: { className: "x78zum5 xdt5ytf x2lah0s xr1yuqi x7wzq59 x1ey2m1c xgcd1z6 x1txdalj xf314gf xfsso4q x1wesfrj" },
					1: { className: "x78zum5 xdt5ytf x2lah0s xr1yuqi x7wzq59 x1ey2m1c xgcd1z6 x1txdalj xf314gf x1wesfrj xexx8yu x6s0dn4" }
				}[!!collapsed << 0],
				children: [footer, /*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
					...{
						0: { className: "x78zum5 x6s0dn4 xzye2dw" },
						1: { className: "x78zum5 x6s0dn4 xzye2dw x3ieub6" }
					}[!!collapsed << 0],
					children: /*#__PURE__*/ (0, import_jsx_runtime.jsxs)(SizeProvider, {
						value: FOOTER_ICON_SIZE,
						children: [showCollapseButton && /*#__PURE__*/ (0, import_jsx_runtime.jsx)(SideNavCollapseButton, {}), footerIcons]
					})
				})]
			})
		]
	});
	const content = showResizeHandle ? /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("div", {
		className: "x1n2onr6 x78zum5 x2lah0s x5yr21d",
		children: [navElement, /*#__PURE__*/ (0, import_jsx_runtime.jsx)(ResizeHandle, {
			"data-testid": "astryx-sidenav-resize-handle",
			direction: "horizontal",
			position: "overlay",
			pillPlacement: "end",
			isAlwaysVisible: false,
			resizable: resizableHook.props,
			label: t("@astryx.sideNav.resizeSidebar")
		})]
	}) : navElement;
	if (isCollapsible) return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(SideNavCollapseContext, {
		value: collapseContext,
		children: content
	});
	return content;
}
SideNav.displayName = "SideNav";
//#endregion
//#region node_modules/@astryxdesign/core/dist/SideNav/SideNavHeading.js
/**
* @file SideNavHeading.tsx
* @input Uses React, useRef, useCallback, ReactNode, StyleX, usePopover
* @output Exports SideNavHeading component and SideNavHeadingProps
* @position Core implementation; used inside SideNav header slot
*
* Product/suite/account heading with smart interaction boundary logic.
* Composes usePopover internally when menu prop is provided.
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/SideNav/SideNav.doc.mjs
* - /packages/core/src/SideNav/SideNav.test.tsx
* - /packages/core/src/SideNav/index.ts
* - /apps/storybook/stories/SideNav.stories.tsx
* - /packages/cli/assets/templates/blocks/components/SideNav/ (showcase blocks)
*/
var styles$2 = {
	root: {
		k1xSpc: "x78zum5",
		kGNEyG: "x6s0dn4",
		kOIVth: "x1txdalj",
		kAzted: "xkoleio",
		kZCmMZ: "x12gdq22 xmnmr5y",
		kwRFfy: "x1djylfy",
		k8WAf4: "xt970qd",
		kB7OPa: "x9f619",
		kybGjl: "x1hl2dhg",
		kMwMTN: "x1heor9g",
		kkrTdU: "xt0e3qv",
		$$css: true
	},
	rootCollapsed: {
		kjj79g: "xl56j7k",
		kg3NbH: "xnjsko4",
		$$css: true
	},
	interactive: {
		kkrTdU: "x1ypdohk x16khyan",
		kaIpWk: "xh6dtrn",
		kMzoRj: "xc342km",
		ksu8eU: "xng3xce",
		kWkggS: "xjbqb8w",
		kMv6JI: "xjb2p0i",
		kGuDYH: "x1qlqyl8",
		k63SB2: "x1sodnla",
		k9WMMc: "x1yc453h",
		kRL5z6: "xoevpu5",
		$$css: true
	},
	menuTrigger: {
		kkrTdU: "x1ypdohk x16khyan",
		kaIpWk: "xh6dtrn",
		kMzoRj: "xc342km",
		ksu8eU: "xng3xce",
		kWkggS: "xjbqb8w",
		kMv6JI: "xjb2p0i",
		kGuDYH: "x1qlqyl8",
		k63SB2: "x1sodnla",
		k9WMMc: "x1yc453h",
		$$css: true
	},
	icon: {
		kmuXW: "x2lah0s",
		k1xSpc: "x78zum5",
		kGNEyG: "x6s0dn4",
		kjj79g: "xl56j7k",
		$$css: true
	},
	heading: {
		kGuDYH: "x18juvz8",
		k63SB2: "x2mo6ok",
		kLWn49: "xf74fhv",
		kMwMTN: "x1tgivj0",
		kybGjl: "x1hl2dhg",
		kVQacm: "xb3r6kr",
		kg5iWk: "xlyipyv",
		khDVqt: "xuxw1ft",
		$$css: true
	},
	headingLink: {
		kybGjl: "x1hl2dhg",
		kMwMTN: "x1heor9g",
		kVQacm: "xb3r6kr",
		kg5iWk: "xlyipyv",
		khDVqt: "xuxw1ft",
		$$css: true
	},
	chevron: {
		kmuXW: "x2lah0s",
		k1xSpc: "x78zum5",
		kGNEyG: "x6s0dn4",
		kjj79g: "xl56j7k",
		k7Eaqz: "xy8csz5",
		kAzted: "ximsjs8",
		kMwMTN: "xv9yike",
		kGuDYH: "x1qlqyl8",
		$$css: true
	},
	popoverHeading: {
		k1xSpc: "x78zum5",
		kGNEyG: "x6s0dn4",
		kOIVth: "x1txdalj",
		kzqmXN: "xh8yej3",
		kWkggS: "xjbqb8w",
		kMv6JI: "xjb2p0i",
		kGuDYH: "x1qlqyl8",
		kMwMTN: "x1heor9g",
		k9WMMc: "x1yc453h",
		kAzted: "xkoleio",
		kZCmMZ: "x12gdq22 xmnmr5y",
		kwRFfy: "x1djylfy",
		k8WAf4: "xt970qd",
		keoZOQ: "xcsaf9d",
		k1K539: "x1p37lm5",
		kUOVxO: "xhrcg97",
		kkrTdU: "x1ypdohk x16khyan",
		$$css: true
	},
	popoverChevron: {
		kmuXW: "x2lah0s",
		k1xSpc: "x78zum5",
		kGNEyG: "x6s0dn4",
		kjj79g: "xl56j7k",
		k7Eaqz: "xy8csz5",
		kAzted: "ximsjs8",
		kMwMTN: "xv9yike",
		kGuDYH: "x1qlqyl8",
		k3aq6I: "x19jd1h0",
		$$css: true
	},
	chevronGlyph: {
		kGuDYH: "x1qlqyl8",
		$$css: true
	},
	popover: {
		k7Eaqz: "xrzjruh",
		keoZOQ: "xcsaf9d",
		$$css: true
	},
	popoverOverlap: {
		k7Eaqz: "x8wyhu6",
		keoZOQ: "xvyqdj1",
		keTefX: "x1qfufaz",
		$$css: true
	}
};
/**
* Product/suite/account heading for SideNav.
*
* Supports smart interaction boundary logic:
* - No hrefs + menu → whole heading is the popover trigger
* - headingHref only, no menu → whole heading is one link
* - headingHref + superheadingHref, no menu → each is an independent link
* - menu + hrefs → links are independent, chevron/remaining area is the trigger
*
* The chevron indicator is automatically shown when `menu` is provided.
*
* @example
* ```
* <SideNavHeading icon={<AppIcon />} heading="My App" headingHref="/" />
* <SideNavHeading
*   icon={<SuiteIcon />}
*   superheading="Suite Name"
*   superheadingHref="/suite"
*   heading="Product Name"
*   headingHref="/product"
*   menu={<ProductSwitcher />}
* />
* <SideNavHeading
*   icon={<AppIcon />}
*   heading="Product Name"
*   subheading="Business Account"
*   menu={<AccountSwitcher />}
* />
* ```
*/
function SideNavHeading({ as, icon, heading, headingHref, superheading, superheadingHref, subheading, subheadingHref, headerEndContent, menu, xstyle, className, style, "data-testid": testId, ref, ...props$1 }) {
	const t = useTranslator();
	const LinkComponent = useLinkComponent(as);
	const { isCollapsed } = useSideNavCollapse();
	const rootRef = (0, import_react.useRef)(null);
	const collapsedItemRef = (0, import_react.useRef)(null);
	const popover = usePopover({
		dialogLabel: t("@astryx.sideNav.heading.dialogLabel"),
		role: "none",
		hasCloseButton: false
	});
	const { triggerProps, contentProps, menuRef, setTriggerEl, close: closeMenu } = useMenuHover({
		show: popover.show,
		hide: popover.hide,
		isOpen: popover.isOpen,
		isEnabled: !!menu,
		showDelay: 0
	});
	const closeMenuCtx = (0, import_react.useMemo)(() => ({ closeMenu }), [closeMenu]);
	const setRef = useMergedRefs(rootRef, ref, menu ? popover.triggerRef : void 0);
	const collapsedSetRef = useMergedRefs(collapsedItemRef, ref, menu ? popover.triggerRef : void 0, menu ? setTriggerEl : void 0);
	if (isCollapsed && !icon) return null;
	if (isCollapsed && icon) {
		const collapsedIcon = /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
			className: "x2lah0s x78zum5 x6s0dn4 xl56j7k",
			children: icon
		});
		let collapsedElement;
		if (headingHref) collapsedElement = /*#__PURE__*/ (0, import_jsx_runtime.jsx)(LinkComponent, {
			ref: collapsedSetRef,
			href: headingHref,
			"aria-label": heading,
			"data-testid": testId,
			...mergeProps(themeProps("side-nav-heading"), focusOutlineProps.focusVisible(navItemStyles.item, interactionOverlayStyles.backgroundColor, styles$2.rootCollapsed, xstyle), className, style),
			children: collapsedIcon
		});
		else if (menu) collapsedElement = /*#__PURE__*/ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/*#__PURE__*/ (0, import_jsx_runtime.jsx)("button", {
			ref: collapsedSetRef,
			type: "button",
			"aria-label": heading,
			"data-testid": testId,
			...popover.triggerProps,
			...triggerProps,
			...mergeProps(themeProps("side-nav-heading"), focusOutlineProps.focusVisible(navItemStyles.item, interactionOverlayStyles.backgroundColor, styles$2.rootCollapsed, styles$2.menuTrigger, xstyle), className, style),
			children: collapsedIcon
		}), popover.render(/*#__PURE__*/ (0, import_jsx_runtime.jsxs)("div", {
			ref: menuRef,
			className: "x9epnlk xb3r6kr",
			...contentProps,
			children: [/*#__PURE__*/ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				...focusOutlineProps.focusVisible(styles$2.popoverHeading),
				onClick: closeMenu,
				children: [icon && /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
					className: "x2lah0s x78zum5 x6s0dn4 xl56j7k",
					children: icon
				}), /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("span", {
					className: "x78zum5 xdt5ytf x98rzlu xeuugli",
					children: [
						superheading && /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
							className: "x141an7d x1ltkj2j xv1l7n4 x1hl2dhg xb3r6kr xlyipyv xuxw1ft",
							children: superheading
						}),
						/*#__PURE__*/ (0, import_jsx_runtime.jsxs)("span", {
							className: "x78zum5 x6s0dn4 xzye2dw",
							children: [/*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
								...{
									0: { className: "x18juvz8 x2mo6ok xf74fhv x1tgivj0 x1hl2dhg xb3r6kr xlyipyv xuxw1ft" },
									1: { className: "x18juvz8 xf74fhv x1tgivj0 x1hl2dhg xb3r6kr xlyipyv xuxw1ft x2mo6ok" }
								}[!!!!(superheading || subheading) << 0],
								children: heading
							}), /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Icon, {
								icon: "chevronDown",
								size: "sm",
								color: "secondary",
								xstyle: styles$2.popoverChevron
							})]
						}),
						subheading && /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
							className: "x141an7d x1ltkj2j xv1l7n4 x1hl2dhg xb3r6kr xlyipyv xuxw1ft",
							children: subheading
						})
					]
				})]
			}), /*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
				role: "menu",
				"aria-label": heading,
				children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)(NavHeadingCloseContext, {
					value: closeMenuCtx,
					children: menu
				})
			})]
		}), {
			placement: "below",
			alignment: "start",
			xstyle: styles$2.popover
		})] });
		else collapsedElement = /*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
			ref: collapsedSetRef,
			"data-testid": testId,
			...mergeProps(themeProps("side-nav-heading"), props(styles$2.root, styles$2.rootCollapsed, xstyle), className, style),
			...props$1,
			children: collapsedIcon
		});
		return /*#__PURE__*/ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [collapsedElement, /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Tooltip, {
			content: heading,
			placement: "end",
			anchorRef: collapsedItemRef
		})] });
	}
	const showChevron = !!menu;
	const hasAnyHref = !!(headingHref || superheadingHref || subheadingHref);
	const hasCompactHeading = !!(superheading || subheading);
	const isWholeHeadingTrigger = !!menu && !hasAnyHref;
	const isWholeHeadingLink = !!headingHref && !menu && !superheadingHref && !subheadingHref;
	const renderTextContent = (inlineChevron) => /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("span", {
		className: "x78zum5 xdt5ytf x98rzlu xeuugli",
		children: [
			superheading && (hasAnyHref && superheadingHref && menu ? /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Link, {
				href: superheadingHref,
				color: "secondary",
				size: "xsm",
				children: superheading
			}) : /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
				className: "x141an7d x1ltkj2j xv1l7n4 x1hl2dhg xb3r6kr xlyipyv xuxw1ft",
				children: superheading
			})),
			/*#__PURE__*/ (0, import_jsx_runtime.jsxs)("span", {
				className: "x78zum5 x6s0dn4 xzye2dw",
				children: [hasAnyHref && headingHref && menu ? /*#__PURE__*/ (0, import_jsx_runtime.jsx)(LinkComponent, {
					href: headingHref,
					...focusOutlineProps.focusVisible(styles$2.heading, styles$2.headingLink),
					children: heading
				}) : /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
					className: "x18juvz8 x2mo6ok xf74fhv x1tgivj0 x1hl2dhg xb3r6kr xlyipyv xuxw1ft",
					children: heading
				}), inlineChevron]
			}),
			subheading && (hasAnyHref && subheadingHref && menu ? /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Link, {
				href: subheadingHref,
				color: "secondary",
				size: "xsm",
				children: subheading
			}) : /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
				className: "x141an7d x1ltkj2j xv1l7n4 x1hl2dhg xb3r6kr xlyipyv xuxw1ft",
				children: subheading
			}))
		]
	});
	const chevronElement = showChevron && /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Icon, {
		icon: "chevronDown",
		size: "sm",
		color: "secondary",
		xstyle: styles$2.chevron
	});
	const headerEndContentElement = headerEndContent && /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
		className: "x2lah0s x78zum5 x6s0dn4 xvc5jky",
		children: headerEndContent
	});
	const popoverHeadingContent = /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		...focusOutlineProps.focusVisible(styles$2.popoverHeading),
		onClick: closeMenu,
		children: [icon && /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
			className: "x2lah0s x78zum5 x6s0dn4 xl56j7k",
			children: icon
		}), renderTextContent(/*#__PURE__*/ (0, import_jsx_runtime.jsx)(Icon, {
			icon: "chevronDown",
			size: "sm",
			color: "secondary",
			xstyle: styles$2.popoverChevron
		}))]
	});
	if (isWholeHeadingLink && headingHref) return /*#__PURE__*/ (0, import_jsx_runtime.jsxs)(LinkComponent, {
		ref,
		href: headingHref,
		"data-testid": testId,
		...mergeProps(themeProps("side-nav-heading"), focusOutlineProps.focusVisible(styles$2.root, styles$2.menuTrigger, xstyle), className, style),
		...props$1,
		children: [
			icon && /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
				className: "x2lah0s x78zum5 x6s0dn4 xl56j7k",
				children: icon
			}),
			renderTextContent(),
			headerEndContentElement,
			chevronElement
		]
	});
	if (isWholeHeadingTrigger) return /*#__PURE__*/ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/*#__PURE__*/ (0, import_jsx_runtime.jsxs)("div", {
		ref: setRef,
		"data-testid": testId,
		...triggerProps,
		...mergeProps(themeProps("side-nav-heading"), props(styles$2.root, styles$2.menuTrigger, xstyle), className, style),
		children: [
			icon && /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
				className: "x2lah0s x78zum5 x6s0dn4 xl56j7k",
				children: icon
			}),
			renderTextContent(/*#__PURE__*/ (0, import_jsx_runtime.jsx)("button", {
				ref: setTriggerEl,
				type: "button",
				"aria-label": t("@astryx.sideNav.heading.openMenu"),
				onClick: (e) => {
					e.stopPropagation();
					triggerProps.onClick();
				},
				...popover.triggerProps,
				...focusOutlineProps.focusVisible(styles$2.chevron, styles$2.interactive),
				children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Icon, {
					icon: "chevronDown",
					size: "sm",
					color: "inherit",
					xstyle: styles$2.chevronGlyph
				})
			})),
			headerEndContentElement
		]
	}), popover.render(/*#__PURE__*/ (0, import_jsx_runtime.jsxs)("div", {
		ref: menuRef,
		className: "x9epnlk xb3r6kr",
		...contentProps,
		children: [popoverHeadingContent, /*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
			role: "menu",
			"aria-label": heading,
			children: menu
		})]
	}), {
		placement: "below",
		alignment: "start",
		xstyle: styles$2.popoverOverlap
	})] });
	if (menu && hasAnyHref) return /*#__PURE__*/ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/*#__PURE__*/ (0, import_jsx_runtime.jsxs)("div", {
		ref: setRef,
		"data-testid": testId,
		...triggerProps,
		...mergeProps(themeProps("side-nav-heading"), props(styles$2.root, xstyle), className, style),
		children: [
			icon && (headingHref ? /*#__PURE__*/ (0, import_jsx_runtime.jsx)(LinkComponent, {
				href: headingHref,
				"aria-label": heading,
				...focusOutlineProps.focusVisible(styles$2.icon),
				children: icon
			}) : /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
				className: "x2lah0s x78zum5 x6s0dn4 xl56j7k",
				children: icon
			})),
			renderTextContent(showChevron ? /*#__PURE__*/ (0, import_jsx_runtime.jsx)("button", {
				ref: setTriggerEl,
				type: "button",
				"aria-label": t("@astryx.sideNav.heading.openMenu"),
				onClick: (e) => {
					e.stopPropagation();
					triggerProps.onClick();
				},
				...popover.triggerProps,
				...focusOutlineProps.focusVisible(styles$2.chevron, styles$2.interactive),
				children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Icon, {
					icon: "chevronDown",
					size: "sm",
					color: "inherit",
					xstyle: styles$2.chevronGlyph
				})
			}) : void 0),
			headerEndContentElement
		]
	}), popover.render(/*#__PURE__*/ (0, import_jsx_runtime.jsxs)("div", {
		ref: menuRef,
		className: "x9epnlk xb3r6kr",
		...contentProps,
		children: [popoverHeadingContent, /*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
			role: "menu",
			"aria-label": heading,
			children: menu
		})]
	}), {
		placement: "below",
		alignment: "start",
		xstyle: styles$2.popoverOverlap
	})] });
	if (hasAnyHref && !isWholeHeadingLink) return /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		"data-testid": testId,
		...mergeProps(themeProps("side-nav-heading"), props(styles$2.root, xstyle), className, style),
		...props$1,
		children: [
			icon && (headingHref ? /*#__PURE__*/ (0, import_jsx_runtime.jsx)(LinkComponent, {
				href: headingHref,
				"aria-label": heading,
				...focusOutlineProps.focusVisible(styles$2.icon),
				children: icon
			}) : /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
				className: "x2lah0s x78zum5 x6s0dn4 xl56j7k",
				children: icon
			})),
			/*#__PURE__*/ (0, import_jsx_runtime.jsxs)("span", {
				className: "x78zum5 xdt5ytf x98rzlu xeuugli",
				children: [
					superheading && (superheadingHref ? /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Link, {
						href: superheadingHref,
						color: "secondary",
						size: "xsm",
						children: superheading
					}) : /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
						className: "x141an7d x1ltkj2j xv1l7n4 x1hl2dhg xb3r6kr xlyipyv xuxw1ft",
						children: superheading
					})),
					headingHref ? /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Link, {
						href: headingHref,
						color: "primary",
						weight: "semibold",
						children: heading
					}) : /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
						...{
							0: { className: "x18juvz8 x2mo6ok xf74fhv x1tgivj0 x1hl2dhg xb3r6kr xlyipyv xuxw1ft" },
							1: { className: "x18juvz8 xf74fhv x1tgivj0 x1hl2dhg xb3r6kr xlyipyv xuxw1ft x2mo6ok" }
						}[!!hasCompactHeading << 0],
						children: heading
					}),
					subheading && (subheadingHref ? /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Link, {
						href: subheadingHref,
						color: "secondary",
						size: "xsm",
						children: subheading
					}) : /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
						className: "x141an7d x1ltkj2j xv1l7n4 x1hl2dhg xb3r6kr xlyipyv xuxw1ft",
						children: subheading
					}))
				]
			}),
			headerEndContentElement,
			chevronElement
		]
	});
	return /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		"data-testid": testId,
		...mergeProps(themeProps("side-nav-heading"), props(styles$2.root, xstyle), className, style),
		...props$1,
		children: [
			icon && /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
				className: "x2lah0s x78zum5 x6s0dn4 xl56j7k",
				children: icon
			}),
			renderTextContent(),
			headerEndContentElement,
			chevronElement
		]
	});
}
SideNavHeading.displayName = "SideNavHeading";
//#endregion
//#region node_modules/@astryxdesign/core/dist/SideNav/SideNavItem.js
/**
* @file SideNavItem.tsx
* @input Uses React, ReactNode, StyleX, Icon, IconType, useMenuHover
* @output Exports SideNavItem component and SideNavItemProps
* @position Core implementation; used inside SideNav children
*
* Navigation item with icon, selected state, row-level actions, and nesting.
*
* Collapsed items with children open their submenu flyout through
* `useMenuHover`, the shared hover-intent hook (same one `SideNavHeading` and
* `TopNavMenu` use). Hover is a progressive enhancement over the popover's
* click behavior and is inert on coarse pointers.
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/SideNav/SideNav.doc.mjs
* - /packages/core/src/SideNav/SideNav.test.tsx
* - /packages/core/src/SideNav/index.ts
* - /apps/storybook/stories/SideNav.stories.tsx
* - /packages/cli/assets/templates/blocks/components/SideNav/ (showcase blocks)
*/
var styles$1 = {
	root: {
		k1xSpc: "x78zum5",
		kXwgrk: "xdt5ytf",
		kzqmXN: "xh8yej3",
		$$css: true
	},
	itemCollapsed: {
		kjj79g: "xl56j7k",
		kzqmXN: "x805d0l",
		kg3NbH: "xnjsko4",
		$$css: true
	},
	itemCollapsedSm: {
		kzqmXN: "x1fvqzum",
		$$css: true
	},
	itemCollapsedLg: {
		kzqmXN: "x1m747yf",
		$$css: true
	},
	expandChevron: {
		k1xSpc: "x3nfvp2",
		kGNEyG: "x6s0dn4",
		kjj79g: "xl56j7k",
		kzqmXN: "x1mtvzj0",
		kZKoxP: "xvpftlf",
		kGuDYH: "x1qlqyl8",
		k1ekBW: "x11xpdln",
		kIyJzY: "xuedmi6 x12w9bfk",
		kAMwcw: "xlr8y92",
		kmuXW: "x2lah0s",
		$$css: true
	},
	expandChevronExpanded: {
		k3aq6I: "x19jd1h0",
		$$css: true
	},
	expandToggle: {
		kzqmXN: "x1fvqzum",
		kZKoxP: "x6k0iem",
		k1xSpc: "x3nfvp2",
		kGNEyG: "x6s0dn4",
		kjj79g: "xl56j7k",
		kmuXW: "x2lah0s",
		kmVPX3: "x1717udv",
		kogj98: "x1ghz6dp",
		kMzoRj: "xc342km",
		ksu8eU: "xng3xce",
		kWkggS: "xjbqb8w",
		kMwMTN: "x1heor9g",
		kkrTdU: "x1ypdohk x16khyan",
		kaIpWk: "xh6dtrn",
		$$css: true
	},
	splitAction: {
		k1xSpc: "x78zum5",
		kGNEyG: "x6s0dn4",
		kSGwAc: "xkh2ocl",
		kOIVth: "x1txdalj",
		kUk6DE: "x98rzlu",
		k7Eaqz: "xeuugli",
		kMwMTN: "x1heor9g",
		kybGjl: "x1hl2dhg",
		kmVPX3: "x1717udv",
		kogj98: "x1ghz6dp",
		kMzoRj: "xc342km",
		ksu8eU: "xng3xce",
		kWkggS: "xjbqb8w",
		kMv6JI: "xjb2p0i",
		kGuDYH: "x1qlqyl8",
		k63SB2: "x1pd3egz",
		kLWn49: "x15bjb6t",
		k9WMMc: "x1yc453h",
		kkrTdU: "x1ypdohk x16khyan",
		$$css: true
	},
	popoverGap: {
		keTefX: "x11g1kdw",
		k71WvV: "xnur1sd",
		$$css: true
	}
};
/**
* Cascaded to the `actions` slot through `SizeContext` so a consumer's row
* controls come out the same height as the built-in expand/collapse toggle,
* the way `SideNav` already cascades one size to its footer icons. An
* explicit `size` on a supplied control still wins.
*
* SYNC: `styles.expandToggle` carries the matching box.
*/
var ROW_CONTROL_SIZE = "sm";
var EXPANDED_COLLAPSE_STATE = {
	isCollapsed: false,
	toggle: () => {},
	isCollapsible: false
};
/**
* Renders `<a>` (via LinkComponent) when `href` is set, otherwise `<button>`.
* Centralizes the link-vs-button decision used across all SideNavItem paths.
*/
function NavItemElement({ href, as, isDisabled, onClick, ref, children, ...rest }) {
	const LinkComponent = useLinkComponent(as);
	if (href && !isDisabled) return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(LinkComponent, {
		ref,
		href,
		onClick,
		...rest,
		children
	});
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)("button", {
		ref,
		type: "button",
		onClick,
		disabled: isDisabled,
		...rest,
		children
	});
}
/**
* Navigation item for SideNav.
*
* Supports icons, selected state, nesting, and end content like badges or
* counts. Interactive row-level controls (menus, icon buttons) go in
* `actions`, which renders them as siblings of the primary element — never
* nested inside it — before any nested children in DOM and focus order.
*
* @example
* ```
* <SideNavItem
*   label="Dashboard"
*   icon={HomeIcon}
*   selectedIcon={HomeIconSolid}
*   isSelected
*   href="/dashboard"
* />
* <SideNavItem label="Settings" icon={CogIcon}>
*   <SideNavItem label="General" href="/settings/general" />
*   <SideNavItem label="Security" href="/settings/security" />
* </SideNavItem>
* <SideNavItem
*   label="Projects"
*   href="/projects"
*   collapsible
*   actions={<MoreMenu label="Project actions" items={items} />}>
*   <SideNavItem label="Alpha" href="/projects/alpha" />
* </SideNavItem>
* ```
*/
function SideNavItem({ as, label, icon, selectedIcon, isSelected = false, isDisabled = false, href, onClick, endContent, actions, children, collapsible: itemCollapsible, size = "md", "data-testid": testId, ref, xstyle, ...rest }) {
	const t = useTranslator();
	const { isCollapsed } = useSideNavCollapse();
	const renderMode = useSideNavRenderMode();
	const { closeMobileNav } = useAppShellMobile();
	const isInDrawer = renderMode === "drawer" || renderMode === "drawer-content";
	const id = (0, import_react.useId)();
	const hasChildren = !!children;
	const itemRef = (0, import_react.useRef)(null);
	const popover = usePopover({
		hasLightDismiss: true,
		hasAutoFocus: true,
		hasCloseButton: false,
		dialogLabel: t("@astryx.sideNavItem.submenuLabel", { label })
	});
	const mergedTriggerRef = useMergedRefs(ref, popover.triggerRef);
	const itemCollapsibleConfig = (0, import_react.useMemo)(() => typeof itemCollapsible === "object" ? itemCollapsible : {}, [itemCollapsible]);
	const isItemCollapsible = hasChildren && itemCollapsible !== false;
	const itemControlledCollapsed = itemCollapsibleConfig.isCollapsed;
	const isItemControlled = itemControlledCollapsed !== void 0;
	const [uncontrolledCollapsed, setUncontrolledCollapsed] = (0, import_react.useState)(itemCollapsibleConfig.defaultIsCollapsed ?? false);
	const isItemCollapsed = isItemControlled ? itemControlledCollapsed : uncontrolledCollapsed;
	const toggleItemCollapse = (0, import_react.useCallback)(() => {
		const next = !isItemCollapsed;
		if (!isItemControlled) setUncontrolledCollapsed(next);
		itemCollapsibleConfig.onCollapsedChange?.(next);
	}, [
		isItemCollapsed,
		isItemControlled,
		itemCollapsibleConfig
	]);
	const displayIcon = isSelected && selectedIcon ? selectedIcon : icon;
	const hasIndependentToggle = isItemCollapsible && (!!href || !!onClick) && !isCollapsed;
	const hasActions = !!actions;
	const handleClick = (e) => {
		if (isDisabled) {
			e.preventDefault();
			return;
		}
		if (isItemCollapsible && !hasIndependentToggle && !isCollapsed) {
			e.preventDefault();
			toggleItemCollapse();
			return;
		}
		onClick?.(e);
		if (isInDrawer) closeMobileNav();
	};
	const handleToggleClick = (e) => {
		e.preventDefault();
		e.stopPropagation();
		toggleItemCollapse();
	};
	const { triggerProps: hoverTriggerProps, contentProps: hoverContentProps } = useMenuHover({
		show: popover.show,
		hide: popover.hide,
		isOpen: popover.isOpen,
		isEnabled: isCollapsed && hasChildren,
		clickGuardMs: 0,
		ownsFocus: false
	});
	if (isCollapsed && !icon) return null;
	if (isCollapsed) {
		const collapsedIcon = displayIcon && renderIconSlot(displayIcon, {
			size: "sm",
			color: isSelected ? "inherit" : isDisabled ? "disabled" : "secondary"
		});
		const collapsedItemStyles = mergeProps(themeProps("side-nav-item", {
			size,
			selected: isSelected ? "selected" : null,
			disabled: isDisabled ? "disabled" : null
		}), focusOutlineProps.focusVisible(navItemStyles.item, interactionOverlayStyles.backgroundColor, navItemStyles[size], styles$1.itemCollapsed, size === "sm" && styles$1.itemCollapsedSm, size === "lg" && styles$1.itemCollapsedLg, isSelected && navItemStyles.selected, isDisabled && navItemStyles.disabled));
		if (hasChildren) return /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("div", {
			...props(styles$1.root, xstyle),
			children: [/*#__PURE__*/ (0, import_jsx_runtime.jsx)("button", {
				ref: mergedTriggerRef,
				type: "button",
				...rest,
				...hoverTriggerProps,
				"aria-label": label,
				"data-testid": testId,
				...popover.triggerProps,
				...collapsedItemStyles,
				children: collapsedIcon
			}), popover.render(/*#__PURE__*/ (0, import_jsx_runtime.jsxs)("div", {
				className: "x1hviunn xu0wf1k x7a5moj xfb3i0g",
				onMouseEnter: hoverContentProps.onMouseEnter,
				onMouseLeave: hoverContentProps.onMouseLeave,
				onClick: () => popover.hide(),
				children: [/*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
					className: "xf314gf xu0wf1k x141an7d x2mo6ok xv1l7n4 x1ltkj2j",
					children: label
				}), /*#__PURE__*/ (0, import_jsx_runtime.jsx)(SideNavCollapseContext, {
					value: EXPANDED_COLLAPSE_STATE,
					children
				})]
			}), {
				placement: "end",
				alignment: "start",
				xstyle: styles$1.popoverGap
			})]
		});
		const collapsedAriaProps = {
			"aria-current": isSelected ? "page" : void 0,
			"aria-disabled": isDisabled || void 0,
			"aria-label": label,
			"data-testid": testId
		};
		const collapsedElement = /*#__PURE__*/ (0, import_jsx_runtime.jsx)(NavItemElement, {
			ref,
			href,
			as,
			isDisabled,
			onClick: handleClick,
			...rest,
			...collapsedAriaProps,
			...collapsedItemStyles,
			children: collapsedIcon
		});
		return /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("div", {
			ref: itemRef,
			...props(styles$1.root, xstyle),
			children: [collapsedElement, /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Tooltip, {
				content: label,
				placement: "end",
				anchorRef: itemRef
			})]
		});
	}
	const itemContent = /*#__PURE__*/ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		displayIcon && renderIconSlot(displayIcon, {
			size: "sm",
			color: isSelected ? "inherit" : isDisabled ? "disabled" : "secondary"
		}),
		!isCollapsed && /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
			className: "x98rzlu xeuugli xb3r6kr xlyipyv xuxw1ft",
			children: label
		}),
		!isCollapsed && endContent && /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
			className: "x2lah0s x78zum5 x6s0dn4",
			children: endContent
		}),
		!isCollapsed && isItemCollapsible && !hasIndependentToggle && /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Icon, {
			icon: "chevronDown",
			size: "lg",
			color: "inherit",
			xstyle: [styles$1.expandChevron, !isItemCollapsed && styles$1.expandChevronExpanded]
		})
	] });
	const itemThemeProps = themeProps("side-nav-item", {
		size,
		selected: isSelected ? "selected" : null,
		disabled: isDisabled ? "disabled" : null
	});
	const itemStyleArgs = [
		navItemStyles.item,
		interactionOverlayStyles.backgroundColor,
		navItemStyles[size],
		isSelected && navItemStyles.selected,
		isDisabled && navItemStyles.disabled
	];
	const rowProps = mergeProps(itemThemeProps, props(...itemStyleArgs));
	const focusableRowProps = mergeProps(itemThemeProps, focusOutlineProps.focusVisible(...itemStyleArgs));
	const actionsRowProps = mergeProps(itemThemeProps, focusOutlineProps.focusWithinFirstChild(...itemStyleArgs));
	const hasRowWrapper = hasIndependentToggle || hasActions;
	let itemElement;
	if (hasRowWrapper) {
		const rowPrimaryAriaProps = hasIndependentToggle ? { "aria-current": isSelected ? "page" : void 0 } : {
			"aria-current": isSelected ? "page" : void 0,
			"aria-disabled": isDisabled || void 0,
			"aria-expanded": isItemCollapsible ? !isItemCollapsed : void 0,
			"aria-controls": isItemCollapsible ? `${id}-children` : void 0
		};
		itemElement = /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("div", {
			"data-testid": testId,
			...hasActions ? actionsRowProps : rowProps,
			children: [
				/*#__PURE__*/ (0, import_jsx_runtime.jsx)(NavItemElement, {
					ref,
					href,
					as,
					isDisabled,
					onClick: handleClick,
					...rest,
					...rowPrimaryAriaProps,
					...hasActions ? focusOutlineProps.suppressed(styles$1.splitAction) : focusOutlineProps.focusVisible(styles$1.splitAction),
					children: itemContent
				}),
				hasIndependentToggle && /*#__PURE__*/ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: handleToggleClick,
					"aria-label": isItemCollapsed ? t("@astryx.sideNavItem.expand", { label }) : t("@astryx.sideNavItem.collapse", { label }),
					"aria-expanded": !isItemCollapsed,
					"aria-controls": `${id}-children`,
					...focusOutlineProps.focusVisible(styles$1.expandToggle, interactionOverlayStyles.backgroundColor),
					children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)(Icon, {
						icon: "chevronDown",
						size: "lg",
						color: "inherit",
						xstyle: [styles$1.expandChevron, !isItemCollapsed && styles$1.expandChevronExpanded]
					})
				}),
				hasActions && /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
					className: "x2lah0s x78zum5 x6s0dn4 xzye2dw x67bb7w",
					children: /*#__PURE__*/ (0, import_jsx_runtime.jsx)(SizeProvider, {
						value: ROW_CONTROL_SIZE,
						children: actions
					})
				})
			]
		});
	} else {
		const ariaProps = {
			"aria-current": isSelected ? "page" : void 0,
			"aria-disabled": isDisabled || void 0,
			"aria-expanded": isItemCollapsible ? !isItemCollapsed : void 0,
			"aria-controls": isItemCollapsible ? `${id}-children` : void 0,
			"data-testid": testId
		};
		itemElement = /*#__PURE__*/ (0, import_jsx_runtime.jsx)(NavItemElement, {
			ref,
			href,
			as,
			isDisabled,
			onClick: handleClick,
			...rest,
			...ariaProps,
			...focusableRowProps,
			children: itemContent
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: itemRef,
		...props(styles$1.root, xstyle),
		children: [itemElement, hasChildren && !isCollapsed && /*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
			id: `${id}-children`,
			role: "group",
			"aria-labelledby": `${id}-label`,
			"aria-hidden": isItemCollapsed,
			inert: isItemCollapsed ? true : void 0,
			...{
				0: { className: "xrvj5dj x1tu4anv x1qn9uv2 x80gvsz x12w9bfk xlr8y92" },
				1: { className: "xrvj5dj x1qn9uv2 x80gvsz x12w9bfk xlr8y92 xihq33y" }
			}[!!isItemCollapsed << 0],
			children: /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("div", {
				className: "xb3r6kr x2lwn1j x31w388",
				children: [/*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
					id: `${id}-label`,
					hidden: true,
					children: label
				}), children]
			})
		})]
	});
}
SideNavItem.displayName = "SideNavItem";
//#endregion
//#region node_modules/@astryxdesign/core/dist/SideNav/SideNavSection.js
/**
* @file SideNavSection.tsx
* @input Uses React, StyleX
* @output Exports SideNavSection component and SideNavSectionProps
* @position Core implementation; used inside SideNav children
*
* Section grouping for navigation items with optional title and end content.
*
* SYNC: When modified, update these files to stay in sync:
* - /packages/core/src/SideNav/SideNav.doc.mjs
* - /packages/core/src/SideNav/SideNav.test.tsx
* - /packages/core/src/SideNav/index.ts
* - /apps/storybook/stories/SideNav.stories.tsx
* - /packages/cli/assets/templates/blocks/components/SideNav/ (showcase blocks)
*/
var styles = { root: {
	k1xSpc: "x78zum5",
	kXwgrk: "xdt5ytf",
	k8WAf4: "xu0wf1k",
	$$css: true
} };
/**
* Section grouping for SideNav items.
*
* Renders a labeled group of navigation items.
* Uses `role="group"` with `aria-labelledby` for accessibility.
*
* @example
* ```
* <SideNavSection title="Main">
*   <SideNavItem label="Dashboard" icon={HomeIcon} isSelected />
*   <SideNavItem label="Projects" icon={FolderIcon} />
* </SideNavSection>
* ```
*/
function SideNavSection({ ref, title, subtitle, children, endContent, isHeaderHidden = false, xstyle, className, style, "data-testid": testId, ...rest }) {
	const { isCollapsed } = useSideNavCollapse();
	const titleId = `${(0, import_react.useId)()}-title`;
	const headerContent = /*#__PURE__*/ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/*#__PURE__*/ (0, import_jsx_runtime.jsxs)("span", {
		className: "x78zum5 xdt5ytf x98rzlu xeuugli",
		children: [/*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
			id: titleId,
			className: "x141an7d x2mo6ok x1ltkj2j xv1l7n4 xb3r6kr xlyipyv xuxw1ft",
			children: title
		}), subtitle && /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
			className: "x141an7d x1ltkj2j xv1l7n4 xb3r6kr xlyipyv xuxw1ft",
			children: subtitle
		})]
	}), endContent && /*#__PURE__*/ (0, import_jsx_runtime.jsx)("span", {
		className: "x2lah0s x78zum5 x6s0dn4",
		children: endContent
	})] });
	const shouldHideHeader = isHeaderHidden || isCollapsed;
	return /*#__PURE__*/ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		...mergeProps(themeProps("side-nav-section"), props(styles.root, xstyle), className, style),
		...rest,
		role: "group",
		"aria-labelledby": titleId,
		"data-testid": testId,
		children: [shouldHideHeader ? /*#__PURE__*/ (0, import_jsx_runtime.jsx)(VisuallyHidden, {
			as: "div",
			children: headerContent
		}) : /*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
			className: "x78zum5 x6s0dn4 x1txdalj xf314gf xu0wf1k xt0e3qv x87ps6o",
			children: headerContent
		}), /*#__PURE__*/ (0, import_jsx_runtime.jsx)("div", {
			className: "x78zum5 xdt5ytf x1lsbc85",
			children
		})]
	});
}
SideNavSection.displayName = "SideNavSection";
//#endregion
export { AppShell, Button, Card, Center, Dialog, DialogHeader, Divider, DropdownMenu, Grid, HStack, Heading, Icon, IconButton, Layout, LayoutContent, LayoutFooter, LayoutHeader, List, ListItem, Section, SideNav, SideNavCollapseButton, SideNavHeading, SideNavItem, SideNavSection, StackItem, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow, Text, TextInput, Theme, Token, VStack, defineSyntaxTheme, defineTheme, require_jsx_runtime, require_react, require_react_dom, useSideNavCollapse };
