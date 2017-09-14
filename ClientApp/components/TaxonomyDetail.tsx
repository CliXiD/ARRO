import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { ApplicationState, AppThunkAction } from '../store';
import * as TaxonomyState from '../store/Taxonomy';
import * as AlertState from '../store/Alert';
import { Taxonomy, AlertType, Field as ModelField } from '../Models';
import { DynamicTable } from '../controls/DynamicTable';
import { Field, reduxForm, Form, InjectedFormProps, Fields, FormInstance, ConfigProps } from 'redux-form';
import DynamicForm from '../controls/DynamicForm';

type AppProps = TaxonomyState.TaxonomyState
    & {
        taxonomyActions: typeof TaxonomyState.actionCreators,
        alertActions: typeof AlertState.actionCreators
    }
    & RouteComponentProps<{id:number|string}>;

const fields:ModelField[] = [
    {type:'text',caption:'Group',mapping_field:'group'},
    {type:'text',caption:'Name',mapping_field:'name'},
    {type:'text',caption:'Caption',mapping_field:'caption'}
] 

class App extends React.Component<AppProps, any> {
    componentWillMount() {
        if (this.props.match.params.id === 'new')
        {
            this.props.taxonomyActions.createEmptyTaxonomy();
        }else{
            this.props.taxonomyActions.getTaxonomy(Number(this.props.match.params.id));
        }
    }
    componentDidMount() {
        document.getElementsByTagName("input")[0].focus();
    }
    
    render() {
        return (
            <DynamicForm form='taxonomyForm' 
            enableReinitialize={true} 
            fields={fields} 
            initialValues={this.props.activeTaxonomy} 
            onCancel={this.props.history.goBack} 
            onSubmit={(values:Taxonomy, dispatch) => { this.props.taxonomyActions.submit(values, this.props.history.push.bind(this,'/taxonomy'))}} />
        );
    }
}

export default connect(
    (state: ApplicationState) => state.taxonomy,
    (dispatch:Dispatch<TaxonomyState.TaxonomyState> | Dispatch<AlertState.AlertState>) => {
        return {
            taxonomyActions: bindActionCreators(TaxonomyState.actionCreators, dispatch),
            alertActions: bindActionCreators(AlertState.actionCreators, dispatch)
        }
    } 
)(App) as typeof App;