import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const apiUrl = import.meta.env.ENV_API_URL;



export const getMessagetemplateData = createAsyncThunk('messagetemplates/getBranchData', async () => {
    return await axios.get(`${apiUrl}/messagetemplates`)
})

export const postMessageTemplates = createAsyncThunk('messagetemplates/postMessageTemplates', async (postData) => {
    console.log('postData',postData)
    return await axios.post(`${apiUrl}/messagetemplates`, postData)
})

export const putMessageTemplates = createAsyncThunk('messagetemplates/putMessageTemplates', async (putData) => {
    console.log('putData',putData)
    return await axios.put(`${apiUrl}/messagetemplates`, putData)
})




const initialState = {
    MessagetemplateData: []
}

const messagetemplateSlice = createSlice({
    name:'messagetemplate',
    initialState,
    extraReducers: builder => {
        builder.addCase(getMessagetemplateData.fulfilled, (state, action)=> {
            if (action.payload.status) {
                state.MessagetemplateData = action.payload.data.data
            }
            else {
                state.MessagetemplateData = []
            }
            
        })

    }

})

export const messagetemplateSelector = state => state.MessageTemplate?.MessagetemplateData
export default messagetemplateSlice.reducer;

