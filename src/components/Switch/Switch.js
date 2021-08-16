import React, { useState } from 'react';
import css from './Switch.module.css';
import PropTypes from 'prop-types';

const Switch = props => {
  const [isChecked, setIsChecked] = useState(false);
  const onSwitchChange = () => {
    setIsChecked(!isChecked);
    props.onChecked(isChecked);
  };
  return (
    <div className={css.switch_container}>
      <label>
        <input
          checked={isChecked}
          onChange={onSwitchChange}
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
