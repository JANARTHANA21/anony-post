import React, { useState } from "react";

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  autoComplete = "off",
  showToggle = false,
  isPasswordVisible = false,
  toggleHandler,
  error = "",
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          id={name}
          name={name}
          type={showToggle && isPasswordVisible ? "text" : type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full px-4 py-2 border rounded-xl focus:outline-none transition ${
            error
              ? "border-red-500 focus:ring-red-300"
              : "border-gray-300 focus:ring-indigo-400"
          } focus:ring-2`}
        />

        {showToggle && type === "password" && (
          <button
            type="button"
            onClick={toggleHandler}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
          >
            {isPasswordVisible ? "Hide" : "Show"}
          </button>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default InputField;