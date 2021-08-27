import React from 'react';
import css from './EditListingDescriptionForm.module.css';
import { required } from '../../util/validators';
import { FieldCheckboxGroup } from '../../components';

const CustomCategoryMultiSelectFieldMaybe = props => {
  const { label, id, name, categories } = props;
  return (
    <FieldCheckboxGroup
      label={label}
      id={id}
      name={name}
      options={categories}
      className={css.title}
    />
  );
};

export default CustomCategoryMultiSelectFieldMaybe;
