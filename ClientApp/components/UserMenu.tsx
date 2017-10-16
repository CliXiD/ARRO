import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { ApplicationState } from '../store';
import * as SessionState from '../store/Session';

type UserMenuProps = SessionState.SessionState
    & typeof SessionState.actionCreators;

class UserMenu extends React.Component<UserMenuProps, any> {
    private userName: HTMLInputElement | null;
    private password: HTMLInputElement | null;
    private userMenu: HTMLAnchorElement | null | undefined;

    public componentDidUpdate() {
        if (this.props.isRequiredToken === true) {
            this.openUserMenu();
        }
    }

    public componentDidMount() {
        if (this.props.isRequiredRefreshOnClient) {
            this.props.loadToken();
        }
    }

    public openUserMenu() {
        if (this.userMenu !== null && this.userMenu !== undefined) {
            this.userMenu.click();
        }
    }

    public render() {
        return (
            <ul className="nav navbar-nav navbar-right">
                {this.renderChild()}
            </ul>
        );
    }

    private renderProfile() {
        const logout = () => {
            this.props.logout();
        };
        return (
            <li>
                <a href="#" data-toggle="dropdown"><i className="glyphicon glyphicon-user" />{' ' + (this.props.username || '')}</a>
                <ul className="dropdown-menu fade">
                    <li>
                        <div className="login-container">
                            <div className="row">
                                <div className="col-md-12">
                                    <p>Profile</p>
                                    <div className="form" role="form">
                                        <div className="form-group">
                                            <button
                                                className="btn btn-primary btn-block"
                                                onClick={logout}
                                            >
                                                Log-out
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </li>
        );
    }

    private renderLogin() {
        const login = (e: any) => {
            e.preventDefault();
            if (this.userName && this.password) {
                this.props.login(this.userName.value, this.password.value);
            }
        };
        const autoFocus = (event: any) => {
            if (this.userName) { this.userName.focus(); }
        };
        return (
            <li className="dropdown">
                <a
                    ref={(element) => { this.userMenu = element; }}
                    href="#"
                    className="dropdown-toggle"
                    onClick={autoFocus}
                    data-toggle="dropdown"
                >
                    <b>Login</b> <span className="caret"/>
                </a>
                <ul id="login-dp" className="dropdown-menu fade">
                    <li>
                        <div className="login-container">
                            <div className="row">
                                <div className="col-md-12">
                                    <form onSubmit={login} className="form" role="form" id="login-nav">
                                        <div className="form-group">
                                            <label className="sr-only" htmlFor="username">User</label>
                                            <input type="text" ref={(input) => { this.userName = input; }} className="form-control" id="username" placeholder="Username" required={true} />
                                        </div>
                                        <div className="form-group">
                                            <label className="sr-only" htmlFor="exampleInputPassword2">Password</label>
                                            <input type="password" ref={(input) => { this.password = input; }} className="form-control" id="exampleInputPassword2" placeholder="Password" required={true} />
                                            <div className="help-block text-right"><a href="">Forget the password ?</a></div>
                                        </div>
                                        <div className="form-group">
                                            <button className="btn btn-primary btn-block" type="submit" >Sign in</button>
                                        </div>
                                    </form>
                                </div>
                                <div className="bottom text-center">
                                    New here ? <Link to={'/signup'}><b>Sign-Up</b></Link>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </li>
        );
    }

    private renderChild() {
        if (this.props.token !== undefined) {
            return this.renderProfile();
        } else {
            return this.renderLogin();
        }
    }
}

export default connect(
    (state: ApplicationState) => state.session, // Selects which state properties are merged into the component's props
    SessionState.actionCreators,                // Selects which action creators are merged into the component's props
)(UserMenu);
