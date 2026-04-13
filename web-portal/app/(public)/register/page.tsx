import { getDict, pickLang } from "@/lib/i18n";
import RegisterForm from "./RegisterForm";

export default async function RegisterPage(props: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await props.searchParams;
  const l = pickLang(lang);
  const t = await getDict(l);

  return <RegisterForm t={t} />;
}