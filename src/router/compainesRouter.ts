import { Router } from 'express'
import companiesController from '../controllers/companiesController'
import multer from 'multer'

const router = Router()

const storage = multer.memoryStorage();
const upload = multer({ storage });

// cost
router.route('/create-company').post(upload.single('logo'),companiesController.createCompanies)

router.route('/get-all').get(companiesController.getAllCompanies)


router.route('/get/:companyId').get(companiesController.getCompanyById);

router.route('/get-company/:app_name').get(companiesController.getCompanyByApp);

router.route('/delete-company/:companyId').delete(companiesController.deleteCompanyById);

router.route('/update-company/:companyId').put(upload.single('logo'), companiesController.updateCompanyById);

// router.get('/companies', companyController);


export default router
