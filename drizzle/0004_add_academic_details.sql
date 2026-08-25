CREATE TYPE "public"."qualification_type" AS ENUM('higher_secondary', 'diploma', 'undergraduate', 'postgraduate', 'other');--> statement-breakpoint
CREATE TYPE "public"."score_type" AS ENUM('percentage', 'cgpa');--> statement-breakpoint
CREATE TABLE "academic_details" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "academic_details_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"application_id" integer NOT NULL,
	"qualification_type" "qualification_type" NOT NULL,
	"institution_name" varchar(200) NOT NULL,
	"board_or_university" varchar(200) NOT NULL,
	"year_of_passing" integer NOT NULL,
	"score_type" "score_type" NOT NULL,
	"score_value" numeric(5, 2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "academic_details_application_id_unique" UNIQUE("application_id")
);
--> statement-breakpoint
ALTER TABLE "academic_details" ADD CONSTRAINT "academic_details_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;