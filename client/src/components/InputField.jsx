import React from 'react'

const InputField = ({
  label,
  type = 'text',
  value,
  onChange,
  name,
  placeholder = '',
  required = false,
  showToggle = false,
  toggleHandler,
}) => {
  return (
    <div className="mb-4">
      {label && <label className="block text-gray-700 font-medium mb-1">{label}</label>}
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {showToggle && (
          <span
            onClick={toggleHandler}
            className="absolute right-3 top-2.5 text-sm text-indigo-600 cursor-pointer select-none"
          >
            {type === 'password' ? 'Show' : 'Hide'}
          </span>
        )}
      </div>
    </div>
  )
}

export default InputField