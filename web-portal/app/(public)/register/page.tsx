import Link from "next/link";

export default function RegisterSelectionPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold text-center">
          Register As
        </h1>

        <Link
          href="/register/user"
          className="rounded-md bg-green-600 py-2 px-6 text-center font-medium hover:bg-green-700 transition"
        >
          Register as User
        </Link>

        <Link
          href="/register/verifier"
          className="rounded-md bg-blue-600 py-2 px-6 text-center font-medium hover:bg-blue-700 transition"
        >
          Register as Service Provider
        </Link>
      </div>
    </div>
  );
}
