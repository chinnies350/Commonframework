import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const apiUrl = import.meta.env.ENV_API_URL;


export const getApplication = createAsyncThunk('featureMapping/application', async () => {
    return await axios.get(`${apiUrl}/application`)
})

export const getpricingAppFeatMap = createAsyncThunk('featureMapping/pricingAppFeatMap', async () => {
    return await axios.get(`${apiUrl}/pricingAppFeatMap`)
})

export const getPricingType = createAsyncThunk('featureMapping/getPricingType', async (AppId) => {
    return await axios.get(`${apiUrl}/pricingType?AppId=${AppId}`)
})

export const getFeatureList = createAsyncThunk('featureMapping/getFeatureList', async () => {
    return await axios.get(`${apiUrl}/feature`)
})

export const postFeatureMapping = createAsyncThunk('featureMapping/postFeatureMapping', async (postData) => {
    return await axios.post(`${apiUrl}/pricingAppFeatMap`, postData)
})

export const putFeatureMapping= createAsyncThunk('featureMapping/putFeatureMapping', async (putData) => {
    return await axios.put(`${apiUrl}/pricingAppFeatMap`, putData)
})

export const deleteFeatureMapping = createAsyncThunk('featureMapping/deleteFeatureMapping', async (deleteData) => {
    return await axios.delete(`${apiUrl}/pricingAppFeatMap?AppId=${deleteData.AppId}&PricingId=${deleteData.PricingId}&ActiveStatus=${deleteData.ActiveStatus}&UpdatedBy=${deleteData.UpdatedBy}`)
}) 


const initialState = {
    featureData: []
}

const featureMappSlice = createSlice({
    name:'featureMapping',
    initialState,
    extraReducers: builder => {
        builder.addCase(getApplication.fulfilled, (state, action)=> {
            if (action.payload.status) {
                state.featureData = action.payload.data.data
            }
            else {
                state.featureData = []
            }
            
        })
    }

})

export const featureMappSelector = state => state.featureData?.featureData




export default featureMappSlice.reducer;