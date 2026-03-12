import React from 'react'

const InputContainer = ({ label, onChange, placeholder, type = "text", value, prefix, suffix, onClickSuffix, onClickPrefix }) => {
  return (
    <div className='flex gap-1 flex-col'>
      <label className="text-sm font-medium text-gray-700 px-0">
        {label}
      </label>

      <div className="relative flex items-center">
        {prefix && <span className='absolute left-2 flex items-center text-zinc-500 text-lg' onClick={onClickPrefix}>{prefix}</span>}
        <input
          onChange={onChange}
          type={type}
          placeholder={placeholder}
          value={value}
          className={`w-full border border-zinc-200 rounded-md h-[42px] text-[15px] px-2 text-gray-900 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition-all ${prefix ? 'pl-8' : ''} ${suffix ? 'pr-8' : ''}`}
        />
        {suffix && <span className='absolute right-2 flex items-center text-zinc-500 text-lg' onClick={onClickSuffix}>{suffix}</span>}
      </div>


    </div>
  )
}

export default InputContainer
