import React from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';

import css from './SectionRulesMaybe.module.css';

const SectionManufactureViewMaybe = props => {
  const { className, rootClassName, publicData } = props;
  const classes = classNames(rootClassName || css.root, className);
  return publicData && publicData.manufactureYear ? (
    <div className={classes}>
      <h2 className={css.title}>
        <FormattedMessage id="ListingPage.manufactureTitle" />
      </h2>
      <p className={css.rules}>
        <FormattedMessage
          id="ListingPage.manufactureValue"
          values={{ year: publicData.manufactureYear }}
        />
      </p>
    </div>
  ) : null;
};

SectionManufactureViewMaybe.defaultProps = { className: null, rootClassName: null };

SectionManufactureViewMaybe.propTypes = {
  className: string,
  rootClassName: string,
  publicData: shape({
    rules: string,
  }),
};

export default SectionManufactureViewMaybe;
