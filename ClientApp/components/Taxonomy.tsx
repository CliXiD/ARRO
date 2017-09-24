import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { ApplicationState, AppThunkAction } from '../store';
import * as TaxonomyState from '../store/Taxonomy';
import * as SessionState from '../store/Session';
import * as AlertState from '../store/Alert';
import { Taxonomy, AlertType, TableDefinition, Field } from '../Models';
import { DynamicTable } from '../controls/DynamicTable';

type AppProps = ApplicationState
    & {
        taxonomyActions: typeof TaxonomyState.actionCreators,
        sessionActions: typeof SessionState.actionCreators,
        alertActions: typeof AlertState.actionCreators
    }
    & RouteComponentProps<{}>;

const columns: Field[] = [
    { caption: "", mapping_field: "action", class:"actions actions-2" },
    { caption: "Group", mapping_field: "group" },
    { caption: "Name", mapping_field: "name" },
    { caption: "Caption", mapping_field: "caption" },
];

class App extends React.Component<AppProps, any> {
    private AddButton: HTMLButtonElement | null;

    componentWillMount() {
        // This method runs when the component is first added to the page
        this.props.taxonomyActions.getAllTaxonomy();
    }

    componentDidMount() {
        if (this.AddButton !== null) this.AddButton.focus();
    }


    componentWillReceiveProps(nextProps: AppProps) {
        if (this.props.session.token !== nextProps.session.token) {
            this.props.taxonomyActions.getAllTaxonomy();
        }
    }

    render() {

        let data = this.props.taxonomy.items.map(item => {
            return {
                ...item,
                action:
                <div>
                    <button className='btn btn-default btn-xs' onClick={() => this.props.history.push(`/taxonomy/${item.id}`)}><i className='glyphicon glyphicon-pencil' /></button>
                    {' '}
                    <button className='btn btn-danger btn-xs' onClick={() => {
                        if (item.id !== undefined) this.props.taxonomyActions.delete(item.id, () => {
                            this.props.alertActions.sendAlert('Taxonomy is Deleted', AlertType.success, true);
                            this.props.taxonomyActions.getAllTaxonomy();
                        })
                    }}><i className='glyphicon glyphicon-trash' /></button>
                </div>
            }
        });

        return (
            <div>
                <button className='btn btn-default' ref={element => { this.AddButton = element; }} onClick={() => this.props.history.push('/taxonomy/new')}><i className='glyphicon glyphicon-plus' /></button>
                <DynamicTable columns={columns} data={data} />
            </div>
        );
    }
}

export default connect(
    (state: ApplicationState) => { return state },
    (dispatch: Dispatch<TaxonomyState.TaxonomyState> | Dispatch<SessionState.SessionState> | Dispatch<AlertState.AlertState>) => {
        return {
            taxonomyActions: bindActionCreators(TaxonomyState.actionCreators, dispatch),
            sessionActions: bindActionCreators(SessionState.actionCreators, dispatch),
            alertActions: bindActionCreators(AlertState.actionCreators, dispatch)
        }
    }
)(App) as typeof App;