import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = import.meta.env.ENV_API_URL

export const getUserDataByUserId = createAsyncThunk('userAccount/getUserData', async({userId}) => {
    console.log('apiUrl',apiUrl)
    return axios.get(`${apiUrl}/user?UserId=${userId}`)
})

export const updateUserData = createAsyncThunk('userAccount/updateUserData', async(userData) => {
    console.log("userData", userData)
    return axios.put(`${apiUrl}/user/updateUserProfile`, userData)
})

export const putPassword= createAsyncThunk('password/putPriceType', async (putData) => {
    return await axios.put(`${apiUrl}/user/setPassword`, putData)
})
export const putPin= createAsyncThunk('password/putPriceType', async (putData) => {
    return await axios.put(`${apiUrl}/user/setPin`, putData)
})


const initialState = {
    userData: []
}

const userAccountSlice = createSlice({
    name: 'userAccount',
    initialState,
    reducers: {
        changeUserData: (state, action) => {
            const {userData} = action.payload
            state.userData = {... state.userData, ...userData}
        }
    },
    extraReducers: builder => {
        builder.addCase(getUserDataByUserId.fulfilled, (state, action)=> {
            console.log('userAccount data', action.payload)
            if (action.payload.data.statusCode) {
                state.userData = action.payload.data.data[0]
            }
        })
    }
})

export const userDataByUserId = state => state.userAccount ? state.userAccount.userData : initialState.userData;

export const { changeUserData } = userAccountSlice.actions;

export default userAccountSlice.reducer;


