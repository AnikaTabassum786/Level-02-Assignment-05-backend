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

    //This function will execute before someone attempts to log in.

    before: createAuthMiddleware(async (ctx) => {

      // Only apply for email login.If it is not an email login,then do nothing and exit.
      if (ctx.path !== "/sign-in/email") return;

      //The email address the user is using to log in is being captured.
      const email = ctx.body?.email; 

      //They won't do anything if there is no email.
      if (!email) return;

      //It is checking whether this email exists in the user database.
      const user = await prisma.user.findUnique({
        where: { email },
      });

      //If there is no user, it will leave without doing anything.
      if (!user) return;

      //  If a user is banned, Login is completely disabled. It will return the error: “Your account has been banned”
      if (user.isBanned) {
        throw new APIError("FORBIDDEN", {
          message: "Your account has been banned",
        });
      }

      //  If the account has been deleted, it won't let you log in, it will show an error.
      if (user.isDeleted) {
        throw new APIError("FORBIDDEN", {
          message: "Your account has been deleted",
        });
      }
    }),
  },
});