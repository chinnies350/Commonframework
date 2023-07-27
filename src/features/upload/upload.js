import { createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
const uploadApiUrl = import.meta.env.ENV_IMAGE_UPLOAD_API_URL;


export const uploadImage = createAsyncThunk('upload/uploadImage', async (file) => {
    let formdata = new FormData();
    formdata.append("file", file);
    return await axios.post(`${uploadApiUrl}/upload`, formdata)
})