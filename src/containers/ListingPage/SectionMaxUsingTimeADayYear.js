import React from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';

import css from './SectionRulesMaybe.module.css';

const SectionMaxUsingTimeADayMaybe = props => {
  const { className, rootClassName, publicData } = props;
  const classes = classNames(rootClassName || css.root, className);
  return publicData && publicData.maxUsingTimeADay ? (
    <div className={classes}>
      <h2 className={css.title}>
        <FormattedMessage id="ListingPage.maxUsingTimeADay" />
      </h2>
      <p className={css.rules}>
        <FormattedMessage
          id="ListingPage.maxUsingTimeADayValue"
          values={{ count: publicData.maxUsingTimeADay }}
        />
      </p>
    </div>
  ) : null;
};

SectionMaxUsingTimeADayMaybe.defaultProps = { className: null, rootClassName: null };

SectionMaxUsingTimeADayMaybe.propTypes = {
  className: string,
  rootClassName: string,
  publicData: shape({
    rules: string,
  }),
};

export default SectionMaxUsingTimeADayMaybe;
