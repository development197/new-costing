"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = __importDefault(require("os"));
const config_1 = __importDefault(require("../config/config"));
exports.default = {
    getSystemHealth: () => {
        return {
            cpuUsage: os_1.default.loadavg(),
            totalMemory: `${(os_1.default.totalmem() / 1024 / 1024).toFixed(2)} MB`,
            freeMemory: `${(os_1.default.freemem() / 1024 / 1024).toFixed(2)} MB`
        };
    },
    getApplicationHealth: () => {
        return {
            environment: config_1.default.ENV,
            uptime: `${process.uptime().toFixed(2)} second`,
            memoryUsage: {
                heapTotal: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`,
                heapUsed: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
            }
        };
    }
};
//# sourceMappingURL=quicker.js.map