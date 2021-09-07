import React from 'react';
import css from './SectionOtherPhotosMaybe.module.css';
import { ResponsiveImage } from '../../components';
import { FormattedMessage } from '../../util/reactIntl';

const OtherImage = props => <ResponsiveImage {...props} />;

const SectionOtherPhotosMaybe = props => {
  const { listing } = props;
  const listingIds = listing.attributes.publicData.photos
    ? listing.attributes.publicData.photos
    : [];

  // Get other photos only
  const images = [];
  for (let img of listing.images) {
    const idxInListingIds = listingIds.findIndex(photo => photo.id === img.id.uuid);
    if (listingIds[idxInListingIds].type === 'otherPhoto') {
      images.push(img);
    }
  }
  // console.log(images);
  const imagesSlider = images.map(img => (
    <div className={css.imageItem}>
      <OtherImage image={img} key={img.id.uuid} variants={['landscape-crop']} />
    </div>
  ));

  return (
    <div>
      <h3 className={css.title}>
        <FormattedMessage id="ListingPage.otherPhotosHeading" />
      </h3>
      <div className={css.imageWrapper}>{imagesSlider}</div>
    </div>
  );
};

export default SectionOtherPhotosMaybe;
