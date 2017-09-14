import * as React from 'react';
import { Field, reduxForm, Form, InjectedFormProps, Fields } from 'redux-form';
import { Field as ModelField } from '../Models';


interface AdditionalProps {
    onCancel:()=>void;
    fields:ModelField[];
}

type FormProps = InjectedFormProps & AdditionalProps;

const dynamicForm = (props:FormProps) => 
        <Form className='form-wrapper' onSubmit={props.handleSubmit}>
            {
                props.fields.map((field)=>(
                    [
                        <label htmlFor={field.mapping_field}>{field.caption}</label>,
                        <Field name={field.mapping_field} component='input' type={field.type} />
                    ]
                ))
            }
            <div className='submit'>
                <button type='submit' className='btn' disabled={props.submitting}>Save</button>
                <button className='btn' onClick={props.reset} disabled={props.pristine || props.submitting}>Reset</button>
                <button className='btn' onClick={(e)=>{
                    e.preventDefault(); 
                    props.onCancel();
                }} >Cancel</button>
            </div>
        </Form>

export default reduxForm<{},AdditionalProps>({})(dynamicForm);