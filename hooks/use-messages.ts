import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMessages, createMessage } from "@/services/messages";
import type { CreateMessageInput } from "@/lib/types";

export function useMessages(boardId: string, enabled = true) {
  return useQuery({
    queryKey: ["messages", boardId],
    queryFn: () => getMessages(boardId),
    enabled: !!boardId && enabled,
  });
}

export function useCreateMessage(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateMessageInput) => createMessage(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", boardId] });
    },
  });
}
