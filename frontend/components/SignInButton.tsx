"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function SignInButton() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm">{session.user?.email}</span>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="rounded-md bg-gray-800 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/auth/signin"
      className="rounded-md bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      Sign in
    </Link>
  );
}
