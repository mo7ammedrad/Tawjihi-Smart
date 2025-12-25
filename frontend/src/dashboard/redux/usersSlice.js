import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import { API_URL } from '../../config';
import { toast } from 'react-toastify';

//         _id: "",
//         name: "",
//         email: "",
//         role: "",
//         isActive: false,
//         createdAt: "",
//         updatedAt: ""

export const UsersSlice = createSlice({
    name: "users",
    initialState: {
        users: [],
        isLoading: false,
        deleteLoading: false,
        updateLoading: false,

    },
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload;
        },
        addUser: (state, action) => {
            state.users.push(action.payload);
        },

        updateUser: (state, action) => {
            const index = state.users.findIndex(user => user._id === action.payload._id);
            if (index !== -1) {
                state.users[index] = { ...state.users[index], ...action.payload };
            }
        },

        deleteUser: (state, action) => {
            state.users = state.users.filter(user => user._id !== action.payload);
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setDeleteLoading: (state, action) => {
            state.deleteLoading = action.payload;
        },
        setUpdateLoading: (state, action) => {
            state.updateLoading = action.payload;
        }

    }
})

export const getUsersFromApi = () => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const response = await axios.get(`${API_URL}/users`,
            { withCredentials: true });
        const data = response?.data?.data?.docs || [];
        dispatch(setUsers(data));
    } catch (error) {
        console.error("Error fetching users:", error);
        dispatch(setUsers([])); // optional: empty on failure
    } finally {
        dispatch(setLoading(false));
    }
};


export const deleteUserFromApi = (id) => async (dispatch) => {
    dispatch(setDeleteLoading(true));
    try {
        const response = await axios.delete(`${API_URL}/users/${id}`,
            { withCredentials: true });

        if (response) {
            dispatch(deleteUser(id));
            toast.success("تم حذف المستخدم بنجاح");
        } 

    } catch (error) {
        toast.error("حدث خطأ أثناء حذف المستخدم");
    } finally {
        dispatch(setDeleteLoading(false));
    }
};


export const updateUserFromApi = (data) => async (dispatch) => {
    dispatch(setUpdateLoading(true));
    try {
        const patchData = {
            name: data.name,
            email: data.email,  // Add other fields as necessary
        };
        const response = await axios.patch(`${API_URL}/users/${data._id}`, { patchData },
            { withCredentials: true });

        if (response) {
            dispatch(updateUser(data));
            toast.success("تم تحديث المستخدم بنجاح");
        }

    } catch (error) {
        toast.error("حدث خطأ أثناء تحديث المستخدم");
    } finally {
        dispatch(setUpdateLoading(false));
    }
};


export const addUserFromApi = (data) => async (dispatch) => {
    dispatch(setUpdateLoading(true));
    try {
        const response = await axios.post(`${API_URL}/users`, data,
            { withCredentials: true });

        if (response) {
            dispatch(addUser(data));
            toast.success("تمت اضافة المستخدم بنجاح");
        }

    } catch (error) {
        console.error("Error adding user:", error);
        toast.error("حدث خطأ أثناء إضافة المستخدم");
    } finally {
        dispatch(setUpdateLoading(false));
    }
};





export const { setUsers, addUser, updateUser, deleteUser, setLoading, setDeleteLoading, setUpdateLoading } = UsersSlice.actions;

export default UsersSlice.reducer;
