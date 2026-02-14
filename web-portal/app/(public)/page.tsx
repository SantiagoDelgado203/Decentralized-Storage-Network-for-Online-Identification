"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

type Lang = "en" | "zh" | "es" | "fr" | "ja" | "ko" | "vi";

const content: Record<Lang, any> = {
  en: {
    heroTitle: "Decentralized Verification Network",
    heroDesc:
      "A system where user data is verified once by a trusted authority, then encrypted, distributed, and enforced by decentralized nodes.",
    readDocs: "Read Docs",
    joinNetwork: "Join Network",

    overviewTitle: "What This Network Does",
    overviewBody1:
      "The network provides privacy-preserving verification of user data. A single trusted authority verifies user information exactly once.",
    overviewBody2:
      "After verification, the data is encrypted and submitted to a decentralized network of independent nodes that store and enforce verification logic without learning the underlying data.",

    guaranteesTitle: "Design Guarantees",
    guarantees: [
      "One-time trusted verification",
      "Decentralized custody of data",
      "Encrypted data and key material",
      "Auditable and compliant nodes",
      "Binary (yes / no) responses only",
    ],

    authorityTitle: "Trusted Verification Authority",
    authorityBody1:
      "A single, highly trusted authority is responsible for verifying user-provided data (such as identity attributes or credentials).",
    authorityBody2:
      "This verification happens once. After submission to the network, the authority no longer participates in storage, retrieval, or decision-making.",

    storageTitle: "Encrypted & Distributed Storage",
    storageBody1:
      "Verified data is encrypted before being distributed across a set of independent nodes operated by unrelated parties.",
    storageBody2:
      "Encryption keys are also protected and distributed such that no single node can access or reconstruct the underlying data on its own.",

    requestsTitle: "Verification Requests",
    requestCardTitle: "Request",
    requestCardBody:
      "A verifier submits a request for a specific condition (e.g. “Is user over 18?”).",
    executionCardTitle: "Execution",
    executionCardBody:
      "Nodes temporarily reconstruct access to encrypted material to evaluate the condition.",
    responseCardTitle: "Response",
    responseCardBody: "Only a yes/no result is returned — no data is revealed.",

    trustTitle: "Trust & Security Model",
    trustBody1:
      "The system relies on a minimal trust assumption: the initial verification authority is trusted to verify data correctly.",
    trustBody2:
      "After that point, decentralization ensures that no single entity can access, modify, or misuse user data — including the authority itself.",
  },

  zh: {
    heroTitle: "去中心化验证网络",
    heroDesc:
      "用户数据只需由可信机构验证一次，然后加密、分布式存储，并由去中心化节点执行验证逻辑。",
    readDocs: "阅读文档",
    joinNetwork: "加入网络",

    overviewTitle: "网络做什么",
    overviewBody1:
      "该网络提供隐私保护的用户数据验证。用户信息只需要由一个可信验证机构验证一次。",
    overviewBody2:
      "验证完成后，数据会被加密并提交到独立节点组成的去中心化网络中，节点在不获取明文数据的情况下执行验证逻辑。",

    guaranteesTitle: "设计保证",
    guarantees: [
      "一次性可信验证",
      "数据托管去中心化",
      "数据与密钥材料加密保护",
      "节点可审计、可合规",
      "仅返回二值结果（是/否）",
    ],

    authorityTitle: "可信验证机构",
    authorityBody1:
      "单一可信机构负责验证用户提交的信息（例如身份属性或凭证）。",
    authorityBody2:
      "验证只发生一次。数据提交到网络后，该机构不再参与存储、检索或决策过程。",

    storageTitle: "加密与分布式存储",
    storageBody1:
      "验证后的数据在分发到多个独立节点前会先被加密，这些节点由不同实体运营。",
    storageBody2:
      "加密密钥也会被拆分与分发，确保任何单个节点都无法独立访问或还原原始数据。",

    requestsTitle: "验证请求",
    requestCardTitle: "请求",
    requestCardBody: "验证方提交一个条件请求（例如：“用户是否年满 18 岁？”）。",
    executionCardTitle: "执行",
    executionCardBody: "节点临时重建访问能力以评估该条件。",
    responseCardTitle: "响应",
    responseCardBody: "系统只返回 是/否 结果，不泄露任何数据内容。",

    trustTitle: "信任与安全模型",
    trustBody1: "系统只需要最小信任：初始验证机构必须诚实地完成一次验证。",
    trustBody2:
      "之后通过去中心化保证任何单一实体都无法访问、篡改或滥用用户数据（包括验证机构本身）。",
  },

  es: {
    heroTitle: "Red de Verificación Descentralizada",
    heroDesc:
      "Un sistema donde los datos del usuario se verifican una vez por una autoridad confiable y luego se cifran, distribuyen y hacen cumplir por nodos descentralizados.",
    readDocs: "Leer Docs",
    joinNetwork: "Unirse a la red",

    overviewTitle: "Qué hace esta red",
    overviewBody1:
      "La red permite verificación con preservación de privacidad. Una autoridad confiable verifica la información del usuario exactamente una vez.",
    overviewBody2:
      "Después de la verificación, los datos se cifran y se envían a una red descentralizada de nodos independientes que aplican la lógica sin conocer los datos subyacentes.",

    guaranteesTitle: "Garantías de diseño",
    guarantees: [
      "Verificación confiable única",
      "Custodia descentralizada",
      "Datos y material de claves cifrados",
      "Nodos auditables y conformes",
      "Solo respuesta binaria (sí/no)",
    ],

    authorityTitle: "Autoridad de verificación confiable",
    authorityBody1:
      "Una autoridad altamente confiable verifica los datos proporcionados por el usuario (atributos de identidad o credenciales).",
    authorityBody2:
      "Esto ocurre una sola vez. Tras el envío a la red, la autoridad no participa en almacenamiento, recuperación ni decisiones.",

    storageTitle: "Almacenamiento cifrado y distribuido",
    storageBody1:
      "Los datos verificados se cifran antes de distribuirse entre nodos independientes operados por partes no relacionadas.",
    storageBody2:
      "Las claves también se protegen y distribuyen para que ningún nodo pueda acceder o reconstruir los datos por sí solo.",

    requestsTitle: "Solicitudes de verificación",
    requestCardTitle: "Solicitud",
    requestCardBody:
      "Un verificador envía una solicitud para una condición específica (p. ej., “¿El usuario es mayor de 18?”).",
    executionCardTitle: "Ejecución",
    executionCardBody:
      "Los nodos reconstruyen temporalmente el acceso al material cifrado para evaluar la condición.",
    responseCardTitle: "Respuesta",
    responseCardBody:
      "Solo se devuelve un resultado sí/no — no se revela ningún dato.",

    trustTitle: "Modelo de confianza y seguridad",
    trustBody1:
      "El sistema asume confianza mínima: la autoridad inicial verifica correctamente.",
    trustBody2:
      "Después, la descentralización evita que una sola entidad acceda, modifique o abuse de los datos — incluso la autoridad.",
  },

  fr: {
    heroTitle: "Réseau de Vérification Décentralisé",
    heroDesc:
      "Un système où les données utilisateur sont vérifiées une seule fois par une autorité de confiance, puis chiffrées, distribuées et appliquées par des nœuds décentralisés.",
    readDocs: "Lire la doc",
    joinNetwork: "Rejoindre le réseau",

    overviewTitle: "Ce que fait le réseau",
    overviewBody1:
      "Le réseau permet une vérification respectueuse de la vie privée. Une autorité de confiance vérifie l’utilisateur une seule fois.",
    overviewBody2:
      "Après vérification, les données sont chiffrées et soumises à un réseau de nœuds indépendants qui appliquent la logique sans connaître les données.",

    guaranteesTitle: "Garanties de conception",
    guarantees: [
      "Vérification fiable en une fois",
      "Garde décentralisée des données",
      "Données et clés chiffrées",
      "Nœuds auditables et conformes",
      "Réponse binaire uniquement (oui/non)",
    ],

    authorityTitle: "Autorité de vérification de confiance",
    authorityBody1:
      "Une autorité unique et très fiable vérifie les données fournies (attributs d’identité, justificatifs).",
    authorityBody2:
      "Cela n’a lieu qu’une fois. Après soumission, l’autorité ne participe plus au stockage, à la récupération ni à la décision.",

    storageTitle: "Stockage chiffré et distribué",
    storageBody1:
      "Les données vérifiées sont chiffrées avant d’être distribuées sur des nœuds indépendants opérés par des parties différentes.",
    storageBody2:
      "Les clés sont aussi protégées et distribuées afin qu’aucun nœud ne puisse reconstruire les données seul.",

    requestsTitle: "Requêtes de vérification",
    requestCardTitle: "Requête",
    requestCardBody:
      "Un vérificateur soumet une condition (ex. « L’utilisateur a-t-il plus de 18 ans ? »).",
    executionCardTitle: "Exécution",
    executionCardBody:
      "Les nœuds reconstruisent temporairement l’accès au matériel chiffré pour évaluer la condition.",
    responseCardTitle: "Réponse",
    responseCardBody:
      "Seul un résultat oui/non est renvoyé — aucune donnée n’est révélée.",

    trustTitle: "Modèle de confiance et de sécurité",
    trustBody1:
      "Hypothèse de confiance minimale : l’autorité initiale vérifie correctement.",
    trustBody2:
      "Ensuite, la décentralisation empêche toute entité unique d’accéder, modifier ou abuser des données — y compris l’autorité.",
  },

  ja: {
    heroTitle: "分散型検証ネットワーク",
    heroDesc:
      "ユーザーデータを信頼できる機関が一度だけ検証し、その後に暗号化して分散ノードへ配布・運用する仕組みです。",
    readDocs: "ドキュメント",
    joinNetwork: "参加する",

    overviewTitle: "このネットワークの役割",
    overviewBody1:
      "プライバシーを保護しながら検証を行います。信頼機関はユーザー情報を一度だけ検証します。",
    overviewBody2:
      "検証後、データは暗号化され、独立したノード群に送られ、ノードは内容を知らずにロジックを実行します。",

    guaranteesTitle: "設計上の保証",
    guarantees: [
      "一度きりの信頼検証",
      "分散されたデータ保管",
      "データと鍵素材の暗号化",
      "監査可能・準拠可能なノード",
      "二値応答（はい/いいえ）のみ",
    ],

    authorityTitle: "信頼できる検証機関",
    authorityBody1:
      "単一の高信頼機関がユーザー提供データ（ID属性や資格情報など）を検証します。",
    authorityBody2:
      "検証は一度だけ。ネットワーク投入後は、保存・取得・意思決定に関与しません。",

    storageTitle: "暗号化・分散ストレージ",
    storageBody1:
      "検証済みデータは暗号化され、無関係な組織が運用する独立ノードへ分散されます。",
    storageBody2:
      "鍵も保護・分散され、単一ノードでは復元できません。",

    requestsTitle: "検証リクエスト",
    requestCardTitle: "リクエスト",
    requestCardBody: "検証者が条件（例：「18歳以上か？」）を送信します。",
    executionCardTitle: "実行",
    executionCardBody:
      "ノードが一時的に暗号素材へのアクセスを再構成して条件を評価します。",
    responseCardTitle: "応答",
    responseCardBody: "結果は「はい/いいえ」のみ。データは開示しません。",

    trustTitle: "信頼・セキュリティモデル",
    trustBody1:
      "最小限の信頼：初回の検証機関が正しく検証することを前提とします。",
    trustBody2:
      "その後は分散化により、単一主体（機関含む）がデータを悪用できません。",
  },

  ko: {
    heroTitle: "탈중앙 검증 네트워크",
    heroDesc:
      "신뢰 기관이 사용자 데이터를 한 번만 검증한 뒤, 암호화하여 분산 노드에 저장·집행하는 시스템입니다.",
    readDocs: "문서 보기",
    joinNetwork: "네트워크 참여",

    overviewTitle: "이 네트워크의 기능",
    overviewBody1:
      "프라이버시를 보호하는 검증을 제공합니다. 신뢰 기관이 사용자 정보를 정확히 한 번만 검증합니다.",
    overviewBody2:
      "검증 후 데이터는 암호화되어 독립 노드 네트워크에 제출되며, 노드는 원문을 알지 못한 채 로직을 수행합니다.",

    guaranteesTitle: "설계 보장",
    guarantees: [
      "1회 신뢰 검증",
      "데이터 보관의 탈중앙화",
      "데이터/키 소재 암호화",
      "감사 가능 및 준수 가능한 노드",
      "예/아니오 이진 응답만",
    ],

    authorityTitle: "신뢰 검증 기관",
    authorityBody1:
      "단일 고신뢰 기관이 사용자 제공 데이터(신원 속성/자격 등)를 검증합니다.",
    authorityBody2:
      "검증은 한 번만 발생하며, 네트워크 제출 이후 저장·조회·의사결정에 관여하지 않습니다.",

    storageTitle: "암호화 & 분산 저장",
    storageBody1:
      "검증된 데이터는 암호화된 뒤 서로 다른 주체가 운영하는 독립 노드에 분산됩니다.",
    storageBody2:
      "키도 보호·분산되어 단일 노드만으로는 복원할 수 없습니다.",

    requestsTitle: "검증 요청",
    requestCardTitle: "요청",
    requestCardBody:
      "검증자가 특정 조건(예: “사용자가 18세 이상인가?”)을 요청합니다.",
    executionCardTitle: "실행",
    executionCardBody:
      "노드가 일시적으로 암호 자료 접근을 재구성해 조건을 평가합니다.",
    responseCardTitle: "응답",
    responseCardBody: "예/아니오 결과만 반환되며 데이터는 공개되지 않습니다.",

    trustTitle: "신뢰 & 보안 모델",
    trustBody1:
      "최소 신뢰 가정: 초기 검증 기관이 올바르게 검증한다는 가정이 필요합니다.",
    trustBody2:
      "그 이후에는 탈중앙화로 인해 어떤 단일 주체(기관 포함)도 데이터를 악용할 수 없습니다.",
  },

  vi: {
    heroTitle: "Mạng Xác Minh Phi Tập Trung",
    heroDesc:
      "Hệ thống nơi dữ liệu người dùng được xác minh một lần bởi cơ quan tin cậy, sau đó được mã hóa, phân tán và thực thi bởi các nút phi tập trung.",
    readDocs: "Xem tài liệu",
    joinNetwork: "Tham gia mạng",

    overviewTitle: "Mạng này làm gì",
    overviewBody1:
      "Mạng cung cấp xác minh bảo vệ quyền riêng tư. Một cơ quan tin cậy xác minh thông tin người dùng đúng một lần.",
    overviewBody2:
      "Sau đó dữ liệu được mã hóa và gửi vào mạng nút độc lập để lưu trữ và thực thi logic mà không biết dữ liệu gốc.",

    guaranteesTitle: "Cam kết thiết kế",
    guarantees: [
      "Xác minh tin cậy một lần",
      "Lưu giữ dữ liệu phi tập trung",
      "Mã hóa dữ liệu và vật liệu khóa",
      "Nút có thể kiểm toán & tuân thủ",
      "Chỉ trả lời nhị phân (có/không)",
    ],

    authorityTitle: "Cơ quan xác minh tin cậy",
    authorityBody1:
      "Một cơ quan duy nhất có độ tin cậy cao xác minh dữ liệu người dùng cung cấp (thuộc tính định danh/giấy tờ).",
    authorityBody2:
      "Việc xác minh diễn ra một lần. Sau khi đưa lên mạng, cơ quan không tham gia lưu trữ, truy xuất hay ra quyết định.",

    storageTitle: "Lưu trữ mã hóa & phân tán",
    storageBody1:
      "Dữ liệu đã xác minh được mã hóa trước khi phân phối lên các nút độc lập do nhiều bên vận hành.",
    storageBody2:
      "Khóa cũng được bảo vệ và phân tán để không nút nào có thể tự truy cập hoặc khôi phục dữ liệu.",

    requestsTitle: "Yêu cầu xác minh",
    requestCardTitle: "Yêu cầu",
    requestCardBody:
      "Bên xác minh gửi yêu cầu cho một điều kiện cụ thể (vd: “Người dùng trên 18 tuổi?”).",
    executionCardTitle: "Thực thi",
    executionCardBody:
      "Các nút tạm thời tái tạo quyền truy cập vào vật liệu mã hóa để đánh giá điều kiện.",
    responseCardTitle: "Phản hồi",
    responseCardBody:
      "Chỉ trả về kết quả có/không — không lộ dữ liệu.",

    trustTitle: "Mô hình tin cậy & bảo mật",
    trustBody1:
      "Hệ thống giả định mức tin cậy tối thiểu: cơ quan xác minh ban đầu làm đúng.",
    trustBody2:
      "Sau đó, phi tập trung đảm bảo không một thực thể nào có thể truy cập, sửa đổi hay lạm dụng dữ liệu — kể cả cơ quan.",
  },
};

function normalizeLang(v: string | null): Lang {
  const x = (v || "en").toLowerCase();
  if (x === "zh" || x === "zh-cn" || x === "cn") return "zh";
  if (x === "es") return "es";
  if (x === "fr") return "fr";
  if (x === "ja") return "ja";
  if (x === "ko") return "ko";
  if (x === "vi") return "vi";
  return "en";
}

export default function Home() {
  const sp = useSearchParams();
  const lang = normalizeLang(sp.get("lang"));
  const t = content[lang] ?? content.en;
  const q = `?lang=${lang}`;

  return (
    <section className="flex flex-col gap-20">
      {/* Hero */}
      <div className="flex flex-col gap-6 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-mono font-semibold">
          {t.heroTitle}
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-400">
          {t.heroDesc}
        </p>

        <div className="flex gap-4 mt-4">
          <Link
            href={`/docs${q}`}
            className="px-6 py-3 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition font-mono"
          >
            {t.readDocs}
          </Link>

          <Link
            href={`/register${q}`}
            className="px-6 py-3 border border-gray-400 dark:border-gray-600 hover:border-green-500 hover:text-green-400 transition font-mono"
          >
            {t.joinNetwork}
          </Link>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-300 dark:bg-gray-700" />

      {/* Overview */}
      <div className="grid md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-2xl font-mono mb-4 text-green-500">
            {t.overviewTitle}
          </h2>

          <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
            {t.overviewBody1}
            <br />
            <br />
            {t.overviewBody2}
          </p>
        </div>

        <div className="border border-gray-300 dark:border-gray-700 p-6">
          <h3 className="font-mono mb-3 text-green-400">
            {t.guaranteesTitle}
          </h3>

          <ul className="space-y-2 text-gray-700 dark:text-gray-400 list-disc list-inside">
            {t.guarantees.map((g: string) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Trusted Authority */}
      <div className="max-w-5xl">
        <h2 className="text-2xl font-mono mb-4 text-green-500">
          {t.authorityTitle}
        </h2>

        <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
          {t.authorityBody1}
          <br />
          <br />
          {t.authorityBody2}
        </p>
      </div>

      {/* Storage & Encryption */}
      <div className="max-w-5xl">
        <h2 className="text-2xl font-mono mb-4 text-green-500">
          {t.storageTitle}
        </h2>

        <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
          {t.storageBody1}
          <br />
          <br />
          {t.storageBody2}
        </p>
      </div>

      {/* Verification Queries */}
      <div>
        <h2 className="text-2xl font-mono mb-6 text-green-500">
          {t.requestsTitle}
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="border border-gray-300 dark:border-gray-700 p-5">
            <h4 className="font-mono text-green-400 mb-2">
              {t.requestCardTitle}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t.requestCardBody}
            </p>
          </div>

          <div className="border border-gray-300 dark:border-gray-700 p-5">
            <h4 className="font-mono text-green-400 mb-2">
              {t.executionCardTitle}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t.executionCardBody}
            </p>
          </div>

          <div className="border border-gray-300 dark:border-gray-700 p-5">
            <h4 className="font-mono text-green-400 mb-2">
              {t.responseCardTitle}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t.responseCardBody}
            </p>
          </div>
        </div>
      </div>

      {/* Trust Model */}
      <div className="border border-gray-300 dark:border-gray-700 p-8 max-w-5xl">
        <h2 className="text-2xl font-mono mb-4 text-green-500">
          {t.trustTitle}
        </h2>

        <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
          {t.trustBody1}
          <br />
          <br />
          {t.trustBody2}
        </p>
      </div>
    </section>
  );
}

