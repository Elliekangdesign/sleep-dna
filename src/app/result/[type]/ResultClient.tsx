"use client";

import { use, Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

import { sleepTypes } from "@/data/sleepTypes";
import { getAgeGroup } from "@/data/ageGroups";
import { getPersonalizedCards } from "@/utils/personalizedCTA";

const catImages = [
  "/images/cat-1.jpg",
  "/images/cat-2.jpg",
  "/images/cat-3.jpg",
  "/images/cat-4.jpg",
  "/images/cat-5.jpg",
];

function replaceNamePlaceholder(text: string, name: string): string {
  return text.replace(/\{name\}/g, name);
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function ResultContent({ params }: { params: Promise<{ type: string }> }) {
  const { type } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const name = searchParams.get("name") || "당신";

  const data = sleepTypes[type] || sleepTypes["delayed-hyperarousal"];
  const birthYear = parseInt(searchParams.get("birthYear") || "1995", 10);
  const ageGroup = getAgeGroup(birthYear);
  const personalizedCards = getPersonalizedCards(
    type,
    data.name,
    ageGroup.range,
    name
  );

  const [randomImage, setRandomImage] = useState(catImages[0]);
  useEffect(() => {
    setRandomImage(catImages[Math.floor(Math.random() * catImages.length)]);
  }, []);

  const metricLabels = ["잠들기", "야간 각성", "크로노타입", "환경 민감도"];
  const metricValues = [
    data.metrics.sleepOnset,
    data.metrics.nightWaking,
    data.metrics.chronotype,
    data.metrics.envSensitivity,
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("링크가 복사되었습니다!");
    } catch {
      // fallback
      const input = document.createElement("input");
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      alert("링크가 복사되었습니다!");
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="relative z-10 max-w-[430px] mx-auto px-7 py-10">
        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8 overflow-hidden rounded-2xl border border-border aspect-square w-full mx-auto"
        >
          <Image
            src={randomImage}
            alt="수면 DNA 일러스트"
            width={430}
            height={430}
            className="w-full h-full object-cover"
            priority
          />
        </motion.div>

        {/* Hero */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center mb-12"
        >
          <span className="inline-block bg-surface-bright border border-border rounded-full px-4 py-1.5 text-text-muted text-sm mb-6">
            🧬 수면 DNA 분석 결과
          </span>

          <p className="text-xl text-text-base font-light mb-2">
            {name}님의 수면 DNA는
          </p>

          <h1 className="text-[28px] md:text-[36px] font-bold text-primary mb-2 leading-tight">
            {data.emoji} {data.name}
          </h1>

          <p className="text-text-muted text-sm mb-2">{data.englishName}</p>
          <p className="text-text-muted text-base mt-4">
            &ldquo;{data.oneLiner}&rdquo;
          </p>
        </motion.section>

        {/* Metric cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="grid grid-cols-2 gap-3 mb-8"
        >
          {metricLabels.map((label, i) => (
            <div
              key={label}
              className="bg-surface border border-border rounded-2xl p-4 text-center"
            >
              <p className="text-text-muted text-xs mb-1">{label}</p>
              <p className="text-text-base font-medium text-sm">
                {metricValues[i]}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Disclaimer banner */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="bg-surface-bright border-l-2 border-primary rounded-lg p-4 mb-12"
        >
          <p className="text-text-muted text-[15px] leading-[1.75] break-keep">
            이 분석은 사주·별자리 기반 기질 데이터와 수면 행동 패턴을 교차
            분석한 리포트예요. 의료 진단이 아니며, 실제 수면 측정
            데이터가 아닙니다. 더 정확한 분석은 앱에서 실제 수면 측정으로
            확인할 수 있어요.
          </p>
        </motion.div>

        {/* Sections */}
        {data.sections.map((section, i) => (
          <motion.section
            key={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
            className="mb-12"
          >
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
              {replaceNamePlaceholder(section.title, name)}
            </h2>
            <div className="bg-surface border border-border rounded-2xl p-6">
              {replaceNamePlaceholder(section.content, name)
                .split("\n\n")
                .map((para, j) => (
                  <p
                    key={j}
                    className="text-text-base text-[15px] leading-[1.9] mb-4 last:mb-0 break-keep"
                  >
                    {para}
                  </p>
                ))}
            </div>
          </motion.section>
        ))}

        {/* Cautions */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mb-12"
        >
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-warning inline-block" />
            이런 점은 알고 있는 게 좋아요
          </h2>
          <div className="flex flex-col gap-3">
            {data.cautions.map((caution, i) => (
              <div
                key={i}
                className="bg-surface border border-border rounded-2xl p-5"
              >
                <p className="text-warning text-sm font-medium mb-2">
                  ⚠️ {replaceNamePlaceholder(caution.title, name)}
                </p>
                <p className="text-text-muted text-[15px] leading-[1.75] break-keep">
                  {replaceNamePlaceholder(caution.description, name)}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Recommendations */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mb-12"
        >
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
            {name}님에게 맞는 수면 환경이에요
          </h2>
          <div className="flex flex-col gap-3">
            {data.recommendations.map((rec, i) => (
              <div
                key={i}
                className="bg-surface border border-border rounded-2xl p-5"
              >
                <p className="text-success text-sm font-medium mb-2">
                  ✓ {replaceNamePlaceholder(rec.title, name)}
                </p>
                <p className="text-text-muted text-[15px] leading-[1.75] break-keep">
                  {replaceNamePlaceholder(rec.description, name)}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Section 7: Age-based sleep changes */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mb-12"
        >
          <p className="text-text-muted text-xs mb-2">07</p>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block" />
            지금 이 시기, 수면이 바뀌는 중이에요
          </h2>

          <span className="inline-block border border-primary/40 text-primary rounded-full px-4 py-1.5 text-sm mb-4">
            {ageGroup.badge}
          </span>

          <p className="text-secondary text-[17px] font-light mb-6 break-keep leading-relaxed">
            &ldquo;{ageGroup.summary}&rdquo;
          </p>

          <div className="border-t border-border mb-6" />

          <div className="bg-surface border border-border rounded-2xl p-6 mb-4">
            {ageGroup.body.split("\n\n").map((para, j) => (
              <p
                key={j}
                className="text-text-base text-[15px] leading-[1.9] mb-4 last:mb-0 break-keep"
              >
                {para}
              </p>
            ))}
          </div>

          <div className="bg-surface-bright border-l-2 border-success rounded-lg p-5">
            <p className="text-success text-sm font-medium mb-2">💡 이 시기에 특히</p>
            <p className="text-text-muted text-[15px] leading-[1.75] break-keep">
              {ageGroup.highlight}
            </p>
          </div>
        </motion.section>

        {/* Personalized CTA */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="bg-surface rounded-2xl border border-border p-6 py-12 mb-12"
        >
          <div className="text-center mb-8">
            <span className="inline-block border border-warning/40 text-warning rounded-full px-4 py-1.5 text-sm mb-5">
              ✦ {name}님만을 위한 분석이 준비되어 있어요
            </span>

            <h2 className="text-[24px] font-light text-white mb-4 leading-snug break-keep">
              {name}님의 수면,<br />더 깊이 들여다볼 수 있어요
            </h2>

            <p className="text-text-muted text-[15px] leading-[1.9] break-keep">
              지금까지 본 분석은 기질과 연령대 기반이에요.<br />
              실제로 {name}님이 어떻게 자는지는 아직 아무도 몰라요.
            </p>
          </div>

          <div className="flex flex-col gap-3 mb-8">
            {personalizedCards.map((card, i) => (
              <div
                key={i}
                className="bg-surface-bright border-l-[3px] border-primary rounded-xl p-5"
              >
                <p className="text-white text-sm font-medium mb-2">
                  {card.emoji} {card.title}
                </p>
                <p className="text-text-muted text-[15px] leading-[1.75] break-keep">
                  {card.description}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-border mb-8" />

          <div className="text-center">
            <button className="bg-primary text-white font-medium px-6 py-3.5 rounded-full text-[15px] hover:brightness-110 transition-all w-full mb-3">
              {name}님에게 맞는 숙면 방법 앱에서 확인하기 →
            </button>
            <p className="text-text-muted text-[13px] mb-2">
              App Store · Google Play · 무료 다운로드
            </p>
            <p className="text-text-muted text-[11px]">
              * 앱 링크는 프로토타입 기준 # 처리. 실제 배포 시 스토어 URL로 교체.
            </p>
          </div>
        </motion.section>

        {/* Share section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mb-12"
        >
          <h2 className="text-xl font-semibold text-white mb-6 text-center">
            내 수면 DNA, 친구는 어떨까요?
          </h2>

          <div className="bg-surface border border-border rounded-2xl p-6 mb-6">
            <p className="text-text-base text-sm leading-relaxed whitespace-pre-line">
              {replaceNamePlaceholder(data.shareText, name)}
            </p>
            <p className="text-primary text-xs mt-3">sleepmirror.kr</p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            <button className="bg-[#FEE500] text-[#3C1E1E] font-medium px-5 py-2.5 rounded-full text-sm hover:brightness-95 transition-all">
              카카오톡 공유
            </button>
            <button
              onClick={handleCopyLink}
              className="bg-surface-bright border border-border text-text-base font-medium px-5 py-2.5 rounded-full text-sm hover:border-primary/50 transition-all"
            >
              링크 복사
            </button>
            <button className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white font-medium px-5 py-2.5 rounded-full text-sm hover:brightness-95 transition-all">
              인스타그램
            </button>
          </div>
        </motion.section>

        {/* App CTA */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="bg-surface rounded-2xl border border-border p-6 py-16 md:py-20 text-center mb-12"
        >
          <span className="inline-block border border-secondary/40 text-secondary rounded-full px-4 py-1.5 text-xs mb-6">
            📱 앱으로 더 정확하게
          </span>

          <h2 className="text-[26px] md:text-[32px] font-light text-white mb-5 leading-[1.5] break-keep">
            지금 본 건 기질 분석이에요.
            <br />
            진짜 내 수면은 앱으로 확인하세요.
          </h2>

          <p className="text-text-muted text-[15px] leading-[1.9] mb-10 max-w-[500px] mx-auto break-keep">
            수면 DNA 앱은 잠든 동안의 숨소리를 분석해서 실제로 얼마나 깊이
            잤는지, 몇 번 깼는지, 어떤 수면 단계에서 시간을 보냈는지를 측정해요.
            기질 분석 + 실제 데이터가 만나면, 나에게 맞는 진짜 숙면 방법을 찾을
            수 있어요.
          </p>

          <div className="flex flex-col gap-3 mb-10">
            <div className="bg-surface-bright border border-border rounded-xl p-5 text-left">
              <p className="text-white text-sm font-medium mb-2">
                🎙️ 숨소리 기반 정밀 수면 분석
              </p>
              <p className="text-text-muted text-[15px] leading-[1.75] break-keep">
                자는 동안 스마트폰 마이크가 호흡 패턴을 감지해요. 수면 단계, 각성
                시간, 수면 효율을 매일 아침 리포트로 받아보세요.
              </p>
            </div>
            <div className="bg-surface-bright border border-border rounded-xl p-5 text-left">
              <p className="text-white text-sm font-medium mb-2">
                📋 나만의 수면 리포트 + 전문가 상담
              </p>
              <p className="text-text-muted text-[15px] leading-[1.75] break-keep">
                누적된 수면 데이터를 바탕으로 수면 전문가와 1:1 상담을 받을 수
                있어요.
              </p>
            </div>
            <div className="bg-surface-bright border border-border rounded-xl p-5 text-left">
              <p className="text-white text-sm font-medium mb-2">
                🧬 수면 DNA 기질 맞춤 숙면 가이드
              </p>
              <p className="text-text-muted text-[15px] leading-[1.75] break-keep">
                분석된 수면 기질에 맞는 취침 루틴과 환경 세팅 가이드를 매일
                업데이트해드려요.
              </p>
            </div>
          </div>

          <div className="border-t border-border mb-8" />

          <span className="inline-block bg-warning text-white text-xs font-medium rounded-full px-4 py-1.5 mb-4">
            ✦ 지금 다운로드하면 7일 무료
          </span>

          <button className="block w-full bg-primary text-white font-medium py-4 rounded-full text-base hover:brightness-110 transition-all mb-3">
            7일 무료로 시작하기 →
          </button>

          <p className="text-text-muted text-[13px]">
            App Store · Google Play · 무료 체험
          </p>
        </motion.section>

        {/* Retry */}
        <div className="text-center mb-10">
          <button
            onClick={() => {
              localStorage.removeItem("sleepDnaQuiz");
              router.push("/");
            }}
            className="bg-surface-bright border border-border text-text-base font-medium px-8 py-3.5 rounded-full hover:border-primary/50 transition-all"
          >
            다시 하기
          </button>
        </div>

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

export default function ResultClient({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ background: "#070712" }}
        >
          <p className="text-text-muted">결과 로딩 중...</p>
        </div>
      }
    >
      <ResultContent params={params} />
    </Suspense>
  );
}
