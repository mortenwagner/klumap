import { useState, useCallback } from "react";

// ─── i18n ───
const TRANSLATIONS = {
  en: {
    title: "O-Rings of Innovation",
    steps: [
      {
        ring: "Opportunity",
        subtitle: "",
        heading: "The Spark",
        body: "It all starts here — an unmet need, a shift in the market, a possibility no one else has seen yet. Opportunity is the nucleus of innovation.",
      },
      {
        ring: "Offering",
        subtitle: "",
        heading: "What You Bring to Market",
        body: "Your offering is the product, service, or solution you shape around the opportunity. It's where insight meets execution — the tangible thing people pay for and experience.",
      },
      {
        ring: "Operation",
        subtitle: "",
        heading: "Scaling the Machine",
        body: "Operation is the outermost ring — the processes, systems, and organization that deliver at scale. It's what turns a great offering into a sustainable business.",
      },
      {
        ring: "Feedback",
        subtitle: "operation → offering",
        heading: "Learning from Operations",
        body: "When you run operations at scale, you discover what actually works — and what doesn't. These insights feed back into your offering, reshaping and improving it.",
      },
      {
        ring: "Feedback",
        subtitle: "offering → opportunity",
        heading: "Reframing the Opportunity",
        body: "Testing and refining your offering reveals new truths about the market itself. What you thought was the opportunity shifts — sometimes subtly, sometimes radically.",
      },
    ],
    nav: {
      start: "Begin",
      next: "Next",
      restart: "Start Over",
      stepOf: "of",
    },
  },
  da: {
    title: "O-Rings of Innovation",
    steps: [
      {
        ring: "Opportunity",
        subtitle: "",
        heading: "Gnisten",
        body: "Det hele starter her — et uopfyldt behov, et skift i markedet, en mulighed ingen andre har set endnu. Opportunity er innovationens kerne.",
      },
      {
        ring: "Offering",
        subtitle: "",
        heading: "Det Du Bringer til Markedet",
        body: "Dit offering er produktet, servicen eller løsningen du former omkring muligheden. Det er hvor indsigt møder eksekvering — det håndgribelige folk betaler for.",
      },
      {
        ring: "Operation",
        subtitle: "",
        heading: "Skalering af Maskinen",
        body: "Operation er den yderste ring — processerne, systemerne og organisationen der leverer i skala. Det er det der forvandler et godt tilbud til en bæredygtig forretning.",
      },
      {
        ring: "Feedback",
        subtitle: "operation → offering",
        heading: "Læring fra Drift",
        body: "Når du kører drift i skala, opdager du hvad der virker — og hvad der ikke gør. Disse indsigter føder tilbage i dit offering og omformer det.",
      },
      {
        ring: "Feedback",
        subtitle: "offering → opportunity",
        heading: "Ny Forståelse af Muligheden",
        body: "Test og forbedring af dit offering afslører nye sandheder om markedet selv. Det du troede var muligheden ændrer sig — nogle gange subtilt, nogle gange radikalt.",
      },
    ],
    nav: {
      start: "Start",
      next: "Næste",
      restart: "Forfra",
      stepOf: "af",
    },
  },
};

const COLORS = {
  bg: "#2a3240",
  opportunityRed: "#c0392b",
  offeringBlue: "#4a6a8a",
  offeringBlueBorder: "#5a7a9a",
  operationGrey: "#7a8a7a",
  operationGreyBorder: "#8a9a8a",
  textPrimary: "#e8e0d4",
  textSecondary: "#9a9080",
  accent: "#c8956a",
  arrowOrange: "#c87840",
};

const TOTAL_STEPS = 5;
const RS = { outer: 320, middle: 220, inner: 140, core: 60 };
const CTR = (RS.outer + 40) / 2; // center of the SVG viewbox

const KEYFRAMES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700&family=Space+Mono:wght@400;700&display=swap');

  @keyframes ringBounceIn {
    0% { transform: scale(0); opacity: 0; }
    40% { transform: scale(1.15); opacity: 1; }
    60% { transform: scale(0.92); }
    75% { transform: scale(1.06); }
    87% { transform: scale(0.98); }
    100% { transform: scale(1); opacity: 1; }
  }

  @keyframes textSlideUp {
    0% { transform: translateY(24px); opacity: 0; }
    50% { transform: translateY(-4px); opacity: 1; }
    70% { transform: translateY(2px); }
    100% { transform: translateY(0); opacity: 1; }
  }

  @keyframes labelPop {
    0% { transform: scale(0) translateX(20px); opacity: 0; }
    50% { transform: scale(1.1) translateX(-2px); opacity: 1; }
    70% { transform: scale(0.95) translateX(1px); }
    100% { transform: scale(1) translateX(0); opacity: 1; }
  }

  @keyframes pulseGlow {
    0%, 100% { filter: drop-shadow(0 0 8px rgba(192, 57, 43, 0.25)); }
    50% { filter: drop-shadow(0 0 18px rgba(192, 57, 43, 0.5)); }
  }

  @keyframes arrowDraw {
    0% { stroke-dashoffset: 300; opacity: 0; }
    10% { opacity: 1; }
    100% { stroke-dashoffset: 0; opacity: 1; }
  }

  @keyframes leaderDraw {
    0% { stroke-dashoffset: 200; opacity: 0; }
    15% { opacity: 0.5; }
    100% { stroke-dashoffset: 0; opacity: 0.5; }
  }

  @keyframes dotPop {
    0% { r: 0; opacity: 0; }
    60% { r: 4.5; opacity: 0.7; }
    100% { r: 3.5; opacity: 0.6; }
  }

  @keyframes arrowHeadPop {
    0% { opacity: 0; transform: scale(0); }
    50% { opacity: 1; transform: scale(1.4); }
    100% { opacity: 1; transform: scale(1); }
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
`;

// SVG arrow component for feedback loops
function FeedbackArrow({ from, to, delay = 0, visible }) {
  const fromR = from / 2;
  const toR = to / 2;

  const startX = CTR - fromR;
  const startY = CTR - 15;

  const endX = CTR - toR;
  const endY = CTR + 15;

  const cpX = CTR - fromR - 35;
  const cpY = CTR;

  const path = `M ${startX} ${startY} Q ${cpX} ${cpY} ${endX} ${endY}`;

  const aSize = 10;
  const ax1 = endX - aSize;
  const ay1 = endY - aSize + 2;
  const ax2 = endX - 2;
  const ay2 = endY + aSize + 2;

  if (!visible) return null;

  return (
    <g>
      <path
        d={path}
        fill="none"
        stroke={COLORS.arrowOrange}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="300"
        strokeDashoffset="300"
        style={{
          animation: `arrowDraw 1.2s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s forwards`,
        }}
      />
      <polygon
        points={`${endX},${endY} ${ax1},${ay1} ${ax2},${ay2}`}
        fill={COLORS.arrowOrange}
        style={{
          opacity: 0,
          transformOrigin: `${endX}px ${endY}px`,
          animation: `arrowHeadPop 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay + 0.5}s forwards`,
        }}
      />
    </g>
  );
}

// SVG leader line from ring edge to label
function LeaderLine({ x1, y1, x2, y2, visible, delay = 0.3 }) {
  if (!visible) return null;
  return (
    <g>
      <circle
        cx={x1}
        cy={y1}
        r="0"
        fill={COLORS.textSecondary}
        style={{
          animation: `dotPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s forwards`,
        }}
      />
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={COLORS.textSecondary}
        strokeWidth="2.5"
        strokeDasharray="200"
        strokeDashoffset="200"
        style={{
          animation: `leaderDraw 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay + 0.15}s forwards`,
        }}
      />
    </g>
  );
}

export default function ORingsExplainer({ lang = "en" }) {
  const [step, setStep] = useState(-1);
  const [btnPressed, setBtnPressed] = useState(false);
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const advance = useCallback(() => {
    setBtnPressed(true);
    setTimeout(() => setBtnPressed(false), 300);
    setStep((s) => (s >= TOTAL_STEPS - 1 ? -1 : s + 1));
  }, []);

  // NOTE: Keyboard event listeners removed — users use the visual buttons instead.

  const ringVisible = (ringIndex) => step >= ringIndex;

  const ringAnim = (ringIndex) =>
    ringVisible(ringIndex)
      ? {
          animation: "ringBounceIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
          animationDelay: "0.05s",
        }
      : { transform: "scale(0)", opacity: 0 };

  const labelAnim = (ringIndex) =>
    ringVisible(ringIndex)
      ? {
          animation: "labelPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
          animationDelay: "0.4s",
          opacity: 0,
        }
      : { opacity: 0 };

  const currentStep = step >= 0 && step < TOTAL_STEPS ? t.steps[step] : null;

  const ringOpacity = (ringIndex) => {
    if (!ringVisible(ringIndex)) return 0;
    if (step <= 2 && ringIndex < step) return 0.55;
    return 1;
  };

  const svgSize = RS.outer + 40;
  const labelStyle = (extra) => ({
    fontFamily: "'Space Mono', monospace",
    fontSize: "13px",
    fontWeight: 700,
    color: COLORS.accent,
    letterSpacing: "1.5px",
    ...extra,
  });

  return (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        color: COLORS.textPrimary,
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
        {/* ── Ring Visualization ── */}
        <div
          style={{
            position: "relative",
            width: `${svgSize}px`,
            height: `${svgSize}px`,
            flexShrink: 0,
            overflow: "visible",
            marginRight: "140px",
          }}
        >
          {/* Operation — OUTER grey ring (step 2) */}
          <div
            style={{
              position: "absolute",
              top: CTR - RS.outer / 2,
              left: CTR - RS.outer / 2,
              width: RS.outer,
              height: RS.outer,
              borderRadius: "50%",
              background: `radial-gradient(circle at 40% 35%, ${COLORS.operationGreyBorder}, ${COLORS.operationGrey})`,
              border: "2px solid rgba(255,255,255,0.08)",
              transition: "opacity 0.6s ease",
              opacity: ringOpacity(2),
              ...ringAnim(2),
            }}
          />

          {/* Offering — MIDDLE blue ring (step 1) */}
          <div
            style={{
              position: "absolute",
              top: CTR - RS.middle / 2,
              left: CTR - RS.middle / 2,
              width: RS.middle,
              height: RS.middle,
              borderRadius: "50%",
              background: `radial-gradient(circle at 40% 35%, ${COLORS.offeringBlueBorder}, ${COLORS.offeringBlue})`,
              border: "2px solid rgba(255,255,255,0.06)",
              zIndex: 1,
              transition: "opacity 0.6s ease",
              opacity: ringOpacity(1),
              ...ringAnim(1),
            }}
          />

          {/* Opportunity — CORE red dot only (step 0) */}
          <div
            style={{
              position: "absolute",
              top: CTR - RS.core / 2,
              left: CTR - RS.core / 2,
              width: RS.core,
              height: RS.core,
              borderRadius: "50%",
              background: `radial-gradient(circle at 40% 35%, #e04838, ${COLORS.opportunityRed})`,
              zIndex: 2,
              ...(ringVisible(0)
                ? {
                    animation:
                      "ringBounceIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards, pulseGlow 3s ease-in-out 1s infinite",
                  }
                : { transform: "scale(0)", opacity: 0 }),
            }}
          />

          {/* ── Labels ── */}

          {/* Opportunity label */}
          <div
            style={{
              position: "absolute",
              bottom: "55px",
              left: `${svgSize + 12}px`,
              zIndex: 10,
              ...labelAnim(0),
            }}
          >
            <div style={labelStyle()}>
              <span style={{ color: COLORS.textPrimary }}>O</span>PPORTUNITY
            </div>
          </div>

          {/* Offering label */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: `${svgSize + 12}px`,
              marginTop: "-30px",
              zIndex: 10,
              ...labelAnim(1),
            }}
          >
            <div style={labelStyle()}>
              <span style={{ color: COLORS.textPrimary }}>O</span>FFERING
            </div>
          </div>

          {/* Operation label */}
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: `${svgSize + 12}px`,
              zIndex: 10,
              ...labelAnim(2),
            }}
          >
            <div style={labelStyle()}>
              <span style={{ color: COLORS.textPrimary }}>O</span>PERATION
            </div>
          </div>

          {/* ── SVG overlay for feedback arrows ── */}
          <svg
            width={svgSize}
            height={svgSize}
            viewBox={`0 0 ${svgSize} ${svgSize}`}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 8,
              pointerEvents: "none",
              overflow: "visible",
            }}
          >
            {/* Leader lines: ring band midpoint → the "O" in each label */}

            {/* Opportunity: from core edge to O */}
            <LeaderLine
              x1={CTR + 22}
              y1={CTR + 21}
              x2={svgSize + 8}
              y2={svgSize - 63}
              visible={step >= 0}
              delay={0.5}
            />

            {/* Offering: from middle of blue band to O */}
            <LeaderLine
              x1={CTR + 89}
              y1={CTR - 13}
              x2={svgSize + 8}
              y2={CTR - 22}
              visible={step >= 1}
              delay={0.5}
            />

            {/* Operation: from middle of grey band to O */}
            <LeaderLine
              x1={CTR + 89}
              y1={CTR - 101}
              x2={svgSize + 8}
              y2={18}
              visible={step >= 2}
              delay={0.5}
            />

            {/* Step 3: Arrow from Operation → Offering */}
            <FeedbackArrow
              from={RS.outer}
              to={RS.middle}
              delay={0.1}
              visible={step >= 3}
            />
            {/* Step 4: Arrow from Offering → Opportunity */}
            <FeedbackArrow
              from={RS.middle}
              to={RS.core + 20}
              delay={0.1}
              visible={step >= 4}
            />
          </svg>
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
                Every organization innovates across three nested layers — and the
                best ones know the journey never ends. Understanding where you are
                is the first step to moving forward.
              </p>
            </div>
          ) : (
            <div
              key={`step-${step}`}
              style={{ animation: "textSlideUp 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" }}
            >
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "11px",
                  letterSpacing: "2.5px",
                  color: step >= 3 ? COLORS.arrowOrange : COLORS.accent,
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                {currentStep.ring}
                {currentStep.subtitle && (
                  <>
                    {" · "}
                    <span style={{ color: COLORS.textSecondary }}>{currentStep.subtitle}</span>
                  </>
                )}
              </div>
              <h2
                style={{
                  fontSize: "clamp(20px, 3.5vw, 26px)",
                  fontWeight: 700,
                  margin: "0 0 12px 0",
                  lineHeight: 1.2,
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
            background: step >= 3 ? COLORS.arrowOrange : COLORS.accent,
            border: "none",
            borderRadius: "50px",
            padding: "14px 40px",
            cursor: "pointer",
            transition: "background 0.3s, transform 0.15s",
            animation: btnPressed ? "btnBounce 0.3s ease" : "none",
          }}
          onMouseEnter={(e) => (e.target.style.background = step >= 3 ? "#d88850" : "#d8a57a")}
          onMouseLeave={(e) => (e.target.style.background = step >= 3 ? COLORS.arrowOrange : COLORS.accent)}
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
                    ? i >= 3 ? COLORS.arrowOrange : COLORS.accent
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
