import React from 'react';
import PropTypes from 'prop-types';
import defaultIcon from '../../assets/images/icons/default-icn.svg';
import URLHelper from '../../helpers/URLHelper';

export class ContractIcon extends React.Component {

	render() {
		return (
			this.props.icon ?
				<img src={URLHelper.getUrlContractIcon(this.props.icon)} alt="icon" />
				: <img src={defaultIcon} alt="icon" />
		);
	}

}

ContractIcon.propTypes = {
	icon: PropTypes.string,
};

ContractIcon.defaultProps = {
	icon: '',
};

