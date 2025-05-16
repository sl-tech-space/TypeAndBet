"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Text } from "@/components/ui";
import { useTimer } from "@/features/games/hooks/useTimer";
import styles from "./Timer.module.scss";

export const Timer = () => {
  const { time, formatTime } = useTimer();
  const [progress, setProgress] = useState(100);
  const initialTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (initialTimeRef.current === null && time > 0) {
      initialTimeRef.current = time;
    }
  }, [time]);

  useEffect(() => {
    if (initialTimeRef.current === null) return;

    const interval = setInterval(() => {
      const currentProgress = (time / initialTimeRef.current!) * 100;
      setProgress(currentProgress);
    }, 100);

    return () => clearInterval(interval);
  }, [time]);

  return (
    <div className={styles.timer}>
      <Text
        variant="p"
        color="gold"
        className={styles.timer__text}
      >
        残り時間&nbsp;:&nbsp;{formatTime(time)}
      </Text>
      <div className={styles.timer__container}>
        <Image src="/assets/svg/timer.svg" alt="timer" width={30} height={30} />
        <div className={styles.timer__progress}>
          <div
            className={styles.timer__progress__bar}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Timer;
