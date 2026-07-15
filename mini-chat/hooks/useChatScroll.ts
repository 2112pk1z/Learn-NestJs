import { type DependencyList, useCallback, useEffect, useRef } from "react";

export function useChatScroll(dependencies: DependencyList) {
  const ref = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [dependencies, scrollToBottom]);

  return { ref, scrollToBottom };
}
