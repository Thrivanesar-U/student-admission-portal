import Link from "next/link";

import AdmissionStepCard from "@/components/AdmissionStepCard";
import FeatureCard from "@/components/FeatureCard";
import ProgramCard from "@/components/ProgramCard";

import { admissionSteps } from "@/data/admission-steps";
import { features } from "@/data/features";
import { programs } from "@/data/programs";

export default function Home() {
  return (
    <main className="bg-white text-gray-900">
      {/* HERO SECTION */}
      <section className="bg-gradient-to-b from-blue-50 to-white">
        <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl flex-col items-center justify-center px-6 py-20 text-center">
          <p className="mb-4 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Admissions Open 2026–27
          </p>

          <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-gray-900 md:text-6xl">
            Build Your Future with{" "}
            <span className="text-blue-600">3vSkool</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            Learn from experienced faculty, build industry-ready skills, and
            take the next step toward your career with our academic programs.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/apply"
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Apply Now
            </Link>

            <Link
              href="/programs"
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-900 transition hover:bg-gray-50"
            >
              Explore Programs
            </Link>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="border-y border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 text-center md:grid-cols-4">
          <div>
            <p className="text-3xl font-bold text-blue-600">2,500+</p>
            <p className="mt-2 text-gray-600">Students</p>
          </div>

          <div>
            <p className="text-3xl font-bold text-blue-600">25+</p>
            <p className="mt-2 text-gray-600">Programs</p>
          </div>

          <div>
            <p className="text-3xl font-bold text-blue-600">50+</p>
            <p className="mt-2 text-gray-600">Faculty Members</p>
          </div>

          <div>
            <p className="text-3xl font-bold text-blue-600">90%</p>
            <p className="mt-2 text-gray-600">Placement Support</p>
          </div>
        </div>
      </section>

      {/* PROGRAMS SECTION */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Our Programs
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
              Choose a Program for Your Future
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Explore career-focused programs designed to help students build strong
              academic foundations and practical skills.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {programs.map((program) => (
              <ProgramCard
                key={program.name}
                program={program}
              />
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Why Choose 3vSkool?
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
              Everything You Need to Succeed
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              We focus on creating a supportive learning environment where students
              can build knowledge, practical skills, and confidence for their future.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard
                key={feature.title}
                feature={feature}
              />
            ))}
          </div>
        </div>
      </section>
      {/* ADMISSION PROCESS SECTION */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Admission Process
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
              Apply in Four Simple Steps
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Our online admission process is designed to make applying simple,
              transparent, and convenient.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {admissionSteps.map((admissionStep) => (
              <AdmissionStepCard
                key={admissionStep.step}
                admissionStep={admissionStep}
              />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/apply"
              className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Start Your Application
            </Link>
          </div>
        </div>
      </section>
      {/* CTA SECTION */}
      <section className="bg-blue-600 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Ready to Start Your Journey?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-blue-100">
            Take the next step toward your future. Applications for the 2026–27
            academic year are now open.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/apply"
              className="rounded-lg bg-white px-6 py-3 font-semibold text-blue-600 transition hover:bg-gray-100"
            >
              Apply Now
            </Link>

            <Link
              href="/contact"
              className="rounded-lg border border-blue-300 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Contact Admissions
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}