// import { betterAuth } from "better-auth";
// import { prismaAdapter } from "better-auth/adapters/prisma";
// import { prisma } from "./prisma";

// // If your Prisma file is located elsewhere, you can change the path



// export const auth = betterAuth({
//     database: prismaAdapter(prisma, {
//         provider: "postgresql", // or "mysql", "postgresql", ...etc
//     }),

// trustedOrigins:[process.env.APP_URL!],
//      user:{
//        additionalFields:{
//         role:{
//           type:"string",
//           defaultValue:"CUSTOMER",
//           required:false
//         },
//         phone:{
//             type:"string",
//             required:false
//            }
//        }
//     },

//     emailAndPassword: {
//         enabled: true,
//     },

//      beforeSignIn: async ({ email }: { email: string }) => {
//       const user = await prisma.user.findUnique({
//         where: { email },
//       });

//       if (!user) {
//         return;
//       }

//       if (user.isBanned) {
//         throw new Error("ACCOUNT_BANNED");
//       }

//       if (user.isDeleted) {
//         throw new Error("ACCOUNT_DELETED");
//       }
//     },

//     // user:{
//     //     additionalFields:{
//     //         role:{
//     //         type:"string",
//     //         required:true,
//     //         defaultValue:Role.CUSTOMER
//     //     },

//     //       needPasswordChange:{
//     //         type:"boolean",
//     //         required:true,
//     //         defaultValue:false
//     //     },

//     //     isDeleted:{
//     //         type:"boolean",
//     //         required:true,
//     //         defaultValue:false
//     //     },
//     //     deletedAt:{
//     //         type:"date",
//     //         required:false,
//     //         defaultValue:null
//     //     }
//     //     }
//     // }
// });


import { betterAuth } from "better-auth";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // IMPORTANT: must match frontend + Postman Origin header
  trustedOrigins: [
    process.env.APP_URL!, // e.g. http://localhost:3000
  ],

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CUSTOMER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
  },

  //  BLOCK BANNED / DELETED USERS BEFORE LOGIN
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      // Only apply for email login
      if (ctx.path !== "/sign-in/email") return;

      const email = ctx.body?.email;

      if (!email) return;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) return;

      //  banned user
      if (user.isBanned) {
        throw new APIError("FORBIDDEN", {
          message: "Your account has been banned",
        });
      }

      //  deleted user
      if (user.isDeleted) {
        throw new APIError("FORBIDDEN", {
          message: "Your account has been deleted",
        });
      }
    }),
  },
});