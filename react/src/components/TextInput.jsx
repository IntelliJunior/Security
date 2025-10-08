// src/components/TextInput.jsx
import React from "react";

const TextInput = React.memo(({ name, value, onChange, placeholder, type = "text", required = false }) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="border p-2 rounded"
      required={required}
      autoComplete="off"
    />
  );
});

export default TextInput;
