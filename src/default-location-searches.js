import { types as sdkTypes } from './util/sdkLoader';

const { LatLng, LatLngBounds } = sdkTypes;

const defaultLocations = [
  {
    id: 'default-hochiminh',
    predictionPlace: {
      address: 'Ho Chi Minh City, Vietnam',
      bounds: new LatLngBounds(new LatLng(11.16, 107.026), new LatLng(10.349, 106.363)),
    },
  },
  {
    id: 'default-hanoi',
    predictionPlace: {
      address: 'Hanoi , Vietnam',
      bounds: new LatLngBounds(new LatLng(21.385, 106.019), new LatLng(20.562, 105.285)),
    },
  },
];
export default defaultLocations;
