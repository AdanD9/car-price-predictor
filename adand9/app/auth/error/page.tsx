"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

const errorMessages: Record<string, string> = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "You do not have access to this resource.",
  Verification: "The token has expired or has already been used.",
  Default: "An unexpected error occurred.",
};

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "Default";

  const errorMessage = errorMessages[error] || errorMessages.Default;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mx-auto w-full max-w-md text-center">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-red-600">
          Authentication Error
        </h2>
        <p className="mt-4 text-center text-gray-600">{errorMessage}</p>
        <div className="mt-6">
          <Link
            href="/auth/signin"
            className="text-indigo-600 hover:text-indigo-500"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
