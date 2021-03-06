import React from 'react';
import { Route, Switch } from 'react-router';

import App from './containers/App';
import RecentBlockSection from './containers/RecentBlockSection';
import Objects from './containers/Objects';
import Account from './containers/Account';
import Asset from './containers/Asset';
import Contract from './containers/Contract';
import NotFound from './containers/Error/NotFoundScreen';
import UploadABI from './containers/UploadABI';
import ManageContract from './containers/ManageContract';
import VerifyContract from './containers/VerifyContract';
import NodeMap from './containers/NodeMap';

import {
	INDEX_PATH,
	BLOCK_INFORMATION_PATH,
	TRANSACTION_INFORMATION_PATH,
	OBJECTS_PATH,
	ACCOUNTS_PATH,
	ASSET_PATH,
	NOT_FOUND_PATH,
	CONTRACT_PATH_DETAIL,
	UPLOAD_ABI_PATH,
	MANAGE_CONTRACT_PATH,
	VERIFY_CONTRACT_PATH,
	NODE_MAP,
} from './constants/RouterConstants';


export default class extends React.Component {

	render() {
		return (
			<App>
				<Switch>
					<Route exact path={INDEX_PATH} component={RecentBlockSection} />
					<Route exact path={BLOCK_INFORMATION_PATH} component={RecentBlockSection} />
					<Route exact path={TRANSACTION_INFORMATION_PATH} component={RecentBlockSection} />
					<Route exact path={OBJECTS_PATH} component={Objects} />
					<Route exact path={ACCOUNTS_PATH} component={Account} />
					<Route exact path={ASSET_PATH} component={Asset} />

					<Route exact path={UPLOAD_ABI_PATH} component={UploadABI} />
					<Route exact path={MANAGE_CONTRACT_PATH} component={ManageContract} />
					<Route exact path={VERIFY_CONTRACT_PATH} component={VerifyContract} />
					<Route path={CONTRACT_PATH_DETAIL} component={Contract} />
					<Route path={NODE_MAP} component={NodeMap} />

					<Route exact path={NOT_FOUND_PATH} component={NotFound} />
					<Route component={NotFound} />
				</Switch>
			</App>
		);
	}

}
