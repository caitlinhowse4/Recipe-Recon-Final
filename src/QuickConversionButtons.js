import React from "react";
// This component provides quick conversion buttons for common fractions and doubling
const QuickConversionButtons = ({ onSelect }) => {
  const options = [
    { label: "1/2", value: 0.5 },
    { label: "1/3", value: 1 / 3 },
    { label: "1/4", value: 0.25 },
    { label: "Double", value: 2 },
  ];
  // Define the quick conversion options
  return (
    <div style={{ margin: "10px 0" }}>
      <p>Quick Conversion:</p>
      {options.map((opt) => (
        <button
          key={opt.label}
          onClick={() => onSelect(opt.value)}
          style={{ marginRight: "10px" }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};

export default QuickConversionButtons;
