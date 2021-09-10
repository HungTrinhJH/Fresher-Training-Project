import React, { Component } from 'react';
import { arrayOf, func, node, number, shape, string } from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { propTypes } from '../../util/types';
import config from '../../config';

import { MaxUsingTimeADayFilterForm } from '../../forms';

import css from './MaxUsingTimeADayFilterPlain.module.css';

const RADIX = 10;

const getMaxUsingTimeADayQueryParamName = queryParamNames => {
  return Array.isArray(queryParamNames)
    ? queryParamNames[0]
    : typeof queryParamNames === 'string'
    ? queryParamNames
    : 'pub_maxUsingTimeADay';
};

// Parse value, which should look like "1,24"
const parse = usingTimeRange => {
  const [minUsingTime, maxUsingTime] = !!usingTimeRange
    ? usingTimeRange.split(',').map(v => Number.parseInt(v, RADIX))
    : [];
  // Note: we compare to null, because 0 as minUsingTime is falsy in comparisons.
  return !!usingTimeRange && minUsingTime != null && maxUsingTime != null
    ? { minUsingTime, maxUsingTime }
    : null;
};

// Format value, which should look like { minUsingTime, maxUsingTime }
const format = (range, queryParamName) => {
  const { minUsingTime, maxUsingTime } = range || {};
  // Note: we compare to null, because 0 as minUsingTime is falsy in comparisons.
  const value =
    minUsingTime != null && maxUsingTime != null ? `${minUsingTime},${maxUsingTime}` : null;
  return { [queryParamName]: value };
};

class MaxUsingTimeADayFilterPlainComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: true };

    this.handleChange = this.handleChange.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.toggleIsOpen = this.toggleIsOpen.bind(this);
  }

  handleChange(values) {
    const { onSubmit, queryParamNames } = this.props;
    const maxUsingTimeADayQueryParamName = getMaxUsingTimeADayQueryParamName(queryParamNames);
    onSubmit(format(values, maxUsingTimeADayQueryParamName));
  }

  handleClear() {
    const { onSubmit, queryParamNames } = this.props;
    const maxUsingTimeADayQueryParamName = getMaxUsingTimeADayQueryParamName(queryParamNames);
    onSubmit(format(null, maxUsingTimeADayQueryParamName));
  }

  toggleIsOpen() {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  }

  render() {
    const {
      rootClassName,
      className,
      id,
      label,
      queryParamNames,
      initialValues,
      min,
      max,
      step,
      intl,
      currencyConfig,
    } = this.props;
    const classes = classNames(rootClassName || css.root, className);

    const maxUsingTimeADayQueryParam = getMaxUsingTimeADayQueryParamName(queryParamNames);
    const initialUsingTime =
      initialValues && initialValues[maxUsingTimeADayQueryParam]
        ? parse(initialValues[maxUsingTimeADayQueryParam])
        : {};
    const { minUsingTime, maxUsingTime } = initialUsingTime || {};

    const hasValue = value => value != null;
    const hasInitialValues = initialValues && hasValue(minUsingTime) && hasValue(maxUsingTime);

    const labelClass = hasInitialValues ? css.filterLabelSelected : css.filterLabel;
    const labelText = hasInitialValues
      ? intl.formatMessage(
          { id: 'MaxUsingTimeADayFilter.labelSelectedPlain' },
          {
            minUsingTime: minUsingTime,
            maxUsingTime: maxUsingTime,
          }
        )
      : label
      ? label
      : intl.formatMessage({ id: 'MaxUsingTimeADayFilter.label' });

    return (
      <div className={classes}>
        <div className={labelClass}>
          <button type="button" className={css.labelButton} onClick={this.toggleIsOpen}>
            <span className={labelClass}>{labelText}</span>
          </button>
          <button type="button" className={css.clearButton} onClick={this.handleClear}>
            <FormattedMessage id={'PriceFilter.clear'} />
          </button>
        </div>
        <div className={css.formWrapper}>
          <MaxUsingTimeADayFilterForm
            id={id}
            initialValues={
              hasInitialValues ? initialUsingTime : { minUsingTime: min, maxUsingTime: max }
            }
            onChange={this.handleChange}
            intl={intl}
            contentRef={node => {
              this.filterContent = node;
            }}
            min={min}
            max={max}
            step={step}
            liveEdit
            isOpen={this.state.isOpen}
          />
        </div>
      </div>
    );
  }
}

MaxUsingTimeADayFilterPlainComponent.defaultProps = {
  rootClassName: null,
  className: null,
  initialValues: null,
  step: number,
  currencyConfig: config.currencyConfig,
};

MaxUsingTimeADayFilterPlainComponent.propTypes = {
  rootClassName: string,
  className: string,
  id: string.isRequired,
  label: node,
  queryParamNames: arrayOf(string).isRequired,
  onSubmit: func.isRequired,
  initialValues: shape({
    price: string,
  }),
  min: number.isRequired,
  max: number.isRequired,
  step: number,
  currencyConfig: propTypes.currencyConfig,

  // form injectIntl
  intl: intlShape.isRequired,
};

const MaxUsingTimeADayFilterPlain = injectIntl(MaxUsingTimeADayFilterPlainComponent);

export default MaxUsingTimeADayFilterPlain;
