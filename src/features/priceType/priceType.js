import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const apiUrl = import.meta.env.ENV_API_URL;


export const getPricingType = createAsyncThunk('priceType/pricingType', async (AppId) => {
    return await axios.get(`${apiUrl}/pricingType`)
})

export const getPricingTag = createAsyncThunk('priceType/getPricingTag', async () => {
    return await axios.get(`${apiUrl}/configMaster?TypeName=pricingType`)
})

export const getTaxdata = createAsyncThunk('priceType/getTaxdata', async () => {
    return await axios.get(`${apiUrl}/adminTax?ActiveStatus=A`)
})

export const getCurrData = createAsyncThunk('priceType/getCurrData', async () => {
    return await axios.get(`${apiUrl}/currency?ActiveStatus=A`)
})

export const postPriceType = createAsyncThunk('priceType/postPriceType', async (postData) => {
    return await axios.post(`${apiUrl}/pricingType`, postData)
})

export const putPriceType= createAsyncThunk('priceType/putPriceType', async (putData) => {
    return await axios.put(`${apiUrl}/pricingType`, putData)
})

export const deletePriceType = createAsyncThunk('priceType/deletePriceType', async (deleteData) => {
    return await axios.delete(`${apiUrl}/pricingType?PricingId=${deleteData.PricingId}&ActiveStatus=${deleteData.ActiveStatus}&UpdatedBy=${deleteData.UpdatedBy}`)
}) 


const initialState = {
    priceData: []
}

const priceSlice = createSlice({
    name:'priceType',
    initialState,
    extraReducers: builder => {
        builder.addCase(getPricingType.fulfilled, (state, action)=> {
            if (action.payload.status) {
                state.priceData = action.payload.data.data
            }
            else {
                state.priceData = []
            }
            
        })
    }

})

export const priceSelector = state => state.priceData?.priceData




export default priceSlice.reducer;