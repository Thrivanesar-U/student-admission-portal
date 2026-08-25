import type {
  ReactNode,
} from "react";

import {
  headers,
} from "next/headers";

import {
  redirect,
} from "next/navigation";

import { auth } from "@/lib/auth";

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({
  children,
}: AdminLayoutProps) {
  const session =
    await auth.api.getSession({
      headers:
        await headers(),
    });

  /*
   * Not logged in.
   */
  if (!session) {
    redirect("/login");
  }

  /*
   * Logged in, but not admin.
   */
  if (
    session.user.role !==
    "admin"
  ) {
    redirect(
      "/student/dashboard"
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Admin Portal
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Welcome,{" "}
            {session.user.name}
          </h1>

          <p className="mt-2 text-gray-600">
            {session.user.email}
          </p>

          <p className="mt-2 text-sm font-semibold text-red-600">
            Administrator
          </p>
        </div>
      </div>

      {children}
    </div>
  );
}