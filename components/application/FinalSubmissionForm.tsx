"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  submitFinalApplication,
} from "@/app/actions/final-submission";

import type {
  FinalSubmissionState,
} from "@/types/final-submission-state";

const initialState: FinalSubmissionState = {
  success: false,
  message: "",
  errors: {},
};

export default function FinalSubmissionForm() {
  const [
    state,
    formAction,
    isPending,
  ] = useActionState(
    submitFinalApplication,
    initialState
  );

  if (state.success) {
    return (
      <div className="space-y-6">
        <section className="rounded-2xl border border-green-200 bg-green-50 p-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
            Submitted Successfully
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-900">
            Application Submitted
          </h2>

          <p className="mt-4 text-green-800">
            {state.message}
          </p>

          <p className="mt-3 text-sm text-green-700">
            Your application is now locked for
            editing and ready for admission review.
          </p>
        </section>

        <div className="flex justify-end">
          <Link
            href="/student/dashboard"
            className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Go to Dashboard →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="space-y-8"
    >
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
          Declaration
        </p>

        <h2 className="mt-2 text-2xl font-bold text-gray-900">
          Final Declaration
        </h2>

        <p className="mt-4 leading-7 text-gray-600">
          Please confirm that the information and
          documents provided in this application
          are complete and accurate to the best of
          your knowledge.
        </p>

        <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <input
            name="declaration"
            type="checkbox"
            className="mt-1 h-5 w-5"
          />

          <span className="text-sm leading-6 text-gray-700">
            I declare that the information submitted
            in this application is true and correct.
            I understand that incorrect or fraudulent
            information may result in rejection of my
            application.
          </span>
        </label>

        {state.errors.declaration && (
          <p className="mt-3 text-sm font-medium text-red-600">
            {state.errors.declaration[0]}
          </p>
        )}
      </section>

      {state.message && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.message}
        </div>
      )}

      <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="font-bold text-red-800">
          Important
        </p>

        <p className="mt-2 text-sm leading-6 text-red-700">
          After final submission, you will no longer
          be able to edit your application through
          the student portal.
        </p>
      </section>

      <div className="flex flex-col-reverse justify-between gap-4 sm:flex-row">
        <Link
          href="/apply/review"
          className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-center font-semibold text-gray-700 hover:bg-gray-50"
        >
          ← Review Application
        </Link>

        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-green-600 px-8 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending
            ? "Submitting..."
            : "Submit Application"}
        </button>
      </div>
    </form>
  );
}