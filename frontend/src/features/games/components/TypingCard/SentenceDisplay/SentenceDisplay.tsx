"use client";

import styles from "./SentenceDisplay.module.scss";
import { useTyping } from "@/features/games";
import { useTypingContext } from "@/features/games/contexts/TypingContext";
import { Text } from "@/components/ui";

export const SentenceDisplay = () => {
  const {
    targetSentence,
    isLoading,
    isReady,
    isCountingDown,
    countdown,
    isFinished,
    error,
    romajiProgress,
  } = useTyping();

  // 正タイプ数と正タイプ率はContextから取得
  const { correctTypeCount, accuracy } = useTypingContext();

  // ローマ字表示用の関数
  const renderRomaji = () => {
    if (!targetSentence.current || !isReady) return null;

    // romajiProgressを使用する
    const {
      typed,
      current,
      remaining,
      inputString,
      isValid,
      nextChars,
      shortRomaji,
      missedChar,
      expectedChar,
    } = romajiProgress;

    return (
      <div className={styles.sentence__romaji}>
        {/* 入力済み文字 (緑色) */}
        <span className={styles.sentence__typed}>{typed.join("")}</span>

        {/* 現在入力中の文字 (色付け) */}
        <span className={styles.sentence__current}>
          {isValid ? (
            <>
              {/* 正しく入力された部分 */}
              <span className={styles.sentence__correct}>{inputString}</span>
              {/* これから入力する部分 (赤色でハイライト) */}
              <span className={styles.sentence__next}>
                {/* 最短表記があれば使用、なければ元のパターン */}
                {shortRomaji && shortRomaji.length > typed.length
                  ? shortRomaji[typed.length].substring(inputString.length)
                  : current.substring(inputString.length)}
              </span>
            </>
          ) : (
            <>
              {/* ミスした文字のみ色付けして表示 */}
              {missedChar && (
                <span className={styles.sentence__incorrect}>{missedChar}</span>
              )}
              {/* 正しい入力のヒント */}
              <span className={styles.sentence__hint}>
                {/* ミスタイプ時 */}
                {!isValid && (
                  <>
                    {shortRomaji && shortRomaji.length > typed.length && (
                      <>
                        {inputString && (
                          <span className={styles.sentence__correct}>
                            {inputString}
                          </span>
                        )}

                        {shortRomaji[typed.length].substring(
                          inputString.length + (expectedChar ? 1 : 0)
                        )}
                      </>
                    )}
                  </>
                )}

                {/* 正しい入力の場合 */}
                {isValid && (
                  <>
                    {/* 入力済みの部分は緑色でハイライト */}
                    {inputString && (
                      <span className={styles.sentence__correct}>
                        {inputString}
                      </span>
                    )}

                    {/* 次に入力すべき文字（1文字目）だけを強調表示 */}
                    {nextChars.length > 0 && (
                      <span className={styles.sentence__next_char}>
                        {nextChars[0]}
                      </span>
                    )}
                    {/* 残りのローマ字部分 */}
                    {shortRomaji && shortRomaji.length > typed.length
                      ? shortRomaji[typed.length].substring(
                          nextChars.length > 0 ? 1 : 0
                        )
                      : current.substring(nextChars.length > 0 ? 1 : 0)}
                  </>
                )}
              </span>
            </>
          )}
        </span>

        {/* 残りの文字列 (灰色) - 最短パターンを表示 */}
        <span className={styles.sentence__remaining}>
          {shortRomaji && shortRomaji.length > typed.length + 1
            ? shortRomaji.slice(typed.length + 1).join("")
            : remaining.join("")}
        </span>
      </div>
    );
  };

  // 表示内容の決定（優先度が高い順）
  const renderContent = () => {
    // タイマー終了時
    if (isFinished) {
      return (
        <Text variant="p" size="xlarge" color="gold">
          <em>終了</em>
        </Text>
      );
    }

    // エラーの場合
    if (error) {
      return (
        <Text variant="p" size="xlarge" color="accent">
          エラーが発生しました: {error.message || String(error)}
        </Text>
      );
    }

    // カウントダウン中
    if (isCountingDown) {
      return (
        <Text variant="p" size="xlarge" color="gold">
          <em>{countdown}</em>
        </Text>
      );
    }

    // ゲーム開始前
    if (!isReady) {
      if (isLoading) {
        return (
          <Text variant="p" size="xlarge" color="gold">
            <em>文章を読み込み中...</em>
          </Text>
        );
      }
      return (
        <Text variant="p" size="xlarge" color="gold">
          <em>Enterキーで開始します</em>
        </Text>
      );
    }

    // ゲーム開始後は、isLoadingに関わらず現在の文章を表示
    if (targetSentence.current) {
      return (
        <div className={styles.sentence__target}>
          <Text variant="p" size="xxlarge" color="gold">
            {targetSentence.current.kanji}
          </Text>
          <Text variant="p" size="large">
            {targetSentence.current.hiragana}
          </Text>
          {renderRomaji()}
        </div>
      );
    }

    // 文章がない場合（通常ここには到達しない）
    return null;
  };

  return <div className={styles.sentence}>{renderContent()}</div>;
};

export default SentenceDisplay;
