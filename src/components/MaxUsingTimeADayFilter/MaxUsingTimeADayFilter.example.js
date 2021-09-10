import React from 'react';
import { withRouter } from 'react-router-dom';
import { stringify, parse } from '../../util/urlHelpers';

import MaxUsingTimeADayFilter from './MaxUsingTimeADayFilter';

const URL_PARAM = 'pub_maxUsingTimeADay';

// Helper for submitting example
const handleSubmit = (values, history) => {
  const queryParams = values ? `?${stringify(values)}` : '';
  history.push(`${window.location.pathname}${queryParams}`);
};

const MaxUsingTimeADayFilterWrapper = withRouter(props => {
  const { history, location } = props;

  const params = parse(location.search);
  const price = params[URL_PARAM];
  const initialValues = { [URL_PARAM]: !!price ? price : null };

  return (
    <MaxUsingTimeADayFilter
      {...props}
      initialValues={initialValues}
      onSubmit={values => {
        console.log('Submit PriceFilterForm with (unformatted) values:', values);
        handleSubmit(values, history);
      }}
    />
  );
});

export const MaxUsingTimeADayFilterPopup = {
  component: MaxUsingTimeADayFilterWrapper,
  props: {
    id: 'MaxUsingTimeADayFilterPopupExample',
    queryParamNames: [URL_PARAM],
    min: 1,
    max: 24,
    step: 1,
    liveEdit: false,
    showAsPopup: true,
    contentPlacementOffset: -14,
    // initialValues: handled inside wrapper
    // onSubmit: handled inside wrapper
  },
  group: 'filters',
};

export const PriceFilterPlain = {
  component: MaxUsingTimeADayFilterWrapper,
  props: {
    id: 'PriceFilterPlainExample',
    queryParamNames: [URL_PARAM],
    min: 1,
    max: 21,
    step: 1,
    liveEdit: true,
    showAsPopup: false,
    contentPlacementOffset: -14,
    // initialValues: handled inside wrapper
    // onSubmit: handled inside wrapper
  },
  group: 'filters',
};
