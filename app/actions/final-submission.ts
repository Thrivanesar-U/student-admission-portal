"use server";

import { headers } from "next/headers";
import { and, eq } from "drizzle-orm";

import { db } from "@/db";

import {
  academicDetails,
  applications,
  documents,
  payments,
} from "@/db/schema";

import { auth } from "@/lib/auth";

import type {
  FinalSubmissionState,
} from "@/types/final-submission-state";

const requiredDocumentTypes = [
  "photo",
  "id_proof",
  "class_10_certificate",
  "class_12_certificate",
] as const;

export async function submitFinalApplication(
  _previousState: FinalSubmissionState,
  formData: FormData
): Promise<FinalSubmissionState> {
  /*
   * 1. AUTHENTICATION
   */
  const session =
    await auth.api.getSession({
      headers: await headers(),
    });

  if (!session) {
    return {
      success: false,
      message:
        "You must be logged in.",
      errors: {},
    };
  }

  /*
   * 2. AUTHORIZATION
   */
  if (
    session.user.role !== "student"
  ) {
    return {
      success: false,
      message:
        "Only students can submit applications.",
      errors: {},
    };
  }

  /*
   * 3. DECLARATION
   */
  const declaration =
    formData.get("declaration");

  if (declaration !== "on") {
    return {
      success: false,

      message:
        "Please accept the declaration.",

      errors: {
        declaration: [
          "You must accept the declaration before submitting.",
        ],
      },
    };
  }

  /*
   * 4. GET THIS STUDENT'S APPLICATION
   */
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
    return {
      success: false,
      message:
        "Complete your application first.",
      errors: {},
    };
  }

  /*
   * Already submitted?
   */
  if (
    application.status !==
    "draft"
  ) {
    return {
      success: false,

      message:
        "This application has already been submitted.",

      errors: {},
    };
  }

  /*
   * 5. VERIFY ACADEMIC DETAILS
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
    return {
      success: false,

      message:
        "Academic details are incomplete.",

      errors: {},
    };
  }

  /*
   * 6. VERIFY DOCUMENTS
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
    return {
      success: false,

      message:
        "All required documents must be uploaded.",

      errors: {},
    };
  }

  /*
   * 7. VERIFY PAYMENT
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
    return {
      success: false,

      message:
        "Application fee payment has not been completed.",

      errors: {},
    };
  }

  /*
   * 8. FINAL SUBMISSION
   *
   * We also require status=draft in
   * the UPDATE itself.
   *
   * This prevents accidental
   * double submission.
   */
  const now =
    new Date();

  const [submittedApplication] =
    await db
      .update(applications)
      .set({
        status:
          "submitted",

        submittedAt:
          now,

        declarationAcceptedAt:
          now,

        declarationVersion:
          "admission-2026-v1",

        updatedAt:
          now,
      })
      .where(
        and(
          eq(
            applications.id,
            application.id
          ),

          eq(
            applications.status,
            "draft"
          )
        )
      )
      .returning({
        id:
          applications.id,

        status:
          applications.status,

        submittedAt:
          applications.submittedAt,
      });

  if (!submittedApplication) {
    return {
      success: false,

      message:
        "The application could not be submitted. It may already have been submitted.",

      errors: {},
    };
  }

  return {
    success: true,

    message:
      `Application #${submittedApplication.id} submitted successfully.`,

    errors: {},
  };
}