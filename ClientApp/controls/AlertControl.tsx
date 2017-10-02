import * as React from 'react';
import { Transition, TransitionGroup } from 'react-transition-group';
import { AccessPropertyName, Alert, AlertType } from '../Models';

import { ApplicationState, AppThunkAction } from '../store';
import { CloseAlertAction, RemoveAlertAction } from '../store/Alert';

export interface AlertProps {
    items: Alert[];
    closeAlert(id: number): AppThunkAction<CloseAlertAction>;
    removeAlert(id: number): AppThunkAction<RemoveAlertAction>;
}

export default class App extends React.Component<AlertProps, {}> {
    public render() {
        return (
            <TransitionGroup className="alerts">
                {this.props.items.map(this.renderAlert)}
            </TransitionGroup>
        );
    }
    private renderAlertItem = (item: Alert, status: string) => {
        const closeAction = (e: any) => { e.preventDefault(); this.props.removeAlert(item.id); };
        if (status === 'exited') {
            return null;
        }
        return (
            <div className={'alert ' + item.alertType + ' alert-dismissable ' + `fade fade-${status}`} role="alert">
                <a href="#" className="close" aria-label="close" onClick={closeAction}>&times;</a>
                {item.message}
            </div>
        );
    }
    private renderAlert = (item: Alert) => {
        if (item.autoClose) {
            setTimeout(() => this.props.removeAlert(item.id), 3000);
        }
        return (
            <Transition mountOnEnter={true} unmountOnExit={true} timeout={{ enter: 0, exit: 400 }} key={item.id} in={item.in}>
                {this.renderAlertItem.bind(this, item)}
            </Transition>
        );
    }
}
