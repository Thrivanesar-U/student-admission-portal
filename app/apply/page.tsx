import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import PersonalApplicationForm from "@/components/application/PersonalApplicationForm";

import { db } from "@/db";
import { applications } from "@/db/schema";
import { auth } from "@/lib/auth";

export default async function ApplyPage() {
  /*
   * Get the currently logged-in user.
   */
  const session =
    await auth.api.getSession({
      headers: await headers(),
    });

  if (!session) {
    redirect("/login");
  }

  if (
    session.user.role !==
    "student"
  ) {
    redirect("/");
  }

  /*
   * Look for THIS student's application.
   */
  const [application] =
    await db
      .select({
        fullName:
          applications.fullName,

        phone:
          applications.phone,

        dateOfBirth:
          applications.dateOfBirth,

        gender:
          applications.gender,

        address:
          applications.address,

        programSlug:
          applications.programSlug,

        status:
          applications.status,
      })
      .from(applications)
      .where(
        eq(
          applications.userId,
          session.user.id
        )
      )
      .limit(1);

  if (
    application &&
    application.status !== "draft"
  ) {
    redirect("/apply/review");
  }

  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Admissions 2026–27
          </p>

          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            Student Application
          </h1>

          <p className="mt-4 max-w-2xl text-gray-600">
            Complete your application step by step.
            Your saved information will remain
            available when you return.
          </p>
        </div>

        <PersonalApplicationForm
          accountName={
            session.user.name
          }
          accountEmail={
            session.user.email
          }
          initialData={
            application
              ? {
                  fullName:
                    application.fullName,

                  phone:
                    application.phone,

                  dateOfBirth:
                    application.dateOfBirth,

                  gender:
                    application.gender,

                  address:
                    application.address,

                  program:
                    application.programSlug,
                }
              : undefined
          }
        />
      </div>
    </main>
  );
}