import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const apiUrl = import.meta.env.ENV_API_URL;


export const getAppMenu = createAsyncThunk('appMenu/getAppMenu', async (AppId) => {
    return await axios.get(`${apiUrl}/appMenu?AppId=${AppId}`)
})

export const getAppMenuList = createAsyncThunk('appMenu/getAppMenuList', async () => {
    return await axios.get(`${apiUrl}/appMenu`)
})

export const getApplication = createAsyncThunk('appMenu/application', async () => {
    return await axios.get(`${apiUrl}/application`)
})

export const postAppMenu = createAsyncThunk('appMenu/postCompanyData', async (postData) => {
    return await axios.post(`${apiUrl}/appMenu`, postData)
})

export const putAppMenu= createAsyncThunk('appMenu/putCompanyData', async (putData) => {
    return await axios.put(`${apiUrl}/appMenu`, putData)
})

export const deleteAppMenu = createAsyncThunk('appMenu/deleteCompanyData', async (deleteData) => {
    return await axios.delete(`${apiUrl}/appMenu?MenuId=${deleteData.MenuId}&ActiveStatus=${deleteData.ActiveStatus}&UpdatedBy=${deleteData.UpdatedBy}`)
}) 


const initialState = {
    appData: [],
    appListData:[],
}

const appMenuSlice = createSlice({
    name:'appMenu',
    initialState,
    extraReducers: builder => {
        builder.addCase(getAppMenu.fulfilled, (state, action)=> {
            if (action.payload.status) {
                state.appData = action.payload.data.data
            }
            else {
                state.appData = []
            }
            
        })
        builder.addCase(getAppMenuList.fulfilled, (state, action)=> {
            if (action.payload.status) {
                state.appListData = action.payload.data.data
            }
            else {
                state.appListData = []
            }
            
        })
    }

})

export const appDataSelector = state => state.appData?.appData
export const appMenuListDataSelector = state => state.appListData?.appListData



export default appMenuSlice.reducer;