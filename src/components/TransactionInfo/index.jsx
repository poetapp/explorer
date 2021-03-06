import React from 'react';
import PropTypes from 'prop-types';

import { INDEX_PATH, BLOCK_INFORMATION_PATH } from '../../constants/RouterConstants';
import { TITLE_TEMPLATES } from '../../constants/GlobalConstants';

import FormatHelper from '../../helpers/FormatHelper';
import BreadCrumbs from '../../components/InformationBreadCrumbs';
import OperationsTable from './OperationsTable';
import Loader from '../Loader';

class TransactionsInfo extends React.Component {

	componentDidMount() {
		const { round, index } = this.props.match.params;

		this.props.setTitle(TITLE_TEMPLATES.TRANSACTION.replace(/index/, index).replace(/round/, round));
		this.props.getBlockInfo(round);
		this.props.getTransaction();
	}

	componentWillUnmount() {
		this.props.clearTransaction();
	}

	returnFunction() {
		if (!this.props.historyLength) {
			this.props.history.push(BLOCK_INFORMATION_PATH.replace(/:round/, this.props.match.params.round));
		} else {
			this.props.history.goBack();
		}
	}

	renderLoader(loading) {
		return loading ? <Loader /> : null;
	}

	render() {
		const { round, index } = this.props.match.params;

		const {
			operations, blockInformation, loading, history, location,
		} = this.props;

		const breadcrumbs = [
			{
				title: 'Blocks list',
				path: INDEX_PATH,
			},
			{
				title: `Block ${FormatHelper.formatAmount(round, 0)}`,
				path: BLOCK_INFORMATION_PATH.replace(/:round/, round),
			},
		];

		const timeBlockCreated = FormatHelper.timestampToBlockCreationTime(blockInformation.get('time'));

		return (
			<React.Fragment>
				<div className="table-container transaction inner-information-container transaction-information with-d-table">
					<BreadCrumbs
						breadcrumbs={breadcrumbs}
						title={`Transaction ${index} in Block ${FormatHelper.formatAmount(round, 0)}`}
						returnFunction={() => this.returnFunction()}
					/>
					{
						!loading ?
							<React.Fragment>
								<p className="transaction-time">{`Block has been created ${timeBlockCreated.date} ${timeBlockCreated.time}`}</p>
								<p className="transaction-title-operations">{FormatHelper.getFormaOperationsTitle(operations.size)}</p>
								<OperationsTable
									isTransaction
									operations={operations}
									history={history}
									location={location}
									loading={loading}
									changeUrl
									fee
								/>
							</React.Fragment> : this.renderLoader(loading)
					}
				</div>
			</React.Fragment>
		);
	}

}

TransactionsInfo.propTypes = {
	loading: PropTypes.bool,
	match: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired,
	operations: PropTypes.object,
	historyLength: PropTypes.number,
	getTransaction: PropTypes.func.isRequired,
	clearTransaction: PropTypes.func.isRequired,
	setTitle: PropTypes.func.isRequired,
	getBlockInfo: PropTypes.func.isRequired,
	blockInformation: PropTypes.object.isRequired,
};

TransactionsInfo.defaultProps = {
	operations: null,
	historyLength: 0,
	loading: false,
};

export default TransactionsInfo;
