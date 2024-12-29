import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import themeReducer from '../features/themeSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        theme: themeReducer,
    },
});

export default store;