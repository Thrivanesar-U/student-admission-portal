import Link from "next/link";
import { notFound } from "next/navigation";

import { programs } from "@/data/programs";

interface ProgramDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProgramDetailsPage({
  params,
}: ProgramDetailsPageProps) {
  const { slug } = await params;

  const program = programs.find(
    (program) => program.slug === slug
  );

  if (!program) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white py-16">
      <div className="mx-auto max-w-4xl px-6">
        <Link
          href="/programs"
          className="font-semibold text-blue-600 hover:text-blue-700"
        >
          ← Back to Programs
        </Link>

        <p className="mt-10 text-sm font-semibold uppercase tracking-wider text-blue-600">
          {program.duration}
        </p>

        <h1 className="mt-2 text-4xl font-bold text-gray-900 md:text-5xl">
          {program.name}
        </h1>

        <p className="mt-3 text-xl text-gray-500">
          {program.fullName}
        </p>

        <p className="mt-8 text-lg leading-8 text-gray-600">
          {program.description}
        </p>

        <div className="mt-10">
          <Link
            href="/apply"
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Apply for this Program
          </Link>
        </div>
      </div>
    </main>
  );
}