// import { betterAuth, type BetterAuthOptions } from "better-auth";
// import { prismaAdapter } from "better-auth/adapters/prisma";
// import { nextCookies } from "better-auth/next-js";
// import { createAuthMiddleware, APIError } from "better-auth/api";
// import { admin, customSession } from "better-auth/plugins";

// import { hashPassword, verifyPassword } from "@/app/lib/argon2";
// import prisma from "../lib/prisma";
// import { getValidDomains, normalizeName } from "./utils";
// import { UserRole } from "@prisma/client";
// import { ac, roles } from "@/app/lib/permissions";
// import { sendEmailAction } from "../actions/send-email.action";

// const options = {
//   database: prismaAdapter(prisma, {
//     provider: "postgresql",
//   }),
//   socialProviders: {
//     google: {
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     },
//     github: {
//       clientId: process.env.GITHUB_CLIENT_ID as string,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
//     },
//   },
//   emailAndPassword: {
//     enabled: true,
//     minPasswordLength: 6,
//     autoSignIn: false,
//     password: {
//       hash: hashPassword,
//       verify: verifyPassword,
//     },
//     requireEmailVerification: false,
//     sendResetPassword: async ({user, url, token}, request) => {
//       await sendEmailAction({
//         to: user.email,
//         subject: "Réinitialiser votre mot de passe",
//         meta: {
//           description: `Click the link to reset your password`,
//           link: String(url),
//         } 
//       });
//     },
//     onPasswordReset: async ({ user }, request) => {
//       // your logic here
//       console.log(`Password for user ${user.email} has been reset.`);
//     },
//   },
//   // emailVerification: {
//   //   sendOnSignUp: true,
//     // autoSignInAfterVerification: false,
//     // sendVerificationEmail: async ({ user, url }) => {
//     //   await sendEmailAction({
//     //     to: user.email,
//     //     subject: "Vérification de votre adresse email",
//     //     meta: {
//     //       description:
//     //         "Please verify your email address to complete registration.",
//     //       link: url,
//     //     },
//     //   });
//     // },
//   // },
//   hooks: {
//     before: createAuthMiddleware(async (ctx) => {
//       if (ctx.path === "/sign-up/email") {
//         const email = String(ctx.body.email);
//         const domain = email.split("@")[1];

//         const VALID_DOMAINS = getValidDomains();

//         if (!VALID_DOMAINS.includes(domain)) {
//           throw new APIError("BAD_REQUEST", {
//             message: "Invalid domain, Please use a valid email.",
//           });
//         }

//         const name = normalizeName(ctx.body.name);

//         return {
//           context: {
//             ...ctx,
//             body: {
//               ...ctx.body,
//               name,
//             },
//           },
//         };
//       }
//     }),
//   },
//   databaseHooks: {
//     user: {
//       create: {
//         before: async (user) => {
//           const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(";") ?? [];

//           if (ADMIN_EMAILS.includes(user.email)) {
//             return { data: { ...user, role: UserRole.ADMIN } };
//           }

//           return { data: user };
//         },
//       },
//     },
//   },
//   user: {
//     additionalFields: {
//       role: {
//         type: ["USER", "ADMIN"] as Array<UserRole>,
//         input: false,
//       },
//     },
//   },
//   session: {
//     expiresIn: 30 * 24 * 60 * 60,
//     cookieCache: {
//       enabled: true,
//       maxAge: 5 * 60,
//     }
//   },
//   account: {
//     accountLinking: {
//       enabled: true,
//       trustedProviders: ["google", "github"]
//     },
//   },
//   // plugins: [
//   //   nextCookies(),
//   //   admin({
//   //     defaultRole: UserRole.USER,
//   //     adminRoles: [UserRole.ADMIN],
//   //     ac,
//   //     roles,
//   //   }),
//   // ],
// } satisfies BetterAuthOptions;

// export const auth = betterAuth({
//   ...options,
//   trustedOrigins: [
//     "http://localhost:3000",
//     "https://airbnb-clone-git-main-florent-cussatlegras-projects.vercel.app",
//   ],
//   cookies: {
//     sameSite: "lax",
//     secure: true,
//   },
//   plugins: [
//     ...(options.plugins ?? []),
//     customSession(async ({ user, session }) => {
//       return {
//         session: {
//           expiresAt: session.expiresAt,
//           token: session.token,
//           userAgent: session.userAgent
//         },
//         user: {
//           id: user.id,
//           name: user.name,
//           email: user.email,
//           image: user.image,
//           createdAt: user.createdAt,
//           role: user.role,
//         },
//       };
//     }, options),
//   ],
// });

// export type ErrorCode = keyof typeof auth.$ERROR_CODES | "UNKNOWN";

import { betterAuth, type BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { admin, customSession } from "better-auth/plugins";

import { hashPassword, verifyPassword } from "@/app/lib/argon2";
import prisma from "../lib/prisma";
import { getValidDomains, normalizeName } from "./utils";
import { UserRole } from "@prisma/client";
import { ac, roles } from "@/app/lib/permissions";
import { sendEmailAction } from "../actions/send-email.action";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  createdAt: Date;
  role: UserRole; // ✅ notre champ personnalisé
};

/**
 * 1️⃣ CONFIGURATION PURE (SANS PLUGINS)
 */
const options: BetterAuthOptions = {
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: false,
    password: {
      hash: hashPassword,
      verify: verifyPassword,
    },
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url }) => {
      await sendEmailAction({
        to: user.email,
        subject: "Réinitialiser votre mot de passe",
        meta: {
          description: "Click the link to reset your password",
          link: String(url),
        },
      });
    },
    onPasswordReset: async ({ user }) => {
      console.log(`Password for user ${user.email} has been reset.`);
    },
  },

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const email = String(ctx.body.email);
        const domain = email.split("@")[1];

        const VALID_DOMAINS = getValidDomains();

        if (!VALID_DOMAINS.includes(domain)) {
          throw new APIError("BAD_REQUEST", {
            message: "Invalid domain, Please use a valid email.",
          });
        }

        return {
          context: {
            ...ctx,
            body: {
              ...ctx.body,
              name: normalizeName(ctx.body.name),
            },
          },
        };
      }
    }),
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(";") ?? [];

          if (ADMIN_EMAILS.includes(user.email)) {
            return { data: { ...user, role: UserRole.ADMIN } };
          }

          return { data: user };
        },
      },
    },
  },

  user: {
    additionalFields: {
      role: {
        type: ["USER", "ADMIN"] as Array<UserRole>,
        input: false,
      },
    },
  },

  session: {
    expiresIn: 30 * 24 * 60 * 60,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github"],
    },
  },
};

/**
 * 2️⃣ INSTANCE AUTH (AVEC PLUGINS)
 */
export const auth = betterAuth({
  ...options,

  trustedOrigins: [
    "http://localhost:3000",
    "https://airbnb-clone-git-main-florent-cussatlegras-projects.vercel.app",
  ],

  cookies: {
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  },

  plugins: [
    nextCookies(), // 🔥 OBLIGATOIRE
    admin({
      defaultRole: UserRole.USER,
      adminRoles: [UserRole.ADMIN],
      ac,
      roles,
    }),
    customSession(async ({ user, session }) => {

      const u = user as unknown as { id: string; name: string; email: string; image?: string | null; createdAt: Date; role?: UserRole };

      return {
        session: {
          expiresAt: session.expiresAt,
          token: session.token,
          userAgent: session.userAgent,
        },
        user: {
          id: u.id,
          name: u.name,
          email: u.email,
          image: u.image,
          createdAt: u.createdAt,
          role: u.role,
        },
      };
    }, options),
  ],
});

export type ErrorCode = keyof typeof auth.$ERROR_CODES | "UNKNOWN";

