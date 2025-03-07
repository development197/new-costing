"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorObject_1 = __importDefault(require("./errorObject"));
exports.default = (nextFunc, err, req, errorStatusCode = 500) => {
    const errorObj = (0, errorObject_1.default)(err, req, errorStatusCode);
    return nextFunc(errorObj);
};
//# sourceMappingURL=httpError.js.map