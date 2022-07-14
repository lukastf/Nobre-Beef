
import { createSlice, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'

const getCategoriasSlice = createSlice({
    name: 'getCategorias',
    initialState: {
        getCategorias: null,
        editar: false
    },
    reducers: {
        set: (state, value) => {
            state.getCategorias = value.payload
        },
        setEditar: (state, value) => {
            state.editar = value.payload
        }
    }
});

export const { set, setEditar } = getCategoriasSlice.actions

export const storeCategoria = configureStore({

    middleware: getDefaultMiddleware({
        serializableCheck: {
            // Ignore these action types
            ignoredActions: ['getCategorias/set', 'getCategorias/setEditar'],
            // Ignore these field paths in all actions
            //ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
            // Ignore these paths in the state
            //ignoredPaths: ['items.dates'],
        },
    }),

    reducer: getCategoriasSlice.reducer
});