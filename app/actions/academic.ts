"use server";

import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import * as z from "zod";

import {
  academicDetails,
  applications,
} from "@/db/schema";

import { db } from "@/db";
import { auth } from "@/lib/auth";

import type { AcademicState } from "@/types/academic-state";

const currentYear =
  new Date().getFullYear();

const AcademicSchema = z
  .object({
    qualificationType: z.enum(
      [
        "higher_secondary",
        "diploma",
        "undergraduate",
        "postgraduate",
        "other",
      ],
      {
        error:
          "Select your qualification.",
      }
    ),

    institutionName: z
      .string()
      .trim()
      .min(2, {
        error:
          "Enter your institution name.",
      })
      .max(200, {
        error:
          "Institution name is too long.",
      }),

    boardOrUniversity: z
      .string()
      .trim()
      .min(2, {
        error:
          "Enter your board or university.",
      })
      .max(200, {
        error:
          "Board or university name is too long.",
      }),

    yearOfPassing: z.coerce
      .number()
      .int()
      .min(1950, {
        error:
          "Enter a valid year.",
      })
      .max(currentYear, {
        error:
          "Year of passing cannot be in the future.",
      }),

    scoreType: z.enum(
      [
        "percentage",
        "cgpa",
      ],
      {
        error:
          "Select your score type.",
      }
    ),

    scoreValue: z.coerce
      .number()
      .positive({
        error:
          "Enter a valid score.",
      }),
  })
  .superRefine(
    (data, context) => {
      if (
        data.scoreType ===
          "percentage" &&
        data.scoreValue > 100
      ) {
        context.addIssue({
          code: "custom",
          path: ["scoreValue"],
          message:
            "Percentage cannot be greater than 100.",
        });
      }

      if (
        data.scoreType ===
          "cgpa" &&
        data.scoreValue > 10
      ) {
        context.addIssue({
          code: "custom",
          path: ["scoreValue"],
          message:
            "CGPA cannot be greater than 10.",
        });
      }
    }
  );

export async function saveAcademicDetails(
  _previousState: AcademicState,
  formData: FormData
): Promise<AcademicState> {
  /*
   * AUTHENTICATION
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
   * AUTHORIZATION
   */
  if (
    session.user.role !==
    "student"
  ) {
    return {
      success: false,
      message:
        "Only students can update academic details.",
      errors: {},
    };
  }

  /*
   * VALIDATION
   */
  const validatedFields =
    AcademicSchema.safeParse({
      qualificationType:
        formData.get(
          "qualificationType"
        ),

      institutionName:
        formData.get(
          "institutionName"
        ),

      boardOrUniversity:
        formData.get(
          "boardOrUniversity"
        ),

      yearOfPassing:
        formData.get(
          "yearOfPassing"
        ),

      scoreType:
        formData.get(
          "scoreType"
        ),

      scoreValue:
        formData.get(
          "scoreValue"
        ),
    });

  if (
    !validatedFields.success
  ) {
    const flattenedErrors =
      z.flattenError(
        validatedFields.error
      );

    return {
      success: false,

      message:
        "Please correct the highlighted fields.",

      errors:
        flattenedErrors.fieldErrors,
    };
  }

  const data =
    validatedFields.data;

  /*
   * FIND APPLICATION
   *
   * IMPORTANT:
   * Get status as well.
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
        "Complete your personal application details first.",

      errors: {},
    };
  }

  /*
   * LOCK SUBMITTED APPLICATION
   */
  if (
    application.status !==
    "draft"
  ) {
    return {
      success: false,

      message:
        "Submitted applications cannot be edited.",

      errors: {},
    };
  }

  try {
    /*
     * FIND EXISTING ACADEMIC RECORD
     */
    const [existingAcademicDetails] =
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

    /*
     * UPDATE
     */
    if (
      existingAcademicDetails
    ) {
      await db
        .update(
          academicDetails
        )
        .set({
          qualificationType:
            data.qualificationType,

          institutionName:
            data.institutionName,

          boardOrUniversity:
            data.boardOrUniversity,

          yearOfPassing:
            data.yearOfPassing,

          scoreType:
            data.scoreType,

          scoreValue:
            data.scoreValue,

          updatedAt:
            new Date(),
        })
        .where(
          eq(
            academicDetails.id,
            existingAcademicDetails.id
          )
        );

      return {
        success: true,

        message:
          "Academic details updated successfully.",

        errors: {},
      };
    }

    /*
     * INSERT
     */
    await db
      .insert(
        academicDetails
      )
      .values({
        applicationId:
          application.id,

        qualificationType:
          data.qualificationType,

        institutionName:
          data.institutionName,

        boardOrUniversity:
          data.boardOrUniversity,

        yearOfPassing:
          data.yearOfPassing,

        scoreType:
          data.scoreType,

        scoreValue:
          data.scoreValue,
      });

    return {
      success: true,

      message:
        "Academic details saved successfully.",

      errors: {},
    };
  } catch (error) {
    console.error(
      "Failed to save academic details:",
      error
    );

    return {
      success: false,

      message:
        "Something went wrong while saving your academic details.",

      errors: {},
    };
  }
}