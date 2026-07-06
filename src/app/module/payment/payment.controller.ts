/* eslint-disable no-useless-catch */


import { Request, Response } from "express";
import { paymentService } from "./payment.service";

const createCheckoutSession = async (
  req: Request,
  res: Response
) => {
  try {
    const user = req.user;

    if (!user?.id) {
      throw new Error("Unauthorized");
    }

    const { shippingAddress } = req.body;

    const session =
      await paymentService.createCheckoutSession(
        user.id,
        shippingAddress
      );

    return res.status(200).json({
      success: true,
      message: "Checkout session created successfully",
      data: {
        url: session.url,
      },
    });
  } catch (error) {
    throw error;
  }
};

const stripeWebhook = async (
  req: Request,
  res: Response
) => {
  try {
    const signature =
      req.headers["stripe-signature"] as string;

    const result =
      await paymentService.stripeWebhook(
        req.body,
        signature
      );

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message: "Webhook Error",
    });
  }
};

export const paymentController = {
  createCheckoutSession,
  stripeWebhook,
};