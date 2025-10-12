import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import environment from "@/config/environment";
import { authService } from "@/services/auth";
import userService from "@/services/user";
import { JWTExtended, SessionExtended, UserExtended } from "@/types/Auth";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 1 day
  },
  secret: environment.AUTH_SECRET, // pastikan memetakan ke NEXTAUTH_SECRET
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "identifier", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(
        credentials: Record<"email" | "password", string> | undefined,
      ): Promise<UserExtended | null> {
        const { email, password } = (credentials ?? {}) as {
          email: string;
          password: string;
        };

        const result = await authService.signin({ email, password });
        if (result?.status !== 200) return null;

        const accessToken = result.data?.accessToken;
        const refreshToken = result.data?.refreshToken;
        if (!accessToken) return null;

        const me = await userService.getProfileWithToken(accessToken);
        const rawUser = me?.data;
        if (!rawUser) return null;

        // pastikan minimal field ada
        if (!rawUser.id) rawUser.id = rawUser.userId ?? rawUser.uuid ?? email;
        if (!rawUser.email) rawUser.email = email;

        // sematkan token ke objek user (akan dipindah ke JWT di callbacks)
        (rawUser as any).accessToken = accessToken;
        (rawUser as any).refreshToken = refreshToken;

        return rawUser as UserExtended;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWTExtended; user?: any }) {
      if (user) {
        // Flatten jika backend kadang mengirim wrapper { message, data }
        const flatUser = user?.data ? user.data : user;
        token.user = flatUser as UserExtended;

        // propagasi token
        token.accessToken = (user as any)?.accessToken ?? token.accessToken;
        token.refreshToken = (user as any)?.refreshToken ?? token.refreshToken;
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: SessionExtended;
      token: JWTExtended & { refreshToken?: string };
    }) {
      // kalau token.user masih wrapper (edge case), flatten lagi
      const flatUser = (token.user as any)?.data
        ? (token.user as any).data
        : token.user;

      session.user = flatUser as UserExtended;
      session.accessToken = token.accessToken as string | undefined;
      session.refreshToken = token.refreshToken as string | undefined;
      return session;
    },
  },
  events: {
    async signOut({
      token,
    }: {
      token: JWTExtended & { refreshToken?: string };
    }) {
      try {
        const rt = token.refreshToken;

        if (rt) {
          await authService.logout(rt);
        }
      } catch (error) {
        console.error("Error during logout:", error);
      }
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};

export default NextAuth(authOptions);
