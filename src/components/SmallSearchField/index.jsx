/* eslint-disable no-unused-expressions */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { KEY_CODE_ENTER, KEY_CODE_ESC } from '../../constants/GlobalConstants';


class SearchField extends React.Component {

	constructor() {
		super();

		this.state = {
			focus: false,
			isChange: false,
			isActiveSmall: false,
			inputValue: '',
		};
		this.searchTimeout = null;
		this.setWrapperRef = this.setWrapperRef.bind(this);
		this.handleClickOutside = this.handleClickOutside.bind(this);
	}

	componentDidMount() {
		document.addEventListener('mousedown', this.handleClickOutside);
	}

	componentWillUnmount() {
		clearTimeout(this.searchTimeout);
		document.removeEventListener('mousedown', this.handleClickOutside);
	}

	onFocus() {
		this.setState({ focus: true });
	}

	onChange(e) {
		const { value } = e.target;

		this.setState({
			isChange: !!value.length,
			inputValue: value,
		});

		clearTimeout(this.searchTimeout);
		this.searchTimeout = setTimeout(() => {
			this.props.getHints(value);
		}, 300);
	}

	onClick(e) {
		e.preventDefault();
		this.setState({ focus: true });
		this.inputEl.focus();
		const {	latestBlock } = this.props;

		clearTimeout(this.searchTimeout);
		this.changeLoadingStatus(this.state.inputValue, latestBlock);
	}

	onKeyPress(e) {
		const code = e.keyCode || e.which;
		const { value } = e.target;
		const {	latestBlock	} = this.props;

		if (KEY_CODE_ENTER === code) {
			clearTimeout(this.searchTimeout);
			this.changeLoadingStatus(value, latestBlock);
		}

		if (KEY_CODE_ESC === code) {
			this.inputEl.blur();
			this.setState({ focus: false });
		}
	}

	setWrapperRef(node) {
		this.wrapperRef = node;
	}

	handleClickOutside(event) {
		if (this.state.isActiveSmall && !this.wrapperRef.contains(event.target)) {
			this.setState({ isActiveSmall: false });
		}

		if (!this.wrapperRef.contains(event.target)) {
			this.setState({ focus: false });
			this.setState({ isChange: false });
		}
	}

	isSmallShow() {
		this.setState({ isActiveSmall: true });
		this.inputEl.focus();
	}

	cleareInput() {
		this.setState({
			inputValue: '',
			focus: false,
			isChange: false,
			isActiveSmall: false,
		});
	}

	changeLoadingStatus(value, latestBlock) {
		if (!this.state.inputValue || this.state.inputValue < 1 || this.state.inputValue > latestBlock) return;
		this.props.setLoading();
		this.props.getHints(value);
	}

	render() {

		const {
			focus, isChange, isActiveSmall,
		} = this.state;

		const {
			small, placeholder, white, withHelp, goToBlock, errorSearch,
		} = this.props;

		return (
			<div
				className={`input-search-block ${(small) ? 'small' : ''} ${(isActiveSmall || this.state.inputValue) ? 'is-active-small' : ''} ${(white) ? 'white' : ''} ${(goToBlock) ? 'go-to-block' : ''}`}
				ref={this.setWrapperRef}
			>
				<div className={`input-container ${focus ? 'focus' : ''}`}>
					{
						(!goToBlock) && (
							<a
								href=""
								className="icon"
								onClick={(e) => { e.preventDefault(); ((small) ? (this.isSmallShow()) : false); }}
							>
								<svg>
									<path
										fillRule="evenodd"
										fill="rgb(104, 108, 134)"
										d="M14.716,13.122 L11.179,9.575 C13.082,6.782 12.362,2.974 9.571,1.069 C6.780,-0.835 2.974,-0.114 1.072,2.679 C-0.831,5.473 -0.111,9.281 2.680,11.185 C4.759,12.603 7.492,12.603 9.571,11.185 L13.113,14.726 C13.590,15.135 14.308,15.079 14.716,14.602 C15.080,14.176 15.080,13.548 14.716,13.122 ZM2.272,6.122 C2.272,3.995 3.995,2.271 6.120,2.271 C8.246,2.271 9.969,3.995 9.969,6.122 C9.969,8.249 8.246,9.973 6.120,9.973 C3.996,9.970 2.275,8.248 2.272,6.122 Z"
									/>
								</svg>
							</a>
						)
					}
					<div className="input-field">
						<input
							type="text"
							value={this.state.inputValue}
							placeholder={placeholder}
							onFocus={() => this.onFocus()}
							onChange={(e) => this.onChange(e)}
							onKeyDown={(e) => this.onKeyPress(e)}
							ref={(node) => { this.inputEl = node; }}
						/>
						{
							(!goToBlock) ? (
								<button tabIndex="0" className="close-icn" onClick={() => this.cleareInput()} />
							) : (
								<button tabIndex="0" className="g-t-btn" onClick={(e) => this.onClick(e)} />
							)
						}
					</div>
				</div>
				{
					(withHelp) && (
						(isChange || focus) && (
							<div className={classnames('search-block-result', { 'no-results-wrap': errorSearch })}>
								{errorSearch && (
									<div className="element no-results">
										<div className="warn" />
										<div className="text">{errorSearch}</div>
									</div>
								)}
							</div>)
					)
				}
			</div>
		);
	}

}

SearchField.propTypes = {
	small: PropTypes.bool,
	white: PropTypes.bool,
	withHelp: PropTypes.bool,
	goToBlock: PropTypes.bool,
	errorSearch: PropTypes.string,
	placeholder: PropTypes.string,
	getHints: PropTypes.func,
	latestBlock: PropTypes.number,
	setLoading: PropTypes.func,
};

SearchField.defaultProps = {
	small: false,
	white: false,
	withHelp: false,
	goToBlock: null,
	errorSearch: '',
	placeholder: '',
	getHints: () => {},
	latestBlock: '',
	setLoading: () => {},
};

export default SearchField;
