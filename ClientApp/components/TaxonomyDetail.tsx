import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { bindActionCreators, Dispatch } from 'redux';
import { ConfigProps, Field, Fields, Form, FormInstance, InjectedFormProps, reduxForm } from 'redux-form';

import DynamicForm from '../controls/DynamicForm';
import { DynamicTable } from '../controls/DynamicTable';

import { AlertType, Field as ModelField, Taxonomy } from '../Models';

import { ApplicationState, AppThunkAction } from '../store';
import * as AlertState from '../store/Alert';
import * as TaxonomyState from '../store/Taxonomy';

type AppProps = TaxonomyState.TaxonomyState
    & {
        taxonomyActions: typeof TaxonomyState.actionCreators,
        alertActions: typeof AlertState.actionCreators,
    }
    & RouteComponentProps<{ id: number | string }>;

const fields: ModelField[] = [
    { type: 'text', caption: 'Group', mapping_field: 'group' },
    { type: 'text', caption: 'Name', mapping_field: 'name' },
    { type: 'text', caption: 'Caption', mapping_field: 'caption' },
];

class App extends React.Component<AppProps, any> {
    public componentWillMount() {
        if (this.props.match.params.id === 'new') {
            this.props.taxonomyActions.createEmptyTaxonomy();
        } else {
            this.props.taxonomyActions.getTaxonomy(Number(this.props.match.params.id));
        }
    }
    public componentDidMount() {
        if (document.forms.namedItem('taxonomyForm') !== null) {
            const form = document.forms.namedItem('taxonomyForm');
            const input = form.getElementsByTagName('input')[0];
            if (input !== undefined) { input.focus(); }
        }
    }
    public render() {
        return (
            <DynamicForm
                form="taxonomyForm"
                enableReinitialize={true}
                fields={fields}
                initialValues={this.props.activeTaxonomy}
                onCancel={this.props.history.goBack}
                onSubmit={this.onSubmit}
            />
        );
    }
    private onSubmit = (values: Taxonomy, dispatch: any) => {
        this.props.taxonomyActions.submit(values, () => {
            this.props.history.push('/taxonomy');
            this.props.alertActions.sendAlert('Taxonomy is saved', AlertType.success, true);
        });
    }
}

export default connect(
    (state: ApplicationState) => state.taxonomy,
    (dispatch: Dispatch<TaxonomyState.TaxonomyState> | Dispatch<AlertState.AlertState>) => {
        return {
            alertActions: bindActionCreators(AlertState.actionCreators, dispatch),
            taxonomyActions: bindActionCreators(TaxonomyState.actionCreators, dispatch),
        };
    },
)(App) as typeof App;
