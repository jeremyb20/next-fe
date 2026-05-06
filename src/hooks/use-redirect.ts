// hooks/useRedirect.ts
import { useCallback } from 'react';
import { useRouter } from '@/routes/hooks';

export const useRedirect = () => {
  const router = useRouter();

  const redirect = useCallback(
    (redirectTo: string) => {
      router.push(redirectTo);
    },
    [router]
  );

  const redirectReplace = useCallback(
    (redirectTo: string) => {
      router.replace(redirectTo);
    },
    [router]
  );

  const redirectBack = useCallback(() => {
    router.back();
  }, [router]);

  return { redirect, redirectReplace, redirectBack };
};