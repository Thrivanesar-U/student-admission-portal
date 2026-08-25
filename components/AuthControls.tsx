"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

interface AuthControlsProps {
  mobile?: boolean;
}

export default function AuthControls({
  mobile = false,
}: AuthControlsProps) {
  const router = useRouter();

  const {
    data: session,
    isPending,
  } = authClient.useSession();

  async function handleLogout() {
    await authClient.signOut();

    router.push("/");
    router.refresh();
  }

  if (isPending) {
    return (
      <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-100" />
    );
  }

  if (!session) {
    return (
      <div
        className={
          mobile
            ? "flex flex-col gap-2"
            : "flex items-center gap-3"
        }
      >
        <Link
          href="/login"
          className="rounded-lg px-4 py-2 font-semibold text-gray-700 transition hover:bg-gray-100"
        >
          Login
        </Link>

        <Link
          href="/register"
          className="rounded-lg bg-blue-600 px-4 py-2 text-center font-semibold text-white transition hover:bg-blue-700"
        >
          Register
        </Link>
      </div>
    );
  }

  return (
    <div
        className={
        mobile
            ? "flex flex-col gap-3"
            : "flex items-center gap-3"
        }
    >
        <span className="text-sm font-medium text-gray-700">
        Hello, {session.user.name}
        </span>

        {session.user.role === "student" && (
        <Link
            href="/student/dashboard"
            className="rounded-lg px-4 py-2 font-semibold text-gray-700 transition hover:bg-gray-100"
        >
            Dashboard
        </Link>
        )}

        {session.user.role === "admin" && (
          <Link
            href="/admin"
            className="rounded-lg px-4 py-2 font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            Admin Dashboard
          </Link>
        )}

        <button
        type="button"
        onClick={handleLogout}
        className="rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 transition hover:bg-gray-100"
        >
        Logout
        </button>
    </div>
    );
}