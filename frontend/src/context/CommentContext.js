// src/context/CommentsContext.js

import { createContext, useReducer, useContext } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const CommentsContext = createContext();

const initialState = {
    course_comments: [],
    lesson_comments: [],
    isReviewsLoading: false,
    isReviewPosting: false,
    isReviewDeleting: false,
    reviewDeletingId: null,
    isUpdating: false,
    error: null,
};

const ACTIONS = {
    SET_LOADING: 'SET_LOADING',
    SET_POSTING: 'SET_POSTING',
    SET_DELETING: 'SET_DELETING',
    SET_DELETING_ID: 'SET_DELETING_ID',
    SET_UPDATING: 'SET_UPDATING',
    GET_ALL_COURSE_COMMENTS: 'GET_ALL_COURSE_COMMENTS',
    POST_COURSE_COMMENT: 'POST_COURSE_COMMENT',
    DELETE_COURSE_COMMENT: 'DELETE_COURSE_COMMENT',
    UPDATE_COURSE_COMMENT: 'UPDATE_COURSE_COMMENT',
    GET_ALL_LESSON_COMMENTS: 'GET_ALL_LESSON_COMMENTS',
    POST_LESSON_COMMENT: 'POST_LESSON_COMMENT',
    DELETE_LESSON_COMMENT: 'DELETE_LESSON_COMMENT',
    UPDATE_LESSON_COMMENT: 'UPDATE_LESSON_COMMENT',
    SET_ERROR: 'SET_ERROR',
};

const reducer = (state, action) => {

    const user = JSON.parse(localStorage.getItem("user"));

    switch (action.type) {
        case ACTIONS.SET_LOADING:
            return { ...state, isReviewsLoading: action.payload };
        case ACTIONS.SET_POSTING:
            return { ...state, isReviewPosting: action.payload };
        case ACTIONS.SET_DELETING:
            return { ...state, isReviewDeleting: action.payload };
        case ACTIONS.SET_DELETING_ID:
            return { ...state,reviewDeletingId : action.payload };
        case ACTIONS.SET_UPDATING:
            return { ...state, isUpdating: action.payload };
        case ACTIONS.SET_ERROR:
            return { ...state, error: action.payload };

        // Course comments
        case ACTIONS.GET_ALL_COURSE_COMMENTS:
            return { ...state, course_comments: action.payload };

        case ACTIONS.POST_COURSE_COMMENT:
            return {
                ...state,
                course_comments: [...state.course_comments, { ...action.payload, user: { ...user } }],
            };

        case ACTIONS.DELETE_COURSE_COMMENT:
            return {
                ...state,
                course_comments: state.course_comments.filter(
                    (comment) => comment._id !== action.payload
                ),
                reviewDeletingId: action.payload,
            };
        case ACTIONS.UPDATE_COURSE_COMMENT:
            return {
                ...state,
                course_comments: state.course_comments.map((comment) =>
                    comment._id === action.payload?._id ? action.payload : comment
                ),
            };

        // Lesson comments
        case ACTIONS.GET_ALL_LESSON_COMMENTS:
            return { ...state, lesson_comments: action.payload };

        case ACTIONS.POST_LESSON_COMMENT:
            return {
                ...state,
                lesson_comments: [...state.lesson_comments, { ...action.payload, user: { ...user } }],
            };
        case ACTIONS.DELETE_LESSON_COMMENT:
            return {
                ...state,
                lesson_comments: state.lesson_comments.filter(
                    (comment) => comment._id !== action.payload
                ),
                reviewDeletingId: action.payload,
            };
        case ACTIONS.UPDATE_LESSON_COMMENT:
            return {
                ...state,
                lesson_comments: state.lesson_comments.map((comment) =>
                    comment._id === action.payload?._id ? action.payload : comment
                ),
            };

        default:
            return state;
    }
};

// --- Provider Component ---
export const CommentsProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    // Course comments
    const getCourseComments = async (courseId) => {
        try {
            dispatch({ type: ACTIONS.SET_LOADING, payload: true });
            const res = await axios.get(`${API_URL}/courses/${courseId}/reviews`, {
                withCredentials: true,
            });
            dispatch({
                type: ACTIONS.GET_ALL_COURSE_COMMENTS,
                payload: res.data.data.docs,
            });
        } catch (error) {
            dispatch({ type: ACTIONS.SET_ERROR, payload: error });
        } finally {
            dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        }
    };

    const postCourseComment = async (courseId, comment) => {
        try {
            dispatch({ type: ACTIONS.SET_POSTING, payload: true });
            const res = await axios.post(
                `${API_URL}/courses/${courseId}/reviews`,
                { comment, rating: 3 },
                { withCredentials: true }
            );


            dispatch({
                type: ACTIONS.POST_COURSE_COMMENT,
                payload: res.data.data.newDoc,
            });
        } catch (error) {
            dispatch({ type: ACTIONS.SET_ERROR, payload: error });
        } finally {
            dispatch({ type: ACTIONS.SET_POSTING, payload: false });
        }
    };

    const deleteCourseComment = async (courseId, commentId) => {
        try {
            dispatch({ type: ACTIONS.SET_DELETING, payload: true });
            dispatch({ type: ACTIONS.SET_DELETING_ID, payload: commentId });

            await axios.delete(
                `${API_URL}/courses/${courseId}/reviews/${commentId}`,
                { withCredentials: true }
            );
            dispatch({ type: ACTIONS.DELETE_COURSE_COMMENT, payload: commentId });
        } catch (error) {
            dispatch({ type: ACTIONS.SET_ERROR, payload: error });
        } finally {
            dispatch({ type: ACTIONS.SET_DELETING, payload: false });
            dispatch({ type: ACTIONS.SET_DELETING_ID, payload: null });
        }
    };

    const updateCourseComment = async (courseId, commentId, comment) => {
        try {
            dispatch({ type: ACTIONS.SET_UPDATING, payload: true });
            const res = await axios.patch(
                `${API_URL}/courses/${courseId}/reviews/${commentId}`,
                { comment },
                { withCredentials: true }
            );
            dispatch({
                type: ACTIONS.UPDATE_COURSE_COMMENT,
                payload: res.data.data.updatedDoc,
            });
        } catch (error) {
            dispatch({ type: ACTIONS.SET_ERROR, payload: error });
        } finally {
            dispatch({ type: ACTIONS.SET_UPDATING, payload: false });
        }
    };

    // Lesson comments
    const getLessonComments = async (lessonId) => {
        try {
            dispatch({ type: ACTIONS.SET_LOADING, payload: true });
            const res = await axios.get(`${API_URL}/lessons/${lessonId}/comments`, {
                withCredentials: true,
            });
            dispatch({
                type: ACTIONS.GET_ALL_LESSON_COMMENTS,
                payload: res.data.data.docs,
            });
        } catch (error) {
            dispatch({ type: ACTIONS.SET_ERROR, payload: error });
        } finally {
            dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        }
    };

    const postLessonComment = async (lessonId, content) => {
        try {
            dispatch({ type: ACTIONS.SET_POSTING, payload: true });
            const res = await axios.post(
                `${API_URL}/lessons/${lessonId}/comments`,
                { content },
                { withCredentials: true }
            );
            dispatch({
                type: ACTIONS.POST_LESSON_COMMENT,
                payload: res.data.data.newDoc,
            });
        } catch (error) {
            dispatch({ type: ACTIONS.SET_ERROR, payload: error });
        } finally {
            dispatch({ type: ACTIONS.SET_POSTING, payload: false });
        }
    };

    const deleteLessonComment = async (lessonId, commentId) => {
        try {
            dispatch({ type: ACTIONS.SET_DELETING, payload: true });
            dispatch({ type: ACTIONS.SET_DELETING_ID, payload: commentId });

            await axios.delete(
                `${API_URL}/lessons/${lessonId}/comments/${commentId}`,
                { withCredentials: true }
            );
            dispatch({ type: ACTIONS.DELETE_LESSON_COMMENT, payload: commentId });
        } catch (error) {
            dispatch({ type: ACTIONS.SET_ERROR, payload: error });
        } finally {
            dispatch({ type: ACTIONS.SET_DELETING, payload: false });
            dispatch({ type: ACTIONS.SET_DELETING_ID, payload: null });
        }
    };

    const updateLessonComment = async (lessonId, commentId, content) => {
        try {
            dispatch({ type: ACTIONS.SET_UPDATING, payload: true });
            const res = await axios.patch(
                `${API_URL}/lessons/${lessonId}/comments/${commentId}`,
                { content },
                { withCredentials: true }
            );
            dispatch({
                type: ACTIONS.UPDATE_LESSON_COMMENT,
                payload: res.data.data.updatedDoc,
            });
        } catch (error) {
            dispatch({ type: ACTIONS.SET_ERROR, payload: error });
        } finally {
            dispatch({ type: ACTIONS.SET_UPDATING, payload: false });
        }
    };

    return (
        <CommentsContext.Provider
            value={{
                ...state,
                getCourseComments,
                postCourseComment,
                deleteCourseComment,
                updateCourseComment,
                getLessonComments,
                postLessonComment,
                deleteLessonComment,
                updateLessonComment,
            }}
        >
            {children}
        </CommentsContext.Provider>
    );
};

// Hook to use in any component
export const useComments = () => useContext(CommentsContext);
