
export const BOOK_SELECT = 'BOOK_SELECT';


export const selectBook = (payload) => {
    return {
        type: 'BOOK_SELECT',
        payload
    }
}