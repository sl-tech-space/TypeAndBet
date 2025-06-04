"use client";

import { useState, useCallback } from "react";
import { getCharacterPatterns } from "jp-transliterator";
import { generateText } from "@/actions/games";
import { useAsyncState } from "@/hooks";
import type { TextPair, Sentence, PromptDetail } from "./generator.types";

/**
 * 文章生成のフック
 * 文章を生成する
 * @returns 文章、プロンプト詳細、エラー、ローディング、生成関数
 */
export const useGenerator = () => {
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [promptDetail, setPromptDetail] = useState<PromptDetail | null>(null);
  const { error, isLoading, withAsyncLoading } = useAsyncState();

  const handleGenerate = useCallback(async () => {
    return withAsyncLoading(async () => {
      const data = await generateText();

      if (data.success && data.result) {
        // すべてのペアを文章として設定
        const newSentences = data.result.pairs.map((pair: TextPair) => {
          // jp-transliteratorからローマ字パターンを取得
          const romajiPatterns = getCharacterPatterns(pair.hiragana);

          return {
            kanji: pair.kanji,
            hiragana: pair.hiragana,
            romaji: romajiPatterns,
          };
        });
        setSentences(newSentences);

        // プロンプト詳細を設定
        const newPromptDetail = {
          category: data.result.category,
          theme: data.result.theme,
        };
        setPromptDetail(newPromptDetail);
      }
    })();
  }, [withAsyncLoading]);

  return {
    sentences,
    setSentences,
    promptDetail,
    setPromptDetail,
    error,
    isLoading,
    generate: handleGenerate,
  };
};
