import {
  and,
  eq,
} from "drizzle-orm";

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

import {
  getRazorpayClient,
} from "@/lib/razorpay";

export const runtime =
  "nodejs";

const requiredDocumentTypes = [
  "photo",
  "id_proof",
  "class_10_certificate",
  "class_12_certificate",
] as const;

export async function POST(
  request: Request
) {
  /*
   * AUTHENTICATION
   */
  const session =
    await auth.api.getSession({
      headers: request.headers,
    });

  if (!session) {
    return Response.json(
      {
        error:
          "You must be logged in.",
      },
      {
        status: 401,
      }
    );
  }

  /*
   * AUTHORIZATION
   */
  if (
    session.user.role !==
    "student"
  ) {
    return Response.json(
      {
        error:
          "Only students can make application payments.",
      },
      {
        status: 403,
      }
    );
  }

  /*
   * FIND APPLICATION
   */
  const [application] =
    await db
      .select({
        id: applications.id,
        fullName:
          applications.fullName,
        phone:
          applications.phone,
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
    return Response.json(
      {
        error:
          "Complete your application first.",
      },
      {
        status: 400,
      }
    );
  }

  /*
   * ACADEMIC DETAILS CHECK
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
    return Response.json(
      {
        error:
          "Complete Academic Details first.",
      },
      {
        status: 400,
      }
    );
  }

  /*
   * REQUIRED DOCUMENT CHECK
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
    return Response.json(
      {
        error:
          "Upload all required documents first.",
      },
      {
        status: 400,
      }
    );
  }

  /*
   * DO NOT CHARGE AGAIN
   * IF ALREADY PAID.
   */
  const [existingPaidPayment] =
    await db
      .select({
        id: payments.id,
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

  if (existingPaidPayment) {
    return Response.json(
      {
        error:
          "Application fee has already been paid.",
      },
      {
        status: 409,
      }
    );
  }

  const amount =
    getApplicationFeePaise();

  const razorpay =
    getRazorpayClient();

  try {
    /*
     * CREATE ORDER ON RAZORPAY
     */
    const order =
      await razorpay.orders.create({
        amount,
        currency: "INR",

        receipt:
          `application_${application.id}_${Date.now()}`,

        notes: {
          application_id:
            String(
              application.id
            ),

          user_id:
            session.user.id,
        },
      });

    /*
     * STORE ORDER IN OUR DB
     */
    await db
      .insert(payments)
      .values({
        applicationId:
          application.id,

        amount,

        currency:
          "INR",

        provider:
          "razorpay",

        providerOrderId:
          order.id,

        status:
          "created",
      });

    return Response.json({
      keyId:
        process.env.RAZORPAY_KEY_ID,

      orderId:
        order.id,

      amount,

      currency:
        "INR",

      name:
        application.fullName,

      email:
        session.user.email,

      contact:
        application.phone,
    });
  } catch (error) {
    console.error(
      "Unable to create Razorpay order:",
      error
    );

    return Response.json(
      {
        error:
          "Unable to create payment order.",
      },
      {
        status: 500,
      }
    );
  }
}