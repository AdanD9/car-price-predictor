export default function VerifyRequest() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mx-auto w-full max-w-md text-center">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
          Check your email
        </h2>
        <p className="mt-4 text-center text-gray-600">
          A sign in link has been sent to your email address. Please check your
          inbox and spam folder.
        </p>
        <p className="mt-2 text-center text-gray-600">
          The link will expire in 24 hours.
        </p>
      </div>
    </div>
  );
}
