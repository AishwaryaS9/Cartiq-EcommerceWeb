import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

// Fetch all products (already present)
export const fetchProducts = createAsyncThunk(
    'product/fetchProducts',
    async ({ storeId }, thunkAPI) => {
        try {
            const { data } = await axios.get(
                '/api/products' + (storeId ? `?storeId=${storeId}` : '')
            )
            return data.products
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message)
        }
    }
)

// Update an existing product
export const updateProduct = createAsyncThunk(
    'product/updateProduct',
    async ({ token, productData }, thunkAPI) => {
        try {
            const isFormData = productData instanceof FormData
            const { data } = await axios.post('/api/store/product/update', productData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : {}),
                },
            })
            return data.product
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message)
        }
    }
)

const productSlice = createSlice({
    name: 'product',
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {
        setProduct: (state, action) => {
            state.list = action.payload
        },
        clearProduct: (state) => {
            state.list = []
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch products
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false
                state.list = action.payload
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            // Update product
            .addCase(updateProduct.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false
                const updated = action.payload
                state.list = state.list.map((product) =>
                    product.id === updated.id ? updated : product
                )
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    },
})

export const { setProduct, clearProduct } = productSlice.actions
export default productSlice.reducer
