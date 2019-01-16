import React from 'react';
import Media from 'react-media';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import SimplePreparingBlock from './PreparingBlock/SimplePreparingBlock';
import CompositePreparingBlock from './PreparingBlock/CompositePreparingBlock';
import Loader from './Loader';

import { BBA_STARTED, BBA_TIP, GC_TIP, PRODUCING_TIP, rounderSteps } from '../../constants/RoundConstants';

import FormatHelper from '../../helpers/FormatHelper';

class PreparingSection extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			progressBar: 0,
			timer: 0,
			step: '',
		};
		this.progressInterval = null;
	}

	componentDidMount() {
		this.progressInterval = setInterval(() => {
			const loadLimit = this.state.step ? rounderSteps[this.state.step].maxProgress : 100;

			if (this.state.progressBar < loadLimit) {
				this.setState({
					progressBar: this.state.progressBar += 1,
					timer: this.state.timer += 500,
				});
			}
		}, 500);
	}

	shouldComponentUpdate(nextProps) {
		const { stepProgress } = this.props;

		if (stepProgress && nextProps.stepProgress !== stepProgress) {
			this.setState({
				progressBar: rounderSteps[nextProps.stepProgress].progress,
				step: nextProps.stepProgress,
			});
		}

		return true;
	}

	componentWillUnmount() {
		clearInterval(this.progressInterval);
	}

	render() {
		const {
			producers, stepProgress, readyProducers, preparingBlock,
		} = this.props;

		if (!stepProgress) {
			return null;
		}

		return (
			<React.Fragment>
				<div className="wrap">
					<div className="preparing-section">
						<Media query="(max-width: 499px)">
							{(matches) =>
								(matches ? (
									<p className="mobile-title">Preparing block</p>
								) : (
									<SimplePreparingBlock title="Preparing block" description={FormatHelper.formatAmount(preparingBlock, 0)} />
								))
							}
						</Media>

						<Media query="(max-width: 767px)">
							{(matches) =>
								(matches ? (
									<CompositePreparingBlock
										composite
										title="Producing block"
										currentStep={rounderSteps[stepProgress].step}
										totalStep={rounderSteps.totalStep}
										description={`Producers: ${readyProducers}/${producers}`}
										status={stepProgress === BBA_STARTED ? 'done' : 'progress'}
										tooltip
									/>
								) : (
									<React.Fragment>
										<SimplePreparingBlock
											title="Producing block"
											description={`Producers: ${readyProducers}/${producers}`}
											status={rounderSteps[stepProgress].producing}
											tooltip
											tip={PRODUCING_TIP}
										/>
										<SimplePreparingBlock
											className="sm-border"
											title="Verifying block: GC"
											smallTitle="Verifying: GC"
											description="Verifying"
											status={rounderSteps[stepProgress].verifying}
											tooltip
											tip={GC_TIP}
										/>
										<SimplePreparingBlock tip={BBA_TIP} title="Verifying block: BBA" smallTitle="Verifying: BBA" description="Pending" tooltip />
									</React.Fragment>
								))
							}
						</Media>
					</div>
				</div>
				<Loader status={this.state.progressBar} />
			</React.Fragment>
		);
	}

}

PreparingSection.propTypes = {
	producers: PropTypes.number.isRequired,
	stepProgress: PropTypes.string.isRequired,
	readyProducers: PropTypes.number.isRequired,
	preparingBlock: PropTypes.number.isRequired,
};

export default connect(
	(state) => ({
		producers: state.round.get('producers'),
		stepProgress: state.round.get('stepProgress'),
		readyProducers: state.round.get('readyProducers'),
		preparingBlock: state.round.get('preparingBlock'),
	}),
	() => ({}),
)(PreparingSection);
