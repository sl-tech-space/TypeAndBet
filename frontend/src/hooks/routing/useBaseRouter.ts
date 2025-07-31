import { useRouter } from "next/navigation";

/**
 * ベースルーター
 * @returns ベースルーター
 */
export const useBaseRouter = (): {
  push: (path: string) => void;
  back: () => void;
  refresh: () => void;
  replace: (path: string) => void;
  prefetch: (path: string) => void;
} => {
  const router = useRouter();

  return {
    push: router.push,
    back: router.back,
    refresh: router.refresh,
    replace: router.replace,
    prefetch: router.prefetch,
  };
};
