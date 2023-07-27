
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const apiUrl = import.meta.env.ENV_API_URL;


export const getCmpanyBranch = createAsyncThunk('branch/getCmpanyBranch',async(CompId) =>{
    return await axios.get(`${apiUrl}/branch?CompId=${CompId}`)

})

export const getPricingMode = createAsyncThunk('getPricingMode/getPricingMode', async () => {
    return await axios.get(`${apiUrl}/configMaster?TypeName=paymentMode&ActiveStatus=A`)
})

export const getPaymentUPIDetails = createAsyncThunk('paymentUpiDetails/getPaymentUPIDetails',async() =>{
    return await axios.get(`${apiUrl}/paymentUpiDetails?`)

})

export const getAdminPaymentUPIDetails = createAsyncThunk('paymentUpiDetails/getAdminPaymentUPIDetails',async(UserId) =>{
    return await axios.get(`${apiUrl}/paymentUpiDetails?AdminId=${UserId}&type=O`)

})

export const postPaymentUpiDetails = createAsyncThunk('paymentUpiDetails/postPaymentUpiDetails',async(postData) =>{
    return await axios.post(`${apiUrl}/paymentUpiDetails`, postData)

})

export const putPaymentUpiDetails = createAsyncThunk('paymentUpiDetails/putPaymentUpiDetails', async (putData) => {
    console.log('putData',putData)
    return await axios.put(`${apiUrl}/paymentUpiDetails`, putData)
})

export const deletePaymentUPIDetails = createAsyncThunk('paymentUpiDetails/deletePaymentUPIDetails', async (deleteData) => {
    return await axios.delete(`${apiUrl}/paymentUpiDetails`, { params: deleteData })
})



const initialState = {
    CmpanyBranchData: [],
    PaymentUPIData:[],
    AdminPaymentUPIData:[]
}

const paymentUPIdetailsSlice = createSlice({
    name:'messagetemplate',
    initialState,
    extraReducers: builder => {
        builder.addCase(getCmpanyBranch.fulfilled, (state, action)=> {
            if (action.payload.status) {
                state.CmpanyBranchData = action.payload.data.data
            }
            else {
                state.CmpanyBranchData = []
            }
            
        })

        builder.addCase(getPaymentUPIDetails.fulfilled, (state, action)=> {
            if (action.payload.status) {
                state.PaymentUPIData = action.payload.data.data
            }
            else {
                state.PaymentUPIData = []
            }
            
        })

        builder.addCase(getAdminPaymentUPIDetails.fulfilled, (state, action)=> {
            if (action.payload.status) {
                state.AdminPaymentUPIData = action.payload.data.data
            }
            else {
                state.AdminPaymentUPIData = []
            }
            
        })

    }

})


export const CmpanyBranchDataSelector = state => state.paymentUPIdetails?.CmpanyBranchData
export const PaymentUPIDetailsSelector = state => state.paymentUPIdetails?.PaymentUPIData
export const AdminPaymentUPIDataSelector = state => state.paymentUPIdetails?.AdminPaymentUPIData
export default paymentUPIdetailsSlice.reducer;