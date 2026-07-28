import {
  useMutation,
  useQueryClient,
  type MutationFunction,
  type QueryClient,
} from "@tanstack/react-query";

type MaybePromise<T> = Promise<T> | T;

export type OptimisticMutationOptions<
  TData,
  TVariables,
  TSnapshot,
  TError extends Error = Error,
> = {
  mutationFn: MutationFunction<TData, TVariables>;
  snapshot: (
    queryClient: QueryClient,
    variables: TVariables,
  ) => MaybePromise<TSnapshot>;
  update: (
    queryClient: QueryClient,
    variables: TVariables,
    snapshot: TSnapshot,
  ) => void;
  rollback: (
    queryClient: QueryClient,
    variables: TVariables,
    snapshot: TSnapshot,
  ) => void;
  reconcile: (queryClient: QueryClient, data: TData) => void;
  invalidate?: (
    queryClient: QueryClient,
    variables: TVariables,
  ) => MaybePromise<unknown>;
  onStart?: (variables: TVariables) => void;
  onFailure?: (error: TError, variables: TVariables) => void;
  onSuccess?: (data: TData, variables: TVariables) => void;
};

export function useOptimisticMutation<
  TData,
  TVariables,
  TSnapshot,
  TError extends Error = Error,
>({
  mutationFn,
  snapshot,
  update,
  rollback,
  reconcile,
  invalidate,
  onStart,
  onFailure,
  onSuccess,
}: OptimisticMutationOptions<TData, TVariables, TSnapshot, TError>) {
  const queryClient = useQueryClient();

  return useMutation<TData, TError, TVariables, TSnapshot>({
    mutationFn,
    onMutate: async (variables) => {
      onStart?.(variables);
      const cacheSnapshot = await snapshot(queryClient, variables);
      try {
        update(queryClient, variables, cacheSnapshot);
      } catch (error) {
        rollback(queryClient, variables, cacheSnapshot);
        throw error;
      }
      return cacheSnapshot;
    },
    onError: (error, variables, cacheSnapshot) => {
      if (cacheSnapshot !== undefined) {
        rollback(queryClient, variables, cacheSnapshot);
      }
      onFailure?.(error, variables);
    },
    onSuccess: (data, variables) => {
      reconcile(queryClient, data);
      onSuccess?.(data, variables);
    },
    onSettled: (_data, _error, variables) => {
      if (invalidate) void invalidate(queryClient, variables);
    },
  });
}
