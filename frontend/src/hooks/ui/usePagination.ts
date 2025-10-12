import { useMemo, useCallback } from "react";
import { useRouter } from "next/router";

export type UsePaginationQueryOptions = {
  pageSize?: number;
  totalItems?: number;
  paramName?: string;
};

export function usePagination(opts: UsePaginationQueryOptions = {}) {
  const { pageSize = 10, totalItems = 0, paramName = "page" } = opts;
  const router = useRouter();

  const page = useMemo(() => {
    const raw = router.query[paramName];
    const n = Array.isArray(raw)
      ? parseInt(raw[0] ?? "1", 10)
      : parseInt(raw ?? "1", 10);
    return Number.isFinite(n) && n > 0 ? n : 1;
  }, [router.query, paramName]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalItems / pageSize)),
    [totalItems, pageSize],
  );

  const setPage = useCallback(
    (p: number) => {
      const next = Math.min(Math.max(1, p), totalPages);
      const q = { ...router.query, [paramName]: String(next) };
      router.push({ pathname: router.pathname, query: q }, undefined, {
        shallow: true,
        scroll: false,
      });
    },
    [router, paramName, totalPages],
  );

  const next = useCallback(() => setPage(page + 1), [page, setPage]);
  const prev = useCallback(() => setPage(page - 1), [page, setPage]);

  const slice = useCallback(
    <T>(items: T[]) => {
      const start = (page - 1) * pageSize;
      return items.slice(start, start + pageSize);
    },
    [page, pageSize],
  );

  return { page, setPage, totalPages, next, prev, pageSize, slice };
}
