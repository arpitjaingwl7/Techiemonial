

import {createSlice} from '@reduxjs/toolkit'

const intialState={
    isLoginPage:true
}


const loginToggleSlice=createSlice({
    name:'loginToggle',
    initialState:intialState,
    reducers:{
        toggleLoginPage:(state,action)=>{
            state.isLoginPage=true
        },
        toggleSignupPage:(state,action)=>{
            state.isLoginPage=false
        }
    }
})


export const {toggleLoginPage,toggleSignupPage}=loginToggleSlice.actions
export default loginToggleSlice.reducer