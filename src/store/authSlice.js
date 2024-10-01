import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTokenAndUserId } from '../utils/CommonUtils.js/commonFunctions';
import { Apiutils } from '../utils/ApiUtils';

const initialState = {
  userId: null,
  token: null,
  fullName: null,
  email: null,
  phoneNumber: null,
  dateOfBirth: null,
  gender: null,
  country: null,
  city: null,
  profilePicture: null,
  termsAccepted: null,
  privacyAccepted: null,
  isHapticEnabled: false,
  isSoundEnabled: false,
  authDataIsLoading: false,
  authDataError: null,
};

export const fetchFromAsyncStorage = createAsyncThunk(
  'auth/fetchFromAsyncStorage',
  async () => {
    const data = await getTokenAndUserId();
    return data;
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchProfileData',
  async (userId, { rejectWithValue }) => {
    try {
      const profileData = await Apiutils.fetchUserProfile(userId);
      console.log("user profile fetched successfully")
      return profileData;
    } catch (error) {
      console.error('Error fetching profile data:', error);
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
        state.userId = action.payload.userId;
        state.token = action.payload.token;
        state.fullName = action.payload.fullName;
        state.email = action.payload.email;
        state.phoneNumber = action.payload.phoneNumber;
        state.dateOfBirth = action.payload.dateOfBirth;
        state.gender = action.payload.gender;
        state.country = action.payload.country;
        state.city = action.payload.city;
        state.profilePicture = action.payload.profilePicture;
        state.termsAccepted =action.payload.termsAccepted;
        state.privacyAccepted = action.payload.privacyAccepted;
        state.isHapticEnabled = action.payload.isHapticEnabled;
        state.isSoundEnabled = action.payload.isSoundEnabled;
    },
    logout: state => {
      return initialState;
    },
    editProfile: (state, action) => {
        state.fullName = action.payload.fullName;
        state.email = action.payload.email;
        state.dateOfBirth = action.payload.dateOfBirth;
        state.country = action.payload.country;
        state.city = action.payload.city;
        state.profilePicture = action.payload.profilePicture;
        state.isHapticEnabled = action.payload.isHapticEnabled;
        state.isSoundEnabled = action.payload.isSoundEnabled;
    },
    resetAuth: state => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFromAsyncStorage.fulfilled, (state, action) => {
        if (action.payload) {
          state.userId = action.payload.userId;
          state.token = action.payload.token;
        }
      })
      .addCase(fetchFromAsyncStorage.rejected, (state, action) => {
        console.log('Failed to fetch userId and token:', action.error.message);
      })

      .addCase(fetchUserProfile.pending, (state) => {
        state.profileDataIsLoading = true;
        state.profileDataError = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profileDataIsLoading = false;
        if (action.payload) {
          state.fullName = action.payload.fullName;
          state.email = action.payload.email;
          state.phoneNumber = action.payload.phoneNumber;
          state.dateOfBirth = action.payload.dateOfBirth;
          state.gender = action.payload.gender;
          state.country = action.payload.country;
          state.city = action.payload.city;
          state.profilePicture = action.payload.profilePicture;
          state.isHapticEnabled = action.payload.isHapticEnabled;
          state.isSoundEnabled = action.payload.isSoundEnabled;
        }
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.profileDataIsLoading = false;
        state.profileDataError = action.payload || 'Failed to fetch profile data';
      });
  },
});

export const { login, logout, editProfile, resetAuth } = authSlice.actions;

export default authSlice.reducer;
