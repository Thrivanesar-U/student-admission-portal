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

import PaymentCheckout from "@/components/application/PaymentCheckout";

import {
  academicDetails,
  applications,
  documents,
  payments,
} from "@/db/schema";

import { db } from "@/db";
import { auth } from "@/lib/auth";

import {
  getApplicationFeePaise,
} from "@/lib/payment-config";

const requiredDocumentTypes = [
  "photo",
  "id_proof",
  "class_10_certificate",
  "class_12_certificate",
] as const;

export default async function PaymentPage() {
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

  const [paidPayment] =
    await db
      .select({
        id:
          payments.id,

        amount:
          payments.amount,

        paidAt:
          payments.paidAt,

        providerPaymentId:
          payments.providerPaymentId,
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

  const amount =
    getApplicationFeePaise();

  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Step 5
          </p>

          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            Application Payment
          </h1>

          <p className="mt-4 text-gray-600">
            Pay the application fee before
            final submission.
          </p>
        </div>

        {paidPayment ? (
          <div className="space-y-6">
            <section className="rounded-2xl border border-green-200 bg-green-50 p-8">
              <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
                Payment Successful
              </p>

              <h2 className="mt-2 text-3xl font-bold text-green-900">
                ₹
                {(
                  paidPayment.amount /
                  100
                ).toFixed(2)}
              </h2>

              <p className="mt-4 text-green-800">
                Your application fee has
                been verified successfully.
              </p>

              {paidPayment.providerPaymentId && (
                <p className="mt-3 text-sm text-green-700">
                  Payment ID:{" "}
                  {
                    paidPayment.providerPaymentId
                  }
                </p>
              )}
            </section>

            <div className="flex flex-col-reverse justify-between gap-4 sm:flex-row">
              <Link
                href="/apply/review"
                className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-center font-semibold text-gray-700 hover:bg-gray-50"
              >
                ← Review
              </Link>

              {application.status === "draft" ? (
                <Link
                  href="/apply/submit"
                  className="rounded-lg bg-green-600 px-8 py-3 text-center font-semibold text-white transition hover:bg-green-700"
                >
                  Continue to Final Submission →
                </Link>
              ) : (
                <Link
                  href="/student/dashboard"
                  className="rounded-lg bg-blue-600 px-8 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
                >
                  Return to Dashboard →
                </Link>
              )}
            </div>

          </div>
        ) : (
          <PaymentCheckout
            amountPaise={
              amount
            }
          />
        )}
      </div>
    </main>
  );
}