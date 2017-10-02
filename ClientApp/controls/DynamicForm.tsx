import * as React from 'react';
import { Field, Form, GenericField, InjectedFormProps, reduxForm, WrappedFieldProps } from 'redux-form';
import { Field as ModelField } from '../Models';

interface AdditionalProps {
    onCancel?: () => void;
    fields: ModelField[];
}

type FormProps = InjectedFormProps & AdditionalProps;
interface DynamicFieldProps {
    label?: string;
    type?: string;
}
type CustomFieldProps = WrappedFieldProps & DynamicFieldProps;

const renderField: React.StatelessComponent<CustomFieldProps> = ({
    input,
    label,
    type,
    meta,
}) => {
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

const DynamicField = Field as new () => GenericField<DynamicFieldProps>;

const dynamicForm = (props: FormProps) => {
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
        <Form className="form-wrapper" name={props.form} onSubmit={props.handleSubmit}>
            {props.fields.map(renderFieldItem)}
            <div className="submit">
                <button type="submit" className="btn" disabled={props.submitting}>Save</button>
                <button className="btn" onClick={props.reset} disabled={props.pristine || props.submitting}>Reset</button>
                {renderCancel()}
            </div>
        </Form>
    );
};

export default reduxForm<{}, AdditionalProps>({})(dynamicForm);
