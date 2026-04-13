import { getDict, pickLang } from "@/lib/i18n";
import LoginForm from "./LoginForm";

export default async function LoginPage(props: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await props.searchParams;
  const l = pickLang(lang);
  const t = await getDict(l);

  return <LoginForm t={t} />;
}