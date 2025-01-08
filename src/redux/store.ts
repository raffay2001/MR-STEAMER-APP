import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Default: localStorage for web
import authReducer from './reducers/auth.reducer';
import vehicleReducer from './reducers/vehicle.reducer';
import {TypedUseSelectorHook, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const rootReducer = combineReducers({
  auth: authReducer,
  vehicle: vehicleReducer,
});
// Persist Configuration
const persistConfig = {
  key: 'root', // Key for the persist
  storage: AsyncStorage, // Storage engine
  whitelist: ['auth'], // Specify reducers to persist (e.g., 'auth')
};

const persistedState = persistReducer(persistConfig, rootReducer);

// Configure Store
export const store = configureStore({
  reducer: persistedState,
});

// Persistor
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
