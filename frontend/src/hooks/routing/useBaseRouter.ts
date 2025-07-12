import { useRouter } from "next/navigation";

/**
 * ベースルーター
 * @returns ベースルーター
 */
export const useBaseRouter = () => {
  const router = useRouter();

  return {
    push: router.push,
    back: router.back,
    refresh: router.refresh,
    replace: router.replace,
    prefetch: router.prefetch,
  };
};
