import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const apiUrl = import.meta.env.ENV_API_URL;


export const getConfiguration = createAsyncThunk('configMaster/getConfiguration', async () => {
    return await axios.get(`${apiUrl}/configMaster`)
})


export const getActiveConfigNames = createAsyncThunk('configMaster/getActiveConfigNames', async () => {
    return await axios.get(`${apiUrl}/configMaster?ActiveStatus=A`)
})

export const deleteConfiguration = createAsyncThunk('configMaster/deleteConfiguration', async (deleteData) => {
    return await axios.delete(`${apiUrl}/configMaster`, { params: deleteData })
})

export const postConfiguration = createAsyncThunk('configMaster/postConfiguration', async (postData) => {
    console.log('postData',postData)
    return await axios.post(`${apiUrl}/configMaster`, postData)
})

export const putConfiguration = createAsyncThunk('configMaster/putConfiguration', async (putData) => {
    console.log('putData',putData)
    return await axios.put(`${apiUrl}/configMaster`, putData)
})

export const postBulkConfiguration = createAsyncThunk('configMaster/postBulkConfiguration', async(postData) =>{
    console.log('postData',postData)
    return await axios.post(`${apiUrl}/configMaster/BulkUpload`, postData)
})


const initialState = {
    configData: [],
    ActiveConfigNames:[],
}

const configmaster = createSlice({
    name:'configmaster',
    initialState,
    extraReducers: builder => {
        builder.addCase(getConfiguration.fulfilled, (state, action)=> {
            if (action.payload.status) {
                state.configData = action.payload.data.data
            }
            else {
                state.configData = []
            }
            
        })
        builder.addCase(getActiveConfigNames.fulfilled, (state, action)=> {
            if (action.payload.status) {
                state.ActiveConfigNames = action.payload.data.data
            }
            else {
                state.ActiveConfigNames = []
            }
            
        })
    }

})


export const configDataSelector = state => state.configmasterPage?.configData
export const ActiveConfigNamesSelector = state => state.configmasterPage?.ActiveConfigNames



export default configmaster.reducer;