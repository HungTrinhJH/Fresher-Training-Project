import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from '../../util/reactIntl';
import { LISTING_STATE_DRAFT } from '../../util/types';
import { ListingLink } from '../../components';
import { EditListingPricingForm } from '../../forms';
import { ensureOwnListing } from '../../util/data';
import { types as sdkTypes } from '../../util/sdkLoader';
import config from '../../config';

import css from './EditListingPricingPanel.module.css';
import { EQUIPMENT_LISTING, SAUNA_LISTING } from '../EditListingWizard/EditListingWizard';

const { Money } = sdkTypes;

const EditListingPricingPanel = props => {
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

  const { price, publicData } = currentListing.attributes;
  const cleaningFee = publicData && publicData.cleaningFee ? publicData.cleaningFee : null;
  const cleaningFeeAsMoney = cleaningFee
    ? new Money(cleaningFee.amount, cleaningFee.currency)
    : null;

  const initialValues = {
    price,
    cleaningFee: cleaningFeeAsMoney,
  };

  const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;

  const getPanelTile = () => {
    if (isPublished) {
      return (
        <FormattedMessage
          id="EditListingPricingPanel.title"
          values={{ listingTitle: <ListingLink listing={listing} /> }}
        />
      );
    } else {
      if (listingType === SAUNA_LISTING) {
        return <FormattedMessage id="EditListingPricingPanel.createListingTitle" />;
      } else if (listingType === EQUIPMENT_LISTING) {
        return <FormattedMessage id="EditListingPricingPanel.createEquipmentListingTitle" />;
      }
    }
  };

  const panelTitle = getPanelTile();

  const priceCurrencyValid = price instanceof Money ? price.currency === config.currency : true;

  const handleDataBeforeSubmitting = values => {
    if (listingType === SAUNA_LISTING) {
      const { price, cleaningFee = null } = values;
      return {
        price,
        publicData: {
          cleaningFee: {
            amount: cleaningFee.amount,
            currency: cleaningFee.currency,
          },
        },
      };
    } else if (listingType === EQUIPMENT_LISTING) {
      const { price } = values;
      return {
        price,
      };
    }
  };
  const form = priceCurrencyValid ? (
    <EditListingPricingForm
      className={css.form}
      initialValues={initialValues}
      listingType={listingType}
      onSubmit={values => {
        const updatedValues = handleDataBeforeSubmitting(values);
        onSubmit(updatedValues);
      }}
      onChange={onChange}
      saveActionMsg={submitButtonText}
      disabled={disabled}
      ready={ready}
      updated={panelUpdated}
      updateInProgress={updateInProgress}
      fetchErrors={errors}
    />
  ) : (
    <div className={css.priceCurrencyInvalid}>
      <FormattedMessage id="EditListingPricingPanel.listingPriceCurrencyInvalid" />
    </div>
  );

  return (
    <div className={classes}>
      <h1 className={css.title}>{panelTitle}</h1>
      {form}
    </div>
  );
};

const { func, object, string, bool } = PropTypes;

EditListingPricingPanel.defaultProps = {
  className: null,
  rootClassName: null,
  listing: null,
};

EditListingPricingPanel.propTypes = {
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

export default EditListingPricingPanel;
