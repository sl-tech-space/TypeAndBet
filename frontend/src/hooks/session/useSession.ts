import { useSession as useNextAuthSession } from "next-auth/react";

import type { User } from "@/types";

/**
 * セッション管理用カスタムフック
 * @returns セッション情報
 */
export const useSession = (): {
  user: User | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
} => {
  const { data: session, status } = useNextAuthSession();

  const user = session?.user
    ? ({
        ...session.user,
        icon: session.user.icon ?? null,
        createdAt: (session.user as User).createdAt ?? "",
        updatedAt: (session.user as User).updatedAt ?? "",
      } as User)
    : undefined;

  return {
    user,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
  };
};
