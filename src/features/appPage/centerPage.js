import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    'breadCrumb': []
}

const centerPageSlice = createSlice({
    name:'centerPage',
    initialState,
    reducers: {
            changeBreadCrumb: (state, action) => {
                const { items } =action.payload
                console.log('items in slice', items)
                state.breadCrumb = items
            },
            emptyBreadCrumb:(state,action)=>{
                state.breadCrumb = []
            }
    }
})

export const { changeBreadCrumb,emptyBreadCrumb } = centerPageSlice.actions;

export const breadCrumbSelector = state => state.centerPage?.breadCrumb;

export default centerPageSlice.reducer;








