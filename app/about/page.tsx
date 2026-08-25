import {
  BookOpen,
  BriefcaseBusiness,
  GraduationCap,
  Lightbulb,
  Target,
  Users,
} from "lucide-react";

export default function AboutPage() {
  return (
    <main>
      {/* HERO */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            About 3vSkool
          </p>

          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Education designed for knowledge,
            skills, and career growth.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600">
            3vSkool is focused on helping students
            build strong academic foundations while
            developing practical skills needed for
            higher education and modern careers.
          </p>
        </div>
      </section>

      {/* STORY */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Our Story
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900">
              Building a better learning experience
            </h2>

            <p className="mt-5 leading-7 text-gray-600">
              We believe education should go beyond
              textbooks and examinations. Students
              should have opportunities to understand
              concepts, solve practical problems, and
              develop the confidence required to
              succeed professionally.
            </p>

            <p className="mt-4 leading-7 text-gray-600">
              Our programs combine academic learning,
              project-based activities, mentorship,
              and career-focused development to help
              students prepare for their next step.
            </p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="grid gap-6 sm:grid-cols-2">
              <Stat
                value="3+"
                label="Career-focused programs"
              />

              <Stat
                value="100%"
                label="Student-focused learning"
              />

              <Stat
                value="Practical"
                label="Learning approach"
              />

              <Stat
                value="Future"
                label="Career preparation"
              />
            </div>
          </div>
        </div>
      </section>

      {/* MISSION + VISION */}
      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Target className="h-6 w-6" />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Our Mission
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              To provide accessible, practical, and
              high-quality education that enables
              students to develop knowledge,
              confidence, and career-ready skills.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Lightbulb className="h-6 w-6" />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Our Vision
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              To create a learning environment where
              every student can discover their
              potential and prepare confidently for a
              rapidly changing world.
            </p>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Why 3vSkool
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900">
              What guides our approach
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <ValueCard
              icon={<BookOpen className="h-6 w-6" />}
              title="Strong Academics"
              description="Build clear foundations in every subject and program."
            />

            <ValueCard
              icon={<BriefcaseBusiness className="h-6 w-6" />}
              title="Career Focus"
              description="Connect classroom learning with practical career skills."
            />

            <ValueCard
              icon={<Users className="h-6 w-6" />}
              title="Student Support"
              description="Encourage students through guidance and mentorship."
            />

            <ValueCard
              icon={<GraduationCap className="h-6 w-6" />}
              title="Continuous Growth"
              description="Help learners improve academically and professionally."
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function Stat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl bg-gray-50 p-6">
      <p className="text-3xl font-bold text-blue-600">
        {value}
      </p>

      <p className="mt-2 text-sm font-medium text-gray-600">
        {label}
      </p>
    </div>
  );
}

function ValueCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-bold text-gray-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-gray-600">
        {description}
      </p>
    </div>
  );
}