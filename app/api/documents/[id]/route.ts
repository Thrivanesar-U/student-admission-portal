import {
  readFile,
  unlink,
} from "node:fs/promises";

import {
  resolve,
  sep,
} from "node:path";

import {
  and,
  eq,
} from "drizzle-orm";

import {
  applications,
  documents,
} from "@/db/schema";

import { db } from "@/db";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

async function findOwnedDocument(
  documentId: number,
  userId: string
) {
  const [document] =
    await db
      .select({
        id: documents.id,

        originalName:
          documents.originalName,

        storagePath:
          documents.storagePath,

        mimeType:
          documents.mimeType,

        /*
         * NEW:
         * We need the application status
         * so DELETE can check whether
         * the application is locked.
         */
        applicationStatus:
          applications.status,
      })
      .from(documents)
      .innerJoin(
        applications,
        eq(
          documents.applicationId,
          applications.id
        )
      )
      .where(
        and(
          eq(
            documents.id,
            documentId
          ),

          eq(
            applications.userId,
            userId
          )
        )
      )
      .limit(1);

  return document;
}

async function findViewableDocument(
  documentId: number,
  userId: string,
  role: string
) {
  /*
   * ADMIN
   *
   * Admins may view any document.
   */
  if (role === "admin") {
    const [document] =
      await db
        .select({
          id:
            documents.id,

          originalName:
            documents.originalName,

          storagePath:
            documents.storagePath,

          mimeType:
            documents.mimeType,

          applicationStatus:
            applications.status,
        })
        .from(documents)
        .innerJoin(
          applications,
          eq(
            documents.applicationId,
            applications.id
          )
        )
        .where(
          eq(
            documents.id,
            documentId
          )
        )
        .limit(1);

    return document;
  }

  /*
   * STUDENT
   *
   * Students may only view documents
   * belonging to their own application.
   */
  return findOwnedDocument(
    documentId,
    userId
  );
}

function getSafeAbsolutePath(
  storagePath: string
) {
  const storageRoot =
    resolve(
      process.cwd(),
      "storage"
    );

  const absolutePath =
    resolve(
      process.cwd(),
      storagePath
    );

  /*
   * Prevent path traversal.
   */
  if (
    !absolutePath.startsWith(
      `${storageRoot}${sep}`
    )
  ) {
    throw new Error(
      "Invalid storage path."
    );
  }

  return absolutePath;
}

/*
 * VIEW DOCUMENT
 *
 * Submitted documents can still
 * be VIEWED.
 */
export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  const session =
    await auth.api.getSession({
      headers: request.headers,
    });

  if (
    !session ||
    (
      session.user.role !== "student" &&
      session.user.role !== "admin"
    )
  ) {
    return new Response(
      "Unauthorized",
      {
        status: 401,
      }
    );
  }

  const { id } =
    await params;

  const documentId =
    Number(id);

  if (
    !Number.isInteger(
      documentId
    ) ||
    documentId <= 0
  ) {
    return new Response(
      "Invalid document ID.",
      {
        status: 400,
      }
    );
  }

  const document =
    await findViewableDocument(
      documentId,
      session.user.id,
      session.user.role
    );

  if (!document) {
    return new Response(
      "Document not found.",
      {
        status: 404,
      }
    );
  }

  try {
    const absolutePath =
      getSafeAbsolutePath(
        document.storagePath
      );

    const file =
      await readFile(
        absolutePath
      );

    const safeName =
      document.originalName.replace(
        /["\r\n]/g,
        "_"
      );

    return new Response(
      new Uint8Array(file),
      {
        headers: {
          "Content-Type":
            document.mimeType,

          "Content-Disposition":
            `inline; filename="${safeName}"`,

          "Cache-Control":
            "private, no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "Unable to read document:",
      error
    );

    return new Response(
      "Document file not found.",
      {
        status: 404,
      }
    );
  }
}

/*
 * DELETE DOCUMENT
 *
 * Only allowed while application
 * status === draft.
 */
export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  const session =
    await auth.api.getSession({
      headers: request.headers,
    });

  if (
    !session ||
    session.user.role !==
      "student"
  ) {
    return Response.json(
      {
        error:
          "Unauthorized.",
      },
      {
        status: 401,
      }
    );
  }

  const { id } =
    await params;

  const documentId =
    Number(id);

  if (
    !Number.isInteger(
      documentId
    ) ||
    documentId <= 0
  ) {
    return Response.json(
      {
        error:
          "Invalid document ID.",
      },
      {
        status: 400,
      }
    );
  }

  const document =
    await findOwnedDocument(
      documentId,
      session.user.id
    );

  if (!document) {
    return Response.json(
      {
        error:
          "Document not found.",
      },
      {
        status: 404,
      }
    );
  }

  /*
   * NEW:
   * Submitted/under-review/etc.
   * applications cannot change
   * documents.
   */
  if (
    document.applicationStatus !==
    "draft"
  ) {
    return Response.json(
      {
        error:
          "Submitted applications cannot be modified.",
      },
      {
        status: 409,
      }
    );
  }

  try {
    const absolutePath =
      getSafeAbsolutePath(
        document.storagePath
      );

    try {
      await unlink(
        absolutePath
      );
    } catch {
      /*
       * File may already be absent.
       */
    }

    await db
      .delete(documents)
      .where(
        eq(
          documents.id,
          document.id
        )
      );

    return Response.json({
      success: true,
      message:
        "Document removed.",
    });
  } catch (error) {
    console.error(
      "Unable to delete document:",
      error
    );

    return Response.json(
      {
        error:
          "Unable to delete document.",
      },
      {
        status: 500,
      }
    );
  }
}