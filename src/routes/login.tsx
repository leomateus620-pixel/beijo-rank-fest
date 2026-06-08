import { createFileRoute } from "@tanstack/react-router";
import { LoginScreen } from "@/components/beijocheck/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — BeijoCheck" },
      {
        name: "description",
        content:
          "Entre no BeijoCheck: ranking por cidade, evento e região. Só conta com confirmação mútua.",
      },
      { property: "og:title", content: "Entrar — BeijoCheck" },
      {
        property: "og:description",
        content: "Descubra quem está em alta perto de você no BeijoCheck.",
      },
    ],
  }),
  component: LoginScreen,
});
