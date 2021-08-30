/* eslint-disable no-console */
import EditListingPhotosEquipmentForm from './EditListingPhotosEquipmentForm';

export const Empty = {
  component: EditListingPhotosEquipmentForm,
  props: {
    initialValues: { country: 'US', images: [] },
    stripeConnected: false,
    onImageUpload: values => {
      console.log(`onImageUpload with id (${values.id}) and file name (${values.file.name})`);
    },
    onSubmit: values => {
      console.log('Submit EditListingPhotosEquipmentForm with (unformatted) values:', values);
    },
    saveActionMsg: 'Save photos',
    updated: false,
    ready: false,
    updateInProgress: false,
    disabled: false,
    onUpdateImageOrder: imageOrder => {
      console.log('onUpdateImageOrder with new imageOrder:', imageOrder);
    },
    onRemoveImage: imageId => {
      console.log('remove image:', imageId);
    },
  },
  group: 'forms',
};
