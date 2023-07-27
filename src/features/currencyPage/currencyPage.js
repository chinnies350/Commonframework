import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const apiUrl = import.meta.env.ENV_API_URL;


export const getCurrency = createAsyncThunk('currency/getCurrency', async () => {
    return await axios.get(`${apiUrl}/currency`)
})


export const postCurrency = createAsyncThunk('currency/postCurrency', async (postData) => {
    console.log('postData',postData)
    return await axios.post(`${apiUrl}/currency`, postData)
})

export const putCurrency = createAsyncThunk('currency/putCurrency', async (putData) => {
    console.log('putData',putData)
    return await axios.put(`${apiUrl}/currency`, putData)
})

export const deleteCurrency = createAsyncThunk('currency/deleteCurrency', async (deleteData) => {
    return await axios.delete(`${apiUrl}/currency`, { params: deleteData })
}) 

const initialState = {
    currencyData: []
}

const currencySlice = createSlice({
    name:'curency',
    initialState,
    extraReducers: builder => {
        builder.addCase(getCurrency.fulfilled, (state, action)=> {
            if (action.payload.status) {
                state.currencyData = action.payload.data.data
            }
            else {
                state.currencyData = []
            }
            
        })
    }

})

export const currencyDataSelector = state => state.currencyPage?.currencyData




export default currencySlice.reducer;