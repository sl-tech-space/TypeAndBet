import { useEffect, useRef, useState } from "react";

export type Easing = "linear" | "easeOutCubic" | "easeInOutCubic";

const easings: Record<Easing, (t: number) => number> = {
  linear: (t) => t,
  easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),
  easeInOutCubic: (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
};

export function useCountUp(
  target: number,
  options?: { durationMs?: number; easing?: Easing; startOnMount?: boolean }
): {
  value: number;
  start: (nextTarget?: number, onComplete?: () => void) => void;
  stop: () => void;
  set: (nextValue: number) => void;
} {
  const duration = options?.durationMs ?? 500;
  const easing = easings[options?.easing ?? "easeOutCubic"];
  const startOnMount = options?.startOnMount ?? true;

  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const startValueRef = useRef<number>(target);
  const [value, setValue] = useState<number>(target);
  const targetRef = useRef<number>(target);

  const onCompleteRef = useRef<(() => void) | undefined>(undefined);

  const cancel = (): void => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    startRef.current = null;
  };

  const tick = (now: number): void => {
    if (startRef.current === null) startRef.current = now;
    const elapsed = now - startRef.current;
    const progress = Math.min(1, elapsed / duration);
    const eased = easing(progress);
    const startVal = startValueRef.current;
    const endVal = targetRef.current;
    const next = Math.round(startVal + (endVal - startVal) * eased);
    setValue(next);
    if (progress < 1) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      cancel();
      setValue(endVal);
      startValueRef.current = endVal;
      if (onCompleteRef.current) {
        const cb = onCompleteRef.current;
        onCompleteRef.current = undefined;
        try {
          cb();
        } catch {
          // no-op
        }
      }
    }
  };

  const start = (nextTarget?: number, onComplete?: () => void): void => {
    if (typeof nextTarget === "number") targetRef.current = nextTarget;
    onCompleteRef.current = onComplete;
    cancel();
    startRef.current = null;
    startValueRef.current = value;
    rafRef.current = requestAnimationFrame(tick);
  };

  const stop = (): void => cancel();

  const set = (nextValue: number): void => {
    cancel();
    startValueRef.current = nextValue;
    targetRef.current = nextValue;
    setValue(nextValue);
  };

  useEffect(() => {
    targetRef.current = target;
    if (startOnMount) start(target);
    return () => cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return { value, start, stop, set };
}
