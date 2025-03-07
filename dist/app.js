"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const apiRouter_1 = __importDefault(require("./router/apiRouter"));
const userRouter_1 = __importDefault(require("./router/userRouter"));
const costRouter_1 = __importDefault(require("./router/costRouter"));
const loginRouter_1 = __importDefault(require("./router/loginRouter"));
const compainesRouter_1 = __importDefault(require("./router/compainesRouter"));
const globalErrorHandler_1 = __importDefault(require("./middlewares/globalErrorHandler"));
const responseMessage_1 = __importDefault(require("./constants/responseMessage"));
const httpError_1 = __importDefault(require("./util/httpError"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, '../', 'public')));
app.use((0, cors_1.default)({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
    origin: '*',
    credentials: true
}));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use('/api/v1', apiRouter_1.default);
app.use('/api/v1/user', userRouter_1.default);
app.use('/api/v1/cost', costRouter_1.default);
app.use('/api/v1/companies', compainesRouter_1.default);
app.use('/api/v1/auth', loginRouter_1.default);
app.use(globalErrorHandler_1.default);
app.use((req, _, next) => {
    try {
        throw new Error(responseMessage_1.default.NOT_FOUND('route'));
    }
    catch (err) {
        (0, httpError_1.default)(next, err, req, 404);
    }
});
exports.default = app;
//# sourceMappingURL=app.js.map