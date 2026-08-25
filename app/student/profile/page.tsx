import { eq } from "drizzle-orm";
import {
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  UserRound,
} from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { programs } from "@/data/programs";
import { db } from "@/db";
import { applications } from "@/db/schema";
import { auth } from "@/lib/auth";

export default async function StudentProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "student") {
    redirect("/");
  }

  const [application] = await db
    .select({
      id: applications.id,
      fullName: applications.fullName,
      phone: applications.phone,
      address: applications.address,
      programSlug: applications.programSlug,
      status: applications.status,
    })
    .from(applications)
    .where(
      eq(
        applications.userId,
        session.user.id
      )
    )
    .limit(1);

  const selectedProgram = application
    ? programs.find(
        (program) =>
          program.slug ===
          application.programSlug
      )
    : undefined;

  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Student Portal
          </p>

          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            My Profile
          </h1>

          <p className="mt-4 text-gray-600">
            Review your account and admission information.
          </p>
        </div>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <UserRound className="h-7 w-7" />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-gray-900">
            {session.user.name}
          </h2>

          <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-blue-600">
            Student
          </p>

          <div className="mt-8 space-y-6">
            <div className="flex items-start gap-3">
              <Mail className="mt-1 h-5 w-5 text-gray-400" />

              <div>
                <p className="text-sm text-gray-500">
                  Email
                </p>

                <p className="font-semibold text-gray-900">
                  {session.user.email}
                </p>
              </div>
            </div>

            {application && (
              <>
                <div className="flex items-start gap-3">
                  <Phone className="mt-1 h-5 w-5 text-gray-400" />

                  <div>
                    <p className="text-sm text-gray-500">
                      Phone
                    </p>

                    <p className="font-semibold text-gray-900">
                      {application.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 text-gray-400" />

                  <div>
                    <p className="text-sm text-gray-500">
                      Address
                    </p>

                    <p className="font-semibold text-gray-900">
                      {application.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <GraduationCap className="mt-1 h-5 w-5 text-gray-400" />

                  <div>
                    <p className="text-sm text-gray-500">
                      Program
                    </p>

                    <p className="font-semibold text-gray-900">
                      {selectedProgram
                        ? `${selectedProgram.name} — ${selectedProgram.fullName}`
                        : application.programSlug}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        {application && (
          <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Application
            </p>

            <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="font-bold text-gray-900">
                  Application #{application.id}
                </p>

                <p className="mt-1 capitalize text-gray-600">
                  Status:{" "}
                  {application.status.replaceAll(
                    "_",
                    " "
                  )}
                </p>
              </div>

              <Link
                href="/apply/review"
                className="rounded-lg bg-blue-600 px-6 py-3 text-center font-semibold text-white hover:bg-blue-700"
              >
                View Application
              </Link>
            </div>
          </section>
        )}

        <div className="mt-8">
          <Link
            href="/student/dashboard"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}