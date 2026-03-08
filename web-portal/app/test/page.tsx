"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { uploadUserData } from "@/Connectors";
import { TestUserInfo } from "@/Models";
import { getDict, pickLang, type Lang } from "@/lib/i18n";

type Errors = Partial<
  Record<"name" | "address" | "country" | "year" | "month" | "day" | "dob", string>
>;

function langFromCountry(country: string): Lang {
  switch (country) {
    case "CN":
      return "zh";
    case "ES":
      return "es";
    case "FR":
      return "fr";
    case "JP":
      return "ja";
    case "KR":
      return "ko";
    case "VN":
      return "vi";
    default:
      return "en";
  }
}

export default function TestUserInfoPage() {
  const sp = useSearchParams();

  // ✅ Read lang from URL and load dict
  const langParam = sp.get("lang") ?? undefined;
  const lang = useMemo<Lang>(() => pickLang(langParam), [langParam]);

  const [t, setT] = useState<any>(null);
  useEffect(() => {
    let alive = true;
    getDict(lang).then((d) => alive && setT(d));
    return () => {
      alive = false;
    };
  }, [lang]);

  const form = t?.form ?? {};

  // form state
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");

  const [errors, setErrors] = useState<Errors>({});
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const label = (k: string, fallback: string) => form[k] ?? fallback;

  function validate(): boolean {
    console.log("validate called");
    const e: Errors = {};

    if (!name.trim()) e.name = label("required", "This field is required.");
    if (!address.trim()) e.address = label("required", "This field is required.");
    if (!country) e.country = label("required", "This field is required.");

    const y = Number(year);
    const m = Number(month);
    const d = Number(day);

    if (!year.trim()) e.year = label("required", "This field is required.");
    if (!month.trim()) e.month = label("required", "This field is required.");
    if (!day.trim()) e.day = label("required", "This field is required.");

    // basic DOB validation if all provided
    if (!e.year && !e.month && !e.day) {
      const date = new Date(y, m - 1, d);
      const ok =
        Number.isFinite(y) &&
        Number.isFinite(m) &&
        Number.isFinite(d) &&
        date.getFullYear() === y &&
        date.getMonth() === m - 1 &&
        date.getDate() === d;

      if (!ok) e.dob = label("invalidDob", "Please enter a valid date of birth.");
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function sendUserData() {
    setResponse(null);

    if (!validate()) return;

    const payload: TestUserInfo = {
      Name: name,
      Address: address,
      DOB: {
        year: Number(year),
        month: Number(month),
        day: Number(day),
      },
    };

    try {
      setLoading(true);
      const res = await uploadUserData(payload);
      setResponse(JSON.stringify(res, null, 2));
    } catch (err) {
      console.error(err);
      setResponse(label("requestFailed", "Request failed"));
    } finally {
      setLoading(false);
    }
  }

  // ✅ Change language by country selection (updates URL ?lang=)
  function onCountryChange(nextCountry: string) {
    setCountry(nextCountry);

    const nextLang = langFromCountry(nextCountry);
    const url = new URL(window.location.href);
    url.searchParams.set("lang", nextLang);
    window.history.replaceState({}, "", url.toString());
    // dict will reload because useSearchParams updates -> lang changes -> useEffect runs
  }

  return (
    <section className="mx-auto max-w-2xl px-2">
      {/* ✅ Light card style (consistent with portal) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">
          {label("title", "Submit User Data")}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {label("subtitle", "Provide the required information for verification.")}
        </p>

        <div className="mt-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {label("fullName", "Full Name")}
            </label>
            <input
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400
                         focus:outline-none focus:ring-2 focus:ring-slate-300"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={label("namePlaceholder", "Santiago Delgado")}
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {label("address", "Address")}
            </label>
            <input
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400
                         focus:outline-none focus:ring-2 focus:ring-slate-300"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={label("addressPlaceholder", "123 Fake Street, WPB, FL")}
            />
            {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
          </div>

          {/* Country/Region */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {label("country", "Country/Region")}
            </label>
            <select
              value={country}
              onChange={(e) => onCountryChange(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900
                         focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              <option value="">{label("selectCountry", "Select a country")}</option>
              <option value="US">{label("countryUS", "United States")}</option>
              <option value="CN">{label("countryCN", "China")}</option>
              <option value="ES">{label("countryES", "Spain")}</option>
              <option value="FR">{label("countryFR", "France")}</option>
              <option value="JP">{label("countryJP", "Japan")}</option>
              <option value="KR">{label("countryKR", "Korea")}</option>
              <option value="VN">{label("countryVN", "Vietnam")}</option>
            </select>
            {errors.country && <p className="mt-1 text-xs text-red-600">{errors.country}</p>}
          </div>

          {/* DOB */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {label("dob", "Date of Birth")}
            </label>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <input
                  type="number"
                  placeholder={label("yyyy", "YYYY")}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-slate-900 placeholder:text-slate-400
                             focus:outline-none focus:ring-2 focus:ring-slate-300"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
                {errors.year && <p className="mt-1 text-xs text-red-600">{errors.year}</p>}
              </div>

              <div>
                <input
                  type="number"
                  placeholder={label("mm", "MM")}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-slate-900 placeholder:text-slate-400
                             focus:outline-none focus:ring-2 focus:ring-slate-300"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                />
                {errors.month && <p className="mt-1 text-xs text-red-600">{errors.month}</p>}
              </div>

              <div>
                <input
                  type="number"
                  placeholder={label("dd", "DD")}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-slate-900 placeholder:text-slate-400
                             focus:outline-none focus:ring-2 focus:ring-slate-300"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                />
                {errors.day && <p className="mt-1 text-xs text-red-600">{errors.day}</p>}
              </div>
            </div>

            {errors.dob && <p className="mt-2 text-xs text-red-600">{errors.dob}</p>}
          </div>

          {/* Submit */}
          <button
            onClick={sendUserData}
            disabled={loading}
            className="w-full mt-2 rounded-xl bg-slate-900 py-3 font-medium text-white transition hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? label("submitting", "Submitting…") : label("submit", "Submit")}
          </button>

          {/* Response */}
          {response && (
            <pre className="mt-4 overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              {response}
            </pre>
          )}
        </div>
      </div>
    </section>
  );
}