import React from 'react';
import { bool, func, object, string } from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from '../../util/reactIntl';
import { ensureOwnListing } from '../../util/data';
import { findOptionsForSelectFilter } from '../../util/search';
import { LISTING_STATE_DRAFT } from '../../util/types';
import { ListingLink } from '../../components';
import { EditListingDescriptionForm } from '../../forms';
import config from '../../config';

import css from './EditListingDescriptionPanel.module.css';
import { EQUIPMENT_LISTING, SAUNA_LISTING } from '../EditListingWizard/EditListingWizard';

const EditListingDescriptionPanel = props => {
  const {
    className,
    rootClassName,
    listing,
    disabled,
    ready,
    onSubmit,
    onChange,
    submitButtonText,
    panelUpdated,
    updateInProgress,
    errors,
    listingType,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureOwnListing(listing);
  const { description, title, publicData } = currentListing.attributes;

  const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
  const panelTitle = isPublished ? (
    <FormattedMessage
      id="EditListingDescriptionPanel.title"
      values={{ listingTitle: <ListingLink listing={listing} /> }}
    />
  ) : listingType === SAUNA_LISTING ? (
    <FormattedMessage id="EditListingDescriptionPanel.createListingTitle" />
  ) : (
    <FormattedMessage id="EditListingDescriptionPanel.createListingEquipmentTitle" />
  );

  const categoryOptions = findOptionsForSelectFilter('category', config.custom.filters);
  const equipmentCategoryOptions = findOptionsForSelectFilter(
    'equipmentCategory',
    config.custom.filters
  );

  // Initial values for Description Tab form
  const getInitialValues = () => {
    switch (listingType) {
      case SAUNA_LISTING:
        return { title, description, category: publicData.category };
      case EQUIPMENT_LISTING:
        return {
          title,
          description,
          equipmentCategory: publicData.equipmentCategory,
          manufactureYear: publicData.manufactureYear,
          maxUsingTimeADay: publicData.maxUsingTimeADay,
        };
      default:
        return { title, description, category: publicData.category };
    }
  };

  // Function to get updated values
  const getUpdatedValues = values => {
    if (listingType === SAUNA_LISTING) {
      const { title, description, category = [] } = values;
      return {
        title: title.trim(),
        description,
        publicData: { category, listingType: SAUNA_LISTING },
      };
    }

    if (listingType === EQUIPMENT_LISTING) {
      const {
        title,
        description,
        equipmentCategory = [],
        manufactureYear,
        maxUsingTimeADay,
      } = values;
      return {
        title: title.trim(),
        description,
        publicData: {
          equipmentCategory,
          manufactureYear: Number(manufactureYear),
          maxUsingTimeADay: Number(maxUsingTimeADay),
          listingType: EQUIPMENT_LISTING,
        },
      };
    }
  };

  return (
    <div className={classes}>
      <h1 className={css.title}>{panelTitle}</h1>
      <EditListingDescriptionForm
        className={css.form}
        initialValues={getInitialValues()}
        saveActionMsg={submitButtonText}
        onSubmit={values => {
          const updatedValues = getUpdatedValues(values);
          onSubmit(updatedValues);
        }}
        onChange={onChange}
        disabled={disabled}
        ready={ready}
        listingType={listingType}
        updated={panelUpdated}
        updateInProgress={updateInProgress}
        fetchErrors={errors}
        categories={categoryOptions}
        equipmentCategories={equipmentCategoryOptions}
      />
    </div>
  );
};

EditListingDescriptionPanel.defaultProps = {
  className: null,
  rootClassName: null,
  errors: null,
  listing: null,
};

EditListingDescriptionPanel.propTypes = {
  className: string,
  rootClassName: string,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,

  disabled: bool.isRequired,
  ready: bool.isRequired,
  onSubmit: func.isRequired,
  onChange: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
  errors: object.isRequired,
};

export default EditListingDescriptionPanel;
