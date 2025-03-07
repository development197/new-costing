"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const responseMessage_1 = __importDefault(require("../constants/responseMessage"));
const application_1 = require("../constants/application");
const config_1 = __importDefault(require("../config/config"));
const logger_1 = __importDefault(require("./logger"));
exports.default = (err, req, errorStatusCode = 500) => {
    const errorObj = {
        success: false,
        status: errorStatusCode,
        request: {
            ip: req.ip || null,
            method: req.method,
            url: req.originalUrl
        },
        message: err instanceof Error ? err.message || responseMessage_1.default.SOMETHING_WENT_WRONG : responseMessage_1.default.SOMETHING_WENT_WRONG,
        data: null,
        trace: err instanceof Error ? { error: err.stack } : null
    };
    logger_1.default.info('Controller_ERROR', {
        meta: errorObj
    });
    if (config_1.default.ENV === application_1.EApplicationEnvironment.PRODUCTION) {
        delete errorObj.request.ip;
        delete errorObj.trace;
    }
    return errorObj;
};
//# sourceMappingURL=errorObject.js.map