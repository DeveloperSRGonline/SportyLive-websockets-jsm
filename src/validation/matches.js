import { z } from "zod";

/**
 * Match status constants
 */
export const MATCH_STATUS = {
  SCHEDULED: "scheduled",
  LIVE: "live",
  FINISHED: "finished",
};

/**
 * Schema for validating list matches query parameters
 */
export const listMatchesQuerySchema = z.object({
  limit: z.coerce
    .number({ error: "Limit must be a number" })
    .int({ error: "Limit must be an integer" })
    .positive({ error: "Limit must be a positive integer" })
    .max(100, { error: "Limit cannot exceed 100" })
    .optional(),
});

/**
 * Schema for validating match ID path parameter
 */
export const matchIdParamSchema = z.object({
  id: z.coerce
    .number({ error: "ID must be a number" })
    .int({ error: "ID must be an integer" })
    .positive({ error: "ID must be a positive integer" }),
});

/**
 * Schema for validating match creation request body
 */
export const createMatchSchema = z
  .object({
    sport: z.string().trim().min(1, { error: "Sport is required" }),
    homeTeam: z.string().trim().min(1, { error: "Home team is required" }),
    awayTeam: z.string().trim().min(1, { error: "Away team is required" }),
    startTime: z.iso.datetime({ error: "Start time is required" }),
    endTime: z.iso.datetime({ error: "End time is required" }),
    homeScore: z.coerce
      .number({ error: "Home score must be a number" })
      .int({ error: "Home score must be an integer" })
      .nonnegative({ error: "Home score must be non-negative" })
      .optional(),
    awayScore: z.coerce
      .number({ error: "Away score must be a number" })
      .int({ error: "Away score must be an integer" })
      .nonnegative({ error: "Away score must be non-negative" })
      .optional(),
  })
  .refine(
    (data) => {
      const start = new Date(data.startTime);
      const end = new Date(data.endTime);
      return start.getTime() < end.getTime();
    },
    {
      error: "endTime must be chronologically after startTime",
      path: ["endTime"],
    }
  );

/**
 * Schema for validating score update request body
 */
export const updateScoreSchema = z.object({
  homeScore: z.coerce
    .number({ error: "Home score must be a number" })
    .int({ error: "Home score must be an integer" })
    .nonnegative({ error: "Home score must be non-negative" }),
  awayScore: z.coerce
    .number({ error: "Away score must be a number" })
    .int({ error: "Away score must be an integer" })
    .nonnegative({ error: "Away score must be non-negative" }),
});
