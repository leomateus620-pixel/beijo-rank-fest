import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/beijocheck/brand";
import { BeijoSwipeDeck } from "@/components/beijocheck/swipe";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Deslizar — BeijoCheck" }] }),
  component: IndexPage,
});

function IndexPage() {
  return (
    <AppShell dark>
      <BeijoSwipeDeck />
    </AppShell>
  );
}
