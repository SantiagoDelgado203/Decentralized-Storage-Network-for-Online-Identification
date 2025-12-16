export default function LoginPage() {
  return (
    <div className="flex  items-center justify-center">
      <form className="w-full max-w-sm space-y-6 rounded-xl border border-gray-800 bg-black p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-center">
          Login
        </h1>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="rounded-md border border-gray-700 bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            className="rounded-md border border-gray-700 bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Button */}
        <button
          type="button"
          className="w-full rounded-md bg-green-600 py-2 font-medium hover:bg-green-700 transition"
        >
          Log In
        </button>
      </form>
    </div>
  );
}
