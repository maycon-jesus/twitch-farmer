"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
class CustomError extends Error {
    constructor(error, extraData) {
        super(error.message);
        this.error = error;
        this.code = extraData.code;
    }
}
exports.CustomError = CustomError;
//# sourceMappingURL=CustomError.js.map