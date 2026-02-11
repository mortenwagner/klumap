import { useState, useEffect, useCallback } from "react";

// ─── i18n ───
const TRANSLATIONS = {
  en: {
    title: "The Clueless Corner",
    axisX: "Evidence",
    axisXLow: "Low",
    axisXHigh: "High",
    axisY: "Importance",
    axisYLow: "Low",
    axisYHigh: "High",
    steps: [
      {
        heading: "Mapping Your Assumptions",
        body: "Every venture rests on assumptions — about the market, the solution, the business model. Some are well-supported. Others are just hopes dressed up as plans.",
      },
      {
        quadrant: "known",
        label: "Known Territory",
        heading: "Safe Ground",
        body: "Low importance, high evidence. These are things you know but that don't make or break you. Comfortable, but don't spend too much time here.",
      },
      {
        quadrant: "nice",
        label: "Nice to Know",
        heading: "Low Stakes, Low Data",
        body: "Low importance, low evidence. Interesting unknowns, but not urgent. Park them. They can wait — and might resolve themselves.",
      },
      {
        quadrant: "validated",
        label: "Validated",
        heading: "Earned Confidence",
        body: "High importance, high evidence. The assumptions you've tested and confirmed. These are your foundation — the ground beneath your feet.",
      },
      {
        quadrant: "clueless",
        label: "Clueless Corner",
        heading: "Where Ventures Go to Die",
        body: "High importance, low evidence. Critical assumptions with no backing. This is where you must focus — test these first, or risk building on sand.",
      },
    ],
    nav: {
      start: "Begin",
      next: "Next",
      restart: "Start Over",
      stepOf: "of",
    },
  },
};

const COLORS = {
  bg: "#2a3240",
  textPrimary: "#e8e0d4",
  textSecondary: "#9a9080",
  accent: "#c8956a",
  axisLine: "rgba(255,255,255,0.25)",
  axisLabel: "rgba(255,255,255,0.45)",
  known: { bg: "rgba(74, 106, 138, 0.35)", border: "rgba(74, 106, 138, 0.6)", text: "#7a9aba" },
  nice: { bg: "rgba(122, 138, 122, 0.25)", border: "rgba(122, 138, 122, 0.5)", text: "#8a9a8a" },
  validated: { bg: "rgba(80, 160, 100, 0.3)", border: "rgba(80, 160, 100, 0.6)", text: "#6aba7a" },
  clueless: { bg: "rgba(192, 57, 43, 0.25)", border: "rgba(192, 57, 43, 0.7)", text: "#e04838" },
  cluelessGlow: "rgba(192, 57, 43, 0.15)",
  warningOrange: "#c87840",
};

const TOTAL_STEPS = 5;

const KEYFRAMES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700&family=Space+Mono:wght@400;700&display=swap');

  @keyframes axesDraw {
    0% { stroke-dashoffset: 600; opacity: 0; }
    10% { opacity: 1; }
    100% { stroke-dashoffset: 0; opacity: 1; }
  }

  @keyframes axisLabelFade {
    0% { opacity: 0; transform: translateY(4px); }
    100% { opacity: 1; transform: translateY(0); }
  }

  @keyframes quadrantReveal {
    0% { opacity: 0; transform: scale(0.85); }
    50% { opacity: 1; transform: scale(1.03); }
    70% { transform: scale(0.98); }
    100% { opacity: 1; transform: scale(1); }
  }

  @keyframes quadrantLabelPop {
    0% { opacity: 0; transform: scale(0.5); }
    60% { opacity: 1; transform: scale(1.08); }
    100% { opacity: 1; transform: scale(1); }
  }

  @keyframes cluelessPulse {
    0%, 100% { box-shadow: inset 0 0 30px rgba(192, 57, 43, 0.1), 0 0 0px rgba(192, 57, 43, 0); }
    50% { box-shadow: inset 0 0 50px rgba(192, 57, 43, 0.2), 0 0 30px rgba(192, 57, 43, 0.15); }
  }

  @keyframes warningShake {
    0%, 100% { transform: rotate(0deg); }
    15% { transform: rotate(-8deg); }
    30% { transform: rotate(8deg); }
    45% { transform: rotate(-5deg); }
    60% { transform: rotate(5deg); }
    75% { transform: rotate(-2deg); }
    90% { transform: rotate(2deg); }
  }

  @keyframes textSlideUp {
    0% { transform: translateY(24px); opacity: 0; }
    50% { transform: translateY(-4px); opacity: 1; }
    70% { transform: translateY(2px); }
    100% { transform: translateY(0); opacity: 1; }
  }

  @keyframes btnBounce {
    0% { transform: scale(1); }
    30% { transform: scale(0.93); }
    60% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes crosshatchIn {
    0% { opacity: 0; }
    100% { opacity: 0.08; }
  }
`;

const GRID = 300;
const HALF = GRID / 2;
const PAD = 50;
const SVG_SIZE = GRID + PAD * 2;

export default function CluelessCorner({ lang = "en" }) {
  const [step, setStep] = useState(-1);
  const [btnPressed, setBtnPressed] = useState(false);
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const advance = useCallback(() => {
    setBtnPressed(true);
    setTimeout(() => setBtnPressed(false), 300);
    setStep((s) => (s >= TOTAL_STEPS - 1 ? -1 : s + 1));
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        advance();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [advance]);

  const currentStep = step >= 0 && step < TOTAL_STEPS ? t.steps[step] : null;
  const showAxes = step >= 0;

  // Quadrant visibility: known=1, nice=2, validated=3, clueless=4
  const quadrantMap = { known: 1, nice: 2, validated: 3, clueless: 4 };
  const isQuadrantVisible = (q) => step >= quadrantMap[q];

  // Quadrant positions in the grid (relative to PAD offset)
  const quads = {
    known:    { x: PAD + HALF, y: PAD + HALF, w: HALF, h: HALF },   // bottom-right
    nice:     { x: PAD,        y: PAD + HALF, w: HALF, h: HALF },   // bottom-left
    validated:{ x: PAD + HALF, y: PAD,        w: HALF, h: HALF },   // top-right
    clueless: { x: PAD,        y: PAD,        w: HALF, h: HALF },   // top-left
  };

  const quadrantStyle = (key) => {
    const q = quads[key];
    const c = COLORS[key];
    const vis = isQuadrantVisible(key);
    const isClueless = key === "clueless";
    const isActive = currentStep?.quadrant === key;

    return {
      position: "absolute",
      left: q.x,
      top: q.y,
      width: q.w,
      height: q.h,
      background: vis ? c.bg : "transparent",
      border: vis ? `2px solid ${c.border}` : "2px solid transparent",
      borderRadius: isClueless ? "8px 0 0 0" : key === "known" ? "0 0 8px 0" : key === "nice" ? "0 0 0 8px" : "0 8px 0 0",
      opacity: vis ? (isActive || step > quadrantMap[key] ? 1 : 1) : 0,
      transform: vis ? "scale(1)" : "scale(0.85)",
      transition: "opacity 0.1s, transform 0.1s",
      animation: vis ? `quadrantReveal 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards${isClueless ? ", cluelessPulse 3s ease-in-out 0.8s infinite" : ""}` : "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: "6px",
      zIndex: isClueless && vis ? 2 : 1,
    };
  };

  const quadrantLabelStyle = (key) => {
    const c = COLORS[key];
    const vis = isQuadrantVisible(key);
    const isClueless = key === "clueless";
    return {
      fontFamily: "'Space Mono', monospace",
      fontSize: isClueless ? "12px" : "11px",
      fontWeight: 700,
      letterSpacing: "1.5px",
      color: c.text,
      textTransform: "uppercase",
      textAlign: "center",
      lineHeight: 1.4,
      opacity: 0,
      animation: vis ? `quadrantLabelPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s forwards` : "none",
    };
  };

  const dimQuadrant = (key) => {
    if (step < 1) return 1;
    if (!isQuadrantVisible(key)) return 0;
    if (currentStep?.quadrant === key) return 1;
    if (step >= quadrantMap[key]) return 0.4;
    return 1;
  };

  return (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background: COLORS.bg,
        color: COLORS.textPrimary,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      <style>{KEYFRAMES}</style>

      <h1
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "clamp(16px, 3.5vw, 22px)",
          fontWeight: 700,
          letterSpacing: "3px",
          textTransform: "uppercase",
          color: COLORS.textPrimary,
          marginBottom: "clamp(20px, 4vh, 40px)",
          opacity: 0,
          animation: "fadeIn 0.8s ease forwards",
        }}
      >
        {t.title}
      </h1>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: "clamp(24px, 5vw, 64px)",
          width: "100%",
          maxWidth: "940px",
          flexWrap: "wrap",
        }}
      >
        {/* ── Matrix Visualization ── */}
        <div
          style={{
            position: "relative",
            width: SVG_SIZE,
            height: SVG_SIZE,
            flexShrink: 0,
          }}
        >
          {/* Quadrants */}
          {["known", "nice", "validated", "clueless"].map((key) => (
            <div
              key={key}
              style={{
                ...quadrantStyle(key),
                opacity: isQuadrantVisible(key) ? dimQuadrant(key) : 0,
                transition: "opacity 0.5s ease",
              }}
            >
              <div style={quadrantLabelStyle(key)}>
                {key === "clueless" && isQuadrantVisible(key) && (
                  <div
                    style={{
                      fontSize: "28px",
                      marginBottom: "2px",
                      animation: "warningShake 0.8s ease 0.5s",
                    }}
                  >
                    ⚠️
                  </div>
                )}
                {isQuadrantVisible(key) && (
                  key === "known" ? "Known\nTerritory" :
                  key === "nice" ? "Nice to\nKnow" :
                  key === "validated" ? "Validated\n✓" :
                  "Clueless\nCorner"
                )}
              </div>
            </div>
          ))}

          {/* SVG axes overlay */}
          <svg
            width={SVG_SIZE}
            height={SVG_SIZE}
            viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 3,
              pointerEvents: "none",
              overflow: "visible",
            }}
          >
            {/* X axis (Evidence) */}
            <line
              x1={PAD}
              y1={PAD + HALF}
              x2={PAD + GRID}
              y2={PAD + HALF}
              stroke={COLORS.axisLine}
              strokeWidth="2"
              strokeDasharray="600"
              strokeDashoffset={showAxes ? "0" : "600"}
              style={{
                transition: "stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />

            {/* Y axis (Importance) */}
            <line
              x1={PAD + HALF}
              y1={PAD}
              x2={PAD + HALF}
              y2={PAD + GRID}
              stroke={COLORS.axisLine}
              strokeWidth="2"
              strokeDasharray="600"
              strokeDashoffset={showAxes ? "0" : "600"}
              style={{
                transition: "stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />

            {/* Arrow tip: X axis right */}
            <polygon
              points={`${PAD + GRID + 8},${PAD + HALF} ${PAD + GRID - 2},${PAD + HALF - 5} ${PAD + GRID - 2},${PAD + HALF + 5}`}
              fill={COLORS.axisLine}
              style={{
                opacity: showAxes ? 1 : 0,
                transition: "opacity 0.5s ease 0.8s",
              }}
            />

            {/* Arrow tip: Y axis top */}
            <polygon
              points={`${PAD + HALF},${PAD - 8} ${PAD + HALF - 5},${PAD + 2} ${PAD + HALF + 5},${PAD + 2}`}
              fill={COLORS.axisLine}
              style={{
                opacity: showAxes ? 1 : 0,
                transition: "opacity 0.5s ease 0.8s",
              }}
            />
          </svg>

          {/* Axis labels — positioned outside the grid */}
          {/* Evidence label (bottom) */}
          <div
            style={{
              position: "absolute",
              bottom: PAD - 35,
              left: PAD,
              width: GRID,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              opacity: showAxes ? 1 : 0,
              animation: showAxes ? "axisLabelFade 0.6s ease 0.5s both" : "none",
            }}
          >
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: COLORS.axisLabel, letterSpacing: "1px" }}>
              {t.axisXLow}
            </span>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", color: COLORS.textSecondary, letterSpacing: "2px", textTransform: "uppercase", fontWeight: 700 }}>
              {t.axisX}
            </span>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: COLORS.axisLabel, letterSpacing: "1px" }}>
              {t.axisXHigh}
            </span>
          </div>

          {/* Importance label (left side, rotated) */}
          <div
            style={{
              position: "absolute",
              left: PAD - 40,
              top: PAD,
              height: GRID,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              opacity: showAxes ? 1 : 0,
              animation: showAxes ? "axisLabelFade 0.6s ease 0.5s both" : "none",
            }}
          >
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: COLORS.axisLabel, letterSpacing: "1px" }}>
              {t.axisYHigh}
            </span>
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "11px",
                color: COLORS.textSecondary,
                letterSpacing: "2px",
                textTransform: "uppercase",
                fontWeight: 700,
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
              }}
            >
              {t.axisY}
            </span>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: COLORS.axisLabel, letterSpacing: "1px" }}>
              {t.axisYLow}
            </span>
          </div>
        </div>

        {/* ── Text Panel ── */}
        <div
          style={{
            flex: "1 1 280px",
            maxWidth: "380px",
            minHeight: "200px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {step === -1 ? (
            <div
              key="intro"
              style={{ animation: "textSlideUp 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" }}
            >
              <p
                style={{
                  fontSize: "clamp(15px, 2vw, 17px)",
                  lineHeight: 1.65,
                  color: COLORS.textSecondary,
                }}
              >
                Not all assumptions are equal. Some are well-tested. Others are invisible risks waiting to surface. This tool helps you see the difference — and know where to focus.
              </p>
            </div>
          ) : (
            <div
              key={`step-${step}`}
              style={{ animation: "textSlideUp 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" }}
            >
              {currentStep.quadrant && (
                <div
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "11px",
                    letterSpacing: "2.5px",
                    color: currentStep.quadrant === "clueless" ? COLORS.clueless.text : COLORS.accent,
                    textTransform: "uppercase",
                    marginBottom: "8px",
                  }}
                >
                  {currentStep.label}
                </div>
              )}
              <h2
                style={{
                  fontSize: "clamp(20px, 3.5vw, 26px)",
                  fontWeight: 700,
                  margin: "0 0 12px 0",
                  lineHeight: 1.2,
                  color: currentStep.quadrant === "clueless" ? COLORS.clueless.text : COLORS.textPrimary,
                }}
              >
                {currentStep.heading}
              </h2>
              <p
                style={{
                  fontSize: "clamp(14px, 2vw, 16px)",
                  lineHeight: 1.65,
                  color: COLORS.textSecondary,
                  margin: 0,
                }}
              >
                {currentStep.body}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Navigation ── */}
      <div
        style={{
          marginTop: "clamp(24px, 5vh, 48px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <button
          onClick={advance}
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "14px",
            fontWeight: 700,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: COLORS.bg,
            background: step === 4 ? COLORS.clueless.text : COLORS.accent,
            border: "none",
            borderRadius: "50px",
            padding: "14px 40px",
            cursor: "pointer",
            transition: "background 0.3s, transform 0.15s",
            animation: btnPressed ? "btnBounce 0.3s ease" : "none",
          }}
          onMouseEnter={(e) => (e.target.style.background = step === 4 ? "#e85848" : "#d8a57a")}
          onMouseLeave={(e) => (e.target.style.background = step === 4 ? COLORS.clueless.text : COLORS.accent)}
        >
          {step === -1 ? t.nav.start : step < TOTAL_STEPS - 1 ? t.nav.next : t.nav.restart}
        </button>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              style={{
                width: step === i ? "24px" : "8px",
                height: "8px",
                borderRadius: "4px",
                background:
                  step === i
                    ? i === 4 ? COLORS.clueless.text : COLORS.accent
                    : i <= step
                    ? "rgba(255,255,255,0.25)"
                    : "rgba(255,255,255,0.1)",
                transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            />
          ))}
        </div>

        {step >= 0 && (
          <div style={{ fontSize: "12px", color: COLORS.textSecondary, fontFamily: "'Space Mono', monospace" }}>
            {step + 1} {t.nav.stepOf} {TOTAL_STEPS}
          </div>
        )}
      </div>
    </div>
  );
}
