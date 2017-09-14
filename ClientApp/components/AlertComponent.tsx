import { connect } from 'react-redux';
import { AlertType, accessPropertyName } from '../Models';
import { ApplicationState } from '../store';
import * as AlertState from '../store/Alert';
import AlertControl from '../controls/AlertControl';

export default connect(
	(state: ApplicationState) => state.alert,
	{
		closeAlert: AlertState.actionCreators.closeAlert,
		removeAlert: AlertState.actionCreators.removeAlert
	}
)(AlertControl) as typeof AlertControl;