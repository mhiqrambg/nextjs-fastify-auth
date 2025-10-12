import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";

function useDebouncedValue<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  const timer = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setDebounced(value), delay);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [value, delay]);
  return debounced;
}

type Options = {
  paramName?: string; // default "q"
  debounceMs?: number; // default 400
  onDebouncedChange?: (q: string) => void; // ex: reset page ke 1
  initialQuery?: string;
  writeInitialToUrl?: boolean;
};

export function useSearchQuery(opts: Options = {}) {
  const {
    paramName = "q",
    debounceMs = 400,
    onDebouncedChange,
    initialQuery = "",
    writeInitialToUrl = false,
  } = opts;

  const router = useRouter();

  const queryFromUrl = useMemo(() => {
    const raw = router.query[paramName];
    return Array.isArray(raw) ? (raw[0] ?? "") : (raw ?? "");
  }, [router.query, paramName]);

  const [text, setText] = useState<string>(queryFromUrl || initialQuery);
  useEffect(() => {
    setText(queryFromUrl || "");
  }, [queryFromUrl]);

  const debounced = useDebouncedValue(text, debounceMs);

  useEffect(() => {
    if (!writeInitialToUrl) return;
    const raw = router.query[paramName];
    const hasUrl = typeof raw !== "undefined";
    if (!hasUrl && initialQuery) {
      const q = { ...router.query, [paramName]: initialQuery };
      router.replace({ pathname: router.pathname, query: q }, undefined, {
        shallow: true,
        scroll: false,
      });
    }
  }, []);

  useEffect(() => {
    const current = queryFromUrl || "";
    if (debounced === current) return;

    const q = { ...router.query };
    if (debounced && debounced.trim()) q[paramName] = debounced.trim();
    else delete q[paramName];

    router.push({ pathname: router.pathname, query: q }, undefined, {
      shallow: true,
      scroll: false,
    });

    onDebouncedChange?.(debounced.trim());
  }, [debounced]);

  const onChange = useCallback((v: string) => setText(v), []);
  const clear = useCallback(() => setText(""), []);
  const setQuery = useCallback((v: string) => setText(v), []);

  return { text, debounced, onChange, clear, setQuery, paramName };
}
