
import { createSlice, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'

const getProdutosSlice = createSlice({
    name: 'getProdutos',
    initialState: {
        getProdutos: null,
        editar: false
    },
    reducers: {
        set: (state, value) => {
            state.getProdutos = value.payload
        },
        setEditar: (state, value) => {
            state.editar = value.payload
        }
    }
});

export const { set, setEditar } = getProdutosSlice.actions

export const storeProduto = configureStore({

    middleware: getDefaultMiddleware({
        serializableCheck: {
            // Ignore these action types
            ignoredActions: ['getProdutos/set', 'getProdutos/setEditar'],
        },
    }),

    reducer: getProdutosSlice.reducer
});