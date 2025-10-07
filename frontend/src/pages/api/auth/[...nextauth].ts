import environment from "@/config/environment";
import { authService } from "@/services/auth";
import { JWTExtended, SessionExtended, UserExtended } from "@/types/Auth";
import CredentialsProvider from "next-auth/providers/credentials";
import nextAuth from "next-auth/next";
import userService from "@/services/user";

export default nextAuth({
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 1 days
  },
  secret: environment.AUTH_SECRET,
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
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        const result = await authService.signin({ email, password });

        const accessToken = result.data.accessToken;
        const refreshToken = result.data.refreshToken;

        const me = await userService.getProfileWithToken(accessToken);
        const user = me.data;

        if (accessToken && refreshToken && user && result.status === 200) {
          user.accessToken = accessToken;
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({
      token,
      user,
    }: {
      token: JWTExtended;
      user: UserExtended | null;
    }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: SessionExtended;
      token: JWTExtended;
    }) {
      session.user = token.user as UserExtended;
      session.accessToken = token.user?.accessToken;
      return session;
    },
  },
  events: {
    async signOut({ token }: { token: JWTExtended }) {
      if (token?.user?.accessToken) {
        try {
          await authService.logout(token.user.accessToken);
        } catch (error) {
          console.error("Error during logout:", error);
        }
      }
    },
  },
});
