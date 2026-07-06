/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-unused-vars */

import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../../config/stripe.config";


const createCheckoutSession = async (
  userId: string,
  shippingAddress: string
) => {
  const cart = await prisma.cart.findUnique({
    where: {
      customerId: userId,
    },
    include: {
      cartItems: {
        include: {
          medicine: true,
        },
      },
    },
  });

  if (!cart || cart.cartItems.length === 0) {
    throw new Error("Cart is empty");
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
    cart.cartItems.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: "usd",

        product_data: {
          name: item.medicine.name,
          images: item.medicine.imageURL
            ? [item.medicine.imageURL]
            : [],
        },

        unit_amount:
          Number(item.medicine.price) * 100,
      },
    }));

  const session =
    await stripe.checkout.sessions.create({
      mode: "payment",

      payment_method_types: ["card"],

      line_items: lineItems,

      success_url:
        `${process.env.APP_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url:
        `${process.env.APP_URL}/checkout`,

      metadata: {
        userId,
        shippingAddress,
         cartId: cart.id,
      },
    });

  return session;
};

const stripeWebhook = async (
  payload: Buffer,
  signature: string
) => {
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  switch (event.type) {
    case "checkout.session.completed":
      const session =event.data.object as Stripe.Checkout.Session;

      // call order service here later

      break;

    default:
      console.log(
        `Unhandled event type ${event.type}`
      );
  }

  return {
    received: true,
  };
};

export const paymentService = {
  createCheckoutSession,
  stripeWebhook,
};