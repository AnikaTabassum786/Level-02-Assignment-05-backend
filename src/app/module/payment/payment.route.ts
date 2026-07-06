import express from "express";
import { paymentController } from "./payment.controller";
import auth, { Role } from "../../../middlewares/auth";



const router = express.Router();

router.post(
  "/create-checkout-session",
  auth(Role.CUSTOMER),
  paymentController.createCheckoutSession
);

router.post(
  "/webhook",
  paymentController.stripeWebhook
);



export const paymentRoutes = router;