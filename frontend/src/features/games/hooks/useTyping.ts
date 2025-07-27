"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";

import {
  COUNT_DOWN_TIME,
  INITIAL_VALUE,
  INITIAL_SENTENCE_COUNT,
} from "@/constants";
import { RomajiTrie, buildRomajiTrie } from "@/features/games";
import { removeSpaces, removeSpacesFromArray } from "@/utils";

import { useTypingContext } from "../contexts/TypingContext";

import { useGenerator, useTimer, useKeydown } from "./";

import type { KeydownEvent, Sentence, InputState, RomajiProgress } from "./";

/**
 * タイピングゲームのロジックを管理するフック
 * @returns タイピングゲーム関連の状態と関数
 */
export const useTyping = () => {
  // TypingContextから正タイプ数と正タイプ率を取得
  const {
    correctTypeCount,
    setCorrectTypeCount,
    totalTypeCount,
    setTotalTypeCount,
    accuracy,
    setCurrentKeyStatus,
  } = useTypingContext();

  // 状態と関数の取得
  const {
    sentences: generatedSentences,
    promptDetail,
    isLoading,
    error,
    generate,
  } = useGenerator();

  // 実際に使用する文章配列（ローカルで管理）
  const [sentences, setSentences] = useState<Sentence[]>([]);

  // 現在表示している文章のインデックス
  const [currentSentenceIndex, setCurrentSentenceIndex] =
    useState(INITIAL_VALUE);

  // 文章の生成状態管理
  const isGeneratingRef = useRef(false);

  // 現在の文章
  const targetSentence = useRef<Sentence | null>(null);
  // Trie構造を保持するRef
  const trieRef = useRef<RomajiTrie | null>(null);

  // カウントダウン
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [displayCountdown, setDisplayCountdown] = useState(COUNT_DOWN_TIME);
  const countdownRef = useRef(COUNT_DOWN_TIME);

  const { time, isFinished, stopTimer, start } = useTimer();
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // ゲーム開始判定
  const [isReady, setIsReady] = useState(false);

  // 入力状態
  const [inputState, setInputState] = useState<InputState>({
    currentIndex: INITIAL_VALUE,
    currentPattern: INITIAL_VALUE,
    inputHistory: [],
    confirmedPatterns: [],
  });

  // タイピングの進行状況
  const [romajiProgress, setRomajiProgress] = useState<RomajiProgress>({
    typed: [],
    current: "",
    remaining: [],
    inputString: "",
    isValid: true,
    nextChars: [],
    shortRomaji: [],
    missedChar: "",
    expectedChar: "",
  });

  // 入力状態のリセット処理を分離
  const resetInputState = useCallback(() => {
    return {
      currentIndex: INITIAL_VALUE,
      currentPattern: INITIAL_VALUE,
      inputHistory: [],
      confirmedPatterns: [],
    };
  }, []);

  // ゲームリセット時の処理
  const resetGame = useCallback(() => {
    setCorrectTypeCount(INITIAL_VALUE);
    setTotalTypeCount(INITIAL_VALUE);
    setInputState(resetInputState());
    // キー状態もリセット
    setCurrentKeyStatus("", null);
  }, [
    resetInputState,
    setCorrectTypeCount,
    setTotalTypeCount,
    setCurrentKeyStatus,
  ]);

  // カウントダウン完了時の処理
  useEffect(() => {
    if (isCountingDown && countdownRef.current > INITIAL_VALUE) {
      // 以前のタイマーがあればクリア
      if (countdownTimerRef.current) {
        clearTimeout(countdownTimerRef.current);
      }

      countdownTimerRef.current = setTimeout(() => {
        countdownRef.current--;
        setDisplayCountdown(countdownRef.current);

        if (countdownRef.current === INITIAL_VALUE) {
          setIsCountingDown(false);
          setIsReady(true);
          resetGame();
          start();
        }
      }, 1000);
    }

    return () => {
      if (countdownTimerRef.current) {
        clearTimeout(countdownTimerRef.current);
      }
    };
  }, [isCountingDown, displayCountdown, start, resetGame]);

  // 初回読み込み時に文章を生成
  useEffect(() => {
    if (typeof window !== "undefined") {
      generate();
    }
    // クリーンアップ関数
    return () => {
      if (countdownTimerRef.current) {
        clearTimeout(countdownTimerRef.current);
      }
    };
  }, [generate]);

  // 文章からスペースを削除する処理をuseMemoで最適化
  const cleanSentences = useCallback((rawSentences: Sentence[]): Sentence[] => {
    return rawSentences.map((sentence) => {
      // 文章のhiraganaからスペースを削除
      const cleanedHiragana: string = removeSpaces(sentence.hiragana);
      // romajiパターンの各要素からスペースを削除
      const cleanedRomaji: string[][] = sentence.romaji.map((patternArray) =>
        removeSpacesFromArray(patternArray)
      );

      return {
        ...sentence,
        hiragana: cleanedHiragana,
        romaji: cleanedRomaji,
      };
    });
  }, []);

  // generatedSentencesが更新されたら、ローカルのsentencesを更新
  useEffect(() => {
    if (generatedSentences.length > 0 && !isLoading) {
      // スペースを削除した文章を作成
      const cleanedSentences: Sentence[] = cleanSentences(generatedSentences);

      // ローカルの文章配列に新しい文章を追加（関数式でステート更新を最適化）
      setSentences((prevSentences) => [...prevSentences, ...cleanedSentences]);

      // 生成フラグをリセット
      isGeneratingRef.current = false;
    }
  }, [generatedSentences, isLoading, cleanSentences]);

  // 文章セットが更新されたとき、現在の文章をセット
  useEffect(() => {
    if (sentences.length > INITIAL_VALUE) {
      // 現在の文章インデックスが文章の数を超えていないか確認
      const safeIndex: number = Math.min(
        currentSentenceIndex,
        sentences.length - 1
      );
      if (safeIndex !== currentSentenceIndex) {
        setCurrentSentenceIndex(safeIndex);
      }

      // 現在の文章をセット
      const currentSentence: Sentence = sentences[safeIndex];
      targetSentence.current = currentSentence;

      // Trie構造を構築
      if (targetSentence.current) {
        trieRef.current = buildRomajiTrie(targetSentence.current.romaji);
      }
    }
  }, [sentences, currentSentenceIndex]);

  // 残り文章数の計算
  const remainingSentences: number = useMemo(
    () => sentences.length - currentSentenceIndex - 1,
    [sentences.length, currentSentenceIndex]
  );

  // 残り文章数が少なくなった場合、新しい文章を生成
  useEffect(() => {
    if (
      !isLoading &&
      !isGeneratingRef.current &&
      remainingSentences < INITIAL_SENTENCE_COUNT &&
      sentences.length > 0
    ) {
      isGeneratingRef.current = true;
      generate();
    }
  }, [remainingSentences, sentences.length, isLoading, generate]);

  // romajiProgressの更新（メモ化して最適化）
  useEffect(() => {
    if (!targetSentence.current || !isReady || !trieRef.current) return;

    const pattern: string[] =
      targetSentence.current.romaji[inputState.currentPattern] || [];
    const currentIndex: number = inputState.currentIndex;
    const inputHistory: string[] = inputState.inputHistory;
    const inputString: string = inputHistory.join("");

    // 確定したパターンの取得
    const confirmedPatterns: number[] =
      inputState.confirmedPatterns.length > INITIAL_VALUE
        ? inputState.confirmedPatterns
        : Array.from(
            { length: targetSentence.current.romaji.length },
            (_, i) => i
          );

    // 入力済み文字の結合
    const typedChars: string[] = pattern.slice(INITIAL_VALUE, currentIndex);
    // 現在入力中の文字
    const currentChar: string = pattern[currentIndex] || "";
    // 残りの文字列
    const remainingChars: string[] = pattern.slice(currentIndex + 1);

    // パターン全体の長さを計算（タイプすべき文字数）
    const totalLength: number = targetSentence.current.romaji[0].length;

    // 全ての位置について最短のローマ字ユニットを取得
    const shortRomaji: string[] = Array(totalLength)
      .fill("")
      .map((_, idx) => {
        // 既に入力済みの場合は元のパターンを使用
        if (idx < currentIndex) {
          return pattern[idx];
        }
        // それ以外は最短のパターンを取得
        return trieRef.current!.getShortestRomajiUnitForAllPatterns(
          idx,
          confirmedPatterns
        );
      });

    // 次に入力可能な文字を取得
    let nextChars: string[] = [];
    if (trieRef.current) {
      nextChars = trieRef.current.getNextPossibleChars(
        inputHistory,
        currentIndex,
        confirmedPatterns
      );
    }

    // 次の入力文字がない場合でも、入力履歴が空なら次のインデックスの文字を候補として表示
    if (
      nextChars.length === INITIAL_VALUE &&
      inputHistory.length === INITIAL_VALUE &&
      currentIndex < pattern.length
    ) {
      const currentUnit: string = pattern[currentIndex];
      if (currentUnit && currentUnit.length > INITIAL_VALUE) {
        nextChars = [currentUnit[INITIAL_VALUE]];
      }
    }

    // 正しい入力かどうかを判定
    // 入力履歴があるけど次の文字がない場合は無効な入力と判断
    const isValidInput =
      inputHistory.length === INITIAL_VALUE || nextChars.length > INITIAL_VALUE;

    // ミスした文字と期待される文字の特定
    let missedChar: string = "";
    let expectedChar: string = "";

    if (!isValidInput && inputString.length > INITIAL_VALUE) {
      // 最後に入力した文字がミスした文字
      missedChar = inputString[inputString.length - 1];

      // 期待される文字を特定
      const currentUnit: string = shortRomaji[currentIndex] || "";
      if (
        currentUnit.length > INITIAL_VALUE &&
        inputString.length <= currentUnit.length
      ) {
        const validPrefix: string = inputString.substring(
          INITIAL_VALUE,
          inputString.length - 1
        );
        // 入力済みの有効な部分の後に期待される文字
        expectedChar = currentUnit.charAt(validPrefix.length);
      }
    }

    // Object.assign()を使用して既存のオブジェクトを更新
    setRomajiProgress((prev) => {
      const newProgress = { ...prev };
      newProgress.typed = typedChars;
      newProgress.current = currentChar;
      newProgress.remaining = remainingChars;
      newProgress.inputString = isValidInput ? inputString : "";
      newProgress.isValid = isValidInput;
      newProgress.nextChars = nextChars;
      newProgress.shortRomaji = shortRomaji;
      newProgress.missedChar = missedChar;
      newProgress.expectedChar = expectedChar;
      return newProgress;
    });
  }, [inputState, isReady]);

  // カウントダウン処理
  const _handleCountdownStart = useCallback(
    (event: KeydownEvent) => {
      if (
        event.key === "Enter" &&
        !isReady &&
        !isCountingDown &&
        !isLoading &&
        !isFinished &&
        sentences.length > INITIAL_VALUE &&
        promptDetail
      ) {
        setIsCountingDown(true);
        countdownRef.current = COUNT_DOWN_TIME;
        setDisplayCountdown(COUNT_DOWN_TIME);
      }
    },
    [
      isReady,
      isCountingDown,
      isLoading,
      isFinished,
      sentences.length,
      promptDetail,
    ]
  );

  // ゲーム開始後のタイピング処理
  const _handleTypingProcess = useCallback(
    (event: KeydownEvent) => {
      if (
        !isReady ||
        !targetSentence.current ||
        !trieRef.current ||
        isFinished
      ) {
        return;
      }

      const currentInput: KeydownEvent["key"] = event.key;

      // 現在の入力状態
      const currentInputHistory: string[] = [
        ...inputState.inputHistory,
        currentInput,
      ];
      const currentInputString: string = currentInputHistory.join("");

      // 現在確定しているパターンのみを対象に検索
      const confirmedPatterns: number[] =
        inputState.confirmedPatterns.length > INITIAL_VALUE
          ? inputState.confirmedPatterns
          : Array.from(
              { length: targetSentence.current.romaji.length },
              (_, i) => i
            );

      // 有効なパターンのインデックスを取得
      const validPatternIndices: number[] = trieRef.current.findValidPatterns(
        currentInputHistory,
        inputState.currentIndex,
        confirmedPatterns
      );

      // Trie構造を使って入力の有効性をチェック
      const isValidInput: boolean = validPatternIndices.length > INITIAL_VALUE;

      // キーの状態を更新 - TypingContextを使用
      setCurrentKeyStatus(currentInput, isValidInput);

      // 不正解の場合
      if (!isValidInput) {
        // 不正解の場合は入力履歴を更新せず、表示更新のためにromajiProgressを更新
        setRomajiProgress((prev) => ({
          ...prev,
          isValid: false,
          inputString: inputState.inputHistory.join(""),
        }));

        // 総タイプ数のみ更新
        setTotalTypeCount((prev) => prev + 1);

        return;
      }

      // 正タイプ数と総タイプ数をカウント - Contextの状態を更新
      setCorrectTypeCount((prev) => prev + 1);
      setTotalTypeCount((prev) => prev + 1);

      // 入力状態を更新
      setInputState((prev) => {
        // 常に最初の有効パターンを使用する
        const newCurrentPattern: number | undefined =
          validPatternIndices[INITIAL_VALUE];

        if (newCurrentPattern === undefined) {
          // 有効なパターンが見つからない場合は変更なし
          return prev;
        }

        // 現在の単語が完了したかどうかをチェック
        const currentPattern =
          targetSentence.current?.romaji[newCurrentPattern] || [];
        const currentRomajiUnit = currentPattern[prev.currentIndex] || "";

        // 入力途中でパターンが確定した場合（最初の文字入力時など）
        // 確定したパターンのみを保持
        let newConfirmedPatterns = prev.confirmedPatterns;

        // まだパターンが確定していない場合は、有効なパターンを確定する
        if (
          prev.confirmedPatterns.length === INITIAL_VALUE ||
          (prev.confirmedPatterns.length > validPatternIndices.length &&
            validPatternIndices.length > INITIAL_VALUE)
        ) {
          newConfirmedPatterns = validPatternIndices;
        }

        // 単語の完了チェック - Trie構造の関数を使用
        const isCharComplete: boolean | null =
          // 完全一致のチェック
          currentRomajiUnit === currentInputString ||
          // 代替パターンを含めた完了チェック
          (trieRef.current &&
            trieRef.current.isInputComplete(
              currentInputString,
              prev.currentIndex,
              newConfirmedPatterns
            ));

        if (!isCharComplete) {
          // 単語の途中の場合は入力履歴を更新
          return {
            ...prev,
            currentPattern: newCurrentPattern,
            inputHistory: currentInputHistory,
            confirmedPatterns: newConfirmedPatterns,
          };
        }

        // 次の単語へ進む
        const newIndex: number = prev.currentIndex + 1;

        // 全ての単語が完了したかチェック
        if (newIndex >= currentPattern.length) {
          // 非同期で次の文章へ
          requestAnimationFrame(() => {
            // 次の文章へ移動
            setCurrentSentenceIndex((prevIndex) => {
              // 次の文章がある場合
              if (prevIndex + 1 < sentences.length) {
                return prevIndex + 1;
              }

              // すべての文章を入力し終わった場合
              return INITIAL_VALUE;
            });

            // 入力状態をリセット
            setInputState(resetInputState());
          });

          return resetInputState();
        }

        // 次の単語へ - パターンを保持して次の文字へ
        return {
          currentIndex: newIndex,
          currentPattern: newCurrentPattern,
          inputHistory: [], // 入力履歴をリセット
          confirmedPatterns: newConfirmedPatterns,
        };
      });
    },
    [
      isReady,
      inputState,
      setCurrentSentenceIndex,
      sentences.length,
      resetInputState,
      isFinished,
      setCorrectTypeCount,
      setTotalTypeCount,
      setCurrentKeyStatus,
    ]
  );

  // キーイベントのハンドリング
  const handleKeyDown = useCallback(
    (event: KeydownEvent) => {
      _handleCountdownStart(event);
      _handleTypingProcess(event);
    },
    [_handleCountdownStart, _handleTypingProcess]
  );

  // useKeydownフックを使用してキーイベントを監視
  useKeydown(handleKeyDown);

  // 次の入力可能な文字を取得する関数（SentenceDisplayコンポーネントで使用）
  const expectedChar = useCallback((): string[] => {
    if (!targetSentence.current || !trieRef.current) return [];

    // 確定したパターンのみ検索対象とする
    const confirmedPatterns =
      inputState.confirmedPatterns.length > INITIAL_VALUE
        ? inputState.confirmedPatterns
        : Array.from(
            { length: targetSentence.current.romaji.length },
            (_, i) => i
          );

    return trieRef.current.getNextPossibleChars(
      inputState.inputHistory,
      inputState.currentIndex,
      confirmedPatterns // 確定したパターンのみを検索対象とする
    );
  }, [inputState, targetSentence]);

  // 全ての文章入力後の処理（文章配列をクリーンアップするために使用）
  // 定期的に文章配列を整理して重複を防止
  useEffect(() => {
    // 完了した文章が一定数以上溜まったら、配列を整理する
    if (currentSentenceIndex > 10) {
      setSentences((prev) => {
        // 現在のインデックス以降の文章だけを残す
        return prev.slice(currentSentenceIndex);
      });
      // インデックスをリセット
      setCurrentSentenceIndex(0);
    }
  }, [currentSentenceIndex]);

  return {
    targetSentence,
    promptDetail,
    isLoading,
    isReady,
    isCountingDown,
    countdown: displayCountdown,
    time,
    isFinished,
    stopTimer,
    error,
    inputState,
    expectedChar,
    romajiProgress,
    correctTypeCount,
    totalTypeCount,
    accuracy,
  };
};
