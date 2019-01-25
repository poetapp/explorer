import { createModule } from 'redux-modules';
import { Map, List } from 'immutable';
import _ from 'lodash';
import TransformModules from '../utils/TransformModules';

const DEFAULT_FIELDS = new Map({
	loading: false,
	id: null,
	balances: new Map({}),
	history: new List([]),
});

export default createModule({
	name: 'account',
	initialState: _.cloneDeep(DEFAULT_FIELDS),
	transformations: {
		..._.cloneDeep(TransformModules(DEFAULT_FIELDS)),
	},
});