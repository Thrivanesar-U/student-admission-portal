CREATE TYPE "public"."document_status" AS ENUM('uploaded', 'verified', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."document_type" AS ENUM('photo', 'id_proof', 'class_10_certificate', 'class_12_certificate', 'transfer_certificate', 'other');--> statement-breakpoint
CREATE TABLE "documents" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "documents_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"application_id" integer NOT NULL,
	"document_type" "document_type" NOT NULL,
	"original_name" varchar(255) NOT NULL,
	"stored_name" varchar(255) NOT NULL,
	"storage_path" text NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"file_size" integer NOT NULL,
	"status" "document_status" DEFAULT 'uploaded' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "documents_application_type_unique" UNIQUE("application_id","document_type")
);
--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;