import * as React from 'react';
import { Field, Form, FormProps, GenericField, InjectedFormProps, reduxForm, WrappedFieldProps } from 'redux-form';
import { Field as ModelField } from '../Models';

interface AdditionalProps {
    onCancel?: () => void;
    fields: ModelField[];
}

type DynamicFormProps = InjectedFormProps<{}, AdditionalProps>
    & AdditionalProps;

interface CustomFieldProps {
    label?: string;
    type?: string;
}
type DynamicFieldProps = CustomFieldProps & WrappedFieldProps;

const renderField: React.SFC<DynamicFieldProps> = (props) => {
    const { input, label, meta, type } = props;
    let validateStyle = '';
    if (meta.touched && !meta.pristine) {
        if (meta.valid) { validateStyle = 'has-success'; }
        if (meta.error) { validateStyle = 'has-error'; }
        if (meta.warning) { validateStyle = 'has-warning'; }
    }

    const renderHelp = () => {
        if (meta.touched && !meta.pristine) {
            if (meta.error) {
                return (
                    <span className="help-block">
                        {meta.error}
                    </span>
                );
            }
            if (meta.warning) {
                return (
                    <span className="help-block">
                        {meta.warning}
                    </span>
                );
            }
        }
        return null;
    };
    return (
        <div className={'form-group ' + validateStyle}>
            <input {...input} className={'form-control '} placeholder={label} type={type} />
            {renderHelp()}
        </div>
    );
};

const DynamicField = Field as new () => Field<CustomFieldProps>;

const dynamicForm: React.SFC<DynamicFormProps> = (props) => {
    const renderFieldItem = (field: ModelField): any => (
        [
            <label key={'lebel' + field.mapping_field} htmlFor={field.mapping_field}>{field.caption}</label>,
            <DynamicField key={'input' + field.mapping_field} name={field.mapping_field} component={renderField} type={field.type} />,
        ]
    );
    const renderCancel = () => {
        if (props.onCancel) {
            const cancel = (e: any) => {
                e.preventDefault();
                if (props.onCancel) { props.onCancel(); }
            };
            return (
                <button className="btn" onClick={cancel}>Cancel</button>
            );
        }
    };
    return (
        <form className="form-wrapper" name={props.form} onSubmit={props.handleSubmit}>
            {props.fields.map(renderFieldItem)}
            <div className="submit">
                <button type="submit" className="btn" disabled={props.submitting}>Save</button>
                <button className="btn" onClick={props.reset} disabled={props.pristine || props.submitting}>Reset</button>
                {renderCancel()}
            </div>
        </form>
    );
};

export default reduxForm<{}, AdditionalProps>({})(dynamicForm);
