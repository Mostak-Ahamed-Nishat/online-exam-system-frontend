import { z } from "zod";

function stripHtml(html = "") {
  return html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").trim();
}

export const questionModalSchema = z
  .object({
    title: z.string(),
    score: z.coerce.number().int().min(1, "Score must be greater than 0."),
    type: z.enum(["Checkbox", "Radio", "Text"]),
    textAnswer: z.string(),
    options: z.array(
      z.object({
        id: z.string(),
        content: z.string(),
        correct: z.boolean(),
      }),
    ),
  })
  .superRefine((values, context) => {
    if (!stripHtml(values.title)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Question title is required.",
        path: ["title"],
      });
    }

    if (values.type === "Text") {
      if (!stripHtml(values.textAnswer)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Answer text is required for text question.",
          path: ["textAnswer"],
        });
      }
      return;
    }

    const filledOptions = values.options.filter((option) => stripHtml(option.content));
    if (filledOptions.length < 2) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Minimum two options are required.",
        path: ["options"],
      });
      return;
    }

    const correctCount = filledOptions.filter((option) => option.correct).length;

    if (correctCount === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one correct answer is required.",
        path: ["options"],
      });
    }

    if (values.type === "Radio" && correctCount > 1) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Radio question can have only one correct answer.",
        path: ["options"],
      });
    }
  });

export function toPlainText(html = "") {
  return stripHtml(html);
}
