import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import PrintApplicationButton from "@/components/application/PrintApplicationButton";

import { programs } from "@/data/programs";
import { db } from "@/db";

import {
  academicDetails,
  applications,
  documents,
  payments,
} from "@/db/schema";

import { auth } from "@/lib/auth";

const requiredDocumentTypes = [
  "photo",
  "id_proof",
  "class_10_certificate",
  "class_12_certificate",
] as const;

const documentLabels: Record<string, string> = {
  photo: "Passport-size Photo",
  id_proof: "Identity Proof",
  class_10_certificate: "10th Certificate",
  class_12_certificate: "12th Certificate",
  transfer_certificate: "Transfer Certificate",
  other: "Other Supporting Document",
};

const qualificationLabels: Record<string, string> = {
  higher_secondary: "Higher Secondary / 12th",
  diploma: "Diploma",
  undergraduate: "Undergraduate",
  postgraduate: "Postgraduate",
  other: "Other",
};

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(2)} MB`;
}

export default async function ReviewApplicationPage() {
  /*
   * AUTHENTICATION
   */
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  /*
   * AUTHORIZATION
   */
  if (session.user.role !== "student") {
    redirect("/");
  }

  /*
   * STEP 1
   * Get this student's application.
   */
  const [application] = await db
    .select({
      id: applications.id,

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

      updatedAt:
        applications.updatedAt,
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
   * STEP 2
   * Academic details.
   */
  const [academic] = await db
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

  if (!academic) {
    redirect("/apply/academic");
  }

  /*
   * STEP 3
   * Documents belonging to this application.
   */
  const uploadedDocuments = await db
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

  /*
   * Check required documents.
   */
  const missingRequiredDocuments =
    requiredDocumentTypes.filter(
      (requiredType) =>
        !uploadedDocuments.some(
          (document) =>
            document.documentType ===
            requiredType
        )
    );

  /*
   * Do not allow Review until
   * all required documents exist.
   */
  if (missingRequiredDocuments.length > 0) {
    redirect("/apply/documents");
  }

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

  const paymentComplete =
    Boolean(paidPayment);

  const selectedProgram =
    programs.find(
      (program) =>
        program.slug ===
        application.programSlug
    );
  
  const isSubmitted =
    application.status !== "draft";

  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="mx-auto max-w-5xl px-6">
        {/* PRINT-ONLY APPLICATION HEADER */}
        <section className="hidden print:block">
          <div className="border-b-2 border-gray-900 pb-6 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              3vSkool
            </h1>

            <p className="mt-2 text-lg font-bold uppercase tracking-wider text-gray-900">
              Admission Application
            </p>

            <p className="mt-1 text-sm text-gray-600">
              Admissions 2026–27
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div>
              <span className="font-semibold text-gray-700">
                Application ID:
              </span>{" "}
              <span className="text-gray-900">
                #{application.id}
              </span>
            </div>

            <div>
              <span className="font-semibold text-gray-700">
                Status:
              </span>{" "}
              <span className="capitalize text-gray-900">
                {application.status.replaceAll(
                  "_",
                  " "
                )}
              </span>
            </div>

            <div>
              <span className="font-semibold text-gray-700">
                Program:
              </span>{" "}
              <span className="text-gray-900">
                {selectedProgram
                  ? `${selectedProgram.name} — ${selectedProgram.fullName}`
                  : application.programSlug}
              </span>
            </div>

            <div>
              <span className="font-semibold text-gray-700">
                Submitted On:
              </span>{" "}
              <span className="text-gray-900">
                {application.submittedAt
                  ? application.submittedAt.toLocaleString(
                      "en-IN",
                      {
                        dateStyle: "long",
                        timeStyle: "short",
                      }
                    )
                  : "Not submitted"}
              </span>
            </div>
          </div>
        </section>
        <div className="hidden h-8 print:block" />
        {/* PAGE HEADER */}
        <div className="mb-10 print:hidden">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Step 4
          </p>

          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            Review Application
          </h1>


          {paymentComplete && (
          <div className="mt-6">
            <PrintApplicationButton />
          </div>
          )}

          <p className="mt-4 max-w-3xl text-gray-600">
            Review all information carefully before
            proceeding to payment and final submission.
          </p>
        </div>

        {/* APPLICATION COMPLETION */}
        {paymentComplete ? (
          <section className="mb-8 rounded-2xl border border-green-200 bg-green-50 p-6 print:hidden">
            <p className="font-bold text-green-800">
              ✓ Application Requirements Completed
            </p>

            <p className="mt-2 text-sm text-green-700">
              Personal details, academic details,
              required documents, and payment have
              been completed.
            </p>
          </section>
        ) : (
          <section className="mb-8 rounded-2xl border border-yellow-200 bg-yellow-50 p-6 print:hidden">
            <p className="font-bold text-yellow-800">
              Application Details Completed
            </p>

            <p className="mt-2 text-sm text-yellow-700">
              Your personal details, academic details,
              and required documents are complete.
              Payment is still pending.
            </p>
          </section>
        )}

        <div className="space-y-8">
          {/* PERSONAL DETAILS */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-blue-600">
                  Step 1
                </p>

                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  Personal Details
                </h2>
              </div>

              <Link
                href="/apply"
                className="font-semibold text-blue-600 hover:text-blue-700 print:hidden"
              >
                Edit
              </Link>
            </div>

            <div className="mt-8 grid gap-x-10 gap-y-6 md:grid-cols-2">
              <ReviewItem
                label="Full Name"
                value={application.fullName}
              />

              <ReviewItem
                label="Email"
                value={application.email}
              />

              <ReviewItem
                label="Phone"
                value={application.phone}
              />

              <ReviewItem
                label="Date of Birth"
                value={application.dateOfBirth}
              />

              <ReviewItem
                label="Gender"
                value={application.gender
                  .replaceAll("-", " ")
                  .replace(/\b\w/g, (letter) =>
                    letter.toUpperCase()
                  )}
              />

              <ReviewItem
                label="Application ID"
                value={`#${application.id}`}
              />

              <div className="md:col-span-2">
                <ReviewItem
                  label="Address"
                  value={application.address}
                />
              </div>
            </div>
          </section>

          {/* PROGRAM */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-blue-600">
                  Program
                </p>

                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  Program Selection
                </h2>
              </div>

              <Link
                href="/apply"
                className="font-semibold text-blue-600 hover:text-blue-700 print:hidden"
              >
                Edit
              </Link>
            </div>

            <div className="mt-6">
              <p className="text-lg font-bold text-gray-900">
                {selectedProgram
                  ? selectedProgram.name
                  : application.programSlug}
              </p>

              {selectedProgram && (
                <>
                  <p className="mt-1 text-gray-600">
                    {selectedProgram.fullName}
                  </p>

                  <p className="mt-2 text-sm font-semibold text-blue-600">
                    {selectedProgram.duration}
                  </p>
                </>
              )}
            </div>
          </section>

          {/* ACADEMIC */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-blue-600">
                  Step 2
                </p>

                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  Academic Details
                </h2>
              </div>

              <Link
                href="/apply/academic"
                className="font-semibold text-blue-600 hover:text-blue-700 print:hidden"
              >
                Edit
              </Link>
            </div>

            <div className="mt-8 grid gap-x-10 gap-y-6 md:grid-cols-2">
              <ReviewItem
                label="Qualification"
                value={
                  qualificationLabels[
                    academic.qualificationType
                  ] ??
                  academic.qualificationType
                }
              />

              <ReviewItem
                label="Year of Passing"
                value={String(
                  academic.yearOfPassing
                )}
              />

              <ReviewItem
                label="Institution"
                value={
                  academic.institutionName
                }
              />

              <ReviewItem
                label="Board / University"
                value={
                  academic.boardOrUniversity
                }
              />

              <ReviewItem
                label="Score Type"
                value={
                  academic.scoreType ===
                  "percentage"
                    ? "Percentage"
                    : "CGPA"
                }
              />

              <ReviewItem
                label="Score"
                value={
                  academic.scoreType ===
                  "percentage"
                    ? `${academic.scoreValue}%`
                    : `${academic.scoreValue} CGPA`
                }
              />
            </div>
          </section>

          {/* DOCUMENTS */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-blue-600">
                  Step 3
                </p>

                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  Documents
                </h2>
              </div>

              <Link
                href="/apply/documents"
                className="font-semibold text-blue-600 hover:text-blue-700 print:hidden"
              >
                Manage
              </Link>
            </div>

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
                        {document.originalName}
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
                      className="font-semibold text-blue-600 hover:text-blue-700 print:hidden"
                    >
                      View
                    </a>
                  </div>
                )
              )}
            </div>
          </section>

          {/* APPLICATION STATUS */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <p className="text-sm font-semibold text-gray-500">
              CURRENT STATUS
            </p>

            <p className="mt-2 text-xl font-bold capitalize text-gray-900">
              {application.status.replaceAll(
                "_",
                " "
              )}
            </p>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              {isSubmitted
                ? "Your application has been submitted successfully and is now awaiting admission review."
                : "Your application remains a draft until payment and final submission are completed."}
            </p>
          </section>
        </div>

        {/* NAVIGATION */}
        <div className="mt-10 flex flex-col-reverse justify-between gap-4 print:hidden sm:flex-row">
          {isSubmitted ? (
            <Link
              href="/student/dashboard"
              className="rounded-lg bg-blue-600 px-8 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
            >
              ← Return to Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/apply/documents"
                className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-center font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                ← Documents
              </Link>

              <Link
                href="/apply/payment"
                className="rounded-lg bg-green-600 px-8 py-3 text-center font-semibold text-white transition hover:bg-green-700"
              >
                Continue to Payment →
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

interface ReviewItemProps {
  label: string;
  value: string;
}

function ReviewItem({
  label,
  value,
}: ReviewItemProps) {
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