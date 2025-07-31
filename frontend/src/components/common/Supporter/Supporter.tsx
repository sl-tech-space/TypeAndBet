"use client";

import { usePathname } from "next/navigation";
import {
  type ReactElement,
  type ReactNode,
  useState,
  useEffect,
  useRef,
  Fragment
} from "react";

import { useMessage } from "@/components/common/context";
import { Icon } from "@/components/ui";
import { PATH_DEFAULT_MESSAGES } from "@/constants";

import styles from "./Supporter.module.scss";

/**
 * クライアントコンポーネント
 * ゲームをサポートするキャラクターを表示するコンポーネント
 * 右下に固定表示され、通知を表示
 * @returns Supporterコンポーネント
 */
export const Supporter = (): ReactElement => {
  const [isHovering, setIsHovering] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const { message } = useMessage();
  const prevMessageRef = useRef<string | null>(null);
  const supporterRef = useRef<HTMLDivElement>(null);
  const path = usePathname();

  // フッターの表示状態を監視
  useEffect(() => {
    // インターセクションオブザーバーの設定
    const observerOptions = {
      root: null, // ビューポートをルートとして使用
      rootMargin: "0px", // マージンなし
      threshold: 0.1, // 10%以上表示されたらコールバック発火
    };

    // フッターが表示されたかどうかを監視するコールバック
    const observerCallback = (entries: IntersectionObserverEntry[]): void => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // フッターが表示された
          setIsFooterVisible(true);
        } else {
          // フッターが表示されていない
          setIsFooterVisible(false);
        }
      });
    };

    // オブザーバーの作成
    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    // フッターの監視を開始
    const footer = document.querySelector("footer");
    if (footer) {
      observer.observe(footer);
    }

    // クリーンアップ関数
    return () => {
      if (footer) {
        observer.unobserve(footer);
      }
      observer.disconnect();
    };
  }, []);

  // 改行コードを<br>タグに変換する関数
  const formatMessage = (text: string): ReactNode => {
    return text.split("\n").map((line, i) => (
      <Fragment key={i}>
        {line}
        {i !== text.split("\n").length - 1 && <br />}
      </Fragment>
    ));
  };

  // ホバーメッセージがあるかチェック
  const hasMessage = !!message;

  // 表示するメッセージを決定
  const pathMessage = path in PATH_DEFAULT_MESSAGES ? PATH_DEFAULT_MESSAGES[path as keyof typeof PATH_DEFAULT_MESSAGES] : null;
  const displayMessage = message || pathMessage || "";

  // メッセージの変更を監視し、アニメーションをトリガー
  useEffect(() => {
    // 初期表示時または明示的なメッセージ変更時
    if (message !== prevMessageRef.current) {
      // 必ずアニメーションをトリガー
      setShouldAnimate(true);

      // 前回のタイマーがあれば初期化するためのID
      let animationTimer: NodeJS.Timeout;

      // アニメーションを再開するため少し遅延を設ける
      const startTimer = setTimeout(() => {
        setShouldAnimate(true);
        
        // アニメーション表示後、一定時間後に状態を戻す
        animationTimer = setTimeout(() => {
          setShouldAnimate(false);
        }, 1000); // 1秒間アニメーション表示
      }, 10); // わずかな遅延で確実にトリガー

      // 現在のメッセージを保存
      prevMessageRef.current = message;

      // クリーンアップ関数でタイマーをクリア
      return () => {
        clearTimeout(startTimer);
        clearTimeout(animationTimer);
      };
    }
  }, [message]); // メッセージが変わるたびに実行

  // パス変更を監視し、アニメーションをトリガー
  useEffect(() => {
    // パスが変更された時にアニメーションを実行
    setShouldAnimate(true);
    
    const animationTimer = setTimeout(() => {
      setShouldAnimate(false);
    }, 1000);
    
    return () => {
      clearTimeout(animationTimer);
    };
  }, [path]); // パスが変わるたびに実行

  // ページトップへスクロール
  const scrollToTop = (): void => {
    document.body.scrollTop = 0;

    // スクロール時もアニメーションを必ず実行
    setShouldAnimate(false);
    setTimeout(() => {
      setShouldAnimate(true);
      setTimeout(() => setShouldAnimate(false), 1000);
    }, 10);
  };

  return (
    <div
      className={`${styles.supporterContainer} ${
        isFooterVisible ? styles.aboveFooter : ""
      }`}
      ref={supporterRef}
    >
      {/* 吹き出し - キャラクターの左に表示 */}
      {(hasMessage || isHovering || displayMessage) && (
        <div
          className={`${styles.balloonWrapper} ${
            shouldAnimate ? styles.animate : ""
          }`}
        >
          <p>{formatMessage(displayMessage)}</p>
        </div>
      )}

      {/* サポーターキャラクター */}
      <div
        className={`${styles.supporter} ${shouldAnimate ? styles.bounce : ""}`}
        onClick={scrollToTop}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        role="button"
        aria-label="クリックするとページトップへ移動します"
        title="トップへ戻る"
      >
        <Icon
          icon={"/assets/images/ricchy-black.png"}
          alt="サポーターのリッチー"
          size="lg"
          isBorder={true}
          borderColor="gold"
          isRound={true}
          hasHoverEffect={false}
        />
      </div>
    </div>
  );
};
