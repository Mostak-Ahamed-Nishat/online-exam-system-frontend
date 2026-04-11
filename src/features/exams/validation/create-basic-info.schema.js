import { z } from "zod";

export const createBasicInfoSchema = z
  .object({
    title: z.string().trim().min(1, "Online Test Title is required"),
    totalCandidates: z.coerce.number().int().min(1, "Total Candidates is required"),
    totalSlots: z.string().trim().min(1, "Total Slots is required"),
    totalQuestionSet: z.string().trim().min(1, "Total Question Set is required"),
    questionType: z.string().trim().min(1, "Question Type is required"),
    startTime: z.string().trim().min(1, "Start Time is required"),
    endTime: z.string().trim().min(1, "End Time is required"),
    duration: z.coerce.number().int().min(1, "Duration is required"),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: "End Time must be later than Start Time",
    path: ["endTime"],
  });

