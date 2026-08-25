import Link from "next/link";
import { Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-white px-6">
      <div className="max-w-xl text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <SearchX className="h-10 w-10" />
        </div>

        <p className="mt-8 text-sm font-bold uppercase tracking-widest text-blue-600">
          Error 404
        </p>

        <h1 className="mt-3 text-4xl font-bold text-gray-900 md:text-5xl">
          Page Not Found
        </h1>

        <p className="mt-5 text-lg leading-8 text-gray-600">
          The page you are looking for may have been moved, deleted, or the
          address may be incorrect.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <Home className="h-5 w-5" />
            Back to Home
          </Link>

          <Link
            href="/programs"
            className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-900 transition hover:bg-gray-50"
          >
            Browse Programs
          </Link>
        </div>
      </div>
    </main>
  );
}