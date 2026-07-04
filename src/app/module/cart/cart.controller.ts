/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { cartService } from "./cart.service";


const createCart = async (req: Request, res: Response) => {
  try {
    const user = req.user //Here, the logged-in user is being retrieved from the middleware.
    const result = await cartService.createCart(req.body,user!.id as string);

    res.status(201).json({
      success: true,
      message: "Items added to Cart successfully",
      data: result,
    });
  } catch (error:any) {
    res.status(400).json({
      success: false,
      message: error.message||"Cart creation failed",
      error,
    });
  }
};

const getAllOwnCart=async(req: Request, res: Response)=>{
 try{
    const user = req.user
     if (!user){
       throw new Error("Unauthorized")
    }
   const result = await cartService.getAllOwnCart(user.id)
    return res.status(200).json({
      success:true,
      message:"Cart Items fetched successfully",
      data:result
    })
 }
 catch(error:any){
return res.status(500).json({
     success:false,
     message:error?.message || "Cart Items fetch failed"
    })
 }
}

const deleteCart = async(req:Request,res:Response)=>{
  try{
     const user = req.user;
     if(!user){
      throw new Error("Unauthorized");
     }

     const {cartItemId} = req.params;

     const result = await cartService.deleteCart(cartItemId as string, user.id)

     res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: result,
    });
  }
  catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export const cartController = {
  createCart,
  getAllOwnCart,
  deleteCart
 
};
