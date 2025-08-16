import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ROUTE } from "@/constants";
import { useNavigator } from "./useNavigator";

// useBaseRouterをモック化
const mockPush = vi.hoisted(() => vi.fn());
vi.mock("./useBaseRouter", () => ({
  useBaseRouter: () => ({
    push: mockPush,
    back: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

describe("useNavigator", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("ホーム画面へのナビゲーション", () => {
    it("toHomeが正しいパスでpushを呼び出すこと", () => {
      const { result } = renderHook(() => useNavigator());

      result.current.toHome();

      expect(mockPush).toHaveBeenCalledWith(ROUTE.HOME);
      expect(mockPush).toHaveBeenCalledTimes(1);
    });
  });

  describe("認証画面へのナビゲーション", () => {
    it("toLoginが正しいパスでpushを呼び出すこと", () => {
      const { result } = renderHook(() => useNavigator());

      result.current.toLogin();

      expect(mockPush).toHaveBeenCalledWith(ROUTE.LOGIN);
      expect(mockPush).toHaveBeenCalledTimes(1);
    });

    it("toSignupが正しいパスでpushを呼び出すこと", () => {
      const { result } = renderHook(() => useNavigator());

      result.current.toSignup();

      expect(mockPush).toHaveBeenCalledWith(ROUTE.SIGNUP);
      expect(mockPush).toHaveBeenCalledTimes(1);
    });
  });

  describe("ゲーム画面へのナビゲーション", () => {
    it("toPlayが正しいパスでpushを呼び出すこと", () => {
      const { result } = renderHook(() => useNavigator());

      result.current.toPlay();

      expect(mockPush).toHaveBeenCalledWith(ROUTE.PLAY);
      expect(mockPush).toHaveBeenCalledTimes(1);
    });

    it("toPlayByIdが正しいパスでpushを呼び出すこと", () => {
      const { result } = renderHook(() => useNavigator());
      const gameId = "test-game-123";

      result.current.toPlayById(gameId);

      expect(mockPush).toHaveBeenCalledWith(`${ROUTE.PLAY}/${gameId}`);
      expect(mockPush).toHaveBeenCalledTimes(1);
    });

    it("toPlayByIdで空文字のgameIdが渡された場合、正しいパスでpushを呼び出すこと", () => {
      const { result } = renderHook(() => useNavigator());
      const gameId = "";

      result.current.toPlayById(gameId);

      expect(mockPush).toHaveBeenCalledWith(`${ROUTE.PLAY}/${gameId}`);
      expect(mockPush).toHaveBeenCalledTimes(1);
    });
  });

  describe("シミュレーション画面へのナビゲーション", () => {
    it("toSimulateが正しいパスでpushを呼び出すこと", () => {
      const { result } = renderHook(() => useNavigator());

      result.current.toSimulate();

      expect(mockPush).toHaveBeenCalledWith(ROUTE.SIMULATE);
      expect(mockPush).toHaveBeenCalledTimes(1);
    });

    it("toSimulateByIdが正しいパスでpushを呼び出すこと", () => {
      const { result } = renderHook(() => useNavigator());
      const sessionId = "test-session-456";

      result.current.toSimulateById(sessionId);

      expect(mockPush).toHaveBeenCalledWith(`${ROUTE.SIMULATE}/${sessionId}`);
      expect(mockPush).toHaveBeenCalledTimes(1);
    });

    it("toSimulateByIdで空文字のsessionIdが渡された場合、正しいパスでpushを呼び出すこと", () => {
      const { result } = renderHook(() => useNavigator());
      const sessionId = "";

      result.current.toSimulateById(sessionId);

      expect(mockPush).toHaveBeenCalledWith(`${ROUTE.SIMULATE}/${sessionId}`);
      expect(mockPush).toHaveBeenCalledTimes(1);
    });
  });

  describe("結果画面へのナビゲーション", () => {
    it("toResultが正しいパスでpushを呼び出すこと", () => {
      const { result } = renderHook(() => useNavigator());

      result.current.toResult();

      expect(mockPush).toHaveBeenCalledWith(ROUTE.RESULT);
      expect(mockPush).toHaveBeenCalledTimes(1);
    });
  });

  describe("認証関連画面へのナビゲーション", () => {
    it("toEmailSentが正しいパスでpushを呼び出すこと", () => {
      const { result } = renderHook(() => useNavigator());

      result.current.toEmailSent();

      expect(mockPush).toHaveBeenCalledWith(ROUTE.SIGNUP_EMAIL_SENT);
      expect(mockPush).toHaveBeenCalledTimes(1);
    });

    it("toPasswordForgetが正しいパスでpushを呼び出すこと", () => {
      const { result } = renderHook(() => useNavigator());

      result.current.toPasswordForget();

      expect(mockPush).toHaveBeenCalledWith(ROUTE.PASSWORD_FORGET);
      expect(mockPush).toHaveBeenCalledTimes(1);
    });

    it("toPasswordResetが正しいパスでpushを呼び出すこと", () => {
      const { result } = renderHook(() => useNavigator());

      result.current.toPasswordReset();

      expect(mockPush).toHaveBeenCalledWith(ROUTE.PASSWORD_RESET);
      expect(mockPush).toHaveBeenCalledTimes(1);
    });
  });

  describe("法的文書画面へのナビゲーション", () => {
    it("toTermsが正しいパスでpushを呼び出すこと", () => {
      const { result } = renderHook(() => useNavigator());

      result.current.toTerms();

      expect(mockPush).toHaveBeenCalledWith(ROUTE.TERMS);
      expect(mockPush).toHaveBeenCalledTimes(1);
    });

    it("toPrivacyが正しいパスでpushを呼び出すこと", () => {
      const { result } = renderHook(() => useNavigator());

      result.current.toPrivacy();

      expect(mockPush).toHaveBeenCalledWith(ROUTE.PRIVACY);
      expect(mockPush).toHaveBeenCalledTimes(1);
    });
  });

  describe("エラー画面へのナビゲーション", () => {
    it("toError.to404が正しいパスでpushを呼び出すこと", () => {
      const { result } = renderHook(() => useNavigator());

      result.current.toError.to404();

      expect(mockPush).toHaveBeenCalledWith(ROUTE.NOT_FOUND);
      expect(mockPush).toHaveBeenCalledTimes(1);
    });

    it("toError.to500が正しいパスでpushを呼び出すこと", () => {
      const { result } = renderHook(() => useNavigator());

      result.current.toError.to500();

      expect(mockPush).toHaveBeenCalledWith(ROUTE.SERVER_ERROR);
      expect(mockPush).toHaveBeenCalledTimes(1);
    });
  });

  describe("複数回のナビゲーション", () => {
    it("複数のナビゲーションが正しく動作すること", () => {
      const { result } = renderHook(() => useNavigator());

      result.current.toHome();
      result.current.toLogin();
      result.current.toPlay();

      expect(mockPush).toHaveBeenCalledWith(ROUTE.HOME);
      expect(mockPush).toHaveBeenCalledWith(ROUTE.LOGIN);
      expect(mockPush).toHaveBeenCalledWith(ROUTE.PLAY);
      expect(mockPush).toHaveBeenCalledTimes(3);
    });

    it("同じナビゲーションが複数回呼ばれても正しく動作すること", () => {
      const { result } = renderHook(() => useNavigator());

      result.current.toHome();
      result.current.toHome();
      result.current.toHome();

      expect(mockPush).toHaveBeenCalledWith(ROUTE.HOME);
      expect(mockPush).toHaveBeenCalledTimes(3);
    });
  });

  describe("パラメータ付きナビゲーション", () => {
    it("特殊文字を含むgameIdでtoPlayByIdが正しく動作すること", () => {
      const { result } = renderHook(() => useNavigator());
      const gameId = "game-123_456-789";

      result.current.toPlayById(gameId);

      expect(mockPush).toHaveBeenCalledWith(`${ROUTE.PLAY}/${gameId}`);
      expect(mockPush).toHaveBeenCalledTimes(1);
    });

    it("日本語を含むsessionIdでtoSimulateByIdが正しく動作すること", () => {
      const { result } = renderHook(() => useNavigator());
      const sessionId = "セッション123";

      result.current.toSimulateById(sessionId);

      expect(mockPush).toHaveBeenCalledWith(`${ROUTE.SIMULATE}/${sessionId}`);
      expect(mockPush).toHaveBeenCalledTimes(1);
    });
  });
});
