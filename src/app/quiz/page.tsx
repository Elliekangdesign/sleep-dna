"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { calculateSleepType } from "@/utils/typeCalculator";

const questions = [
  {
    question: "침대에 눕고 나서, 보통 잠드는 데 얼마나 걸려요?",
    options: [
      "5분도 안 걸려요 (눕자마자 잠드는 편)",
      "10~20분 정도요 (큰 불편 없이 잠들어요)",
      "30분에서 1시간 (좀 오래 걸리는 것 같아요)",
      "1시간 넘어요 (잠드는 게 너무 힘들어요)",
    ],
  },
  {
    question: "자다가 중간에 깨는 경우가 있나요?",
    options: [
      "거의 안 깨요 (한 번 자면 아침까지 자요)",
      "가끔 한 번 깨요",
      "자주 깨긴 하는데, 금방 다시 잠들어요",
      "자주 깨고, 다시 잠드는 게 힘들어요",
    ],
  },
  {
    question: "나는 아침형 인간인가요, 밤형 인간인가요?",
    options: [
      "아침형이에요 — 일찍 자고 일찍 일어나는 게 자연스러워요",
      "딱히 어느 쪽도 아니에요 — 그냥 중간인 것 같아요",
      "밤형이에요 — 밤이 되면 오히려 더 또렷해져요",
      "날마다 달라요 — 패턴이 없어서 모르겠어요",
    ],
  },
  {
    question: "자는 동안 주변 자극에 얼마나 민감해요?",
    options: [
      "별로 예민하지 않아요 (웬만큼 자도 잘 자는 편)",
      "약간 예민해요 (큰 소리엔 깨요)",
      "꽤 예민해요 (작은 소리나 빛 때문에 깨기도 해요)",
      "많이 예민해요 (온도, 냄새, 옆 사람 숨소리까지 신경 쓰여요)",
    ],
  },
  {
    question: "침대에 누우면 머릿속이 어떤 상태예요?",
    options: [
      "거의 비어있어요 — 그냥 스르르 잠들어요",
      "생각이 조금 있긴 한데, 금방 사라져요",
      "생각이 꽤 많아요 — 오늘 하루가 자꾸 머릿속에서 재생돼요",
      "멈추질 않아요 — 걱정이나 계획이 줄줄이 이어져요",
    ],
  },
];

const slideVariants = {
  enter: { x: 40, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -40, opacity: 0 },
};

export default function QuizPage() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0=name, 1=birthday, 2~6=questions
  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthHour, setBirthHour] = useState("");
  const [birthMinute, setBirthMinute] = useState("");
  const [unknownTime, setUnknownTime] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sleepDnaQuiz");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.name) setName(data.name);
        if (data.birthYear) setBirthYear(data.birthYear);
        if (data.birthMonth) setBirthMonth(data.birthMonth);
        if (data.birthDay) setBirthDay(data.birthDay);
        if (data.answers) setAnswers(data.answers);
      } catch {
        // ignore
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(
      "sleepDnaQuiz",
      JSON.stringify({ name, birthYear, birthMonth, birthDay, answers })
    );
  }, [name, birthYear, birthMonth, birthDay, answers]);

  const totalSteps = 7;
  const progress = ((step + 1) / totalSteps) * 100;

  const handleAnswer = useCallback(
    (idx: number) => {
      const newAnswers = [...answers, idx];
      setAnswers(newAnswers);

      if (newAnswers.length === 5) {
        // All questions answered
        const type = calculateSleepType(newAnswers);
        setTimeout(() => {
          router.push(
            `/loading?type=${type}&name=${encodeURIComponent(name || "당신")}&birthYear=${birthYear}`
          );
        }, 500);
      } else {
        setTimeout(() => setStep(step + 1), 500);
      }
    },
    [answers, step, name, router]
  );

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 80 }, (_, i) => currentYear - 15 - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-border">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>

      <div className="relative z-10 max-w-[430px] mx-auto px-7 py-20 min-h-screen flex items-center">
        <AnimatePresence mode="wait">
          {/* Step 0: Name */}
          {step === 0 && (
            <motion.div
              key="name"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <div className="bg-surface border border-border rounded-2xl p-8">
                <h2 className="font-sans text-2xl text-white mb-2">
                  먼저, 뭐라고 불러드릴까요?
                </h2>
                <p className="text-text-muted text-sm mb-8">
                  닉네임도 괜찮아요 :)
                </p>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름 또는 닉네임"
                  className="w-full bg-surface-bright border border-border rounded-xl px-4 py-3.5
                           text-text-base placeholder:text-text-muted/50 outline-none
                           focus:border-primary transition-colors text-base"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && name.trim()) setStep(1);
                  }}
                />
                <p className="text-text-muted text-xs mt-3">
                  이름은 리포트에서 호칭으로만 사용돼요
                </p>

                <button
                  onClick={() => setStep(1)}
                  disabled={!name.trim()}
                  className="w-full mt-6 bg-primary text-white font-medium py-3.5 rounded-full
                           disabled:opacity-30 disabled:cursor-not-allowed
                           hover:brightness-110 transition-all"
                >
                  시작하기 →
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 1: Birthday */}
          {step === 1 && (
            <motion.div
              key="birthday"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <div className="bg-surface border border-border rounded-2xl p-8">
                <h2 className="font-sans text-2xl text-white mb-2">
                  {name}님의 생년월일을 알려주세요
                </h2>
                <p className="text-text-muted text-sm mb-8">
                  태어난 날과 시간이 수면 DNA 분석의 기준이 돼요
                </p>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  <select
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    className="bg-surface-bright border border-border rounded-xl px-3 py-3.5
                             text-text-base outline-none focus:border-primary transition-colors"
                  >
                    <option value="">년도</option>
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}년
                      </option>
                    ))}
                  </select>
                  <select
                    value={birthMonth}
                    onChange={(e) => setBirthMonth(e.target.value)}
                    className="bg-surface-bright border border-border rounded-xl px-3 py-3.5
                             text-text-base outline-none focus:border-primary transition-colors"
                  >
                    <option value="">월</option>
                    {months.map((m) => (
                      <option key={m} value={m}>
                        {m}월
                      </option>
                    ))}
                  </select>
                  <select
                    value={birthDay}
                    onChange={(e) => setBirthDay(e.target.value)}
                    className="bg-surface-bright border border-border rounded-xl px-3 py-3.5
                             text-text-base outline-none focus:border-primary transition-colors"
                  >
                    <option value="">일</option>
                    {days.map((d) => (
                      <option key={d} value={d}>
                        {d}일
                      </option>
                    ))}
                  </select>
                </div>

                <p className="text-text-muted text-sm mb-3">
                  시간을 알면 더 정확해요 (선택)
                </p>
                <div className="flex items-center gap-3 mb-4">
                  <select
                    value={birthHour}
                    onChange={(e) => setBirthHour(e.target.value)}
                    disabled={unknownTime}
                    className="flex-1 bg-surface-bright border border-border rounded-xl px-3 py-3.5
                             text-text-base outline-none focus:border-primary transition-colors
                             disabled:opacity-30"
                  >
                    <option value="">시</option>
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>
                        {i}시
                      </option>
                    ))}
                  </select>
                  <select
                    value={birthMinute}
                    onChange={(e) => setBirthMinute(e.target.value)}
                    disabled={unknownTime}
                    className="flex-1 bg-surface-bright border border-border rounded-xl px-3 py-3.5
                             text-text-base outline-none focus:border-primary transition-colors
                             disabled:opacity-30"
                  >
                    <option value="">분</option>
                    {[0, 10, 20, 30, 40, 50].map((m) => (
                      <option key={m} value={m}>
                        {m}분
                      </option>
                    ))}
                  </select>
                </div>
                <label className="flex items-center gap-2 text-text-muted text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={unknownTime}
                    onChange={(e) => {
                      setUnknownTime(e.target.checked);
                      if (e.target.checked) {
                        setBirthHour("");
                        setBirthMinute("");
                      }
                    }}
                    className="accent-primary w-4 h-4"
                  />
                  모름
                </label>

                <button
                  onClick={() => setStep(2)}
                  disabled={!birthYear || !birthMonth || !birthDay}
                  className="w-full mt-6 bg-primary text-white font-medium py-3.5 rounded-full
                           disabled:opacity-30 disabled:cursor-not-allowed
                           hover:brightness-110 transition-all"
                >
                  다음 →
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2~6: Questions */}
          {step >= 2 && step <= 6 && (
            <motion.div
              key={`q-${step}`}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <div className="mb-6">
                <span className="inline-block bg-surface-bright border border-border rounded-full px-4 py-1.5 text-text-muted text-sm">
                  질문 {step - 1} / 5
                </span>
              </div>

              <h2 className="font-sans text-xl md:text-2xl text-white mb-8 leading-relaxed">
                {questions[step - 2].question}
              </h2>

              <div className="flex flex-col gap-3">
                {questions[step - 2].options.map((option, idx) => {
                  const isSelected = answers[step - 2] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      className={`text-left min-h-[56px] px-5 py-4 rounded-2xl border transition-all text-sm leading-relaxed
                        ${
                          isSelected
                            ? "border-primary bg-primary/10 text-white"
                            : "border-border bg-surface text-text-base hover:border-primary/50"
                        }`}
                    >
                      <span className="text-text-muted mr-2">
                        {["①", "②", "③", "④"][idx]}
                      </span>
                      {option}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
