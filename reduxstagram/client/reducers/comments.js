/**
 * A reducer takes in two things:
 *
 * 1. The action (info about what happened)
 * 2. Copy of the current state
 */
function postComments( state = [], action ) {
    console.log(action );
    switch( action.type ) {

        case 'ADD_COMMENT':
            return [...state, {
                user: action.author,
                text: action.comment
            }];
            break;

        case 'REMOVE_COMMENT':
            return [
                // From the start to the one we want to delete.
                ...state.slice( 0, action.i ),

                // After the deleted one, to the end.
                ...state.slice( action.i + 1 )
            ];
            break;

        default:
            return state;
    }
}

 function comments(state = [], action) {
    if ( 'undefined' !== typeof action.postId ) {
        return {
            // Take the current state.
            ...state,

            // Overwrite this post with a new one.
            [action.postId]: postComments( state[action.postId], action )
        }
    }
    return state;
}
export default comments;
