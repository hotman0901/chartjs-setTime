import {BOOK_SELECT} from '../actions/book';


const array = [9, 9, 9];

export default (state = array, action) => {
    switch (action.type) {
        case BOOK_SELECT:
            return [...state, ...action.payload];
        default:
            return state;
    }
};