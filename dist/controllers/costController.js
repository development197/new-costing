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
const mysqlConnection_1 = __importDefault(require("../config/mysqlConnection"));
const responseMessage_1 = __importDefault(require("../constants/responseMessage"));
const httpError_1 = __importDefault(require("../util/httpError"));
const XLSX = __importStar(require("xlsx"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const promise_1 = __importDefault(require("mysql2/promise"));
exports.default = {
    getAnshInr: (req, res, nextFunc) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.query;
        try {
            const [rows] = yield mysqlConnection_1.default.query('SELECT * FROM ansh_ind WHERE company_id = ? ORDER BY source ASC', [company_id]);
            (0, httpResponse_1.default)(req, res, 200, responseMessage_1.default.SUCCESS, rows);
        }
        catch (err) {
            (0, httpError_1.default)(nextFunc, err, req, 500);
        }
    }),
    getAnshUsd: (req, res, nextFunc) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.query;
        try {
            const [rows] = yield mysqlConnection_1.default.query('SELECT * FROM ansh_usd WHERE company_id = ? ORDER BY source ASC', [company_id]);
            (0, httpResponse_1.default)(req, res, 200, responseMessage_1.default.SUCCESS, rows);
        }
        catch (err) {
            (0, httpError_1.default)(nextFunc, err, req, 500);
        }
    }),
    getCosting: (req, res, nextFunc) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const [rows] = yield mysqlConnection_1.default.query('SELECT * FROM ansh_inr');
            (0, httpResponse_1.default)(req, res, 200, responseMessage_1.default.SUCCESS, rows);
        }
        catch (err) {
            (0, httpError_1.default)(nextFunc, err, req, 500);
        }
    }),
    getDomain: (req, res, nextFunc) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.query;
        try {
            const [rows] = yield mysqlConnection_1.default.query('SELECT * FROM domain_multiplier WHERE company_id = ? ORDER BY domain ASC', [company_id]);
            (0, httpResponse_1.default)(req, res, 200, responseMessage_1.default.SUCCESS, rows);
        }
        catch (err) {
            (0, httpError_1.default)(nextFunc, err, req, 500);
        }
    }),
    getDomainMultiplier: (req, res, nextFunc) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.query;
        try {
            const [rows] = yield mysqlConnection_1.default.query(`SELECT DISTINCT domain FROM domain_multiplier WHERE company_id = ? ORDER BY domain ASC`, [company_id]);
            (0, httpResponse_1.default)(req, res, 200, responseMessage_1.default.SUCCESS, rows);
        }
        catch (err) {
            (0, httpError_1.default)(nextFunc, err, req, 500);
        }
    }),
    getPenalty: (req, res, nextFunc) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.query;
        try {
            const [rows] = yield mysqlConnection_1.default.query('SELECT * FROM penalty WHERE company_id = ? ORDER BY service ASC', [company_id]);
            (0, httpResponse_1.default)(req, res, 200, responseMessage_1.default.SUCCESS, rows);
        }
        catch (err) {
            (0, httpError_1.default)(nextFunc, err, req, 500);
        }
    }),
    getQuality: (req, res, nextFunc) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.query;
        try {
            const [rows] = yield mysqlConnection_1.default.query('SELECT * FROM quality WHERE company_id = ? ORDER BY quality ASC', [company_id]);
            (0, httpResponse_1.default)(req, res, 200, responseMessage_1.default.SUCCESS, rows);
        }
        catch (err) {
            (0, httpError_1.default)(nextFunc, err, req, 500);
        }
    }),
    getFormQuality: (req, res, nextFunc) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id, service } = req.query;
        try {
            const [rows] = yield mysqlConnection_1.default.query('SELECT DISTINCT * FROM quality WHERE company_id = ? AND service = ?', [company_id, service]);
            (0, httpResponse_1.default)(req, res, 200, responseMessage_1.default.SUCCESS, rows);
        }
        catch (err) {
            (0, httpError_1.default)(nextFunc, err, req, 500);
        }
    }),
    getCurrencyByCompany: (req, res, nextFunc) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.query;
        try {
            const [rows] = yield mysqlConnection_1.default.query(`SELECT * FROM currency where company_id = ? ORDER BY currency ASC`, [company_id]);
            (0, httpResponse_1.default)(req, res, 200, responseMessage_1.default.SUCCESS, rows);
        }
        catch (err) {
            (0, httpError_1.default)(nextFunc, err, req, 500);
        }
    }),
    getCurrency: (req, res, nextFunc) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const [rows] = yield mysqlConnection_1.default.query(`SELECT * FROM currency`);
            (0, httpResponse_1.default)(req, res, 200, responseMessage_1.default.SUCCESS, rows);
        }
        catch (err) {
            (0, httpError_1.default)(nextFunc, err, req, 500);
        }
    }),
    getServices: (req, res, nextFunc) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id } = req.query;
            if (!company_id) {
                return (0, httpResponse_1.default)(req, res, 400, 'Company ID is required');
            }
            const query = `
                SELECT service FROM ansh_ind WHERE company_id = ?
                UNION ALL
                SELECT service FROM ansh_usd WHERE company_id = ?`;
            const [rows] = yield mysqlConnection_1.default.query(query, [company_id, company_id]);
            const uniqueServices = [...new Set(rows.map((row) => row.service.trim()))].sort();
            (0, httpResponse_1.default)(req, res, 200, responseMessage_1.default.SUCCESS, uniqueServices);
        }
        catch (err) {
            (0, httpError_1.default)(nextFunc, err, req, 500);
        }
    }),
    getSourceLanguage: (req, res, nextFunc) => __awaiter(void 0, void 0, void 0, function* () {
        const { service, company_id, currency } = req.query;
        console.log(currency);
        if (typeof service !== 'string' || service.trim() === '') {
            return (0, httpResponse_1.default)(req, res, 400, 'Service parameter is required and must be a valid string.');
        }
        if (typeof company_id !== 'string' || company_id.trim() === '' || isNaN(parseInt(company_id))) {
            return (0, httpResponse_1.default)(req, res, 400, 'Company ID parameter is required and must be a valid number.');
        }
        if (typeof currency !== 'string' || currency.trim() === '') {
            return (0, httpResponse_1.default)(req, res, 400, 'Currency parameter is required and must be a valid string.');
        }
        try {
            const [currencyRows] = yield mysqlConnection_1.default.query('SELECT currency FROM currency WHERE currency = ?', [currency.trim().toUpperCase()]);
            if (currencyRows.length === 0) {
                return (0, httpResponse_1.default)(req, res, 400, `Invalid currency: ${currency}. Please provide a valid currency from the database.`);
            }
            const primaryTable = currency.trim().toUpperCase() === 'INR' ? 'ansh_ind' : 'ansh_usd';
            let [rows] = yield mysqlConnection_1.default.query(`SELECT DISTINCT source FROM ${primaryTable} WHERE service = ? AND company_id = ?`, [
                service,
                parseInt(company_id)
            ]);
            if (rows.length === 0 && primaryTable !== 'ansh_ind') {
                ;
                [rows] = yield mysqlConnection_1.default.query(`SELECT DISTINCT source FROM ansh_ind WHERE service = ? AND company_id = ?`, [service, parseInt(company_id)]);
            }
            if (rows.length === 0) {
                return (0, httpResponse_1.default)(req, res, 404, `No source languages found for service: ${service}, company_id: ${company_id}, and currency: ${currency}`);
            }
            return (0, httpResponse_1.default)(req, res, 200, 'Source languages fetched successfully.', rows);
        }
        catch (err) {
            return (0, httpError_1.default)(nextFunc, err, req, 500);
        }
    }),
    getTargetLanguage: (req, res, nextFunc) => __awaiter(void 0, void 0, void 0, function* () {
        const { source, service, company_id, currency } = req.query;
        if (typeof source !== 'string' || source.trim() === '') {
            return (0, httpResponse_1.default)(req, res, 400, 'Source parameter is required and must be a valid string.');
        }
        if (typeof service !== 'string' || service.trim() === '') {
            return (0, httpResponse_1.default)(req, res, 400, 'Service parameter is required and must be a valid string.');
        }
        if (typeof company_id !== 'string' || company_id.trim() === '' || isNaN(parseInt(company_id))) {
            return (0, httpResponse_1.default)(req, res, 400, 'Company ID parameter is required and must be a valid number.');
        }
        if (typeof currency !== 'string' || currency.trim() === '') {
            return (0, httpResponse_1.default)(req, res, 400, 'Currency parameter is required and must be a valid string.');
        }
        try {
            const [currencyRows] = yield mysqlConnection_1.default.query('SELECT currency FROM currency WHERE currency = ?', [currency.trim().toUpperCase()]);
            if (currencyRows.length === 0) {
                return (0, httpResponse_1.default)(req, res, 400, `Invalid currency: ${currency}. Please provide a valid currency from the database.`);
            }
            const primaryTable = currency.trim().toUpperCase() === 'INR' ? 'ansh_ind' : 'ansh_usd';
            let [rows] = yield mysqlConnection_1.default.query(`SELECT DISTINCT target FROM ${primaryTable} WHERE source = ? AND service = ? AND company_id = ?`, [
                source,
                service,
                parseInt(company_id)
            ]);
            if (rows.length === 0 && primaryTable !== 'ansh_ind') {
                ;
                [rows] = yield mysqlConnection_1.default.query(`SELECT DISTINCT target FROM ansh_ind WHERE source = ? AND service = ? AND company_id = ?`, [
                    source,
                    service,
                    parseInt(company_id)
                ]);
            }
            if (rows.length === 0) {
                return (0, httpResponse_1.default)(req, res, 404, `No target languages found for source: ${source}, service: ${service}, company_id: ${company_id}, and currency: ${currency}`);
            }
            return (0, httpResponse_1.default)(req, res, 200, 'Target languages fetched successfully.', rows);
        }
        catch (err) {
            return (0, httpError_1.default)(nextFunc, err, req, 500);
        }
    }),
    estimateCalculator: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { domain, currency, service, quantity, quantity_type, source_language, target_language, certificate_required, quality } = req.body;
        const { company_id } = req.query;
        if (!company_id || !domain || !currency || !service || !quantity || !quantity_type || !source_language || !Array.isArray(target_language) || !target_language.length || !quality) {
            return (0, httpResponse_1.default)(req, res, 400, 'All fields required, including company_id, must be provided.');
        }
        try {
            const estimates = [];
            let currencyMultiplier = 1;
            if (currency !== 'INR' && currency !== 'USD') {
                const [currencyRows] = yield mysqlConnection_1.default.query(`SELECT currency_m FROM currency WHERE currency = ? AND company_id = ?`, [currency, company_id]);
                if ((currencyRows === null || currencyRows === void 0 ? void 0 : currencyRows.length) > 0) {
                    currencyMultiplier = currencyRows[0].currency_m;
                }
                else {
                    return (0, httpResponse_1.default)(req, res, 400, `Currency multiplier for ${currency} not found.`);
                }
            }
            for (const target of target_language) {
                let [pricingUSD] = yield mysqlConnection_1.default.query(`SELECT * FROM ansh_usd WHERE TRIM(source) = ? AND TRIM(target) = ? AND TRIM(service) = ? AND company_id = ?`, [source_language, target, service, company_id]);
                let [pricingINR] = yield mysqlConnection_1.default.query(`SELECT * FROM ansh_ind WHERE TRIM(source) = ? AND TRIM(target) = ? AND TRIM(service) = ? AND company_id = ?`, [source_language, target, service, company_id]);
                let pricing = null;
                if ((currency === 'INR' || quantity_type === 'hours' || quantity_type === 'minutes') && pricingINR.length) {
                    pricing = pricingINR[0];
                }
                else if (pricingUSD.length) {
                    pricing = pricingUSD[0];
                }
                else if (pricingINR.length) {
                    pricing = pricingINR[0];
                }
                if (!pricing) {
                    return (0, httpResponse_1.default)(req, res, 404, `Language pair (${source_language} -> ${target}) or service not found in pricing data.`);
                }
                const priceWord = parseFloat(pricing.price_word) || 0;
                const pricePage = parseFloat(pricing.price_page) || 0;
                const priceHour = parseFloat(pricing.price_page) || 0;
                const priceMinute = parseFloat(pricing.price_word) || 0;
                let minimum = parseFloat(pricing.minimum) || 0;
                let certificateCost = parseFloat(pricing.certificate_cost) || 0;
                const [domainRows] = yield mysqlConnection_1.default.query(`SELECT domain_multiplier, add_days FROM domain_multiplier WHERE domain = ? AND service = ? AND company_id = ?`, [domain, service, company_id]);
                const domainMultiplier = (domainRows === null || domainRows === void 0 ? void 0 : domainRows.length) ? domainRows[0].domain_multiplier : 1.0;
                const domainDays = (domainRows === null || domainRows === void 0 ? void 0 : domainRows.length) ? domainRows[0].add_days : 0;
                const [qualityRows] = yield mysqlConnection_1.default.query(`SELECT add_percentage_cost, add_days FROM quality WHERE quality = ? AND service = ? AND company_id = ?`, [quality, service, company_id]);
                const qualityMultiplier = 1 + (((qualityRows === null || qualityRows === void 0 ? void 0 : qualityRows.length) ? qualityRows[0].add_percentage_cost : 0) / 100);
                const qualityDays = (qualityRows === null || qualityRows === void 0 ? void 0 : qualityRows.length) ? qualityRows[0].add_days : 0;
                if (isNaN(quantity) || quantity <= 0) {
                    return (0, httpResponse_1.default)(req, res, 400, 'Quantity must be a positive number.');
                }
                let baseCost = 0;
                let adjustedQuantity = quantity;
                if (quantity_type === 'words')
                    baseCost = priceWord * quantity;
                else if (quantity_type === 'pages')
                    baseCost = pricePage * quantity;
                else if (quantity_type === 'hours') {
                    adjustedQuantity = Math.max(quantity, 1);
                    baseCost = priceHour * adjustedQuantity;
                }
                else if (quantity_type === 'minutes') {
                    adjustedQuantity = Math.max(quantity, 10);
                    baseCost = priceMinute * adjustedQuantity;
                }
                baseCost *= domainMultiplier * qualityMultiplier * currencyMultiplier;
                certificateCost *= currencyMultiplier;
                if (certificate_required.toLowerCase() === 'yes')
                    baseCost += certificateCost;
                if (baseCost < minimum && baseCost > 0) {
                    minimum *= currencyMultiplier;
                    baseCost = minimum;
                }
                let baseDays = Math.ceil(quantity / (pricing.words_per_day || 1));
                const totalDays = baseDays + domainDays + qualityDays;
                const [penaltyRows] = yield mysqlConnection_1.default.query(`SELECT penalty_percentage FROM penalty WHERE service = ? AND strength = ? AND company_id = ?`, [service, pricing.strength, company_id]);
                const penaltyPercentage = (penaltyRows === null || penaltyRows === void 0 ? void 0 : penaltyRows.length) ? penaltyRows[0].penalty_percentage : 0;
                const [companyRows] = yield mysqlConnection_1.default.query(`SELECT penalty_msg, no_penalty FROM companies WHERE id = ?`, [company_id]);
                const penaltyMessage = penaltyPercentage > 0 ? `${companyRows[0].penalty_msg} :: ${penaltyPercentage}%.` : companyRows[0].no_penalty;
                estimates.push({
                    quality,
                    currency,
                    quantity: adjustedQuantity,
                    quantity_type,
                    service,
                    source_language,
                    target_language: target,
                    estimatedQuote: `Estimated quote is :: ${currency} ${baseCost.toFixed(2)} and would take around ${totalDays} Day(s).`,
                    penaltyClause: penaltyMessage,
                    minimumCostApplied: baseCost === minimum,
                    estimatedDays: totalDays,
                    estimatedCost: `${currency} ${baseCost.toFixed(2)}`
                });
            }
            return (0, httpResponse_1.default)(req, res, 200, 'Estimates calculated successfully.', { estimates });
        }
        catch (error) {
            return (0, httpError_1.default)(next, error, req, 500);
        }
    }),
    sendEmail: (req, res, nextFunc) => __awaiter(void 0, void 0, void 0, function* () {
        const quoteReq = req.body;
        const companyId = req.params.company_id;
        try {
            const [result] = yield mysqlConnection_1.default.query('SELECT * FROM companies WHERE id = ?', [companyId]);
            if (result.length === 0) {
                return (0, httpError_1.default)(nextFunc, new Error('Company not found'), req, 404);
            }
            const company = result[0];
            console.log(company.smtp_user, company.smtp_pass);
            const transporter = nodemailer_1.default.createTransport({
                host: company.smtp_host,
                port: 465,
                secure: true,
                auth: {
                    user: company.smtp_user,
                    pass: company.smtp_pass
                }
            });
            console.log(quoteReq.estimate, 'Hello Req Req');
            const emailHtml = `
            ${company.email_template}
            <p><strong>Name:</strong> ${quoteReq.name}</p>
            <p><strong>Email:</strong> ${quoteReq.email}</p>
            <h3>Quote Details:</h3>
            <p>${quoteReq.estimate}</p>
            </br>
            </br>
            Thanks & Regards<br />
            ${company.email_signature}
        `;
            const mailOptions = {
                from: company.smtp_user,
                to: quoteReq.email,
                cc: company.smtp_user,
                subject: company.email_subject || 'Thanks for requesting a quote',
                html: emailHtml
            };
            const info = yield transporter.sendMail(mailOptions);
            (0, httpResponse_1.default)(req, res, 200, 'Quote email sent successfully', info);
        }
        catch (err) {
            (0, httpError_1.default)(nextFunc, err, req, 500);
        }
    }),
    importExcel: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.params;
        if (!company_id) {
            return (0, httpResponse_1.default)(req, res, 400, 'Company ID is required');
        }
        if (!req.file) {
            return (0, httpResponse_1.default)(req, res, 400, 'No file uploaded');
        }
        try {
            const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
            if (!sheetData || sheetData.length === 0) {
                return (0, httpResponse_1.default)(req, res, 400, 'The Excel file is empty');
            }
            const parseNumber = (value) => {
                if (typeof value === 'number') {
                    return value;
                }
                if (typeof value === 'string') {
                    const cleaned = value.replace(/,/g, '').trim();
                    const parsed = parseFloat(cleaned);
                    if (!isNaN(parsed)) {
                        return parsed;
                    }
                    console.warn(`Invalid number format: "${value}"`);
                }
                return 0;
            };
            const cleanedData = sheetData.map((row) => [
                row.source || '',
                row.target || '',
                parseNumber(row.price_word),
                parseNumber(row.price_page),
                row.service || '',
                parseNumber(row.minimum),
                parseNumber(row.certificate_cost),
                parseNumber(row.words_per_day),
                parseNumber(row.pages_per_day),
                parseNumber(row.strength),
                parseInt(company_id, 10)
            ]);
            const connection = yield promise_1.default.createConnection({
                host: '173.231.200.72',
                user: 'anshin_costing',
                password: 'zEF5$,f(lQbm',
                database: 'anshin_costing'
            });
            try {
                yield connection.beginTransaction();
                yield connection.query(`DELETE FROM ansh_ind WHERE company_id = ?`, [parseInt(company_id, 10)]);
                const batchSize = 100;
                for (let i = 0; i < cleanedData.length; i += batchSize) {
                    const batch = cleanedData.slice(i, i + batchSize);
                    yield connection.query(`INSERT INTO ansh_ind (
                            source, target, price_word, price_page, service, 
                            minimum, certificate_cost, words_per_day, pages_per_day, strength, company_id
                        ) VALUES ?`, [batch]);
                }
                yield connection.commit();
                return (0, httpResponse_1.default)(req, res, 200, 'Data imported successfully');
            }
            catch (err) {
                yield connection.rollback();
                console.error('Error during transaction:', err);
                return (0, httpResponse_1.default)(req, res, 500, 'Failed to import data');
            }
            finally {
                yield connection.end();
            }
        }
        catch (err) {
            console.error('Error:', err);
            return (0, httpResponse_1.default)(req, res, 500, 'Internal Server Error');
        }
    }),
    importExcelUSD: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.params;
        if (!company_id) {
            return (0, httpResponse_1.default)(req, res, 400, 'Company ID is required');
        }
        if (!req.file) {
            return (0, httpResponse_1.default)(req, res, 400, 'No file uploaded');
        }
        try {
            const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
            if (!sheetData || sheetData.length === 0) {
                return (0, httpResponse_1.default)(req, res, 400, 'The Excel file is empty');
            }
            const parseNumber = (value) => {
                if (typeof value === 'number') {
                    return value;
                }
                if (typeof value === 'string') {
                    const cleaned = value.replace(/,/g, '').trim();
                    const parsed = parseFloat(cleaned);
                    if (!isNaN(parsed)) {
                        return parsed;
                    }
                    console.warn(`Invalid number format: "${value}"`);
                }
                return 0;
            };
            const cleanedData = sheetData.map((row) => [
                row.source || '',
                row.target || '',
                parseNumber(row.price_word),
                parseNumber(row.price_page),
                row.service || '',
                parseNumber(row.minimum),
                parseNumber(row.certificate_cost),
                parseNumber(row.words_per_day),
                parseNumber(row.pages_per_day),
                parseNumber(row.strength),
                parseInt(company_id, 10)
            ]);
            if (cleanedData.length !== sheetData.length) {
                console.error('Mismatch in data length: Cleaned data is incomplete.');
                return (0, httpResponse_1.default)(req, res, 400, 'Data cleaning error: Incomplete data.');
            }
            const connection = yield promise_1.default.createConnection({
                host: '173.231.200.72',
                user: 'anshin_costing',
                password: 'zEF5$,f(lQbm',
                database: 'anshin_costing'
            });
            try {
                yield connection.beginTransaction();
                yield connection.query(`DELETE FROM ansh_usd WHERE company_id = ?`, [parseInt(company_id, 10)]);
                const batchSize = 100;
                for (let i = 0; i < cleanedData.length; i += batchSize) {
                    const batch = cleanedData.slice(i, i + batchSize);
                    yield connection.query(`INSERT INTO ansh_usd (
                        source, target, price_word, price_page, service, 
                        minimum, certificate_cost, words_per_day, pages_per_day, strength, company_id
                    ) VALUES ?`, [batch]);
                }
                yield connection.commit();
                return (0, httpResponse_1.default)(req, res, 200, 'Data imported successfully');
            }
            catch (err) {
                yield connection.rollback();
                console.error('Error during transaction:', err);
                return (0, httpResponse_1.default)(req, res, 500, 'Failed to import data');
            }
            finally {
                yield connection.end();
            }
        }
        catch (err) {
            console.error('Error:', err);
            return (0, httpResponse_1.default)(req, res, 500, 'Internal Server Error');
        }
    }),
    importExcelDomainMultiplier: (req, res, nextFunc) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id } = req.params;
            if (!company_id) {
                return (0, httpResponse_1.default)(req, res, 400, 'Company ID is required');
            }
            if (!req.file) {
                return (0, httpResponse_1.default)(req, res, 400, 'No file uploaded');
            }
            const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
            if (!sheetData || sheetData.length === 0) {
                return (0, httpResponse_1.default)(req, res, 400, 'The Excel file is empty');
            }
            try {
                yield mysqlConnection_1.default.query(`DELETE FROM domain_multiplier WHERE company_id = ?`, [parseInt(company_id)]);
                const insertPromises = sheetData.map((row) => __awaiter(void 0, void 0, void 0, function* () {
                    const { domain = '', domain_multiplier = '0', add_days = '0', service = '' } = row;
                    yield mysqlConnection_1.default.query(`INSERT INTO domain_multiplier (
                            domain, domain_multiplier, add_days, service, company_id
                        ) VALUES (?, ?, ?, ?, ?)`, [
                        domain.toString(),
                        domain_multiplier.toString(),
                        add_days.toString(),
                        service.toString(),
                        parseInt(company_id)
                    ]);
                }));
                yield Promise.all(insertPromises);
                (0, httpResponse_1.default)(req, res, 200, 'Data imported successfully');
            }
            catch (err) {
                throw err;
            }
        }
        catch (err) {
            (0, httpError_1.default)(nextFunc, err, req, 500);
        }
    }),
    importExcelPenalty: (req, res, nextFunc) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id } = req.params;
            if (!company_id) {
                return (0, httpResponse_1.default)(req, res, 400, 'Company ID is required');
            }
            if (!req.file) {
                return (0, httpResponse_1.default)(req, res, 400, 'No file uploaded');
            }
            const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
            if (!sheetData || sheetData.length === 0) {
                return (0, httpResponse_1.default)(req, res, 400, 'The Excel file is empty');
            }
            try {
                yield mysqlConnection_1.default.query(`DELETE FROM penalty WHERE company_id = ?`, [parseInt(company_id)]);
                const insertPromises = sheetData.map((row) => __awaiter(void 0, void 0, void 0, function* () {
                    const { service = '', strength = '', penalty_percentage = '0' } = row;
                    yield mysqlConnection_1.default.query(`INSERT INTO penalty (
                            service, strength, penalty_percentage, company_id
                        ) VALUES (?, ?, ?, ?)`, [
                        service.toString(),
                        strength.toString(),
                        penalty_percentage.toString(),
                        parseInt(company_id)
                    ]);
                }));
                yield Promise.all(insertPromises);
                (0, httpResponse_1.default)(req, res, 200, 'Penalty data imported successfully');
            }
            catch (err) {
                throw err;
            }
        }
        catch (err) {
            (0, httpError_1.default)(nextFunc, err, req, 500);
        }
    }),
    importExcelQuality: (req, res, nextFunc) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id } = req.params;
            if (!company_id) {
                return (0, httpResponse_1.default)(req, res, 400, 'Company ID is required');
            }
            if (!req.file) {
                return (0, httpResponse_1.default)(req, res, 400, 'No file uploaded');
            }
            const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
            if (!sheetData || sheetData.length === 0) {
                return (0, httpResponse_1.default)(req, res, 400, 'The Excel file is empty');
            }
            try {
                yield mysqlConnection_1.default.query(`DELETE FROM quality WHERE company_id = ?`, [parseInt(company_id)]);
                const insertPromises = sheetData.map((row) => __awaiter(void 0, void 0, void 0, function* () {
                    const { quality = '', service = '', add_percentage_cost = '0', add_days = '0' } = row;
                    yield mysqlConnection_1.default.query(`INSERT INTO quality (
                            quality, service, add_percentage_cost, add_days, company_id
                        ) VALUES (?, ?, ?, ?, ?)`, [
                        quality.toString(),
                        service.toString(),
                        add_percentage_cost.toString(),
                        add_days.toString(),
                        parseInt(company_id)
                    ]);
                }));
                yield Promise.all(insertPromises);
                (0, httpResponse_1.default)(req, res, 200, 'Quality data imported successfully');
            }
            catch (err) {
                throw err;
            }
        }
        catch (err) {
            (0, httpError_1.default)(nextFunc, err, req, 500);
        }
    }),
    importExcelCurrency: (req, res, nextFunc) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id } = req.params;
            if (!company_id) {
                return (0, httpResponse_1.default)(req, res, 400, 'Company ID is required');
            }
            if (!req.file) {
                return (0, httpResponse_1.default)(req, res, 400, 'No file uploaded');
            }
            try {
                const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
                const sheetName = workbook.SheetNames[0];
                const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
                if (!sheetData || sheetData.length === 0) {
                    return (0, httpResponse_1.default)(req, res, 400, 'The Excel file is empty');
                }
                const parseNumber = (value) => {
                    if (typeof value === 'string') {
                        const cleaned = value.replace(/,/g, '').trim();
                        const parsed = parseFloat(cleaned);
                        if (isNaN(parsed)) {
                            console.warn(`Invalid number format: "${value}"`);
                            return 0;
                        }
                        return parsed;
                    }
                    return typeof value === 'number' ? value : 0;
                };
                const cleanedData = sheetData.map((row) => [
                    row.id || '',
                    row.currency || '',
                    parseNumber(row.currency_m || '0'),
                    parseInt(company_id, 10)
                ]);
                const connection = yield promise_1.default.createConnection({
                    host: '173.231.200.72',
                    user: 'anshin_costing',
                    password: 'zEF5$,f(lQbm',
                    database: 'anshin_costing'
                });
                try {
                    yield connection.beginTransaction();
                    yield connection.query(`DELETE FROM currency WHERE company_id = ?`, [parseInt(company_id, 10)]);
                    const batchSize = 100;
                    for (let i = 0; i < cleanedData.length; i += batchSize) {
                        const batch = cleanedData.slice(i, i + batchSize);
                        yield connection.query(`INSERT INTO currency (
                                id, currency, currency_m, company_id
                            ) VALUES ?`, [batch]);
                    }
                    yield connection.commit();
                    return (0, httpResponse_1.default)(req, res, 200, 'Currency data imported successfully');
                }
                catch (err) {
                    yield connection.rollback();
                    console.error('Error during transaction:', err);
                    return (0, httpResponse_1.default)(req, res, 500, 'Failed to import currency data');
                }
                finally {
                    yield connection.end();
                }
            }
            catch (err) {
                console.error('Error:', err);
                return (0, httpResponse_1.default)(req, res, 500, 'Internal Server Error');
            }
        }
        catch (err) {
            (0, httpError_1.default)(nextFunc, err, req, 500);
        }
    }),
    deleteCompanyById: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const [deleteResult] = yield mysqlConnection_1.default.query('DELETE FROM ansh_ind WHERE id = ?', [id]);
            if (deleteResult.affectedRows === 0) {
                return (0, httpResponse_1.default)(req, res, 404, 'Company not found.');
            }
            (0, httpResponse_1.default)(req, res, 200, 'Row deleted successfully.');
        }
        catch (err) {
            (0, httpError_1.default)(next, err, req, 500);
        }
    }),
    getAllEstimates: (req, res, nextFunc) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.query;
        try {
            const [rows] = yield mysqlConnection_1.default.query('SELECT * FROM estimate_cost WHERE company_id = ?', company_id);
            (0, httpResponse_1.default)(req, res, 200, responseMessage_1.default.SUCCESS, rows);
        }
        catch (err) {
            (0, httpError_1.default)(nextFunc, err, req, 500);
        }
    }),
    getAllUsers: (req, res, nextFunc) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const [countResult] = yield mysqlConnection_1.default.query('SELECT COUNT(*) AS total FROM users');
            const total = countResult[0].total;
            (0, httpResponse_1.default)(req, res, 200, responseMessage_1.default.SUCCESS, { total });
        }
        catch (err) {
            (0, httpError_1.default)(nextFunc, err, req, 500);
        }
    }),
    getAllCompanies: (req, res, nextFunc) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const [countResult] = yield mysqlConnection_1.default.query('SELECT COUNT(*) AS total FROM companies');
            const total = countResult[0].total;
            (0, httpResponse_1.default)(req, res, 200, responseMessage_1.default.SUCCESS, { total });
        }
        catch (err) {
            (0, httpError_1.default)(nextFunc, err, req, 500);
        }
    }),
    getAllReports: (req, res, nextFunc) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const [countResult] = yield mysqlConnection_1.default.query('SELECT COUNT(*) AS total FROM estimate_cost');
            const total = countResult[0].total;
            (0, httpResponse_1.default)(req, res, 200, responseMessage_1.default.SUCCESS, { total });
        }
        catch (err) {
            (0, httpError_1.default)(nextFunc, err, req, 500);
        }
    }),
    getAllServices: (req, res, nextFunc) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const [rows] = yield mysqlConnection_1.default.query('SELECT COUNT(*) AS totalServices FROM ansh_ind');
            const totalServices = ((_a = rows[0]) === null || _a === void 0 ? void 0 : _a.service) || 0;
            (0, httpResponse_1.default)(req, res, 200, 'Total unique services fetched successfully.', { totalServices });
        }
        catch (err) {
            (0, httpError_1.default)(nextFunc, err, req, 500);
        }
    })
};
//# sourceMappingURL=costController.js.map