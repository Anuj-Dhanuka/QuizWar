import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';

// Initial state for the game
const initialState = {
  score: 0,
  timeTaken: '0:00',
  correctAnswers: 0,
  wrongAnswers: 0,
  createdTime: moment().format('YYYY-MM-DD HH:mm:ss'),
  userId: null,
  username: null,
  phoneNumber: null,
  userEmail: null,
  categoryId: null,
  categoryName: null,
  monthlyPoints: 0,
  totalPoints: 0,
};

// Create the game slice
const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    updateGameState: (state, action) => {
      const {
        score,
        timeTaken,
        correctAnswers,
        wrongAnswers,
        createdTime,
        userId,
        username,
        phoneNumber,
        userEmail,
        categoryId,
        categoryName,
        monthlyPoints,
        totalPoints,
      } = action.payload;
      
      if (score !== undefined) state.score = score;
      if (timeTaken !== undefined) state.timeTaken = timeTaken;
      if (correctAnswers !== undefined) state.correctAnswers = correctAnswers;
      if (wrongAnswers !== undefined) state.wrongAnswers = wrongAnswers;
      if (createdTime !== undefined) state.createdTime = createdTime;
      if (userId !== undefined) state.userId = userId;
      if (username !== undefined) state.username = username;
      if (phoneNumber !== undefined) state.phoneNumber = phoneNumber;
      if (userEmail !== undefined) state.userEmail = userEmail;
      if (categoryId !== undefined) state.categoryId = categoryId;
      if (categoryName !== undefined) state.categoryName = categoryName;
      if (monthlyPoints !== undefined) state.monthlyPoints = monthlyPoints;
      if (totalPoints !== undefined) state.totalPoints = totalPoints;
    },
    resetGame: () => initialState,
  },
});

// Export actions and reducer
export const { updateGameState, resetGame } = gameSlice.actions;
export default gameSlice.reducer;
