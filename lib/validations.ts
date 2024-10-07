import * as z from "zod";

export const QuestionsSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters long" }),
  explanation: z
    .string()
    .min(20, { message: "Explanation must be at least 20 characters long" }),
  tags: z.array(z.string()).min(1, { message: "At least one tag is required" }),
});
