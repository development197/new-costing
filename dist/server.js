"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const databaseService_1 = require("./services/databaseService");
const PORT = 3300;
const server = app_1.default.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, databaseService_1.connectToDatabase)();
        console.log(`Server is running on port ${PORT}`);
    }
    catch (err) {
        console.error('Error starting application:', err);
        server.close(() => process.exit(1));
    }
}))();
//# sourceMappingURL=server.js.map