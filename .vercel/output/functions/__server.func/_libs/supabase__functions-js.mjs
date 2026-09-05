if (typeof globalThis.requestAnimationFrame === "undefined") globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
if (typeof globalThis.cancelAnimationFrame === "undefined") globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
try {
	globalThis.requestAnimationFrame;
	globalThis.cancelAnimationFrame;
} catch (e) {}
import { __awaiter } from "tslib";
//#region node_modules/@supabase/functions-js/dist/module/helper.js
var resolveFetch = (customFetch) => {
	if (customFetch) return (...args) => customFetch(...args);
	return (...args) => fetch(...args);
};
//#endregion
//#region node_modules/@supabase/functions-js/dist/module/types.js
/**
* Base error for Supabase Edge Function invocations.
*
* @example
* ```ts
* import { FunctionsError } from '@supabase/functions-js'
*
* throw new FunctionsError('Unexpected error invoking function', 'FunctionsError', {
*   requestId: 'abc123',
* })
* ```
*/
var FunctionsError = class extends Error {
	constructor(message, name = "FunctionsError", context) {
		super(message);
		this.name = name;
		this.context = context;
	}
	toJSON() {
		return {
			name: this.name,
			message: this.message,
			context: this.context
		};
	}
};
/**
* Error thrown when the network request to an Edge Function fails.
*
* @example
* ```ts
* import { FunctionsFetchError } from '@supabase/functions-js'
*
* throw new FunctionsFetchError({ requestId: 'abc123' })
* ```
*/
var FunctionsFetchError = class extends FunctionsError {
	constructor(context) {
		super("Failed to send a request to the Edge Function", "FunctionsFetchError", context);
	}
};
/**
* Error thrown when the Supabase relay cannot reach the Edge Function.
*
* @example
* ```ts
* import { FunctionsRelayError } from '@supabase/functions-js'
*
* throw new FunctionsRelayError({ region: 'us-east-1' })
* ```
*/
var FunctionsRelayError = class extends FunctionsError {
	constructor(context) {
		super("Relay Error invoking the Edge Function", "FunctionsRelayError", context);
	}
};
/**
* Error thrown when the Edge Function returns a non-2xx status code.
*
* @example
* ```ts
* import { FunctionsHttpError } from '@supabase/functions-js'
*
* throw new FunctionsHttpError({ status: 500 })
* ```
*/
var FunctionsHttpError = class extends FunctionsError {
	constructor(context) {
		super("Edge Function returned a non-2xx status code", "FunctionsHttpError", context);
	}
};
var FunctionRegion;
(function(FunctionRegion) {
	FunctionRegion["Any"] = "any";
	FunctionRegion["ApNortheast1"] = "ap-northeast-1";
	FunctionRegion["ApNortheast2"] = "ap-northeast-2";
	FunctionRegion["ApSouth1"] = "ap-south-1";
	FunctionRegion["ApSoutheast1"] = "ap-southeast-1";
	FunctionRegion["ApSoutheast2"] = "ap-southeast-2";
	FunctionRegion["CaCentral1"] = "ca-central-1";
	FunctionRegion["EuCentral1"] = "eu-central-1";
	FunctionRegion["EuWest1"] = "eu-west-1";
	FunctionRegion["EuWest2"] = "eu-west-2";
	FunctionRegion["EuWest3"] = "eu-west-3";
	FunctionRegion["SaEast1"] = "sa-east-1";
	FunctionRegion["UsEast1"] = "us-east-1";
	FunctionRegion["UsWest1"] = "us-west-1";
	FunctionRegion["UsWest2"] = "us-west-2";
})(FunctionRegion || (FunctionRegion = {}));
//#endregion
//#region node_modules/@supabase/functions-js/dist/module/FunctionsClient.js
/**
* Client for invoking Supabase Edge Functions.
*/
var FunctionsClient = class {
	/**
	* Creates a new Functions client bound to an Edge Functions URL.
	*
	* @example Using supabase-js (recommended)
	* ```ts
	* import { createClient } from '@supabase/supabase-js'
	*
	* const supabase = createClient('https://xyzcompany.supabase.co', 'your-publishable-key')
	* const { data, error } = await supabase.functions.invoke('hello-world')
	* ```
	*
	* @category Edge Functions
	*
	* @example Standalone import for bundle-sensitive environments
	* ```ts
	* import { FunctionsClient, FunctionRegion } from '@supabase/functions-js'
	*
	* const functions = new FunctionsClient('https://xyzcompany.supabase.co/functions/v1', {
	*   headers: { apikey: 'your-publishable-key' },
	*   region: FunctionRegion.UsEast1,
	* })
	* ```
	*/
	constructor(url, { headers = {}, customFetch, region = FunctionRegion.Any } = {}) {
		this.url = url;
		this.headers = headers;
		this.region = region;
		this.fetch = resolveFetch(customFetch);
	}
	/**
	* Updates the authorization header
	* @param token - the new jwt token sent in the authorisation header
	*
	* @category Edge Functions
	*
	* @example Setting the authorization header
	* ```ts
	* functions.setAuth(session.access_token)
	* ```
	*/
	setAuth(token) {
		this.headers.Authorization = `Bearer ${token}`;
	}
	/**
	* Invokes a function
	* @param functionName - The name of the Function to invoke.
	* @param options - Options for invoking the Function.
	* @example
	* ```ts
	* const { data, error } = await functions.invoke('hello-world', {
	*   body: { name: 'Ada' },
	* })
	* ```
	*
	* @category Edge Functions
	*
	* @remarks
	* - The API key is sent in the `apikey` header. The `Authorization` header is reserved
	*   for the signed-in user's JWT (or a custom auth token) — when there is no session, a
	*   new-format API key (`sb_publishable_…` / `sb_secret_…`) is not sent as a Bearer token.
	* - Invoke params generally match the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) spec.
	* - When you pass in a body to your function, we automatically attach the Content-Type header for `Blob`, `ArrayBuffer`, `File`, `FormData` and `String`. If it doesn't match any of these types we assume the payload is `json`, serialize it and attach the `Content-Type` header as `application/json`. You can override this behavior by passing in a `Content-Type` header of your own.
	* - Responses are automatically parsed as `json`, `blob` and `form-data` depending on the `Content-Type` header sent by your function. Responses are parsed as `text` by default.
	*
	* @example Basic invocation
	* ```js
	* const { data, error } = await supabase.functions.invoke('hello', {
	*   body: { foo: 'bar' }
	* })
	* ```
	*
	* @exampleDescription Error handling
	* A `FunctionsHttpError` error is returned if your function throws an error, `FunctionsRelayError` if the Supabase Relay has an error processing your function and `FunctionsFetchError` if there is a network error in calling your function. Log the full error object so fields like `name`, `context`, and any structured body aren't hidden.
	*
	* @example Error handling
	* ```js
	* import { FunctionsHttpError, FunctionsRelayError, FunctionsFetchError } from "@supabase/supabase-js";
	*
	* const { data, error } = await supabase.functions.invoke('hello', {
	*   headers: {
	*     "my-custom-header": 'my-custom-header-value'
	*   },
	*   body: { foo: 'bar' }
	* })
	*
	* if (error instanceof FunctionsHttpError) {
	*   const errorMessage = await error.context.json()
	*   console.error('Function returned an error', errorMessage)
	* } else if (error instanceof FunctionsRelayError) {
	*   console.error('Relay error:', error)
	* } else if (error instanceof FunctionsFetchError) {
	*   console.error('Fetch error:', error)
	* }
	* ```
	*
	* @exampleDescription Passing custom headers
	* You can pass custom headers to your function. Note: supabase-js automatically passes the `Authorization` header with the signed in user's JWT.
	*
	* @example Passing custom headers
	* ```js
	* const { data, error } = await supabase.functions.invoke('hello', {
	*   headers: {
	*     "my-custom-header": 'my-custom-header-value'
	*   },
	*   body: { foo: 'bar' }
	* })
	* ```
	*
	* @exampleDescription Calling with DELETE HTTP verb
	* You can also set the HTTP verb to `DELETE` when calling your Edge Function.
	*
	* @example Calling with DELETE HTTP verb
	* ```js
	* const { data, error } = await supabase.functions.invoke('hello', {
	*   headers: {
	*     "my-custom-header": 'my-custom-header-value'
	*   },
	*   body: { foo: 'bar' },
	*   method: 'DELETE'
	* })
	* ```
	*
	* @exampleDescription Invoking a Function in the UsEast1 region
	* Here are the available regions:
	* - `FunctionRegion.Any`
	* - `FunctionRegion.ApNortheast1`
	* - `FunctionRegion.ApNortheast2`
	* - `FunctionRegion.ApSouth1`
	* - `FunctionRegion.ApSoutheast1`
	* - `FunctionRegion.ApSoutheast2`
	* - `FunctionRegion.CaCentral1`
	* - `FunctionRegion.EuCentral1`
	* - `FunctionRegion.EuWest1`
	* - `FunctionRegion.EuWest2`
	* - `FunctionRegion.EuWest3`
	* - `FunctionRegion.SaEast1`
	* - `FunctionRegion.UsEast1`
	* - `FunctionRegion.UsWest1`
	* - `FunctionRegion.UsWest2`
	*
	* @example Invoking a Function in the UsEast1 region
	* ```js
	* import { createClient, FunctionRegion } from '@supabase/supabase-js'
	*
	* const { data, error } = await supabase.functions.invoke('hello', {
	*   body: { foo: 'bar' },
	*   region: FunctionRegion.UsEast1
	* })
	* ```
	*
	* @exampleDescription Calling with GET HTTP verb
	* You can also set the HTTP verb to `GET` when calling your Edge Function.
	*
	* @example Calling with GET HTTP verb
	* ```js
	* const { data, error } = await supabase.functions.invoke('hello', {
	*   headers: {
	*     "my-custom-header": 'my-custom-header-value'
	*   },
	*   method: 'GET'
	* })
	* ```
	*
	* @example Standalone client invoke
	* ```ts
	* const { data, error } = await functions.invoke('hello-world', {
	*   body: { name: 'Ada' },
	* })
	* ```
	*/
	invoke(functionName_1) {
		return __awaiter(this, arguments, void 0, function* (functionName, options = {}) {
			var _a, _b;
			let timeoutId;
			let timeoutController;
			let onAbort;
			try {
				const { headers, method, body: functionArgs, signal, timeout } = options;
				let _headers = {};
				let { region } = options;
				if (!region) region = this.region;
				const url = new URL(`${this.url}/${functionName}`);
				if (region && region !== "any") {
					_headers["x-region"] = region;
					url.searchParams.set("forceFunctionRegion", region);
				}
				let body;
				const hasContentTypeHeader = !!headers && Object.keys(headers).some((key) => key.toLowerCase() === "content-type");
				if (functionArgs && !hasContentTypeHeader) {
					if (typeof Blob !== "undefined" && functionArgs instanceof Blob || functionArgs instanceof ArrayBuffer) {
						_headers["Content-Type"] = "application/octet-stream";
						body = functionArgs;
					} else if (typeof functionArgs === "string") {
						_headers["Content-Type"] = "text/plain";
						body = functionArgs;
					} else if (typeof FormData !== "undefined" && functionArgs instanceof FormData) body = functionArgs;
					else {
						_headers["Content-Type"] = "application/json";
						body = JSON.stringify(functionArgs);
					}
				} else if (functionArgs && typeof functionArgs !== "string" && !(typeof Blob !== "undefined" && functionArgs instanceof Blob) && !(functionArgs instanceof ArrayBuffer) && !(typeof FormData !== "undefined" && functionArgs instanceof FormData)) body = JSON.stringify(functionArgs);
				else body = functionArgs;
				let effectiveSignal = signal;
				if (timeout) {
					timeoutController = new AbortController();
					timeoutId = setTimeout(() => timeoutController.abort(), timeout);
					if (signal) {
						effectiveSignal = timeoutController.signal;
						onAbort = () => timeoutController.abort();
						signal.addEventListener("abort", onAbort);
					} else effectiveSignal = timeoutController.signal;
				}
				const response = yield this.fetch(url.toString(), {
					method: method || "POST",
					headers: Object.assign(Object.assign(Object.assign({}, _headers), this.headers), headers),
					body,
					signal: effectiveSignal
				}).catch((fetchError) => {
					throw new FunctionsFetchError(fetchError);
				});
				const isRelayError = response.headers.get("x-relay-error");
				if (isRelayError && isRelayError === "true") throw new FunctionsRelayError(response);
				if (!response.ok) throw new FunctionsHttpError(response);
				let responseType = ((_a = response.headers.get("Content-Type")) !== null && _a !== void 0 ? _a : "text/plain").split(";")[0].trim().toLowerCase();
				let data;
				if (responseType === "application/json") data = yield response.json();
				else if (responseType === "application/octet-stream" || responseType === "application/pdf") data = yield response.blob();
				else if (responseType === "text/event-stream") data = response;
				else if (responseType === "multipart/form-data") data = yield response.formData();
				else data = yield response.text();
				return {
					data,
					error: null,
					response
				};
			} catch (error) {
				return {
					data: null,
					error,
					response: error instanceof FunctionsHttpError || error instanceof FunctionsRelayError ? error.context : void 0
				};
			} finally {
				if (timeoutId) clearTimeout(timeoutId);
				if (onAbort) (_b = options.signal) === null || _b === void 0 || _b.removeEventListener("abort", onAbort);
			}
		});
	}
};
//#endregion
export { FunctionsClient };
