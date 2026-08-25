"use server";

import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import * as z from "zod";

import { programs } from "@/data/programs";
import { db } from "@/db";
import { applications } from "@/db/schema";
import { auth } from "@/lib/auth";

import type { ApplicationState } from "@/types/application-state";

const ApplicationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, {
      error: "Full name must contain at least 2 characters.",
    })
    .max(100, {
      error: "Full name is too long.",
    }),

  email: z.email({
    error: "Enter a valid email address.",
  }),

  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9][0-9\s-]{8,14}$/, {
      error: "Enter a valid phone number.",
    }),

  dateOfBirth: z.iso.date({
    error: "Enter a valid date of birth.",
  }),

  gender: z.enum(
    ["male", "female", "other", "prefer-not-to-say"],
    {
      error: "Select a valid gender.",
    }
  ),

  address: z
    .string()
    .trim()
    .min(10, {
      error: "Address must contain at least 10 characters.",
    })
    .max(500, {
      error: "Address is too long.",
    }),

  program: z.string().refine(
    (value) =>
      programs.some(
        (program) => program.slug === value
      ),
    {
      error: "Select a valid program.",
    }
  ),
});

export async function submitApplication(
  _previousState: ApplicationState,
  formData: FormData
): Promise<ApplicationState> {
  /*
   * AUTHENTICATION
   */
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      message:
        "You must be logged in before submitting an application.",
      errors: {},
    };
  }

  /*
   * AUTHORIZATION
   */
  if (session.user.role !== "student") {
    return {
      success: false,
      message:
        "Your account is not allowed to submit student applications.",
      errors: {},
    };
  }

  /*
   * VALIDATE FORM DATA
   */
  const validatedFields = ApplicationSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    dateOfBirth: formData.get("dateOfBirth"),
    gender: formData.get("gender"),
    address: formData.get("address"),
    program: formData.get("program"),
  });

  if (!validatedFields.success) {
    const flattenedErrors = z.flattenError(
      validatedFields.error
    );

    return {
      success: false,
      message:
        "Please correct the highlighted fields.",
      errors: flattenedErrors.fieldErrors,
    };
  }

  const applicationData = validatedFields.data;

  /*
   * EMAIL MUST MATCH LOGGED-IN USER
   */
  if (
    applicationData.email.toLowerCase() !==
    session.user.email.toLowerCase()
  ) {
    return {
      success: false,
      message:
        "Please correct the highlighted fields.",
      errors: {
        email: [
          "Use the same email address as your logged-in account.",
        ],
      },
    };
  }

  try {
    /*
     * existingApplication is DECLARED HERE.
     *
     * Therefore every use of existingApplication
     * must be BELOW this statement.
     */
    const [existingApplication] = await db
      .select({
        id: applications.id,
        status: applications.status,
      })
      .from(applications)
      .where(
        eq(
          applications.userId,
          session.user.id
        )
      )
      .limit(1);

    /*
     * LOCK NON-DRAFT APPLICATIONS
     */
    if (
      existingApplication &&
      existingApplication.status !== "draft"
    ) {
      return {
        success: false,
        message:
          "Submitted applications cannot be edited.",
        errors: {},
      };
    }

    /*
     * UPDATE EXISTING DRAFT APPLICATION
     */
    if (existingApplication) {
      const [updatedApplication] = await db
        .update(applications)
        .set({
          fullName:
            applicationData.fullName,

          email:
            session.user.email,

          phone:
            applicationData.phone,

          dateOfBirth:
            applicationData.dateOfBirth,

          gender:
            applicationData.gender,

          address:
            applicationData.address,

          programSlug:
            applicationData.program,

          updatedAt:
            new Date(),
        })
        .where(
          eq(
            applications.id,
            existingApplication.id
          )
        )
        .returning({
          id: applications.id,
        });

      return {
        success: true,
        message:
          `Application updated successfully. Application ID: ${updatedApplication.id}`,
        errors: {},
      };
    }

    /*
     * CREATE FIRST APPLICATION
     */
    const [insertedApplication] = await db
      .insert(applications)
      .values({
        userId:
          session.user.id,

        fullName:
          applicationData.fullName,

        email:
          session.user.email,

        phone:
          applicationData.phone,

        dateOfBirth:
          applicationData.dateOfBirth,

        gender:
          applicationData.gender,

        address:
          applicationData.address,

        programSlug:
          applicationData.program,
      })
      .returning({
        id: applications.id,
      });

    return {
      success: true,
      message:
        `Application saved successfully. Application ID: ${insertedApplication.id}`,
      errors: {},
    };
  } catch (error) {
    console.error(
      "Failed to save application:",
      error
    );

    return {
      success: false,
      message:
        "Something went wrong while saving your application. Please try again.",
      errors: {},
    };
  }
}