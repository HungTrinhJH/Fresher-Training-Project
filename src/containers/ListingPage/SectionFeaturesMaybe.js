import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { PropertyGroup } from '../../components';

import css from './ListingPage.module.css';
import {
  EQUIPMENT_LISTING,
  SAUNA_LISTING,
} from '../../components/EditListingWizard/EditListingWizard';

const SectionFeaturesMaybe = props => {
  const { options, publicData, listingType } = props;
  if (!publicData) {
    return null;
  }

  const getSelectedOptions = () => {
    switch (listingType) {
      case SAUNA_LISTING:
        return publicData && publicData.amenities ? publicData.amenities : [];
      case EQUIPMENT_LISTING:
        return publicData && publicData.equipmentCategory ? publicData.equipmentCategory : [];
      default:
        return publicData && publicData.amenities ? publicData.amenities : [];
    }
  };
  const selectedOptions = getSelectedOptions();

  return (
    <div className={css.sectionFeatures}>
      <h2 className={css.featuresTitle}>
        {listingType === SAUNA_LISTING ? (
          <FormattedMessage id="ListingPage.featuresTitle" />
        ) : (
          <FormattedMessage id="ListingPage.equipmentFeaturesTitle" />
        )}
      </h2>
      <PropertyGroup
        id="ListingPage.amenities"
        options={options}
        selectedOptions={selectedOptions}
        twoColumns={true}
      />
    </div>
  );
};

export default SectionFeaturesMaybe;
