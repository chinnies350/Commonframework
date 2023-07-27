import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const subDirectory = import.meta.env.ENV_API_URL

export const getPurchasedApp = createAsyncThunk('homePage/getPurchasedApp', async({UserId}) => {
    return await axios.get(`${subDirectory}/userAppMap?UserId=${UserId}`)
})

export const getTypePurchasedApp = createAsyncThunk('homePage/getTypePurchasedApp', async({UserId}) => {
    console.log("i am called here only in getTypePurchasedApp")
    return await axios.get(`${subDirectory}/userAppMap?UserId=${UserId}&Type=P`)
})

export const getAppAccess = createAsyncThunk('homePage/getAppAccess', async({UserId}) => {
    return await axios.get(`${subDirectory}/appAccess?UserId=${UserId}`)
})


export const putDeafaulBranch = createAsyncThunk('putDeafaulBranch/putDeafaulBranch', async (putData) => {
    console.log('putData',putData)
    return await axios.put(`${subDirectory}/appAccess`, putData)
})

export const getDeafaulBranch = createAsyncThunk('getDeafaul/getDeafaulBranch', async(DefaultBranch) => {
    return await axios.get(`${subDirectory}/appAccess?UserId=${DefaultBranch.UserId}&AppId=${DefaultBranch.AppId}&Type=DB`)
})


const initialState = {
    purchasedApp: [],
    purchasedTypeApp:[],
    AppAccess: []
}


const homePageSlice = createSlice({
    name:'homePage',
    initialState,
    // reducers: {

    // },
    extraReducers: builder => {
        builder.addCase(getPurchasedApp.fulfilled, (state, action)=> {
            console.log('action', action.payload)
            if (action.payload.data.statusCode) {
                state.purchasedApp = action.payload.data.data
            } else {
                state.purchasedApp = []
            }
        })

        builder.addCase(getTypePurchasedApp.fulfilled, (state, action)=> {
            console.log('action', action.payload)
            if (action.payload.data.statusCode) {
                state.purchasedTypeApp = action.payload.data.data
            } else {
                state.purchasedTypeApp = []
            }
        })

        builder.addCase(getAppAccess.fulfilled, (state, action)=> {
            if (action.payload.data.statusCode) {
                state.AppAccess = action.payload.data.data
            } else {
                state.AppAccess = []
            }
        })
    }

})

export const purchasedAppSelector = state => state.homePage.purchasedApp
export const purchasedTypeAppSelector = state => state.homePage.purchasedTypeApp
export const AppAccessSelector = state => state.homePage.AppAccess

export default homePageSlice.reducer;

