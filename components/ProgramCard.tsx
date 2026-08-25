import Link from "next/link";
import type { Program } from "@/types/program";

interface ProgramCardProps {
  program: Program;
}

export default function ProgramCard({ program }: ProgramCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-lg font-bold text-blue-600">
        {program.name.charAt(0)}
      </div>

      <p className="text-sm font-semibold text-blue-600">
        {program.duration}
      </p>

      <h3 className="mt-2 text-2xl font-bold text-gray-900">
        {program.name}
      </h3>

      <p className="mt-1 text-sm font-medium text-gray-500">
        {program.fullName}
      </p>

      <p className="mt-4 leading-7 text-gray-600">
        {program.description}
      </p>

      <Link
        href={`/programs/${program.slug}`}
        className="mt-6 inline-block font-semibold text-blue-600 hover:text-blue-700"
      >
        Learn More →
      </Link>
    </div>
  );
}