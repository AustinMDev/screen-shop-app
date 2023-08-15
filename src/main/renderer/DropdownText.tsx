import React, { useState } from 'react';

interface DropdownOption {
  label: string;
  value: string;
  pricing: number | string;
}

interface DropdownInputProps {
  options: (string | DropdownOption)[];
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const convertToDropdownOption = (option: string | DropdownOption): DropdownOption => {
  if (typeof option === 'string') {
    return {
      label: option,
      value: option,
      pricing: option
    };
  }
  return option;
};

const DropdownInput: React.FC<DropdownInputProps> = ({ options, placeholder, value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const id = 'dropdown-input-options';

  return (
    <>
      <input
        list={id}
        placeholder={placeholder}
        value={value || ''}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={onChange}
        style={{
          outline: isFocused ? '3px solid skyblue' : 'none',
        }}
      />
      <datalist id={id}>
        {options.map((option, index) => {
          const { label } = convertToDropdownOption(option);
          return <option key={index} value={label}  />;
        })}
      </datalist>
    </>
  );
};

export default DropdownInput;
