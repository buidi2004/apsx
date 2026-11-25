"use client";

import dynamic from "next/dynamic";

const RogFlowZ13KjpOverview = dynamic(
  () => import("@/components/sites/rog-asus/flow-z13-kjp/RogFlowZ13KjpOverview")
);
const RogZephyrusG16Gu605Overview = dynamic(
  () => import("@/components/sites/rog-asus/zephyrus-g16/RogZephyrusG16Gu605Overview")
);
const RogZephyrusDuo2026Overview = dynamic(
  () => import("@/components/sites/rog-asus/zephyrus-duo-2026/RogZephyrusDuo2026Overview")
);
const RogScar18Overview = dynamic(
  () => import("@/components/sites/rog-asus/scar-18-2026/RogScar18Overview")
);
const RogCardMatrix5090Overview = dynamic(
  () => import("@/components/sites/rog-asus/matrix-5090/RogCardMatrix5090Overview")
);
const RogPhone7Overview = dynamic(
  () => import("@/components/sites/rog-asus/rog-phone-7/RogPhone7Overview")
);
const RogXg259qnsrAceOverview = dynamic(
  () => import("@/components/sites/rog-asus/xg259qnsr-ace/RogXg259qnsrAceOverview")
);
const RogAlly2023Overview = dynamic(
  () => import("@/components/sites/rog-asus/rog-ally-2023/RogAlly2023Overview")
);


export default function RogCustomFlagshipDispatcher({ routeKey }: { routeKey: string }) {
  switch (routeKey) {
    case "laptops/rog-zephyrus/rog-zephyrus-duo-2026":
      return <RogZephyrusDuo2026Overview />;
    case "laptops/rog-flow/rog-flow-z13-kjp":
      return <RogFlowZ13KjpOverview />;
    case "laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605":
      return <RogZephyrusG16Gu605Overview />;
    case "laptops/rog-strix/rog-strix-scar-18-2026":
      return (
        <RogScar18Overview
          productName="ROG Strix SCAR 18 (2026) G835"
          price="139.990.000 ₫"
          basePath="/vn/laptops/rog-strix/rog-strix-scar-18-2026"
        />
      );
    case "graphics-cards/rog-matrix/rog-matrix-rtx5090-p32g-30th":
      return <RogCardMatrix5090Overview />;
    case "phones/rog-phone-7":
      return (
        <RogPhone7Overview
          productName="ROG Phone 7"
          price="24.990.000 ₫"
          basePath="/vn/phones/rog-phone-7"
        />
      );
    case "monitors/23-to-24-5-inches/rog-strix-xg259qnsr-ace":
      return (
        <RogXg259qnsrAceOverview
          productName="ROG Strix XG259QNSR Ace"
          price="14.990.000 ₫"
          basePath="/vn/monitors/23-to-24-5-inches/rog-strix-xg259qnsr-ace"
        />
      );
    default:
      return <RogAlly2023Overview />;
  }
}
