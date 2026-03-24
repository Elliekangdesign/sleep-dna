import ResultClient from "./ResultClient";

export function generateStaticParams() {
  return [
    { type: "delayed-hyperarousal" },
    { type: "environmental-sensitivity" },
    { type: "ruminative-insomnia" },
    { type: "fragmented-sleep" },
    { type: "early-awakening" },
    { type: "non-restorative" },
    { type: "circadian-dysregulation" },
    { type: "hypersomnolence" },
  ];
}

export default function ResultPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  return <ResultClient params={params} />;
}
