"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (err, _, res, __) => {
    res.status(err.status).json(err);
};
//# sourceMappingURL=globalErrorHandler.js.map