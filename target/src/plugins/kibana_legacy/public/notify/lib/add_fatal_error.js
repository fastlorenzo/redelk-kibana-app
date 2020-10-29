"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addFatalError = void 0;
const format_angular_http_error_1 = require("./format_angular_http_error");
function addFatalError(fatalErrors, error, location) {
    // add support for angular http errors to newPlatformFatalErrors
    if (format_angular_http_error_1.isAngularHttpError(error)) {
        error = format_angular_http_error_1.formatAngularHttpError(error);
    }
    fatalErrors.add(error, location);
}
exports.addFatalError = addFatalError;
