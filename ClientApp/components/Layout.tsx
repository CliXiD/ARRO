import * as React from 'react';
import NavMenu from './NavMenu';

interface LayoutProps {
    alert: React.ComponentClass;
    usermenu: React.ComponentClass;
}

export class Layout extends React.Component<LayoutProps, {}> {
    public render() {
        return (
            <div className="main-container no-gap">
                <div>
                    <NavMenu>
                        <this.props.usermenu />
                    </NavMenu>
                </div>
                <div className="content-panel">
                    <this.props.alert />
                    {this.props.children}
                </div>
            </div>
        );
    }
}
