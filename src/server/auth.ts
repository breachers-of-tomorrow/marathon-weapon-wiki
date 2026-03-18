import {
  type DefaultSession,
  type NextAuthOptions,
  getServerSession,
} from "next-auth";
import BungieProvider from "next-auth/providers/bungie";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "@/server/db";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    BungieProvider({
      clientId: process.env.AUTH_BUNGIE_ID!,
      clientSecret: process.env.AUTH_BUNGIE_SECRET!,
      authorization: {
        url: "https://www.bungie.net/en/OAuth/Authorize",
        params: { reauth: true, scope: "" },
      },
      userinfo: {
        async request({ tokens }) {
          const res = await fetch(
            `https://www.bungie.net/platform/User/GetBungieAccount/${tokens.membership_id}/254/`,
            {
              headers: {
                "X-API-Key": process.env.AUTH_BUNGIE_API_KEY!,
                Authorization: `Bearer ${tokens.access_token}`,
              },
            },
          );
          return await res.json();
        },
      },
      ...({
        headers: { "X-API-Key": process.env.AUTH_BUNGIE_API_KEY! },
      } as Record<string, unknown>),
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
};

export const getServerAuthSession = () => getServerSession(authOptions);
