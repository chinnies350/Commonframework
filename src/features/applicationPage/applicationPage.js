import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const apiUrl = import.meta.env.ENV_API_URL;


export const getApplicationData = createAsyncThunk('application/getApplicationData', async () => {
    return await axios.get(`${apiUrl}/application`)
})

export const getActiveApplicationData = createAsyncThunk('application/getActiveApplicationData', async () => {
    return await axios.get(`${apiUrl}/application?ActiveStatus=A`)
})

export const postApplicationData = createAsyncThunk('application/postApplicationData', async (postData) => {
    return await axios.post(`${apiUrl}/application`, postData)
})

export const putApplicationData = createAsyncThunk('application/putApplicationData', async (putData) => {
    return await axios.put(`${apiUrl}/application`, putData)
})

export const deleteApplicationData = createAsyncThunk('application/deleteApplicationData', async (deleteData) => {
    return await axios.delete(`${apiUrl}/application`, { params: deleteData })
}) 

export const getCategoryData = createAsyncThunk('configMaster/getCategoryData', async () => {
    return await axios.get(`${apiUrl}/configMaster?ActiveStatus=A&TypeName=category`)
})

export const getSubCategoryData = createAsyncThunk('configMaster/getSubCategoryData', async () => {
    return await axios.get(`${apiUrl}/configMaster?ActiveStatus=A&TypeName=subCategory`)
})
 

const initialState = {
    applicationData: [],
    applicationActiveData: [],
    categoryData:[],
    subCategoryData:[]
}

const applicationSlice = createSlice({
    name:'application',
    initialState,
    extraReducers: builder => {
        builder.addCase(getApplicationData.fulfilled, (state, action)=> {
            if (action.payload.status) {
                state.applicationData = action.payload.data.data
            }
            else {
                state.applicationData = []
            }
            
        })
        builder.addCase(getActiveApplicationData.fulfilled, (state, action)=> {
            if (action.payload.status) {
                state.applicationActiveData = action.payload.data.data
            }
            else {
                state.applicationActiveData = []
            }
            
        })
        builder.addCase(getCategoryData.fulfilled, (state, action)=> {
            if (action.payload.status) {
                state.categoryData = action.payload.data.data
            }
            else {
                state.categoryData = []
            }
            
        })
        builder.addCase(getSubCategoryData.fulfilled, (state, action)=> {
            if (action.payload.status) {
                state.subCategoryData = action.payload.data.data
            }
            else {
                state.subCategoryData = []
            }
            
        })
    }

})

export const applicationDataSelector = state => state.applicationPage?.applicationData
export const applicationActiveDataSelector = state => state.applicationPage?.applicationActiveData
export const categoryActiveDataSelector = state => state.applicationPage?.categoryData
export const subCategoryActiveDataSelector = state => state.applicationPage?.subCategoryData



export default applicationSlice.reducer;