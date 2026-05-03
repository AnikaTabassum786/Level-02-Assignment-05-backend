import express,{Router} from 'express'
import { medicineController } from './medicine.controller'
import auth, { Role } from '../../../middlewares/auth'

const router = express.Router()

router.post("/",auth(Role.SELLER),medicineController.createMedicine)
router.get("/",medicineController.getAllMedicines)
router.get("/:medicineId",medicineController.getMedicineById)

export const medicineRouter:Router = router