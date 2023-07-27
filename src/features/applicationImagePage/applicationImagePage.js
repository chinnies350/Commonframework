import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const apiUrl = import.meta.env.ENV_API_URL;


export const getApplicationImageData = createAsyncThunk('applicationImage/getApplicationImageData', async () => {
    return await axios.get(`${apiUrl}/appImage`)
})

export const postApplicationImageData = createAsyncThunk('applicationImage/postApplicationImageData', async (postData) => {
    return await axios.post(`${apiUrl}/appImage`, postData)
})

export const putApplicationImageData = createAsyncThunk('applicationImage/putApplicationImageData', async (putData) => {
    return await axios.put(`${apiUrl}/appImage`, putData)
})

export const deleteApplicationImageData = createAsyncThunk('applicationImage/deleteApplicationImageData', async (deleteData) => {
    return await axios.delete(`${apiUrl}/appImage`, { params: deleteData })
}) 

const initialState = {
    applicationImageData: []
}

const applicationImageSlice = createSlice({
    name:'applicationImage',
    initialState,
    extraReducers: builder => {
        builder.addCase(getApplicationImageData.fulfilled, (state, action)=> {
            if (action.payload.status) {
                state.applicationImageData = action.payload.data.data
            }
            else {
                state.applicationImageData = []
            } 
        })
    }

})

export const applicationImageDataSelector = state => state.applicationImagePage?.applicationImageData



export default applicationImageSlice.reducer;