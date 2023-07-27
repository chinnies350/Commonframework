import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const apiUrl = import.meta.env.ENV_API_URL;


export const getActiveAppCompanyData = createAsyncThunk('appAccess/getActiveAppCompanyData', async (AppAccessData) => {
    if(AppAccessData.AppId && AppAccessData.UserId)
    {
        return await axios.get(`${apiUrl}/appAccess?AppId=${AppAccessData.AppId}&UserId=${AppAccessData.UserId}&ActiveStatus=A`)
    }
    else{
        return await axios.get(`${apiUrl}/appAccess?AppId=${AppAccessData.AppId}`)

    }
})

export const getActiveAppBranchData = createAsyncThunk('appAccess/getActiveAppBranchData', async (AppAccessData) => {
    if(AppAccessData.AppId && AppAccessData.UserId && AppAccessData.CompId)
    {
        return await axios.get(`${apiUrl}/appAccess?AppId=${AppAccessData.AppId}&UserId=${AppAccessData.UserId}&CompId=${AppAccessData.CompId}&ActiveStatus=A`)
    }
})

const initialState={
    appCompanyData:[],
    appBranchData:[],
}

const appAccessSlice = createSlice({
    name:'appAccess',
    initialState,
    extraReducers: builder => {
        builder.addCase(getActiveAppCompanyData.fulfilled, (state, action)=> {
            if (action.payload.status) {
                state.appCompanyData = action.payload.data.data
            }
            else {
                state.appCompanyData = []
            }
            
        })
        builder.addCase(getActiveAppBranchData.fulfilled, (state, action)=> {
            if (action.payload.status) {
                state.appBranchData = action.payload.data.data
            }
            else {
                state.appBranchData = []
            }
            
        })
        
        
    }

})


export const appCompanyDataSelector = state => state.appAccessPage?.appCompanyData
export const appBranchDataSelector = state => state.appAccessPage?.appBranchData

export default appAccessSlice.reducer;