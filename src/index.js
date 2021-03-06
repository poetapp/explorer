import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import echo from 'echojs-lib';

import Routes from './routes'; // Or wherever you keep your reducers

import './assets/loader';
import './assets/favicon.ico';
import GlobalActions from './actions/GlobalActions';

import history from './history';
import store from './store';

history.listen(() => {
	store.dispatch(GlobalActions.incrementHistoryLength());
});

echo.syncCacheWithStore(store);

ReactDOM.render(
	<Provider store={store}>
		<ConnectedRouter history={history}>
			<Routes />
		</ConnectedRouter>
	</Provider>,
	document.getElementById('root'),
);
