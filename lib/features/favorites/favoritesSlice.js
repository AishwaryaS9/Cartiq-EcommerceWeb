import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

let debounceTimer = null

export const uploadFavorites = createAsyncThunk(
    'favorites/uploadFavorites',
    async ({ getToken }, thunkAPI) => {
        try {
            clearTimeout(debounceTimer)

            debounceTimer = setTimeout(async () => {
                const { favoriteItems } = thunkAPI.getState().favorites
                const token = await getToken()

                await axios.post(
                    '/api/favorites',
                    { favorites: favoriteItems },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
            }, 700)
        } catch (error) {
            console.error('Upload favorites failed:', error)
            return thunkAPI.rejectWithValue(error.response?.data || { error: error.message })
        }
    }
)

export const fetchFavorites = createAsyncThunk(
    'favorites/fetchFavorites',
    async ({ getToken }, thunkAPI) => {
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/favorites', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            return data
        } catch (error) {
            console.error('Fetch favorites failed:', error)
            return thunkAPI.rejectWithValue(error.response?.data || { error: error.message })
        }
    }
)

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState: {
        favoriteItems: [],
    },
    reducers: {
        addToFavorites: (state, action) => {
            const productId = action.payload.productId || action.payload
            if (!state.favoriteItems.includes(productId)) {
                state.favoriteItems.push(productId)
            }
        },
        removeFromFavorites: (state, action) => {
            const productId = action.payload.productId || action.payload
            state.favoriteItems = state.favoriteItems.filter(id => id !== productId)
        },
        toggleFavorite: (state, action) => {
            const productId = action.payload.productId || action.payload
            if (state.favoriteItems.includes(productId)) {
                state.favoriteItems = state.favoriteItems.filter(id => id !== productId)
            } else {
                state.favoriteItems.push(productId)
            }
        },
        clearFavorites: (state) => {
            state.favoriteItems = []
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFavorites.fulfilled, (state, action) => {
                state.favoriteItems = action.payload?.favorites || []
            })
            .addCase(fetchFavorites.rejected, (state) => {
                console.warn('Using local favorites cache')
            })
    },
})

export const {
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    clearFavorites,
} = favoritesSlice.actions

export default favoritesSlice.reducer
