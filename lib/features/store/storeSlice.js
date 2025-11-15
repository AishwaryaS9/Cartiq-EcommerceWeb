// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
// import axios from "axios"

// export const fetchStoreDetails = createAsyncThunk(
//     "store/fetchStoreDetails",
//     async ({ username }, thunkAPI) => {
//         try {
//             const { data } = await axios.get(`/api/store/data?username=${username}`)
//             return data.store
//         } catch (error) {
//             return thunkAPI.rejectWithValue(error?.response?.data || error.message)
//         }
//     }
// )

// const storeSlice = createSlice({
//     name: "store",
//     initialState: {
//         info: null,
//         products: [],
//         loading: false,
//         error: null,
//     },
//     reducers: {
//         clearStore: (state) => {
//             state.info = null
//             state.products = []
//         }
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchStoreDetails.pending, (state) => {
//                 state.loading = true
//                 state.error = null
//             })
//             .addCase(fetchStoreDetails.fulfilled, (state, action) => {
//                 state.loading = false
//                 state.info = action.payload
//                 state.products = action.payload?.Product || []
//             })
//             .addCase(fetchStoreDetails.rejected, (state, action) => {
//                 state.loading = false
//                 state.error = action.payload
//                 state.info = null
//                 state.products = []
//             })
//     },
// })

// export const { clearStore } = storeSlice.actions
// export default storeSlice.reducer


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// Fetch store info by username
export const fetchStore = createAsyncThunk(
    'store/fetchStore',
    async (username, thunkAPI) => {
        try {
            const { data } = await axios.get(`/api/store/data?username=${username}`)
            return data.store
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message)
        }
    }
)

const storeSlice = createSlice({
    name: 'store',
    initialState: {
        data: null,  // store info (store.name, store.logo, etc.)
        loading: false,
        error: null,
    },
    reducers: {
        setStore: (state, action) => {
            state.data = action.payload
        },
        clearStore: (state) => {
            state.data = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStore.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchStore.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
            })
            .addCase(fetchStore.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    },
})

export const { clearStore } = storeSlice.actions
export default storeSlice.reducer

