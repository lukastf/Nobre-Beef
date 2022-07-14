
import { createSlice, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'

const carrinhoSlice = createSlice({
    name: 'carrinho',
    initialState: {
        carrinho: [],
        totalCompra: 0
    },
    reducers: {
        set: (state, value) => {
            state.carrinho = value.payload
        },
        setTotalCompra: (state, value) => {
            state.totalCompra = value.payload
        }
    }
});

export const { set, setTotalCompra } = carrinhoSlice.actions

export const storeCarrinho = configureStore({

    middleware: getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: ['carrinho/set'],
        },
    }),

    reducer: carrinhoSlice.reducer
});