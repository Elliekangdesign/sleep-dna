"use client";

import Link from "next/link";
import { motion } from "framer-motion";


const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" as const },
  }),
};

const reviews = [
  {
    text: "내가 왜 잠을 못 자는지 타고난 이유가 있었다니... 사주팔자처럼 수면에도 기질이 있다는 게 처음엔 반신반의했는데, 읽다 보니 소름이었어요.",
    author: "30대 직장인",
  },
  {
    text: "그냥 많이 자면 될 줄 알았거든요. 근데 내 기질에 따라 수면법이 다르다는 게 진짜 너무 신기했어요. 친구한테 바로 공유했어요.",
    author: "20대 대학원생",
  },
  {
    text: "밤마다 생각이 너무 많아서 잠을 못 잤는데, 그게 반추형 기질이라는 이름이 있을 줄은 몰랐어요. 드디어 내 수면 문제에 이름이 생긴 기분이에요.",
    author: "30대 프리랜서",
  },
  {
    text: "8시간 자도 항상 피곤했는데 이유를 몰랐어요. 수면 DNA 보고 나서 시간이 아니라 구조가 문제라는 걸 알았어요. 이렇게 나를 잘 설명한 콘텐츠는 처음이에요.",
    author: "40대 주부",
  },
  {
    text: "사주에 수면 기질이 담겨있다는 발상 자체가 너무 흥미로워서 반쯤 재미로 봤는데, 결과가 너무 나여서 당황했어요. 결국 앱도 깔았어요.",
    author: "20대 직장인",
  },
  {
    text: "별자리 리포트처럼 나에 대한 이야기를 읽는 건데 수면 이야기라는 게 신선했어요. 남편한테 보여줬더니 남편 것도 해보겠다고 했어요.",
    author: "40대 교사",
  },
];

const steps = [
  {
    emoji: "🌙",
    title: "태어난 날의 기운",
    desc: "사주와 별자리에 담긴 기질 정보로 타고난 수면 리듬의 방향을 읽어요",
  },
  {
    emoji: "💬",
    title: "5가지 수면 행동 질문",
    desc: "실제로 어떻게 자고 있는지 답해주세요. 기질 분석의 정밀도를 높여줘요",
  },
  {
    emoji: "🧬",
    title: "나만의 수면 DNA 도출",
    desc: "두 정보를 교차 분석해서 왜 그렇게 자는지를 설명해드려요",
  },
];

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="relative z-10 max-w-[430px] mx-auto px-5 py-12">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <span className="font-sans text-xl text-white tracking-wide">
            🧬 수면 DNA
          </span>
        </motion.div>

        {/* Hero */}
        <section className="mb-24">
          <motion.h1
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-[34px] md:text-[44px] leading-[1.4] text-white mb-6"
            style={{ fontFamily: "'BMKiranghaerang', sans-serif" }}
          >
            나는 왜 이렇게
            <br />
            잠을 못 자는 걸까 ..?
          </motion.h1>

          <motion.div
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-[15px] md:text-[16px] text-text-muted leading-[1.8] mb-8 break-keep"
          >
            <p>
              태어난 날, 태어난 시간 — 그 안에 내가 왜 잠을 못 자는지,
              얼마나 자야 피로가 풀리는지가 이미 새겨져 있어요.
            </p>
            <p className="mt-4">
              타고난 나의 수면 DNA, 지금 바로 찾아보세요.
            </p>
          </motion.div>

          <motion.div
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 bg-primary text-white text-base font-medium
                         px-8 py-4 rounded-full hover:brightness-110 transition-all"
            >
              내 수면 DNA 찾아보기 →
            </Link>
            <p className="text-text-muted text-sm mt-4">
              생년월일 + 질문 5개 · 약 3분 · 무료
            </p>
          </motion.div>
        </section>

        {/* Bridge */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-24 text-center py-12"
        >
          <h2 className="text-[22px] md:text-[26px] font-light text-white mb-6 leading-snug break-keep">
            사주와 별자리는 성격만 말해주는 게 아니에요
          </h2>
          <p className="text-text-muted text-[15px] md:text-base leading-[1.9] max-w-[560px] mx-auto break-keep">
            태어난 날의 기운은 내 기질을 만들고, 그 기질은 잠드는 방식,
            깨는 패턴, 회복하는 리듬까지 이어져요.
            <br /><br />
            밤형 기질로 태어난 사람이 억지로 일찍 자려 할 때 생기는 일,
            예민한 감각으로 태어난 사람이 시끄러운 환경에서 자야 할 때
            생기는 일 — 이건 의지력 문제가 아니에요.
            타고난 수면 DNA가 달라서예요.
            <br /><br />
            나에게 맞는 잠을 자려면, 먼저 내 수면 DNA가 어떻게 생겼는지 알아야 해요.
          </p>
        </motion.section>

        {/* Social Proof */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <p className="text-text-muted text-sm text-center mb-6">
            지금까지{" "}
            <span className="text-primary font-semibold">247,000</span>명이
            자신의 수면 DNA를 확인했습니다
          </p>
          <div className="flex flex-col gap-3">
            {reviews.map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="bg-surface border border-border rounded-2xl p-5"
              >
                <p className="text-yellow-400 text-xs mb-2">⭐⭐⭐⭐⭐</p>
                <p className="text-text-base text-sm leading-relaxed mb-3 break-keep">
                  &ldquo;{review.text}&rdquo;
                </p>
                <p className="text-text-muted text-xs">— {review.author}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* How it works */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <h2 className="font-sans text-2xl text-white mb-8 text-center">
            어떻게 수면 DNA를 찾아내나요?
          </h2>
          <div className="flex flex-col gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-surface border border-border rounded-2xl p-6"
              >
                <div className="text-2xl mb-2">{step.emoji}</div>
                <h3 className="text-white font-medium mb-1">{step.title}</h3>
                <p className="text-text-muted text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Bottom CTA */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-sans text-2xl text-white mb-6">
            지금 바로 내 수면 DNA를
            <br />
            확인해보세요
          </h2>
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 bg-primary text-white text-base font-medium
                       px-8 py-4 rounded-full hover:brightness-110 transition-all"
          >
            무료로 분석 시작하기 →
          </Link>
          <p className="text-text-muted text-xs mt-4">
            의료 진단이 아닙니다
          </p>
        </motion.section>

        {/* Footer */}
        <footer className="text-center text-text-muted text-xs leading-relaxed py-8 border-t border-border">
          <p>
            의료 진단이 아니며, 수면 장애가 의심되는 경우 전문 의료기관을
            방문해주세요.
          </p>
          <p className="mt-3">© 2025 수면 DNA. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
