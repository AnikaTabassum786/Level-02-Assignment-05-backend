import express,{Router} from 'express'
import { medicineController } from './medicine.controller'
import auth, { Role } from '../../../middlewares/auth'
import { multerUpload } from '../../../config/multer.config'
import { validateRequest } from '../../../middlewares/validateRequest'
import { medicineValidation } from './medicine.validation'

const router = express.Router()

router.post("/",auth(Role.SELLER),
multerUpload.single("file"),
validateRequest(medicineValidation.createMedicineZodSchema),
medicineController.createMedicine)
router.get("/",medicineController.getAllMedicines)
router.get("/:medicineId",medicineController.getMedicineById)
router.patch("/:medicineId",auth(Role.SELLER),medicineController.updateMedicineById)
router.delete("/:medicineId",auth(Role.SELLER),medicineController.deleteMedicine)
export const medicineRouter:Router = router