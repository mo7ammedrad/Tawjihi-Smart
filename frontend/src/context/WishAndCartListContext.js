//react
import { createContext, useReducer, useEffect } from "react";
//axios
import axios from "axios";
//URL
import { API_URL } from "../config";

//Actions
import { Actions } from "../constant/ACTIONS";

//initial state for the context
const initialState = {
    wishlist: [],
    cart: [],
};


//reducer function to handle actions
const reducer = (state, action) => {
    switch (action.type) {
        //wishlist actions
        // SetWishList: sets the wishlist
        // AddToWishList: adds an item to the wishlist if it doesn't already exist
        // RemoveFromWishList: removes an item from the wishlist by its ID
        case Actions.SetWishList:
            return {
                ...state,
                wishlist: Array.isArray(action.payload) ? action.payload : [],
            };

        case Actions.AddToWishList:
            if (state.wishlist.some((item) => item._id === action.payload._id)) return state;
            return { ...state, wishlist: [...state.wishlist, action.payload] };

        case Actions.RemoveFromWishList:
            return {
                ...state,
                wishlist: state.wishlist.filter((item) => item._id !== action.payload),
            };
        //=============================================================================================
        //cart actions
        // SetCartList: sets the cart list
        // AddToCartList: adds an item to the cart list if it doesn't already exist
        // RemoveFromCartList: removes an item from the cart list by its ID
        case Actions.SetCartList:
            return {
                ...state,
                cart: Array.isArray(action.payload) ? action.payload : [],
            };


        case Actions.AddToCartList:
            if (state.cart.some((item) => item._id === action.payload._id)) return state;
            return { ...state, cart: [...state.cart, action.payload] };

        case Actions.RemoveFromCartList:
            return {
                ...state,
                cart: state.cart.filter((item) => item._id !== action.payload),
            };

        default:
            return state;
    }
};

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    // Fetch wishlist and cart data from the server when the component mounts
    // This ensures that the wishlist and cart are populated with data from the server
    useEffect(() => {
        const fetchData = async () => {
            try {
                const wishlistRes = await axios.get(`${API_URL}/wishlist`, { withCredentials: true });
                const cartRes = await axios.get(`${API_URL}/cart`, { withCredentials: true });

                dispatch({
                    type: Actions.SetWishList,
                    payload: Array.isArray(wishlistRes.data.wishlist) ? wishlistRes.data.wishlist : [],
                });

                dispatch({
                    type: Actions.SetCartList,
                    payload: Array.isArray(cartRes.data.cart) ? cartRes.data.cart : [],
                });
            } catch (error) {
                console.error("Failed to fetch wishlist/cart:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <AppContext.Provider
            value={{
                state,
                dispatch,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
