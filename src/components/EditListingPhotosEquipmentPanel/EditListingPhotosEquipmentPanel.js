import React, { Component } from 'react';
import { array, bool, func, object, string } from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { LISTING_STATE_DRAFT } from '../../util/types';
import { EditListingPhotosEquipmentForm } from '../../forms';
import { ensureOwnListing } from '../../util/data';
import { ListingLink } from '..';

import css from './EditListingPhotosEquipmentPanel.module.css';
export const MAIN_PHOTO = 'mainPhoto';
export const OTHER_PHOTO = 'otherPhoto';
class EditListingPhotosEquipmentPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],
    };
  }

  handleUploadPhotos = (id, type) => {
    this.setState({
      photos: [...this.state.photos, { type, id }],
    });
  };
  render() {
    const {
      className,
      rootClassName,
      errors,
      disabled,
      ready,
      images,
      listing,
      onImageUpload,
      onUpdateImageOrder,
      submitButtonText,
      panelUpdated,
      updateInProgress,
      onChange,
      onSubmit,
      onRemoveImage,
    } = this.props;

    const rootClass = rootClassName || css.root;
    const classes = classNames(rootClass, className);
    const currentListing = ensureOwnListing(listing);

    const isPublished =
      currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;

    const panelTitle = isPublished ? (
      <FormattedMessage
        id="EditListingPhotosPanel.title"
        values={{ listingTitle: <ListingLink listing={listing} /> }}
      />
    ) : (
      <FormattedMessage id="EditListingPhotosPanel.createListingTitle" />
    );
    const handleSubmitPhotoData = () => {
      const newPhotosOrderId = this.state.photos;
      const currentListingPhotos = this.props.listing.attributes.publicData.photos
        ? this.props.listing.attributes.publicData.photos
        : [];

      const photosListingId = this.props.images.map(photo => {
        if (photo.hasOwnProperty('file')) {
          return {
            type: 'new',
            orderId: photo.id,
            id: photo.imageId.uuid,
          };
        }

        const idxInCurrentListingPhotos = currentListingPhotos.findIndex(
          currentListingPhoto => currentListingPhoto.id === photo.id.uuid
        );

        return {
          type: currentListingPhotos[idxInCurrentListingPhotos].type,
          orderId: null,
          id: photo.id.uuid,
        };
      });

      return photosListingId.map(currentPhoto => {
        if (currentPhoto.type === 'new') {
          const idx = newPhotosOrderId.findIndex(newPhoto => newPhoto.id === currentPhoto.orderId);
          return {
            type: newPhotosOrderId[idx].type,
            id: currentPhoto.id,
          };
        }

        return {
          type: currentPhoto.type,
          id: currentPhoto.id,
        };
      });
    };
    return (
      <div className={classes}>
        <h1 className={css.title}>{panelTitle}</h1>
        <EditListingPhotosEquipmentForm
          className={css.form}
          disabled={disabled}
          ready={ready}
          fetchErrors={errors}
          initialValues={{ images }}
          images={images}
          onImageUpload={onImageUpload}
          onSubmit={values => {
            const { addImage, ...updateValues } = values;
            const submittedPhotos = handleSubmitPhotoData();

            onSubmit({
              ...updateValues,
              publicData: {
                photos: submittedPhotos,
              },
            });
          }}
          onChange={onChange}
          listing={listing}
          onUpdateImageOrder={onUpdateImageOrder}
          onRemoveImage={onRemoveImage}
          saveActionMsg={submitButtonText}
          updated={panelUpdated}
          updateInProgress={updateInProgress}
          handleUploadPhotos={this.handleUploadPhotos}
        />
      </div>
    );
  }
}

EditListingPhotosEquipmentPanel.defaultProps = {
  className: null,
  rootClassName: null,
  errors: null,
  images: [],
  listing: null,
};

EditListingPhotosEquipmentPanel.propTypes = {
  className: string,
  rootClassName: string,
  errors: object,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  images: array,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,

  onImageUpload: func.isRequired,
  onUpdateImageOrder: func.isRequired,
  onSubmit: func.isRequired,
  onChange: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
  onRemoveImage: func.isRequired,
};

export default EditListingPhotosEquipmentPanel;
