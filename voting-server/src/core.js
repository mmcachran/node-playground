import { List } from 'immutable';

export function setEntries(state, entries) {
    return state.set('entries', List(entries));
}

export function setPair( state, pair ) {
    return state.set('pair', List(pair));
}

export function next(state) {
    const entries = state.get( 'entries' );
    const vote = new Map();
    setPair( vote, entries.take(2) );

    return state.merge({
        vote,
        entries: entries.skip(2)
    });
}