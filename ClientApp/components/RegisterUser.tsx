import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { bindActionCreators, Dispatch } from 'redux';

import DynamicForm from '../controls/DynamicForm';
import { AlertType, Field as ModelField, RegisterUser } from '../Models';

import { ApplicationState, AppThunkAction } from '../store';
import * as AccountState from '../store/Account';
import * as AlertState from '../store/Alert';
import * as SessionState from '../store/Session';

const fields: ModelField[] = [
    { type: 'text', caption: 'Username', mapping_field: 'userName' },
    { type: 'text', caption: 'Email', mapping_field: 'email' },
    { type: 'password', caption: 'Password', mapping_field: 'password' },
    { type: 'password', caption: 'Confirm password', mapping_field: 'confirmPassword' },
    { type: 'text', caption: 'Firstname', mapping_field: 'firstName' },
    { type: 'text', caption: 'Lastname', mapping_field: 'lastName' },
];

const validate = (values: Partial<RegisterUser>) => {
    const errors: Partial<RegisterUser> = {};
    if (!values.userName) {
        errors.userName = 'Required';
    } else if (values.userName.length > 15) {
        errors.userName = 'Must be 15 characters or less';
    }
    if (!values.email) {
        errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
    }
    if (!values.password) {
        errors.password = 'Required';
    }
    if (values.password !== values.confirmPassword) {
        errors.confirmPassword = 'The password and its confirm are not the same';
    }

    if (!values.firstName) {
        errors.firstName = 'Required';
    }
    if (!values.lastName) {
        errors.lastName = 'Required';
    }
    return errors;
};

type AppProps = AccountState.AccountState
& {
    accountActions: typeof AccountState.actionCreators,
    alertActions: typeof AlertState.actionCreators,
    sessionActions: typeof SessionState.actionCreators,
}
& RouteComponentProps<{}>;

class App extends React.Component<AppProps, {}> {
    public render() {
        return (
            <div>
                <h1>Register user</h1>
                <DynamicForm
                    enableReinitialize={true}
                    fields={fields}
                    form="userInfo"
                    initialValues={{}}
                    validate={validate}
                    onSubmit={this.onSubmit}
                />
            </div>
        );
    }
    private onSubmit = (values: RegisterUser, dispatch: any) => {
        this.props.accountActions.register(values, () => {
            this.props.history.push('/');
            this.props.alertActions.sendAlert('Your account is created.', AlertType.success, true);
            this.props.sessionActions.requiredToken();
        });
    }
}

export default connect(
    (state: ApplicationState) => state.account,
    (dispatch: Dispatch<AccountState.AccountState> | Dispatch<AlertState.AlertState> | Dispatch<SessionState.SessionState>) => {
        return {
            accountActions: bindActionCreators(AccountState.actionCreators, dispatch),
            alertActions: bindActionCreators(AlertState.actionCreators, dispatch),
            sessionActions: bindActionCreators(SessionState.actionCreators, dispatch),
        };
    },
)(App);
