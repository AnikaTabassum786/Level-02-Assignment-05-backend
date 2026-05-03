import { prisma } from "../../lib/prisma";

const createMedicine = async (data: {
    name: string;
    description: string;
    price: number;
    stock: number;
    manufacturer: string;
    imageURL?: string;
    categoryId: string;
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

export const medicineService = {
    createMedicine
}