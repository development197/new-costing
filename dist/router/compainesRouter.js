"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const companiesController_1 = __importDefault(require("../controllers/companiesController"));
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
router.route('/create-company').post(upload.single('logo'), companiesController_1.default.createCompanies);
router.route('/get-all').get(companiesController_1.default.getAllCompanies);
router.route('/get/:companyId').get(companiesController_1.default.getCompanyById);
router.route('/get-company/:app_name').get(companiesController_1.default.getCompanyByApp);
router.route('/delete-company/:companyId').delete(companiesController_1.default.deleteCompanyById);
router.route('/update-company/:companyId').put(upload.single('logo'), companiesController_1.default.updateCompanyById);
exports.default = router;
//# sourceMappingURL=compainesRouter.js.map