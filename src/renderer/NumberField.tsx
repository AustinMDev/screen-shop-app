import React, { useState } from "react";

interface NumberFieldProps {
    step?: number;
    placeholder?: string;
    value?: string | number;
    min?: number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const NumberField: React.FC<NumberFieldProps> = ({ step, placeholder, value, min = 0, onChange }) => {
    const [isFocused, setIsFocused] = useState(false);
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    return (
        <input
            type="number"
            placeholder={placeholder}
            value={value || ''}
            step={step}
            min={min}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={onChange}
            style={{
                outline: isFocused ? "3px solid skyblue" : "none"
            }} 
        />
    );
};

export default NumberField;
