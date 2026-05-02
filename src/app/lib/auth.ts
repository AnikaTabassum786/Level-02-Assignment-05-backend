import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

// If your Prisma file is located elsewhere, you can change the path



export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),

trustedOrigins:[process.env.APP_URL!],
     user:{
       additionalFields:{
        role:{
          type:"string",
          defaultValue:"CUSTOMER",
          required:false
        },
        phone:{
            type:"string",
            required:false
           }
       }
    },

    emailAndPassword: {
        enabled: true,
    },

    // user:{
    //     additionalFields:{
    //         role:{
    //         type:"string",
    //         required:true,
    //         defaultValue:Role.CUSTOMER
    //     },

    //       needPasswordChange:{
    //         type:"boolean",
    //         required:true,
    //         defaultValue:false
    //     },

    //     isDeleted:{
    //         type:"boolean",
    //         required:true,
    //         defaultValue:false
    //     },
    //     deletedAt:{
    //         type:"date",
    //         required:false,
    //         defaultValue:null
    //     }
    //     }
    // }
});