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

  const handleGenerate = useCallback(async () => {
    return withAsyncLoading(async () => {
      const data = await generateText();

      if (data.success && data.result) {
        const result: GeneratorResult["textPairs"] = data.result;
        // すべてのペアを文章として設定
        const newSentences = result.map((pair: TextPair) => {
          // jp-transliteratorからローマ字パターンを取得
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
