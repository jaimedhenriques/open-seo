import { useNavigate } from "@tanstack/react-router";
import {
  GEO_DASHBOARD_CARD,
  geoDashboardLinks,
} from "@/client/features/dashboard/geoDashboardCard";
import { Button } from "@/client/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/client/ui/card";

export function GeoDashboardCard({ projectId }: { projectId: string }) {
  const navigate = useNavigate();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{GEO_DASHBOARD_CARD.title}</CardTitle>
        <CardDescription>{GEO_DASHBOARD_CARD.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-pretty text-sm text-muted-foreground">
          {GEO_DASHBOARD_CARD.hint}
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {geoDashboardLinks().map((item) => (
            <Button
              key={item.to}
              type="button"
              variant="outline"
              onClick={() => {
                void navigate({ to: item.to, params: { projectId } });
              }}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
