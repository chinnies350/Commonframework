import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const apiUrl = import.meta.env.ENV_API_URL;


export const getCompanyData = createAsyncThunk('company/getCompanyData', async () => {
    return await axios.get(`${apiUrl}/company`)
})

export const getUserRoles = createAsyncThunk('company/getUserRoles', async () => {
    return await axios.get(`${apiUrl}/configMaster?ActiveStatus=A&TypeName=UserRole`)
})



export const getActiveCompanyData = createAsyncThunk('company/getActiveCompanyData', async (UserId) => {
    if(UserId)
    {
        return await axios.get(`${apiUrl}/company?UserId=${UserId}`)
        
    }
    else{
        return await axios.get(`${apiUrl}/company?ActiveStatus=A`)

    }
})

export const postCompanyData = createAsyncThunk('company/postCompanyData', async (postData) => {
    return await axios.post(`${apiUrl}/company`, postData)
})

export const putCompanyData = createAsyncThunk('company/putCompanyData', async (putData) => {
    return await axios.put(`${apiUrl}/company`, putData)
})

export const deleteCompanyData = createAsyncThunk('company/deleteCompanyData', async (deleteData) => {
    return await axios.delete(`${apiUrl}/company`, { params: deleteData })
})

export const getAdminNames = createAsyncThunk('login/getAdminNames', async () =>{
    return await axios.get(`${apiUrl}/login?Type=Admin`)
})

export const getAdminUsers = createAsyncThunk('company/getAdminUsers',async(UserId) =>{
    return await axios.get(`${apiUrl}/company?UserId=${UserId}`)

})

export const getApplications = createAsyncThunk('userAppMap/getApplications',async(UserId) =>{
    if(UserId)
    {
        return await axios.get(`${apiUrl}/userAppMap?UserId=${UserId}`)
        
    }
    else{
        return await axios.get(`${apiUrl}/userAppMap`)

    }
    
})

export const checkTrialCompany = createAsyncThunk('userAppMap/checkTrialCompany',async(getTrialCompany) =>{

    return await axios.get(`${apiUrl}/userAppMap?AppId=${getTrialCompany.AppId}&UserId=${getTrialCompany.UserId}`)
})

const initialState = {
    companyData: [],
    companyActiveData:[],
    AdminNames: [],
    AdminUsers: [],
    ApplicationNames: [],
    CompanyCounts: []
}

const companySlice = createSlice({
    name:'company',
    initialState,
    extraReducers: builder => {
        builder.addCase(getCompanyData.fulfilled, (state, action)=> {
            if (action.payload.status) {
                state.companyData = action.payload.data.data
            }
            else {
                state.companyData = []
            }
            
        })
        builder.addCase(getActiveCompanyData.fulfilled, (state, action)=> {
            if (action.payload.status) {
                state.companyActiveData = action.payload.data.data
            }
            else {
                state.companyActiveData = []
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

        builder.addCase(getAdminUsers.fulfilled, (state, action)=> {
            if (action.payload.status) {
                state.AdminUsers = action.payload.data.data
            }
            else {
                state.AdminUsers = []
            }
            
        })

        builder.addCase(getApplications.fulfilled, (state, action)=> {
            if (action.payload.status) {
                state.ApplicationNames = action.payload.data.data
            }
            else {
                state.ApplicationNames = []
            }
            
        })
        builder.addCase(checkTrialCompany.fulfilled, (state, action)=> {
            if (action.payload.status) {
                state.CompanyCounts = action.payload.data.data
               
            }
            else {
                
                state.CompanyCounts = []
               
            }
            
        })
       
    }

})

export const companyDataSelector = state => state.companyPage?.companyData
export const companyActiveDataSelector = state => state.companyPage?.companyActiveData
export const AdminNamesSelector = state => state.companyPage?.AdminNames
export const AdminUsersSelector = state => state.companyPage?.AdminUsers
export const ApplicationNamesSelector = state => state.companyPage?.ApplicationNames
export const checkTrialCompanySelector = state => state.companyPage?.CompanyCounts



export default companySlice.reducer;