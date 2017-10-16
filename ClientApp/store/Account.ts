import { addTask, fetch } from 'domain-task';
import { Action, ActionCreator, Reducer } from 'redux';
import { Bearer, ErrorMessage, RegisterUser } from '../Models';
import { AppThunkAction } from './';

export interface AccountState {
    isLoading: boolean;
    error?: ErrorMessage;
}

interface RegisterAction {
    type: 'REGISTER';
}

interface RegisteredAction {
    type: 'REGISTERED';
    error?: ErrorMessage;
}

interface ChangePasswordAction {
    type: 'CHANGE_PASSWORD';
}

interface ChangedPasswordAction {
    type: 'CHANGED_PASSWORD';
    error?: ErrorMessage;
}

type KnownAction = RegisterAction | ChangePasswordAction | RegisteredAction | ChangedPasswordAction;
export const actionCreators = {
    register: (user: RegisterUser, cb?: () => void): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const fetchTask = fetch(`api/user/register`,
            {
                body: JSON.stringify(user),
                headers: {
                    'Content-type': 'application/json',
                },
                method: 'POST',
            })
            .then((response: any) => response.json() as Promise<Bearer | ErrorMessage>)
            .then((data) => {
                if ((data as ErrorMessage).error) {
                    dispatch({ type: 'REGISTERED', error: data as ErrorMessage });
                } else {
                    dispatch({ type: 'REGISTERED' });
                    if (cb) { cb(); }
                }
            })
            .catch((err: any) => {
                dispatch({ type: 'REGISTERED', error: err as ErrorMessage });
            });
        addTask(fetchTask);
        dispatch({ type: 'REGISTER' });
    },
};

const unloadedState: AccountState = { isLoading: false };
export const reducer: Reducer<AccountState> = (state: AccountState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REGISTER':
            return {
                isLoading: true,
            };
        case 'REGISTERED':
            return {
                error: action.error,
                isLoading: false,
            };
        case 'CHANGE_PASSWORD':
            return {
                isLoading: true,
            };
        case 'CHANGED_PASSWORD':
            return {
                error: action.error,
                isLoading: false,
            };
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }
    return state || unloadedState;
};
