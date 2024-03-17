import { ADD_TO_BORROW, REMOVE_FROM_BORROW, CLEAR_BORROW, UPDATE_BORROW_ITEM_QUANTITY } from '../Constants';

const borrowItems = (state = [], action) => {
    switch (action.type) {
        case ADD_TO_BORROW:
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

        case REMOVE_FROM_BORROW:
            return state.filter(borrowItem => borrowItem !== action.payload);

        case CLEAR_BORROW:
            return [];

        case UPDATE_BORROW_ITEM_QUANTITY:
            return state.map(borrowItem => {
                if (borrowItem.id === action.payload.itemId) {
                    return {
                        ...borrowItem,
                        quantity: action.payload.quantity
                    };
                }
                return borrowItem;
            });

        default:
            return state;
    }
};

export default borrowItems;