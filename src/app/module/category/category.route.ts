import express,{Router} from 'express'
import { categoryController } from "./category.controller"
import auth, { Role } from '../../../middlewares/auth'



const router = express.Router()

router.post("/",auth(Role.ADMIN),categoryController.createCategory)
router.get("/",categoryController.getAllCategory)
router.delete("/:categoryId",auth(Role.ADMIN),categoryController.deleteCategory)


export const categoryRouter:Router = router