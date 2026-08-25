import Link from "next/link";

import {
  count,
  eq,
} from "drizzle-orm";

import {
  applications,
} from "@/db/schema";

import { db } from "@/db";

export default async function AdminDashboardPage() {
  /*
   * TOTAL APPLICATIONS
   */
  const [totalResult] =
    await db
      .select({
        count: count(),
      })
      .from(applications);

  /*
   * SUBMITTED
   */
  const [submittedResult] =
    await db
      .select({
        count: count(),
      })
      .from(applications)
      .where(
        eq(
          applications.status,
          "submitted"
        )
      );

  /*
   * UNDER REVIEW
   */
  const [underReviewResult] =
    await db
      .select({
        count: count(),
      })
      .from(applications)
      .where(
        eq(
          applications.status,
          "under_review"
        )
      );

  /*
   * APPROVED
   */
  const [approvedResult] =
    await db
      .select({
        count: count(),
      })
      .from(applications)
      .where(
        eq(
          applications.status,
          "approved"
        )
      );

  /*
   * REJECTED
   */
  const [rejectedResult] =
    await db
      .select({
        count: count(),
      })
      .from(applications)
      .where(
        eq(
          applications.status,
          "rejected"
        )
      );

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Admin Dashboard
        </h2>

        <p className="mt-2 text-gray-600">
          Manage student applications and
          admission decisions.
        </p>
      </div>

      {/* STATISTICS */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {/* TOTAL */}
        <Link
          href="/admin/applications"
          className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            Total Applications
          </p>

          <p className="mt-3 text-4xl font-bold text-gray-900">
            {totalResult.count}
          </p>

          <p className="mt-4 text-sm font-semibold text-blue-600 opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
            View all →
          </p>
        </Link>

        {/* SUBMITTED */}
        <Link
          href="/admin/applications?status=submitted"
          className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Submitted
          </p>

          <p className="mt-3 text-4xl font-bold text-gray-900">
            {submittedResult.count}
          </p>

          <p className="mt-4 text-sm font-semibold text-blue-600 opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
            View applications →
          </p>
        </Link>

        {/* UNDER REVIEW */}
        <Link
          href="/admin/applications?status=under_review"
          className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-yellow-200 hover:shadow-md"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-yellow-600">
            Under Review
          </p>

          <p className="mt-3 text-4xl font-bold text-gray-900">
            {underReviewResult.count}
          </p>

          <p className="mt-4 text-sm font-semibold text-yellow-700 opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
            View applications →
          </p>
        </Link>

        {/* APPROVED */}
        <Link
          href="/admin/applications?status=approved"
          className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-green-200 hover:shadow-md"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
            Approved
          </p>

          <p className="mt-3 text-4xl font-bold text-gray-900">
            {approvedResult.count}
          </p>

          <p className="mt-4 text-sm font-semibold text-green-700 opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
            View applications →
          </p>
        </Link>

        {/* REJECTED */}
        <Link
          href="/admin/applications?status=rejected"
          className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-red-200 hover:shadow-md"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-red-600">
            Rejected
          </p>

          <p className="mt-3 text-4xl font-bold text-gray-900">
            {rejectedResult.count}
          </p>

          <p className="mt-4 text-sm font-semibold text-red-700 opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
            View applications →
          </p>
        </Link>
      </div>
      <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                <h3 className="text-xl font-bold text-gray-900">
                    Student Applications
                </h3>

                <p className="mt-2 text-gray-600">
                    View submitted and draft admission
                    applications.
                </p>
                </div>

                <Link
                href="/admin/applications"
                className="rounded-lg bg-blue-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
                >
                View Applications →
                </Link>
            </div>
        </section>
    </main>
  );
}