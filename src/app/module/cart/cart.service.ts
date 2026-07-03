import { prisma } from "../../lib/prisma";

interface CreatedCartPayload{
   medicineId: string;
   quantity: number;
}

const createCart = async (
  payload: CreatedCartPayload,
  userId: string
) => {
  const { medicineId, quantity } = payload;


  if (!medicineId || !quantity) {
    throw new Error("Medicine Id and quantity are required");
  }

  if (quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  const medicine = await prisma.medicine.findUnique({
    where: { id: medicineId },
  });

  if (!medicine) {
    throw new Error("Medicine not found");
  }


  //Check if the user has a cart.
  let cart = await prisma.cart.findUnique({
    where: { customerId: userId },
  });


//If there is no cart, it will create a new cart.
  if (!cart) {
    cart = await prisma.cart.create({
      data: { customerId:userId },
    });
  }

//check whether the medicine is already in the cart
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      medicineId,
    },
  });

 
//   const totalQuantity = existingItem
//     ?   quantity
//     : quantity;

    const totalQuantity =
    existingItem
    ? existingItem.quantity + quantity
    : quantity;

  if (medicine.stock < totalQuantity) {
    throw new Error("Stock limit exceeded");
  }


  //If it is already in the cart, the quantity will be updated.
  if (existingItem) {
    return await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: {
        quantity: totalQuantity,
      },
    });
  }

 
  //If it is not in the cart, it will create a new CartItem.
  return await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      medicineId,
      quantity,
    },
  });
};

export const cartService = {
  createCart,
};