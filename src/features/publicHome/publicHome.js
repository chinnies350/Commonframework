import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const apiUrl = import.meta.env.ENV_API_URL;


export const getCategoryData = createAsyncThunk('publicHome/pricingType', async () => {
    return await axios.get(`${apiUrl}/application?Type=A`)
})

export const getSubCategoryData = createAsyncThunk('publicHome/getSubCategoryData', async (CatId) => {
    return await axios.get(`${apiUrl}/application?CateId=${CatId}`)
})

export const getApplicationData = createAsyncThunk('publicHome/getApplicationData', async (SubCatId) => {
    return await axios.get(`${apiUrl}/application?SubId=${SubCatId}`)
})






const initialState = {
    homeData: []
}

const publicHomeSlice = createSlice({
    name:'publicHome',
    initialState,
    extraReducers: builder => {
        builder.addCase(getCategoryData.fulfilled, (state, action)=> {
            if (action.payload.status) {
                state.homeData = action.payload.data.data
            }
            else {
                state.homeData = []
            }
            
        })
    }

})

export const publicHomeSelector = state => state.homeData?.homeData




export default publicHomeSlice.reducer;