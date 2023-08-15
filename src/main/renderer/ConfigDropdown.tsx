import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { elementSKUs, sizePrices, screenPricing, splinePricing, spreaderBarPricing, extrasPricing, hawaiiTaxRate  } from '../config'; // Path to your config file

interface ConfigDropdownProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  optionsData: { label: string }[];
  style?: React.CSSProperties;
}

const ConfigDropdown: React.FC<ConfigDropdownProps> = ({ placeholder, value, onChange, optionsData, styles }) => {
  const [selectedItem, setSelectedItem] = useState(value || '');

  useEffect(() => {
    if (onChange) {
      onChange(selectedItem);
    }
  }, [selectedItem]);

  const options = optionsData.map(option => ({
    value: option.label,
    label: option.label
  }));

  const handleChange = (selectedOption) => {
    setSelectedItem(selectedOption.value);
    if (onChange) {
      onChange(selectedOption); // Passing the whole selected option
    }
  };
  

  return (
    <Select
      options={options}
      placeholder={placeholder}
      value={options.find(option => option.value === selectedItem)}
      onChange={handleChange}
      menuPortalTarget={document.body} // This makes the dropdown options appear above all other elements
      styles={{ 
        ...styles,
        menuPortal: base => ({ ...base, zIndex: 9999 }) // Adjusts the z-index of the dropdown to be on top
      }}
    />
  );
};

export default ConfigDropdown;
