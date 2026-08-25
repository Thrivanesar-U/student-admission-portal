import {
  date,
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";


import { user } from "./auth-schema";

export const genderEnum = pgEnum("gender", [
  "male",
  "female",
  "other",
  "prefer-not-to-say",
]);

export const applicationStatusEnum = pgEnum("application_status", [
  "draft",
  "submitted",
  "under_review",
  "approved",
  "rejected",
]);

export const qualificationTypeEnum = pgEnum(
  "qualification_type",
  [
    "higher_secondary",
    "diploma",
    "undergraduate",
    "postgraduate",
    "other",
  ]
);

export const scoreTypeEnum = pgEnum(
  "score_type",
  [
    "percentage",
    "cgpa",
  ]
);

export const documentTypeEnum = pgEnum(
  "document_type",
  [
    "photo",
    "id_proof",
    "class_10_certificate",
    "class_12_certificate",
    "transfer_certificate",
    "other",
  ]
);

export const documentStatusEnum = pgEnum(
  "document_status",
  [
    "uploaded",
    "verified",
    "rejected",
  ]
);

export const paymentStatusEnum = pgEnum(
  "payment_status",
  [
    "created",
    "paid",
    "failed",
    "refunded",
  ]
);

export const applications = pgTable("applications", {
  id: integer("id")
    .primaryKey()
    .generatedAlwaysAsIdentity(),

  userId: text("user_id")
  .notNull()
  .references(() => user.id),

  fullName: varchar("full_name", {
    length: 100,
  }).notNull(),

  email: varchar("email", {
    length: 255,
  }).notNull(),

  phone: varchar("phone", {
    length: 20,
  }).notNull(),

  dateOfBirth: date("date_of_birth").notNull(),

  gender: genderEnum("gender").notNull(),

  address: text("address").notNull(),

  programSlug: varchar("program_slug", {
    length: 100,
  }).notNull(),

  status: applicationStatusEnum("status")
    .default("draft")
    .notNull(),

  submittedAt: timestamp("submitted_at", {
    withTimezone: true,
  }),

  declarationAcceptedAt: timestamp(
    "declaration_accepted_at",
    {
      withTimezone: true,
    }
  ),

  declarationVersion: varchar(
    "declaration_version",
    {
      length: 50,
    }
  ),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

export const academicDetails = pgTable(
  "academic_details",
  {
    id: integer("id")
      .primaryKey()
      .generatedAlwaysAsIdentity(),

    applicationId: integer("application_id")
      .notNull()
      .unique()
      .references(
        () => applications.id,
        {
          onDelete: "cascade",
        }
      ),

    qualificationType:
      qualificationTypeEnum(
        "qualification_type"
      ).notNull(),

    institutionName: varchar(
      "institution_name",
      {
        length: 200,
      }
    ).notNull(),

    boardOrUniversity: varchar(
      "board_or_university",
      {
        length: 200,
      }
    ).notNull(),

    yearOfPassing: integer(
      "year_of_passing"
    ).notNull(),

    scoreType:
      scoreTypeEnum("score_type").notNull(),

    scoreValue: numeric(
      "score_value",
      {
        precision: 5,
        scale: 2,
        mode: "number",
      }
    ).notNull(),

    createdAt: timestamp(
      "created_at",
      {
        withTimezone: true,
      }
    )
      .defaultNow()
      .notNull(),

    updatedAt: timestamp(
      "updated_at",
      {
        withTimezone: true,
      }
    )
      .defaultNow()
      .notNull(),
  }
);

export const documents = pgTable(
  "documents",
  {
    id: integer("id")
      .primaryKey()
      .generatedAlwaysAsIdentity(),

    applicationId: integer("application_id")
      .notNull()
      .references(
        () => applications.id,
        {
          onDelete: "cascade",
        }
      ),

    documentType:
      documentTypeEnum(
        "document_type"
      ).notNull(),

    originalName: varchar(
      "original_name",
      {
        length: 255,
      }
    ).notNull(),

    storedName: varchar(
      "stored_name",
      {
        length: 255,
      }
    ).notNull(),

    storagePath: text(
      "storage_path"
    ).notNull(),

    mimeType: varchar(
      "mime_type",
      {
        length: 100,
      }
    ).notNull(),

    fileSize: integer(
      "file_size"
    ).notNull(),

    status: documentStatusEnum(
      "status"
    )
      .default("uploaded")
      .notNull(),

    createdAt: timestamp(
      "created_at",
      {
        withTimezone: true,
      }
    )
      .defaultNow()
      .notNull(),

    updatedAt: timestamp(
      "updated_at",
      {
        withTimezone: true,
      }
    )
      .defaultNow()
      .notNull(),
  },
  (table) => [
    unique(
      "documents_application_type_unique"
    ).on(
      table.applicationId,
      table.documentType
    ),
  ]
);

export const payments = pgTable(
  "payments",
  {
    id: integer("id")
      .primaryKey()
      .generatedAlwaysAsIdentity(),

    applicationId: integer("application_id")
      .notNull()
      .references(
        () => applications.id,
        {
          onDelete: "cascade",
        }
      ),

    amount: integer("amount")
      .notNull(),

    currency: varchar(
      "currency",
      {
        length: 3,
      }
    )
      .default("INR")
      .notNull(),

    provider: varchar(
      "provider",
      {
        length: 30,
      }
    )
      .default("razorpay")
      .notNull(),

    providerOrderId: varchar(
      "provider_order_id",
      {
        length: 100,
      }
    )
      .notNull()
      .unique(),

    providerPaymentId: varchar(
      "provider_payment_id",
      {
        length: 100,
      }
    ).unique(),

    providerSignature: text(
      "provider_signature"
    ),

    status: paymentStatusEnum(
      "status"
    )
      .default("created")
      .notNull(),

    paidAt: timestamp(
      "paid_at",
      {
        withTimezone: true,
      }
    ),

    createdAt: timestamp(
      "created_at",
      {
        withTimezone: true,
      }
    )
      .defaultNow()
      .notNull(),

    updatedAt: timestamp(
      "updated_at",
      {
        withTimezone: true,
      }
    )
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index(
      "payments_application_id_idx"
    ).on(
      table.applicationId
    ),
  ]
);

export const applicationStatusHistory =
  pgTable(
    "application_status_history",
    {
      id:
        integer("id")
          .primaryKey()
          .generatedAlwaysAsIdentity(),

      applicationId:
        integer("application_id")
          .notNull()
          .references(
            () => applications.id,
            {
              onDelete: "cascade",
            }
          ),

      adminUserId:
        text("admin_user_id")
          .notNull()
          .references(
            () => user.id
          ),

      fromStatus:
        applicationStatusEnum(
          "from_status"
        )
          .notNull(),

      toStatus:
        applicationStatusEnum(
          "to_status"
        )
          .notNull(),

      createdAt:
        timestamp(
          "created_at",
          {
            withTimezone: true,
          }
        )
          .defaultNow()
          .notNull(),
    },
    (table) => [
      index(
        "application_status_history_application_id_idx"
      ).on(
        table.applicationId
      ),

      index(
        "application_status_history_admin_user_id_idx"
      ).on(
        table.adminUserId
      ),
    ]
  );