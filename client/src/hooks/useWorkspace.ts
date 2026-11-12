import { trpc } from "@/lib/trpc";
import { getQueryKey } from "@trpc/react-query";
import { useQueryClient } from "@tanstack/react-query";
import type { Workspace } from "@shared/mansalpha";
import { toast } from "sonner";

export function useWorkspace(ownerId: number | null | undefined) {
  const utils = trpc.useUtils();
  const queryClient = useQueryClient();
  // Cache scope is not authorization. The server still selects only ctx.user.id.
  const input = {
    cacheScope: ownerId === null ? "guest" : `user-${ownerId ?? "loading"}`,
  };
  const query = trpc.workspace.get.useQuery(input, {
    enabled: ownerId !== undefined,
    retry: 1,
    refetchOnWindowFocus: false,
  });
  const save = trpc.workspace.save.useMutation();
  async function persist(next: Workspace) {
    if (ownerId == null || !query.data?.authenticated) {
      toast.error("Za trajno spremanje prijavite se Manus računom.");
      return false;
    }
    try {
      const result = await save.mutateAsync({
        workspace: next,
        revision: query.data.revision,
      });
      utils.workspace.get.setData(input, {
        workspace: result.workspace,
        revision: result.revision,
        authenticated: true,
      });
      toast.success("Promjene su spremljene.");
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (message.includes("changed elsewhere"))
        toast.error(
          "Radni prostor izmijenjen je u drugom prozoru. Promjene nisu prebrisane. Sačuvajte svoj nacrt pa ponovno učitajte stranicu.",
          { duration: 10000 }
        );
      else if (message.includes("HTTPS") || message.includes("Use an"))
        toast.error(
          "Provjerite poveznice: dopušten je HTTPS ili putanja /manus-storage/."
        );
      else
        toast.error(
          "Spremanje nije uspjelo. Provjerite podatke i vezu. Vaš nacrt ostaje otvoren."
        );
      return false;
    }
  }
  async function clearPrivateCache() {
    await queryClient.cancelQueries({
      queryKey: getQueryKey(trpc.workspace.get),
    });
    queryClient.removeQueries({ queryKey: getQueryKey(trpc.workspace.get) });
  }
  return {
    workspace: ownerId === undefined ? null : (query.data?.workspace ?? null),
    persist,
    isSaving: save.isPending,
    loading: ownerId === undefined || query.isLoading,
    error: query.error,
    authenticated: ownerId != null && query.data?.authenticated === true,
    reload: query.refetch,
    clearPrivateCache,
  };
}
