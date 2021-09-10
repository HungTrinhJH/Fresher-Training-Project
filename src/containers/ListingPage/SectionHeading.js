import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { InlineTextButton } from '../../components';
import { LINE_ITEM_NIGHT, LINE_ITEM_DAY } from '../../util/types';
import config from '../../config';

import css from './ListingPage.module.css';
export const SAUNA_LISTING = 'sauna';
export const EQUIPMENT_LISTING = 'equipment';
const SectionHeading = props => {
  const {
    priceTitle,
    formattedPrice,
    richTitle,
    category,
    hostLink,
    listingType,
    showContactUser,
    onContactUser,
  } = props;

  const unitType = config.bookingUnitType;
  const isNightly = unitType === LINE_ITEM_NIGHT;
  const isDaily = unitType === LINE_ITEM_DAY;

  const getUnitTranslationKey = () => {
    if (listingType === SAUNA_LISTING) {
      if (isNightly) {
        return 'ListingPage.perNight';
      } else if (isDaily) {
        return 'ListingPage.perDay';
      } else {
        return 'ListingPage.perUnit';
      }
    } else if (listingType === EQUIPMENT_LISTING) {
      return 'ListingPage.perEquipment';
    }
  };
  const unitTranslationKey = getUnitTranslationKey();

  return (
    <div className={css.sectionHeading}>
      <div className={css.desktopPriceContainer}>
        <div className={css.desktopPriceValue} title={priceTitle}>
          {formattedPrice}
        </div>
        <div className={css.desktopPerUnit}>
          <FormattedMessage id={unitTranslationKey} />
        </div>
      </div>
      <div className={css.heading}>
        <h1 className={css.title}>{richTitle}</h1>
        <div className={css.author}>
          {category}
          <FormattedMessage id="ListingPage.hostedBy" values={{ name: hostLink }} />
          {showContactUser ? (
            <span className={css.contactWrapper}>
              <span className={css.separator}>•</span>
              <InlineTextButton
                rootClassName={css.contactLink}
                onClick={onContactUser}
                enforcePagePreloadFor="SignupPage"
              >
                <FormattedMessage id="ListingPage.contactUser" />
              </InlineTextButton>
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SectionHeading;
