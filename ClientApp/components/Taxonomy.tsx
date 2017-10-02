import * as React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';

import { bindActionCreators, Dispatch } from 'redux';
import { DynamicTable } from '../controls/DynamicTable';
import { AlertType, Field, TableDefinition, Taxonomy } from '../Models';
import { ApplicationState, AppThunkAction } from '../store';
import * as AlertState from '../store/Alert';
import * as SessionState from '../store/Session';
import * as TaxonomyState from '../store/Taxonomy';

type AppProps = ApplicationState
    & {
        taxonomyActions: typeof TaxonomyState.actionCreators,
        sessionActions: typeof SessionState.actionCreators,
        alertActions: typeof AlertState.actionCreators,
    }
    & RouteComponentProps<{}>;

const columns: Field[] = [
    { caption: '', mapping_field: 'action', class: 'actions actions-2' },
    { caption: 'Group', mapping_field: 'group' },
    { caption: 'Name', mapping_field: 'name' },
    { caption: 'Caption', mapping_field: 'caption' },
];

class App extends React.Component<AppProps, any> {
    private AddButton: HTMLButtonElement | null;
    public componentWillMount() {
        // This method runs when the component is first added to the page
        this.props.taxonomyActions.getAllTaxonomy();
    }
    public componentDidMount() {
        if (this.AddButton !== null) { this.AddButton.focus(); }
    }
    public componentWillReceiveProps(nextProps: AppProps) {
        if (this.props.session.token !== nextProps.session.token) {
            this.props.taxonomyActions.getAllTaxonomy();
        }
    }
    public render() {
        const newItem = () => this.props.history.push('/taxonomy/new');
        return (
            <div>
                <button className="btn btn-default" ref={(element) => { this.AddButton = element; }} onClick={newItem}><i className="glyphicon glyphicon-plus" /></button>
                <DynamicTable columns={columns} data={this.data()} />
            </div>
        );
    }

    private openEdit = (item: Taxonomy) => this.props.history.push(`/taxonomy/${item.id}`);
    private deleteItem = (item: Taxonomy) => {
        if (item.id !== undefined) {
            this.props.taxonomyActions.delete(item.id, () => {
                this.props.alertActions.sendAlert('Taxonomy is Deleted', AlertType.success, true);
                this.props.taxonomyActions.getAllTaxonomy();
            });
        }
    }
    private data = () => this.props.taxonomy.items.map((item) => {
        return {
            ...item,
            action:
            (
                <div>
                    <button className="btn btn-default btn-xs" onClick={this.openEdit.bind(this, item)}><i className="glyphicon glyphicon-pencil" /></button>
                    {' '}
                    <button className="btn btn-danger btn-xs" onClick={this.deleteItem.bind(this, item)}><i className="glyphicon glyphicon-trash" /></button>
                </div>
            ),
        };
    })
}

export default connect(
    (state: ApplicationState) => state,
    (dispatch: Dispatch<TaxonomyState.TaxonomyState> | Dispatch<SessionState.SessionState> | Dispatch<AlertState.AlertState>) => {
        return {
            alertActions: bindActionCreators(AlertState.actionCreators, dispatch),
            sessionActions: bindActionCreators(SessionState.actionCreators, dispatch),
            taxonomyActions: bindActionCreators(TaxonomyState.actionCreators, dispatch),
        };
    },
)(App) as typeof App;
