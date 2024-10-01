import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Apiutils } from '../utils/ApiUtils';

export const getGameCategories = createAsyncThunk(
  'gameCategories/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const categoriesData = await Apiutils.fetchGameCategories();
      return categoriesData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const gameCategoriesSlice = createSlice({
  name: 'gameCategories',
  initialState: {
    gameCategoriesData: null,
    isGameCategoriesLoading: false,
    gameCategoriesError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getGameCategories.pending, (state) => {
        state.isGameCategoriesLoading = true;
        state.gameCategoriesError = null;
      })
      .addCase(getGameCategories.fulfilled, (state, action) => {
        state.isGameCategoriesLoading = false;
        state.gameCategoriesData = action.payload;
        state.gameCategoriesError = null;
      })
      .addCase(getGameCategories.rejected, (state, action) => {
        state.isGameCategoriesLoading = false;
        state.gameCategoriesError = action.payload;
        state.gameCategoriesData = action.payload;
      });
  },
});

export default gameCategoriesSlice.reducer;
