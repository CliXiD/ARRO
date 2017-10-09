export enum AlertType {
    success = 'alert-success',
    warning = 'alert-warning',
    danger = 'alert-danger',
    info = 'alert-info',
}

export enum AnimationState {
    entering = 'entering',
    entered = 'entered',
    exiting = 'exiting',
    exited = 'exited',
}

export interface AccessPropertyName {
    [prop: string]: any;
}

export interface Alert {
    id: number;
    message?: React.ReactNode | string;
    alertType: AlertType;
    state: AnimationState;
}

export interface Bearer {
    resource?: string;
    token_type?: string;
    access_token?: string;
    expires_in?: number;
}

export interface ErrorMessage {
    error?: string;
    error_description?: string;
}

export interface TableDefinition {
    columns: Field[];
    data: any[];
    tableClassName?: string;
}

export interface Field {
    caption: string;
    mapping_field: string;
    class?: string;
    type?: string;
}

export interface RegisterUser {
    userName: string;
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
}
