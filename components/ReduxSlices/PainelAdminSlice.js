
import { createSlice, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'

const painelAdminSlice = createSlice({
    name: 'displayCompsHandler',
    initialState: {
        displayCompsHandler: null
    },
    reducers: {
        set: (state, value) => {
            state.displayCompsHandler = value.payload
        }
    }
});

export const { set } = painelAdminSlice.actions

export const storePainelAdmin = configureStore({

    middleware: getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: ['displayCompsHandler/set'],
        },
    }),

    reducer: painelAdminSlice.reducer
});