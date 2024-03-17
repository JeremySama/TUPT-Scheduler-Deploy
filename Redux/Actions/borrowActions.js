import {
    ADD_TO_BORROW,
    REMOVE_FROM_BORROW,
    CLEAR_BORROW,
    UPDATE_BORROW_ITEM_QUANTITY // Added action type constant
} from '../Constants';

export const addToBorrow = (payload) => {
    console.log("payload",payload)
    return {
        type: ADD_TO_BORROW,
        payload
    }
}

export const removeFromBorrow = (payload) => {
    return {
        type: REMOVE_FROM_BORROW,
        payload
    }
}

export const clearBorrow = () => {
    return {
        type: CLEAR_BORROW
    }
}

// Added action creator to update quantity
export const updateBorrowItemQuantity = (itemId, quantity) => {
    return {
        type: UPDATE_BORROW_ITEM_QUANTITY,
        payload: { itemId, quantity }
    }
}
