import * as React from 'react';
import { AlertType, accessPropertyName,Alert } from '../Models';
import Transition from 'react-transition-group/Transition';
import * as TransitionGroup from 'react-transition-group/TransitionGroup';
import { AppThunkAction, ApplicationState } from '../store';
import { CloseAlertAction, RemoveAlertAction } from '../store/Alert';

export interface AlertProps {
    closeAlert(id:number):AppThunkAction<CloseAlertAction>;
    removeAlert(id:number):AppThunkAction<RemoveAlertAction>;
    items:Alert[];
}

export default class App extends React.Component<AlertProps, {}> {
    render() {
        return (
            <TransitionGroup>
                {
                    this.props.items.map((item) => {
                        if (item.autoClose){
                            setTimeout(()=>this.props.removeAlert(item.id), 3000);
                        }
                        return (
                            <Transition mountOnEnter={true} unmountOnExit={true} timeout={{enter: 0,exit: 400}} key={item.id} in={item.in}>
                                {(status:string)=>{
                                    if (status === 'exited') {
                                        return null
                                    }
                                    return (
                                    <div className={'alert ' + item.alertType + ' alert-dismissable ' + `fade fade-${status}`} role="alert">
                                        <a href="#" className="close" aria-label="close" onClick={(e) => { e.preventDefault(); this.props.removeAlert(item.id);}}>&times;</a>
                                        {item.message}
                                    </div>
                                    );
                                }}
                            </Transition>
                        );
                    })
                }
            </TransitionGroup>
        );
    }
}