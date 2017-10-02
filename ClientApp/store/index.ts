import { reducer as formReducer } from 'redux-form';
import * as Alert from './Alert';
import * as Session from './Session';
import * as Taxonomy from './Taxonomy';

// the top-level state object
export interface ApplicationState {
    session: Session.SessionState;
    taxonomy: Taxonomy.TaxonomyState;
    alert: Alert.AlertState;
}

// whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers: any = {
    alert: Alert.reducer,
    form: formReducer,
    session: Session.reducer,
    taxonomy: Taxonomy.reducer,
};

// this type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export type AppThunkAction<TAction> = (dispatch: (action: TAction) => void, getState: () => ApplicationState) => void;
