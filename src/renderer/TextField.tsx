import React, { useState } from "react";

interface TextFieldProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  numeric?: boolean;
}

const TextField: React.FC<TextFieldProps> = ({
  placeholder,
  value,
  onChange,
  numeric,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const formatPhoneNumber = (input: string) => {
    const cleanedInput = input.replace(/\D/g, ""); // Remove non-numeric characters
    const match = cleanedInput.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/); // Format as "999-999-9999"
    return match
      ? `(${match[1]})${match[1] && match[2] ? "-" : ""}${match[2]}${
          match[2] && match[3] ? "-" : ""
        }${match[3]}`
      : "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    if (numeric) {
      inputValue = inputValue.replace(/[^0-9-]/g, ""); // Allow only numbers and dashes
      const formattedInput = formatPhoneNumber(inputValue); // Apply the phone number formatting
      if (formattedInput !== value) {
        // Update the field value with the formatted input
        onChange(formattedInput);
      } else {
        // Allow deleting the brackets if no change in the formatted input
        inputValue = inputValue.replace(/[( )-]/g, "");
        onChange(inputValue);
      }
    } else {
      inputValue = inputValue.replace(/[^a-zA-Z ]/g, ""); // Allow only letters and spaces
      onChange(inputValue);
    }
  };

  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleChange}
      style={{
        outline: isFocused ? "3px solid skyblue" : "none",
      }}
      maxLength={numeric ? 14 : undefined} // Set maxLength for numeric input (with brackets and dashes)
    />
  );
};

export default TextField;
