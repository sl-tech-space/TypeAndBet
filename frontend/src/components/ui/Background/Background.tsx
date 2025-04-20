"use client";

import React from "react";
import styles from "./Background.module.scss";

/**
 * カジノテーマの背景コンポーネント
 * @returns 背景コンポーネント
 */
export const Background = () => {
  return (
    <div className={styles.casinoBackground}>
      {/* メインのグラデーション背景（緑色ベース） */}
      <div className={styles.mainGradient}></div>

      {/* カジノパターンのオーバーレイ */}
      <div className={styles.patternOverlay}></div>

      {/* 装飾ボーダー */}
      <div className={styles.topBorder}></div>
      <div className={styles.bottomBorder}></div>
      <div className={styles.leftBorder}></div>
      <div className={styles.rightBorder}></div>

      {/* カジノライトエフェクト */}
      <div className={`${styles.lightEffect} ${styles.lightGreen1}`}></div>
      <div className={`${styles.lightEffect} ${styles.lightGreen2}`}></div>
      <div className={`${styles.lightEffect} ${styles.lightGreen3}`}></div>

      {/* 上下の暗いグラデーション */}
      <div className={styles.topDarkness}></div>
      <div className={styles.bottomDarkness}></div>

      {/* カジノの浮遊要素 */}
      <div className={`${styles.floatingElement} ${styles.spade}`}>♠</div>
      <div className={`${styles.floatingElement} ${styles.heart}`}>♥</div>
      <div className={`${styles.floatingElement} ${styles.diamond}`}>♦</div>
      <div className={`${styles.floatingElement} ${styles.club}`}>♣</div>
    </div>
  );
};

export default Background;
