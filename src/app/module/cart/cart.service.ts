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

//Here, `customerId` is taken as a parameter; this means the ID of the customer whose cart you want to view will be passed here.

const getAllOwnCart = async(userId:string)=>{
    const cart = await prisma.cart.findUnique({  //Find the Cart whose customerId matches this ID.
       where:{customerId:userId},
       include:{
        cartItems:{
          include:{
            medicine:true
          }
        }
       }
    })

    if(!cart){
      return{
        Items:[],
        totalPrice:0
      }
    }


    //reduce() iterates through each item and accumulates the total.
    const totalPrice = cart.cartItems.reduce((total,item)=>{
      return total+item.quantity * (item.medicine.price).toNumber()
    },0)

    return {
      items:cart.cartItems,
      totalPrice
    }
  
}

const deleteCart = async (cartItemId: string, userId: string) => {

  
//do not deleting the cart.
// deleting an item from the cart.

  const item = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
    include: { cart: true, medicine: true },
  });

  if (!item) throw new Error("Cart item not found");

  if (item.cart.customerId !== userId) {
    throw new Error("Unauthorized");
  }

  // restore stock
  // await prisma.medicine.update({
  //   where: { id: item.medicineId },
  //   data: {
  //     stock: item.medicine.stock + item.quantity,
  //   },
  // });

  return await prisma.cartItem.delete({
    where: { id: cartItemId },
  });
};

export const cartService = {
  createCart,
  getAllOwnCart,
  deleteCart
};