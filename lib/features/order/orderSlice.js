import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// Thunk to upload/save the latest order
export const uploadOrderSummary = createAsyncThunk(
    'order/uploadOrderSummary',
    async ({ getToken }, thunkAPI) => {
        try {
            const { currentOrder } = thunkAPI.getState().order
            if (!currentOrder) return

            const token = await getToken()
            await axios.post(
                '/api/orders/save-summary',
                { order: currentOrder },
                { headers: { Authorization: `Bearer ${token}` } }
            )
        } catch (error) {
            console.error('Upload order summary failed:', error)
            return thunkAPI.rejectWithValue(error.response?.data || { error: error.message })
        }
    }
)

// Thunk to fetch/restore order summary on reload
export const fetchOrderSummary = createAsyncThunk(
    'order/fetchOrderSummary',
    async ({ getToken }, thunkAPI) => {
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/orders/latest', {
                headers: { Authorization: `Bearer ${token}` },
            })
            return data.order
        } catch (error) {
            console.warn('Fetching order summary failed, falling back to local cache')
            const cached = localStorage.getItem('orderSummary')
            if (cached) return JSON.parse(cached)
            return thunkAPI.rejectWithValue(error.response?.data || { error: error.message })
        }
    }
)

const initialState = {
    currentOrder: null,
    orderHistory: [],
    status: 'idle',
}

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        setOrderSummary: (state, action) => {
            state.currentOrder = action.payload
            localStorage.setItem('orderSummary', JSON.stringify(action.payload))
        },
        clearOrderSummary: (state) => {
            state.currentOrder = null
            localStorage.removeItem('orderSummary')
        },
        addToOrderHistory: (state, action) => {
            state.orderHistory.push(action.payload)
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrderSummary.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchOrderSummary.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.currentOrder = action.payload
                localStorage.setItem('orderSummary', JSON.stringify(action.payload))
            })
            .addCase(fetchOrderSummary.rejected, (state) => {
                state.status = 'failed'
            })
    },
})

export const { setOrderSummary, clearOrderSummary, addToOrderHistory } = orderSlice.actions
export default orderSlice.reducer
