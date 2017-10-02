import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction, ApplicationState } from './';
import * as AlertState from './alert';
import { Taxonomy, Bearer, ErrorMessage, AlertType } from '../Models';

export interface TaxonomyState {
    items: Taxonomy[];
    activeTaxonomy?: Taxonomy,
    isLoading: boolean
}

interface GetTaxonomyItems {
    type: 'REQUEST_TAXONOMY_ITEMS';
    filter?: object
}

interface GetTaxonomy {
    type: 'REQUEST_TAXONOMY';
    id: number;
}

interface ReceiveTaxonomyItems {
    type: 'RECEIVE_TAXONOMY_ITEMS';
    items: Taxonomy[];
}

interface ReceiveTaxonomy {
    type: 'RECEIVE_TAXONOMY';
    activeTaxonomy: Taxonomy
}

interface SubmitTaxonomy {
    type: 'SUBMIT_TAXONOMY';
    activeTaxonomy: Taxonomy
}

export type KnownAction = GetTaxonomy | ReceiveTaxonomy | GetTaxonomyItems | ReceiveTaxonomyItems | SubmitTaxonomy;
export const actionCreators = {
    getAllTaxonomy: (filter?: object): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let token = getState().session.token;
        if (token !== undefined) {
            let fetchTask = fetch(`api/taxonomy`, {
                headers: {
                    "Authorization": `Bearer ${token.access_token}`
                },
            })
                .then(response => response.json() as Promise<Taxonomy[]>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_TAXONOMY_ITEMS', items: data });
                })
                .catch(err => {
                    dispatch({ type: 'RECEIVE_TAXONOMY_ITEMS', items: [] });
                });
            addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
            dispatch({ type: 'REQUEST_TAXONOMY_ITEMS', filter: filter });
        }
    },
    createEmptyTaxonomy: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({
            type: 'RECEIVE_TAXONOMY', activeTaxonomy: {
                caption: '',
                group: '',
                name: ''
            }
        });
    },
    getTaxonomy: (id: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let token = getState().session.token;
        if (token !== undefined) {
            let fetchTask = fetch(`api/taxonomy/${id}`, {
                headers: {
                    "Authorization": `Bearer ${token.access_token}`
                },
            })
                .then(response => response.json() as Promise<Taxonomy>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_TAXONOMY', activeTaxonomy: data });
                })
                .catch(err => {
                    console.log(err);
                });
            addTask(fetchTask);
            dispatch({ type: 'REQUEST_TAXONOMY', id: id });
        }
    },
    delete: (id: number, cb: () => void): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let token = getState().session.token;
        if (token !== undefined) {
            let fetchTask = fetch(`api/taxonomy/${id}`, {
                headers: {
                    "Authorization": `Bearer ${token.access_token}`
                },
                method: 'DELETE'
            })
                .then(() => cb())
                .catch(err => {
                    console.log(err);
                });
            addTask(fetchTask);
            dispatch({ type: 'REQUEST_TAXONOMY', id: id });
        }
    },
    submit: (value: Taxonomy, cb: () => void): AppThunkAction<KnownAction> => (dispatch, getState) => {
        //console.log(value);
        let token = getState().session.token;
        if (token !== undefined) {
            let fetchTask: Promise<any>;
            if (value.id === undefined) {
                fetchTask = fetch(`api/taxonomy`, {
                    headers: {
                        "Authorization": `Bearer ${token.access_token}`,
                        'Content-type': 'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify(value)
                })
                    .then(response => response.json() as Promise<Taxonomy>)
                    .then(data => {
                        dispatch({ type: 'RECEIVE_TAXONOMY', activeTaxonomy: data });
                        cb();
                    })
                    .catch(err => {
                        console.log(err);
                    });
            } else {
                fetchTask = fetch(`api/taxonomy/${value.id}`, {
                    headers: {
                        "Authorization": `Bearer ${token.access_token}`,
                        'Content-type': 'application/json'
                    },
                    method: 'PUT',
                    body: JSON.stringify(value)
                })
                    .then(() => {
                        cb();
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
            addTask(fetchTask);
            dispatch({ type: 'SUBMIT_TAXONOMY', activeTaxonomy: value });
        }
    }
}

const unloadedState: TaxonomyState = { items: [], activeTaxonomy: undefined, isLoading: false };
export const reducer: Reducer<TaxonomyState> = (state: TaxonomyState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_TAXONOMY_ITEMS':
            return {
                items: state.items,
                activeTaxonomy: state.activeTaxonomy,
                isLoading: true
            };
        case 'RECEIVE_TAXONOMY_ITEMS':
            return {
                items: action.items,
                activeTaxonomy: state.activeTaxonomy,
                isLoading: false
            };
        case 'REQUEST_TAXONOMY':
            return {
                items: state.items,
                isLoading: true
            }
        case 'RECEIVE_TAXONOMY':
            return {
                items: state.items,
                activeTaxonomy: action.activeTaxonomy,
                isLoading: false
            }
        case 'SUBMIT_TAXONOMY':
            return {
                items: state.items,
                activeTaxonomy: action.activeTaxonomy,
                isLoading: true
            }
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }
    return state || unloadedState;
};