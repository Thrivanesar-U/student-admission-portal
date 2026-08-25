import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";

import { db } from "@/db";
import * as authSchema from "@/db/auth-schema";

export const auth = betterAuth({
  appName: "3vSkool",

  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),

  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      role: {
        type: ["student", "admin"],
        required: false,
        defaultValue: "student",
        input: false,
      },
    },
  },
});