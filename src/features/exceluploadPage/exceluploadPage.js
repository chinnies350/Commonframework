import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";




const initialState = {
    excelFile: null,
    excelFileError: null,
    excelData:null,
    fileInputRef: " "
}

const excelupload = createSlice({
    name:'excelupload',
    initialState,
    reducers :{
        emptyExcelData: (state, action) => {
            state.excelFile = null
            state.excelFileError = null
            state.excelData = null
            state.fileInputRef = " "
        },
        uploadExcel: (state, action) =>{
            const { file, jsonData } = action.payload;
            state.excelFile=file;
            state.excelData=jsonData;
        }
    }

})

export const {emptyExcelData, uploadExcel} = excelupload.actions;

export const excelDataSelector = state => state.exceluploadPage.excelData
export const excelFileSelector = state => state.exceluploadPage.excelFile
export const excelFileErrorSelector = state => state.exceluploadPage.excelFileError
export const fileInputRefSelector = state => state.exceluploadPage.fileInputRef

export default excelupload.reducer;