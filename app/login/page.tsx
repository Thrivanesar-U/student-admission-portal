"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    const { error } = await authClient.signIn.email({
      email,
      password,
      rememberMe: true,
    });

    if (error) {
      setError(
        error.message ??
          "Unable to log in. Check your email and password."
      );

      setIsLoading(false);
      return;
    }

    const {
      data: session,
      error: sessionError,
    } = await authClient.getSession();

    if (sessionError || !session) {
      setError(
        "Login succeeded, but we could not load your account."
      );

      setIsLoading(false);
      return;
    }

    if (session.user.role === "admin") {
      router.replace("/admin");
    } else if (session.user.role === "student") {
      router.replace("/student/dashboard");
    } else {
      setError(
        "Your account does not have a valid role."
      );

      setIsLoading(false);
      return;
    }

    router.refresh();
  }

  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="mx-auto max-w-lg px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            3vSkool Portal
          </p>

          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            Welcome Back
          </h1>

          <p className="mt-4 text-gray-600">
            Log in to access your 3vSkool portal.
            application.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8"
        >
          {/* EMAIL */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="you@example.com"
              required
              autoComplete="email"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* ERROR */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {/* LOGIN */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Logging In..." : "Log In"}
          </button>

          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Create account
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}