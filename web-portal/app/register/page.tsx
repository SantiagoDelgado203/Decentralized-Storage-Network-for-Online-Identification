export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center">
      <form className="w-full max-w-sm space-y-6 rounded-xl border border-gray-800 bg-black p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-center">
          Register
        </h1>

        {/* Name */}
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="John Doe"
            className="rounded-md border border-gray-700 bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Age */}
        <div className="flex flex-col gap-2">
          <label htmlFor="age" className="text-sm">
            Age
          </label>
          <input
            id="age"
            type="number"
            placeholder="18"
            className="rounded-md border border-gray-700 bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="example@example.com"
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

        {/* Submit */}
        <button
          type="button"
          className="w-full rounded-md bg-green-600 py-2 font-medium hover:bg-green-700 transition"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}
