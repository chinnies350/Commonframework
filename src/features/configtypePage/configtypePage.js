import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const apiUrl = import.meta.env.ENV_API_URL;


export const getConfigurationType = createAsyncThunk('configType/getConfigurationType', async () => {
    return await axios.get(`${apiUrl}/configType`)
})


export const postConfigurationType = createAsyncThunk('configType/postConfigurationType', async (postData) => {
    console.log('postData',postData)
    return await axios.post(`${apiUrl}/configType`, postData)
})

export const putConfigurationType = createAsyncThunk('configType/putConfigurationType', async (putData) => {
    console.log('putData',putData)
    return await axios.put(`${apiUrl}/configType`, putData)
})

export const deleteConfigTypeData = createAsyncThunk('configType/deleteConfigTypeData', async (deleteData) => {
    return await axios.delete(`${apiUrl}/configType`, { params: deleteData })
})

export const getActiveConfigTypeNames = createAsyncThunk('configType/getActiveConfigTypeNames', async () => {
    return await axios.get(`${apiUrl}/configType?ActiveStatus=A`)
})

const initialState = {
    configTypeData: [],
    configTypeActiveData:[]
}

const configTypeSlice = createSlice({
    name:'configType',
    initialState,
    extraReducers: builder => {
        builder.addCase(getConfigurationType.fulfilled, (state, action)=> {
            if (action.payload.status) {
                state.configTypeData = action.payload.data.data
            }
            else {
                state.configTypeData = []
            }
            
        })

        builder.addCase(getActiveConfigTypeNames.fulfilled, (state, action)=> {
            if (action.payload.status) {
                state.configTypeActiveData = action.payload.data.data
            }
            else {
                state.configTypeActiveData = []
            }
            
        })

        
    }

})

export const configTypeDataSelector = state => state.configtypePage?.configTypeData
export const configTypeActiveDataSelector = state => state.configtypePage?.configTypeActiveData




export default configTypeSlice.reducer;