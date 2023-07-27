import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const apiUrl = import.meta.env.ENV_API_URL;

export const getBannerImage = createAsyncThunk('application/getBannerImage', async () => {
    return await axios.get(`${apiUrl}/application?ActiveStatus=A`);
  });

export const getApplication = createAsyncThunk('application/getApplication', async () => {
return await axios.get(`${apiUrl}/application?Type=A`);
});

export const getApplicationCategory = createAsyncThunk('application/getApplicationCategory', async (CateId) => {
return await axios.get(`${apiUrl}/application?CateId=${CateId}`);
});

export const getApplicationSubCategory = createAsyncThunk('application/getApplicationSubCategory', async (SubId) => {
return await axios.get(`${apiUrl}/application?SubId=${SubId}`);
}); 




const initialState = {
    BannerImage:[],
    Applications:[],
    ApplicationCategory:[],
    ApplicationSubCategory:[],
}

const BannerImageSlice = createSlice({
    name:'bannerImage',
    initialState,
    extraReducers: builder => {

        builder.addCase(getBannerImage.fulfilled, (state, action)=> {
            if (action.payload.status) {
                state.BannerImage = action.payload.data;
                
            }
            else {
                state.BannerImage = null;
            }
            
        })

        builder.addCase(getApplication.fulfilled, (state, action)=> {
            if (action.payload.status) {
                state.Applications = action.payload.data;
                
            }
            else {
                state.Applications = null;
            }
            
        })

        builder.addCase(getApplicationCategory.fulfilled, (state, action)=> {
            if (action.payload.status) {
                state.ApplicationCategory = action.payload.data;
                
            }
            else {
                state.ApplicationCategory = null;
            }
            
        })

        builder.addCase(getApplicationSubCategory.fulfilled, (state, action)=> {
            if (action.payload.status) {
                state.ApplicationSubCategory = action.payload.data;
                
            }
            else {
                state.ApplicationSubCategory = null;
            }
            
        })
    }

})

export const BannerImageSelector = (state) => state.bannerImage?.BannerImage
export const ApplicationsSelector = (state) => state.bannerImage?.Applications
export const ApplicationCategorySelector = (state) => state.bannerImage?.ApplicationCategory
export const ApplicationSubCategorySelector = (state) => state.bannerImage?.ApplicationSubCategory 




export default BannerImageSlice.reducer;