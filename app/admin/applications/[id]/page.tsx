import {
  updateApplicationStatus,
} from "@/app/actions/admin-application";

import {
  asc,
  eq,
} from "drizzle-orm";

import Link from "next/link";

import {
  notFound,
} from "next/navigation";

import {
  academicDetails,
  applications,
  applicationStatusHistory,
  documents,
  payments,
} from "@/db/schema";

import {
  user,
} from "@/db/auth-schema";

import { db } from "@/db";

import {
  programs,
} from "@/data/programs";

interface AdminApplicationPageProps {
  params: Promise<{
    id: string;
  }>;
}

const documentLabels: Record<string, string> = {
  photo: "Passport-size Photo",
  id_proof: "Identity Proof",
  class_10_certificate: "10th Certificate",
  class_12_certificate: "12th Certificate",
  transfer_certificate: "Transfer Certificate",
  other: "Other Supporting Document",
};

function formatFileSize(
  bytes: number
) {
  if (bytes < 1024 * 1024) {
    return `${(
      bytes / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(2)} MB`;
}

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

export default async function AdminApplicationPage({
  params,
}: AdminApplicationPageProps) {
  const {
    id,
  } = await params;

  const applicationId =
    Number(id);

  if (
    !Number.isInteger(
      applicationId
    )
  ) {
    notFound();
  }

  const [application] =
    await db
      .select({
        id:
          applications.id,

        fullName:
          applications.fullName,

        email:
          applications.email,

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

        submittedAt:
          applications.submittedAt,

        createdAt:
          applications.createdAt,
      })
      .from(applications)
      .where(
        eq(
          applications.id,
          applicationId
        )
      )
      .limit(1);

  if (!application) {
    notFound();
  }

  const [academic] =
    await db
        .select({
        qualificationType:
            academicDetails.qualificationType,

        institutionName:
            academicDetails.institutionName,

        boardOrUniversity:
            academicDetails.boardOrUniversity,

        yearOfPassing:
            academicDetails.yearOfPassing,

        scoreType:
            academicDetails.scoreType,

        scoreValue:
            academicDetails.scoreValue,
        })
        .from(academicDetails)
        .where(
        eq(
            academicDetails.applicationId,
            application.id
        )
        )
        .limit(1);
    
  const uploadedDocuments =
    await db
        .select({
        id:
            documents.id,

        documentType:
            documents.documentType,

        originalName:
            documents.originalName,

        mimeType:
            documents.mimeType,

        fileSize:
            documents.fileSize,

        status:
            documents.status,
        })
        .from(documents)
        .where(
        eq(
            documents.applicationId,
            application.id
        )
        );
    
  const [payment] =
  await db
    .select({
      id:
        payments.id,

      amount:
        payments.amount,

      currency:
        payments.currency,

      status:
        payments.status,

      provider:
        payments.provider,

      providerOrderId:
        payments.providerOrderId,

      providerPaymentId:
        payments.providerPaymentId,

      paidAt:
        payments.paidAt,

      createdAt:
        payments.createdAt,
    })
    .from(payments)
    .where(
      eq(
        payments.applicationId,
        application.id
      )
    )
    .limit(1);

  const statusHistory =
    await db
      .select({
        id:
          applicationStatusHistory.id,

        fromStatus:
          applicationStatusHistory.fromStatus,

        toStatus:
          applicationStatusHistory.toStatus,

        createdAt:
          applicationStatusHistory.createdAt,

        adminName:
          user.name,

        adminEmail:
          user.email,
      })
      .from(
        applicationStatusHistory
      )
      .innerJoin(
        user,
        eq(
          applicationStatusHistory.adminUserId,
          user.id
        )
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
      );

  const selectedProgram =
    programs.find(
      (program) =>
        program.slug ===
        application.programSlug
    );

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8">
        <Link
          href="/admin/applications"
          className="font-semibold text-blue-600 hover:text-blue-700"
        >
          ← Back to Applications
        </Link>

        <p className="mt-8 text-sm font-semibold uppercase tracking-wider text-blue-600">
          Application #
          {application.id}
        </p>

        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          {application.fullName}
        </h1>

        <p className="mt-2 text-gray-600">
          Review this student&apos;s admission application.
        </p>
      </div>

      {/* STATUS */}
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
    <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
        Application Status
    </p>

    <p className="mt-2 text-xl font-bold capitalize text-gray-900">
        {application.status.replaceAll(
        "_",
        " "
        )}
    </p>

    <p className="mt-3 text-sm text-gray-600">
        Submitted:{" "}
        {application.submittedAt
        ? application.submittedAt.toLocaleString(
            "en-IN",
            {
                dateStyle:
                "medium",
                timeStyle:
                "short",
            }
            )
        : "Not submitted"}
    </p>

    {/* ADMIN ACTIONS */}
    <div className="mt-6">
        {application.status === "submitted" && (
        <form action={updateApplicationStatus}>
            <input
            type="hidden"
            name="applicationId"
            value={application.id}
            />

            <input
            type="hidden"
            name="status"
            value="under_review"
            />

            <button
            type="submit"
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
            Start Review
            </button>
        </form>
        )}

        {application.status === "under_review" && (
        <div className="flex flex-col gap-3 sm:flex-row">
            <form action={updateApplicationStatus}>
            <input
                type="hidden"
                name="applicationId"
                value={application.id}
            />

            <input
                type="hidden"
                name="status"
                value="approved"
            />

            <button
                type="submit"
                className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
            >
                Approve Application
            </button>
            </form>

            <form action={updateApplicationStatus}>
            <input
                type="hidden"
                name="applicationId"
                value={application.id}
            />

            <input
                type="hidden"
                name="status"
                value="rejected"
            />

            <button
                type="submit"
                className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
            >
                Reject Application
            </button>
            </form>
        </div>
        )}

        {application.status === "approved" && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
            <p className="font-semibold text-green-800">
            ✓ Application Approved
            </p>

            <p className="mt-1 text-sm text-green-700">
            No further admission decision is required.
            </p>
        </div>
        )}

        {application.status === "rejected" && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="font-semibold text-red-800">
            Application Rejected
            </p>

            <p className="mt-1 text-sm text-red-700">
            No further admission decision is available.
            </p>
        </div>
        )}

        {application.status === "draft" && (
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
            <p className="font-semibold text-yellow-800">
            Application is still a draft.
            </p>

            <p className="mt-1 text-sm text-yellow-700">
            The student must complete payment and final submission before review can begin.
            </p>
        </div>
        )}
    </div>
    </section>

      {/* PERSONAL DETAILS */}
      <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Personal Details
        </h2>

        <div className="mt-8 grid gap-x-10 gap-y-6 md:grid-cols-2">
          <AdminReviewItem
            label="Full Name"
            value={
              application.fullName
            }
          />

          <AdminReviewItem
            label="Email"
            value={
              application.email
            }
          />

          <AdminReviewItem
            label="Phone"
            value={
              application.phone
            }
          />

          <AdminReviewItem
            label="Date of Birth"
            value={
              application.dateOfBirth
            }
          />

          <AdminReviewItem
            label="Gender"
            value={application.gender
              .replaceAll(
                "-",
                " "
              )
              .replace(
                /\b\w/g,
                (letter) =>
                  letter.toUpperCase()
              )}
          />

          <AdminReviewItem
            label="Program"
            value={
              selectedProgram
                ? `${selectedProgram.name} — ${selectedProgram.fullName}`
                : application.programSlug
            }
          />

          <div className="md:col-span-2">
            <AdminReviewItem
              label="Address"
              value={
                application.address
              }
            />
          </div>
        </div>
      </section>

      {/* ACADEMIC DETAILS */}
    <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
    <h2 className="text-2xl font-bold text-gray-900">
        Academic Details
    </h2>

    {academic ? (
        <div className="mt-8 grid gap-x-10 gap-y-6 md:grid-cols-2">
        <AdminReviewItem
            label="Qualification"
            value={academic.qualificationType
            .replaceAll("_", " ")
            .replace(
                /\b\w/g,
                (letter) =>
                letter.toUpperCase()
            )}
        />

        <AdminReviewItem
            label="Institution"
            value={
            academic.institutionName
            }
        />

        <AdminReviewItem
            label="Board / University"
            value={
            academic.boardOrUniversity
            }
        />

        <AdminReviewItem
            label="Year of Passing"
            value={String(
            academic.yearOfPassing
            )}
        />

        <AdminReviewItem
            label="Score Type"
            value={
            academic.scoreType ===
            "percentage"
                ? "Percentage"
                : "CGPA"
            }
        />

        <AdminReviewItem
            label="Score"
            value={
            academic.scoreType ===
            "percentage"
                ? `${academic.scoreValue}%`
                : `${academic.scoreValue} CGPA`
            }
        />
        </div>
    ) : (
        <div className="mt-6 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
        <p className="font-semibold text-yellow-800">
            Academic details not provided.
        </p>
        </div>
    )}
    </section>
    {/* DOCUMENTS */}
    <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
    <div>
        <h2 className="text-2xl font-bold text-gray-900">
        Documents
        </h2>

        <p className="mt-2 text-gray-600">
        Documents uploaded by the student.
        </p>
    </div>

    {uploadedDocuments.length > 0 ? (
        <div className="mt-8 divide-y divide-gray-100">
        {uploadedDocuments.map(
            (document) => (
            <div
                key={document.id}
                className="flex flex-col justify-between gap-4 py-5 sm:flex-row sm:items-center"
            >
                <div>
                <p className="font-semibold text-gray-900">
                    {documentLabels[
                    document.documentType
                    ] ??
                    document.documentType}
                </p>

                <p className="mt-1 text-sm text-gray-600">
                    {
                    document.originalName
                    }
                </p>

                <p className="mt-1 text-xs text-gray-500">
                    {formatFileSize(
                    document.fileSize
                    )}
                    {" · "}
                    {document.status}
                </p>
                </div>

                <a
                href={`/api/documents/${document.id}`}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-blue-600 hover:text-blue-700"
                >
                View →
                </a>
            </div>
            )
        )}
        </div>
    ) : (
        <div className="mt-6 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
        <p className="font-semibold text-yellow-800">
            No documents uploaded.
        </p>
        </div>
    )}
    </section>
    {/* PAYMENT DETAILS */}
    <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
    <div>
        <h2 className="text-2xl font-bold text-gray-900">
        Payment Details
        </h2>

        <p className="mt-2 text-gray-600">
        Application fee payment information.
        </p>
    </div>

    {payment ? (
        <div className="mt-8 grid gap-x-10 gap-y-6 md:grid-cols-2">
        <AdminReviewItem
            label="Payment Status"
            value={payment.status
            .replaceAll("_", " ")
            .replace(
                /\b\w/g,
                (letter) =>
                letter.toUpperCase()
            )}
        />

        <AdminReviewItem
            label="Amount"
            value={`₹${(
            payment.amount / 100
            ).toFixed(2)}`}
        />

        <AdminReviewItem
            label="Provider"
            value={payment.provider}
        />

        <AdminReviewItem
            label="Order ID"
            value={
            payment.providerOrderId
            }
        />

        <AdminReviewItem
            label="Payment ID"
            value={
            payment.providerPaymentId ??
            "Not available"
            }
        />

        <AdminReviewItem
            label="Paid On"
            value={
            payment.paidAt
                ? payment.paidAt.toLocaleString(
                    "en-IN",
                    {
                    dateStyle:
                        "medium",
                    timeStyle:
                        "short",
                    }
                )
                : "Not paid"
            }
        />
        </div>
    ) : (
        <div className="mt-6 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
        <p className="font-semibold text-yellow-800">
            No payment record found.
        </p>
        </div>
    )}
    </section>

    {/* APPLICATION HISTORY */}
    <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Application History
        </h2>

        <p className="mt-2 text-gray-600">
          Timeline of submission and admission
          decisions.
        </p>
      </div>

      <div className="mt-8">
        {/* INITIAL SUBMISSION */}
        {application.submittedAt && (
          <div className="relative border-l-2 border-gray-200 pb-8 pl-8">
            <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-4 border-white bg-blue-600" />

            <p className="font-bold text-gray-900">
              Application Submitted
            </p>

            <p className="mt-1 text-sm text-gray-600">
              The student completed payment and
              submitted the application.
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

        {/* ADMIN STATUS CHANGES */}
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
                      ? "Application Rejected"
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

              <div className="mt-3 rounded-lg bg-gray-50 p-3">
                <p className="text-sm font-semibold text-gray-700">
                  By {history.adminName}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {history.adminEmail}
                </p>
              </div>

              <p className="mt-3 text-sm text-gray-500">
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
    </main>
  );
}

interface AdminReviewItemProps {
  label: string;
  value: string;
}

function AdminReviewItem({
  label,
  value,
}: AdminReviewItemProps) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-500">
        {label}
      </p>

      <p className="mt-1 font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}