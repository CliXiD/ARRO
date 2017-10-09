import * as React from 'react';
import { AccessPropertyName, Alert, AlertType } from '../Models';

import { ApplicationState, AppThunkAction } from '../store';
import { CloseAlertAction } from '../store/Alert';

export interface AlertProps {
    items: Alert[];
    closeAlert(id: number): AppThunkAction<CloseAlertAction>;
}

export default class App extends React.Component<AlertProps, {}> {
    public render() {
        return (
            <div className="alerts">
                {this.props.items.map(this.renderAlert)}
            </div>
        );
    }

    private renderAlert = (item: Alert) => {
        const closeAction = (e: any) => { e.preventDefault(); this.props.closeAlert(item.id); };
        return (
            <div key={item.id} className={'alert ' + item.alertType + ' alert-dismissable ' + `fade fade-${item.state}`} role="alert">
                <a href="#" className="close" aria-label="close" onClick={closeAction}>&times;</a>
                {item.message}
            </div>
        );
    }
}
