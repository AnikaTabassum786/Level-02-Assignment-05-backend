/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { medicineService } from "./medicine.service";

const createMedicine = async (req: Request, res: Response) => {

    try {
        const user = req.user;

        if (!user?.id) {
            throw new Error("Unauthorized")
        }

        const result = await medicineService.createMedicine(
            {
                ...req.body,
                price: Number(req.body.price),
                stock: Number(req.body.stock),

            },
            user.id
        );
        res.status(201).json({
            success: true,
            message: "Medicine Created Successfully",
            data: result,
        });

    }
    catch (e: any) {
        res.status(400).json({
            error: "Medicine Creation Failed",
            details: e.message || String(e),
        });
    }


}

const getAllMedicines= async(req: Request, res: Response)=>{
try{
const result = await medicineService.getAllMedicines(req.query)
 res.status(200).json({
            success: true,
            message: "Medicine Created Successfully",
            data: result,
        });
}
  catch (e: any) {
        res.status(400).json({
            error: "Medicine Creation Failed",
            details: e.message || String(e),
        });
    }
}

const getMedicineById=async(req: Request, res: Response)=>{
  try{
  const {medicineId} = req.params
  const result = await medicineService.getMedicineById(medicineId as string)

   res.status(200).json({
            success: true,
            message: "Medicine Fetched Successfully",
            data: result,
        });
  }
  catch (e: any) {
        res.status(400).json({
            error: "Medicine Fetched Failed",
            details: e.message || String(e),
        });
    }
}

export const medicineController={
    createMedicine,
    getAllMedicines,
    getMedicineById
}