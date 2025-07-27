import { useSession as useNextAuthSession } from "next-auth/react";

import type { User } from "@/types";

/**
 * セッション管理用カスタムフック
 * @returns セッション情報
 */
export const useSession = () => {
  const { data: session, status } = useNextAuthSession();

  const user = session?.user
    ? ({
        ...session.user,
        icon: session.user.icon ?? null,
        createdAt: (session.user as any).createdAt ?? "",
        updatedAt: (session.user as any).updatedAt ?? "",
      } as User)
    : undefined;

  return {
    user,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    accessToken: session?.accessToken,
    refreshToken: session?.refreshToken,
    expiresAt: session?.expiresAt,
  };
};
