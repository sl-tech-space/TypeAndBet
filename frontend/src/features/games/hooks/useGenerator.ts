"use client";

import { getCharacterPatterns } from "jp-transliterator";
import { useCallback, useState } from "react";

import { generateText } from "@/actions/games";
import { ErrorState, useAsyncState } from "@/hooks";

import type { GeneratorResult, Sentence, TextPair } from "./generator.types";

/**
 * 文章生成のフック
 * 文章を生成する
 * @returns 文章、プロンプト詳細、エラー、ローディング、生成関数
 */
export const useGenerator = (): {
  sentences: Sentence[];
  setSentences: (sentences: Sentence[]) => void;
  error: ErrorState | null;
  isLoading: boolean;
  generate: () => Promise<void>;
} => {
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const { error, isLoading, withAsyncLoading } = useAsyncState();

  // 漢字検出用（CJK統合漢字）
  const KANJI_REGEX = /[\u4E00-\u9FFF]/;

  const handleGenerate = useCallback(async () => {
    return withAsyncLoading(async () => {
      const data = await generateText();

      if (data.success && data.result) {
        const result: GeneratorResult["textPairs"] = data.result;

        // ひらがなに漢字が含まれる項目を除外
        const safePairs = result.filter(
          (pair: TextPair) => pair.hiragana && !KANJI_REGEX.test(pair.hiragana)
        );

        const newSentences = safePairs.map((pair: TextPair) => {
          const romajiPatterns = getCharacterPatterns(
            pair.hiragana
          ) as string[][];

          return {
            kanji: pair.kanji,
            hiragana: pair.hiragana,
            romaji: romajiPatterns,
          };
        });

        setSentences(newSentences);
      }
    })();
  }, [withAsyncLoading]);

  return {
    sentences,
    setSentences,
    error,
    isLoading,
    generate: handleGenerate,
  };
};
