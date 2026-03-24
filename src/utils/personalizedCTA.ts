const typeRoutineTexts: Record<string, string> = {
  "delayed-hyperarousal":
    "밤형 기질을 가진 분들에게 실제로 효과 있는 취침 시각 조정법과 루틴을 앱에서 확인할 수 있어요",
  "ruminative-insomnia":
    "잠들기 전 생각이 많은 분들을 위한 인지 이완 루틴을 앱에서 확인할 수 있어요",
  "environmental-sensitivity":
    "환경 자극에 민감한 분들을 위한 침실 환경 세팅 가이드를 앱에서 확인할 수 있어요",
  "fragmented-sleep":
    "수면이 자주 끊기는 분들을 위한 수면 연속성 개선 루틴을 앱에서 확인할 수 있어요",
  "early-awakening":
    "새벽에 일찍 깨는 분들을 위한 수면 후반부 유지 전략을 앱에서 확인할 수 있어요",
  "non-restorative":
    "자도 피곤한 분들을 위한 수면 효율 개선 방법을 앱에서 확인할 수 있어요",
  "circadian-dysregulation":
    "불규칙한 수면 리듬을 가진 분들을 위한 생체 시계 재설정 방법을 앱에서 확인할 수 있어요",
  hypersomnolence:
    "많이 자도 피곤한 분들을 위한 각성 유지 전략과 루틴을 앱에서 확인할 수 있어요",
};

const ageComparisonTexts: Record<string, string> = {
  "20대": "20대 평균과 비교해서 {name}님의 수면이 어떤 편인지 알 수 있어요",
  "30대":
    "30대 평균과 비교해서 {name}님의 수면 효율이 어떤지 앱에서 볼 수 있어요",
  "40대": "40대 수면 변화 패턴과 {name}님의 기질을 함께 분석해드려요",
  "50대": "50대 수면 특성에 맞는 개인화 분석을 앱에서 확인할 수 있어요",
  "60대 이상":
    "이 시기 수면 변화에 맞는 맞춤 가이드를 앱에서 확인할 수 있어요",
};

export interface PersonalizedCard {
  emoji: string;
  title: string;
  description: string;
}

export function getPersonalizedCards(
  typeKey: string,
  typeName: string,
  ageRange: string,
  name: string
): PersonalizedCard[] {
  return [
    {
      emoji: "🧬",
      title: `${typeName}에 맞는 맞춤 숙면 루틴`,
      description:
        typeRoutineTexts[typeKey] ||
        `${name}님의 수면 기질에 실제로 효과 있는 취침 전 루틴을 앱에서 확인할 수 있어요`,
    },
    {
      emoji: "📊",
      title: `${ageRange} 수면 패턴 상세 분석`,
      description: (
        ageComparisonTexts[ageRange] ||
        `같은 연령대 평균과 비교해서 {name}님의 수면이 어떤 편인지 알 수 있어요`
      ).replace(/\{name\}/g, name),
    },
    {
      emoji: "💤",
      title: "오늘 밤 실제 수면 측정",
      description:
        "잠들기까지 몇 분, 몇 번 깼는지, 수면 효율 몇 %인지 앱으로 오늘 밤 직접 측정해보세요",
    },
  ];
}
