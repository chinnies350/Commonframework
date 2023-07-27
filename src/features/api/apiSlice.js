import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
// import config from '../../config.json'
const apiUrl = import.meta.env.ENV_API_URL

// const config = "https://saveme.live/paypre-store/paypre-api"


export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({baseUrl: apiUrl}),
    tagTypes: ['Post', 'User'],
    endpoints: builder => ({})
})


