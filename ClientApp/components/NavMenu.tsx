import * as React from 'react';
import { connect } from 'react-redux';
import { NavLink, Link, RouteComponentProps } from 'react-router-dom';
import { ProviderProps } from 'react-redux';

export default class NavMenu extends React.Component<{}, {}> {
    public render() {
        return <div className='main-nav'>
            <div className='navbar navbar-default'>
                <div className='navbar-header'>
                    <button type='button' className='navbar-toggle' data-toggle='collapse' data-target='.navbar-collapse'>
                        <span className='sr-only'>Toggle navigation</span>
                        <span className='icon-bar'></span>
                        <span className='icon-bar'></span>
                        <span className='icon-bar'></span>
                    </button>
                    <Link className='navbar-brand' to={'/'}>ARRO Web</Link>
                </div>
                {/* <div className='clearfix'></div> */}
                <div className='navbar-collapse collapse'>
                    <ul className='nav navbar-nav'>
                        <li>
                            <NavLink exact to={'/'} activeClassName='active'>
                                <span className='glyphicon glyphicon-home'></span> Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink exact to={'/taxonomy'} activeClassName='active'>
                                <span className='glyphicon glyphicon-info-sign'></span> Taxonomy
                            </NavLink>
                        </li>
                    </ul>
                    {this.props.children}
                </div>
            </div>
        </div>;
    }
}