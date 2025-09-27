import React from 'react'

const InputContainer = ({label, onChange, placeholder, type = "text", value}) => {
  return (
    <div className='flex gap-1 flex-col py-2'>
      <label className="text-sm font-medium text-gray-700 px-0">
        {label}
      </label>
      <input 
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        value={value}
        className="border border-gray-300 rounded-lg py-2 px-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition-all"
      />
    </div>
  )
}

export default InputContainer
