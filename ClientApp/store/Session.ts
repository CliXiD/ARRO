import { addTask, fetch } from 'domain-task';
import { Action, ActionCreator, Reducer } from 'redux';
import { Bearer, ErrorMessage } from '../Models';
import { AppThunkAction } from './';
// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface SessionState {
    username?: string;
    token?: Bearer;
    isRequiredToken: boolean;
    isRequiredRefreshOnClient?: boolean;
    isLoading: boolean;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface RequestTokenAction {
    type: 'REQUEST_TOKEN';
    username: string;
}

interface ReceiveTokenAction {
    type: 'RECEIVE_TOKEN';
    username?: string;
    token?: Bearer;
}

interface LogoutAction {
    type: 'LOGOUT';
}

interface RequiredTokenAction {
    type: 'REQUIRED_TOKEN';
}

interface CancelRequiredTokenAction {
    type: 'CANCEL_REQUIRED_TOKEN';
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
export type KnownAction = RequestTokenAction | ReceiveTokenAction | RequiredTokenAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).
export const actionCreators = {
    cancelRequiredToken: (): AppThunkAction<CancelRequiredTokenAction> => (dispatch, getState) => {
        dispatch({ type: 'CANCEL_REQUIRED_TOKEN' });
    },
    loadToken: (): AppThunkAction<{}> => (dispatch, getState) => {
        let bearer: Bearer | undefined = {};
        let username: string | undefined = '';
        if (typeof window !== 'undefined') {
            if (window.sessionStorage) {
                username = window.sessionStorage.username;
                bearer = window.sessionStorage.jwt !== undefined ? JSON.parse(window.sessionStorage.jwt) : undefined;
            } else if (window.localStorage) {
                username = window.localStorage.username;
                bearer = window.localStorage.jwt !== undefined ? JSON.parse(window.localStorage.jwt) : undefined;
            }
        }
        if (bearerFromStore !== undefined && username !== undefined) {
            dispatch({ type: 'RECEIVE_TOKEN', username, token: bearer });
        } else if (typeof window !== 'undefined') {
            dispatch({ type: 'CANCEL_REQUIRED_TOKEN' });
        }
    },
    login: (username: string, password: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const fetchTask = fetch(
            `connect/token`,
            {
                body: `grant_type=password&username=${username}&password=${password}`,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                method: 'POST',
            },
        )
            .then((response: any) => response.json() as Promise<Bearer | ErrorMessage>)
            .then((data) => {
                if ((data as ErrorMessage).error) {
                    dispatch({ type: 'RECEIVE_TOKEN', token: undefined });
                } else {
                    dispatch({ type: 'RECEIVE_TOKEN', username, token: data as Bearer });
                    if (typeof window !== 'undefined') {
                        if (window.sessionStorage) {
                            window.sessionStorage.setItem('username', username);
                            window.sessionStorage.setItem('jwt', JSON.stringify(data));
                        } else if (window.localStorage) {
                            window.localStorage.setItem('username', username);
                            window.localStorage.setItem('jwt', JSON.stringify(data));
                        }
                    }
                }
            })
            .catch((err: any) => {
                dispatch({ type: 'RECEIVE_TOKEN', token: undefined });
            });
        addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
        dispatch({ type: 'REQUEST_TOKEN', username });
    },
    logout: (): AppThunkAction<LogoutAction> => (dispatch, getState) => {
        const fetchTask = fetch(`connect/logout`)
            .then(() => {
                if (typeof window !== 'undefined') {
                    if (window.sessionStorage) {
                        window.sessionStorage.removeItem('username');
                        window.sessionStorage.removeItem('jwt');
                    } else if (window.localStorage) {
                        window.localStorage.removeItem('username');
                        window.localStorage.removeItem('jwt');
                    }
                }
                dispatch({ type: 'LOGOUT' });
            });
    },
    requiredToken: (): AppThunkAction<RequiredTokenAction> => (dispatch, getState) => {
        dispatch({ type: 'REQUIRED_TOKEN' });
    },
};

let bearerFromStore: Bearer = {};
let usernameFromStore: string = '';
if (typeof window !== 'undefined') {
    if (window.sessionStorage) {
        usernameFromStore = window.sessionStorage.username;
        bearerFromStore = JSON.parse(window.sessionStorage.jwt || '{}');
    } else if (window.localStorage) {
        usernameFromStore = window.localStorage.username;
        bearerFromStore = JSON.parse(window.localStorage.jwt || '{}');
    }
}

const unloadedState: SessionState = { token: bearerFromStore.access_token ? bearerFromStore : undefined, isRequiredToken: false, username: usernameFromStore, isRequiredRefreshOnClient: true, isLoading: false };

export const reducer: Reducer<SessionState> = (state: SessionState, incomingAction: Action) => {
    const action = incomingAction as KnownAction | LogoutAction | CancelRequiredTokenAction;
    switch (action.type) {
        case 'REQUEST_TOKEN':
            return {
                isLoading: true,
                isRequiredRefreshOnClient: false,
                isRequiredToken: state.isRequiredToken,
                token: state.token,
                username: action.username,
            };
        case 'RECEIVE_TOKEN':
            // Only accept the incoming data if it matches the most recent request. This ensures we correctly
            // handle out-of-order responses.
            return {
                isLoading: false,
                isRequiredRefreshOnClient: false,
                isRequiredToken: false,
                token: action.token,
                username: action.username,
            };
        case 'LOGOUT':
            return {
                isLoading: false,
                isRequiredRefreshOnClient: false,
                isRequiredToken: false,
            };
        case 'REQUIRED_TOKEN':
            return {
                isLoading: false,
                isRequiredRefreshOnClient: false,
                isRequiredToken: true,
            };
        case 'CANCEL_REQUIRED_TOKEN':
            return {
                isLoading: false,
                isRequiredRefreshOnClient: false,
                isRequiredToken: false,
            };
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};
