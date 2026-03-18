import NextAuth from "next-auth";
import Bungie from "next-auth/providers/bungie";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/server/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Bungie({
      clientId: process.env.AUTH_BUNGIE_ID,
      clientSecret: process.env.AUTH_BUNGIE_SECRET,
      // headers is required by Bungie API but not in the OAuthUserConfig type
      ...({ headers: { "X-API-Key": process.env.AUTH_BUNGIE_API_KEY! } } as Record<string, unknown>),
    }),
  ],
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
});
