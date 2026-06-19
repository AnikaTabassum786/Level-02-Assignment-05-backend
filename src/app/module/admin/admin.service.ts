import { prisma } from "../../lib/prisma"


const getAllUsers= async()=>{
    const result = await prisma.user.findMany({
        orderBy:{
            createdAt:"desc"
        }
    })

    return result
}

const toggleBanUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      isBanned: !user.isBanned,
    },
  });

  return updatedUser;
};

export const adminService ={
    getAllUsers,
    toggleBanUser
}