import { configureStore } from '@reduxjs/toolkit';
import postsReducer from '../features/Posts/Postssclice';

export default configureStore({
    reducer: {
        Posts: postsReducer,
    }
})