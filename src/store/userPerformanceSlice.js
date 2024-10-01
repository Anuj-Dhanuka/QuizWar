import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {Apiutils} from '../utils/ApiUtils';

const initialState = {
  userId: null,
  streak: 0,
  quizzesCompleted: 0,
  totalPoints: 0,
  monthlyPoints: 0,
  highestScore: 0,
  leastTimeTakenByUser: null,
  lastLoginDate: null,
  level: 1,
  userPerformanceIsLoading: null,
  userPerformanceError: null,
};

export const fetchUserPerformance = createAsyncThunk(
  'userPerformance/fetchUserPerformance',
  async (userId, {rejectWithValue}) => {
    try {
      const userPerformanceData = await Apiutils.fetchUserPerformance(userId);
      console.log('user performance fetched successfully');
      return userPerformanceData;
    } catch (error) {
      console.log('user performance error: ', error);
      return rejectWithValue(error.message);
    }
  },
);

const userPerformanceSlice = createSlice({
  name: 'userPerformance',
  initialState,
  reducers: {
    loginUserPerformance: (state, action) => {
      state.userId = action.payload.userId;
      state.streak = action.payload.streak;
      state.quizzesCompleted = action.payload.quizzesCompleted;
      state.totalPoints = action.payload.totalPoints;
      state.monthlyPoints = action.payload.monthlyPoints;
      state.highestScore = action.payload.highestScore;
      state.leastTimeTakenByUser = action.payload.leastTimeTakenByUser;
      state.lastLoginDate = action.payload.lastLoginDate;
      state.level = action.payload.level;
    },
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
      (state.highestScore = action.payload.highestScore),
        (state.leastTimeTakenByUser = action.payload.leastTimeTakenByUser);
    },
    incrementStreak: state => {
      state.streak += 1;
    },
    resetStreak: state => {
      state.streak = 0;
    },
    updateLastLoginDate: (state, action) => {
      state.lastLoginDate = action.payload;
    },
    resetPerformance: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUserPerformance.pending, state => {
        state.userPerformanceIsLoading = true;
        state.userPerformanceError = null;
      })
      .addCase(fetchUserPerformance.fulfilled, (state, action) => {
        state.userPerformanceIsLoading = false;
        state.userPerformanceError = null;
        if (action.payload) {
          state.userId = action.payload.userId;
          state.streak = action.payload.streak;
          state.quizzesCompleted = action.payload.quizzesCompleted;
          state.totalPoints = action.payload.totalPoints;
          state.monthlyPoints = action.payload.monthlyPoints;
          state.highestScore = action.payload.highestScore;
          state.leastTimeTakenByUser = action.payload.leastTimeTakenByUser;
          state.lastLoginDate = action.payload.lastLoginDate;
          state.level = action.payload.level;
        }
      })
      .addCase(fetchUserPerformance.rejected, (state, action) => {
        state.userPerformanceIsLoading = false;
        state.userPerformanceError =
          action.payload || 'Failed to fetch user performance data';
      });
  },
});

export const {
  loginUserPerformance,
  updatePerformanceState,
  updateHighestScore,
  incrementStreak,
  resetStreak,
  updateLastLoginDate,
  resetPerformance,
} = userPerformanceSlice.actions;
export default userPerformanceSlice.reducer;
