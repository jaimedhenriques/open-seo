import { createFileRoute } from "@tanstack/react-router";
import { GeoCrawlersPage } from "@/client/features/geo-crawlers/GeoCrawlersPage";

export const Route = createFileRoute("/_project/p/$projectId/geo-crawlers")({
  component: GeoCrawlersRoute,
});

function GeoCrawlersRoute() {
  const { projectId } = Route.useParams();
  return <GeoCrawlersPage projectId={projectId} />;
}
