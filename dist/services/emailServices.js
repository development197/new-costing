"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.transporter = nodemailer_1.default.createTransport({
    host: 'superdolphins.com',
    port: 465,
    secure: true,
    auth: {
        user: 'info@superdolphins.com',
        pass: 'yv*l!MU%akkh',
    },
});
//# sourceMappingURL=emailServices.js.map