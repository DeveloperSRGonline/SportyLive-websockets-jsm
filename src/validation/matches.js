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
    .number({ message: "Limit must be a number" })
    .int({ message: "Limit must be an integer" })
    .positive({ message: "Limit must be a positive integer" })
    .max(100, { message: "Limit cannot exceed 100" })
    .optional(),
});

/**
 * Schema for validating match ID path parameter
 */
export const matchIdParamSchema = z.object({
  id: z.coerce
    .number({ message: "ID must be a number" })
    .int({ message: "ID must be an integer" })
    .positive({ message: "ID must be a positive integer" }),
});

/**
 * Schema for validating match creation request body
 */
export const createMatchSchema = z
  .object({
    sport: z.string().trim().min(1, { message: "Sport is required" }),
    homeTeam: z.string().trim().min(1, { message: "Home team is required" }),
    awayTeam: z.string().trim().min(1, { message: "Away team is required" }),
    startTime: z.string({ message: "Start time is required" }),
    endTime: z.string({ message: "End time is required" }),
    homeScore: z.coerce
      .number({ message: "Home score must be a number" })
      .int({ message: "Home score must be an integer" })
      .nonnegative({ message: "Home score must be non-negative" })
      .optional(),
    awayScore: z.coerce
      .number({ message: "Away score must be a number" })
      .int({ message: "Away score must be an integer" })
      .nonnegative({ message: "Away score must be non-negative" })
      .optional(),
  })
  .refine(
    (data) => {
      const start = new Date(data.startTime);
      return !isNaN(start.getTime());
    },
    {
      message: "startTime must be a valid ISO date string",
      path: ["startTime"],
    }
  )
   .refine(
    (data) => {
      const end = new Date(data.endTime);
      return !isNaN(end.getTime());
    },
    {
      message: "endTime must be a valid ISO date string",
      path: ["endTime"],
    }
  )
  .refine(
    (data) => {
      const start = new Date(data.startTime);
      const end = new Date(data.endTime);
      return start.getTime() < end.getTime();
    },
    {
      message: "endTime must be chronologically after startTime",
      path: ["endTime"],
    }
  );

/**
 * Schema for validating score update request body
 */
export const updateScoreSchema = z.object({
  homeScore: z.coerce
    .number({ message: "Home score must be a number" })
    .int({ message: "Home score must be an integer" })
    .nonnegative({ message: "Home score must be non-negative" }),
  awayScore: z.coerce
    .number({ message: "Away score must be a number" })
    .int({ message: "Away score must be an integer" })
    .nonnegative({ message: "Away score must be non-negative" }),
});
