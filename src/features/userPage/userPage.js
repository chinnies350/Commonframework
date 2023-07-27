import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const apiUrl = import.meta.env.ENV_API_URL;


export const getUserData = createAsyncThunk('user/getUserData', async () => {
    return await axios.get(`${apiUrl}/user?UserType=E`)
})


export const getBasedUserData = createAsyncThunk('user/getUserData', async (UserId) => {
    return await axios.get(`${apiUrl}/user?UserType=A&UserId=${UserId}`)
})
export const getBasedAdminUserData = createAsyncThunk('user/getBasedAdminUserData', async (UserId) => {
    return await axios.get(`${apiUrl}/user?UserType=A&UserId=${UserId}`)
})

export const postUserData = createAsyncThunk('user/postUserData', async (postData) => {
    return await axios.post(`${apiUrl}/user`, postData)
})

export const putUserData = createAsyncThunk('user/putUserData', async (putData) => {
    return await axios.put(`${apiUrl}/user`, putData)
})

export const deleteUserData = createAsyncThunk('user/deleteUserData', async (deleteData) => {
    return await axios.delete(`${apiUrl}/user`, { params: deleteData })
})




const initialState = {
    userData: [],
}

const userSlice = createSlice({
    name:'user',
    initialState,
    extraReducers: builder => {
        builder.addCase(getUserData.fulfilled, (state, action)=> {
            if (action.payload.status) {
                state.userData = action.payload.data.data
            }
            else {
                state.userData = []
            }
            
        })
    }

})

export const userDataSelector = state => state.userPage?.userData




export default userSlice.reducer;