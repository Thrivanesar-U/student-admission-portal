"use client";


import Link from "next/link";

import AuthControls from "@/components/AuthControls";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const {
    data: session,
    isPending,
  } = authClient.useSession();

  const isAdmin =
    session?.user.role === "admin";

  return (
    <nav className="border-b border-gray-200 bg-white print:hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-[72px] items-center justify-between">
          {/* LOGO */}
          <Link
            href="/"
            className="text-xl font-bold text-blue-600"
          >
            3vSkool
          </Link>

          {/* DESKTOP */}
          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600"
            >
              Home
            </Link>

            <Link
              href="/programs"
              className="text-gray-700 hover:text-blue-600"
            >
              Programs
            </Link>

            <Link
              href="/about"
              className="text-gray-700 hover:text-blue-600"
            >
              About
            </Link>

            <Link
              href="/admissions"
              className="text-gray-700 hover:text-blue-600"
            >
              Admissions
            </Link>

            <Link
              href="/contact"
              className="text-gray-700 hover:text-blue-600"
            >
              Contact
            </Link>


            {!isPending && !isAdmin && (
              <Link
                href="/apply"
                className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
              >
                Apply Now
              </Link>
            )}

            <div className="border-l border-gray-200 pl-4">
              <AuthControls />
            </div>
          </div>

          {/* MOBILE */}
          <details className="relative md:hidden">
            <summary className="cursor-pointer list-none rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700">
              Menu
            </summary>

            <div className="absolute right-0 top-12 z-50 flex w-64 flex-col rounded-xl border border-gray-200 bg-white p-3 shadow-lg">
              <Link
                href="/"
                className="rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100"
              >
                Home
              </Link>

              <Link
                href="/programs"
                className="rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100"
              >
                Programs
              </Link>

              <Link
                href="/about"
                className="rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100"
              >
                About
              </Link>

              <Link
                href="/admissions"
                className="rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100"
              >
                Admissions
              </Link>

              <Link
                href="/contact"
                className="rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100"
              >
                Contact
              </Link>

              {!isPending && !isAdmin && (
                <Link
                  href="/apply"
                  className="mt-2 rounded-lg bg-blue-600 px-4 py-3 text-center font-semibold text-white hover:bg-blue-700"
                >
                  Apply Now
                </Link>
              )}

              <div className="mt-3 border-t border-gray-200 pt-3">
                <AuthControls mobile />
              </div>
            </div>
          </details>
        </div>
      </div>
    </nav>
  );
}