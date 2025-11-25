import { configureStore } from '@reduxjs/toolkit'

import userReducer from './userSlice.jsx'
export const store = configureStore({
  reducer: {userData: userReducer},
})
