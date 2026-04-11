"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { LoadingState } from "@/components/ui/loading-state";
import { CreateFormField } from "./create-form-field";
import { CreateActionBar } from "./create-action-bar";
import { BasicInfoSummaryCard } from "./basic-info-summary-card";
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

  const handleSelectChange = (fieldName) => (nextValue) => {
    setValue(fieldName, nextValue, { shouldValidate: true, shouldDirty: true });
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
        <BasicInfoSummaryCard info={info} onEdit={() => setIsEditMode(true)} />
        <CreateActionBar
          primaryType="button"
          primaryLabel="Save & Continue"
          loadingLabel="Continuing..."
          isLoading={isContinuing}
          primaryDisabled={isContinuing}
          cancelDisabled={isContinuing}
          onPrimaryClick={handleContinue}
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleSaveBasicInfo)} className="mx-auto w-full max-w-[954px] space-y-6">
      <div className="rounded-[14px] border border-[var(--border-disabled)] bg-[var(--background-white)] p-6">
        <h2 className="text-3xl leading-[38px] text-[var(--text-primary)]">Basic Information</h2>

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
              onValueChange={handleSelectChange("totalSlots")}
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
              onValueChange={handleSelectChange("totalQuestionSet")}
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
              onValueChange={handleSelectChange("questionType")}
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

      <CreateActionBar
        primaryType="submit"
        primaryLabel="Save"
        loadingLabel="Saving..."
        isLoading={isSaveBusy}
        primaryDisabled={isSaveBusy}
        cancelDisabled={isSaveBusy}
      />
    </form>
  );
}

