import { connect } from 'react-redux';
import AlertControl from '../controls/AlertControl';
import { AccessPropertyName, AlertType } from '../Models';
import { ApplicationState } from '../store';
import * as AlertState from '../store/Alert';

export default connect(
    (state: ApplicationState) => state.alert,
    {
        closeAlert: AlertState.actionCreators.closeAlert,
    },
)(AlertControl);
