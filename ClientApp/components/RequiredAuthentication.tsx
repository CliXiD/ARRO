import * as React from 'react';
import { NavLink, Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as SessionState from '../store/Session';
import * as AlertState from '../store/Alert';
import { AlertType } from '../Models';
import { bindActionCreators, Dispatch } from 'redux';

export function requireAuthentication(Component:React.ComponentClass) {
    type SessionProps = SessionState.SessionState
    & {
        sessionActions: typeof SessionState.actionCreators,
        alertActions: typeof AlertState.actionCreators
    }
    & RouteComponentProps<{}>

    class AuthenticatedComponent extends React.Component<SessionProps> {

        componentWillMount() {
            this.checkAuth();
        }

        componentWillReceiveProps(nextProps:SessionProps) {
            this.checkAuth();
        }

        checkAuth() {
            // if (this.props.token === undefined) {
            //     let redirectAfterLogin = this.props.location.pathname;
            //     this.props.history.push(`/`);
            // }
            if (this.props.token === undefined){
                this.props.alertActions.sendAlert('Please log-in', AlertType.info, true);
                let redirectAfterLogin = this.props.location.pathname;
                this.props.history.replace(`/`);
                this.props.sessionActions.cancelRequiredToken();
                this.props.sessionActions.requiredToken();
            }
        }

        render() {
            return (
                <Component {...this.props}/>
            )
        }
    }
    return connect(
        (state: ApplicationState) => state.session, // Selects which state properties are merged into the component's props
        (dispatch: Dispatch<SessionState.SessionState> | Dispatch<AlertState.AlertState>) => {
            return {
                sessionActions: bindActionCreators(SessionState.actionCreators, dispatch),
                alertActions: bindActionCreators(AlertState.actionCreators, dispatch)
            }
        }                  // Selects which action creators are merged into the component's props
    )(AuthenticatedComponent) as typeof AuthenticatedComponent;
}