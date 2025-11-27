import { configureStore } from '@reduxjs/toolkit'

import userReducer from './userSlice.jsx'
import loginToggleReducer from './loginToggleSlice.jsx'
export const store = configureStore({
  reducer: {userData: userReducer,
    loginToggle: loginToggleReducer
  },

})
