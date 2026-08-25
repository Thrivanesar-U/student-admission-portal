import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 print:hidden">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="text-2xl font-bold text-white">
            3vSkool
          </Link>

          <p className="mt-4 leading-7 text-gray-400">
            Building knowledge, practical skills, and opportunities for the
            next generation of students.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-white">Academics</h3>

          <div className="mt-4 flex flex-col gap-3">
            <Link
              href="/programs"
              className="text-gray-400 transition hover:text-white"
            >
              Programs
            </Link>

            <Link
              href="/about"
              className="text-gray-400 transition hover:text-white"
            >
              About Us
            </Link>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-white">Admissions</h3>

          <div className="mt-4 flex flex-col gap-3">
            <Link
              href="/admissions"
              className="text-gray-400 transition hover:text-white"
            >
              Admission Information
            </Link>

            <Link
              href="/apply"
              className="text-gray-400 transition hover:text-white"
            >
              Apply Online
            </Link>

            <Link
              href="/contact"
              className="text-gray-400 transition hover:text-white"
            >
              Contact Admissions
            </Link>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-white">Contact</h3>

          <div className="mt-4 space-y-3 text-gray-400">
            <p>admissions@3vskool.example</p>
            <p>+91 00000 00000</p>
            <p>Institution Address</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-6 py-6 text-center text-sm text-gray-500">
          © 2026 3vSkool. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
