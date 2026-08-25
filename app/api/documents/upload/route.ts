import {
  randomUUID,
} from "node:crypto";

import {
  mkdir,
  unlink,
  writeFile,
} from "node:fs/promises";

import {
  join,
} from "node:path";

import {
  fileTypeFromBuffer,
} from "file-type";

import {
  and,
  eq,
} from "drizzle-orm";

import {
  academicDetails,
  applications,
  documents,
} from "@/db/schema";

import { db } from "@/db";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

const MAX_FILE_SIZE =
  5 * 1024 * 1024;

const DOCUMENT_TYPES = [
  "photo",
  "id_proof",
  "class_10_certificate",
  "class_12_certificate",
  "transfer_certificate",
  "other",
] as const;

type DocumentType =
  (typeof DOCUMENT_TYPES)[number];

function isDocumentType(
  value: unknown
): value is DocumentType {
  return (
    typeof value === "string" &&
    DOCUMENT_TYPES.includes(
      value as DocumentType
    )
  );
}

function isAllowedFile(
  documentType: DocumentType,
  mime: string
) {
  if (documentType === "photo") {
    return (
      mime === "image/jpeg" ||
      mime === "image/png"
    );
  }

  return (
    mime === "application/pdf" ||
    mime === "image/jpeg" ||
    mime === "image/png"
  );
}

export async function POST(
  request: Request
) {
  /*
   * SECURITY 1:
   * verify session
   */
  const session =
    await auth.api.getSession({
      headers: request.headers,
    });

  if (!session) {
    return Response.json(
      {
        error:
          "You must be logged in.",
      },
      {
        status: 401,
      }
    );
  }

  /*
   * SECURITY 2:
   * only students upload
   */
  if (
    session.user.role !==
    "student"
  ) {
    return Response.json(
      {
        error:
          "Only students can upload documents.",
      },
      {
        status: 403,
      }
    );
  }

  /*
   * READ MULTIPART FORM
   */
  const formData =
    await request.formData();

  const documentType =
    formData.get(
      "documentType"
    );

  const file =
    formData.get("file");

  if (
    !isDocumentType(
      documentType
    )
  ) {
    return Response.json(
      {
        error:
          "Invalid document type.",
      },
      {
        status: 400,
      }
    );
  }

  if (!(file instanceof File)) {
    return Response.json(
      {
        error:
          "Select a file to upload.",
      },
      {
        status: 400,
      }
    );
  }

  /*
   * FILE SIZE VALIDATION
   */
  if (file.size === 0) {
    return Response.json(
      {
        error:
          "The selected file is empty.",
      },
      {
        status: 400,
      }
    );
  }

  if (
    file.size >
    MAX_FILE_SIZE
  ) {
    return Response.json(
      {
        error:
          "Maximum file size is 5 MB.",
      },
      {
        status: 400,
      }
    );
  }

  if (
    file.name.length > 255
  ) {
    return Response.json(
      {
        error:
          "File name is too long.",
      },
      {
        status: 400,
      }
    );
  }

  /*
   * READ FILE BYTES
   */
  const buffer =
    new Uint8Array(
      await file.arrayBuffer()
    );

  /*
   * REAL FILE-TYPE DETECTION
   */
  const detectedType =
    await fileTypeFromBuffer(
      buffer
    );

  if (!detectedType) {
    return Response.json(
      {
        error:
          "Could not determine the file type.",
      },
      {
        status: 400,
      }
    );
  }

  if (
    !isAllowedFile(
      documentType,
      detectedType.mime
    )
  ) {
    return Response.json(
      {
        error:
          documentType ===
          "photo"
            ? "Photo must be a JPG or PNG image."
            : "Documents must be PDF, JPG, or PNG files.",
      },
      {
        status: 400,
      }
    );
  }

  /*
   * OWNERSHIP:
   * Find application belonging
   * to logged-in student.
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
    return Response.json(
      {
        error:
          "Complete Step 1 first.",
      },
      {
        status: 400,
      }
    );
  }

  /*
  * LOCK SUBMITTED APPLICATION
  */
  if (
    application.status !==
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

  /*
   * WORKFLOW:
   * Academic details must exist
   * before documents.
   */
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
    return Response.json(
      {
        error:
          "Complete Academic Details first.",
      },
      {
        status: 400,
      }
    );
  }

  /*
   * Check whether this document
   * type already exists.
   */
  const [existingDocument] =
    await db
      .select({
        id: documents.id,

        storagePath:
          documents.storagePath,
      })
      .from(documents)
      .where(
        and(
          eq(
            documents.applicationId,
            application.id
          ),
          eq(
            documents.documentType,
            documentType
          )
        )
      )
      .limit(1);

  /*
   * We NEVER use original file name
   * as the real stored filename.
   */
  const storedName =
    `${documentType}-${randomUUID()}.${detectedType.ext}`;

  const relativeDirectory =
    join(
      "storage",
      "applications",
      String(application.id),
      "documents"
    );

  const relativePath =
    join(
      relativeDirectory,
      storedName
    );

  const absoluteDirectory =
    join(
      process.cwd(),
      relativeDirectory
    );

  const absolutePath =
    join(
      process.cwd(),
      relativePath
    );

  await mkdir(
    absoluteDirectory,
    {
      recursive: true,
    }
  );

  /*
   * Save new file first.
   */
  await writeFile(
    absolutePath,
    buffer
  );

  try {
    let documentId: number;

    /*
     * REPLACE existing document
     */
    if (existingDocument) {
      const [updated] =
        await db
          .update(documents)
          .set({
            originalName:
              file.name,

            storedName,

            storagePath:
              relativePath,

            mimeType:
              detectedType.mime,

            fileSize:
              file.size,

            status:
              "uploaded",

            updatedAt:
              new Date(),
          })
          .where(
            eq(
              documents.id,
              existingDocument.id
            )
          )
          .returning({
            id: documents.id,
          });

      documentId =
        updated.id;

      /*
       * Database successfully points
       * to new file. Remove old file.
       */
      if (
        existingDocument
          .storagePath !==
        relativePath
      ) {
        try {
          await unlink(
            join(
              process.cwd(),
              existingDocument
                .storagePath
            )
          );
        } catch {
          /*
           * Old file might already
           * be absent. Database is
           * still correct.
           */
        }
      }
    } else {
      /*
       * INSERT first document
       */
      const [inserted] =
        await db
          .insert(documents)
          .values({
            applicationId:
              application.id,

            documentType,

            originalName:
              file.name,

            storedName,

            storagePath:
              relativePath,

            mimeType:
              detectedType.mime,

            fileSize:
              file.size,
          })
          .returning({
            id: documents.id,
          });

      documentId =
        inserted.id;
    }

    return Response.json({
      success: true,

      documentId,

      message:
        existingDocument
          ? "Document replaced successfully."
          : "Document uploaded successfully.",
    });
  } catch (error) {
    /*
     * Database failed.
     * Don't leave orphan file.
     */
    try {
      await unlink(
        absolutePath
      );
    } catch {
      // Nothing else to do.
    }

    console.error(
      "Document upload failed:",
      error
    );

    return Response.json(
      {
        error:
          "Unable to save the document.",
      },
      {
        status: 500,
      }
    );
  }
}