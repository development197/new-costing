"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../controllers/userController"));
const router = (0, express_1.Router)();
router.route('/register').post(userController_1.default.register);
router.route('/get').get(userController_1.default.getAllUsers);
router.route('/get/:userId').get(userController_1.default.getUserById);
router.route('/update/:id').put(userController_1.default.updateUser);
router.route('/delete/:id').delete(userController_1.default.deleteUser);
exports.default = router;
//# sourceMappingURL=userRouter.js.map