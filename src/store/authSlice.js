import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userId: 123456789,
  token: 1234,
  name: "Anuj",
  email: "anujd973@gmail.com",
  phoneNumber: "8978264705",
  dateOfBirth: "15-02-1997",
  version: '1.0.0',
  isHapticEnabled: false,
  isSoundEnabled: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.userId = action.payload.userId;
      state.token = action.payload.token;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.phoneNumber = action.payload.phoneNumber;
      state.dateOfBirth = action.payload.dateOfBirth;
      state.version = action.payload.version
      state.isHapticEnabled = action.payload.isHapticEnabled
      state.isSoundEnabled = action.payload.isSoundEnabled
    },
    logout: (state) => {
      state.userId = 123456789;
      state.token = 1234;
      state.name = "Anuj";
      state.email = "anujd973@gmail.com";
      state.phoneNumber = "8978264705";
      state.dateOfBirth = "15-02-1997";
      state.version = "1.0.0"
      state.isHapticEnabled = false
      state.isSoundEnabled = false
    },
    editProfile: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.dateOfBirth = action.payload.dateOfBirth;
      state.isHapticEnabled = action.payload.isHapticEnabled
      state.isSoundEnabled = action.payload.isSoundEnabled
    },
    resetAuth: (state) => {
        return initialState;
    },
  },
});

export const { login, logout, editProfile, resetAuth } = authSlice.actions;

export default authSlice.reducer;
