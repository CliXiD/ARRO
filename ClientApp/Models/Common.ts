export enum AlertType {
    success = 'alert-success',
    warning = 'alert-warning',
    danger = 'alert-danger',
    info = 'alert-info',
}

export interface accessPropertyName {
    [prop: string]: any
}

export interface Alert {
    id: number,
    message?: React.ReactNode | string
    alertType: AlertType,
    autoClose: boolean,
    in: boolean
}

export interface Bearer {
    resource?: string,
    token_type?: string,
    access_token?: string,
    expires_in?: number
}

export interface ErrorMessage {
    error?: string,
    error_description?: string
}

export interface TableDefinition {
    columns: Field[];
    data: any[];
}

export interface Field {
    caption: string;
    mapping_field: string;
    class?: string;
    type?:string;
}