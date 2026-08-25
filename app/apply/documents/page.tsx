import {
  eq,
} from "drizzle-orm";

import {
  headers,
} from "next/headers";

import {
  redirect,
} from "next/navigation";

import DocumentsForm from "@/components/application/DocumentsForm";

import {
  academicDetails,
  applications,
  documents,
} from "@/db/schema";

import { db } from "@/db";
import { auth } from "@/lib/auth";

export default async function DocumentsPage() {
  const session =
    await auth.api.getSession({
      headers:
        await headers(),
    });

  if (!session) {
    redirect("/login");
  }

  if (
    session.user.role !==
    "student"
  ) {
    redirect("/");
  }

  const [application] =
    await db
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

  if (!application) {
    redirect("/apply");
  }

  const [academic] =
    await db
      .select({
        id: academicDetails.id,
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

  if (!academic) {
    redirect(
      "/apply/academic"
    );
  }

  const uploadedDocuments =
    await db
      .select({
        id:
          documents.id,

        documentType:
          documents.documentType,

        originalName:
          documents.originalName,

        mimeType:
          documents.mimeType,

        fileSize:
          documents.fileSize,

        status:
          documents.status,
      })
      .from(documents)
      .where(
        eq(
          documents.applicationId,
          application.id
        )
      );

  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="mx-auto max-w-4xl px-6">
        <DocumentsForm
          documents={
            uploadedDocuments
          }
          readOnly={
            application.status !== "draft"
          }
        />
      </div>
    </main>
  );
}