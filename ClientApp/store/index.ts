import * as Session from './Session';
import * as Taxonomy from './Taxonomy';
import * as Alert from './Alert';
import { reducer as formReducer } from 'redux-form';

// The top-level state object
export interface ApplicationState {
    session: Session.SessionState;
    taxonomy: Taxonomy.TaxonomyState;
    alert: Alert.AlertState;
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
    session: Session.reducer,
    taxonomy: Taxonomy.reducer,
    alert: Alert.reducer,
    form: formReducer
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}