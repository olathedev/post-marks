import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBoards, getBoard, createBoard, updateBoard, deleteBoard } from "@/services/boards";
import type { CreateBoardInput } from "@/lib/types";

export function useBoards() {
  return useQuery({
    queryKey: ["boards"],
    queryFn: getBoards,
  });
}

export function useBoard(id: string) {
  return useQuery({
    queryKey: ["boards", id],
    queryFn: () => getBoard(id),
    enabled: !!id,
  });
}

export function useCreateBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateBoardInput) => createBoard(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });
}

export function useUpdateBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...input }: { id: string; title?: string; description?: string | null; visibility?: string }) =>
      updateBoard(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });
}

export function useDeleteBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBoard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });
}
