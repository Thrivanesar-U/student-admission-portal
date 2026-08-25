ALTER TABLE "applications" ADD COLUMN "submitted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "declaration_accepted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "declaration_version" varchar(50);