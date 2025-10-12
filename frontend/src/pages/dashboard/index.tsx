import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { UserExtended } from "@/types/Auth";

const ROLE_MAP = {
  admin: "admin",
  user: "user",
  student: "student",
  teacher: "teacher",
} as const;

export default function DashboardRedirect() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin?from=/dashboard",
        permanent: false,
      },
    };
  }
  const roleRaw = (session.user as UserExtended)?.role ?? "user";
  const role = String(roleRaw).toLowerCase();
  const pathRole = ROLE_MAP[role as keyof typeof ROLE_MAP] ?? "user";
  return {
    redirect: { destination: `/dashboard/${pathRole}`, permanent: false },
  };
};
