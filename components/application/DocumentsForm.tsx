"use client";

import Link from "next/link";
import {
  useRouter,
} from "next/navigation";

import {
  FormEvent,
  useState,
} from "react";

type DocumentType =
  | "photo"
  | "id_proof"
  | "class_10_certificate"
  | "class_12_certificate"
  | "transfer_certificate"
  | "other";

interface UploadedDocument {
  id: number;

  documentType:
    DocumentType;

  originalName:
    string;

  mimeType:
    string;

  fileSize:
    number;

  status:
    "uploaded"
    | "verified"
    | "rejected";
}

interface DocumentsFormProps {
  documents:
    UploadedDocument[];
  readOnly: boolean;
}

const documentSlots: {
  type: DocumentType;
  label: string;
  description: string;
  required: boolean;
}[] = [
  {
    type: "photo",
    label:
      "Passport-size Photo",
    description:
      "JPG or PNG, maximum 5 MB.",
    required: true,
  },
  {
    type: "id_proof",
    label:
      "Identity Proof",
    description:
      "Aadhaar/passport/other accepted ID. PDF, JPG or PNG.",
    required: true,
  },
  {
    type:
      "class_10_certificate",
    label:
      "10th Certificate",
    description:
      "Upload your Class 10 certificate or marksheet.",
    required: true,
  },
  {
    type:
      "class_12_certificate",
    label:
      "12th Certificate",
    description:
      "Upload your Class 12 certificate or marksheet.",
    required: true,
  },
  {
    type:
      "transfer_certificate",
    label:
      "Transfer Certificate",
    description:
      "Optional for now.",
    required: false,
  },
  {
    type: "other",
    label:
      "Other Supporting Document",
    description:
      "Optional additional document.",
    required: false,
  },
];

function formatFileSize(
  bytes: number
) {
  if (
    bytes <
    1024 * 1024
  ) {
    return `${(
      bytes / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(2)} MB`;
}

export default function DocumentsForm({
  documents,
  readOnly,
}: DocumentsFormProps) {
  const router =
    useRouter();

  const [
    busyType,
    setBusyType,
  ] =
    useState<
      DocumentType | null
    >(null);

  const [
    message,
    setMessage,
  ] =
    useState("");

  const [
    error,
    setError,
  ] =
    useState("");

  const requiredTypes =
    documentSlots
      .filter(
        (slot) =>
          slot.required
      )
      .map(
        (slot) => slot.type
      );

  const completedRequired =
    requiredTypes.filter(
      (type) =>
        documents.some(
          (document) =>
            document.documentType ===
            type
        )
    ).length;

  const allRequiredUploaded =
    completedRequired === requiredTypes.length;

  async function handleUpload(
    event:
      FormEvent<HTMLFormElement>,
    documentType:
      DocumentType
  ) {
    event.preventDefault();

    setMessage("");
    setError("");
    setBusyType(
      documentType
    );

    const form =
      event.currentTarget;

    const formData =
      new FormData(form);

    formData.set(
      "documentType",
      documentType
    );

    try {
      const response =
        await fetch(
          "/api/documents/upload",
          {
            method: "POST",
            body: formData,
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        setError(
          result.error ??
            "Upload failed."
        );

        return;
      }

      setMessage(
        result.message
      );

      form.reset();

      router.refresh();
    } catch {
      setError(
        "Unable to upload the document."
      );
    } finally {
      setBusyType(null);
    }
  }

  async function handleDelete(
    documentId: number
  ) {
    setMessage("");
    setError("");

    const confirmed =
      window.confirm(
        "Remove this document?"
      );

    if (!confirmed) {
      return;
    }

    try {
      const response =
        await fetch(
          `/api/documents/${documentId}`,
          {
            method:
              "DELETE",
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        setError(
          result.error ??
            "Unable to remove document."
        );

        return;
      }

      setMessage(
        "Document removed."
      );

      router.refresh();
    } catch {
      setError(
        "Unable to remove document."
      );
    }
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-semibold text-blue-600">
          Step 3
        </p>

        <h1 className="mt-1 text-3xl font-bold text-gray-900">
          Documents
        </h1>

        <p className="mt-3 text-gray-600">
          Upload the documents required
          for your admission application.
        </p>
        {readOnly && (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4">
            <p className="font-semibold text-green-800">
              ✓ Application Submitted
            </p>

            <p className="mt-1 text-sm text-green-700">
              Your documents are now read-only.
              You can view uploaded files, but
              they can no longer be replaced or removed.
            </p>
          </div>
        )}

        <div className="mt-6 rounded-xl bg-blue-50 p-4">
          <p className="font-semibold text-blue-900">
            Required documents:{" "}
            {completedRequired}/
            {requiredTypes.length}
          </p>
        </div>
      </section>

      {message && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {documentSlots.map(
          (slot) => {
            const uploaded =
              documents.find(
                (document) =>
                  document.documentType ===
                  slot.type
              );

            return (
              <section
                key={
                  slot.type
                }
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-bold text-gray-900">
                        {slot.label}
                      </h2>

                      {slot.required && (
                        <span className="rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">
                          Required
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-sm text-gray-600">
                      {
                        slot.description
                      }
                    </p>

                    {uploaded && (
                      <div className="mt-4">
                        <p className="font-medium text-green-700">
                          ✓{" "}
                          {
                            uploaded.originalName
                          }
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {formatFileSize(
                            uploaded.fileSize
                          )}{" "}
                          ·{" "}
                          {
                            uploaded.status
                          }
                        </p>

                        <div className="mt-3 flex gap-4">
                          <a
                            href={`/api/documents/${uploaded.id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                          >
                            View
                          </a>

                          {!readOnly && (
                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                uploaded.id
                              )
                            }
                            className="text-sm font-semibold text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {!readOnly && (
                  <form
                    onSubmit={(
                      event
                    ) =>
                      handleUpload(
                        event,
                        slot.type
                      )
                    }
                    className="min-w-0 md:w-80"
                  >
                    <input
                      name="file"
                      type="file"
                      required
                      accept={
                        slot.type ===
                        "photo"
                          ? "image/jpeg,image/png"
                          : "application/pdf,image/jpeg,image/png"
                      }
                      className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:font-semibold file:text-gray-700 hover:file:bg-gray-200"
                    />

                    <button
                      type="submit"
                      disabled={
                        busyType ===
                        slot.type
                      }
                      className="mt-3 w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {busyType ===
                      slot.type
                        ? "Uploading..."
                        : uploaded
                          ? "Replace"
                          : "Upload"}
                    </button>
                  </form>
                  )}
                </div>
              </section>
            );
          }
        )}
      </div>

      <div className="flex flex-col-reverse justify-between gap-4 sm:flex-row">
        {!readOnly && (
          <Link
            href="/apply/academic"
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-center font-semibold text-gray-700 hover:bg-gray-50"
          >
            ← Academic Details
          </Link>
        )}

        {readOnly ? (
          <Link
            href="/apply/review"
            className="rounded-lg bg-blue-600 px-8 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
          >
            Back to Review →
          </Link>
        ) : allRequiredUploaded ? (
          <Link
            href="/apply/review"
            className="rounded-lg bg-green-600 px-8 py-3 text-center font-semibold text-white transition hover:bg-green-700"
          >
            Continue to Review →
          </Link>
        ) : (
          <Link
            href="/student/dashboard"
            className="rounded-lg bg-blue-600 px-8 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
          >
            Return to Dashboard
          </Link>
        )}
      </div>
    </div>
  );
}