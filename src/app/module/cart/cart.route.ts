import express,{Router} from 'express'
import auth, { Role } from '../../../middlewares/auth'
import { cartController } from './cart.controller'


const router = express.Router()

router.post("/",auth(Role.CUSTOMER),cartController.createCart)
router.get("/",auth(Role.CUSTOMER),cartController.getAllOwnCart)
router.delete("/:cartItemId",auth(Role.CUSTOMER),cartController.deleteCart)


export const cartRouter:Router = router