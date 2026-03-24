"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const loadingTexts = [
  "수면 DNA 분석 중...",
  "생체 리듬 패턴 읽는 중",
  "각성 반응 수치 계산 중",
  "환경 민감도 매핑 중",
  "나만의 수면 DNA를 찾았습니다",
];

function LoadingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentText, setCurrentText] = useState(0);

  const type = searchParams.get("type") || "delayed-hyperarousal";
  const name = searchParams.get("name") || "당신";
  const birthYear = searchParams.get("birthYear") || "1995";

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    loadingTexts.forEach((_, i) => {
      if (i > 0) {
        timeouts.push(setTimeout(() => setCurrentText(i), i * 800));
      }
    });

    const nav = setTimeout(() => {
      router.push(`/result/${type}?name=${encodeURIComponent(name)}&birthYear=${birthYear}`);
    }, loadingTexts.length * 800 + 1000);

    return () => {
      timeouts.forEach(clearTimeout);
      clearTimeout(nav);
    };
  }, [router, type, name, birthYear]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
          style={{ background: '#070712' }}>
      {/* Wave animation */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-primary/20"
            initial={{ width: 40, height: 40, opacity: 0.6 }}
            animate={{
              width: [40, 300 + i * 80],
              height: [40, 300 + i * 80],
              opacity: [0.4, 0],
            }}
            transition={{
              duration: 3,
              delay: i * 0.6,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Text */}
      <div className="relative z-10 text-center px-5">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentText}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className={`text-lg ${
              currentText === loadingTexts.length - 1
                ? "text-primary font-medium"
                : "text-text-muted"
            }`}
          >
            {loadingTexts[currentText]}
          </motion.p>
        </AnimatePresence>
      </div>
    </main>
  );
}

export default function LoadingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#070712' }}>
          <p className="text-text-muted">로딩 중...</p>
        </div>
      }
    >
      <LoadingContent />
    </Suspense>
  );
}
