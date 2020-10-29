"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HapiResponseAdapter = void 0;
const tslib_1 = require("tslib");
const type_detect_1 = tslib_1.__importDefault(require("type-detect"));
const boom_1 = tslib_1.__importDefault(require("boom"));
const stream = tslib_1.__importStar(require("stream"));
const response_1 = require("./response");
function setHeaders(response, headers = {}) {
    Object.entries(headers).forEach(([header, value]) => {
        if (value !== undefined) {
            // Hapi typings for header accept only strings, although string[] is a valid value
            response.header(header, value);
        }
    });
    return response;
}
const statusHelpers = {
    isSuccess: (code) => code >= 100 && code < 300,
    isRedirect: (code) => code >= 300 && code < 400,
    isError: (code) => code >= 400 && code < 600,
};
class HapiResponseAdapter {
    constructor(responseToolkit) {
        this.responseToolkit = responseToolkit;
    }
    toBadRequest(message) {
        const error = boom_1.default.badRequest();
        error.output.payload.message = message;
        return error;
    }
    toInternalError() {
        const error = new boom_1.default('', {
            statusCode: 500,
        });
        error.output.payload.message = 'An internal server error occurred.';
        return error;
    }
    handle(kibanaResponse) {
        if (!(kibanaResponse instanceof response_1.KibanaResponse)) {
            throw new Error(`Unexpected result from Route Handler. Expected KibanaResponse, but given: ${type_detect_1.default(kibanaResponse)}.`);
        }
        return this.toHapiResponse(kibanaResponse);
    }
    toHapiResponse(kibanaResponse) {
        if (statusHelpers.isError(kibanaResponse.status)) {
            return this.toError(kibanaResponse);
        }
        if (statusHelpers.isSuccess(kibanaResponse.status)) {
            return this.toSuccess(kibanaResponse);
        }
        if (statusHelpers.isRedirect(kibanaResponse.status)) {
            return this.toRedirect(kibanaResponse);
        }
        throw new Error(`Unexpected Http status code. Expected from 100 to 599, but given: ${kibanaResponse.status}.`);
    }
    toSuccess(kibanaResponse) {
        const response = this.responseToolkit
            .response(kibanaResponse.payload)
            .code(kibanaResponse.status);
        setHeaders(response, kibanaResponse.options.headers);
        return response;
    }
    toRedirect(kibanaResponse) {
        const { headers } = kibanaResponse.options;
        if (!headers || typeof headers.location !== 'string') {
            throw new Error("expected 'location' header to be set");
        }
        const response = this.responseToolkit
            .response(kibanaResponse.payload)
            .redirect(headers.location)
            .code(kibanaResponse.status)
            .takeover();
        setHeaders(response, kibanaResponse.options.headers);
        return response;
    }
    toError(kibanaResponse) {
        const { payload } = kibanaResponse;
        // Special case for when we are proxying requests and want to enable streaming back error responses opaquely.
        if (Buffer.isBuffer(payload) || payload instanceof stream.Readable) {
            const response = this.responseToolkit
                .response(kibanaResponse.payload)
                .code(kibanaResponse.status);
            setHeaders(response, kibanaResponse.options.headers);
            return response;
        }
        // we use for BWC with Boom payload for error responses - {error: string, message: string, statusCode: string}
        const error = new boom_1.default('', {
            statusCode: kibanaResponse.status,
        });
        error.output.payload.message = getErrorMessage(payload);
        const attributes = getErrorAttributes(payload);
        if (attributes) {
            error.output.payload.attributes = attributes;
        }
        const headers = kibanaResponse.options.headers;
        if (headers) {
            // Hapi typings for header accept only strings, although string[] is a valid value
            error.output.headers = headers;
        }
        return error;
    }
}
exports.HapiResponseAdapter = HapiResponseAdapter;
function getErrorMessage(payload) {
    if (!payload) {
        throw new Error('expected error message to be provided');
    }
    if (typeof payload === 'string')
        return payload;
    return getErrorMessage(payload.message);
}
function getErrorAttributes(payload) {
    return typeof payload === 'object' && 'attributes' in payload ? payload.attributes : undefined;
}
