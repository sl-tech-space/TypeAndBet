"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./ScrollHelper.module.scss";
import { Button } from "@/components/ui";
import type { ScrollHelperProps } from "./ScrollHelper.types";

/**
 * スクロールヘルパー
 * @param text テキスト
 * @param onClick カスタムのクリック処理（指定しない場合は自動的にtargetSectionにスクロール）
 * @param targetSection スクロール先のセクション番号（1から始まる、デフォルトは2）
 * @returns スクロールヘルパー
 */
export const ScrollHelper = ({
  text,
  onClick,
  targetSection = 2,
}: ScrollHelperProps) => {
  const sectionsRef = useRef<HTMLElement[]>([]);

  // セクション要素を取得
  useEffect(() => {
    const sections = document.querySelectorAll("section");
    sectionsRef.current = Array.from(sections) as HTMLElement[];
  }, []);

  // 指定したセクションへスクロール
  const handleScroll = () => {
    if (onClick) {
      // カスタムのクリック処理が提供されている場合はそれを使用
      onClick();
      return;
    }

    // セクションインデックスの調整（配列は0始まり、targetSectionは1始まり）
    const index = targetSection - 1;

    if (sectionsRef.current && sectionsRef.current.length > index) {
      // 指定したセクションが存在する場合はそこにスクロール
      sectionsRef.current[index].scrollIntoView({ behavior: "smooth" });
      console.log(`Scrolling to section ${targetSection}`);
    } else {
      // 指定したセクションが存在しない場合はウィンドウ高さ分スクロール
      window.scrollTo({
        top: (window.innerHeight * targetSection) / 2,
        behavior: "smooth",
      });
      console.log(
        `Section ${targetSection} not found, scrolling to estimated position`
      );
    }
  };

  return (
    <div className={styles["scroll-helper"]}>
      <Button
        textColor="gold"
        backgroundColor="tertiary"
        isBorder={true}
        isRound={true}
        borderColor="gold"
        buttonSize="small"
        onClick={handleScroll}
      >
        <Image
          src="/assets/svg/south-arrow.svg"
          alt="下にスクロール"
          width={20}
          height={20}
        />
        {text}
      </Button>
    </div>
  );
};

export default ScrollHelper;
