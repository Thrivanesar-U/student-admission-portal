"use server";

import {
  and,
  eq,
} from "drizzle-orm";

import {
  headers,
} from "next/headers";

import {
  revalidatePath,
} from "next/cache";

import { db } from "@/db";

import {
  applications,
  applicationStatusHistory,
} from "@/db/schema";

import { auth } from "@/lib/auth";

type AdminApplicationStatus =
  | "under_review"
  | "approved"
  | "rejected";

export async function updateApplicationStatus(
  formData: FormData
) {
  /*
   * 1. Check login.
   */
  const session =
    await auth.api.getSession({
      headers:
        await headers(),
    });

  if (!session) {
    throw new Error(
      "You must be logged in."
    );
  }

  /*
   * 2. Only admins may change
   * application status.
   */
  if (
    session.user.role !==
    "admin"
  ) {
    throw new Error(
      "Unauthorized."
    );
  }

  /*
   * 3. Read form values.
   */
  const applicationId =
    Number(
      formData.get(
        "applicationId"
      )
    );

  const requestedStatus =
    formData.get(
      "status"
    );

  /*
   * 4. Validate application ID.
   */
  if (
    !Number.isInteger(
      applicationId
    ) ||
    applicationId <= 0
  ) {
    throw new Error(
      "Invalid application ID."
    );
  }

  /*
   * 5. Validate requested status.
   */
  const allowedStatuses: AdminApplicationStatus[] =
    [
      "under_review",
      "approved",
      "rejected",
    ];

  if (
    typeof requestedStatus !==
      "string" ||
    !allowedStatuses.includes(
      requestedStatus as AdminApplicationStatus
    )
  ) {
    throw new Error(
      "Invalid application status."
    );
  }

  const nextStatus =
    requestedStatus as AdminApplicationStatus;

  /*
   * 6. Find current application status.
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
          applications.id,
          applicationId
        )
      )
      .limit(1);

  if (!application) {
    throw new Error(
      "Application not found."
    );
  }

  /*
   * 7. Define valid status transitions.
   *
   * submitted
   *   → under_review
   *
   * under_review
   *   → approved
   *   → rejected
   */
  const validTransition =
    (
      application.status ===
        "submitted" &&
      nextStatus ===
        "under_review"
    ) ||
    (
      application.status ===
        "under_review" &&
      (
        nextStatus ===
          "approved" ||
        nextStatus ===
          "rejected"
      )
    );

  if (!validTransition) {
    throw new Error(
      `Cannot change application from ${application.status} to ${nextStatus}.`
    );
  }

  /*
  * 8. Update application + create
  * audit history together.
  *
  * If either operation fails,
  * the entire transaction is rolled back.
  */
  await db.transaction(
    async (tx) => {
      const [updatedApplication] =
        await tx
          .update(applications)
          .set({
            status:
              nextStatus,

            updatedAt:
              new Date(),
          })
          .where(
            and(
              eq(
                applications.id,
                applicationId
              ),

              eq(
                applications.status,
                application.status
              )
            )
          )
          .returning({
            id:
              applications.id,
          });

      if (!updatedApplication) {
        throw new Error(
          "Application status changed before this update could be completed. Refresh and try again."
        );
      }

      /*
      * Record who changed the status,
      * what the old status was,
      * and what the new status is.
      */
      await tx
        .insert(
          applicationStatusHistory
        )
        .values({
          applicationId:
            application.id,

          adminUserId:
            session.user.id,

          fromStatus:
            application.status,

          toStatus:
            nextStatus,
        });
    }
  );

  /*
   * 9. Refresh admin pages.
   */
  revalidatePath(
    "/admin"
  );

  revalidatePath(
    "/admin/applications"
  );

  revalidatePath(
    `/admin/applications/${applicationId}`
  );
}