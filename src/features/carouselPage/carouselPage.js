import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const apiUrl = import.meta.env.ENV_API_URL;


export const getCarouselData = createAsyncThunk('carousel/getCarouselData', async () => {
    return await axios.get(`${apiUrl}/carousel`)
})

export const deleteCarouselData = createAsyncThunk('carousel/deleteCarouselData', async (deleteData) => {
    return await axios.delete(`${apiUrl}/carousel`, { params: deleteData })
})

export const postCarouselData = createAsyncThunk('carousel/postCarouselData', async (postData) => {
    console.log('postData',postData)
    return await axios.post(`${apiUrl}/carousel`, postData)
})

export const putCarouselData = createAsyncThunk('carousel/putCarouselData', async (putData) => {
    console.log('putData',putData)
    return await axios.put(`${apiUrl}/carousel`, putData)
})

export const getConfigNames = createAsyncThunk('configMaster/getConfigNames', async () => {
    return await axios.get(`${apiUrl}/configMaster?ActiveStatus=A&TypeName=ScreenName`)
})




const initialState = {
    carouselData: [],
    ConfigNames:[],
}

const carouselSlice = createSlice({
    name:'carousel',
    initialState,
    extraReducers: builder => {
        builder.addCase(getCarouselData.fulfilled, (state, action)=> {
            if (action.payload.status) {
                state.carouselData = action.payload.data.data
            }
            else {
                state.carouselData = []
            }
            
        })

        builder.addCase(getConfigNames.fulfilled, (state, action)=> {
            if (action.payload.status) {
                state.ConfigNames = action.payload.data.data
            }
            else {
                state.ConfigNames = []
            }
            
        })
    }

})

export const carouselDataSelector = state => state.carouselPage?.carouselData
export const ConfigNamesSelector = state => state.carouselPage?.ConfigNames



export default carouselSlice.reducer;