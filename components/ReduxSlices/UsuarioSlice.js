
import { createSlice, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'

const getUsuariosSlice = createSlice({
    name: 'getUsuarios',
    initialState: {
        getUsuarios: null,
        editar: false
    },
    reducers: {
        set: (state, value) => {
            state.getUsuarios = value.payload
        },
        setEditar: (state, value) => {
            state.editar = value.payload
        }
    }
});

export const { set, setEditar } = getUsuariosSlice.actions

export const storeUsuario = configureStore({

    middleware: getDefaultMiddleware({
        serializableCheck: {
            // Ignore these action types
            ignoredActions: ['getUsuarios/set', 'getUsuarios/setEditar'],
            // Ignore these field paths in all actions
            //ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
            // Ignore these paths in the state
            //ignoredPaths: ['items.dates'],
        },
    }),

    reducer: getUsuariosSlice.reducer
});