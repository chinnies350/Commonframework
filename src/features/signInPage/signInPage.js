import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const subDirectory = import.meta.env.ENV_API_URL

export const getUserData = createAsyncThunk('signInPage/getUserData', async({MobileNo}) => {
    return await axios.get(`${subDirectory}/user?MobileNo=${MobileNo}`)
})
export const verifyUserLoginPassword = createAsyncThunk('signInPage/verifyUserLogin', async({MobileNo,Password}) => {
    return await axios.get(`${subDirectory}/login?UserName=${MobileNo}&Password=${Password}`)
})

export const verifyUserLoginPin = createAsyncThunk('signInPage/verifyUserLogin', async({MobileNo,Pin}) => {
    return await axios.get(`${subDirectory}/login?UserName=${MobileNo}&Pin=${Pin}`)
})
export const sendOtp = createAsyncThunk('signInPage/verifyOTP', async({MobileNo}) => {
    return await axios.post(`${subDirectory}/verifyOTP`,{"UserName":MobileNo} )
    
})
export const sendOtpMobileNo = createAsyncThunk('signInPage/sendOtpMobileNo', async({MobileNo}) => {
    return await axios.post(`${subDirectory}/verifyOTP/getOTP`,{"UserName":MobileNo,"Type":"N"} )
    
})
export const setUser = createAsyncThunk('signInPage/setUser', async({MobileNo}) => {
    console.log(MobileNo,"MobileNoMobileNoMobileNo")
    return await axios.post(`${subDirectory}/verifyOTP/setUser`,{"UserName":MobileNo,"Type":"N"} )
    
})

export const getAppAccess = createAsyncThunk('homePage/getAppAccess', async({UserId}) => {
    return await axios.get(`${subDirectory}/appAccess?UserId=${UserId}&Type=UC`)
})

export const getuserAppMap = createAsyncThunk('signInPage/getuserAppMap', async({UserId}) => {
    return await axios.get(`${subDirectory}/userAppMap?UserId=${UserId}`)
    
})



const initialState = {
    UserData: []
}


const signInPageSlice = createSlice({
    name:'signInPage',
    initialState,
    // reducers: {

    // },
    extraReducers: builder => {
        builder.addCase(getUserData.fulfilled, (state, action)=> {
            // console.log('action', action.payload)
            if (action.payload.data.statusCode===1) {
                state.UserData = action.payload.data.data
            } else {
                state.UserData = []
            }
        })
    }

})

export const getUserDataSelector = state => state.signInPage.UserData

export default signInPageSlice.reducer;

