import React from 'react';
import { ButtonType } from '../../types/types';

/**
 * A reusable button component with consistent styling and behavior
 */
const CustomButton: React.FC<ButtonType> = ({
  className,
  action,
  title,
  type = 'button',
  ariaLabel,
  disabled = false
}) => {
  return (
    <button
      className={className}
      onClick={action}
      type={type}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      {title}
    </button>
  );
};

export default CustomButton;