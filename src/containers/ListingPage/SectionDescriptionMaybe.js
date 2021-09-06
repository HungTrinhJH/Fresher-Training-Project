import React from 'react';
import { SAUNA_LISTING } from '../../components/EditListingWizard/EditListingWizard';
import { FormattedMessage } from '../../util/reactIntl';
import { richText } from '../../util/richText';

import css from './ListingPage.module.css';

const MIN_LENGTH_FOR_LONG_WORDS_IN_DESCRIPTION = 20;

const SectionDescriptionMaybe = props => {
  const { description, listingType } = props;

  return description ? (
    <div className={css.sectionDescription}>
      <h2 className={css.descriptionTitle}>
        {listingType === SAUNA_LISTING ? (
          <FormattedMessage id="ListingPage.descriptionTitle" />
        ) : (
          <FormattedMessage id="ListingPage.equipmentDescriptionTitle" />
        )}
      </h2>
      <p className={css.description}>
        {richText(description, {
          longWordMinLength: MIN_LENGTH_FOR_LONG_WORDS_IN_DESCRIPTION,
          longWordClass: css.longWord,
        })}
      </p>
    </div>
  ) : null;
};

export default SectionDescriptionMaybe;
