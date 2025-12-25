import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './usersSlice';

export default configureStore({
    reducer: {
        usersReducer
    }
})