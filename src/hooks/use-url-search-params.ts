import { useCallback } from "react";
import { useSearchParams } from "react-router";

type UpdateSearchParamOptions = {
  defaultValue?: string;
  remove?: readonly string[];
  replace?: boolean;
};

export function useUrlSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateSearchParam = useCallback(
    (
      key: string,
      value: string,
      {
        defaultValue,
        remove = [],
        replace = true,
      }: UpdateSearchParamOptions = {},
    ) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);

          if (!value || value === defaultValue) next.delete(key);
          else next.set(key, value);

          remove.forEach((param) => next.delete(param));
          return next;
        },
        { replace },
      );
    },
    [setSearchParams],
  );

  const removeSearchParams = useCallback(
    (keys: readonly string[], replace = true) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          keys.forEach((key) => next.delete(key));
          return next;
        },
        { replace },
      );
    },
    [setSearchParams],
  );

  return { removeSearchParams, searchParams, updateSearchParam };
}
