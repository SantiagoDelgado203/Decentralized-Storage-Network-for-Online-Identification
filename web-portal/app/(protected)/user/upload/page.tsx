"use client";

import { useState, useContext } from "react";
import { uploadUserData } from "@/Connectors";
import { UploadRequest, UserInfo } from "@/Models";
import { AuthContext } from "@/app/context/AuthContext";

export default function Upload() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");

  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const context = useContext(AuthContext);

  // ✅ Date validation
  const isValidDate = () => {
    const y = Number(year);
    const m = Number(month);
    const d = Number(day);

    if (!y || !m || !d) return false;

    const currentYear = new Date().getFullYear();

    // Year range
    if (y < 1900 || y > currentYear) return false;

    // Month range
    if (m < 1 || m > 12) return false;

    // Days in month (handles leap years)
    const daysInMonth = new Date(y, m, 0).getDate();
    if (d < 1 || d > daysInMonth) return false;

    // No future dates
    const inputDate = new Date(y, m - 1, d);
    const today = new Date();
    if (inputDate > today) return false;

    return true;
  };

  // ✅ Overall validation
  const isFormValid = () => {
    return (
      name.trim() &&
      address.trim() &&
      gender &&
      year &&
      month &&
      day &&
      isValidDate()
    );
  };

  const sendUserData = async () => {
    if (!isFormValid()) {
      if (!year || !month || !day) {
        setResponse("Please fill in all fields.");
      } else if (!isValidDate()) {
        setResponse("Please enter a valid date of birth.");
      } else {
        setResponse("Please fill in all fields.");
      }
      return;
    }

    const user_info: UserInfo = {
      Name: name,
      Gender: gender,
      Address: address,
      DOB: {
        year: Number(year),
        month: Number(month),
        day: Number(day),
      },
    };

    const payload: UploadRequest = {
      UserID: context?.user.id,
      Data: user_info,
    };

    try {
      setLoading(true);
      const res = await uploadUserData(payload);
      setResponse(res);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setResponse("Request failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ After submit view
  if (submitted) {
    return (
      <section className="max-w-2xl mx-auto">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-lg text-center">
          <h1 className="text-xl font-mono text-neutral-100">
            At this step, your data would be reviewed by a human to verify its accuracy
          </h1>
        </div>
        <p className="block mx-auto w-full text-center mt-2">{response}</p>
      </section>
    );
  }

  return (
    <section className="max-w-2xl mx-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-lg">
        <h1 className="text-2xl font-mono tracking-wide text-neutral-100 mb-6">
          Submit User Data
        </h1>

        <div className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm text-neutral-400 mb-1">
              Full Name
            </label>
            <input
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-neutral-100"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jhon Doe"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm text-neutral-400 mb-1">
              Gender
            </label>
            <select
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-neutral-100"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="" disabled>
                Select gender
              </option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="X">Nonbinary</option>
            </select>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm text-neutral-400 mb-1">
              Address
            </label>
            <input
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-neutral-100"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Fake Street, WPB, FL"
            />
          </div>

          {/* DOB */}
          <div>
            <label className="block text-sm text-neutral-400 mb-2">
              Date of Birth
            </label>
            <div className="grid grid-cols-3 gap-3">
              <input
                type="number"
                placeholder="YYYY"
                min="1900"
                max={new Date().getFullYear()}
                className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
              <input
                type="number"
                placeholder="MM"
                min="1"
                max="12"
                className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              />
              <input
                type="number"
                placeholder="DD"
                min="1"
                max="31"
                className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100"
                value={day}
                onChange={(e) => setDay(e.target.value)}
              />
            </div>

            {/* Inline date error */}
            {year && month && day && !isValidDate() && (
              <p className="text-red-400 text-sm mt-1">
                Invalid date of birth
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={sendUserData}
            disabled={loading || !isFormValid()}
            className="w-full mt-6 bg-emerald-500/90 hover:bg-emerald-500
                       text-neutral-950 font-mono tracking-wide py-2.5 rounded-lg
                       transition disabled:opacity-50"
          >
            {loading ? "Submitting…" : "Submit"}
          </button>

          {/* General error */}
          {response && !submitted && (
            <p className="text-red-400 text-sm mt-2">{response}</p>
          )}
        </div>
      </div>
    </section>
  );
}