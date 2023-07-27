import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = import.meta.env.ENV_API_URL

export const getAllApplications = createAsyncThunk('application/getApplicationData', async({userId})=> {
    console.log('application apiUrl', apiUrl)
    return axios.get(`${apiUrl}/application?UserId=${userId}&Type=H`)
})

export const getUserData = createAsyncThunk('application/getApplicationData', async({userId})=> {
    console.log('application apiUrl', apiUrl)
    return axios.get(`${apiUrl}/user?UserId=${userId}&ActiveStatus=A`)
})


const initialState = {
    allApplications : []
}

const applicationSlice = createSlice({
    name: 'applications',
    initialState,
    // extraReducers: builder => {
    //     builder.addCase(getAllApplications.fulfilled, (state, action)=> {
    //         if (action.payload.data.statusCode) {
    //             state.allApplications = action.payload.data.data
    //         }
             
    //     })
    // }
})

export const allApplicationsSelector = state => state.applications? state.applications.allApplications: initialState.allApplications

export default applicationSlice.reducer