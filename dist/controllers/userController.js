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
const httpResponse_1 = __importDefault(require("../util/httpResponse"));
const responseMessage_1 = __importDefault(require("../constants/responseMessage"));
const httpError_1 = __importDefault(require("../util/httpError"));
const mysqlConnection_1 = __importDefault(require("../config/mysqlConnection"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.default = {
    register: (req, res, nextFunc) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            return (0, httpError_1.default)(nextFunc, new Error('Missing required fields'), req, 400);
        }
        try {
            const [result] = yield mysqlConnection_1.default.query('SELECT * FROM users WHERE email = ?', [email]);
            console.log('Query Result:', result);
            if (result && result.length > 0) {
                return (0, httpError_1.default)(nextFunc, new Error('Email already exists'), req, 404);
            }
            yield mysqlConnection_1.default.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, password, role]);
            (0, httpResponse_1.default)(req, res, 200, responseMessage_1.default.SUCCESS);
        }
        catch (err) {
            (0, httpError_1.default)(nextFunc, err, req, 500);
        }
    }),
    updateUser: (req, res, nextFunc) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const { name, email, password, role } = req.body;
        try {
            const [existingUser] = yield mysqlConnection_1.default.query('SELECT * FROM users WHERE id = ?', [id]);
            if (existingUser.length === 0) {
                return (0, httpError_1.default)(nextFunc, new Error('User not found'), req, 404);
            }
            yield mysqlConnection_1.default.query('UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?', [
                name || existingUser[0].name,
                email || existingUser[0].email,
                password,
                role || existingUser[0].role,
                id
            ]);
            (0, httpResponse_1.default)(req, res, 200, responseMessage_1.default.SUCCESS);
        }
        catch (err) {
            (0, httpError_1.default)(nextFunc, err, req, 500);
        }
    }),
    deleteUser: (req, res, nextFunc) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const [existingUser] = yield mysqlConnection_1.default.query('SELECT * FROM users WHERE id = ?', [id]);
            if (existingUser.length === 0) {
                return (0, httpError_1.default)(nextFunc, new Error('User not found'), req, 404);
            }
            yield mysqlConnection_1.default.query('DELETE FROM users WHERE id = ?', [id]);
            (0, httpResponse_1.default)(req, res, 200, responseMessage_1.default.SUCCESS);
        }
        catch (err) {
            (0, httpError_1.default)(nextFunc, err, req, 500);
        }
    }),
    getUserById: (req, res, nextFunc) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId } = req.params;
            const [results] = yield mysqlConnection_1.default.query('SELECT * FROM users WHERE id = ?', [userId]);
            if (results.length === 0) {
                return (0, httpResponse_1.default)(req, res, 404, 'User not found.');
            }
            (0, httpResponse_1.default)(req, res, 200, 'User found', { company: results[0] });
        }
        catch (err) {
            (0, httpError_1.default)(nextFunc, err, req, 500);
        }
    }),
    getAllUsers: (req, res, nextFunc) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const [rows] = yield mysqlConnection_1.default.query('SELECT * FROM users');
            (0, httpResponse_1.default)(req, res, 200, responseMessage_1.default.SUCCESS, rows);
        }
        catch (err) {
            (0, httpError_1.default)(nextFunc, err, req, 500);
        }
    }),
    login: (req, res, nextFunc) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        try {
            const [result] = yield mysqlConnection_1.default.query('SELECT * FROM users WHERE email = ?', [email]);
            if (!result.user) {
                return res.status(404).json({ error: 'User not found' });
            }
            if (result.password !== password) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            const token = jsonwebtoken_1.default.sign({ userId: result.id, role: result.role }, '1234456', { expiresIn: '1h' });
            res.json({
                user: {
                    id: result.id,
                    name: result.name,
                    email: result.email,
                    role: result.role
                },
                token
            });
        }
        catch (error) {
            (0, httpError_1.default)(nextFunc, error, req, 500);
        }
    })
};
//# sourceMappingURL=userController.js.map