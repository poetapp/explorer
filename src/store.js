import thunk from 'redux-thunk';
import { applyMiddleware, combineReducers, createStore, compose } from 'redux';
import { batchDispatchMiddleware } from 'redux-batched-actions';

import { routerMiddleware, routerReducer } from 'react-router-redux';

import { echoReducer } from 'echojs-lib';

import history from './history';
import reducers from './reducers';

// Build the middleware for intercepting and dispatching navigation actions
const middleware = routerMiddleware(history);

// Add the reducer to your store on the `router` key
// Also apply our middleware for navigating
const store = createStore(
	combineReducers({
		...reducers,
		router: routerReducer,
		echoCache: echoReducer(),
	}), {},
	compose(
		applyMiddleware(thunk),
		applyMiddleware(batchDispatchMiddleware),
		applyMiddleware(middleware),
		window.devToolsExtension ? window.devToolsExtension() : (f) => f,
	),
);

export default store;
