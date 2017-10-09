import * as React from 'react';
import { connect } from 'react-redux';
import { Link, NavLink, RouteComponentProps } from 'react-router-dom';
import { bindActionCreators, Dispatch } from 'redux';
import { AlertType } from '../Models';
import { ApplicationState } from '../store';
import * as AlertState from '../store/Alert';
import * as SessionState from '../store/Session';

export function requireAuthentication(Component: React.ComponentClass) {
    type SessionProps = SessionState.SessionState
        & {
            sessionActions: typeof SessionState.actionCreators,
            alertActions: typeof AlertState.actionCreators,
        }
        & RouteComponentProps<{}>;

    class AuthenticatedComponent extends React.Component<SessionProps> {

        public componentWillMount() {
            this.checkAuth(this.props);
        }

        public componentWillReceiveProps(nextProps: SessionProps) {
            this.checkAuth(nextProps);
        }

        public checkAuth(props: SessionProps) {
            if (props.isRequiredRefreshOnClient === true) { return; }
            if (props.token === undefined) {
                this.props.alertActions.sendAlert('Please log-in', AlertType.info, true);
                this.props.sessionActions.cancelRequiredToken();
                this.props.sessionActions.requiredToken();
                this.props.history.replace(`/`);
            }
        }

        public render() {
            return (
                <Component {...this.props} />
            );
        }
    }
    return connect(
        (state: ApplicationState) => state.session,
        (dispatch: Dispatch<SessionState.SessionState> | Dispatch<AlertState.AlertState>) => {
            return {
                alertActions: bindActionCreators(AlertState.actionCreators, dispatch),
                sessionActions: bindActionCreators(SessionState.actionCreators, dispatch),
            };
        },
    )(AuthenticatedComponent);
}
