import {
  CheckCircle2,
  CreditCard,
  FileCheck2,
  FileText,
  UserPlus,
} from "lucide-react";

import Link from "next/link";

const steps = [
  {
    icon: UserPlus,
    number: "01",
    title: "Create Account",
    description:
      "Register your student account using your name and email address.",
  },
  {
    icon: FileText,
    number: "02",
    title: "Complete Application",
    description:
      "Provide your personal, program, and academic information.",
  },
  {
    icon: FileCheck2,
    number: "03",
    title: "Upload Documents",
    description:
      "Upload the required certificates, photograph, and identity proof.",
  },
  {
    icon: CreditCard,
    number: "04",
    title: "Pay Application Fee",
    description:
      "Complete the application fee payment securely online.",
  },
  {
    icon: CheckCircle2,
    number: "05",
    title: "Submit Application",
    description:
      "Review your information and submit the completed application.",
  },
];

export default function AdmissionsPage() {
  return (
    <main>
      {/* HERO */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Admissions 2026–27
          </p>

          <h1 className="mt-3 max-w-3xl text-4xl font-bold text-gray-900 md:text-5xl">
            Start your journey with 3vSkool.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            Follow our simple online admission
            process to apply for your preferred
            program.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/apply"
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Apply Now →
            </Link>

            <Link
              href="/programs"
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Explore Programs
            </Link>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Admission Process
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900">
              Apply in five simple steps
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {steps.map((step) => {
              const Icon =
                step.icon;

              return (
                <div
                  key={step.number}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                      <Icon className="h-5 w-5" />
                    </div>

                    <span className="text-sm font-bold text-gray-300">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-5 font-bold text-gray-900">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* REQUIREMENTS */}
      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Documents
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900">
              Keep these documents ready
            </h2>

            <div className="mt-8 space-y-4">
              <Requirement text="Passport-size photograph" />
              <Requirement text="Valid identity proof" />
              <Requirement text="Class 10 certificate / marksheet" />
              <Requirement text="Class 12 certificate / marksheet" />
              <Requirement text="Transfer certificate, where applicable" />
            </div>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">
              Important
            </p>

            <h2 className="mt-3 text-2xl font-bold text-blue-950">
              Before submitting your application
            </h2>

            <div className="mt-6 space-y-4 text-sm leading-6 text-blue-900">
              <p>
                Make sure all information entered in
                the application matches your official
                documents.
              </p>

              <p>
                Review uploaded files carefully before
                payment and final submission.
              </p>

              <p>
                Once finally submitted, the application
                becomes read-only while it is processed
                by the admissions team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-6 py-14 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold text-white">
              Ready to apply?
            </h2>

            <p className="mt-2 text-blue-100">
              Create your account and begin your
              admission application.
            </p>
          </div>

          <Link
            href="/apply"
            className="rounded-lg bg-white px-6 py-3 text-center font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            Start Application →
          </Link>
        </div>
      </section>
    </main>
  );
}

function Requirement({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />

      <p className="font-medium text-gray-700">
        {text}
      </p>
    </div>
  );
}