import { Router } from 'express'
import userController from '../controllers/userController'

const router = Router()

router.route('/register').post(userController.register)

router.route('/get').get(userController.getAllUsers)
router.route('/get/:userId').get(userController.getUserById)
router.route('/update/:id').put(userController.updateUser)
router.route('/delete/:id').delete(userController.deleteUser)
// router.route('/health').get(apiController.health)

export default router
