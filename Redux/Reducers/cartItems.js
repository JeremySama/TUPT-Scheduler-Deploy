import { ADD_TO_CART, REMOVE_FROM_CART, CLEAR_CART, UPDATE_CART_ITEM_QUANTITY } from '../Constants';

const cartItems = (state = [], action) => {
    switch (action.type) {
        case ADD_TO_CART:
            const newItem = action.payload;
            const existingItemIndex = state.findIndex(item => item.id === newItem.id);

            if (existingItemIndex !== -1) {
                // If the item already exists in the cart, update its quantity
                return state.map((item, index) =>
                    index === existingItemIndex ? { ...item, quantity: item.quantity + newItem.quantity } : item
                );
            } else {
                // If the item is not in the cart, add it
                return [...state, newItem];
            }

        case REMOVE_FROM_CART:
            return state.filter(cartItem => cartItem !== action.payload);

        case CLEAR_CART:
            return [];

        case UPDATE_CART_ITEM_QUANTITY:
            return state.map(cartItem => {
                if (cartItem.id === action.payload.itemId) {
                    return {
                        ...cartItem,
                        quantity: action.payload.quantity
                    };
                }
                return cartItem;
            });

        default:
            return state;
    }
};

export default cartItems;