export type SleepDNAType =
  | "delayed-hyperarousal"
  | "environmental-sensitivity"
  | "ruminative-insomnia"
  | "fragmented-sleep"
  | "early-awakening"
  | "non-restorative"
  | "circadian-dysregulation"
  | "hypersomnolence";

// answers: [Q1, Q2, Q3, Q4, Q5] each 0-3 (index of chosen option)
export function calculateSleepType(answers: number[]): SleepDNAType {
  const [q1, q2, q3, q4, q5] = answers;

  // Q1(잠들기) + Q3(크로노타입) → primary factor
  // Q4(환경민감도) → secondary
  // Q5(취침전 뇌) → tertiary
  // Q2(야간각성) → confirmatory

  // Q1=③④ AND Q5=③④ → ruminative-insomnia
  if (q1 >= 2 && q5 >= 2) return "ruminative-insomnia";

  // Q1=③④ AND Q3=③ → delayed-hyperarousal
  if (q1 >= 2 && q3 === 2) return "delayed-hyperarousal";

  // Q2=③④ AND Q4=③④ → environmental-sensitivity
  if (q2 >= 2 && q4 >= 2) return "environmental-sensitivity";

  // Q2=④ AND Q4=①② → fragmented-sleep
  if (q2 === 3 && q4 <= 1) return "fragmented-sleep";

  // Q3=① AND Q2=③④ → early-awakening
  if (q3 === 0 && q2 >= 2) return "early-awakening";

  // Q3=④ → circadian-dysregulation
  if (q3 === 3) return "circadian-dysregulation";

  // Q1=① AND Q4=① → hypersomnolence
  if (q1 === 0 && q4 === 0) return "hypersomnolence";

  // Q1=①② AND Q2=①② → non-restorative
  if (q1 <= 1 && q2 <= 1) return "non-restorative";

  // fallback
  return "delayed-hyperarousal";
}
