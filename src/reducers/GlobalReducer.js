import { createModule } from 'redux-modules';
import { Map } from 'immutable';
import _ from 'lodash';
import TransformModules from '../utils/TransformModules';

import { DEFAULT_TITLE } from '../constants/GlobalConstants';

const DEFAULT_FIELDS = Map({
	title: DEFAULT_TITLE,
	historyLength: 0,
	connected: false,
	error: '',
});

export default createModule({
	name: 'global',
	initialState: _.cloneDeep(DEFAULT_FIELDS),
	transformations: {
		..._.cloneDeep(TransformModules(DEFAULT_FIELDS)),
		set: {
			reducer: (state, { payload }) => {
				state = state.set(payload.field, payload.value);

				return state;
			},
		},
	},
});
