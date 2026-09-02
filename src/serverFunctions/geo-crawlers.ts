import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { AppError } from "@/server/lib/errors";
import { fetchAiCrawlerAccess } from "@/server/lib/geo/fetchAiCrawlerAccess";
import { requireProjectContext } from "@/serverFunctions/middleware";

const inputSchema = z.object({
  projectId: z.string().min(1),
  url: z.string().max(2048).optional(),
});

export const analyzeProjectAiCrawlerAccess = createServerFn({ method: "POST" })
  .middleware(requireProjectContext)
  .validator(inputSchema)
  .handler(async ({ data, context }) => {
    const target = data.url?.trim() || context.project.domain;
    if (!target) {
      throw new AppError(
        "VALIDATION_ERROR",
        "Enter a URL or set a domain on this project.",
      );
    }
    return fetchAiCrawlerAccess(target);
  });
