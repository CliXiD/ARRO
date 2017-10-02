import * as React from 'react';
import { Field, reduxForm, Form, InjectedFormProps, GenericField, WrappedFieldProps } from 'redux-form';
import { Field as ModelField } from '../Models';


interface AdditionalProps {
    onCancel?: () => void;
    fields: ModelField[];
}

type FormProps = InjectedFormProps & AdditionalProps;
interface DynamicFieldProps {
    label?: string,
    type?: string
}
type CustomFieldProps = WrappedFieldProps & DynamicFieldProps

const renderField: React.StatelessComponent<CustomFieldProps> = ({
    input,
    label,
    type,
    meta
}) => {
    let validateStyle = '';
    if (meta.touched && !meta.pristine) {
        if (meta.valid) validateStyle = 'has-success';
        if (meta.error) validateStyle = 'has-error';
        if (meta.warning) validateStyle = 'has-warning';
    }
    return (
        <div className={'form-group ' + validateStyle}>
            <input {...input} className={'form-control '} placeholder={label} type={type} />
            {meta.touched && !meta.pristine &&
                ((meta.error &&
                    <span className='help-block'>
                        {meta.error}
                    </span>) ||
                    (meta.warning &&
                        <span className='help-block'>
                            {meta.warning}
                        </span>))}
        </div>
    );
}


const DynamicField = Field as new () => GenericField<DynamicFieldProps>;

const dynamicForm = (props: FormProps) =>
    <Form className='form-wrapper' onSubmit={props.handleSubmit}>
        {
            props.fields.map((field) => (
                [
                    <label htmlFor={field.mapping_field}>{field.caption}</label>,
                    <DynamicField name={field.mapping_field} component={renderField} type={field.type} />
                ]
            ))
        }
        <div className='submit'>
            <button type='submit' className='btn' disabled={props.submitting}>Save</button>
            <button className='btn' onClick={props.reset} disabled={props.pristine || props.submitting}>Reset</button>
            {props.onCancel !== undefined &&
                <button className='btn' onClick={(e) => {
                    e.preventDefault();
                    if (props.onCancel !== undefined) props.onCancel();
                }} >Cancel</button>}
        </div>
    </Form>

export default reduxForm<{}, AdditionalProps>({})(dynamicForm);