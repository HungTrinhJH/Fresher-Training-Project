/* eslint-disable no-console */
import { types as sdkTypes } from '../../util/sdkLoader';
import { LINE_ITEM_NIGHT } from '../../util/types';
import BookingEquipmentDatesTimesForm from './BookingEquipmentDatesTimesForm';

const { Money } = sdkTypes;

export const Form = {
  component: BookingEquipmentDatesTimesForm,
  props: {
    unitType: LINE_ITEM_NIGHT,
    onSubmit: values => {
      console.log('Submit BookingEquipmentDatesTimesForm with values:', values);
    },
    price: new Money(1099, 'USD'),
    fetchLineItemsInProgress: false,
    onFetchTransactionLineItems: () => null,
  },
  group: 'forms',
};
