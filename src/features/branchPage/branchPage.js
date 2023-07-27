import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const apiUrl = import.meta.env.ENV_API_URL;


export const getBranchData = createAsyncThunk('branch/getBranchData', async () => {
    return await axios.get(`${apiUrl}/branch`)
})

export const postBranchData = createAsyncThunk('branch/postBranchData', async (postData) => {
    return await axios.post(`${apiUrl}/branch`, postData)
})

export const putBranchData = createAsyncThunk('branch/putBranchData', async (putData) => {
    return await axios.put(`${apiUrl}/branch`, putData)
})

export const deleteBranchData = createAsyncThunk('branch/deleteBranchData', async (deleteData) => {
    return await axios.delete(`${apiUrl}/branch`, { params: deleteData })
})

export const getActiveBranchData = createAsyncThunk('branch/getActiveBranchData', async () => {
    return await axios.get(`${apiUrl}/branch?ActiveStatus=A`)
})

export const getActiveAdminData = createAsyncThunk('branch/getActiveAdminData', async () => {
    return await axios.get(`${apiUrl}/user?UserType=A`)
})

export const getAdminNames = createAsyncThunk('login/getAdminNames', async () =>{
    return await axios.get(`${apiUrl}/login?Type=Admin`)
})

export const getBranchAdminUsers = createAsyncThunk('branch/getBranchAdminUsers',async(UserId) =>{
    return await axios.get(`${apiUrl}/branch?UserId=${UserId}`)

})

export const getBranchApplications = createAsyncThunk('userAppMap/getApplications',async(UserId) =>{
    if(UserId)
    {
        return await axios.get(`${apiUrl}/userAppMap?UserId=${UserId}`)
        
    }
    else{
        return await axios.get(`${apiUrl}/userAppMap`)

    }
    
})

export const getApplicationCompany = createAsyncThunk('appAccess/getApplicationCompany',async(AppId) =>{
    return await axios.get(`${apiUrl}/appAccess?AppId=${AppId}`)
})

export const getUserAppCompany = createAsyncThunk('appAccess/getUserAppCompany',async(getCompData) =>{
    return await axios.get(`${apiUrl}/appAccess?UserId=${getCompData.UserId}&AppId=${getCompData.AppId}`)
})
export const checkTrialBranch = createAsyncThunk('appAccess/checkTrialBranch',async(getCompData) =>{
    return await axios.get(`${apiUrl}/appAccess?UserId=${getCompData.UserId}&AppId=${getCompData.AppId}&CompId=${getCompData.CompId}&&Type=T`)
})

export const getBranchDataBasedOnCompany = createAsyncThunk('branch/getCompanyDataBasedOnApp', async ({UserId,AppId,CompId}) => {
    console.log(UserId,AppId,"UserId,AppId")
    return await axios.get(`${apiUrl}/appAccess?UserId=${UserId}&AppId=${AppId}&CompId=${CompId}`)
})
export const getCompanyDataBasedOnApp = createAsyncThunk('branch/getCompanyDataBasedOnApp', async ({UserId,AppId}) => {
    console.log(UserId,AppId,"UserId,AppId")
    return await axios.get(`${apiUrl}/appAccess?UserId=${UserId}&AppId=${AppId}`)
})
export const getActiveAppData = createAsyncThunk('branch/getActiveAppData', async (UserId) => {
    return await axios.get(`${apiUrl}/appAccess?UserId=${UserId}&Type=AD`)
})
const initialState = {
    branchData: [],
    branchActiveData:[],
    AdminNames: [],
    BranchAdminUsers: [],
    BranchApplicationNames: [],
    ApplicationCompany: [],
    UserAppCompany:[],
    BranchCounts:[]
}

const branchSlice = createSlice({
    name:'branch',
    initialState,
    reducers: {
        companyname: (state, action) => {
            state.UserAppCompany=[]
        },
      },
    extraReducers: builder => {
        builder.addCase(getBranchData.fulfilled, (state, action)=> {
       
            if (action.payload.status) {
                state.branchData = action.payload.data.data
            }
            else {
                
                state.branchData = []
            }
            
        })

        builder.addCase(getActiveBranchData.fulfilled, (state, action)=> {
            if (action.payload.status) {
                state.branchActiveData = action.payload.data.data
            }
            else {
                state.branchActiveData = []
            }
            
        })

        builder.addCase(getAdminNames.fulfilled, (state, action)=> {
            if (action.payload.status) {
                state.AdminNames = action.payload.data.data
            }
            else {
                state.AdminNames = []
            }
            
        })

        builder.addCase(getBranchAdminUsers.fulfilled, (state, action)=> {
            if (action.payload.status) {
                state.BranchAdminUsers = action.payload.data.data
            }
            else {
                state.BranchAdminUsers = []
            }
            
        })
        builder.addCase(getBranchApplications.fulfilled, (state, action)=> {
            if (action.payload.status) {
                state.BranchApplicationNames = action.payload.data.data
            }
            else {
                state.BranchApplicationNames = []
            }
            
        })

        builder.addCase(getApplicationCompany.fulfilled, (state, action)=> {
            if (action.payload.status) {
                state.ApplicationCompany = action.payload.data.data
                state.UserAppCompany = []
            }
            else {
                state.ApplicationCompany = []
                state.UserAppCompany = []
            }
            
        })

        builder.addCase(getUserAppCompany.fulfilled, (state, action)=> {
            if (action.payload.status) {
                state.UserAppCompany = action.payload.data.data
            }
            else {
                state.UserAppCompany = []
            }
            
        })
        builder.addCase(checkTrialBranch.fulfilled, (state, action)=> {
            if (action.payload.status) {
                state.BranchCounts = action.payload.data.data
            }
            else {
                state.BranchCounts = []
            }
            
        })
       
    }

})

export const {
    companyname,
  } = branchSlice.actions;

export const branchDataSelector = state => state.branchPage?.branchData
export const branchActiveDataSelector = state => state.branchPage?.branchActiveData
export const AdminNamesSelector = state => state.branchPage?.AdminNames
export const BranchAdminSelector = state => state.branchPage?.BranchAdminUsers
export const BranchApplicationNamesSelector = state => state.branchPage?.BranchApplicationNames
export const ApplicationCompanySelector = state => state.branchPage?.ApplicationCompany
export const UserAppCompanySelector = state => state.branchPage?.UserAppCompany
export const checkTrialBranchSelector = state => state.branchPage?.BranchCounts



export default branchSlice.reducer;


