"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadExamDraftFromStorage } from "../utils/exam-draft-storage";
import { hydrateExamDraft, selectExamDraftHydrated } from "@/store/slices/examDraftSlice";

export function useExamDraftHydration() {
  const dispatch = useDispatch();
  const hydrated = useSelector(selectExamDraftHydrated);
  const [hydrationAttempted, setHydrationAttempted] = useState(false);

  useEffect(() => {
    if (hydrated) {
      setHydrationAttempted(true);
      return;
    }

    const draft = loadExamDraftFromStorage();
    dispatch(hydrateExamDraft(draft));
    setHydrationAttempted(true);
  }, [dispatch, hydrated]);

  // Keep UI from getting stuck behind a loader if draft data is empty/corrupted.
  return hydrated || hydrationAttempted;
}
