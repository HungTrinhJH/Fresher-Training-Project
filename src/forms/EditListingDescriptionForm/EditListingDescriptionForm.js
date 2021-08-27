import React from 'react';
import { arrayOf, bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { maxLength, required, composeValidators } from '../../util/validators';
import { Form, Button, FieldTextInput, FieldCheckboxGroup } from '../../components';
import CustomCategorySelectFieldMaybe from './CustomCategorySelectFieldMaybe';
import arrayMutators from 'final-form-arrays';

import css from './EditListingDescriptionForm.module.css';
import {
  EQUIPMENT_LISTING,
  SAUNA_LISTING,
} from '../../components/EditListingWizard/EditListingWizard';
import CustomCategoryMultiSelectFieldMaybe from './CustomCategoryMultiSelectFieldMaybe';

const TITLE_MAX_LENGTH = 60;

const EditListingDescriptionFormComponent = props => (
  <FinalForm
    {...props}
    mutators={{ ...arrayMutators }}
    render={formRenderProps => {
      const {
        categories,
        className,
        disabled,
        ready,
        handleSubmit,
        intl,
        invalid,
        pristine,
        saveActionMsg,
        updated,
        updateInProgress,
        fetchErrors,
        equipmentCategories,
        listingType,
      } = formRenderProps;
      const maxLengthMessage = intl.formatMessage(
        { id: 'EditListingDescriptionForm.maxLength' },
        {
          maxLength: TITLE_MAX_LENGTH,
        }
      );
      // Function will return an object to hold the information
      // of title: title_message, placeholder, error_message,...
      const getTitleMessage = () => {
        switch (listingType) {
          case EQUIPMENT_LISTING: {
            return {
              titleMessage: intl.formatMessage({ id: 'EditListingDescriptionForm.titleEquipment' }),
              titlePlaceholderMessage: intl.formatMessage({
                id: 'EditListingDescriptionForm.titlePlaceholderEquipment',
              }),
              titleRequiredMessage: intl.formatMessage({
                id: 'EditListingDescriptionForm.titleRequiredEquipment',
              }),
            };
          }
          case SAUNA_LISTING: {
            return {
              titleMessage: intl.formatMessage({ id: 'EditListingDescriptionForm.title' }),
              titlePlaceholderMessage: intl.formatMessage({
                id: 'EditListingDescriptionForm.titlePlaceholder',
              }),
              titleRequiredMessage: intl.formatMessage({
                id: 'EditListingDescriptionForm.titleRequired',
              }),
            };
          }
        }
      };

      // Function will return an object to hold the information
      // of description: title_message, placeholder, error_message,...
      const maxLength60Message = maxLength(maxLengthMessage, TITLE_MAX_LENGTH);

      const getDescription = () => {
        switch (listingType) {
          case SAUNA_LISTING:
            return {
              descriptionMessage: intl.formatMessage({
                id: 'EditListingDescriptionForm.description',
              }),
              descriptionPlaceholderMessage: intl.formatMessage({
                id: 'EditListingDescriptionForm.descriptionPlaceholder',
              }),
              descriptionRequiredMessage: intl.formatMessage({
                id: 'EditListingDescriptionForm.descriptionRequired',
              }),
            };
          case EQUIPMENT_LISTING:
            return {
              descriptionMessage: intl.formatMessage({
                id: 'EditListingDescriptionForm.descriptionEquipment',
              }),
              descriptionPlaceholderMessage: intl.formatMessage({
                id: 'EditListingDescriptionForm.descriptionPlaceholderEquipment',
              }),
              descriptionRequiredMessage: intl.formatMessage({
                id: 'EditListingDescriptionForm.descriptionRequiredEquipment',
              }),
            };
        }
      };

      const getManufacture = () => {
        switch (listingType) {
          case EQUIPMENT_LISTING:
            return {
              manufactureMessage: intl.formatMessage({
                id: 'EditListingManufactureForm.manufactureEquipment',
              }),
              manufacturePlaceholderMessage: intl.formatMessage({
                id: 'EditListingManufactureForm.manufacturePlaceholderEquipment',
              }),
              manufactureRequiredMessage: intl.formatMessage({
                id: 'EditListingManufactureForm.manufactureRequiredEquipment',
              }),
            };
          case SAUNA_LISTING:
            return null;
          default:
            return null;
        }
      };

      const getMaxUsingTimeADay = () => {
        switch (listingType) {
          case EQUIPMENT_LISTING:
            return {
              manufactureMessage: intl.formatMessage({
                id: 'EditListingUsingTimeADayForm.usingTimeADayEquipment',
              }),
              manufacturePlaceholderMessage: intl.formatMessage({
                id: 'EditListingUsingTimeADayForm.usingTimeADayPlaceholderEquipment',
              }),
              manufactureRequiredMessage: intl.formatMessage({
                id: 'EditListingUsingTimeADayForm.usingTimeADayRequiredEquipment',
              }),
            };
          case SAUNA_LISTING:
            return null;
          default:
            return null;
        }
      };

      const getType = () => {
        switch (listingType) {
          case SAUNA_LISTING: {
            return {
              typeMessage: intl.formatMessage({
                id: 'EditListingTypeForm.type',
              }),
              typePlaceholderMessage: intl.formatMessage({
                id: 'EditListingTypePlaceholderForm.typePlaceholder',
              }),
              typeRequiredMessage: intl.formatMessage({
                id: 'EditListingTypeForm.typeRequired',
              }),
            };
          }
          case EQUIPMENT_LISTING: {
            return {
              typeMessage: intl.formatMessage({
                id: 'EditListingTypeForm.typeEquipment',
              }),
              typePlaceholderMessage: intl.formatMessage({
                id: 'EditListingTypePlaceholderForm.typePlaceholderEquipment',
              }),
              typeRequiredMessage: intl.formatMessage({
                id: 'EditListingTypeForm.typeRequiredEquipment',
              }),
            };
          }
        }
      };

      const { updateListingError, createListingDraftError, showListingsError } = fetchErrors || {};
      const errorMessageUpdateListing = updateListingError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingDescriptionForm.updateFailed" />
        </p>
      ) : null;

      // This error happens only on first tab (of EditListingWizard)
      const errorMessageCreateListingDraft = createListingDraftError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingDescriptionForm.createListingDraftError" />
        </p>
      ) : null;

      const errorMessageShowListing = showListingsError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingDescriptionForm.showListingFailed" />
        </p>
      ) : null;

      const classes = classNames(css.root, className);
      const submitReady = (updated && pristine) || ready;
      const submitInProgress = updateInProgress;
      const submitDisabled = invalid || disabled || submitInProgress;

      const viewManufactureYearMaybe =
        listingType === EQUIPMENT_LISTING ? (
          <FieldTextInput
            id="manufactureYear"
            name="manufactureYear"
            className={css.title}
            label={getManufacture().manufactureMessage}
            placeholder={getManufacture().manufacturePlaceholderMessage}
            validate={composeValidators(required(getManufacture().manufactureRequiredMessage))}
          />
        ) : null;
      const viewMaxUsingTimeADayMaybe =
        listingType === EQUIPMENT_LISTING ? (
          <FieldTextInput
            id="maxUsingTimeADay"
            name="maxUsingTimeADay"
            className={css.title}
            label={getMaxUsingTimeADay().manufactureMessage}
            placeholder={getMaxUsingTimeADay().manufacturePlaceholderMessage}
            validate={composeValidators(required(getMaxUsingTimeADay().manufactureRequiredMessage))}
          />
        ) : null;

      const viewSaunaOrEquipmentCategoryMaybe =
        listingType === SAUNA_LISTING ? (
          <CustomCategorySelectFieldMaybe
            id="category"
            label={getType().typeMessage}
            placeholder={getType().typePlaceholderMessage}
            required={getType().typeRequiredMessage}
            name="category"
            required={getType().required}
            categories={categories}
          />
        ) : (
          <CustomCategoryMultiSelectFieldMaybe
            label={getType().typeMessage}
            id="equipmentCategory"
            name="equipmentCategory"
            required={getType().required}
            categories={equipmentCategories}
          />
        );
      return (
        <Form className={classes} onSubmit={handleSubmit}>
          {errorMessageCreateListingDraft}
          {errorMessageUpdateListing}
          {errorMessageShowListing}
          <FieldTextInput
            id="title"
            name="title"
            className={css.title}
            type="text"
            label={getTitleMessage().titleMessage}
            placeholder={getTitleMessage().titlePlaceholderMessage}
            maxLength={TITLE_MAX_LENGTH}
            validate={composeValidators(
              required(getTitleMessage().titleRequiredMessage),
              maxLength60Message
            )}
            autoFocus
          />

          <FieldTextInput
            id="description"
            name="description"
            className={css.description}
            type="textarea"
            label={getDescription().descriptionMessage}
            placeholder={getDescription().descriptionPlaceholderMessage}
            validate={composeValidators(required(getDescription().descriptionRequiredMessage))}
          />
          {viewSaunaOrEquipmentCategoryMaybe}
          {viewManufactureYearMaybe}
          {viewMaxUsingTimeADayMaybe}
          <Button
            className={css.submitButton}
            type="submit"
            inProgress={submitInProgress}
            disabled={submitDisabled}
            ready={submitReady}
          >
            {saveActionMsg}
          </Button>
        </Form>
      );
    }}
  />
);

EditListingDescriptionFormComponent.defaultProps = { className: null, fetchErrors: null };

EditListingDescriptionFormComponent.propTypes = {
  className: string,
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,
  updateInProgress: bool.isRequired,
  fetchErrors: shape({
    createListingDraftError: propTypes.error,
    showListingsError: propTypes.error,
    updateListingError: propTypes.error,
  }),
  categories: arrayOf(
    shape({
      key: string.isRequired,
      label: string.isRequired,
    })
  ),
};

export default compose(injectIntl)(EditListingDescriptionFormComponent);
