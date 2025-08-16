import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useGenerator } from "./useGenerator";

// Server Actionsのモック
vi.mock("@/actions/games", () => ({
  generateText: vi.fn(),
}));

// jp-transliteratorのモック
vi.mock("jp-transliterator", () => ({
  getCharacterPatterns: vi.fn(),
}));

// useAsyncStateのモック
vi.mock("@/hooks", () => ({
  useAsyncState: vi.fn(),
}));

const mockGenerateText = vi.mocked(
  await import("@/actions/games")
).generateText;
const mockGetCharacterPatterns = vi.mocked(
  await import("jp-transliterator")
).getCharacterPatterns;
const mockUseAsyncState = vi.mocked(await import("@/hooks")).useAsyncState;

describe("useGenerator", () => {
  const mockAsyncState = {
    error: null,
    isLoading: false,
    isSubmitting: false,
    isProcessing: false,
    withAsyncLoading: vi.fn((fn: () => Promise<any>) => {
      // 高階関数として、関数を受け取って新しい関数を返す
      return vi.fn(async () => {
        return await fn();
      });
    }),
    withAsyncSubmit: vi.fn(),
  };

  const mockTextPair = {
    kanji: "今日",
    hiragana: "きょう",
  };

  const mockRomajiPatterns = [
    ["kyo", "u"],
    ["kyo", "u"],
  ];

  const mockSentence = {
    kanji: "今日",
    hiragana: "きょう",
    romaji: mockRomajiPatterns,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAsyncState.mockReturnValue(mockAsyncState);
    mockGetCharacterPatterns.mockReturnValue(mockRomajiPatterns);
  });

  it("初期状態を返すこと", () => {
    const { result } = renderHook(() => useGenerator());

    expect(result.current.sentences).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(typeof result.current.generate).toBe("function");
    expect(typeof result.current.setSentences).toBe("function");
  });

  it("setSentencesが呼ばれた時に文章を設定すること", () => {
    const { result } = renderHook(() => useGenerator());

    act(() => {
      result.current.setSentences([mockSentence]);
    });

    expect(result.current.sentences).toEqual([mockSentence]);
  });

  describe("generate", () => {
    it("文章を正常に生成すること", async () => {
      const mockWithAsyncLoading = vi.fn((fn: () => Promise<any>) => {
        const wrappedFn = vi.fn(async () => {
          return await fn();
        });
        return wrappedFn;
      });

      mockUseAsyncState.mockReturnValue({
        ...mockAsyncState,
        withAsyncLoading: mockWithAsyncLoading,
      });

      const mockResponse = {
        success: true,
        result: [mockTextPair],
        error: null,
      };

      mockGenerateText.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useGenerator());

      await act(async () => {
        await result.current.generate();
      });

      expect(mockWithAsyncLoading).toHaveBeenCalled();
      expect(mockGenerateText).toHaveBeenCalled();
      expect(mockGetCharacterPatterns).toHaveBeenCalledWith("きょう");
      expect(result.current.sentences).toEqual([mockSentence]);
    });

    it("複数のテキストペアを処理すること", async () => {
      const mockWithAsyncLoading = vi.fn((fn: () => Promise<any>) => {
        return vi.fn(async () => {
          return await fn();
        });
      });

      mockUseAsyncState.mockReturnValue({
        ...mockAsyncState,
        withAsyncLoading: mockWithAsyncLoading,
      });

      const mockResponse = {
        success: true,
        result: [
          { kanji: "今日", hiragana: "きょう" },
          { kanji: "明日", hiragana: "あした" },
        ],
        error: null,
      };

      mockGenerateText.mockResolvedValue(mockResponse);
      mockGetCharacterPatterns
        .mockReturnValueOnce([["kyo", "u"]])
        .mockReturnValueOnce([["a", "shi", "ta"]]);

      const { result } = renderHook(() => useGenerator());

      await act(async () => {
        await result.current.generate();
      });

      expect(result.current.sentences).toHaveLength(2);
      expect(result.current.sentences[0]).toEqual({
        kanji: "今日",
        hiragana: "きょう",
        romaji: [["kyo", "u"]],
      });
      expect(result.current.sentences[1]).toEqual({
        kanji: "明日",
        hiragana: "あした",
        romaji: [["a", "shi", "ta"]],
      });
    });

    it("generateTextの失敗を適切に処理すること", async () => {
      const mockWithAsyncLoading = vi.fn((fn: () => Promise<any>) => {
        return vi.fn(async () => {
          return await fn();
        });
      });

      mockUseAsyncState.mockReturnValue({
        ...mockAsyncState,
        withAsyncLoading: mockWithAsyncLoading,
      });

      const mockResponse = {
        success: false,
        result: null,
        error: null,
      };

      mockGenerateText.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useGenerator());

      await act(async () => {
        await result.current.generate();
      });

      expect(mockWithAsyncLoading).toHaveBeenCalled();
      expect(mockGenerateText).toHaveBeenCalled();
      expect(result.current.sentences).toEqual([]);
    });

    it("generateTextのエラーを適切に処理すること", async () => {
      const mockWithAsyncLoading = vi.fn((fn: () => Promise<any>) => {
        return vi.fn(async () => {
          return await fn();
        });
      });

      mockUseAsyncState.mockReturnValue({
        ...mockAsyncState,
        withAsyncLoading: mockWithAsyncLoading,
      });

      const mockError = new Error("API Error");
      mockGenerateText.mockRejectedValue(mockError);

      const { result } = renderHook(() => useGenerator());

      // エラーが発生することを期待
      await expect(async () => {
        await act(async () => {
          await result.current.generate();
        });
      }).rejects.toThrow("API Error");

      expect(mockWithAsyncLoading).toHaveBeenCalled();
      expect(mockGenerateText).toHaveBeenCalled();
    });

    it("空のペア配列を適切に処理すること", async () => {
      const mockWithAsyncLoading = vi.fn((fn: () => Promise<any>) => {
        return vi.fn(async () => {
          return await fn();
        });
      });

      mockUseAsyncState.mockReturnValue({
        ...mockAsyncState,
        withAsyncLoading: mockWithAsyncLoading,
      });

      const mockResponse = {
        success: true,
        result: [],
        error: null,
      };

      mockGenerateText.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useGenerator());

      await act(async () => {
        await result.current.generate();
      });

      expect(result.current.sentences).toEqual([]);
    });

    it("jp-transliteratorのエラーを適切に処理すること", async () => {
      const mockWithAsyncLoading = vi.fn((fn: () => Promise<any>) => {
        return vi.fn(async () => {
          return await fn();
        });
      });

      mockUseAsyncState.mockReturnValue({
        ...mockAsyncState,
        withAsyncLoading: mockWithAsyncLoading,
      });

      const mockResponse = {
        success: true,
        result: [mockTextPair],
        error: null,
      };

      mockGenerateText.mockResolvedValue(mockResponse);
      mockGetCharacterPatterns.mockImplementation(() => {
        throw new Error("Transliteration error");
      });

      const { result } = renderHook(() => useGenerator());

      await expect(async () => {
        await act(async () => {
          await result.current.generate();
        });
      }).rejects.toThrow("Transliteration error");
    });

    it("新しい文章を生成する際に既存の文章を保持すること", async () => {
      const mockWithAsyncLoading = vi.fn((fn: () => Promise<any>) => {
        return vi.fn(async () => {
          return await fn();
        });
      });

      mockUseAsyncState.mockReturnValue({
        ...mockAsyncState,
        withAsyncLoading: mockWithAsyncLoading,
      });

      const { result } = renderHook(() => useGenerator());

      // 既存の文章を設定
      act(() => {
        result.current.setSentences([mockSentence]);
      });

      expect(result.current.sentences).toEqual([mockSentence]);

      // 新しい文章を生成
      const mockResponse = {
        success: true,
        result: [{ kanji: "明日", hiragana: "あした" }],
        error: null,
      };

      mockGenerateText.mockResolvedValue(mockResponse);
      mockGetCharacterPatterns.mockReturnValue([["a", "shi", "ta"]]);

      await act(async () => {
        await result.current.generate();
      });

      // 既存の文章は保持され、新しい文章が追加される
      expect(result.current.sentences).toHaveLength(1);
      expect(result.current.sentences[0]).toEqual({
        kanji: "明日",
        hiragana: "あした",
        romaji: [["a", "shi", "ta"]],
      });
    });
  });

  it("複雑なローマ字パターンを適切に処理すること", async () => {
    const mockWithAsyncLoading = vi.fn((fn: () => Promise<any>) => {
      return vi.fn(async () => {
        return await fn();
      });
    });

    mockUseAsyncState.mockReturnValue({
      ...mockAsyncState,
      withAsyncLoading: mockWithAsyncLoading,
    });

    const mockResponse = {
      success: true,
      result: [{ kanji: "学校", hiragana: "がっこう" }],
      error: null,
    };

    mockGenerateText.mockResolvedValue(mockResponse);
    mockGetCharacterPatterns.mockReturnValue([
      ["ga", "t", "su", "ko", "u"],
      ["ga", "xtsu", "ko", "u"],
    ]);

    const { result } = renderHook(() => useGenerator());

    await act(async () => {
      await result.current.generate();
    });

    expect(result.current.sentences[0].romaji).toEqual([
      ["ga", "t", "su", "ko", "u"],
      ["ga", "xtsu", "ko", "u"],
    ]);
  });

  it("非同期状態のローディングを適切に処理すること", async () => {
    const mockWithAsyncLoading = vi.fn((fn: () => Promise<any>) => {
      return vi.fn(async () => {
        return await fn();
      });
    });

    mockUseAsyncState.mockReturnValue({
      ...mockAsyncState,
      withAsyncLoading: mockWithAsyncLoading,
      isLoading: true,
    });

    const { result } = renderHook(() => useGenerator());

    expect(result.current.isLoading).toBe(true);
  });

  it("非同期状態のエラーを適切に処理すること", async () => {
    const mockError = { message: "Async state error" };
    const mockWithAsyncLoading = vi.fn((fn: () => Promise<any>) => {
      return vi.fn(async () => {
        return await fn();
      });
    });

    mockUseAsyncState.mockReturnValue({
      ...mockAsyncState,
      withAsyncLoading: mockWithAsyncLoading,
      error: mockError,
    });

    const { result } = renderHook(() => useGenerator());

    expect(result.current.error).toEqual(mockError);
  });
});
