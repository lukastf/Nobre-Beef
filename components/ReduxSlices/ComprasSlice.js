
import { createSlice, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'

const getComprasSlice = createSlice({
    name: 'getCompras',
    initialState: {
        getCompras: null,
        editar: false
    },
    reducers: {
        set: (state, value) => {
            state.getCompras = value.payload
        },
        setEditar: (state, value) => {
            state.editar = value.payload
        }
    }
});

export const { set, setEditar } = getComprasSlice.actions

export const storeCompra = configureStore({

    middleware: getDefaultMiddleware({
        serializableCheck: {
            // Ignore these action types
            ignoredActions: ['getCompras/set', 'getCompras/setEditar'],
        },
    }),

    reducer: getComprasSlice.reducer
});