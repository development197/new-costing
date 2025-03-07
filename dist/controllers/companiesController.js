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
const cloudinaryService_1 = __importDefault(require("../services/cloudinaryService"));
const mysqlConnection_1 = __importDefault(require("../config/mysqlConnection"));
const responseMessage_1 = __importDefault(require("../constants/responseMessage"));
const httpError_1 = __importDefault(require("../util/httpError"));
exports.default = {
    createCompanies: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const company = req.body;
        if (!company.app_name) {
            return (0, httpResponse_1.default)(req, res, 400, 'App name is required!');
        }
        if (!company.company_name) {
            return (0, httpResponse_1.default)(req, res, 400, 'Company name is required!');
        }
        try {
            const [existingCompany] = yield mysqlConnection_1.default.query('SELECT app_name FROM companies WHERE app_name = ?', [company.app_name]);
            if (existingCompany && existingCompany.length > 0) {
                return (0, httpResponse_1.default)(req, res, 401, 'App name must be unique.');
            }
            let logoUrl = 'https://dummyimage.com/200x200/cccccc/000000&text=Default+Logo';
            if (req.file) {
                const uploadPromise = new Promise((resolve, reject) => {
                    var _a;
                    cloudinaryService_1.default.uploader
                        .upload_stream({ folder: 'company_logos', resource_type: 'auto' }, (error, result) => {
                        if (error)
                            reject(error);
                        else
                            resolve(result);
                    })
                        .end((_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer);
                });
                const imageResult = yield uploadPromise;
                logoUrl = (imageResult === null || imageResult === void 0 ? void 0 : imageResult.secure_url) || logoUrl;
            }
            yield mysqlConnection_1.default.query(`INSERT INTO companies 
                (company_name, app_name, email, phone, logo, banner, mail_service, smtp_host, smtp_port, smtp_user, smtp_pass, status, email_subject, email_signature, email_template, form_header, form_footer, url, bg_color, btn_color, penalty_msg, no_penalty) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                company.company_name,
                company.app_name,
                company.email,
                company.phone,
                logoUrl,
                company.banner,
                'gmail',
                company.smtp_host,
                company.smtp_port,
                company.smtp_user,
                company.smtp_pass,
                company.status || 'active',
                company.email_subject || null,
                company.email_signature || null,
                company.email_template || null,
                company.form_header || null,
                company.form_footer || null,
                company.url || null,
                company.bg_color || null,
                company.btn_color || null,
                company.penalty_msg || null,
                company.no_penalty || null
            ]);
            return (0, httpResponse_1.default)(req, res, 201, 'Company Created', { CompanyName: company.company_name });
        }
        catch (err) {
            console.error('Error creating company:', err);
            return (0, httpResponse_1.default)(req, res, 500, 'Server Error');
        }
    }),
    getAllCompanies: (req, res, nextFunc) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const [rows] = yield mysqlConnection_1.default.query('SELECT * FROM companies');
            (0, httpResponse_1.default)(req, res, 200, responseMessage_1.default.SUCCESS, rows);
        }
        catch (err) {
            (0, httpError_1.default)(nextFunc, err, req, 500);
        }
    }),
    getCompanyById: (req, res, nextFunc) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { companyId } = req.params;
            const [results] = yield mysqlConnection_1.default.query('SELECT * FROM companies WHERE id = ?', [companyId]);
            if (results.length === 0) {
                return (0, httpResponse_1.default)(req, res, 404, 'Company not found.');
            }
            (0, httpResponse_1.default)(req, res, 200, 'Company found', { company: results[0] });
        }
        catch (err) {
            (0, httpError_1.default)(nextFunc, err, req, 500);
        }
    }),
    deleteCompanyById: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const { companyId } = req.params;
            const [results] = yield mysqlConnection_1.default.query('SELECT logo FROM companies WHERE id = ?', [companyId]);
            if (results.length === 0) {
                return (0, httpResponse_1.default)(req, res, 404, 'Company not found.');
            }
            const logoUrl = results[0].logo;
            if (logoUrl) {
                const publicId = (_a = logoUrl.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('.')[0];
                if (publicId) {
                    yield cloudinaryService_1.default.uploader.destroy(publicId);
                }
            }
            const [deleteResult] = yield mysqlConnection_1.default.query('DELETE FROM companies WHERE id = ?', [companyId]);
            if (deleteResult.affectedRows === 0) {
                return (0, httpResponse_1.default)(req, res, 404, 'Company not found.');
            }
            (0, httpResponse_1.default)(req, res, 200, 'Company deleted successfully.');
        }
        catch (err) {
            (0, httpError_1.default)(next, err, req, 500);
        }
    }),
    updateCompanyById: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { companyId } = req.params;
            const company = req.body;
            console.log(company);
            if (!company.company_name || !company.email) {
                return (0, httpResponse_1.default)(req, res, 400, 'All fields are required.');
            }
            const [existingCompanies] = yield mysqlConnection_1.default.query('SELECT * FROM companies WHERE id = ?', [companyId]);
            if (!existingCompanies || existingCompanies.length === 0) {
                return (0, httpResponse_1.default)(req, res, 404, 'Company not found.');
            }
            const existingCompany = existingCompanies[0];
            let logoUrl = existingCompany.logo;
            if (req.file) {
                const imageResult = yield new Promise((resolve, reject) => {
                    var _a;
                    cloudinaryService_1.default.uploader
                        .upload_stream({ folder: 'company_logos', resource_type: 'auto' }, (error, result) => {
                        if (error)
                            reject(error);
                        if (result)
                            resolve(result);
                    })
                        .end((_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer);
                });
                logoUrl = imageResult.secure_url;
            }
            const query = `
              UPDATE companies
              SET 
                  company_name = ?, 
                  app_name = ?, 
                  email = ?, 
                  phone = ?, 
                  logo = ?, 
                  banner = ?, 
                  mail_service = ?, 
                  smtp_host = ?, 
                  smtp_port = ?, 
                  smtp_user = ?, 
                  smtp_pass = ?, 
                  status = ?, 
                  email_subject = ?, 
                  email_signature = ?, 
                  email_template = ?, 
                  form_header = ?, 
                  form_footer = ?, 
                  url = ?, 
                  bg_color = ?, 
                  btn_color = ?, 
                  penalty_msg = ?, 
                  no_penalty = ?
              WHERE id = ?
            `;
            const queryValues = [
                company.company_name,
                company.app_name,
                company.email,
                company.phone,
                logoUrl,
                company.banner,
                'gmail',
                company.smtp_host,
                company.smtp_port,
                company.smtp_user,
                company.smtp_pass,
                company.status || 'active',
                company.email_subject || null,
                company.email_signature || null,
                company.email_template || null,
                company.form_header || null,
                company.form_footer || null,
                company.url || null,
                company.bg_color || null,
                company.btn_color || null,
                company.penalty_msg || null,
                company.no_penalty || null,
                companyId,
            ];
            const [result] = yield mysqlConnection_1.default.query(query, queryValues);
            if (result.affectedRows === 0) {
                return (0, httpResponse_1.default)(req, res, 404, 'Company not found.');
            }
            (0, httpResponse_1.default)(req, res, 200, 'Company updated successfully.');
        }
        catch (err) {
            (0, httpError_1.default)(next, err, req, 500);
        }
    }),
    getCompanyByApp: (req, res, nextFunc) => __awaiter(void 0, void 0, void 0, function* () {
        const app_name = req.params.app_name;
        console.log('Received app_name:', app_name);
        try {
            const [rows] = yield mysqlConnection_1.default.query('SELECT * FROM companies WHERE app_name = ?', [app_name]);
            if (rows.length === 0) {
                return (0, httpResponse_1.default)(req, res, 404, 'No companies found for this app_name');
            }
            (0, httpResponse_1.default)(req, res, 200, responseMessage_1.default.SUCCESS, rows);
        }
        catch (err) {
            (0, httpError_1.default)(nextFunc, err, req, 500);
        }
    })
};
//# sourceMappingURL=companiesController.js.map