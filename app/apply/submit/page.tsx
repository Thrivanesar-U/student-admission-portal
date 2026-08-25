import {
  and,
  eq,
} from "drizzle-orm";

import {
  headers,
} from "next/headers";

import Link from "next/link";

import {
  redirect,
} from "next/navigation";

import FinalSubmissionForm from "@/components/application/FinalSubmissionForm";

import {
  academicDetails,
  applications,
  documents,
  payments,
} from "@/db/schema";

import { db } from "@/db";
import { auth } from "@/lib/auth";

const requiredDocumentTypes = [
  "photo",
  "id_proof",
  "class_10_certificate",
  "class_12_certificate",
] as const;

export default async function FinalSubmissionPage() {
  const session =
    await auth.api.getSession({
      headers:
        await headers(),
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

  const [application] =
    await db
      .select({
        id:
          applications.id,

        status:
          applications.status,

        submittedAt:
          applications.submittedAt,
      })
      .from(applications)
      .where(
        eq(
          applications.userId,
          session.user.id
        )
      )
      .limit(1);

  if (!application) {
    redirect("/apply");
  }

  /*
   * Already submitted.
   */
  if (
    application.status !==
    "draft"
  ) {
    return (
      <main className="min-h-screen bg-gray-50 py-16">
        <div className="mx-auto max-w-3xl px-6">
          <section className="rounded-2xl border border-green-200 bg-green-50 p-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
              Application Status
            </p>

            <h1 className="mt-2 text-3xl font-bold capitalize text-green-900">
              {application.status.replaceAll(
                "_",
                " "
              )}
            </h1>

            <p className="mt-4 text-green-800">
              Application #{application.id}
            </p>

            {application.submittedAt && (
              <p className="mt-2 text-sm text-green-700">
                Submitted:{" "}
                {application.submittedAt.toLocaleString()}
              </p>
            )}

            <Link
              href="/student/dashboard"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Return to Dashboard
            </Link>
          </section>
        </div>
      </main>
    );
  }

  /*
   * Check academic details.
   */
  const [academic] =
    await db
      .select({
        id:
          academicDetails.id,
      })
      .from(
        academicDetails
      )
      .where(
        eq(
          academicDetails.applicationId,
          application.id
        )
      )
      .limit(1);

  if (!academic) {
    redirect(
      "/apply/academic"
    );
  }

  /*
   * Check documents.
   */
  const uploadedDocuments =
    await db
      .select({
        documentType:
          documents.documentType,
      })
      .from(documents)
      .where(
        eq(
          documents.applicationId,
          application.id
        )
      );

  const documentsComplete =
    requiredDocumentTypes.every(
      (requiredType) =>
        uploadedDocuments.some(
          (document) =>
            document.documentType ===
            requiredType
        )
    );

  if (!documentsComplete) {
    redirect(
      "/apply/documents"
    );
  }

  /*
   * Check payment.
   */
  const [paidPayment] =
    await db
      .select({
        id:
          payments.id,
      })
      .from(payments)
      .where(
        and(
          eq(
            payments.applicationId,
            application.id
          ),

          eq(
            payments.status,
            "paid"
          )
        )
      )
      .limit(1);

  if (!paidPayment) {
    redirect(
      "/apply/payment"
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Step 6
          </p>

          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            Final Submission
          </h1>

          <p className="mt-4 text-gray-600">
            This is the final step of your
            admission application.
          </p>
        </div>

        <FinalSubmissionForm />
      </div>
    </main>
  );
}