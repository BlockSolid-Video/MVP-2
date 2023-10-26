import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "../../../../lib/db";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: "/sign-in",

    },
    providers: [
        CredentialsProvider({
          // The name to display on the sign in form (e.g. "Sign in with...")
          name: "Credentials",
         
          credentials: {
            email: { label: "Email", type: "text", placeholder: "jsmith" },
            password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) {
                console.log("No credentials provided");
                return null;
            }
            const existingUser = await db.user.findUnique({
                where: { email: credentials?.email}
            });

            if (!existingUser) {
                console.log("No user found");
                return null;
            }

            const passwordMatches = await compare(credentials.password, existingUser.password);
            if (!passwordMatches) {
                console.log("Password does not match");
                return null;
            }
            console.log("User found");
            return {
                id: `${existingUser.id}`,
                username: existingUser.username,
                email: existingUser.email
            }
          }
        })
      ]
}