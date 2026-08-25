import ProgramCard from "@/components/ProgramCard";
import { programs } from "@/data/programs";

export default function ProgramsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Academics
          </p>

          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            Our Programs
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Explore our academic programs and choose the path that matches your
            interests and career goals.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <ProgramCard
              key={program.slug}
              program={program}
            />
          ))}
        </div>
      </div>
    </main>
  );
}