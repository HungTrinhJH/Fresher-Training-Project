import React, { useState, useEffect } from 'react';
import css from './Switch.module.css';
import PropTypes from 'prop-types';

const Switch = props => {
  // const onSwitchChange = () => {
  //   props.onChecked(isChecked);
  // };
  const { isSwitchOn, onChecked } = props;
  return (
    <div className={css.switch_container}>
      <label>
        <input
          checked={isSwitchOn}
          onChange={() => onChecked(!isSwitchOn)}
          className={css.switch}
          type="checkbox"
        />
        <div>
          <div></div>
        </div>
      </label>
    </div>
  );
};

Switch.propTypes = {
  onChecked: PropTypes.func,
};

export default Switch;
