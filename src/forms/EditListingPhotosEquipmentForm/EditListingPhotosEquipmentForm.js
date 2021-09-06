import React, { Component } from 'react';
import { array, bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm, Field } from 'react-final-form';
import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl';
import isEqual from 'lodash/isEqual';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { nonEmptyArray, composeValidators } from '../../util/validators';
import { isUploadImageOverLimitError } from '../../util/errors';
import { AddImages, Button, Form, ValidationError } from '../../components';

import css from './EditListingPhotosEquipmentForm.module.css';

const ACCEPT_IMAGES = 'image/*';
export const MAIN_PHOTO = 'mainPhoto';
export const OTHER_PHOTO = 'otherPhoto';
export class EditListingPhotosEquipmentFormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUploadRequested: false,
    };
    this.onImageUploadHandler = this.onImageUploadHandler.bind(this);
    this.submittedImages = [];
  }

  onImageUploadHandler(file, type) {
    console.log(type);
    if (file) {
      this.setState({
        imageUploadRequested: true,
      });
      const PHOTO_ID = `${file.name}_${Date.now()}_${type}`;
      this.props
        .onImageUpload({ id: PHOTO_ID, file })
        .then(() => {
          this.setState({
            imageUploadRequested: false,
          });
          this.props.handleUploadPhotos(PHOTO_ID, type);
        })
        .catch(() => {
          this.setState({ imageUploadRequested: false });
        });
    }
  }

  render() {
    return (
      <FinalForm
        {...this.props}
        onImageUploadHandler={this.onImageUploadHandler}
        imageUploadRequested={this.state.imageUploadRequested}
        initialValues={{ images: this.props.images }}
        render={formRenderProps => {
          const {
            form,
            className,
            fetchErrors,
            handleSubmit,
            images,
            imageUploadRequested,
            intl,
            invalid,
            onImageUploadHandler,
            onRemoveImage,
            disabled,
            ready,
            saveActionMsg,
            updated,
            updateInProgress,
            listing,
          } = formRenderProps;

          const chooseImageText = (
            <span className={css.chooseImageText}>
              <span className={css.chooseImage}>
                <FormattedMessage id="EditListingPhotosForm.chooseImage" />
              </span>
              <span className={css.imageTypes}>
                <FormattedMessage id="EditListingPhotosForm.imageTypes" />
              </span>
            </span>
          );

          const imageRequiredMessage = intl.formatMessage({
            id: 'EditListingPhotosForm.imageRequired',
          });

          const { publishListingError, showListingsError, updateListingError, uploadImageError } =
            fetchErrors || {};
          const uploadOverLimit = isUploadImageOverLimitError(uploadImageError);

          let uploadImageFailed = null;

          if (uploadOverLimit) {
            uploadImageFailed = (
              <p className={css.error}>
                <FormattedMessage id="EditListingPhotosForm.imageUploadFailed.uploadOverLimit" />
              </p>
            );
          } else if (uploadImageError) {
            uploadImageFailed = (
              <p className={css.error}>
                <FormattedMessage id="EditListingPhotosForm.imageUploadFailed.uploadFailed" />
              </p>
            );
          }

          // NOTE: These error messages are here since Photos panel is the last visible panel
          // before creating a new listing. If that order is changed, these should be changed too.
          // Create and show listing errors are shown above submit button
          const publishListingFailed = publishListingError ? (
            <p className={css.error}>
              <FormattedMessage id="EditListingPhotosForm.publishListingFailed" />
            </p>
          ) : null;
          const showListingFailed = showListingsError ? (
            <p className={css.error}>
              <FormattedMessage id="EditListingPhotosForm.showListingFailed" />
            </p>
          ) : null;

          const submittedOnce = this.submittedImages.length > 0;
          // imgs can contain added images (with temp ids) and submitted images with uniq ids.
          const arrayOfImgIds = imgs =>
            imgs.map(i => (typeof i.id === 'string' ? i.imageId : i.id));
          const imageIdsFromProps = arrayOfImgIds(images);
          const imageIdsFromPreviousSubmit = arrayOfImgIds(this.submittedImages);

          const imageArrayHasSameImages = isEqual(imageIdsFromProps, imageIdsFromPreviousSubmit);
          const pristineSinceLastSubmit = submittedOnce && imageArrayHasSameImages;

          const submitReady = (updated && pristineSinceLastSubmit) || ready;
          const submitInProgress = updateInProgress;
          const submitDisabled =
            invalid || disabled || submitInProgress || imageUploadRequested || ready;

          const classes = classNames(css.root, className);

          const listingIds = listing.attributes.publicData.photos || [];

          const splitPhotoByType = () => {
            const photos = {
              mainPhoto: [],
              otherPhoto: [],
            };
            for (let img of images) {
              if (img.hasOwnProperty('file')) {
                const photoType = img.id.split('_')[img.id.split('_').length - 1];
                photos[photoType].push(img);
              } else {
                const idxInListing = listingIds.findIndex(photo => photo.id === img.id.uuid);
                if (idxInListing !== -1) {
                  photos[listingIds[idxInListing].type].push(img);
                }
              }
            }
            return photos;
          };
          const photosByType = splitPhotoByType();
          console.log('photosByType:', photosByType);
          return (
            <Form
              className={classes}
              onSubmit={e => {
                this.submittedImages = images;
                handleSubmit(e);
              }}
            >
              {updateListingError ? (
                <p className={css.error}>
                  <FormattedMessage id="EditListingPhotosForm.updateFailed" />
                </p>
              ) : null}
              <h3>
                <FormattedMessage id="EditListingPhotosForm.mainPhotosTitle" />
              </h3>
              <AddImages
                className={css.imagesField}
                images={photosByType.mainPhoto}
                thumbnailClassName={css.thumbnail}
                savedImageAltText={intl.formatMessage({
                  id: 'EditListingPhotosForm.savedImageAltText',
                })}
                onRemoveImage={onRemoveImage}
              >
                <Field
                  id="addImage"
                  name="addImage"
                  accept={ACCEPT_IMAGES}
                  form={null}
                  label={chooseImageText}
                  type="file"
                  disabled={imageUploadRequested}
                >
                  {fieldprops => {
                    const { accept, input, label, disabled: fieldDisabled } = fieldprops;
                    const { name, type } = input;
                    const onChange = e => {
                      const file = e.target.files[0];
                      form.change(`addImage`, file);
                      form.blur(`addImage`);
                      onImageUploadHandler(file, MAIN_PHOTO);
                    };
                    const inputProps = { accept, id: name, name, onChange, type };
                    return (
                      <div className={css.addImageWrapper}>
                        <div className={css.aspectRatioWrapper}>
                          {fieldDisabled ? null : (
                            <input {...inputProps} className={css.addImageInput} />
                          )}
                          <label htmlFor={name} className={css.addImage}>
                            {label}
                          </label>
                        </div>
                      </div>
                    );
                  }}
                </Field>

                <Field
                  component={props => {
                    const { input, meta } = props;
                    return (
                      <div className={css.imageRequiredWrapper}>
                        <input {...input} />
                        <ValidationError fieldMeta={meta} />
                      </div>
                    );
                  }}
                  name="images"
                  type="hidden"
                  validate={composeValidators(nonEmptyArray(imageRequiredMessage))}
                />
              </AddImages>

              <h3>
                <FormattedMessage id="EditListingPhotosForm.otherPhotosTitle" />
              </h3>
              {images.length > 0 ? (
                <AddImages
                  className={css.imagesField}
                  images={photosByType.otherPhoto}
                  thumbnailClassName={css.thumbnail}
                  savedImageAltText={intl.formatMessage({
                    id: 'EditListingPhotosForm.savedImageAltText',
                  })}
                  onRemoveImage={onRemoveImage}
                >
                  <Field
                    id="addOtherImage"
                    name="addOtherImage"
                    accept={ACCEPT_IMAGES}
                    form={null}
                    label={chooseImageText}
                    type="file"
                    disabled={imageUploadRequested}
                  >
                    {fieldprops => {
                      const { accept, input, label, disabled: fieldDisabled } = fieldprops;
                      const { name, type } = input;
                      const onChange = e => {
                        const file = e.target.files[0];
                        form.change(`addOtherImage`, file);
                        form.blur(`addOtherImage`);
                        onImageUploadHandler(file, OTHER_PHOTO);
                      };
                      const inputProps = { accept, id: name, name, onChange, type };
                      return (
                        <div className={css.addImageWrapper}>
                          <div className={css.aspectRatioWrapper}>
                            {fieldDisabled ? null : (
                              <input {...inputProps} className={css.addImageInput} />
                            )}
                            <label htmlFor={name} className={css.addImage}>
                              {label}
                            </label>
                          </div>
                        </div>
                      );
                    }}
                  </Field>

                  <Field
                    component={props => {
                      const { input, meta } = props;
                      return (
                        <div className={css.imageRequiredWrapper}>
                          <input {...input} />
                          <ValidationError fieldMeta={meta} />
                        </div>
                      );
                    }}
                    name="images"
                    type="hidden"
                    validate={composeValidators(nonEmptyArray(imageRequiredMessage))}
                  />
                </AddImages>
              ) : null}
              {uploadImageFailed}

              <p className={css.tip}>
                <FormattedMessage id="EditListingPhotosForm.addImagesTip" />
              </p>
              {publishListingFailed}
              {showListingFailed}

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
  }
}

EditListingPhotosEquipmentFormComponent.defaultProps = { fetchErrors: null, images: [] };

EditListingPhotosEquipmentFormComponent.propTypes = {
  fetchErrors: shape({
    publishListingError: propTypes.error,
    showListingsError: propTypes.error,
    uploadImageError: propTypes.error,
    updateListingError: propTypes.error,
  }),
  images: array,
  intl: intlShape.isRequired,
  onImageUpload: func.isRequired,
  onUpdateImageOrder: func.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,
  updateInProgress: bool.isRequired,
  onRemoveImage: func.isRequired,
};

export default compose(injectIntl)(EditListingPhotosEquipmentFormComponent);
