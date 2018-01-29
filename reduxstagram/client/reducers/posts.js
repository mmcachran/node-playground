/**
 * A reducer takes in two things:
 *
 * 1. The action (info about what happened)
 * 2. Copy of the current state
 */
function posts( state = [], action ) {
    switch ( action.type ) {
        case 'INCREMENT_LIKES' :
            const i = action.index;
        
            // Return the updated state.
            return [
                ...state.slice( 0 , i ), // Before the post we are updating.
                {...state[i], likes: state[i].likes + 1 },
                ...state.slice(i + 1) // After the post we are updating.
            ];

        default:
            return state;
    }

    // Take a copy.
    const newState = {...state}

    // Increment likes.
    newState.likes++;

    return newState;
}
export default posts;
