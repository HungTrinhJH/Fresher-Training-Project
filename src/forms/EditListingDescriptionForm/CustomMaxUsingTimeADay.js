import React from 'react';
import FieldRangeSlider from '../../components/FieldRangeSlider/FieldRangeSlider';

const CustomMaxUsingTimeADay = props => {
  const { label, name, id, validate } = props;
  return <FieldRangeSlider name={name} id={id} label={label} min={1} max={23} step={1} />;
};

export default CustomMaxUsingTimeADay;
