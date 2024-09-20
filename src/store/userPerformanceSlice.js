import {createSlice} from '@reduxjs/toolkit';

// Initial state for performance-related values
const initialState = {
  streak: 0,
  quizzesCompleted: 0,
  totalPoints: 0,
  monthlyPoints: 0,
  highestScore: 0,
  leastTimeTakenByUser: null,
  lastLoginDate: null,
  level: 1,
};

// Create the performance slice
const userPerformanceSlice = createSlice({
  name: 'userPerformance',
  initialState,
  reducers: {
    updatePerformanceState: (state, action) => {
      const {streak, quizzesCompleted, monthlyPoints, totalPoints, level} =
        action.payload;

      if (streak !== undefined) state.streak = streak;
      if (quizzesCompleted !== undefined)
        state.quizzesCompleted = quizzesCompleted;
      if (monthlyPoints !== undefined) state.monthlyPoints = monthlyPoints;
      if (totalPoints !== undefined) state.totalPoints = totalPoints;
      if (level !== undefined) state.level = level;
    },
    updateHighestScore: (state, action) => {
        state.highestScore = action.payload.highestScore,
        state.leastTimeTakenByUser = action.payload.leastTimeTakenByUser
    },
    incrementStreak: (state) => {
      state.streak += 1;
    },
    resetStreak: (state) => {
      state.streak = 0;
    },
    updateLastLoginDate: (state, action) => {
      state.lastLoginDate = action.payload;
    },
    resetPerformance: () => initialState,
  },
});

// Export actions and reducer
export const {updatePerformanceState, updateHighestScore, incrementStreak, resetStreak, updateLastLoginDate,  resetPerformance} =
  userPerformanceSlice.actions;
export default userPerformanceSlice.reducer;
