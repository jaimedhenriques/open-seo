import { createFileRoute } from "@tanstack/react-router";
import { LlmsTxtPage } from "@/client/features/llms-txt/LlmsTxtPage";

export const Route = createFileRoute("/_project/p/$projectId/llms-txt")({
  component: LlmsTxtRoute,
});

function LlmsTxtRoute() {
  const { projectId } = Route.useParams();
  return <LlmsTxtPage projectId={projectId} />;
}
