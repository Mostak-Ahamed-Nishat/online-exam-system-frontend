import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  hydrated: false,
  basicInfo: null,
  questions: [],
};

const examDraftSlice = createSlice({
  name: "examDraft",
  initialState,
  reducers: {
    hydrateExamDraft: (state, action) => {
      state.hydrated = true;
      state.basicInfo = action.payload?.basicInfo ?? null;
      state.questions = Array.isArray(action.payload?.questions) ? action.payload.questions : [];
    },
    setDraftBasicInfo: (state, action) => {
      state.basicInfo = action.payload;
    },
    upsertDraftQuestion: (state, action) => {
      const incoming = action.payload;
      if (!incoming?.id) return;

      const index = state.questions.findIndex((question) => question.id === incoming.id);
      if (index === -1) {
        state.questions.push(incoming);
        return;
      }

      state.questions[index] = incoming;
    },
    removeDraftQuestion: (state, action) => {
      state.questions = state.questions.filter((question) => question.id !== action.payload);
    },
    clearExamDraft: (state) => {
      state.basicInfo = null;
      state.questions = [];
    },
  },
});

export const {
  hydrateExamDraft,
  setDraftBasicInfo,
  upsertDraftQuestion,
  removeDraftQuestion,
  clearExamDraft,
} = examDraftSlice.actions;

export const examDraftReducer = examDraftSlice.reducer;

export const selectExamDraft = (state) => state.examDraft;
export const selectExamDraftHydrated = (state) => state.examDraft.hydrated;
export const selectDraftBasicInfo = (state) => state.examDraft.basicInfo;
export const selectDraftQuestions = (state) => state.examDraft.questions;
