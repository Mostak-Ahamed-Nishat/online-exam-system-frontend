"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CreateFormField } from "./create-form-field";
import { createBasicInfoSchema } from "../../validation/create-basic-info.schema";

export function CreateBasicInfoForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createBasicInfoSchema),
    defaultValues: {
      title: "",
      totalCandidates: "",
      totalSlots: "",
      totalQuestionSet: "",
      questionType: "",
      startTime: "",
      endTime: "",
      duration: "",
    },
  });

  const onSubmit = async (_values) => {
    // UI step only. API integration will be added later.
    await new Promise((resolve) => {
      setTimeout(resolve, 600);
    });
    router.push("/admin/exams/create/questions");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto w-full max-w-[954px] space-y-6">
      <div className="h-auto rounded-[14px] border border-[var(--border-disabled)] bg-[var(--background-white)] p-6 lg:h-[485px]">
        <h2 className="text-[30px] leading-[38px] text-[var(--text-primary)]">Basic Information</h2>

        <div className="mt-5 flex flex-col gap-6">
          <CreateFormField
            className="w-full max-w-[940px]"
            label="Online Test Title"
            required
            placeholder="Enter online test title"
            register={register}
            name="title"
            error={errors.title?.message}
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <CreateFormField
              className="w-full max-w-[441px]"
              label="Total Candidates"
              required
              type="number"
              placeholder="Enter total candidates"
              register={register}
              name="totalCandidates"
              min={1}
              error={errors.totalCandidates?.message}
            />
            <CreateFormField
              className="w-full max-w-[441px]"
              label="Total Slots"
              required
              type="select"
              placeholder="Select total slots"
              register={register}
              name="totalSlots"
              value={watch("totalSlots")}
              onValueChange={(nextValue) =>
                setValue("totalSlots", nextValue, { shouldValidate: true, shouldDirty: true })
              }
              error={errors.totalSlots?.message}
              options={[
                { label: "1", value: "1" },
                { label: "2", value: "2" },
                { label: "3", value: "3" },
                { label: "4", value: "4" },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <CreateFormField
              className="w-full max-w-[441px]"
              label="Total Question Set"
              required
              type="select"
              placeholder="Select total question set"
              register={register}
              name="totalQuestionSet"
              value={watch("totalQuestionSet")}
              onValueChange={(nextValue) =>
                setValue("totalQuestionSet", nextValue, { shouldValidate: true, shouldDirty: true })
              }
              error={errors.totalQuestionSet?.message}
              options={[
                { label: "1", value: "1" },
                { label: "2", value: "2" },
                { label: "3", value: "3" },
                { label: "4", value: "4" },
              ]}
            />
            <CreateFormField
              className="w-full max-w-[441px]"
              label="Question Type"
              required
              type="select"
              placeholder="Select question type"
              register={register}
              name="questionType"
              value={watch("questionType")}
              onValueChange={(nextValue) =>
                setValue("questionType", nextValue, { shouldValidate: true, shouldDirty: true })
              }
              error={errors.questionType?.message}
              options={[
                { label: "MCQ", value: "MCQ" },
                { label: "RADIO", value: "RADIO" },
                { label: "CHECKBOX", value: "CHECKBOX" },
                { label: "TEXT", value: "TEXT" },
                { label: "MIXED", value: "MIXED" },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[350px_350px_1fr]">
            <CreateFormField
              className="w-full max-w-[350px]"
              label="Start Time"
              required
              type="time"
              placeholder="Enter start time"
              register={register}
              name="startTime"
              error={errors.startTime?.message}
            />
            <CreateFormField
              className="w-full max-w-[350px]"
              label="End Time"
              required
              type="time"
              placeholder="Enter end time"
              register={register}
              name="endTime"
              error={errors.endTime?.message}
            />

            <CreateFormField
              className="w-full"
              label="Duration"
              type="number"
              placeholder="Duration Time"
              register={register}
              name="duration"
              min={1}
              error={errors.duration?.message}
            />
          </div>
        </div>
      </div>

      <div className="h-auto rounded-[14px] border border-[var(--border-disabled)] bg-[var(--background-white)] p-6 lg:h-24">
        <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row">
          <Link
            href="/admin/dashboard"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-12 min-w-[124px] rounded-[10px] border-[var(--border-disabled)] text-[14px] font-semibold",
            )}
          >
            Cancel
          </Link>

          <Button
            type="submit"
            className="h-12 min-w-[172px] rounded-[10px] text-[14px] font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save & Continue"}
          </Button>
        </div>
      </div>
    </form>
  );
}
