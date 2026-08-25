"use client";

import Link from "next/link";
import { useActionState } from "react";

import { submitApplication } from "@/app/actions/application";
import { programs } from "@/data/programs";
import type { ApplicationState } from "@/types/application-state";

type Gender =
  | "male"
  | "female"
  | "other"
  | "prefer-not-to-say";

interface PersonalApplicationFormProps {
  accountName: string;
  accountEmail: string;

  initialData?: {
    fullName: string;
    phone: string;
    dateOfBirth: string;
    gender: Gender;
    address: string;
    program: string;
  };
}

const initialState: ApplicationState = {
  success: false,
  message: "",
  errors: {},
};

export default function PersonalApplicationForm({
  accountName,
  accountEmail,
  initialData,
}: PersonalApplicationFormProps) {
  const [state, formAction, isPending] =
    useActionState(
      submitApplication,
      initialState
    );

  return (
    <form
      action={formAction}
      className="space-y-8"
    >
      {/* PERSONAL DETAILS */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6">
          <p className="text-sm font-semibold text-blue-600">
            Step 1
          </p>

          <h2 className="mt-1 text-2xl font-bold text-gray-900">
            Personal Details
          </h2>

          <p className="mt-2 text-gray-600">
            Enter your personal information and choose
            the program you want to apply for.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* FULL NAME */}
          <div className="md:col-span-2">
            <label
              htmlFor="fullName"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Full Name
            </label>

            <input
              id="fullName"
              name="fullName"
              type="text"
              defaultValue={
                initialData?.fullName ??
                accountName
              }
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            {state.errors.fullName && (
              <p className="mt-2 text-sm font-medium text-red-600">
                {state.errors.fullName[0]}
              </p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Email Address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              defaultValue={accountEmail}
              readOnly
              className="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-gray-600 outline-none"
            />

            <p className="mt-2 text-xs text-gray-500">
              This email comes from your logged-in
              account.
            </p>

            {state.errors.email && (
              <p className="mt-2 text-sm font-medium text-red-600">
                {state.errors.email[0]}
              </p>
            )}
          </div>

          {/* PHONE */}
          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Phone Number
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={
                initialData?.phone ?? ""
              }
              placeholder="+91 98765 43210"
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            {state.errors.phone && (
              <p className="mt-2 text-sm font-medium text-red-600">
                {state.errors.phone[0]}
              </p>
            )}
          </div>

          {/* DATE OF BIRTH */}
          <div>
            <label
              htmlFor="dateOfBirth"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Date of Birth
            </label>

            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              defaultValue={
                initialData?.dateOfBirth ?? ""
              }
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            {state.errors.dateOfBirth && (
              <p className="mt-2 text-sm font-medium text-red-600">
                {state.errors.dateOfBirth[0]}
              </p>
            )}
          </div>

          {/* GENDER */}
          <div>
            <label
              htmlFor="gender"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Gender
            </label>

            <select
              id="gender"
              name="gender"
              defaultValue={
                initialData?.gender ?? ""
              }
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option
                value=""
                disabled
              >
                Select gender
              </option>

              <option value="male">
                Male
              </option>

              <option value="female">
                Female
              </option>

              <option value="other">
                Other
              </option>

              <option value="prefer-not-to-say">
                Prefer not to say
              </option>
            </select>

            {state.errors.gender && (
              <p className="mt-2 text-sm font-medium text-red-600">
                {state.errors.gender[0]}
              </p>
            )}
          </div>

          {/* ADDRESS */}
          <div className="md:col-span-2">
            <label
              htmlFor="address"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Address
            </label>

            <textarea
              id="address"
              name="address"
              rows={4}
              defaultValue={
                initialData?.address ?? ""
              }
              placeholder="Enter your complete address"
              required
              className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            {state.errors.address && (
              <p className="mt-2 text-sm font-medium text-red-600">
                {state.errors.address[0]}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* PROGRAM */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6">
          <p className="text-sm font-semibold text-blue-600">
            Program
          </p>

          <h2 className="mt-1 text-2xl font-bold text-gray-900">
            Program Selection
          </h2>
        </div>

        <label
          htmlFor="program"
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          Program
        </label>

        <select
          id="program"
          name="program"
          defaultValue={
            initialData?.program ?? ""
          }
          required
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option
            value=""
            disabled
          >
            Select a program
          </option>

          {programs.map((program) => (
            <option
              key={program.slug}
              value={program.slug}
            >
              {program.name} —{" "}
              {program.fullName}
            </option>
          ))}
        </select>

        {state.errors.program && (
          <p className="mt-2 text-sm font-medium text-red-600">
            {state.errors.program[0]}
          </p>
        )}
      </section>

      {/* SERVER MESSAGE */}
      {state.message && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm font-medium ${
            state.success
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {state.message}
        </div>
      )}

      <div className="flex justify-end">
        {state.success ? (
            <Link
            href="/apply/academic"
            className="rounded-lg bg-green-600 px-8 py-3 font-semibold text-white transition hover:bg-green-700"
            >
            Continue to Academic Details →
            </Link>
        ) : (
            <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
            {isPending
                ? "Saving..."
                : initialData
                ? "Update & Continue"
                : "Save & Continue"}
            </button>
        )}
        </div>
    </form>
  );
}