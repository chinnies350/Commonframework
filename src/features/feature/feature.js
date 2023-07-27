import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const apiUrl = import.meta.env.ENV_API_URL;



export const getFeatureCategory = createAsyncThunk('feature/featureCategory', async () => {
    return await axios.get(`${apiUrl}/configMaster?TypeName=featureCategory`)
})

export const getFeatureType = createAsyncThunk('feature/FeatureType', async () => {
    return await axios.get(`${apiUrl}/configMaster?TypeName=FeatureType`)
})



export const getFeature = createAsyncThunk('feature/getFeature', async () => {
    return await axios.get(`${apiUrl}/feature`)
})





export const postFeature = createAsyncThunk('feature/postFeature', async (postData) => {
    return await axios.post(`${apiUrl}/feature`, postData)
})

export const putFeature= createAsyncThunk('feature/putFeature', async (putData) => {
    return await axios.put(`${apiUrl}/feature`, putData)
})

export const deleteFeature = createAsyncThunk('feature/deleteFeature', async (deleteData) => {
    return await axios.delete(`${apiUrl}/feature?FeatId=${deleteData.FeatId}&ActiveStatus=${deleteData.ActiveStatus}&UpdatedBy=${deleteData.UpdatedBy}`)
}) 


const initialState = {
    featureData: []
}

const featureSlice = createSlice({
    name:'feature',
    initialState,
    extraReducers: builder => {
        builder.addCase(getFeature.fulfilled, (state, action)=> {
            if (action.payload.status) {
                state.featureData = action.payload.data.data
            }
            else {
                state.featureData = []
            }
            
        })
    }

})

export const featureSelector = state => state.featureData?.featureData




export default featureSlice.reducer;