import { configureStore, combineReducers } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

//reducers
import authSlice from './authSlice';
import userPerformanceSlice from './userPerformanceSlice';
import activeSessinSlice from './activeSessinSlice';
import gameSlice from './gameSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage, 
  whitelist: ['auth', 'userPerformance'], 
};

// Combine all reducers
const rootReducer = combineReducers({
  auth: authSlice,
  userPerformance: userPerformanceSlice,
  activeSession: activeSessinSlice,
  game: gameSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
