import React, { useState, useRef, useEffect } from 'react';

const Dropdown = ({
  options,
  onSelect,
  placeholder = "Selecione uma opção",
  value,
  disabled = false,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const dropdownRef = useRef(null);

  // Atualiza a opção selecionada quando o value prop muda
  useEffect(() => {
    if (value !== undefined) {
      const option = options.find(opt => opt.value === value);
      setSelectedOption(option || null);
    }
  }, [value, options]);

  // Fecha o dropdown quando clica fora dele
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (option) => {
    if (!option.disabled) {
      setSelectedOption(option);
      onSelect(option.value);
      setIsOpen(false);
    }
  };

  const ChevronIcon = ({ isOpen }) => (
    <svg 
      className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Botão principal do dropdown */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between px-4 py-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm
          transition-all duration-200
          ${disabled 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          }
          ${isOpen ? 'border-blue-500 ring-2 ring-blue-500' : ''}
        `}
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronIcon isOpen={isOpen} />
      </button>

      {/* Lista de opções */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.length === 0 ? (
            <div className="px-4 py-3 text-gray-500 text-center">
              Nenhuma opção disponível
            </div>
          ) : (
            options.map((option, index) => (
              <button
                key={`${option.value}-${index}`}
                type="button"
                onClick={() => handleSelect(option)}
                disabled={option.disabled}
                className={`
                  w-full px-4 py-3 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100
                  transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg
                  ${option.disabled 
                    ? 'text-gray-400 cursor-not-allowed hover:bg-transparent' 
                    : 'text-gray-900'
                  }
                  ${selectedOption?.value === option.value 
                    ? 'bg-blue-50 text-blue-700 font-medium' 
                    : ''
                  }
                `}
              >
                {option.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Dropdown;