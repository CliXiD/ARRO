import * as React from 'react';
import { connect, ProviderProps } from 'react-redux';
import { Link, NavLink, RouteComponentProps } from 'react-router-dom';

export default class NavMenu extends React.Component<{}, {}> {
    public render() {
        return (
            <div className="main-nav">
                <div className="navbar navbar-default">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"/>
                            <span className="icon-bar"/>
                            <span className="icon-bar"/>
                        </button>
                        <Link className="navbar-brand" to={'/'}>ARRO Web</Link>
                    </div>
                    <div className="navbar-collapse collapse">
                        <ul className="nav navbar-nav">
                            <li>
                                <NavLink exact={true} to={'/'} activeClassName="active">
                                    <span className="glyphicon glyphicon-home"/> Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink exact={true} to={'/taxonomy'} activeClassName="active">
                                    <span className="glyphicon glyphicon-info-sign"/> Taxonomy
                                </NavLink>
                            </li>
                        </ul>
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}
