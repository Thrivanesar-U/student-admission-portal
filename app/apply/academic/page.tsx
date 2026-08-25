import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import AcademicForm from "@/components/application/AcademicForm";

import {
  academicDetails,
  applications,
} from "@/db/schema";

import { db } from "@/db";
import { auth } from "@/lib/auth";

export default async function AcademicDetailsPage() {
  const session =
    await auth.api.getSession({
      headers: await headers(),
    });

  if (!session) {
    redirect("/login");
  }

  const [application] =
    await db
      .select({
        id: applications.id,
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

  /*
   * Student must finish Step 1 first.
   */
  if (!application) {
    return (
      <main className="min-h-screen bg-gray-50 py-16">
        <div className="mx-auto max-w-2xl px-6">
          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Complete Step 1 First
            </h1>

            <p className="mt-3 text-gray-700">
              Save your personal and
              program details before
              entering academic details.
            </p>

            <Link
              href="/apply"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Go to Personal Details
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (
    application.status !== "draft"
  ) {
    redirect("/apply/review");
  }

  const [existingDetails] =
    await db
      .select({
        qualificationType:
          academicDetails
            .qualificationType,

        institutionName:
          academicDetails
            .institutionName,

        boardOrUniversity:
          academicDetails
            .boardOrUniversity,

        yearOfPassing:
          academicDetails
            .yearOfPassing,

        scoreType:
          academicDetails
            .scoreType,

        scoreValue:
          academicDetails
            .scoreValue,
      })
      .from(academicDetails)
      .where(
        eq(
          academicDetails.applicationId,
          application.id
        )
      )
      .limit(1);

  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="mx-auto max-w-4xl px-6">
        <AcademicForm
          initialData={
            existingDetails
          }
        />
      </div>
    </main>
  );
}