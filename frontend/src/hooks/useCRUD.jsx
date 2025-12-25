//react
import { useContext } from "react";
//Actions
import { Actions } from "../constant/ACTIONS";
//Context
import { AppContext } from "../context/WishAndCartListContext";

export const useCRUD = () => {
  const { state, dispatch } = useContext(AppContext);

  // Ensure wishlist and cart are arrays
  const wishlist = Array.isArray(state.wishlist) ? state.wishlist : [];
  const cart = Array.isArray(state.cart) ? state.cart : [];

  // 🔁 Helper to sync localStorage user data
  const updateLocalStorageUser = (key, updatedArray) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      user[key] = updatedArray;
      localStorage.setItem("user", JSON.stringify(user));
    }
  };

  // 🧡 Wishlist Management
  const addToWishList = (item) => {
    if (!wishlist.some((wish) => wish._id === item._id)) {
      const updatedWishlist = [...wishlist, item];
      dispatch({ type: Actions.AddToWishList, payload: item });
      updateLocalStorageUser(
        "wishlist",
        updatedWishlist.map((i) => i._id)
      );
    }
  };

  const removeFromWishList = (itemId) => {
    const updatedWishlist = wishlist.filter((item) => item._id !== itemId);
    dispatch({ type: Actions.RemoveFromWishList, payload: itemId });
    updateLocalStorageUser(
      "wishlist",
      updatedWishlist.map((i) => i._id)
    );
  };

  const isInWishList = (itemId) => {
    return wishlist.some((item) => item._id === itemId);
  };

  // 🛒 Cart Management
  const addToCartList = (item) => {
    if (!cart.some((cartItem) => cartItem._id === item._id)) {
      const updatedCart = [...cart, item];
      dispatch({ type: Actions.AddToCartList, payload: item });
      updateLocalStorageUser(
        "cart",
        updatedCart.map((i) => i._id)
      );
    }
  };

  const removeFromCartList = (itemId) => {
    const updatedCart = cart.filter((item) => item._id !== itemId);
    dispatch({ type: Actions.RemoveFromCartList, payload: itemId });
    updateLocalStorageUser(
      "cart",
      updatedCart.map((i) => i._id)
    );
  };

  const isInCartList = (itemId) => {
    return cart.some((item) => item._id === itemId);
  };

  return {
    wishlist,
    cart,

    /** 🧡 Wish List Actions **/
    addToWishList,
    removeFromWishList,
    setWishList: (items) => {
      dispatch({ type: Actions.SetWishList, payload: items });
      updateLocalStorageUser(
        "wishlist",
        items.map((i) => i._id)
      );
    },
    isInWishList,

    /** 🛒 Cart Actions **/
    addToCartList,
    removeFromCartList,
    setCartList: (items) => {
      dispatch({ type: Actions.SetCartList, payload: items });
      updateLocalStorageUser(
        "cart",
        items.map((i) => i._id)
      );
    },
    isInCartList,
  };
};
