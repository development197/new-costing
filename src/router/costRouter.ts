import { Router } from 'express'
import costController from '../controllers/costController'

import multer from 'multer'

const router = Router()

const storage = multer.memoryStorage()
const upload = multer({ storage })

// cost
router.route('/get-quality').get(costController.getQuality)
router.route('/get-form-quality').get(costController.getFormQuality)
router.route('/get-penalty').get(costController.getPenalty)
router.route('/get-domainmultiplier').get(costController.getDomainMultiplier)
router.route('/get-anshinr').get(costController.getAnshInr)
router.route('/get-anshusd').get(costController.getAnshUsd)
router.route('/get-costing').get(costController.getCosting)
router.route('/get-domain').get(costController.getDomain)

router.route('/get-currency').get(costController.getCurrency)

router.route('/get-currency-company').get(costController.getCurrencyByCompany)

router.route('/get-services').get(costController.getServices)

router.route('/get-source-lang').get(costController.getSourceLanguage)
router.route('/get-target-lang').get(costController.getTargetLanguage)

router.route('/get-estimate').post(costController.estimateCalculator)

router.route('/send-email/:company_id').post(costController.sendEmail)

router.route('/import-excel/:company_id').post(upload.single('file'), costController.importExcel)
router.route('/import-excel-usd/:company_id').post(upload.single('file'), costController.importExcelUSD)

router.route('/import-excel-domain/:company_id').post(upload.single('file'), costController.importExcelDomainMultiplier)
router.route('/import-excel-penalty/:company_id').post(upload.single('file'), costController.importExcelPenalty)
router.route('/import-excel-quality/:company_id').post(upload.single('file'), costController.importExcelQuality)

router.route('/import-excel-currency/:company_id').post(upload.single('file'), costController.importExcelCurrency)

router.route('/delete-company/:id').delete(costController.deleteCompanyById)

router.route('/get-all-estimates').get(costController.getAllEstimates)

router.route('/get-total-users').get(costController.getAllUsers)

router.route('/get-total-companies').get(costController.getAllCompanies)

router.route('/get-total-reports').get(costController.getAllReports)

router.route('/get-total-services').get(costController.getAllServices)

export default router
