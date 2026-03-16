import { useEffect } from "react";
import { useLoading } from "@/components/ui/global-loader";

/**
 * Hook to automatically show/hide global loading overlay based on form pending state
 * @param isPending - The pending state from useActionState or useFormStatus
 */
export function useFormLoading(isPending: boolean) {
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(isPending);
  }, [isPending, setLoading]);
}
