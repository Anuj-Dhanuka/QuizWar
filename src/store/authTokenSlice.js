import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: null,
    userId: null,
}


const authTokenSlice = createSlice({
    name: 'authToken',
    initialState,
    reducers: {
        storeUserIdAndTokenInRedux: (state, action) => {
            state.token = action.payload.token;
            state.userId = action.payload.userId
        },
        removeUserIdAndTokenFromRedux: (state, action) => {
            state.token = null
            state.userId = null
        }
    }
})

export const {storeUserIdAndTokenInRedux, removeUserIdAndTokenFromRedux} = authTokenSlice.actions


export default authTokenSlice.reducer