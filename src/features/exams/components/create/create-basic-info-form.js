"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PencilLine } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Button, buttonVariants } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { LoadingState } from "@/components/ui/loading-state";
import { cn } from "@/lib/utils";
import { CreateFormField } from "./create-form-field";
import { createBasicInfoSchema } from "../../validation/create-basic-info.schema";
import { useExamDraftHydration } from "../../hooks/use-exam-draft-hydration";
import { selectDraftBasicInfo, setDraftBasicInfo } from "@/store/slices/examDraftSlice";

const SLOT_OPTIONS = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
];

const QUESTION_SET_OPTIONS = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
];

const QUESTION_TYPE_OPTIONS = [
  { label: "MCQ", value: "MCQ" },
  { label: "Radio", value: "Radio" },
  { label: "Text", value: "Text" },
  { label: "Mixed", value: "Mixed" },
];

function getDefaultBasicInfo(values) {
  return {
    title: values?.title ?? "",
    totalCandidates: values?.totalCandidates ?? "",
    totalSlots: values?.totalSlots ?? "",
    totalQuestionSet: values?.totalQuestionSet ?? "",
    questionType: values?.questionType ?? "",
    startTime: values?.startTime ?? "",
    endTime: values?.endTime ?? "",
    duration: values?.duration ?? "",
  };
}

function hasSavedBasicInfo(values) {
  if (!values) return false;

  const requiredKeys = [
    "title",
    "totalCandidates",
    "totalSlots",
    "totalQuestionSet",
    "questionType",
    "startTime",
    "endTime",
    "duration",
  ];

  return requiredKeys.every((key) => String(values[key] ?? "").trim() !== "");
}

function displayValue(value) {
  const raw = String(value ?? "").trim();
  return raw ? raw : "-";
}

export function CreateBasicInfoForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const hydrated = useExamDraftHydration();
  const draftBasicInfo = useSelector(selectDraftBasicInfo);
  const [isEditMode, setIsEditMode] = useState(true);
  const [isSavingInfo, setIsSavingInfo] = useState(false);
  const [isContinuing, setIsContinuing] = useState(false);

  const defaultValues = useMemo(() => getDefaultBasicInfo(draftBasicInfo), [draftBasicInfo]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createBasicInfoSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!hydrated) return;

    const nextValues = getDefaultBasicInfo(draftBasicInfo);
    reset(nextValues);
    setIsEditMode(!hasSavedBasicInfo(nextValues));
  }, [draftBasicInfo, hydrated, reset]);

  const handleSaveBasicInfo = async (values) => {
    setIsSavingInfo(true);

    try {
      dispatch(setDraftBasicInfo(values));
      setIsEditMode(false);
    } finally {
      setIsSavingInfo(false);
    }
  };

  const handleContinue = () => {
    setIsContinuing(true);
    router.push("/admin/exams/create/questions");
  };

  const isSaveBusy = isSubmitting || isSavingInfo || !hydrated;
  const info = getDefaultBasicInfo(draftBasicInfo);

  if (!hydrated) {
    return (
      <LoadingState message="Loading draft..." className="rounded-[14px] border-[var(--border-disabled)]" />
    );
  }

  if (!isEditMode && hasSavedBasicInfo(info)) {
    return (
      <div className="mx-auto w-full max-w-[954px] space-y-6">
        <div className="rounded-[14px] border border-[var(--border-disabled)] bg-[var(--background-white)] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-[34px] leading-[42px] text-[var(--text-primary)]">Basic Information</h2>
            <button
              type="button"
              onClick={() => setIsEditMode(true)}
              className="inline-flex cursor-pointer items-center gap-2 text-[20px] font-medium text-[var(--button-primary)] transition-opacity hover:opacity-80"
            >
              <PencilLine className="h-4 w-4" /> Edit
            </button>
          </div>

          <div className="mt-5 space-y-6">
            <div>
              <p className="text-[12px] font-normal text-[var(--test-subtext)]">Online Test Title</p>
              <p className="mt-1 text-[16px] font-medium leading-6 text-[var(--text-primary)]">{displayValue(info.title)}</p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <p className="text-[12px] font-normal text-[var(--test-subtext)]">Total Candidates</p>
                <p className="mt-1 text-[16px] font-medium leading-6 text-[var(--text-primary)]">{displayValue(info.totalCandidates)}</p>
              </div>
              <div>
                <p className="text-[12px] font-normal text-[var(--test-subtext)]">Total Slots</p>
                <p className="mt-1 text-[16px] font-medium leading-6 text-[var(--text-primary)]">{displayValue(info.totalSlots)}</p>
              </div>
              <div>
                <p className="text-[12px] font-normal text-[var(--test-subtext)]">Total Question Set</p>
                <p className="mt-1 text-[16px] font-medium leading-6 text-[var(--text-primary)]">{displayValue(info.totalQuestionSet)}</p>
              </div>
              <div>
                <p className="text-[12px] font-normal text-[var(--test-subtext)]">Duration Per Slots (Minutes)</p>
                <p className="mt-1 text-[16px] font-medium leading-6 text-[var(--text-primary)]">{displayValue(info.duration)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div>
                <p className="text-[12px] font-normal text-[var(--test-subtext)]">Question Type</p>
                <p className="mt-1 text-[16px] font-medium leading-6 text-[var(--text-primary)]">{displayValue(info.questionType)}</p>
              </div>
              <div>
                <p className="text-[12px] font-normal text-[var(--test-subtext)]">Start Time</p>
                <p className="mt-1 text-[16px] font-medium leading-6 text-[var(--text-primary)]">{displayValue(info.startTime)}</p>
              </div>
              <div>
                <p className="text-[12px] font-normal text-[var(--test-subtext)]">End Time</p>
                <p className="mt-1 text-[16px] font-medium leading-6 text-[var(--text-primary)]">{displayValue(info.endTime)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[14px] border border-[var(--border-disabled)] bg-[var(--background-white)] p-6">
          <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row">
            <Link
              href="/admin/dashboard"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-12 min-w-[124px] rounded-[10px] border-[var(--border-disabled)] text-[14px] font-semibold",
                isContinuing ? "pointer-events-none opacity-50" : "",
              )}
              aria-disabled={isContinuing}
            >
              Cancel
            </Link>

            <Button
              type="button"
              className="h-12 min-w-[172px] rounded-[10px] text-[14px] font-semibold"
              disabled={isContinuing}
              onClick={handleContinue}
            >
              <span className="inline-flex items-center gap-2">
                {isContinuing ? <Spinner className="h-4 w-4" /> : null}
                {isContinuing ? "Continuing..." : "Save & Continue"}
              </span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleSaveBasicInfo)} className="mx-auto w-full max-w-[954px] space-y-6">
      <div className="rounded-[14px] border border-[var(--border-disabled)] bg-[var(--background-white)] p-6">
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
              options={SLOT_OPTIONS}
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
              options={QUESTION_SET_OPTIONS}
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
              options={QUESTION_TYPE_OPTIONS}
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

      <div className="rounded-[14px] border border-[var(--border-disabled)] bg-[var(--background-white)] p-6">
        <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row">
          <Link
            href="/admin/dashboard"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-12 min-w-[124px] rounded-[10px] border-[var(--border-disabled)] text-[14px] font-semibold",
              isSaveBusy ? "pointer-events-none opacity-50" : "",
            )}
            aria-disabled={isSaveBusy}
          >
            Cancel
          </Link>

          <Button
            type="submit"
            className="h-12 min-w-[172px] rounded-[10px] text-[14px] font-semibold"
            disabled={isSaveBusy}
          >
            <span className="inline-flex items-center gap-2">
              {isSaveBusy ? <Spinner className="h-4 w-4" /> : null}
              {isSaveBusy ? "Saving..." : "Save"}
            </span>
          </Button>
        </div>
      </div>
    </form>
  );
}
