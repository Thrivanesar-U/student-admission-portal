import { and, asc, desc, eq } from "drizzle-orm";
import {
  CreditCard,
  FileText,
  FolderUp,
  UserRound,
} from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { programs } from "@/data/programs";
import { db } from "@/db";
import { 
  applications,
  applicationStatusHistory,
  documents, 
  payments,
} from "@/db/schema";
import { auth } from "@/lib/auth";

function formatStatus(
  status: string
) {
  return status
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    );
}


export default async function StudentDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "student") {
    redirect("/");
  }

  /*
   * Find the most recently updated/created
   * application belonging to THIS user.
   */
  const [application] = await db
    .select({
      id: applications.id,
      programSlug: applications.programSlug,
      status: applications.status,
      submittedAt: applications.submittedAt,
      createdAt: applications.createdAt,
      updatedAt: applications.updatedAt,
    })
    .from(applications)
    .where(
      eq(
        applications.userId,
        session.user.id
      )
    )
    .orderBy(desc(applications.updatedAt))
    .limit(1);

  const uploadedDocuments = application
    ? await db
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
        )
    : [];

    const requiredDocumentTypes = [
      "photo",
      "id_proof",
      "class_10_certificate",
      "class_12_certificate",
    ];

    const uploadedRequiredCount =
      requiredDocumentTypes.filter(
        (type) =>
          uploadedDocuments.some(
            (document) =>
              document.documentType === type
          )
      ).length;

    const [paidPayment] = application
      ? await db
          .select({
            id: payments.id,
            amount: payments.amount,
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
          .limit(1)
      : [];

  const statusHistory =
    application
      ? await db
          .select({
            id:
              applicationStatusHistory.id,

            fromStatus:
              applicationStatusHistory.fromStatus,

            toStatus:
              applicationStatusHistory.toStatus,

            createdAt:
              applicationStatusHistory.createdAt,
          })
          .from(
            applicationStatusHistory
          )
          .where(
            eq(
              applicationStatusHistory.applicationId,
              application.id
            )
          )
          .orderBy(
            asc(
              applicationStatusHistory.createdAt
            )
          )
      : [];

  const selectedProgram = application
    ? programs.find(
        (program) =>
          program.slug ===
          application.programSlug
      )
    : undefined;

  const isSubmitted =
    application
      ? application.status !== "draft"
      : false;

  const statusInfo = application
    ? {
        draft: {
          title: "Application in Progress",
          message:
            "Complete your application, upload the required documents, make the payment, and submit it.",
          boxClass:
            "border-yellow-200 bg-yellow-50",
          textClass:
            "text-yellow-800",
        },

        submitted: {
          title: "Application Submitted",
          message:
            "Your application has been submitted successfully and is waiting for the admissions team to begin their review.",
          boxClass:
            "border-blue-200 bg-blue-50",
          textClass:
            "text-blue-800",
        },

        under_review: {
          title: "Application Under Review",
          message:
            "The admissions team is currently reviewing your application. No action is required from you right now.",
          boxClass:
            "border-orange-200 bg-orange-50",
          textClass:
            "text-orange-800",
        },

        approved: {
          title: "Application Approved",
          message:
            "Congratulations! Your admission application has been approved.",
          boxClass:
            "border-green-200 bg-green-50",
          textClass:
            "text-green-800",
        },

        rejected: {
          title: "Application Not Approved",
          message:
            "Your application has been reviewed and was not approved.",
          boxClass:
            "border-red-200 bg-red-50",
          textClass:
            "text-red-800",
        },
      }[application.status]
    : null;

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Admission Dashboard
        </h2>

        <p className="mt-2 text-gray-600">
          Manage your application and track your
          admission process.
        </p>
      </div>

      {/* APPLICATION STATUS */}
      <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="flex-1">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Application Status
            </p>

            {application ? (
              <>
                <h3 className="mt-2 text-2xl font-bold text-gray-900">
                  {statusInfo?.title}
                </h3>

                <p className="mt-2 text-gray-600">
                  Application #{application.id}
                </p>

                {selectedProgram && (
                  <p className="mt-1 text-gray-600">
                    {selectedProgram.name} —{" "}
                    {selectedProgram.fullName}
                  </p>
                )}

                {statusInfo && (
                  <div
                    className={`mt-5 rounded-xl border p-4 ${statusInfo.boxClass}`}
                  >
                    <p
                      className={`font-semibold ${statusInfo.textClass}`}
                    >
                      {application.status === "approved" &&
                        "✓ "}
                      {application.status === "submitted" &&
                        "✓ "}
                      {statusInfo.title}
                    </p>

                    <p
                      className={`mt-1 text-sm ${statusInfo.textClass}`}
                    >
                      {statusInfo.message}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                <h3 className="mt-2 text-2xl font-bold text-gray-900">
                  No Application Yet
                </h3>

                <p className="mt-2 text-gray-600">
                  Start your application to begin the
                  admission process.
                </p>
              </>
            )}
          </div>

          {application ? (
            <Link
              href={
                isSubmitted
                  ? "/apply/review"
                  : "/apply"
              }
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              {isSubmitted
                ? "View Application"
                : "Edit Application"}
            </Link>
          ) : (
            <Link
              href="/apply"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Start Application
            </Link>
          )}
        </div>
      </section>

      {/* DASHBOARD CARDS */}
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <FileText className="h-6 w-6" />
          </div>

          <h3 className="mt-5 text-lg font-bold text-gray-900">
            Application
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            Complete or update your admission
            application.
          </p>

          <Link
            href={
              application && isSubmitted
                ? "/apply/review"
                : "/apply"
            }
            className="mt-5 inline-block font-semibold text-blue-600 hover:text-blue-700"
          >
            {application
              ? isSubmitted
                ? "Review Application →"
                : "Edit Application →"
              : "Start Application →"}
          </Link>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <FolderUp className="h-6 w-6" />
          </div>

          <h3 className="mt-5 text-lg font-bold text-gray-900">
            Documents
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            Upload certificates, identification,
            photographs, and required documents.
          </p>

          {application ? (
            <>
              <p className="mt-4 text-sm font-semibold text-gray-700">
                {uploadedRequiredCount} /{" "}
                {requiredDocumentTypes.length} required uploaded
              </p>

              <Link
                href="/apply/documents"
                className="mt-3 inline-block font-semibold text-blue-600 hover:text-blue-700"
              >
                {isSubmitted
                  ? "View Documents →"
                  : uploadedRequiredCount ===
                      requiredDocumentTypes.length
                    ? "Manage Documents →"
                    : "Upload Documents →"}
              </Link>
            </>
          ) : (
            <Link
              href="/apply"
              className="mt-5 inline-block font-semibold text-blue-600 hover:text-blue-700"
            >
              Start Application →
            </Link>
          )}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <CreditCard className="h-6 w-6" />
          </div>

          <h3 className="mt-5 text-lg font-bold text-gray-900">
            Payment
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            Pay your application fee and access
            payment receipts.
          </p>

          {paidPayment ? (
            <>
              <p className="mt-4 text-sm font-semibold text-green-700">
                ✓ Paid ₹
                {(paidPayment.amount / 100).toFixed(2)}
              </p>

              <Link
                href="/apply/payment"
                className="mt-3 inline-block font-semibold text-blue-600 hover:text-blue-700"
              >
                View Payment →
              </Link>
            </>
          ) : (
            <Link
              href="/apply/payment"
              className="mt-5 inline-block font-semibold text-blue-600 hover:text-blue-700"
            >
              Go to Payment →
            </Link>
          )}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <UserRound className="h-6 w-6" />
          </div>

          <h3 className="mt-5 text-lg font-bold text-gray-900">
            Profile
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            Review your student account and admission
            information.
          </p>

          <Link
            href="/student/profile"
            className="mt-5 inline-block font-semibold text-blue-600 hover:text-blue-700"
          >
            View Profile →
          </Link>
        </div>
      </div>
      {/* APPLICATION HISTORY */}
      {application &&
        application.status !== "draft" && (
          <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Application History
              </h2>

              <p className="mt-2 text-gray-600">
                Track the progress of your admission
                application.
              </p>
            </div>

            <div className="mt-8">
              {/* SUBMISSION */}
              {application.submittedAt && (
                <div className="relative border-l-2 border-gray-200 pb-8 pl-8">
                  <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-4 border-white bg-blue-600" />

                  <p className="font-bold text-gray-900">
                    Application Submitted
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    Your application was submitted
                    successfully.
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    {application.submittedAt.toLocaleString(
                      "en-IN",
                      {
                        dateStyle:
                          "medium",

                        timeStyle:
                          "short",
                      }
                    )}
                  </p>
                </div>
              )}

              {/* STATUS CHANGES */}
              {statusHistory.map(
                (history) => (
                  <div
                    key={history.id}
                    className="relative border-l-2 border-gray-200 pb-8 pl-8 last:border-transparent last:pb-0"
                  >
                    <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-4 border-white bg-gray-700" />

                    <p className="font-bold text-gray-900">
                      {history.toStatus ===
                      "under_review"
                        ? "Review Started"
                        : history.toStatus ===
                            "approved"
                          ? "Application Approved"
                          : history.toStatus ===
                              "rejected"
                            ? "Application Not Approved"
                            : formatStatus(
                                history.toStatus
                              )}
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                      {formatStatus(
                        history.fromStatus
                      )}
                      {" → "}
                      {formatStatus(
                        history.toStatus
                      )}
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                      {history.createdAt.toLocaleString(
                        "en-IN",
                        {
                          dateStyle:
                            "medium",

                          timeStyle:
                            "short",
                        }
                      )}
                    </p>
                  </div>
                )
              )}
            </div>
          </section>
        )}
    </main>
  );
}