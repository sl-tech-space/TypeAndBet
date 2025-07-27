import { SessionProvider } from "next-auth/react";

import { HeaderActionsClient } from "./HeaderActionsClient";

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
