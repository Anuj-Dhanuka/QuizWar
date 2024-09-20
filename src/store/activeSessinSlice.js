import { createSlice } from '@reduxjs/toolkit';

// Initial state for the active session
const initialState = {
  activeCategoryId: null,
  activeCategoryName: null,
};

// Create the active session slice
const activeSessionSlice = createSlice({
  name: 'activeSession',
  initialState,
  reducers: {
    // Action to start a session when user clicks on a category
    startActiveSession: (state, action) => {
      const { activeCategoryId, activeCategoryName} = action.payload;
      state.activeCategoryId = activeCategoryId;
      state.activeCategoryName = activeCategoryName;
    },
    // Action to end the session (resetting data)
    endActiveSession: () => initialState,
  },
});

// Export actions and reducer
export const { startActiveSession, endActiveSession } = activeSessionSlice.actions;
export default activeSessionSlice.reducer;
