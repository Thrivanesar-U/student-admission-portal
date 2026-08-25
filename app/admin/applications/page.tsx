import {
  and,
  count,
  desc,
  eq,
  ilike,
  or,
} from "drizzle-orm";

import Link from "next/link";

import {
  applications,
} from "@/db/schema";

import { db } from "@/db";

import {
  programs,
} from "@/data/programs";

/*
 * All possible application statuses.
 */
type ApplicationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected";

const applicationStatuses: ApplicationStatus[] = [
  "draft",
  "submitted",
  "under_review",
  "approved",
  "rejected",
];

interface AdminApplicationsPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    program?: string;
    page?: string;
  }>;
}

export default async function AdminApplicationsPage({
  searchParams,
}: AdminApplicationsPageProps) {
  /*
   * Read filters from URL.
   *
   * Example:
   *
   * /admin/applications
   * ?search=Rani
   * &status=approved
   * &program=bba
   */
  const PAGE_SIZE = 1;

  const params =
    await searchParams;

  const search =
    params.search?.trim() ?? "";

  const requestedStatus =
    params.status ?? "all";

  const requestedProgram =
    params.program ?? "all";

  /*
   * Validate status.
   */
  const status:
    | ApplicationStatus
    | "all" =
    applicationStatuses.includes(
      requestedStatus as ApplicationStatus
    )
      ? (requestedStatus as ApplicationStatus)
      : "all";

  /*
   * Validate program.
   */
  const program =
    programs.some(
      (item) =>
        item.slug ===
        requestedProgram
    )
      ? requestedProgram
      : "all";

  const whereCondition =
    and(
      search
        ? or(
            ilike(
              applications.fullName,
              `%${search}%`
            ),
            ilike(
              applications.email,
              `%${search}%`
            )
          )
        : undefined,

      status !== "all"
        ? eq(
            applications.status,
            status
          )
        : undefined,

      program !== "all"
        ? eq(
            applications.programSlug,
            program
          )
        : undefined
    );
  
  const [totalResult] =
    await db
      .select({
        count: count(),
      })
      .from(applications)
      .where(whereCondition);

  const totalApplications =
    totalResult.count;

  const requestedPage =
    Number(params.page ?? "1");

  const safeRequestedPage =
    Number.isInteger(requestedPage) &&
    requestedPage > 0
      ? requestedPage
      : 1;
  
  const totalPages =
    Math.max(
      1,
      Math.ceil(
        totalApplications /
          PAGE_SIZE
      )
    );
  const currentPage =
    Math.min(
      safeRequestedPage,
      totalPages
    );

  const offset =
    (currentPage - 1) *
    PAGE_SIZE;

  /*
   * Load applications using the
   * selected filters.
   */
  const applicationList =
    await db
      .select({
        id:
          applications.id,

        fullName:
          applications.fullName,

        email:
          applications.email,

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
      .where(whereCondition)
      .orderBy(
        desc(
          applications.updatedAt
        )
      )
      .limit(PAGE_SIZE)
      .offset(offset);
    
    function getPageHref(
      pageNumber: number
    ) {
      const query =
        new URLSearchParams();

      if (search) {
        query.set(
          "search",
          search
        );
      }

      if (status !== "all") {
        query.set(
          "status",
          status
        );
      }

      if (program !== "all") {
        query.set(
          "program",
          program
        );
      }

      query.set(
        "page",
        String(pageNumber)
      );

      return `/admin/applications?${query.toString()}`;
    }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Admin Portal
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            Applications
          </h2>

          <p className="mt-2 text-gray-600">
            Review and manage student admission
            applications.
          </p>
        </div>

        <Link
          href="/admin"
          className="font-semibold text-blue-600 hover:text-blue-700"
        >
          ← Dashboard
        </Link>
      </div>

      {/* SEARCH + FILTERS */}
      <form
        method="GET"
        className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-4">
          {/* SEARCH */}
          <div className="md:col-span-2">
            <label
              htmlFor="search"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Search Student
            </label>

            <input
              id="search"
              name="search"
              type="search"
              defaultValue={
                search
              }
              placeholder="Name or email..."
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* STATUS */}
          <div>
            <label
              htmlFor="status"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Status
            </label>

            <select
              id="status"
              name="status"
              defaultValue={
                status
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">
                All Statuses
              </option>

              <option value="draft">
                Draft
              </option>

              <option value="submitted">
                Submitted
              </option>

              <option value="under_review">
                Under Review
              </option>

              <option value="approved">
                Approved
              </option>

              <option value="rejected">
                Rejected
              </option>
            </select>
          </div>

          {/* PROGRAM */}
          <div>
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
                program
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">
                All Programs
              </option>

              {programs.map(
                (item) => (
                  <option
                    key={
                      item.slug
                    }
                    value={
                      item.slug
                    }
                  >
                    {item.name}
                  </option>
                )
              )}
            </select>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Apply Filters
          </button>

          <Link
            href="/admin/applications"
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-center font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Clear Filters
          </Link>
        </div>
      </form>

      {/* RESULT COUNT */}
      <div className="mt-6">
        <p className="text-sm text-gray-600">
          {totalApplications > 0 ? (
            <>
              Showing{" "}
              <span className="font-bold text-gray-900">
                {offset + 1}
              </span>
              {" – "}
              <span className="font-bold text-gray-900">
                {Math.min(
                  offset +
                    applicationList.length,
                  totalApplications
                )}
              </span>
              {" of "}
              <span className="font-bold text-gray-900">
                {totalApplications}
              </span>{" "}
              applications
            </>
          ) : (
            "No applications found"
          )}
        </p>
      </div>

      {/* NO RESULTS */}
      {applicationList.length ===
      0 ? (
        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h3 className="text-xl font-bold text-gray-900">
            No Applications Found
          </h3>

          <p className="mt-2 text-gray-600">
            No applications match the
            selected search or filters.
          </p>

          <Link
            href="/admin/applications"
            className="mt-5 inline-block font-semibold text-blue-600 hover:text-blue-700"
          >
            Clear Filters →
          </Link>
        </section>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {/* DESKTOP TABLE */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Application
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Student
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Program
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Submitted
                  </th>

                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {applicationList.map(
                  (
                    application
                  ) => {
                    const selectedProgram =
                      programs.find(
                        (
                          program
                        ) =>
                          program.slug ===
                          application.programSlug
                      );

                    return (
                      <tr
                        key={
                          application.id
                        }
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-5">
                          <p className="font-bold text-gray-900">
                            #
                            {
                              application.id
                            }
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <p className="font-semibold text-gray-900">
                            {
                              application.fullName
                            }
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            {
                              application.email
                            }
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <p className="font-medium text-gray-900">
                            {selectedProgram
                              ? selectedProgram.name
                              : application.programSlug}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <StatusBadge
                            status={
                              application.status
                            }
                          />
                        </td>

                        <td className="px-6 py-5 text-sm text-gray-600">
                          {application.submittedAt
                            ? application.submittedAt.toLocaleDateString(
                                "en-IN",
                                {
                                  dateStyle:
                                    "medium",
                                }
                              )
                            : "Not submitted"}
                        </td>

                        <td className="px-6 py-5 text-right">
                          <Link
                            href={`/admin/applications/${application.id}`}
                            className="font-semibold text-blue-600 hover:text-blue-700"
                          >
                            Review
                            Application →
                          </Link>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>

          {/* MOBILE */}
          <div className="divide-y divide-gray-100 md:hidden">
            {applicationList.map(
              (
                application
              ) => {
                const selectedProgram =
                  programs.find(
                    (
                      program
                    ) =>
                      program.slug ===
                      application.programSlug
                  );

                return (
                  <div
                    key={
                      application.id
                    }
                    className="p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-500">
                          Application #
                          {
                            application.id
                          }
                        </p>

                        <h3 className="mt-1 text-lg font-bold text-gray-900">
                          {
                            application.fullName
                          }
                        </h3>

                        <p className="mt-1 text-sm text-gray-600">
                          {
                            application.email
                          }
                        </p>
                      </div>

                      <StatusBadge
                        status={
                          application.status
                        }
                      />
                    </div>

                    <div className="mt-5 space-y-2 text-sm">
                      <p className="text-gray-600">
                        <span className="font-semibold text-gray-800">
                          Program:
                        </span>{" "}
                        {selectedProgram
                          ? selectedProgram.name
                          : application.programSlug}
                      </p>

                      <p className="text-gray-600">
                        <span className="font-semibold text-gray-800">
                          Submitted:
                        </span>{" "}
                        {application.submittedAt
                          ? application.submittedAt.toLocaleDateString(
                              "en-IN",
                              {
                                dateStyle:
                                  "medium",
                              }
                            )
                          : "Not submitted"}
                      </p>
                    </div>

                    <Link
                      href={`/admin/applications/${application.id}`}
                      className="mt-5 inline-block font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Review
                      Application →
                    </Link>
                  </div>
                );
              }
            )}
          </div>
          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 bg-gray-50 px-6 py-4 sm:flex-row">
              <p className="text-sm text-gray-600">
                Page{" "}
                <span className="font-semibold text-gray-900">
                  {currentPage}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                  {totalPages}
                </span>
              </p>

              <div className="flex items-center gap-2">
                {currentPage > 1 ? (
                  <Link
                    href={getPageHref(
                      currentPage - 1
                    )}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                  >
                    ← Previous
                  </Link>
                ) : (
                  <span className="cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-400">
                    ← Previous
                  </span>
                )}

                {Array.from(
                  {
                    length:
                      totalPages,
                  },
                  (_, index) =>
                    index + 1
                ).map(
                  (pageNumber) => (
                    <Link
                      key={
                        pageNumber
                      }
                      href={getPageHref(
                        pageNumber
                      )}
                      className={
                        pageNumber ===
                        currentPage
                          ? "rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                          : "rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                      }
                    >
                      {pageNumber}
                    </Link>
                  )
                )}

                {currentPage <
                totalPages ? (
                  <Link
                    href={getPageHref(
                      currentPage + 1
                    )}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                  >
                    Next →
                  </Link>
                ) : (
                  <span className="cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-400">
                    Next →
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}

/*
 * STATUS BADGE
 */
function StatusBadge({
  status,
}: {
  status:
    ApplicationStatus;
}) {
  const styles: Record<
    ApplicationStatus,
    string
  > = {
    draft:
      "bg-gray-100 text-gray-700",

    submitted:
      "bg-blue-100 text-blue-700",

    under_review:
      "bg-yellow-100 text-yellow-800",

    approved:
      "bg-green-100 text-green-700",

    rejected:
      "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${styles[status]}`}
    >
      {status.replaceAll(
        "_",
        " "
      )}
    </span>
  );
}