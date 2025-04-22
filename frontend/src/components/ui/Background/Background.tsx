"use client";

import React from "react";
import styles from "./Background.module.scss";

/**
 * カジノテーマの背景コンポーネント
 * @returns 背景コンポーネント
 */
export const Background = () => {
  return (
    <div className={styles["casino-background"]}>
      {/* メインのグラデーション背景（緑色ベース） */}
      <div className={styles["casino-background__main-gradient"]}></div>

      {/* カジノパターンのオーバーレイ */}
      <div className={styles["casino-background__pattern-overlay"]}></div>

      {/* 装飾ボーダー */}
      <div className={styles["casino-background__top-border"]}></div>
      <div className={styles["casino-background__bottom-border"]}></div>
      <div className={styles["casino-background__left-border"]}></div>
      <div className={styles["casino-background__right-border"]}></div>

      {/* カジノライトエフェクト */}
      <div className={`${styles["casino-background__light-effect"]} ${styles["casino-background__light-green1"]}`}></div>
      <div className={`${styles["casino-background__light-effect"]} ${styles["casino-background__light-green2"]}`}></div>
      <div className={`${styles["casino-background__light-effect"]} ${styles["casino-background__light-green3"]}`}></div>

      {/* 上下の暗いグラデーション */}
      <div className={styles["casino-background__top-darkness"]}></div>
      <div className={styles["casino-background__bottom-darkness"]}></div>

      {/* カジノの浮遊要素 */}
      <div className={`${styles["casino-background__floating-element"]} ${styles["casino-background__spade"]}`}>♠</div>
      <div className={`${styles["casino-background__floating-element"]} ${styles["casino-background__heart"]}`}>♥</div>
      <div className={`${styles["casino-background__floating-element"]} ${styles["casino-background__diamond"]}`}>♦</div>
      <div className={`${styles["casino-background__floating-element"]} ${styles["casino-background__club"]}`}>♣</div>
    </div>
  );
};

export default Background;
