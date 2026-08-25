import type { ReactNode } from "react";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

interface StudentLayoutProps {
  children: ReactNode;
}

export default async function StudentLayout({
  children,
}: StudentLayoutProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "student") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Student Portal
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Welcome, {session.user.name}
          </h1>

          <p className="mt-2 text-gray-600">
            {session.user.email}
          </p>
        </div>
      </div>

      {children}
    </div>
  );
}