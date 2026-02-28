import Link from "next/link";

export default function LoginSelectionPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold text-center">
          Login As
        </h1>

        <Link
          href="/login/user"
          className="rounded-md bg-green-600 py-2 px-6 text-center font-medium hover:bg-green-700 transition"
        >
          Login as User
        </Link>

        <Link
          href="/login/verifier"
          className="rounded-md bg-blue-600 py-2 px-6 text-center font-medium hover:bg-blue-700 transition"
        >
          Login as Service Provider
        </Link>
      </div>
    </div>
  );
}
