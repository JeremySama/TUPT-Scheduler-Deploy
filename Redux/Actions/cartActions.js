import {
    ADD_TO_CART,
    REMOVE_FROM_CART,
    CLEAR_CART,
    UPDATE_CART_ITEM_QUANTITY // Added action type constant
} from '../Constants';

export const addToCart = (payload) => {
    console.log("payload",payload)
    return {
        type: ADD_TO_CART,
        payload
    }
}

export const removeFromCart = (payload) => {
    return {
        type: REMOVE_FROM_CART,
        payload
    }
}

export const clearCart = () => {
    return {
        type: CLEAR_CART
    }
}

// Added action creator to update quantity
export const updateCartItemQuantity = (itemId, quantity) => {
    return {
        type: UPDATE_CART_ITEM_QUANTITY,
        payload: { itemId, quantity }
    }
}
