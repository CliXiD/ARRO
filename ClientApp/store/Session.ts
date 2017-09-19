import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import { Bearer, ErrorMessage } from '../Models';
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
    type: 'REQUIRED_TOKEN'
}

interface CancelRequiredTokenAction {
    type: 'CANCEL_REQUIRED_TOKEN'
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
export type KnownAction = RequestTokenAction | ReceiveTokenAction | RequiredTokenAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).
const client_secret = '901564A5-E7FE-42CB-B10D-61EF6A8F3654';
const client_id = 'mvc';
export const actionCreators = {
    login: (username: string, password: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let fetchTask = fetch(
            `connect/token`,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                body: `grant_type=password&username=${username}&password=${password}`
            }
        )
            .then(response => response.json() as Promise<Bearer | ErrorMessage>)
            .then(data => {
                if ((data as ErrorMessage).error) {
                    dispatch({ type: 'RECEIVE_TOKEN', token: undefined });
                }
                else {
                    dispatch({ type: 'RECEIVE_TOKEN', username: username, token: data as Bearer });
                    ///Todo Update SessionStorage
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
            .catch(err => {
                dispatch({ type: 'RECEIVE_TOKEN', token: undefined });
            });
        addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
        dispatch({ type: 'REQUEST_TOKEN', username: username });
    },
    logout: (): AppThunkAction<LogoutAction> => (dispatch, getState) => {
        let fetchTask = fetch(`connect/logout`)
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
            })
    },
    requiredToken: (): AppThunkAction<RequiredTokenAction> => (dispatch, getState) => {
        dispatch({ type: 'REQUIRED_TOKEN' });
    },
    cancelRequiredToken: (): AppThunkAction<CancelRequiredTokenAction> => (dispatch, getState) => {
        dispatch({ type: 'CANCEL_REQUIRED_TOKEN' });
    },
    loadToken: (): AppThunkAction<{}> => (dispatch, getState) => {
        let bearerFromStore: Bearer | undefined = {};
        let username: string | undefined = '';
        if (typeof window !== 'undefined') {
            if (window.sessionStorage) {
                username = window.sessionStorage.username;
                bearerFromStore = window.sessionStorage.jwt !== undefined ? JSON.parse(window.sessionStorage.jwt) : undefined;
            } else if (window.localStorage) {
                username = window.localStorage.username;
                bearerFromStore = window.localStorage.jwt !== undefined ? JSON.parse(window.localStorage.jwt) : undefined;
            }
        }
        if (bearerFromStore !== undefined && username !== undefined) {
            dispatch({ type: 'RECEIVE_TOKEN', username: username, token: bearerFromStore });
        } else if (typeof window !== 'undefined') {
            dispatch({ type: 'CANCEL_REQUIRED_TOKEN' });
        }
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

///Todo Update SessionStorage
let bearerFromStore: Bearer = {};
let username: string = '';
if (typeof window !== 'undefined') {
    if (window.sessionStorage) {
        username = window.sessionStorage.username;
        bearerFromStore = JSON.parse(window.sessionStorage.jwt || "{}");
    } else if (window.localStorage) {
        username = window.localStorage.username;
        bearerFromStore = JSON.parse(window.localStorage.jwt || "{}");
    }
}

const unloadedState: SessionState = { token: bearerFromStore.access_token ? bearerFromStore : undefined, isRequiredToken: false, username: username, isRequiredRefreshOnClient: true, isLoading: false };

export const reducer: Reducer<SessionState> = (state: SessionState, incomingAction: Action) => {
    const action = incomingAction as KnownAction | LogoutAction | CancelRequiredTokenAction;
    switch (action.type) {
        case 'REQUEST_TOKEN':
            return {
                username: action.username,
                token: state.token,
                isRequiredToken: state.isRequiredToken,
                isRequiredRefreshOnClient: false,
                isLoading: true
            };
        case 'RECEIVE_TOKEN':
            // Only accept the incoming data if it matches the most recent request. This ensures we correctly
            // handle out-of-order responses.
            return {
                token: action.token,
                username: action.username,
                isRequiredToken: false,
                isRequiredRefreshOnClient: false,
                isLoading: false
            };
        case 'LOGOUT':
            return {
                isRequiredToken: false,
                isRequiredRefreshOnClient: false,
                isLoading: false
            };
        case 'REQUIRED_TOKEN':
            return {
                isRequiredToken: true,
                isRequiredRefreshOnClient: false,
                isLoading: false
            };
        case 'CANCEL_REQUIRED_TOKEN':
            return {
                isRequiredToken: false,
                isRequiredRefreshOnClient: false,
                isLoading: false
            }
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};