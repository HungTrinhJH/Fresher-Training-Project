/*
  A component so safely link to the ListingPage of the given listing.

  When the listing is pending approval, the normal ListingPage won't
  work as the listing isn't yet published. This component links to the
  correct pending-approval variant URL or to the normal ListingPage
  based on the listing state.
*/
import React from 'react';
import { string, oneOfType, node } from 'prop-types';
import { richText } from '../../util/richText';
import { LISTING_STATE_DRAFT, LISTING_STATE_PENDING_APPROVAL, propTypes } from '../../util/types';
import {
  LISTING_PAGE_DRAFT_VARIANT,
  LISTING_PAGE_PENDING_APPROVAL_VARIANT,
  createSlug,
} from '../../util/urlHelpers';
import { NamedLink } from '../../components';

import css from './ListingLink.module.css';
import { EQUIPMENT_LISTING, SAUNA_LISTING } from '../EditListingWizard/EditListingWizard';

const MIN_LENGTH_FOR_LONG_WORDS = 16;

const ListingLink = props => {
  const { className, listing, children } = props;
  const listingLoaded = listing && listing.id;
  if (!listingLoaded) {
    return null;
  }
  const id = listing.id.uuid;
  const { title, state } = listing.attributes;
  const slug = createSlug(title);
  const richTitle = (
    <span>
      {richText(title, {
        longWordMinLength: MIN_LENGTH_FOR_LONG_WORDS,
        longWordClass: css.longWord,
      })}
    </span>
  );

  const isPendingApproval = state === LISTING_STATE_PENDING_APPROVAL;
  const isDraft = state === LISTING_STATE_DRAFT;
  const variant = isPendingApproval
    ? LISTING_PAGE_PENDING_APPROVAL_VARIANT
    : isDraft
    ? LISTING_PAGE_DRAFT_VARIANT
    : null;

  const listingType =
    listing && listing.attributes.publicData.listingType
      ? listing.attributes.publicData.listingType
      : 'sauna';

  const getLinkProps = () => {
    if (!!variant) {
      return {
        name: 'ListingPageVariant',
        params: {
          id,
          slug,
          variant,
        },
      };
    } else {
      if (listingType === SAUNA_LISTING) {
        return {
          name: 'ListingPage',
          params: { id, slug },
        };
      } else if (listingType === EQUIPMENT_LISTING) {
        return {
          name: 'EquipmentListingPage',
          params: { id, slug, listingType },
        };
      }
    }
  };
  const linkProps = getLinkProps();
  return (
    <NamedLink className={className} {...linkProps}>
      {children ? children : richTitle || ''}
    </NamedLink>
  );
};
ListingLink.defaultProps = {
  className: null,
  listing: null,
  children: null,
};

ListingLink.propTypes = {
  className: string,
  listing: oneOfType([propTypes.listing, propTypes.ownListing]),
  children: node,
};

export default ListingLink;
