import { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

export default function CustomSelect({ 
  value, 
  onChange, 
  options, 
  placeholder = "", 
  className = "" 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find(opt => opt.value === value);
  const selectedLabel = selectedOption ? selectedOption.label : placeholder;

  const handleSelect = (optionValue) => {
    onChange({ target: { value: optionValue } });
    setIsOpen(false);
  };

  return (
    <div ref={selectRef} className={`relative ${className}`}>
      {/* Select Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full border-2 border-white/30 rounded-xl px-4 py-2.5 bg-white/95 backdrop-blur-sm text-gray-900 font-medium shadow-lg hover:bg-white hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all duration-200 cursor-pointer flex items-center justify-between ${
          isOpen ? "ring-2 ring-white border-white" : ""
        }`}
      >
        <span className="truncate">{selectedLabel}</span>
        <FaChevronDown 
          className={`ml-2 text-gray-600 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {options.map((option, index) => {
              const isSelected = option.value === value;
              const isFirst = index === 0;
              const isLast = index === options.length - 1;
              
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`w-full text-left px-4 py-3 font-medium transition-colors duration-150 ${
                    isFirst ? "rounded-t-xl" : ""
                  } ${
                    isLast ? "rounded-b-xl" : ""
                  } ${
                    isSelected 
                      ? "bg-sky-100 text-sky-700 font-semibold" 
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

