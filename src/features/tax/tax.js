import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const apiUrl = import.meta.env.ENV_API_URL;



export const getAdmin = createAsyncThunk('tax/adminTax', async () => {
    return await axios.get(`${apiUrl}/adminTax?ActiveStatus=A`)
})

export const postTax = createAsyncThunk('tax/postFeature', async (postData) => {
    return await axios.post(`${apiUrl}/adminTax`, postData)
})

export const deleteTax = createAsyncThunk('tax/deleteTax', async (deleteData) => {
    return await axios.delete(`${apiUrl}/adminTax?TaxId=${deleteData.TaxId}&ActiveStatus=${deleteData.ActiveStatus}&UpdatedBy=${deleteData.UpdatedBy}`)
}) 


const initialState = {
    taxData: []
}

const taxSlice = createSlice({
    name:'tax',
    initialState,
    extraReducers: builder => {
        builder.addCase(getAdmin.fulfilled, (state, action)=> {
            if (action.payload.status) {
                state.taxData = action.payload.data.data
            }
            else {
                state.taxData = []
            }
            
        })
    }

})

export const taxSelector = state => state.taxData?.taxData




export default taxSlice.reducer;

