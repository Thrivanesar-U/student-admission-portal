"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  saveAcademicDetails,
} from "@/app/actions/academic";

import type {
  AcademicState,
} from "@/types/academic-state";

interface AcademicFormProps {
  initialData?: {
    qualificationType:
      | "higher_secondary"
      | "diploma"
      | "undergraduate"
      | "postgraduate"
      | "other";

    institutionName: string;

    boardOrUniversity: string;

    yearOfPassing: number;

    scoreType:
      | "percentage"
      | "cgpa";

    scoreValue: number;
  };
}

const initialState: AcademicState = {
  success: false,
  message: "",
  errors: {},
};

export default function AcademicForm({
  initialData,
}: AcademicFormProps) {
  const [
    state,
    formAction,
    isPending,
  ] = useActionState(
    saveAcademicDetails,
    initialState
  );

  return (
    <form
      action={formAction}
      className="space-y-8"
    >
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600">
            Step 2
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Academic Details
          </h1>

          <p className="mt-3 text-gray-600">
            Enter the details of your
            most relevant completed
            qualification.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* QUALIFICATION */}
          <div>
            <label
              htmlFor="qualificationType"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Qualification
            </label>

            <select
              id="qualificationType"
              name="qualificationType"
              required
              defaultValue={
                initialData
                  ?.qualificationType ??
                ""
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option
                value=""
                disabled
              >
                Select qualification
              </option>

              <option value="higher_secondary">
                Higher Secondary / 12th
              </option>

              <option value="diploma">
                Diploma
              </option>

              <option value="undergraduate">
                Undergraduate
              </option>

              <option value="postgraduate">
                Postgraduate
              </option>

              <option value="other">
                Other
              </option>
            </select>

            {state.errors
              .qualificationType && (
              <p className="mt-2 text-sm font-medium text-red-600">
                {
                  state.errors
                    .qualificationType[0]
                }
              </p>
            )}
          </div>

          {/* YEAR */}
          <div>
            <label
              htmlFor="yearOfPassing"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Year of Passing
            </label>

            <input
              id="yearOfPassing"
              name="yearOfPassing"
              type="number"
              min="1950"
              max={new Date().getFullYear()}
              defaultValue={
                initialData
                  ?.yearOfPassing ??
                ""
              }
              required
              placeholder="2025"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            {state.errors
              .yearOfPassing && (
              <p className="mt-2 text-sm font-medium text-red-600">
                {
                  state.errors
                    .yearOfPassing[0]
                }
              </p>
            )}
          </div>

          {/* INSTITUTION */}
          <div className="md:col-span-2">
            <label
              htmlFor="institutionName"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              School / College /
              Institution
            </label>

            <input
              id="institutionName"
              name="institutionName"
              type="text"
              required
              defaultValue={
                initialData
                  ?.institutionName ??
                ""
              }
              placeholder="Enter institution name"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            {state.errors
              .institutionName && (
              <p className="mt-2 text-sm font-medium text-red-600">
                {
                  state.errors
                    .institutionName[0]
                }
              </p>
            )}
          </div>

          {/* BOARD */}
          <div className="md:col-span-2">
            <label
              htmlFor="boardOrUniversity"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Board / University
            </label>

            <input
              id="boardOrUniversity"
              name="boardOrUniversity"
              type="text"
              required
              defaultValue={
                initialData
                  ?.boardOrUniversity ??
                ""
              }
              placeholder="CBSE / Kerala University / etc."
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            {state.errors
              .boardOrUniversity && (
              <p className="mt-2 text-sm font-medium text-red-600">
                {
                  state.errors
                    .boardOrUniversity[0]
                }
              </p>
            )}
          </div>

          {/* SCORE TYPE */}
          <div>
            <label
              htmlFor="scoreType"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Score Type
            </label>

            <select
              id="scoreType"
              name="scoreType"
              required
              defaultValue={
                initialData
                  ?.scoreType ??
                ""
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option
                value=""
                disabled
              >
                Select score type
              </option>

              <option value="percentage">
                Percentage
              </option>

              <option value="cgpa">
                CGPA
              </option>
            </select>

            {state.errors
              .scoreType && (
              <p className="mt-2 text-sm font-medium text-red-600">
                {
                  state.errors
                    .scoreType[0]
                }
              </p>
            )}
          </div>

          {/* SCORE */}
          <div>
            <label
              htmlFor="scoreValue"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Score
            </label>

            <input
              id="scoreValue"
              name="scoreValue"
              type="number"
              step="0.01"
              min="0"
              required
              defaultValue={
                initialData
                  ?.scoreValue ??
                ""
              }
              placeholder="85.50"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            {state.errors
              .scoreValue && (
              <p className="mt-2 text-sm font-medium text-red-600">
                {
                  state.errors
                    .scoreValue[0]
                }
              </p>
            )}
          </div>
        </div>
      </section>

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

      <div className="flex flex-col-reverse justify-between gap-4 sm:flex-row">
        <Link
          href="/apply"
          className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-center font-semibold text-gray-700 hover:bg-gray-50"
        >
          ← Personal Details
        </Link>

        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending
            ? "Saving..."
            : "Save Academic Details"}
        </button>
      </div>

      {state.success && (
        <div className="text-right">
          <Link
            href="/student/dashboard"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Return to Dashboard →
          </Link>
        </div>
      )}
    </form>
  );
}