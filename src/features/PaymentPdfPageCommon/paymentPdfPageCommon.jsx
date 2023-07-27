import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const apiUrl = import.meta.env.ENV_API_URL;



export const getUserMappDetails = createAsyncThunk('getUserMappDetails/getUserMappDetails', async (BookingId) => {
    return await axios.get(`${apiUrl}/userAppMap?UniqueId=${BookingId}`);
  });


const initialState = {
    UserMappDetails: []
}

const UserMappDetailsSlice = createSlice({
    name:'getUserMappDetails',
    initialState,
    extraReducers: builder => {
        builder.addCase(getUserMappDetails.fulfilled, (state, action)=> {
            if (action.payload.status) {
                state.priceData = action.payload.data.data
            }
            else {
                state.UserMappDetails = []
            }
            
        })
    }

})

export const UserMappDetailsSelector = state => state.UserMappDetails?.UserMappDetails




export default UserMappDetailsSlice.reducer;