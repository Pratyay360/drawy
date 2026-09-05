if (typeof globalThis.requestAnimationFrame === "undefined") globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
if (typeof globalThis.cancelAnimationFrame === "undefined") globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
try {
	globalThis.requestAnimationFrame;
	globalThis.cancelAnimationFrame;
} catch (e) {}
import { Presence, Socket } from "./supabase__phoenix.mjs";
//#region node_modules/@supabase/realtime-js/dist/module/lib/websocket-factory.js
/**
* Utilities for creating WebSocket instances across runtimes.
*/
var WebSocketFactory = class {
	/**
	* Static-only utility – prevent instantiation.
	*/
	constructor() {}
	static detectEnvironment() {
		var _a;
		if (typeof WebSocket !== "undefined") return {
			type: "native",
			wsConstructor: WebSocket
		};
		const gt = globalThis;
		if (typeof globalThis !== "undefined" && typeof gt.WebSocket !== "undefined") return {
			type: "native",
			wsConstructor: gt.WebSocket
		};
		const gl = typeof global !== "undefined" ? global : void 0;
		if (gl && typeof gl.WebSocket !== "undefined") return {
			type: "native",
			wsConstructor: gl.WebSocket
		};
		if (typeof globalThis !== "undefined" && typeof gt.WebSocketPair !== "undefined" && typeof globalThis.WebSocket === "undefined") return {
			type: "cloudflare",
			error: "Cloudflare Workers detected. WebSocket clients are not supported in Cloudflare Workers.",
			workaround: "Use Cloudflare Workers WebSocket API for server-side WebSocket handling, or deploy to a different runtime."
		};
		if (typeof globalThis !== "undefined" && gt.EdgeRuntime || typeof navigator !== "undefined" && ((_a = navigator.userAgent) === null || _a === void 0 ? void 0 : _a.includes("Vercel-Edge"))) return {
			type: "unsupported",
			error: "Edge runtime detected (Vercel Edge/Netlify Edge). WebSockets are not supported in edge functions.",
			workaround: "Use serverless functions or a different deployment target for WebSocket functionality."
		};
		const _process = globalThis["process"];
		if (_process) {
			const processVersions = _process["versions"];
			if (processVersions && processVersions["node"]) return {
				type: "unsupported",
				error: "Node.js detected but native WebSocket not found.",
				workaround: "Ensure you are running Node.js 22+ or provide a WebSocket implementation via the transport option."
			};
		}
		return {
			type: "unsupported",
			error: "Unknown JavaScript runtime without WebSocket support.",
			workaround: "Ensure you're running in a supported environment (browser, Node.js, Deno) or provide a custom WebSocket implementation."
		};
	}
	/**
	* Returns the best available WebSocket constructor for the current runtime.
	*
	* @category Realtime
	*
	* @example Example with error handling
	* ```ts
	* try {
	*   const WS = WebSocketFactory.getWebSocketConstructor()
	*   const socket = new WS('wss://example.com/socket')
	* } catch (error) {
	*   console.error('WebSocket not available in this environment.', error)
	* }
	* ```
	*/
	static getWebSocketConstructor() {
		const env = this.detectEnvironment();
		if (env.wsConstructor) return env.wsConstructor;
		let errorMessage = env.error || "WebSocket not supported in this environment.";
		if (env.workaround) errorMessage += `\n\nSuggested solution: ${env.workaround}`;
		throw new Error(errorMessage);
	}
	/**
	* Detects whether the runtime can establish WebSocket connections.
	*
	* @category Realtime
	*
	* @example Example in a Node.js script
	* ```ts
	* if (!WebSocketFactory.isWebSocketSupported()) {
	*   console.error('WebSockets are required for this script.')
	*   process.exitCode = 1
	* }
	* ```
	*/
	static isWebSocketSupported() {
		try {
			return this.detectEnvironment().type === "native";
		} catch (_a) {
			return false;
		}
	}
};
//#endregion
//#region node_modules/@supabase/realtime-js/dist/module/lib/constants.js
var DEFAULT_VERSION = `realtime-js/2.115.0`;
var VSN_1_0_0 = "1.0.0";
var VSN_2_0_0 = "2.0.0";
var DEFAULT_VSN = VSN_2_0_0;
var DEFAULT_TIMEOUT = 1e4;
/** Mirrors the Realtime server's own default for `postgres_changes_options.timeout`. */
var DEFAULT_POSTGRES_CHANGES_WAIT_TIMEOUT = 15e3;
/**
* Headroom added to the join timeout when waiting on postgres_changes, covering the
* CHANNEL_ERROR_BACKOFF_MS sleep (5s by default) the server takes before rejecting a join.
*/
var POSTGRES_CHANGES_WAIT_ERROR_GRACE = 1e4;
var CHANNEL_STATES = {
	closed: "closed",
	errored: "errored",
	joined: "joined",
	joining: "joining",
	leaving: "leaving"
};
var CHANNEL_EVENTS = {
	close: "phx_close",
	error: "phx_error",
	join: "phx_join",
	reply: "phx_reply",
	leave: "phx_leave",
	access_token: "access_token"
};
var CONNECTION_STATE = {
	connecting: "connecting",
	open: "open",
	closing: "closing",
	closed: "closed"
};
//#endregion
//#region node_modules/@supabase/realtime-js/dist/module/lib/serializer.js
var Serializer = class {
	constructor(allowedMetadataKeys) {
		this.HEADER_LENGTH = 1;
		this.USER_BROADCAST_PUSH_META_LENGTH = 6;
		this.KINDS = {
			userBroadcastPush: 3,
			userBroadcast: 4
		};
		this.BINARY_ENCODING = 0;
		this.JSON_ENCODING = 1;
		this.BROADCAST_EVENT = "broadcast";
		this.allowedMetadataKeys = [];
		this.allowedMetadataKeys = allowedMetadataKeys !== null && allowedMetadataKeys !== void 0 ? allowedMetadataKeys : [];
	}
	encode(msg, callback) {
		if (msg.event === this.BROADCAST_EVENT && !(msg.payload instanceof ArrayBuffer) && typeof msg.payload.event === "string") return callback(this._binaryEncodeUserBroadcastPush(msg));
		let payload = [
			msg.join_ref,
			msg.ref,
			msg.topic,
			msg.event,
			msg.payload
		];
		return callback(JSON.stringify(payload));
	}
	_binaryEncodeUserBroadcastPush(message) {
		var _a;
		if (this._isArrayBuffer((_a = message.payload) === null || _a === void 0 ? void 0 : _a.payload)) return this._encodeBinaryUserBroadcastPush(message);
		else return this._encodeJsonUserBroadcastPush(message);
	}
	_encodeBinaryUserBroadcastPush(message) {
		var _a, _b;
		const userPayload = (_b = (_a = message.payload) === null || _a === void 0 ? void 0 : _a.payload) !== null && _b !== void 0 ? _b : /* @__PURE__ */ new ArrayBuffer(0);
		return this._encodeUserBroadcastPush(message, this.BINARY_ENCODING, userPayload);
	}
	_encodeJsonUserBroadcastPush(message) {
		var _a, _b;
		const userPayload = (_b = (_a = message.payload) === null || _a === void 0 ? void 0 : _a.payload) !== null && _b !== void 0 ? _b : {};
		const encodedUserPayload = new TextEncoder().encode(JSON.stringify(userPayload)).buffer;
		return this._encodeUserBroadcastPush(message, this.JSON_ENCODING, encodedUserPayload);
	}
	_encodeUserBroadcastPush(message, encodingType, encodedPayload) {
		var _a, _b;
		const encoder = new TextEncoder();
		const topic = encoder.encode(message.topic);
		const ref = encoder.encode((_a = message.ref) !== null && _a !== void 0 ? _a : "");
		const joinRef = encoder.encode((_b = message.join_ref) !== null && _b !== void 0 ? _b : "");
		const userEvent = encoder.encode(message.payload.event);
		const rest = this.allowedMetadataKeys ? this._pick(message.payload, this.allowedMetadataKeys) : {};
		const metadata = encoder.encode(Object.keys(rest).length === 0 ? "" : JSON.stringify(rest));
		if (joinRef.length > 255) throw new Error(`joinRef length ${joinRef.length} exceeds maximum of 255`);
		if (ref.length > 255) throw new Error(`ref length ${ref.length} exceeds maximum of 255`);
		if (topic.length > 255) throw new Error(`topic length ${topic.length} exceeds maximum of 255`);
		if (userEvent.length > 255) throw new Error(`userEvent length ${userEvent.length} exceeds maximum of 255`);
		if (metadata.length > 255) throw new Error(`metadata length ${metadata.length} exceeds maximum of 255`);
		const metaLength = this.USER_BROADCAST_PUSH_META_LENGTH + joinRef.length + ref.length + topic.length + userEvent.length + metadata.length;
		const header = new ArrayBuffer(this.HEADER_LENGTH + metaLength);
		const view = new DataView(header);
		const bytes = new Uint8Array(header);
		let offset = 0;
		view.setUint8(offset++, this.KINDS.userBroadcastPush);
		view.setUint8(offset++, joinRef.length);
		view.setUint8(offset++, ref.length);
		view.setUint8(offset++, topic.length);
		view.setUint8(offset++, userEvent.length);
		view.setUint8(offset++, metadata.length);
		view.setUint8(offset++, encodingType);
		bytes.set(joinRef, offset);
		offset += joinRef.length;
		bytes.set(ref, offset);
		offset += ref.length;
		bytes.set(topic, offset);
		offset += topic.length;
		bytes.set(userEvent, offset);
		offset += userEvent.length;
		bytes.set(metadata, offset);
		offset += metadata.length;
		var combined = new Uint8Array(header.byteLength + encodedPayload.byteLength);
		combined.set(new Uint8Array(header), 0);
		combined.set(new Uint8Array(encodedPayload), header.byteLength);
		return combined.buffer;
	}
	decode(rawPayload, callback) {
		if (this._isArrayBuffer(rawPayload)) return callback(this._binaryDecode(rawPayload));
		if (typeof rawPayload === "string") {
			const [join_ref, ref, topic, event, payload] = JSON.parse(rawPayload);
			return callback({
				join_ref,
				ref,
				topic,
				event,
				payload
			});
		}
		return callback({});
	}
	_binaryDecode(buffer) {
		const view = new DataView(buffer);
		const kind = view.getUint8(0);
		const decoder = new TextDecoder();
		switch (kind) {
			case this.KINDS.userBroadcast: return this._decodeUserBroadcast(buffer, view, decoder);
		}
	}
	_decodeUserBroadcast(buffer, view, decoder) {
		const topicSize = view.getUint8(1);
		const userEventSize = view.getUint8(2);
		const metadataSize = view.getUint8(3);
		const payloadEncoding = view.getUint8(4);
		let offset = this.HEADER_LENGTH + 4;
		const topic = decoder.decode(buffer.slice(offset, offset + topicSize));
		offset = offset + topicSize;
		const userEvent = decoder.decode(buffer.slice(offset, offset + userEventSize));
		offset = offset + userEventSize;
		const metadata = decoder.decode(buffer.slice(offset, offset + metadataSize));
		offset = offset + metadataSize;
		const payload = buffer.slice(offset, buffer.byteLength);
		const parsedPayload = payloadEncoding === this.JSON_ENCODING ? JSON.parse(decoder.decode(payload)) : payload;
		const data = {
			type: this.BROADCAST_EVENT,
			event: userEvent,
			payload: parsedPayload
		};
		if (metadataSize > 0) data["meta"] = JSON.parse(metadata);
		return {
			join_ref: null,
			ref: null,
			topic,
			event: this.BROADCAST_EVENT,
			payload: data
		};
	}
	_isArrayBuffer(buffer) {
		var _a;
		return buffer instanceof ArrayBuffer || ((_a = buffer === null || buffer === void 0 ? void 0 : buffer.constructor) === null || _a === void 0 ? void 0 : _a.name) === "ArrayBuffer";
	}
	_pick(obj, keys) {
		if (!obj || typeof obj !== "object") return {};
		return Object.fromEntries(Object.entries(obj).filter(([key]) => keys.includes(key)));
	}
};
//#endregion
//#region node_modules/@supabase/realtime-js/dist/module/lib/transformers.js
/**
* Helpers to convert the change Payload into native JS types.
*/
var PostgresTypes;
(function(PostgresTypes) {
	PostgresTypes["abstime"] = "abstime";
	PostgresTypes["bool"] = "bool";
	PostgresTypes["date"] = "date";
	PostgresTypes["daterange"] = "daterange";
	PostgresTypes["float4"] = "float4";
	PostgresTypes["float8"] = "float8";
	PostgresTypes["int2"] = "int2";
	PostgresTypes["int4"] = "int4";
	PostgresTypes["int4range"] = "int4range";
	PostgresTypes["int8"] = "int8";
	PostgresTypes["int8range"] = "int8range";
	PostgresTypes["json"] = "json";
	PostgresTypes["jsonb"] = "jsonb";
	PostgresTypes["money"] = "money";
	PostgresTypes["numeric"] = "numeric";
	PostgresTypes["oid"] = "oid";
	PostgresTypes["reltime"] = "reltime";
	PostgresTypes["text"] = "text";
	PostgresTypes["time"] = "time";
	PostgresTypes["timestamp"] = "timestamp";
	PostgresTypes["timestamptz"] = "timestamptz";
	PostgresTypes["timetz"] = "timetz";
	PostgresTypes["tsrange"] = "tsrange";
	PostgresTypes["tstzrange"] = "tstzrange";
})(PostgresTypes || (PostgresTypes = {}));
/**
* Takes an array of columns and an object of string values then converts each string value
* to its mapped type.
*
* @param {{name: String, type: String}[]} columns
* @param {Object} record
* @param {Object} options The map of various options that can be applied to the mapper
* @param {Array} options.skipTypes The array of types that should not be converted
*
* @example convertChangeData([{name: 'first_name', type: 'text'}, {name: 'age', type: 'int4'}], {first_name: 'Paul', age:'33'}, {})
* //=>{ first_name: 'Paul', age: 33 }
*/
var convertChangeData = (columns, record, options = {}) => {
	var _a;
	const skipTypes = (_a = options.skipTypes) !== null && _a !== void 0 ? _a : [];
	if (!record) return {};
	return Object.keys(record).reduce((acc, rec_key) => {
		acc[rec_key] = convertColumn(rec_key, columns, record, skipTypes);
		return acc;
	}, {});
};
/**
* Converts the value of an individual column.
*
* @param {String} columnName The column that you want to convert
* @param {{name: String, type: String}[]} columns All of the columns
* @param {Object} record The map of string values
* @param {Array} skipTypes An array of types that should not be converted
* @return {object} Useless information
*
* @example convertColumn('age', [{name: 'first_name', type: 'text'}, {name: 'age', type: 'int4'}], {first_name: 'Paul', age: '33'}, [])
* //=> 33
* @example convertColumn('age', [{name: 'first_name', type: 'text'}, {name: 'age', type: 'int4'}], {first_name: 'Paul', age: '33'}, ['int4'])
* //=> "33"
*/
var convertColumn = (columnName, columns, record, skipTypes) => {
	const column = columns.find((x) => x.name === columnName);
	const colType = column === null || column === void 0 ? void 0 : column.type;
	const value = record[columnName];
	if (colType && !skipTypes.includes(colType)) return convertCell(colType, value);
	return noop(value);
};
/**
* If the value of the cell is `null`, returns null.
* Otherwise converts the string value to the correct type.
* @param {String} type A postgres column type
* @param {String} value The cell value
*
* @example convertCell('bool', 't')
* //=> true
* @example convertCell('int8', '10')
* //=> 10
* @example convertCell('_int4', '{1,2,3,4}')
* //=> [1,2,3,4]
*/
var convertCell = (type, value) => {
	if (type.charAt(0) === "_") return toArray(value, type.slice(1, type.length));
	switch (type) {
		case PostgresTypes.bool: return toBoolean(value);
		case PostgresTypes.float4:
		case PostgresTypes.float8:
		case PostgresTypes.int2:
		case PostgresTypes.int4:
		case PostgresTypes.int8:
		case PostgresTypes.numeric:
		case PostgresTypes.oid: return toNumber(value);
		case PostgresTypes.json:
		case PostgresTypes.jsonb: return toJson(value);
		case PostgresTypes.timestamp: return toTimestampString(value);
		case PostgresTypes.abstime:
		case PostgresTypes.date:
		case PostgresTypes.daterange:
		case PostgresTypes.int4range:
		case PostgresTypes.int8range:
		case PostgresTypes.money:
		case PostgresTypes.reltime:
		case PostgresTypes.text:
		case PostgresTypes.time:
		case PostgresTypes.timestamptz:
		case PostgresTypes.timetz:
		case PostgresTypes.tsrange:
		case PostgresTypes.tstzrange: return noop(value);
		default: return noop(value);
	}
};
var noop = (value) => {
	return value;
};
var toBoolean = (value) => {
	switch (value) {
		case "t": return true;
		case "f": return false;
		default: return value;
	}
};
var toNumber = (value) => {
	if (typeof value === "string") {
		const parsedValue = parseFloat(value);
		if (!Number.isNaN(parsedValue)) return parsedValue;
	}
	return value;
};
var toJson = (value) => {
	if (typeof value === "string") try {
		return JSON.parse(value);
	} catch (_a) {
		return value;
	}
	return value;
};
/**
* Converts a Postgres Array into a native JS array
*
* @example toArray('{}', 'int4')
* //=> []
* @example toArray('{"[2021-01-01,2021-12-31)","(2021-01-01,2021-12-32]"}', 'daterange')
* //=> ['[2021-01-01,2021-12-31)', '(2021-01-01,2021-12-32]']
* @example toArray([1,2,3,4], 'int4')
* //=> [1,2,3,4]
*/
var toArray = (value, type) => {
	if (typeof value !== "string") return value;
	const lastIdx = value.length - 1;
	const closeBrace = value[lastIdx];
	if (value[0] === "{" && closeBrace === "}") {
		let arr;
		const valTrim = value.slice(1, lastIdx);
		try {
			arr = JSON.parse("[" + valTrim + "]");
		} catch (_) {
			arr = valTrim ? valTrim.split(",") : [];
		}
		return arr.map((val) => convertCell(type, val));
	}
	return value;
};
/**
* Fixes timestamp to be ISO-8601. Swaps the space between the date and time for a 'T'
* See https://github.com/supabase/supabase/issues/18
*
* @example toTimestampString('2019-09-10 00:00:00')
* //=> '2019-09-10T00:00:00'
*/
var toTimestampString = (value) => {
	if (typeof value === "string") return value.replace(" ", "T");
	return value;
};
var httpEndpointURL = (socketUrl) => {
	const wsUrl = new URL(socketUrl);
	wsUrl.protocol = wsUrl.protocol.replace(/^ws/i, "http");
	wsUrl.pathname = wsUrl.pathname.replace(/\/+$/, "").replace(/\/socket\/websocket$/i, "").replace(/\/socket$/i, "").replace(/\/websocket$/i, "");
	if (wsUrl.pathname === "" || wsUrl.pathname === "/") wsUrl.pathname = "/api/broadcast";
	else wsUrl.pathname = wsUrl.pathname + "/api/broadcast";
	return wsUrl.href;
};
//#endregion
//#region node_modules/@supabase/realtime-js/dist/module/phoenix/presenceAdapter.js
var PresenceAdapter = class PresenceAdapter {
	constructor(channel, opts) {
		const phoenixOptions = phoenixPresenceOptions(opts);
		this.presence = new Presence(channel.getChannel(), phoenixOptions);
		this.presence.onJoin((key, currentPresence, newPresence) => {
			const onJoinPayload = PresenceAdapter.onJoinPayload(key, currentPresence, newPresence);
			channel.getChannel().trigger("presence", onJoinPayload);
		});
		this.presence.onLeave((key, currentPresence, leftPresence) => {
			const onLeavePayload = PresenceAdapter.onLeavePayload(key, currentPresence, leftPresence);
			channel.getChannel().trigger("presence", onLeavePayload);
		});
		this.presence.onSync(() => {
			channel.getChannel().trigger("presence", { event: "sync" });
		});
	}
	get state() {
		return PresenceAdapter.transformState(this.presence.state);
	}
	/**
	* @private
	* Remove 'metas' key
	* Change 'phx_ref' to 'presence_ref'
	* Remove 'phx_ref' and 'phx_ref_prev'
	*
	* @example Transform state
	* // returns {
	*  abc123: [
	*    { presence_ref: '2', user_id: 1 },
	*    { presence_ref: '3', user_id: 2 }
	*  ]
	* }
	* RealtimePresence.transformState({
	*  abc123: {
	*    metas: [
	*      { phx_ref: '2', phx_ref_prev: '1' user_id: 1 },
	*      { phx_ref: '3', user_id: 2 }
	*    ]
	*  }
	* })
	*
	*/
	static transformState(state) {
		state = cloneState(state);
		return Object.getOwnPropertyNames(state).reduce((newState, key) => {
			const presences = state[key];
			newState[key] = transformState(presences);
			return newState;
		}, {});
	}
	static onJoinPayload(key, currentPresence, newPresence) {
		return {
			event: "join",
			key,
			currentPresences: parseCurrentPresences(currentPresence),
			newPresences: transformState(newPresence)
		};
	}
	static onLeavePayload(key, currentPresence, leftPresence) {
		return {
			event: "leave",
			key,
			currentPresences: parseCurrentPresences(currentPresence),
			leftPresences: transformState(leftPresence)
		};
	}
};
function transformState(presences) {
	return presences.metas.map((presence) => {
		const descriptors = Object.getOwnPropertyDescriptors(presence);
		const transformedPresence = Object.defineProperties({}, descriptors);
		transformedPresence["presence_ref"] = transformedPresence["phx_ref"];
		delete transformedPresence["phx_ref"];
		delete transformedPresence["phx_ref_prev"];
		return transformedPresence;
	});
}
function cloneState(state) {
	return JSON.parse(JSON.stringify(state));
}
function phoenixPresenceOptions(opts) {
	return (opts === null || opts === void 0 ? void 0 : opts.events) && { events: opts.events };
}
function parseCurrentPresences(currentPresences) {
	return (currentPresences === null || currentPresences === void 0 ? void 0 : currentPresences.metas) ? transformState(currentPresences) : [];
}
//#endregion
//#region node_modules/@supabase/realtime-js/dist/module/RealtimePresence.js
var REALTIME_PRESENCE_LISTEN_EVENTS;
(function(REALTIME_PRESENCE_LISTEN_EVENTS) {
	REALTIME_PRESENCE_LISTEN_EVENTS["SYNC"] = "sync";
	REALTIME_PRESENCE_LISTEN_EVENTS["JOIN"] = "join";
	REALTIME_PRESENCE_LISTEN_EVENTS["LEAVE"] = "leave";
})(REALTIME_PRESENCE_LISTEN_EVENTS || (REALTIME_PRESENCE_LISTEN_EVENTS = {}));
var RealtimePresence = class {
	get state() {
		return this.presenceAdapter.state;
	}
	/**
	* Creates a Presence helper that keeps the local presence state in sync with the server.
	*
	* @param channel - The realtime channel to bind to.
	* @param opts - Optional custom event names, e.g. `{ events: { state: 'state', diff: 'diff' } }`.
	*
	* @category Realtime
	*
	* @example Example for a presence channel
	* ```ts
	* const presence = new RealtimePresence(channel)
	*
	* channel.on('presence', ({ event, key }) => {
	*   console.log(`Presence ${event} on ${key}`)
	* })
	* ```
	*/
	constructor(channel, opts) {
		this.channel = channel;
		this.presenceAdapter = new PresenceAdapter(this.channel.channelAdapter, opts);
	}
};
//#endregion
//#region node_modules/@supabase/realtime-js/dist/module/lib/normalizeChannelError.js
/**
* Normalize the various shapes a channel error reason can take into a real `Error`.
*
* Transport-level channel errors arrive as a `CloseEvent`, a transport `Event`, an `Error`,
* a string, or `undefined` depending on which path in the underlying socket fired. Server-reply
* errors arrive as a payload object. This helper produces a consistent `Error` for every case
* and preserves the original via `cause` so callers can still inspect the raw event.
*/
function normalizeChannelError(reason) {
	if (reason instanceof Error) return reason;
	if (typeof reason === "string") return new Error(reason);
	if (reason && typeof reason === "object") {
		const obj = reason;
		if (typeof obj.code === "number") {
			const detail = typeof obj.reason === "string" && obj.reason ? ` (${obj.reason})` : "";
			return new Error(`socket closed: ${obj.code}${detail}`, { cause: reason });
		}
		return new Error("channel error: transport failure", { cause: reason });
	}
	return /* @__PURE__ */ new Error("channel error: connection lost");
}
//#endregion
//#region node_modules/@supabase/realtime-js/dist/module/phoenix/channelAdapter.js
var ChannelAdapter = class {
	constructor(socket, topic, params) {
		const phoenixParams = phoenixChannelParams(params);
		this.channel = socket.getSocket().channel(topic, phoenixParams);
		this.socket = socket;
	}
	get state() {
		return this.channel.state;
	}
	set state(state) {
		this.channel.state = state;
	}
	get joinedOnce() {
		return this.channel.joinedOnce;
	}
	get joinPush() {
		return this.channel.joinPush;
	}
	get rejoinTimer() {
		return this.channel.rejoinTimer;
	}
	on(event, callback) {
		return this.channel.on(event, callback);
	}
	off(event, refNumber) {
		this.channel.off(event, refNumber);
	}
	subscribe(timeout) {
		return this.channel.join(timeout);
	}
	unsubscribe(timeout) {
		return this.channel.leave(timeout);
	}
	teardown() {
		this.channel.teardown();
	}
	onClose(callback) {
		this.channel.onClose(callback);
	}
	onError(callback) {
		return this.channel.onError(callback);
	}
	push(event, payload, timeout) {
		let push;
		try {
			push = this.channel.push(event, payload, timeout);
		} catch (error) {
			throw new Error(`tried to push '${event}' to '${this.channel.topic}' before joining. Use channel.subscribe() before pushing events`);
		}
		if (this.channel.pushBuffer.length > 100) {
			const removedPush = this.channel.pushBuffer.shift();
			removedPush.cancelTimeout();
			this.socket.log("channel", `discarded push due to buffer overflow: ${removedPush.event}`, removedPush.payload());
		}
		return push;
	}
	updateJoinPayload(payload) {
		const oldPayload = this.channel.joinPush.payload();
		this.channel.joinPush.payload = () => Object.assign(Object.assign({}, oldPayload), payload);
	}
	canPush() {
		return this.socket.isConnected() && this.state === CHANNEL_STATES.joined;
	}
	isJoined() {
		return this.state === CHANNEL_STATES.joined;
	}
	isJoining() {
		return this.state === CHANNEL_STATES.joining;
	}
	isClosed() {
		return this.state === CHANNEL_STATES.closed;
	}
	isLeaving() {
		return this.state === CHANNEL_STATES.leaving;
	}
	updateFilterBindings(filterBindings) {
		this.channel.filterBindings = filterBindings;
	}
	updatePayloadTransform(callback) {
		this.channel.onMessage = callback;
	}
	/**
	* @internal
	*/
	getChannel() {
		return this.channel;
	}
};
function phoenixChannelParams(options) {
	return { config: Object.assign({
		broadcast: {
			ack: false,
			self: false
		},
		presence: {
			key: "",
			enabled: false
		},
		private: false
	}, options.config) };
}
//#endregion
//#region node_modules/@supabase/realtime-js/dist/module/RealtimePostgresFilterBuilder.js
var PostgrestReservedCharsRegexp = /[,()"\\]/;
var needsQuoting = (value) => PostgrestReservedCharsRegexp.test(value) || value !== value.trim();
var quote = (value) => `"${value.replace(/\\/g, "\\\\").replace(/"/g, "\\\"")}"`;
var serializeScalar = (value) => {
	const serialized = value === null ? "null" : String(value);
	return needsQuoting(serialized) ? quote(serialized) : serialized;
};
var serializeIsValue = (value) => value === null ? "null" : String(value);
var serialize = (operator, value) => {
	if (operator === "in") {
		const values = Array.isArray(value) ? value : [value];
		if (values.length === 0) throw new Error("Realtime `in` filter requires at least one value.");
		return `in.(${Array.from(new Set(values)).map((v) => serializeScalar(v)).join(",")})`;
	}
	if (operator === "is") return `is.${serializeIsValue(value)}`;
	return `${operator}.${serializeScalar(value)}`;
};
/**
* Fluent builder for Postgres Changes `filter` strings.
*
* Each method appends a single `column=operator.value` condition. Multiple
* conditions are combined with commas, which the Realtime server applies as an
* `AND`. Pass an instance straight to `channel.on('postgres_changes', …)` — the
* SDK serializes it to a string automatically — or call {@link build} to obtain
* the string yourself.
*
* The builder mirrors the `postgrest-js` filter API (`eq`, `neq`, `in`, `like`,
* `not`, …) for the operators that Realtime supports. Values containing reserved
* characters (`,`, `(`, `)`, `"`, `\`) — or surrounding whitespace — are
* automatically double-quoted and escaped the same way PostgREST does, so they
* survive the server's filter parser; all other values are sent verbatim.
*
* The filter is snapshotted when passed to `channel.on(...)`; mutating the
* builder afterwards does not affect an existing subscription. An empty builder
* serializes to `''`, which the server treats as "no filter".
*
* @example
* channel.on('postgres_changes', {
*   event: '*',
*   schema: 'public',
*   table: 'users',
*   filter: postgresChangesFilter().eq('id', 1).lt('age', 30), // → 'id=eq.1,age=lt.30'
* }, (payload) => { ... })
*/
var RealtimePostgresFilterBuilder = class {
	constructor() {
		this.filters = [];
	}
	add(column, operator, value, negate = false) {
		const prefix = negate ? "not." : "";
		this.filters.push(`${column}=${prefix}${serialize(operator, value)}`);
		return this;
	}
	/** Match rows where `column` equals `value` (`column=eq.value`). */
	eq(column, value) {
		return this.add(column, "eq", value);
	}
	/** Match rows where `column` does not equal `value` (`column=neq.value`). */
	neq(column, value) {
		return this.add(column, "neq", value);
	}
	/** Match rows where `column` is greater than `value` (`column=gt.value`). */
	gt(column, value) {
		return this.add(column, "gt", value);
	}
	/** Match rows where `column` is greater than or equal to `value` (`column=gte.value`). */
	gte(column, value) {
		return this.add(column, "gte", value);
	}
	/** Match rows where `column` is less than `value` (`column=lt.value`). */
	lt(column, value) {
		return this.add(column, "lt", value);
	}
	/** Match rows where `column` is less than or equal to `value` (`column=lte.value`). */
	lte(column, value) {
		return this.add(column, "lte", value);
	}
	/**
	* Match rows where `column` is one of `values` (`column=in.(a,b,c)`).
	* Requires at least one value; duplicates are removed. An element containing a
	* reserved character is double-quoted (`in.("a,b",c)`), so commas inside an
	* element are preserved. `null` is intentionally not accepted (`IN (null)`
	* never matches in SQL) — use `is`/`not('col','is',null)` for null checks.
	*/
	in(column, values) {
		return this.add(column, "in", values);
	}
	/** Match rows where `column` matches the case-sensitive `pattern` (`column=like.pattern`). */
	like(column, pattern) {
		return this.add(column, "like", pattern);
	}
	/** Match rows where `column` matches the case-insensitive `pattern` (`column=ilike.pattern`). */
	ilike(column, pattern) {
		return this.add(column, "ilike", pattern);
	}
	/** Match rows where `column` matches the POSIX regex `pattern` (`column=match.pattern`). */
	match(column, pattern) {
		return this.add(column, "match", pattern);
	}
	/** Match rows where `column` matches the case-insensitive POSIX regex `pattern` (`column=imatch.pattern`). */
	imatch(column, pattern) {
		return this.add(column, "imatch", pattern);
	}
	/**
	* Match rows where `column` `IS` the given value (`column=is.null`).
	* Accepts `null`, a boolean, or the keywords `'null' | 'true' | 'false' | 'unknown'`.
	*/
	is(column, value) {
		return this.add(column, "is", value);
	}
	/** Match rows where `column` is distinct from `value` (`column=isdistinct.value`). NULL-safe inequality. */
	isDistinct(column, value) {
		return this.add(column, "isdistinct", value);
	}
	not(column, operator, value) {
		return this.add(column, operator, value, true);
	}
	/**
	* Serialize all conditions into the comma-separated (AND) filter string.
	*
	* Conditions are joined by commas, which the server applies as `AND`. A scalar
	* value (or single `in` element) that contains a reserved character — `,`,
	* `(`, `)`, `"`, `\` — or surrounding whitespace is double-quoted and escaped
	* the way PostgREST does, so commas inside a value are preserved rather than
	* read as a condition boundary.
	*/
	build() {
		return this.filters.join(",");
	}
	/** Alias for {@link build}; lets the builder be used wherever a string is expected. */
	toString() {
		return this.build();
	}
};
//#endregion
//#region node_modules/@supabase/realtime-js/dist/module/RealtimeChannel.js
var REALTIME_POSTGRES_CHANGES_LISTEN_EVENT;
(function(REALTIME_POSTGRES_CHANGES_LISTEN_EVENT) {
	REALTIME_POSTGRES_CHANGES_LISTEN_EVENT["ALL"] = "*";
	REALTIME_POSTGRES_CHANGES_LISTEN_EVENT["INSERT"] = "INSERT";
	REALTIME_POSTGRES_CHANGES_LISTEN_EVENT["UPDATE"] = "UPDATE";
	REALTIME_POSTGRES_CHANGES_LISTEN_EVENT["DELETE"] = "DELETE";
})(REALTIME_POSTGRES_CHANGES_LISTEN_EVENT || (REALTIME_POSTGRES_CHANGES_LISTEN_EVENT = {}));
var REALTIME_LISTEN_TYPES;
(function(REALTIME_LISTEN_TYPES) {
	REALTIME_LISTEN_TYPES["BROADCAST"] = "broadcast";
	REALTIME_LISTEN_TYPES["PRESENCE"] = "presence";
	REALTIME_LISTEN_TYPES["POSTGRES_CHANGES"] = "postgres_changes";
	REALTIME_LISTEN_TYPES["SYSTEM"] = "system";
})(REALTIME_LISTEN_TYPES || (REALTIME_LISTEN_TYPES = {}));
var REALTIME_SUBSCRIBE_STATES;
(function(REALTIME_SUBSCRIBE_STATES) {
	REALTIME_SUBSCRIBE_STATES["SUBSCRIBED"] = "SUBSCRIBED";
	REALTIME_SUBSCRIBE_STATES["TIMED_OUT"] = "TIMED_OUT";
	REALTIME_SUBSCRIBE_STATES["CLOSED"] = "CLOSED";
	REALTIME_SUBSCRIBE_STATES["CHANNEL_ERROR"] = "CHANNEL_ERROR";
})(REALTIME_SUBSCRIBE_STATES || (REALTIME_SUBSCRIBE_STATES = {}));
/** A channel is the basic building block of Realtime
* and narrows the scope of data flow to subscribed clients.
* You can think of a channel as a chatroom where participants are able to see who's online
* and send and receive messages.
*/
var RealtimeChannel = class RealtimeChannel {
	get state() {
		return this.channelAdapter.state;
	}
	set state(state) {
		this.channelAdapter.state = state;
	}
	get joinedOnce() {
		return this.channelAdapter.joinedOnce;
	}
	get timeout() {
		return this.socket.timeout;
	}
	get joinPush() {
		return this.channelAdapter.joinPush;
	}
	get rejoinTimer() {
		return this.channelAdapter.rejoinTimer;
	}
	/**
	* Creates a channel that can broadcast messages, sync presence, and listen to Postgres changes.
	*
	* The topic determines which realtime stream you are subscribing to. Config options let you
	* enable acknowledgement for broadcasts, presence tracking, or private channels.
	*
	* @category Realtime
	*
	* @example Using supabase-js (recommended)
	* ```ts
	* import { createClient } from '@supabase/supabase-js'
	*
	* const supabase = createClient('https://xyzcompany.supabase.co', 'your-publishable-key')
	* const channel = supabase.channel('room1')
	* channel
	*   .on('broadcast', { event: 'cursor-pos' }, (payload) => console.log(payload))
	*   .subscribe()
	* ```
	*
	* @example Standalone import for bundle-sensitive environments
	* ```ts
	* import RealtimeClient from '@supabase/realtime-js'
	*
	* const client = new RealtimeClient('https://xyzcompany.supabase.co/realtime/v1', {
	*   params: { apikey: 'your-publishable-key' },
	* })
	* const channel = new RealtimeChannel('realtime:public:messages', { config: {} }, client)
	* ```
	*/
	constructor(topic, params = { config: {} }, socket) {
		var _a, _b;
		this.topic = topic;
		this.params = params;
		this.socket = socket;
		this.bindings = {};
		this.subTopic = topic.replace(/^realtime:/i, "");
		this.params.config = Object.assign({
			broadcast: {
				ack: false,
				self: false
			},
			presence: {
				key: "",
				enabled: false
			},
			private: false
		}, params.config);
		this.channelAdapter = new ChannelAdapter(this.socket.socketAdapter, topic, this.params);
		this.presence = new RealtimePresence(this);
		this._onClose(() => {
			this.socket._remove(this);
		});
		this._updateFilterTransform();
		this.broadcastEndpointURL = httpEndpointURL(this.socket.socketAdapter.endPointURL());
		this.private = this.params.config.private || false;
		if (!this.private && ((_b = (_a = this.params.config) === null || _a === void 0 ? void 0 : _a.broadcast) === null || _b === void 0 ? void 0 : _b.replay)) throw new Error(`tried to use replay on public channel '${this.topic}'. It must be a private channel.`);
	}
	/**
	* Subscribe registers your client with the server.
	*
	* The optional `callback` receives a `status` and, on failure, an `err` argument.
	* Log the full `err` so its `cause`, `name`, and any structured fields aren't hidden
	* behind `err.message`.
	*
	* @category Realtime
	*
	* @example Handling errors
	* ```js
	* supabase.channel('room1').subscribe((status, err) => {
	*   if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
	*     // Log the full error: its `cause` often holds the underlying reason.
	*     console.error(status, err)
	*   }
	* })
	* ```
	*/
	subscribe(callback, timeout = this.timeout) {
		var _a, _b, _c, _d;
		if (!this.socket.isConnected()) this.socket.connect();
		if (this.channelAdapter.isClosed()) {
			const { config: { broadcast, presence, private: isPrivate, postgres_changes_options } } = this.params;
			const postgres_changes = (_b = (_a = this.bindings.postgres_changes) === null || _a === void 0 ? void 0 : _a.map((r) => r.filter)) !== null && _b !== void 0 ? _b : [];
			const presence_enabled = !!this.bindings[REALTIME_LISTEN_TYPES.PRESENCE] && this.bindings[REALTIME_LISTEN_TYPES.PRESENCE].length > 0 || ((_c = this.params.config.presence) === null || _c === void 0 ? void 0 : _c.enabled) === true;
			const accessTokenPayload = {};
			const config = Object.assign({
				broadcast,
				presence: Object.assign(Object.assign({}, presence), { enabled: presence_enabled }),
				postgres_changes,
				private: isPrivate
			}, postgres_changes_options ? { postgres_changes_options } : {});
			if (this.socket.accessTokenValue) accessTokenPayload.access_token = this.socket.accessTokenValue;
			this._onError((reason) => {
				callback === null || callback === void 0 || callback(REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR, normalizeChannelError(reason));
			});
			this._onClose(() => callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.CLOSED));
			this.updateJoinPayload(Object.assign({ config }, accessTokenPayload));
			this._updateFilterMessage();
			const joinTimeout = (postgres_changes_options === null || postgres_changes_options === void 0 ? void 0 : postgres_changes_options.wait) && postgres_changes.length > 0 ? Math.max(timeout, ((_d = postgres_changes_options.timeout) !== null && _d !== void 0 ? _d : DEFAULT_POSTGRES_CHANGES_WAIT_TIMEOUT) + POSTGRES_CHANGES_WAIT_ERROR_GRACE) : timeout;
			this.channelAdapter.subscribe(joinTimeout).receive("ok", async ({ postgres_changes }) => {
				if (!this.socket._isManualToken()) this.socket.setAuth();
				if (postgres_changes === void 0) {
					callback === null || callback === void 0 || callback(REALTIME_SUBSCRIBE_STATES.SUBSCRIBED);
					return;
				}
				this._updatePostgresBindings(postgres_changes, callback);
			}).receive("error", (error) => {
				this.state = CHANNEL_STATES.errored;
				const message = Object.values(error).join(", ") || "error";
				callback === null || callback === void 0 || callback(REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR, new Error(message, { cause: error }));
			}).receive("timeout", () => {
				callback === null || callback === void 0 || callback(REALTIME_SUBSCRIBE_STATES.TIMED_OUT);
			});
		}
		return this;
	}
	_updatePostgresBindings(postgres_changes, callback) {
		var _a;
		const clientPostgresBindings = this.bindings.postgres_changes;
		const bindingsLen = (_a = clientPostgresBindings === null || clientPostgresBindings === void 0 ? void 0 : clientPostgresBindings.length) !== null && _a !== void 0 ? _a : 0;
		const newPostgresBindings = [];
		for (let i = 0; i < bindingsLen; i++) {
			const clientPostgresBinding = clientPostgresBindings[i];
			const { filter: { event, schema, table, filter } } = clientPostgresBinding;
			const serverPostgresFilter = postgres_changes && postgres_changes[i];
			if (serverPostgresFilter && serverPostgresFilter.event === event && RealtimeChannel.isFilterValueEqual(serverPostgresFilter.schema, schema) && RealtimeChannel.isFilterValueEqual(serverPostgresFilter.table, table) && RealtimeChannel.isFilterValueEqual(serverPostgresFilter.filter, filter)) newPostgresBindings.push(Object.assign(Object.assign({}, clientPostgresBinding), { id: serverPostgresFilter.id }));
			else {
				this.unsubscribe();
				this.state = CHANNEL_STATES.errored;
				callback === null || callback === void 0 || callback(REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR, /* @__PURE__ */ new Error("mismatch between server and client bindings for postgres changes"));
				return;
			}
		}
		this.bindings.postgres_changes = newPostgresBindings;
		if (this.state != CHANNEL_STATES.errored && callback) callback(REALTIME_SUBSCRIBE_STATES.SUBSCRIBED);
	}
	/**
	* Returns the current presence state for this channel.
	*
	* The shape is a map keyed by presence key (for example a user id) where each entry contains the
	* tracked metadata for that user.
	*
	* @category Realtime
	*/
	presenceState() {
		return this.presence.state;
	}
	/**
	* Sends the supplied payload to the presence tracker so other subscribers can see that this
	* client is online. Use `untrack` to stop broadcasting presence for the same key.
	*
	* Tracking makes this client visible to other subscribers immediately, regardless of this
	* channel's `config.presence.enabled` setting or whether it has a `presence` listener — that
	* flag only affects whether *this* client receives presence updates from others (and, on
	* RLS-protected channels, whether it's authorized to do so).
	*
	* @category Realtime
	*/
	async track(payload, opts = {}) {
		return await this.send({
			type: "presence",
			event: "track",
			payload
		}, opts);
	}
	/**
	* Removes the current presence state for this client.
	*
	* @category Realtime
	*/
	async untrack(opts = {}) {
		return await this.send({
			type: "presence",
			event: "untrack"
		}, opts);
	}
	/**
	* Listen to realtime events on this channel.
	* @category Realtime
	*
	* @remarks
	* - By default, Broadcast and Presence are enabled for all projects.
	* - By default, listening to database changes is disabled for new projects due to database performance and security concerns. You can turn it on by managing Realtime's [replication](/docs/guides/api#realtime-api-overview).
	* - You can receive the "previous" data for updates and deletes by setting the table's `REPLICA IDENTITY` to `FULL` (e.g., `ALTER TABLE your_table REPLICA IDENTITY FULL;`).
	* - Row level security is not applied to delete statements. When RLS is enabled and replica identity is set to full, only the primary key is sent to clients.
	*
	* @example Listen to broadcast messages
	* ```js
	* const channel = supabase.channel("room1")
	*
	* channel.on("broadcast", { event: "cursor-pos" }, (payload) => {
	*   console.log("Cursor position received!", payload);
	* }).subscribe((status) => {
	*   if (status === "SUBSCRIBED") {
	*     channel.send({
	*       type: "broadcast",
	*       event: "cursor-pos",
	*       payload: { x: Math.random(), y: Math.random() },
	*     });
	*   }
	* });
	* ```
	*
	* @example Listen to presence sync
	* ```js
	* const channel = supabase.channel('room1')
	* channel
	*   .on('presence', { event: 'sync' }, () => {
	*     console.log('Synced presence state: ', channel.presenceState())
	*   })
	*   .subscribe(async (status) => {
	*     if (status === 'SUBSCRIBED') {
	*       await channel.track({ online_at: new Date().toISOString() })
	*     }
	*   })
	* ```
	*
	* @example Listen to presence join
	* ```js
	* const channel = supabase.channel('room1')
	* channel
	*   .on('presence', { event: 'join' }, ({ newPresences }) => {
	*     console.log('Newly joined presences: ', newPresences)
	*   })
	*   .subscribe(async (status) => {
	*     if (status === 'SUBSCRIBED') {
	*       await channel.track({ online_at: new Date().toISOString() })
	*     }
	*   })
	* ```
	*
	* @example Listen to presence leave
	* ```js
	* const channel = supabase.channel('room1')
	* channel
	*   .on('presence', { event: 'leave' }, ({ leftPresences }) => {
	*     console.log('Newly left presences: ', leftPresences)
	*   })
	*   .subscribe(async (status) => {
	*     if (status === 'SUBSCRIBED') {
	*       await channel.track({ online_at: new Date().toISOString() })
	*       await channel.untrack()
	*     }
	*   })
	* ```
	*
	* Registering the same `postgres_changes` filter more than once on a channel is a no-op: the
	* duplicate is ignored and an error is logged, since the server only ever creates one
	* subscription per distinct filter.
	*
	* @example Listen to all database changes
	* ```js
	* supabase
	*   .channel('room1')
	*   .on('postgres_changes', { event: '*', schema: '*' }, payload => {
	*     console.log('Change received!', payload)
	*   })
	*   .subscribe()
	* ```
	*
	* @example Listen to a specific table
	* ```js
	* supabase
	*   .channel('room1')
	*   .on('postgres_changes', { event: '*', schema: 'public', table: 'countries' }, payload => {
	*     console.log('Change received!', payload)
	*   })
	*   .subscribe()
	* ```
	*
	* @example Listen to inserts
	* ```js
	* supabase
	*   .channel('room1')
	*   .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'countries' }, payload => {
	*     console.log('Change received!', payload)
	*   })
	*   .subscribe()
	* ```
	*
	* @exampleDescription Listen to updates
	* By default, Supabase will send only the updated record. If you want to receive the previous values as well you can
	* enable full replication for the table you are listening to:
	*
	* ```sql
	* alter table "your_table" replica identity full;
	* ```
	*
	* @example Listen to updates
	* ```js
	* supabase
	*   .channel('room1')
	*   .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'countries' }, payload => {
	*     console.log('Change received!', payload)
	*   })
	*   .subscribe()
	* ```
	*
	* @exampleDescription Listen to deletes
	* By default, Supabase does not send deleted records. If you want to receive the deleted record you can
	* enable full replication for the table you are listening to:
	*
	* ```sql
	* alter table "your_table" replica identity full;
	* ```
	*
	* @example Listen to deletes
	* ```js
	* supabase
	*   .channel('room1')
	*   .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'countries' }, payload => {
	*     console.log('Change received!', payload)
	*   })
	*   .subscribe()
	* ```
	*
	* @exampleDescription Listen to multiple events
	* You can chain listeners if you want to listen to multiple events for each table.
	*
	* @example Listen to multiple events
	* ```js
	* supabase
	*   .channel('room1')
	*   .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'countries' }, handleRecordInserted)
	*   .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'countries' }, handleRecordDeleted)
	*   .subscribe()
	* ```
	*
	* @exampleDescription Listen to row level changes
	* You can listen to individual rows using the format `{table}:{col}=eq.{val}` - where `{col}` is the column name, and `{val}` is the value which you want to match.
	*
	* @example Listen to row level changes
	* ```js
	* supabase
	*   .channel('room1')
	*   .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'countries', filter: 'id=eq.200' }, handleRecordUpdated)
	*   .subscribe()
	* ```
	*/
	on(type, filter, callback) {
		const stateCheck = this.channelAdapter.isJoined() || this.channelAdapter.isJoining();
		const typeCheck = type === REALTIME_LISTEN_TYPES.PRESENCE || type === REALTIME_LISTEN_TYPES.POSTGRES_CHANGES;
		if (stateCheck && typeCheck) {
			this.socket.log("channel", `cannot add \`${type}\` callbacks for ${this.topic} after \`subscribe()\`.`);
			throw new Error(`cannot add \`${type}\` callbacks for ${this.topic} after \`subscribe()\`.`);
		}
		return this._on(type, filter, callback);
	}
	/**
	* Sends a broadcast message explicitly via REST API.
	*
	* This method always uses the REST API endpoint regardless of WebSocket connection state.
	* Useful when you want to guarantee REST delivery or when gradually migrating from implicit REST fallback.
	*
	* Payloads that are `ArrayBuffer` or `ArrayBufferView` (e.g. `Uint8Array`) are sent as
	* `application/octet-stream`; all other payloads are JSON-encoded.
	*
	* @param event The name of the broadcast event
	* @param payload Payload to be sent (required)
	* @param opts Options including timeout
	* @returns Promise resolving to object with success status, and error details if failed
	*
	* @category Realtime
	*/
	async httpSend(event, payload, opts = {}) {
		var _a;
		if (payload === void 0 || payload === null) return Promise.reject(/* @__PURE__ */ new Error("Payload is required for httpSend()"));
		const isBinary = payload instanceof ArrayBuffer || ArrayBuffer.isView(payload);
		const headers = {
			apikey: this.socket.apiKey ? this.socket.apiKey : "",
			"Content-Type": isBinary ? "application/octet-stream" : "application/json"
		};
		if (this.socket.accessTokenValue) headers["Authorization"] = `Bearer ${this.socket.accessTokenValue}`;
		const url = new URL(this.broadcastEndpointURL);
		url.pathname += `/${encodeURIComponent(this.subTopic)}/events/${encodeURIComponent(event)}`;
		if (this.private) url.searchParams.set("private", "true");
		const options = {
			method: "POST",
			headers,
			body: isBinary ? payload : JSON.stringify(payload)
		};
		const response = await this._fetchWithTimeout(url.toString(), options, (_a = opts.timeout) !== null && _a !== void 0 ? _a : this.timeout);
		if (response.status === 202) return { success: true };
		if (response.status === 404) return Promise.reject(/* @__PURE__ */ new Error("httpSend() requires Realtime server v2.97.0 or newer; the endpoint returned 404. Update your Supabase CLI to a recent version, or upgrade the Realtime server in your self-hosted setup. See https://github.com/supabase/supabase-js/blob/master/packages/core/realtime-js/migrations/httpsend-server-version.md"));
		let errorMessage = response.statusText;
		try {
			const errorBody = await response.json();
			errorMessage = errorBody.error || errorBody.message || errorMessage;
		} catch (_b) {}
		return Promise.reject(new Error(errorMessage));
	}
	/**
	* Sends a message into the channel.
	*
	* @param args Arguments to send to channel
	* @param args.type The type of event to send
	* @param args.event The name of the event being sent
	* @param args.payload Payload to be sent
	* @param opts Options to be used during the send process
	*
	* @category Realtime
	*
	* @remarks
	* - When using REST you don't need to subscribe to the channel
	* - REST calls are only available from 2.37.0 onwards
	* - If you create a channel only to send a REST broadcast, remove it from
	*   the client when the send completes
	*
	* @example Send a message via websocket
	* ```js
	* const channel = supabase.channel('room1')
	*
	* channel.subscribe((status) => {
	*   if (status === 'SUBSCRIBED') {
	*     channel.send({
	*       type: 'broadcast',
	*       event: 'cursor-pos',
	*       payload: { x: Math.random(), y: Math.random() },
	*     })
	*   }
	* })
	* ```
	*
	* @exampleResponse Send a message via websocket
	* ```js
	* ok | timed out | error
	* ```
	*
	* @example Send a message via REST
	* ```js
	* const channel = supabase.channel('room1')
	*
	* try {
	*   await channel.httpSend('cursor-pos', { x: Math.random(), y: Math.random() })
	* } finally {
	*   await supabase.removeChannel(channel)
	* }
	* ```
	*/
	async send(args, opts = {}) {
		var _a, _b;
		if (!this.channelAdapter.canPush() && args.type === "broadcast") {
			const fallbackWarning = "Realtime send() is automatically falling back to REST API. This behavior will be deprecated in the future. Please use httpSend() explicitly for REST delivery.";
			if (this.socket.hasLogger()) this.socket.log("channel", fallbackWarning);
			else console.warn(fallbackWarning);
			const { event, payload: endpoint_payload } = args;
			const headers = {
				apikey: this.socket.apiKey ? this.socket.apiKey : "",
				"Content-Type": "application/json"
			};
			if (this.socket.accessTokenValue) headers["Authorization"] = `Bearer ${this.socket.accessTokenValue}`;
			const options = {
				method: "POST",
				headers,
				body: JSON.stringify({ messages: [{
					topic: this.subTopic,
					event,
					payload: endpoint_payload,
					private: this.private
				}] })
			};
			try {
				const response = await this._fetchWithTimeout(this.broadcastEndpointURL, options, (_a = opts.timeout) !== null && _a !== void 0 ? _a : this.timeout);
				await ((_b = response.body) === null || _b === void 0 ? void 0 : _b.cancel());
				return response.ok ? "ok" : "error";
			} catch (error) {
				if (error instanceof Error && error.name === "AbortError") return "timed out";
				else return "error";
			}
		} else return new Promise((resolve) => {
			var _a, _b, _c;
			const push = this.channelAdapter.push(args.type, args, opts.timeout || this.timeout);
			if (args.type === "broadcast" && !((_c = (_b = (_a = this.params) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.broadcast) === null || _c === void 0 ? void 0 : _c.ack)) resolve("ok");
			push.receive("ok", () => resolve("ok"));
			push.receive("error", () => resolve("error"));
			push.receive("timeout", () => resolve("timed out"));
		});
	}
	/**
	* Updates the payload that will be sent the next time the channel joins (reconnects).
	* Useful for rotating access tokens or updating config without re-creating the channel.
	*
	* @category Realtime
	*/
	updateJoinPayload(payload) {
		this.channelAdapter.updateJoinPayload(payload);
	}
	/**
	* Leaves the channel.
	*
	* Unsubscribes from server events, and instructs channel to terminate on server.
	* Triggers onClose() hooks.
	*
	* To receive leave acknowledgements, use the a `receive` hook to bind to the server ack, ie:
	* channel.unsubscribe().receive("ok", () => alert("left!") )
	*
	* @category Realtime
	*/
	async unsubscribe(timeout = this.timeout) {
		return new Promise((resolve) => {
			this.channelAdapter.unsubscribe(timeout).receive("ok", () => resolve("ok")).receive("timeout", () => resolve("timed out")).receive("error", () => resolve("error"));
		});
	}
	/**
	* Destroys and stops related timers.
	*
	* @category Realtime
	*/
	teardown() {
		this.channelAdapter.teardown();
	}
	/** @internal */
	async _fetchWithTimeout(url, options, timeout) {
		const controller = new AbortController();
		const id = setTimeout(() => controller.abort(), timeout);
		const response = await this.socket.fetch(url, Object.assign(Object.assign({}, options), { signal: controller.signal }));
		clearTimeout(id);
		return response;
	}
	/** @internal */
	_on(type, filter, callback) {
		var _a;
		const typeLower = type.toLocaleLowerCase();
		const filterValue = filter === null || filter === void 0 ? void 0 : filter.filter;
		if (filterValue instanceof RealtimePostgresFilterBuilder || typeof filterValue === "object" && filterValue !== null && typeof filterValue.build === "function") filter = Object.assign(Object.assign({}, filter), { filter: filterValue.build() });
		if (typeLower === REALTIME_LISTEN_TYPES.POSTGRES_CHANGES) {
			if ((_a = this.bindings[typeLower]) === null || _a === void 0 ? void 0 : _a.find((bind) => RealtimeChannel.isSamePostgresFilter(bind.filter, filter))) {
				this.socket.log("error", `duplicate \`postgres_changes\` binding for ${this.topic} ignored`, filter);
				return this;
			}
		}
		const ref = this.channelAdapter.on(type, callback);
		const binding = {
			type: typeLower,
			filter,
			callback,
			ref
		};
		if (this.bindings[typeLower]) this.bindings[typeLower].push(binding);
		else this.bindings[typeLower] = [binding];
		this._updateFilterMessage();
		return this;
	}
	/**
	* Registers a callback that will be executed when the channel closes.
	*
	* @internal
	*/
	_onClose(callback) {
		this.channelAdapter.onClose(callback);
	}
	/**
	* Registers a callback that will be executed when the channel encounteres an error.
	*
	* @internal
	*/
	_onError(callback) {
		this.channelAdapter.onError(callback);
	}
	/** @internal */
	_updateFilterMessage() {
		this.channelAdapter.updateFilterBindings((binding, payload, ref) => {
			var _a, _b, _c, _d, _e, _f, _g;
			const typeLower = binding.event.toLocaleLowerCase();
			if (this._notThisChannelEvent(typeLower, ref)) return false;
			const bind = (_a = this.bindings[typeLower]) === null || _a === void 0 ? void 0 : _a.find((bind) => bind.ref === binding.ref);
			if (!bind) return true;
			if ([
				"broadcast",
				"presence",
				"postgres_changes"
			].includes(typeLower)) {
				if ("id" in bind) {
					const bindId = bind.id;
					const bindEvent = (_b = bind.filter) === null || _b === void 0 ? void 0 : _b.event;
					return bindId && ((_c = payload.ids) === null || _c === void 0 ? void 0 : _c.includes(bindId)) && (bindEvent === "*" || (bindEvent === null || bindEvent === void 0 ? void 0 : bindEvent.toLocaleLowerCase()) === ((_d = payload.data) === null || _d === void 0 ? void 0 : _d.type.toLocaleLowerCase()));
				} else {
					const bindEvent = (_f = (_e = bind === null || bind === void 0 ? void 0 : bind.filter) === null || _e === void 0 ? void 0 : _e.event) === null || _f === void 0 ? void 0 : _f.toLocaleLowerCase();
					return bindEvent === "*" || bindEvent === ((_g = payload === null || payload === void 0 ? void 0 : payload.event) === null || _g === void 0 ? void 0 : _g.toLocaleLowerCase());
				}
			} else return bind.type.toLocaleLowerCase() === typeLower;
		});
	}
	/** @internal */
	_notThisChannelEvent(event, ref) {
		const { close, error, leave, join } = CHANNEL_EVENTS;
		return ref && [
			close,
			error,
			leave,
			join
		].includes(event) && ref !== this.joinPush.ref;
	}
	/** @internal */
	_updateFilterTransform() {
		this.channelAdapter.updatePayloadTransform((event, payload, ref) => {
			if (typeof payload === "object" && "ids" in payload) {
				const postgresChanges = payload.data;
				const { schema, table, commit_timestamp, type, errors } = postgresChanges;
				return Object.assign(Object.assign({}, {
					schema,
					table,
					commit_timestamp,
					eventType: type,
					new: {},
					old: {},
					errors
				}), this._getPayloadRecords(postgresChanges));
			}
			return payload;
		});
	}
	copyBindings(other) {
		if (this.joinedOnce) throw new Error("cannot copy bindings into joined channel");
		for (const kind in other.bindings) for (const binding of other.bindings[kind]) this._on(binding.type, binding.filter, binding.callback);
	}
	/**
	* Compares two optional filter values for equality.
	* Treats undefined, null, and empty string as equivalent empty values.
	* @internal
	*/
	static isFilterValueEqual(serverValue, clientValue) {
		return (serverValue !== null && serverValue !== void 0 ? serverValue : void 0) === (clientValue !== null && clientValue !== void 0 ? clientValue : void 0);
	}
	/**
	* Two `postgres_changes` filters are the same when the server would collapse them into a single
	* subscription.
	* @internal
	*/
	static isSamePostgresFilter(a, b) {
		var _a, _b, _c, _d;
		const selectA = (_b = (_a = a === null || a === void 0 ? void 0 : a.select) === null || _a === void 0 ? void 0 : _a.join()) !== null && _b !== void 0 ? _b : void 0;
		const selectB = (_d = (_c = b === null || b === void 0 ? void 0 : b.select) === null || _c === void 0 ? void 0 : _c.join()) !== null && _d !== void 0 ? _d : void 0;
		return (a === null || a === void 0 ? void 0 : a.event) === (b === null || b === void 0 ? void 0 : b.event) && RealtimeChannel.isFilterValueEqual(a === null || a === void 0 ? void 0 : a.schema, b === null || b === void 0 ? void 0 : b.schema) && RealtimeChannel.isFilterValueEqual(a === null || a === void 0 ? void 0 : a.table, b === null || b === void 0 ? void 0 : b.table) && RealtimeChannel.isFilterValueEqual(a === null || a === void 0 ? void 0 : a.filter, b === null || b === void 0 ? void 0 : b.filter) && selectA === selectB;
	}
	/** @internal */
	_getPayloadRecords(payload) {
		const records = {
			new: {},
			old: {}
		};
		if (payload.type === "INSERT" || payload.type === "UPDATE") records.new = convertChangeData(payload.columns, payload.record);
		if (payload.type === "UPDATE" || payload.type === "DELETE") records.old = convertChangeData(payload.columns, payload.old_record);
		return records;
	}
};
//#endregion
//#region node_modules/@supabase/realtime-js/dist/module/phoenix/socketAdapter.js
var SocketAdapter = class {
	constructor(endPoint, options) {
		this.socket = new Socket(endPoint, options);
	}
	get timeout() {
		return this.socket.timeout;
	}
	get endPoint() {
		return this.socket.endPoint;
	}
	get transport() {
		return this.socket.transport;
	}
	get heartbeatIntervalMs() {
		return this.socket.heartbeatIntervalMs;
	}
	get heartbeatCallback() {
		return this.socket.heartbeatCallback;
	}
	set heartbeatCallback(callback) {
		this.socket.heartbeatCallback = callback;
	}
	get heartbeatTimer() {
		return this.socket.heartbeatTimer;
	}
	get pendingHeartbeatRef() {
		return this.socket.pendingHeartbeatRef;
	}
	get reconnectTimer() {
		return this.socket.reconnectTimer;
	}
	get vsn() {
		return this.socket.vsn;
	}
	get encode() {
		return this.socket.encode;
	}
	get decode() {
		return this.socket.decode;
	}
	get reconnectAfterMs() {
		return this.socket.reconnectAfterMs;
	}
	get sendBuffer() {
		return this.socket.sendBuffer;
	}
	get stateChangeCallbacks() {
		return this.socket.stateChangeCallbacks;
	}
	connect() {
		this.socket.connect();
	}
	disconnect(callback, code, reason, timeout = 1e4) {
		return new Promise((resolve) => {
			setTimeout(() => resolve("timeout"), timeout);
			this.socket.disconnect(() => {
				callback();
				resolve("ok");
			}, code, reason);
		});
	}
	push(data) {
		this.socket.push(data);
	}
	log(kind, msg, data) {
		this.socket.log(kind, msg, data);
	}
	hasLogger() {
		return this.socket.hasLogger();
	}
	makeRef() {
		return this.socket.makeRef();
	}
	onOpen(callback) {
		this.socket.onOpen(callback);
	}
	onClose(callback) {
		this.socket.onClose(callback);
	}
	onError(callback) {
		this.socket.onError(callback);
	}
	onMessage(callback) {
		this.socket.onMessage(callback);
	}
	isConnected() {
		return this.socket.isConnected();
	}
	isConnecting() {
		return this.socket.connectionState() == CONNECTION_STATE.connecting;
	}
	isDisconnecting() {
		return this.socket.connectionState() == CONNECTION_STATE.closing;
	}
	connectionState() {
		return this.socket.connectionState();
	}
	endPointURL() {
		return this.socket.endPointURL();
	}
	sendHeartbeat() {
		this.socket.sendHeartbeat();
	}
	/**
	* @internal
	*/
	getSocket() {
		return this.socket;
	}
};
//#endregion
//#region node_modules/@supabase/realtime-js/dist/module/RealtimeClient.js
var CONNECTION_TIMEOUTS = {
	HEARTBEAT_INTERVAL: 25e3,
	RECONNECT_DELAY: 10,
	HEARTBEAT_TIMEOUT_FALLBACK: 100
};
var RECONNECT_INTERVALS = [
	1e3,
	2e3,
	5e3,
	1e4
];
var DEFAULT_RECONNECT_FALLBACK = 1e4;
function createMemorySessionStorage() {
	const store = /* @__PURE__ */ new Map();
	return {
		get length() {
			return store.size;
		},
		clear() {
			store.clear();
		},
		getItem(key) {
			return store.has(key) ? store.get(key) : null;
		},
		key(index) {
			var _a;
			return (_a = Array.from(store.keys())[index]) !== null && _a !== void 0 ? _a : null;
		},
		removeItem(key) {
			store.delete(key);
		},
		setItem(key, value) {
			store.set(key, String(value));
		}
	};
}
function resolveSessionStorage() {
	try {
		if (typeof globalThis !== "undefined" && globalThis.sessionStorage) return globalThis.sessionStorage;
	} catch (_a) {}
	return createMemorySessionStorage();
}
var WORKER_SCRIPT = `
  addEventListener("message", (e) => {
    if (e.data.event === "start") {
      setInterval(() => postMessage({ event: "keepAlive" }), e.data.interval);
    }
  });`;
var RealtimeClient = class {
	get endPoint() {
		return this.socketAdapter.endPoint;
	}
	get timeout() {
		return this.socketAdapter.timeout;
	}
	get transport() {
		return this.socketAdapter.transport;
	}
	get heartbeatCallback() {
		return this.socketAdapter.heartbeatCallback;
	}
	get heartbeatIntervalMs() {
		return this.socketAdapter.heartbeatIntervalMs;
	}
	get heartbeatTimer() {
		if (this.worker) return this._workerHeartbeatTimer;
		return this.socketAdapter.heartbeatTimer;
	}
	get pendingHeartbeatRef() {
		if (this.worker) return this._pendingWorkerHeartbeatRef;
		return this.socketAdapter.pendingHeartbeatRef;
	}
	get reconnectTimer() {
		return this.socketAdapter.reconnectTimer;
	}
	get vsn() {
		return this.socketAdapter.vsn;
	}
	get encode() {
		return this.socketAdapter.encode;
	}
	get decode() {
		return this.socketAdapter.decode;
	}
	get reconnectAfterMs() {
		return this.socketAdapter.reconnectAfterMs;
	}
	get sendBuffer() {
		return this.socketAdapter.sendBuffer;
	}
	get stateChangeCallbacks() {
		return this.socketAdapter.stateChangeCallbacks;
	}
	/**
	* Initializes the Socket.
	*
	* @param endPoint The string WebSocket endpoint, ie, "ws://example.com/socket", "wss://example.com", "/socket" (inherited host & protocol)
	* @param options.transport The Websocket Transport, for example WebSocket. This can be a custom implementation
	* @param options.timeout The default timeout in milliseconds to trigger push timeouts.
	* @param options.params The optional params to pass when connecting.
	* @param options.headers Deprecated: headers cannot be set on websocket connections and this option will be removed in the future.
	* @param options.heartbeatIntervalMs The millisec interval to send a heartbeat message.
	* @param options.heartbeatCallback The optional function to handle heartbeat status and latency.
	* @param options.logger The optional function for specialized logging, ie: logger: (kind, msg, data) => { console.log(`${kind}: ${msg}`, data) }
	* @param options.logLevel Sets the log level for Realtime
	* @param options.encode The function to encode outgoing messages. Defaults to JSON: (payload, callback) => callback(JSON.stringify(payload))
	* @param options.decode The function to decode incoming messages. Defaults to Serializer's decode.
	* @param options.reconnectAfterMs he optional function that returns the millsec reconnect interval. Defaults to stepped backoff off.
	* @param options.worker Use Web Worker to set a side flow. Defaults to false.
	* @param options.workerUrl The URL of the worker script. Defaults to https://realtime.supabase.com/worker.js that includes a heartbeat event call to keep the connection alive.
	* @param options.vsn The protocol version to use when connecting. Supported versions are "1.0.0" and "2.0.0". Defaults to "2.0.0".
	*
	* @category Realtime
	*
	* @example Using supabase-js (recommended)
	* ```ts
	* import { createClient } from '@supabase/supabase-js'
	*
	* const supabase = createClient('https://xyzcompany.supabase.co', 'your-publishable-key')
	* const channel = supabase.channel('room1')
	* channel
	*   .on('broadcast', { event: 'cursor-pos' }, (payload) => console.log(payload))
	*   .subscribe()
	* ```
	*
	* @example Standalone import for bundle-sensitive environments
	* ```ts
	* import RealtimeClient from '@supabase/realtime-js'
	*
	* const client = new RealtimeClient('https://xyzcompany.supabase.co/realtime/v1', {
	*   params: { apikey: 'your-publishable-key' },
	* })
	* client.connect()
	* ```
	*/
	constructor(endPoint, options) {
		var _a;
		this.channels = new Array();
		this.accessTokenValue = null;
		this.accessToken = null;
		this.apiKey = null;
		this.httpEndpoint = "";
		/** @deprecated headers cannot be set on websocket connections */
		this.headers = {};
		this.params = {};
		this.ref = 0;
		this.serializer = new Serializer();
		this._manuallySetToken = false;
		this._authPromise = null;
		this._authGeneration = 0;
		this._workerHeartbeatTimer = void 0;
		this._pendingWorkerHeartbeatRef = null;
		this._pendingDisconnectTimer = null;
		this._disconnectOnEmptyChannelsAfterMs = 0;
		/**
		* Use either custom fetch, if provided, or default fetch to make HTTP requests
		*
		* @internal
		*/
		this._resolveFetch = (customFetch) => {
			if (customFetch) return (...args) => customFetch(...args);
			return (...args) => fetch(...args);
		};
		if (!((_a = options === null || options === void 0 ? void 0 : options.params) === null || _a === void 0 ? void 0 : _a.apikey)) throw new Error("API key is required to connect to Realtime");
		this.apiKey = options.params.apikey;
		const socketAdapterOptions = this._initializeOptions(options);
		this.socketAdapter = new SocketAdapter(endPoint, socketAdapterOptions);
		this.httpEndpoint = httpEndpointURL(endPoint);
		this.fetch = this._resolveFetch(options === null || options === void 0 ? void 0 : options.fetch);
	}
	/**
	* Connects the socket, unless already connected.
	*
	* @category Realtime
	*/
	connect() {
		if (this.isConnecting() || this.isDisconnecting() || this.isConnected()) return;
		if (this.accessToken && !this._authPromise) this._setAuthSafely("connect");
		this._setupConnectionHandlers();
		try {
			this.socketAdapter.connect();
		} catch (error) {
			const errorMessage = error.message;
			throw new Error(`WebSocket not available: ${errorMessage}`);
		}
		this._handleNodeJsRaceCondition();
	}
	/**
	* Returns the URL of the websocket.
	* @returns string The URL of the websocket.
	*
	* @category Realtime
	*/
	endpointURL() {
		return this.socketAdapter.endPointURL();
	}
	/**
	* Disconnects the socket.
	*
	* @param code A numeric status code to send on disconnect.
	* @param reason A custom reason for the disconnect.
	*
	* @category Realtime
	*/
	async disconnect(code, reason) {
		this._cancelPendingDisconnect();
		if (this.isDisconnecting()) return "ok";
		return await this.socketAdapter.disconnect(() => {
			clearInterval(this._workerHeartbeatTimer);
			this._terminateWorker();
		}, code, reason);
	}
	/**
	* Returns all created channels
	*
	* @category Realtime
	*/
	getChannels() {
		return this.channels;
	}
	/**
	* Unsubscribes, removes and tears down a single channel
	* @param channel A RealtimeChannel instance
	*
	* @category Realtime
	*/
	async removeChannel(channel) {
		const status = await channel.unsubscribe();
		if (status === "ok") channel.teardown();
		return status;
	}
	/**
	* Unsubscribes, removes and tears down all channels
	*
	* @category Realtime
	*/
	async removeAllChannels() {
		const promises = this.channels.map(async (channel) => {
			const result = await channel.unsubscribe();
			channel.teardown();
			return result;
		});
		const result = await Promise.all(promises);
		await this.disconnect();
		return result;
	}
	/**
	* Logs the message.
	*
	* For customized logging, `this.logger` can be overridden in Client constructor.
	*
	* @category Realtime
	*/
	log(kind, msg, data) {
		this.socketAdapter.log(kind, msg, data);
	}
	/**
	* Returns true if a custom `logger` has been configured on this client.
	*
	* @category Realtime
	*/
	hasLogger() {
		return this.socketAdapter.hasLogger();
	}
	/**
	* Returns the current state of the socket.
	*
	* @category Realtime
	*/
	connectionState() {
		return this.socketAdapter.connectionState() || CONNECTION_STATE.closed;
	}
	/**
	* Returns `true` is the connection is open.
	*
	* @category Realtime
	*/
	isConnected() {
		return this.socketAdapter.isConnected();
	}
	/**
	* Returns `true` if the connection is currently connecting.
	*
	* @category Realtime
	*/
	isConnecting() {
		return this.socketAdapter.isConnecting();
	}
	/**
	* Returns `true` if the connection is currently disconnecting.
	*
	* @category Realtime
	*/
	isDisconnecting() {
		return this.socketAdapter.isDisconnecting();
	}
	/**
	* Creates (or reuses) a {@link RealtimeChannel} for the provided topic.
	*
	* Topics are automatically prefixed with `realtime:` to match the Realtime service.
	* If a channel with the same topic already exists it will be returned instead of creating
	* a duplicate connection.
	*
	* @category Realtime
	*/
	channel(topic, params = { config: {} }) {
		const realtimeTopic = `realtime:${topic}`;
		const exists = this.getChannels().find((c) => c.topic === realtimeTopic);
		if (!exists) {
			const chan = new RealtimeChannel(`realtime:${topic}`, params, this);
			this._cancelPendingDisconnect();
			this.channels.push(chan);
			return chan;
		} else return exists;
	}
	/**
	* Push out a message if the socket is connected.
	*
	* If the socket is not connected, the message gets enqueued within a local buffer, and sent out when a connection is next established.
	*
	* @category Realtime
	*/
	push(data) {
		this.socketAdapter.push(data);
	}
	/**
	* Sets the JWT access token used for channel subscription authorization and Realtime RLS.
	*
	* If param is null it will use the `accessToken` callback function or the token set on the client.
	*
	* On callback used, it will set the value of the token internal to the client.
	*
	* When a token is explicitly provided AND no `accessToken` callback is configured,
	* it will be preserved across channel operations (including removeChannel and
	* resubscribe) and the client stays in manual-token mode.
	*
	* When an `accessToken` callback IS configured, the callback is the source of truth:
	* the client remains in callback mode and continues to refresh from it on heartbeat,
	* even after a bootstrap/override `setAuth(token)` call.
	*
	* @param token A JWT string to override the token set on the client.
	*
	* @example Setting the authorization header
	* // Use a manual token (preserved across resubscribes when no accessToken callback is set)
	* client.realtime.setAuth('my-custom-jwt')
	*
	* // Switch back to using the accessToken callback
	* client.realtime.setAuth()
	*
	* @category Realtime
	*/
	async setAuth(token = null) {
		const authGeneration = ++this._authGeneration;
		const authPromise = this._performAuth(token, authGeneration);
		if (authGeneration === this._authGeneration) this._authPromise = authPromise;
		try {
			await authPromise;
		} finally {
			if (this._authPromise === authPromise) this._authPromise = null;
		}
	}
	/**
	* Returns true if the current access token was explicitly set via setAuth(token),
	* false if it was obtained via the accessToken callback.
	* @internal
	*/
	_isManualToken() {
		return this._manuallySetToken;
	}
	/**
	* Sends a heartbeat message if the socket is connected.
	*
	* @category Realtime
	*/
	async sendHeartbeat() {
		this.socketAdapter.sendHeartbeat();
	}
	/**
	* Sets a callback that receives lifecycle events for internal heartbeat messages.
	* Useful for instrumenting connection health (e.g. sent/ok/timeout).
	*
	* @category Realtime
	*/
	onHeartbeat(callback) {
		this.socketAdapter.heartbeatCallback = this._wrapHeartbeatCallback(callback);
	}
	/**
	* Return the next message ref, accounting for overflows
	*
	* @internal
	*/
	_makeRef() {
		return this.socketAdapter.makeRef();
	}
	/**
	* Removes a channel from RealtimeClient
	*
	* @param channel An open subscription.
	*
	* @internal
	*/
	_remove(channel) {
		this.channels = this.channels.filter((c) => c.topic !== channel.topic);
		if (this.channels.length === 0) {
			this.log("transport", "no channels remaining, scheduling disconnect");
			this._schedulePendingDisconnect();
		}
	}
	/** @internal */
	_schedulePendingDisconnect() {
		this._cancelPendingDisconnect();
		if (this._disconnectOnEmptyChannelsAfterMs === 0) {
			this.log("transport", "disconnecting immediately - no channels");
			this.disconnect();
			return;
		}
		this._pendingDisconnectTimer = setTimeout(() => {
			this._pendingDisconnectTimer = null;
			if (this.channels.length === 0) {
				this.log("transport", "deferred disconnect fired - no channels, disconnecting");
				this.disconnect();
			}
		}, this._disconnectOnEmptyChannelsAfterMs);
		this.log("transport", `deferred disconnect scheduled in ${this._disconnectOnEmptyChannelsAfterMs}ms`);
	}
	/** @internal */
	_cancelPendingDisconnect() {
		if (this._pendingDisconnectTimer !== null) {
			this.log("transport", "pending disconnect cancelled - channel activity detected");
			clearTimeout(this._pendingDisconnectTimer);
			this._pendingDisconnectTimer = null;
		}
	}
	/**
	* Perform the actual auth operation
	* @internal
	*/
	async _performAuth(token, authGeneration) {
		let tokenToSend;
		let isManualToken = false;
		if (token) {
			tokenToSend = token;
			isManualToken = true;
		} else if (this.accessToken) try {
			tokenToSend = await this.accessToken();
		} catch (e) {
			this.log("error", "Error fetching access token from callback", e);
			tokenToSend = this.accessTokenValue;
		}
		else tokenToSend = this.accessTokenValue;
		if (authGeneration !== this._authGeneration) return;
		if (this.accessToken) this._manuallySetToken = false;
		else if (isManualToken) this._manuallySetToken = true;
		if (this.accessTokenValue != tokenToSend) {
			this.accessTokenValue = tokenToSend;
			this.channels.forEach((channel) => {
				const payload = {
					access_token: tokenToSend,
					version: DEFAULT_VERSION
				};
				channel.updateJoinPayload(payload);
				if (channel.joinedOnce && channel.channelAdapter.isJoined()) channel.channelAdapter.push(CHANNEL_EVENTS.access_token, { access_token: tokenToSend });
			});
		}
	}
	/**
	* Wait for any in-flight auth operations to complete
	* @internal
	*/
	async _waitForAuthIfNeeded() {
		if (this._authPromise) await this._authPromise;
	}
	/**
	* Safely call setAuth with standardized error handling
	* @internal
	*/
	_setAuthSafely(context = "general") {
		if (!this._isManualToken()) this.setAuth().catch((e) => {
			this.log("error", `Error setting auth in ${context}`, e);
		});
	}
	/** @internal */
	_setupConnectionHandlers() {
		this.socketAdapter.onOpen(() => {
			(this._authPromise || (this.accessToken && !this.accessTokenValue ? this.setAuth() : Promise.resolve())).catch((e) => {
				this.log("error", "error waiting for auth on connect", e);
			});
			if (this.worker && !this.workerRef) this._startWorkerHeartbeat();
		});
		this.socketAdapter.onClose(() => {
			if (this.worker && this.workerRef) this._terminateWorker();
		});
		this.socketAdapter.onMessage((message) => {
			if (message.ref && message.ref === this._pendingWorkerHeartbeatRef) this._pendingWorkerHeartbeatRef = null;
		});
	}
	/** @internal */
	_handleNodeJsRaceCondition() {
		if (this.socketAdapter.isConnected()) this.socketAdapter.getSocket().onConnOpen();
	}
	/** @internal */
	_wrapHeartbeatCallback(heartbeatCallback) {
		return (status, latency) => {
			if (status === "disconnected") return;
			if (status == "sent") this._setAuthSafely();
			if (heartbeatCallback) heartbeatCallback(status, latency);
		};
	}
	/** @internal */
	_startWorkerHeartbeat() {
		if (this.workerUrl) this.log("worker", `starting worker for from ${this.workerUrl}`);
		else this.log("worker", `starting default worker`);
		const objectUrl = this._workerObjectUrl(this.workerUrl);
		this.workerRef = new Worker(objectUrl);
		this.workerRef.onerror = (error) => {
			this.log("worker", "worker error", error.message);
			this._terminateWorker();
			this.disconnect();
		};
		this.workerRef.onmessage = (event) => {
			if (event.data.event === "keepAlive") this.sendHeartbeat();
		};
		this.workerRef.postMessage({
			event: "start",
			interval: this.heartbeatIntervalMs
		});
	}
	/**
	* Terminate the Web Worker and clear the reference
	* @internal
	*/
	_terminateWorker() {
		if (this.workerRef) {
			this.log("worker", "terminating worker");
			this.workerRef.terminate();
			this.workerRef = void 0;
		}
	}
	/** @internal */
	_workerObjectUrl(url) {
		let result_url;
		if (url) result_url = url;
		else {
			const blob = new Blob([WORKER_SCRIPT], { type: "application/javascript" });
			result_url = URL.createObjectURL(blob);
		}
		return result_url;
	}
	/**
	* Initialize socket options with defaults
	* @internal
	*/
	_initializeOptions(options) {
		var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
		this.worker = (_a = options === null || options === void 0 ? void 0 : options.worker) !== null && _a !== void 0 ? _a : false;
		this.accessToken = (_b = options === null || options === void 0 ? void 0 : options.accessToken) !== null && _b !== void 0 ? _b : null;
		const result = {};
		result.timeout = (_c = options === null || options === void 0 ? void 0 : options.timeout) !== null && _c !== void 0 ? _c : DEFAULT_TIMEOUT;
		result.heartbeatIntervalMs = (_d = options === null || options === void 0 ? void 0 : options.heartbeatIntervalMs) !== null && _d !== void 0 ? _d : CONNECTION_TIMEOUTS.HEARTBEAT_INTERVAL;
		this._disconnectOnEmptyChannelsAfterMs = (_e = options === null || options === void 0 ? void 0 : options.disconnectOnEmptyChannelsAfterMs) !== null && _e !== void 0 ? _e : 2 * ((_f = options === null || options === void 0 ? void 0 : options.heartbeatIntervalMs) !== null && _f !== void 0 ? _f : CONNECTION_TIMEOUTS.HEARTBEAT_INTERVAL);
		result.transport = (_g = options === null || options === void 0 ? void 0 : options.transport) !== null && _g !== void 0 ? _g : WebSocketFactory.getWebSocketConstructor();
		result.params = options === null || options === void 0 ? void 0 : options.params;
		result.logger = options === null || options === void 0 ? void 0 : options.logger;
		result.heartbeatCallback = this._wrapHeartbeatCallback(options === null || options === void 0 ? void 0 : options.heartbeatCallback);
		result.sessionStorage = (_h = options === null || options === void 0 ? void 0 : options.sessionStorage) !== null && _h !== void 0 ? _h : resolveSessionStorage();
		result.reconnectAfterMs = (_j = options === null || options === void 0 ? void 0 : options.reconnectAfterMs) !== null && _j !== void 0 ? _j : ((tries) => {
			return RECONNECT_INTERVALS[tries - 1] || DEFAULT_RECONNECT_FALLBACK;
		});
		let defaultEncode;
		let defaultDecode;
		const vsn = (_k = options === null || options === void 0 ? void 0 : options.vsn) !== null && _k !== void 0 ? _k : DEFAULT_VSN;
		switch (vsn) {
			case VSN_1_0_0:
				defaultEncode = (payload, callback) => {
					return callback(JSON.stringify(payload));
				};
				defaultDecode = (payload, callback) => {
					return callback(JSON.parse(payload));
				};
				break;
			case VSN_2_0_0:
				defaultEncode = this.serializer.encode.bind(this.serializer);
				defaultDecode = this.serializer.decode.bind(this.serializer);
				break;
			default: throw new Error(`Unsupported serializer version: ${result.vsn}`);
		}
		result.vsn = vsn;
		result.encode = (_l = options === null || options === void 0 ? void 0 : options.encode) !== null && _l !== void 0 ? _l : defaultEncode;
		result.decode = (_m = options === null || options === void 0 ? void 0 : options.decode) !== null && _m !== void 0 ? _m : defaultDecode;
		result.beforeReconnect = this._reconnectAuth.bind(this);
		if ((options === null || options === void 0 ? void 0 : options.logLevel) || (options === null || options === void 0 ? void 0 : options.log_level)) {
			this.logLevel = options.logLevel || options.log_level;
			result.params = Object.assign(Object.assign({}, result.params), { log_level: this.logLevel });
		}
		if (this.worker) {
			if (typeof window !== "undefined" && !window.Worker) throw new Error("Web Worker is not supported");
			this.workerUrl = options === null || options === void 0 ? void 0 : options.workerUrl;
			result.autoSendHeartbeat = !this.worker;
		}
		return result;
	}
	/** @internal */
	async _reconnectAuth() {
		await this._waitForAuthIfNeeded();
		if (!this.isConnected()) this.connect();
	}
};
//#endregion
export { REALTIME_SUBSCRIBE_STATES, RealtimeClient };
