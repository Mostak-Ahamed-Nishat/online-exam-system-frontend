import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  search: "",
  page: 1,
  perPage: 8,
};

const studentDashboardSlice = createSlice({
  name: "studentDashboard",
  initialState,
  reducers: {
    setStudentDashboardSearch: (state, action) => {
      state.search = action.payload;
    },
    setStudentDashboardPage: (state, action) => {
      state.page = action.payload;
    },
    setStudentDashboardPerPage: (state, action) => {
      state.perPage = action.payload;
    },
    resetStudentDashboardState: () => initialState,
  },
});

export const {
  setStudentDashboardSearch,
  setStudentDashboardPage,
  setStudentDashboardPerPage,
  resetStudentDashboardState,
} = studentDashboardSlice.actions;

export const studentDashboardReducer = studentDashboardSlice.reducer;

export const selectStudentDashboardState = (state) => state.studentDashboard;
export const selectStudentDashboardSearch = (state) => state.studentDashboard.search;
export const selectStudentDashboardPage = (state) => state.studentDashboard.page;
export const selectStudentDashboardPerPage = (state) => state.studentDashboard.perPage;

