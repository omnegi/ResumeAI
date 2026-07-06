import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";

// ─── Intersection Observer hook ──────────────────────────────────────────

function useInView(threshold = 0.15, once = true) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) obs.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, once]);

  return { ref, isVisible };
}

// ─── Animation variants ─────────────────────────────────────────────────

type Variant = "fadeUp" | "fadeDown" | "fadeLeft" | "fadeRight" | "fadeIn" | "scaleUp" | "blurIn";

const variants: Record<Variant, { from: CSSProperties; to: CSSProperties }> = {
  fadeUp: {
    from: { opacity: 0, transform: "translateY(40px)" },
    to:   { opacity: 1, transform: "translateY(0)" },
  },
  fadeDown: {
    from: { opacity: 0, transform: "translateY(-40px)" },
    to:   { opacity: 1, transform: "translateY(0)" },
  },
  fadeLeft: {
    from: { opacity: 0, transform: "translateX(-40px)" },
    to:   { opacity: 1, transform: "translateX(0)" },
  },
  fadeRight: {
    from: { opacity: 0, transform: "translateX(40px)" },
    to:   { opacity: 1, transform: "translateX(0)" },
  },
  fadeIn: {
    from: { opacity: 0 },
    to:   { opacity: 1 },
  },
  scaleUp: {
    from: { opacity: 0, transform: "scale(0.9)" },
    to:   { opacity: 1, transform: "scale(1)" },
  },
  blurIn: {
    from: { opacity: 0, filter: "blur(10px)", transform: "translateY(20px)" },
    to:   { opacity: 1, filter: "blur(0px)", transform: "translateY(0)" },
  },
};

// ─── Animate wrapper component ──────────────────────────────────────────

interface AnimateProps {
  children: ReactNode;
  variant?: Variant;
  delay?: number;       // ms
  duration?: number;    // ms
  className?: string;
  once?: boolean;
  threshold?: number;
}

export function Animate({
  children,
  variant = "fadeUp",
  delay = 0,
  duration = 700,
  className = "",
  once = true,
  threshold = 0.15,
}: AnimateProps) {
  const { ref, isVisible } = useInView(threshold, once);
  const v = variants[variant];

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...(isVisible ? v.to : v.from),
        transition: `all ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: "opacity, transform, filter",
      }}
    >
      {children}
    </div>
  );
}

// ─── Stagger wrapper (delays children automatically) ────────────────────

interface StaggerProps {
  children: ReactNode[];
  variant?: Variant;
  staggerMs?: number;
  duration?: number;
  className?: string;
  childClassName?: string;
}

export function Stagger({
  children,
  variant = "fadeUp",
  staggerMs = 100,
  duration = 700,
  className = "",
  childClassName = "",
}: StaggerProps) {
  return (
    <div className={className}>
      {children.map((child, i) => (
        <Animate
          key={i}
          variant={variant}
          delay={i * staggerMs}
          duration={duration}
          className={childClassName}
        >
          {child}
        </Animate>
      ))}
    </div>
  );
}

// ─── Animated counter ───────────────────────────────────────────────────

interface CountUpProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;  // ms
  className?: string;
}

export function CountUp({ end, suffix = "", prefix = "", duration = 2000, className = "" }: CountUpProps) {
  const { ref, isVisible } = useInView(0.3, true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * end);
      setCount(current);
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [isVisible, end, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count}{suffix}
    </span>
  );
}

// ─── Parallax scroll effect ─────────────────────────────────────────────

interface ParallaxProps {
  children: ReactNode;
  speed?: number; // 0 = no parallax, 1 = full speed
  className?: string;
}

export function Parallax({ children, speed = 0.3, className = "" }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    function handleScroll() {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const windowCenter = window.innerHeight / 2;
      setOffset((center - windowCenter) * speed * -0.15);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return (
    <div ref={ref} className={className} style={{ transform: `translateY(${offset}px)`, willChange: "transform" }}>
      {children}
    </div>
  );
}
