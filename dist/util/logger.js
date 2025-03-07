"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __importDefault(require("util"));
const winston_1 = require("winston");
const config_1 = __importDefault(require("../config/config"));
const application_1 = require("../constants/application");
const path_1 = __importDefault(require("path"));
const sourceMapSupport = __importStar(require("source-map-support"));
sourceMapSupport.install();
const consoleLogFormat = winston_1.format.printf((info) => {
    const { level, message, timestamp, meta = {} } = info;
    const customLevel = level.toLocaleUpperCase();
    const customTimestamp = timestamp;
    const customMessage = message;
    const customMeta = util_1.default.inspect(meta, {
        showHidden: false,
        depth: null
    });
    const customLog = `${customLevel} [${customTimestamp}]  ${customMessage}\n${'META'} ${customMeta}`;
    return customLog;
});
const fileLogFormat = winston_1.format.printf((info) => {
    const { level, message, timestamp, meta = {} } = info;
    const logMeta = {};
    for (const [key, value] of Object.entries(meta)) {
        if (value instanceof Error) {
            logMeta[key] = {
                name: value.name,
                message: value.message,
                trace: value.stack || ''
            };
        }
        else {
            logMeta[key] = value;
        }
    }
    const logData = {
        level: level.toUpperCase(),
        message,
        timestamp,
        meta: logMeta
    };
    return JSON.stringify(logData, null, 4);
});
const consoleTransport = () => {
    if (config_1.default.ENV === application_1.EApplicationEnvironment.DEVELOPMENT) {
        return [
            new winston_1.transports.Console({
                level: 'info',
                format: winston_1.format.combine(winston_1.format.timestamp(), consoleLogFormat)
            })
        ];
    }
    return [];
};
const fileTransport = () => {
    return [
        new winston_1.transports.File({
            filename: path_1.default.join(__dirname, '../', '../', 'logs', `${config_1.default.ENV}.log`),
            level: 'info',
            format: winston_1.format.combine(winston_1.format.timestamp(), fileLogFormat)
        })
    ];
};
exports.default = (0, winston_1.createLogger)({
    defaultMeta: {
        meta: {}
    },
    transports: [...fileTransport(), ...consoleTransport()]
});
//# sourceMappingURL=logger.js.map