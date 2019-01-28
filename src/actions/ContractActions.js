import echo, { OPERATIONS_IDS, validators } from 'echojs-lib';
import { List, fromJS } from 'immutable';

import ContractReducer from '../reducers/ContractReducer';
import BaseActionsClass from './BaseActionsClass';

import browserHistory from '../history';
import { NOT_FOUND_PATH } from '../constants/RouterConstants';
import { formatOperation } from './BlockActions';

class ContractActions extends BaseActionsClass {

	/**
	 * Format account history
	 * @param {String} accountId
	 * @param {Array} history
	 * @returns {function}
	 */
	async formatContractHistory(transactions) {
		let history = transactions.map(async (t) => {
			let { op: operation, result } = t;
			if (OPERATIONS_IDS.CONTRACT_TRANSFER === t.op[0]) {
				const block = await echo.api.getBlock(t.block_num);
				operation = block.transactions[t.trx_in_block].operations[t.op_in_trx];
				result = block.transactions[t.trx_in_block].operation_results[t.op_in_trx];
			}

			return formatOperation(operation, null, t.block_num, t.trx_in_block, result);
		});
		history = await Promise.all(history);
		return history.reduce((arr, t) => ([...arr, [t]]), []);
	}

	/**
	 * Get contract info
	 * @param {string} id
	 * @returns {function}
	 */
	getContractInfo(id) {
		return async (dispatch) => {
			if (!validators.isContractId(id)) {
				browserHistory.replace(NOT_FOUND_PATH);
				return;
			}

			dispatch(this.setValue('loading', true));
			try {
				const contract = await echo.api.getContract(id);

				if (!contract) {
					browserHistory.replace(NOT_FOUND_PATH);
					return;
				}

				const balances = await echo.api.getContractBalances(id);

				await echo.api.getObjects(balances.map((b) => b.asset_id));

				dispatch(this.setMultipleValue({
					bytecode: contract[1].code,
					balances: fromJS(balances),
				}));

				let history = await echo.api.getContractHistory(id);
				history = await this.formatContractHistory(history);

				dispatch(this.setValue('history', new List(history)));
			} catch (e) {
				dispatch(this.setValue('error', e.message));
			} finally {
				dispatch(this.setValue('loading', false));
			}
		};
	}

}

export default new ContractActions(ContractReducer);
