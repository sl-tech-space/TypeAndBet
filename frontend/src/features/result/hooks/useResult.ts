import { useEffect, useState } from "react";

import { GAME_MODE_ID } from "@/constants";
import { type GameResult } from "@/features/result/types";
import { useLoading } from "@/hooks";

/**
 * タイピング結果を取得するフック
 * @returns
 */
export const useResult = (): {
  result: GameResult | null;
  isLoading: boolean;
  isSimulate: boolean;
  isPlay: boolean;
} => {
  const [result, setResult] = useState<GameResult | null>(null);
  const { isLoading, withLoading } = useLoading();

  const isSimulate = result?.gameType === GAME_MODE_ID.SIMULATE;
  const isPlay = result?.gameType === GAME_MODE_ID.PLAY;

  useEffect(() => {
    // 関数を定義
    const fetchData = async (): Promise<void> => {
      try {
        const response = await fetch("/api/result");
        const data = await response.json();
        setResult(data.result);
      } catch (error) {
        console.error("結果の取得に失敗:", error);
      }
    };

    // withLoadingでラップした関数を実行
    const fetchResult = withLoading(fetchData);
    fetchResult();

    // useEffectとisLoadingで循環参照を防ぐためLinterの警告を回避
  }, [withLoading]);

  return { result, isLoading, isSimulate, isPlay };
};
