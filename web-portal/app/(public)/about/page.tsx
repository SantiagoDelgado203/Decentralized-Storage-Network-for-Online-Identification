type Lang = "en" | "zh" | "es" | "fr" | "ja" | "ko" | "vi";

const content: Record<
  Lang,
  {
    title: string;
    body: string;
    whyTitle: string;
    bullets: string[];
  }
> = {
  en: {
    title: "About DIDN",
    body: "DIDN is a course project that explores privacy-preserving verification using decentralized storage and threshold cryptography. Our goal is to let user data be verified once by a trusted authority, then encrypted and distributed across independent nodes—without revealing the underlying data during future checks.",whyTitle: "Why we built it",
    bullets: [
      "Reduce repeated identity verification and unnecessary data exposure",
      "Minimize trust after the initial verification step",
      "Keep custody decentralized and auditable",
    ],
  },
  zh: {
    title: "关于 DIDN",
    body:"DIDN 是一个课程项目，探索如何使用去中心化存储与阈值密码学实现隐私保护的验证。我们的目标是：让用户数据只由可信机构验证一次，随后进行加密并分发到独立节点中保存——在后续验证过程中不暴露底层数据内容。",
    whyTitle: "为什么要做它",
    bullets: [
      "减少重复身份验证与不必要的数据暴露",
      "在首次验证后把信任需求降到最低",
      "让数据托管去中心化且可审计",
    ],
  },
  es: {
    title: "Acerca de DIDN",
    body:"DIDN es un proyecto de curso que explora la verificación con preservación de privacidad mediante almacenamiento descentralizado y criptografía de umbral. Nuestro objetivo es que los datos del usuario se verifiquen una sola vez por una autoridad confiable y luego se cifren y distribuyan entre nodos independientes, sin revelar los datos subyacentes en verificaciones futuras.",whyTitle: "Por qué lo construimos",
    bullets: [
      "Reducir verificaciones de identidad repetidas y exposición innecesaria de datos",
      "Minimizar la confianza requerida después de la verificación inicial",
      "Mantener la custodia descentralizada y auditable",
    ],
  },
  fr: {
    title: "À propos de DIDN",
    body:"DIDN est un projet de cours qui explore une vérification respectueuse de la vie privée grâce au stockage décentralisé et à la cryptographie à seuil. Notre objectif est que les données utilisateur soient vérifiées une seule fois par une autorité de confiance, puis chiffrées et distribuées sur des nœuds indépendants, sans révéler les données sous-jacentes lors des vérifications futures.",
    whyTitle: "Pourquoi nous l’avons créé",
    bullets: [
      "Réduire les vérifications d’identité répétées et l’exposition inutile des données",
      "Minimiser la confiance requise après l’étape de vérification initiale",
      "Garder la garde des données décentralisée et auditable",
    ],
  },
  ja: {
    title: "DIDN について",
    body:"DIDN は、分散型ストレージとしきい値暗号を用いたプライバシー保護型検証を探究する授業プロジェクトです。ユーザーデータを信頼できる機関が一度だけ検証し、その後は暗号化して独立したノードへ分散保存することで、将来の検証で元データを開示しないことを目指します。",
    whyTitle: "開発した理由",
    bullets: [
      "繰り返しの本人確認と不要なデータ露出を減らす",
      "初回検証後に必要な信頼を最小化する",
      "保管を分散化し、監査可能にする",
    ],
  },
  ko: {
    title: "DIDN 소개",
    body:"DIDN은 분산 저장과 임계(Threshold) 암호기술을 활용해 개인정보를 보호하는 검증 방식을 탐구하는 수업 프로젝트입니다. 사용자의 데이터는 신뢰할 수 있는 기관이 한 번만 검증하고, 이후에는 암호화되어 독립 노드들에 분산 저장되며, 이후 검증 과정에서 원본 데이터가 노출되지 않도록 하는 것이 목표입니다.",
    whyTitle: "왜 만들었나요",
    bullets: [
      "반복적인 신원 검증과 불필요한 데이터 노출을 줄이기 위해",
      "초기 검증 이후 필요한 신뢰를 최소화하기 위해",
      "데이터 보관을 분산화하고 감사 가능하게 하기 위해",
    ],
  },
  vi: {
    title: "Giới thiệu DIDN",
    body:"DIDN là một dự án môn học nhằm khám phá cơ chế xác minh bảo vệ quyền riêng tư bằng lưu trữ phi tập trung và mật mã ngưỡng. Mục tiêu của chúng tôi là để dữ liệu người dùng được một cơ quan đáng tin cậy xác minh một lần, sau đó được mã hóa và phân phối đến các nút độc lập mà không làm lộ dữ liệu gốc trong các lần kiểm tra về sau.",
    whyTitle: "Vì sao chúng tôi xây dựng",
    bullets: [
      "Giảm xác minh danh tính lặp lại và việc lộ dữ liệu không cần thiết",
      "Giảm tối đa mức độ tin cậy cần thiết sau bước xác minh ban đầu",
      "Giữ quyền lưu giữ dữ liệu phi tập trung và có thể kiểm toán",
    ],
  },
};


export default async function AboutPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const sp = await searchParams;
  const lang = (sp?.lang as Lang) || "en";
  const t = content[lang] ?? content.en;

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="rounded-2xl border bg-gradient-to-b from-white to-gray-50 p-8">
        <h1 className="text-3xl font-semibold tracking-tight">{t.title}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-gray-700">{t.body}</p>
      </section>

      {/* Why */}
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">{t.whyTitle}</h2>
        <ul className="mt-4 space-y-2 text-sm text-gray-700">
          {t.bullets.map((b) => (
            <li key={b} className="flex gap-3">
              <span className="mt-1 inline-block h-2 w-2 rounded-full bg-gray-400" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

