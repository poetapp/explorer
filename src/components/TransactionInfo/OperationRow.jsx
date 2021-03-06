import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Media from 'react-media';
import classnames from 'classnames';
import _ from 'lodash';
import Tooltip from 'rc-tooltip';
import { validators } from 'echojs-lib';

import ddIcon from '../../assets/images/icons/curret-sm.svg';

import Avatar from '../Avatar';
import OperationInfo from './OperationInfo';
import ObjectInfo from './ObjectInfo';

import URLHelper from '../../helpers/URLHelper';
import FormatHelper from '../../helpers/FormatHelper';

class OperationRow extends React.Component {

	getColSpan(matches) {
		return !matches ? 8 : 7;
	}

	renderTransactionLink(block, transactionNum, index) {
		return (
			<Link
				to={URLHelper.createOperationObjectsUrl(block, transactionNum + 1, index + 1)}
				onClick={(e) => e.stopPropagation()}
				className="td-in"
			/>
		);
	}

	renderSubject(subject, mainInfo) {
		if (!subject) return <div className="td-in">—</div>;
		if (validators.isHex(subject) && subject.length === 40) return <span className="td-in">{subject}</span>;
		return (
			<Link
				className="td-in avatar-wrap"
				to={URLHelper.createUrlById(subject)}
				onClick={(e) => e.stopPropagation()}
			>
				{mainInfo.subject.name && <Avatar accountName={subject} />}
				<span>{subject}</span>
			</Link>
		);
	}

	renderAmount() {
		const { operation } = this.props;
		const { mainInfo } = operation;
		if (!mainInfo.value.amount) return <div className="td-in">—</div>;
		const assetAmount = FormatHelper.formatAmount(mainInfo.value.amount, mainInfo.value.precision);
		return (
			<div className="td-in">
				<span className="value">
					<Tooltip
						placement="top"
						overlayClassName="verify-contract-tooltip"
						trigger={['hover']}
						overlay={assetAmount}
					>
						<span className="txt">{assetAmount}</span>
					</Tooltip>
				</span>
				<span className="currency">{mainInfo.value.symbol}</span>
			</div>
		);
	}

	render() {
		const {
			operation: {
				id,
				mainInfo,
				objectInfo,
				blockNumber: block,
				trIndex: transactionNum,
				opIndex,
				number,
				blockTimestamp,
				...detailInfo
			},
			index,
			active,
			timestamp,
			fee,
			air,
		} = this.props;
		const objectId = objectInfo ? objectInfo.get('id') : null;
		this.props.tableRefs[index] = React.createRef();
		const subjectValue = mainInfo.subject && (mainInfo.subject.name || mainInfo.subject.id);

		const tip = (
			<React.Fragment>
				<p>
					View raw JSON object
				</p>
			</React.Fragment>
		);

		const tooltipStyle = {
			width: 175,
		};

		return (
			<React.Fragment>
				<tr
					className={classnames('view', { active })}
					onClick={() => this.props.toggleOperationDetails(index)}
					ref={this.props.tableRefs[index]}
				>
					<td />
					<Media query="(max-width: 767px)">
						{(matches) => !matches && (
							<td className="number">
								<div className="td-in">{number !== '' ? `${number || index + 1}.` : null}</div>
							</td>
						)}
					</Media>
					<td className="type">
						<Media query="(max-width: 767px)">
							{(matches) => matches &&
								<React.Fragment>

									<div className="col-title">
										<span className="index">#</span>
										<span>Type</span>
									</div>
									<span className="index">{index + 1}.</span>
								</React.Fragment>
							}
						</Media>
						<div className="td-in">
							{detailInfo.type}
						</div>
					</td>
					{/* FOR ACCOUNT AND CONTRACT */}
					{
						timestamp ? (
							<td className="time">
								<Media query="(max-width: 767px)">
									{(matches) => matches && <div className="col-title">DATA, TIME</div>}
								</Media>
								<div className="td-in">
									<span>
										{FormatHelper.timestampToOperationRowTime(blockTimestamp)}
									</span>
								</div>
							</td>
						) : null
					}
					<td className="sender">
						<Media query="(max-width: 767px)">
							{(matches) => matches && <div className="col-title">Sender</div>}
						</Media>
						{mainInfo.from.id ?
							<Link className="td-in avatar-wrap" to={!mainInfo.from.name && validators.isContractId(mainInfo.from.id) ? URLHelper.createContractUrl(mainInfo.from.id) : URLHelper.createAccountUrl(mainInfo.from.name)} onClick={(e) => e.stopPropagation()}>
								{mainInfo.from.name ? <Avatar accountName={mainInfo.from.name} /> : null}
								<span>{mainInfo.from.name ? mainInfo.from.name : mainInfo.from.id}</span>
							</Link> : <div className="td-in">—</div>
						}
					</td>
					<td className="reciever">
						<Media query="(max-width: 767px)">
							{(matches) => matches && <div className="col-title">Reciever</div>}
						</Media>
						{this.renderSubject(subjectValue, mainInfo)}
					</td>
					<td className="amount">
						<Media query="(max-width: 767px)">
							{(matches) => matches && <div className="col-title">Amount</div>}
						</Media>
						{this.renderAmount()}
					</td>
					{
						fee ? (
							<Media query="(max-width: 1000px)">
								{
									(matches) => (!matches && (
										<td className="fee">
											<div className="td-in">
												<span className="value">
													<Tooltip
														placement="top"
														overlayClassName="verify-contract-tooltip"
														trigger={['hover']}
														overlay={FormatHelper.formatAmount(detailInfo.fee.amount, detailInfo.fee.precision)}
													>
														<span className="txt">{FormatHelper.formatAmount(detailInfo.fee.amount, detailInfo.fee.precision)}</span>
													</Tooltip>
												</span>
												<span className="currency">{detailInfo.fee.symbol}</span>
											</div>
										</td>
									))
								}
							</Media>
						) : null
					}
					<td className="rezult">
						<Media query="(max-width: 767px)">
							{(matches) => matches && <div className="col-title">Result</div>}
						</Media>
						{
							(mainInfo.result && !_.isEmpty(mainInfo.result)) ?
								<Link to={URLHelper.createUrlById(mainInfo.result)} className="td-in" onClick={(e) => e.stopPropagation()}>{mainInfo.result}</Link>
								: <div className="td-in">—</div>
						}
					</td>
					<td className="json">
						{
							mainInfo.from.name ? (
								<Media
									queries={{
										small: '(max-width: 767px)',
										large: '(min-width: 768px)',
									}}
								>
									{(matches) => (
										<React.Fragment>
											{
												matches.small &&
												<React.Fragment>
													<div className="col-title">Json</div>
													{this.renderTransactionLink(block, transactionNum, opIndex)}
												</React.Fragment>
											} {
												matches.large &&
												<Tooltip
													placement="top"
													trigger={['hover']}
													overlay={tip}
													overlayStyle={tooltipStyle}
													overlayClassName="verify-contract-tooltip"
												>
													{this.renderTransactionLink(block, transactionNum, opIndex)}
												</Tooltip>
											}
										</React.Fragment>
									)}
								</Media>
							) : <div className="td-in">—</div>
						}
					</td>
					<td className="dd">
						<div className="td-in">
							<img src={ddIcon} alt="" />
						</div>
					</td>
					<td />
				</tr>
				{
					active &&
					<tr className="fold">
						<td colSpan="2" />
						<Media query="(max-width: 1000px)">
							{
								(matches) => (
									<React.Fragment>
										<td colSpan={this.getColSpan(matches)}>
											<OperationInfo
												details={detailInfo}
												index={index}
												block={block}
												transaction={transactionNum}
												opIndex={opIndex}
												objId={objectId}
											/>
											<ObjectInfo details={detailInfo} object={objectInfo} />
										</td>
										<Media query="(max-width: 767px)">
											{(matchesIn) => !matchesIn && <td />}
										</Media>
									</React.Fragment>
								)
							}
						</Media>
					</tr>
				}
				{
					air &&
					<tr className="air">
						<td colSpan="9" />
					</tr>
				}
			</React.Fragment>
		);
	}

}


OperationRow.propTypes = {
	timestamp: PropTypes.bool.isRequired,
	fee: PropTypes.bool.isRequired,
	operation: PropTypes.object.isRequired,
	index: PropTypes.number.isRequired,
	active: PropTypes.bool.isRequired,
	air: PropTypes.bool.isRequired,
	tableRefs: PropTypes.array.isRequired,
	toggleOperationDetails: PropTypes.func.isRequired,
};


export default OperationRow;
