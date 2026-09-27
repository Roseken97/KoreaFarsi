// Wire protocol shared by the server handler and the browser client (no server imports here).

/** Sent in-band if the model call fails after the response stream has started. */
export const STREAM_ERROR_MARKER = "\u0000[error]";
