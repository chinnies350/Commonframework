import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from '../api/apiSlice';



const moduleAccessDataAdapter = createEntityAdapter({
    sortComparer: (a,b) => b?.CreatedDate?.localeCompare(a?.CreatedDate)
})

const initialState = moduleAccessDataAdapter.getInitialState()

const moduleAccessApi = apiSlice.injectEndpoints({
    
    endpoints: (builder) => ({
        getStoreData: builder.query({
            query: () => '/company?ActiveStatus=A',
            transformResponse: responseData => {
                console.log('responseData', responseData)
                const data = responseData.data.map((eachData, index) => {
                    eachData.id = index
                    return eachData
                })
                console.log('data2', data);
                // let data = [...responseData.data, {"hi": 'hello', CreatedDate: '2022-04-13T23:02:19.248Z'}]
                return moduleAccessDataAdapter.setAll(initialState, data)
            }
        }),
        getBranchData: builder.query({
            query: ( storeId ) => `/getBranchMaster?StoreId=${storeId}`,
            transformResponse: responseData => {
                console.log('branchData api', responseData);
                const result = responseData.data.map((eachBranch, index) => {
                    eachBranch.id = index
                    return eachBranch
                })

                console.log('branchData result', result);

                return moduleAccessDataAdapter.setAll(initialState, result)
            }
        })
    })

})

export const { useGetStoreDataQuery, useGetBranchDataQuery } = moduleAccessApi;

const getStoreDataResult = moduleAccessApi.endpoints.getStoreData.select()
console.log(moduleAccessApi.endpoints.getStoreData.select(),"data2")

const getStoreDataSelector = createSelector(getStoreDataResult , storeData => storeData.data)

export const { selectAll: storeDataSelector } = moduleAccessDataAdapter.getSelectors(state => getStoreDataSelector(state) ?? initialState)

const getBranchDataResult = moduleAccessApi.endpoints.getBranchData.select()

const getBranchDataSelector = createSelector(getBranchDataResult, branchData => branchData.data)

export const { selectAll: branchDataSelector, selectEntities: branchDataSelectorData } = moduleAccessDataAdapter.getSelectors(state => getBranchDataSelector(state) ?? initialState)

// export const selectModuleAccessData = state => {
//     const adapterSelectors = moduleAccessDataAdapter.getSelectors();
//     return adapterSelectors.selectAll(state);
// }







