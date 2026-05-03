import express,{Router} from 'express'
import { medicineController } from './medicine.controller'
import auth, { Role } from '../../../middlewares/auth'

const router = express.Router()

router.post("/",auth(Role.SELLER),medicineController.createMedicine)
router.get("/",medicineController.getAllMedicines)

export const medicineRouter:Router = router