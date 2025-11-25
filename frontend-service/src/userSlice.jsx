import { createSlice } from '@reduxjs/toolkit'

const initialState = {
user: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {

    addUser: (state, action) => {
      state.user=action.payload
    },
    deleteUser: (state, action) => {
      state.user = null
    },
  },
})

// Action creators are generated for each case reducer function
export const { addUser, deleteUser } = userSlice.actions

export default userSlice.reducer