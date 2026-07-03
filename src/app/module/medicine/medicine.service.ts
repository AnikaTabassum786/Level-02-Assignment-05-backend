/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { deleteFromCloudinary } from "../../../config/cloudinary.config";
import { Medicine } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createMedicine = async (data: {
    name: string;
    description: string;
    price: number;
    stock: number;
    manufacturer: string;
    imageURL?: string;
    categoryId: string;
    imagePublicId?: string;
},
    sellerId: string
) => {
    const category = await prisma.category.findUnique({
        where: { id: data.categoryId }
    });
    if (!category) {
        throw new Error("Category not found")
    }
    const result = await prisma.medicine.create({
        data: {
            ...data,
            sellerId,
        },
    });
    return result
}

const getAllMedicines = async (query:any)=>{
   const result = await prisma.medicine.findMany({
    orderBy:{
        createdAt:'desc'
    }
   })

   return result
}

const getMedicineById= async(medicineId : string)=>{
  const result = await prisma.medicine.findUnique({
       where:{
        id:medicineId
       },
       include:{
        category:true,
        seller:{
            select:{
                id:true,
                name:true
            }
        }
       }
  })
  return result
}

const updateMedicineById=async(medicineId:string, sellerId:string, data:Partial<Medicine>)=>{

  const existing = await prisma.medicine.findFirst({
    where:{
        id:medicineId,
        sellerId:sellerId
    }
  })

  if(!existing){
     throw new Error("Not authorized or medicine not found")
  }
  
  const result = await prisma.medicine.update({
    where:{
        id:medicineId
    },
    data
  })

  return result

}

// const deleteMedicine= async(medicineId : string)=>{
//   const result = await prisma.medicine.delete({
//     where:{
//         id:medicineId
//     }
//   })

//   return result
// }

const deleteMedicine = async (medicineId: string) => {
  //  First Find the medicine 
  const medicine = await prisma.medicine.findUnique({
    where: {
      id: medicineId,
    },
  });

  if (!medicine) {
    throw new Error("Medicine not found");
  }

  //  Delete image from Cloudinary if it exists
  if (medicine.imagePublicId) {
    await deleteFromCloudinary(medicine.imagePublicId);
  }

  //  Delete medicine from database
  const result = await prisma.medicine.delete({
    where: {
      id: medicineId,
    },
  });

  return result;
};

export const medicineService = {
    createMedicine,
    getAllMedicines,
    getMedicineById,
    updateMedicineById,
    deleteMedicine
}