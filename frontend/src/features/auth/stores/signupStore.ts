import { create } from "zustand";

import type { SignupSuccessInfo } from "../hooks/useSignup.types";

/**
 * サインアップ成功情報ストアの型
 */
type SignupSuccessStore = {
  successInfo: SignupSuccessInfo | null;
  setSuccessInfo: (info: SignupSuccessInfo) => void;
  clearSuccessInfo: () => void;
};

/**
 * サインアップ成功情報の状態管理
 * サインアップが成功した際の情報を一時的に保存し、
 * email-sentページで表示するために使用
 */
export const useSignupSuccessStore = create<SignupSuccessStore>((set) => ({
  successInfo: null,
  setSuccessInfo: (info: SignupSuccessInfo) => set({ successInfo: info }),
  clearSuccessInfo: () => set({ successInfo: null }),
}));
