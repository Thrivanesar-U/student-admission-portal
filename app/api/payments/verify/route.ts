import {
  createHmac,
  timingSafeEqual,
} from "node:crypto";

import {
  and,
  eq,
} from "drizzle-orm";

import {
  applications,
  payments,
} from "@/db/schema";

import { db } from "@/db";
import { auth } from "@/lib/auth";

import {
  getRazorpayClient,
} from "@/lib/razorpay";

export const runtime =
  "nodejs";

interface VerifyPaymentBody {
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
}

function safeSignatureEqual(
  expected: string,
  received: string
) {
  if (
    !/^[a-f0-9]{64}$/i.test(
      received
    )
  ) {
    return false;
  }

  const expectedBuffer =
    Buffer.from(
      expected,
      "hex"
    );

  const receivedBuffer =
    Buffer.from(
      received,
      "hex"
    );

  if (
    expectedBuffer.length !==
    receivedBuffer.length
  ) {
    return false;
  }

  return timingSafeEqual(
    expectedBuffer,
    receivedBuffer
  );
}

export async function POST(
  request: Request
) {
  const session =
    await auth.api.getSession({
      headers: request.headers,
    });

  if (
    !session ||
    session.user.role !==
      "student"
  ) {
    return Response.json(
      {
        error:
          "Unauthorized.",
      },
      {
        status: 401,
      }
    );
  }

  const body =
    (await request.json()) as
      VerifyPaymentBody;

  const {
    razorpayPaymentId,
    razorpayOrderId,
    razorpaySignature,
  } = body;

  if (
    !razorpayPaymentId ||
    !razorpayOrderId ||
    !razorpaySignature
  ) {
    return Response.json(
      {
        error:
          "Missing payment verification data.",
      },
      {
        status: 400,
      }
    );
  }

  /*
   * IMPORTANT:
   * Find the order from OUR database.
   */
  const [payment] =
    await db
      .select({
        id:
          payments.id,

        amount:
          payments.amount,

        status:
          payments.status,

        providerOrderId:
          payments.providerOrderId,

        applicationId:
          payments.applicationId,
      })
      .from(payments)
      .innerJoin(
        applications,
        eq(
          payments.applicationId,
          applications.id
        )
      )
      .where(
        and(
          eq(
            payments.providerOrderId,
            razorpayOrderId
          ),

          eq(
            applications.userId,
            session.user.id
          )
        )
      )
      .limit(1);

  if (!payment) {
    return Response.json(
      {
        error:
          "Payment order not found.",
      },
      {
        status: 404,
      }
    );
  }

  /*
   * IDEMPOTENCY
   */
  if (
    payment.status ===
    "paid"
  ) {
    return Response.json({
      success: true,
      message:
        "Payment already verified.",
    });
  }

  const keySecret =
    process.env
      .RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    return Response.json(
      {
        error:
          "Payment configuration error.",
      },
      {
        status: 500,
      }
    );
  }

  /*
   * Razorpay signature:
   *
   * HMAC_SHA256(
   *   order_id + "|" +
   *   payment_id,
   *   key_secret
   * )
   */
  const expectedSignature =
    createHmac(
      "sha256",
      keySecret
    )
      .update(
        `${payment.providerOrderId}|${razorpayPaymentId}`
      )
      .digest("hex");

  const signatureValid =
    safeSignatureEqual(
      expectedSignature,
      razorpaySignature
    );

  if (!signatureValid) {
    return Response.json(
      {
        error:
          "Payment signature verification failed.",
      },
      {
        status: 400,
      }
    );
  }

  try {
    /*
     * ADDITIONAL SERVER-TO-SERVER
     * PAYMENT STATUS CHECK
     */
    const razorpay =
      getRazorpayClient();

    const razorpayPayment =
      await razorpay.payments.fetch(
        razorpayPaymentId
      );

    if (
      razorpayPayment.order_id !==
      payment.providerOrderId
    ) {
      return Response.json(
        {
          error:
            "Payment order mismatch.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      Number(
        razorpayPayment.amount
      ) !== payment.amount
    ) {
      return Response.json(
        {
          error:
            "Payment amount mismatch.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      razorpayPayment.status !==
      "captured"
    ) {
      return Response.json(
        {
          error:
            "Payment has not been captured yet.",
        },
        {
          status: 409,
        }
      );
    }

    /*
     * FINALLY MARK PAID
     */
    await db
      .update(payments)
      .set({
        providerPaymentId:
          razorpayPaymentId,

        providerSignature:
          razorpaySignature,

        status:
          "paid",

        paidAt:
          new Date(),

        updatedAt:
          new Date(),
      })
      .where(
        eq(
          payments.id,
          payment.id
        )
      );

    return Response.json({
      success: true,

      message:
        "Payment verified successfully.",
    });
  } catch (error) {
    console.error(
      "Payment verification error:",
      error
    );

    return Response.json(
      {
        error:
          "Unable to verify payment status.",
      },
      {
        status: 500,
      }
    );
  }
}