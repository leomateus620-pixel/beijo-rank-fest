import { createFileRoute } from "@tanstack/react-router";
import EventosPage from "./eventos";

export const Route = createFileRoute("/festas")({
  head: () => ({ meta: [{ title: "Festas — BeijoCheck" }] }),
  component: EventosPage,
});
