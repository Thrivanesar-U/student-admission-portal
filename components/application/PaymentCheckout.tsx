"use client";

import Link from "next/link";

import {
  useRouter,
} from "next/navigation";

import {
  useState,
} from "react";

interface CreateOrderResponse {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
  name: string;
  email: string;
  contact: string;
}

interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;

  prefill: {
    name: string;
    email: string;
    contact: string;
  };

  theme?: {
    color?: string;
  };

  handler: (
    response:
      RazorpaySuccessResponse
  ) => void;

  modal?: {
    ondismiss?: () => void;
  };
}

declare global {
  interface Window {
    Razorpay: new (
      options: RazorpayOptions
    ) => {
      open: () => void;
    };
  }
}

async function loadRazorpayScript() {
  if (
    typeof window !==
    "undefined" &&
    window.Razorpay
  ) {
    return true;
  }

  return new Promise<boolean>(
    (resolve) => {
      const script =
        document.createElement(
          "script"
        );

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload =
        () =>
          resolve(true);

      script.onerror =
        () =>
          resolve(false);

      document.body.appendChild(
        script
      );
    }
  );
}

interface PaymentCheckoutProps {
  amountPaise: number;
}

export default function PaymentCheckout({
  amountPaise,
}: PaymentCheckoutProps) {
  const router =
    useRouter();

  const [
    isLoading,
    setIsLoading,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const amountRupees =
    amountPaise / 100;

  async function handlePayment() {
    setError("");
    setIsLoading(true);

    try {
      const loaded =
        await loadRazorpayScript();

      if (!loaded) {
        setError(
          "Unable to load Razorpay Checkout."
        );

        return;
      }

      /*
       * Ask OUR server to create
       * the Razorpay Order.
       */
      const orderResponse =
        await fetch(
          "/api/payments/create-order",
          {
            method: "POST",
          }
        );

      const orderData =
        await orderResponse.json();

      if (!orderResponse.ok) {
        setError(
          orderData.error ??
            "Unable to create payment."
        );

        return;
      }

      const data =
        orderData as
          CreateOrderResponse;

      const options:
        RazorpayOptions = {
        key:
          data.keyId,

        amount:
          data.amount,

        currency:
          data.currency,

        name:
          "3vSkool",

        description:
          "Application Fee",

        order_id:
          data.orderId,

        prefill: {
          name:
            data.name,

          email:
            data.email,

          contact:
            data.contact,
        },

        handler: async (
          response
        ) => {
          const verifyResponse =
            await fetch(
              "/api/payments/verify",
              {
                method:
                  "POST",

                headers: {
                  "Content-Type":
                    "application/json",
                },

                body:
                  JSON.stringify({
                    razorpayPaymentId:
                      response.razorpay_payment_id,

                    razorpayOrderId:
                      response.razorpay_order_id,

                    razorpaySignature:
                      response.razorpay_signature,
                  }),
              }
            );

          const verifyData =
            await verifyResponse.json();

          if (
            !verifyResponse.ok
          ) {
            setError(
              verifyData.error ??
                "Payment verification failed."
            );

            setIsLoading(
              false
            );

            return;
          }

          router.refresh();
        },

        modal: {
          ondismiss: () => {
            setIsLoading(
              false
            );
          },
        },
      };

      const razorpay =
        new window.Razorpay(
          options
        );

      razorpay.open();
    } catch {
      setError(
        "Unable to start payment."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
          Application Fee
        </p>

        <p className="mt-3 text-4xl font-bold text-gray-900">
          ₹
          {amountRupees.toFixed(
            2
          )}
        </p>

        <p className="mt-3 text-sm text-gray-600">
          You are currently using
          Razorpay Test Mode. No real
          payment should be made during
          development.
        </p>
      </section>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col-reverse justify-between gap-4 sm:flex-row">
        <Link
          href="/apply/review"
          className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-center font-semibold text-gray-700 hover:bg-gray-50"
        >
          ← Review Application
        </Link>

        <button
          type="button"
          onClick={
            handlePayment
          }
          disabled={
            isLoading
          }
          className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading
            ? "Opening Payment..."
            : `Pay ₹${amountRupees.toFixed(
                2
              )}`}
        </button>
      </div>
    </div>
  );
}