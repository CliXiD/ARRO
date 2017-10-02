import { addTask, fetch } from 'domain-task';
import { Action, ActionCreator, Reducer } from 'redux';
import { Alert, AlertType } from '../Models';
import { ApplicationState, AppThunkAction } from './';

export interface AlertState {
    items: Alert[];
}
let internalIndex = 0;
interface AlertAction {
    type: 'SEND_ALERT';
    id: number;
    message?: React.ReactNode | string;
    alertType: AlertType;
    autoClose: boolean;
}

export interface CloseAlertAction {
    type: 'CLOSE_ALERT';
    index: number;
}

export interface RemoveAlertAction {
    type: 'REMOVE_ALERT';
    index: number;
}

interface StartAnimateAction {
    type: 'START_ANIMATE';
    id: number;
}

type KnownAction = AlertAction | CloseAlertAction | RemoveAlertAction | StartAnimateAction;
export const actionCreators = {
    closeAlert: (index: number): AppThunkAction<CloseAlertAction> => (dispatch, getState) => {
        dispatch({ type: 'CLOSE_ALERT', index });
    },
    removeAlert: (index: number): AppThunkAction<RemoveAlertAction> => (dispatch, getState) => {
        dispatch({ type: 'REMOVE_ALERT', index });
    },
    sendAlert: (message: React.ReactNode | string, alertType: AlertType, autoClose: boolean): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'SEND_ALERT', id: internalIndex, message, alertType, autoClose });
        internalIndex++;
    },
};

const unloadedState: AlertState = { items: [] };
export const reducer: Reducer<AlertState> = (state: AlertState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'SEND_ALERT':
            return {
                items: [...state.items, {
                    alertType: action.alertType,
                    autoClose: action.autoClose,
                    id: action.id,
                    in: true,
                    message: action.message,
                }],
            };
        case 'START_ANIMATE':
            return {
                items: state.items.map((item) => { if (item.id === action.id) { item.in = true; } return item; }),
            };
        case 'CLOSE_ALERT':
            return {
                items: state.items.map((value) => { if (value.id === action.index) {value.in = false; } return value; }),
            };
        case 'REMOVE_ALERT':
            return {
                items: state.items.filter((value) => value.id !== action.index),
            };
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};
