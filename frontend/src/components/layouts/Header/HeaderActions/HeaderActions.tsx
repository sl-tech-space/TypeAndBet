import { HeaderActionsClient } from "./HeaderActionsClient";
import { SessionProvider } from "next-auth/react";

/**
 * ヘッダーのアクションコンポーネント
 * @returns ヘッダーアクションコンポーネント
 */
export const HeaderActions = () => {
  return (
    <SessionProvider>
      <HeaderActionsClient />
    </SessionProvider>
  );
};

export default HeaderActions;
