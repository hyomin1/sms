import React from "react";
interface ISelectBox {
  label: string;
  options: string[];
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  //value: string;
  isRequired?: boolean;
}

function SelectBoxComponent({
  label,
  options,
  onChange,
  isRequired,
}: ISelectBox) {
  return (
    <div className={`mb-4 ${isRequired ? "w-[60%]" : "w-[22%] mt-4"}`}>
      <label className="text-xs text-[#207198] font-bold mb-1 ml-1 hover:opacity-60">
        {label}
      </label>
      <select
        onChange={onChange}
        required={isRequired ? true : false}
        className="w-full border-2 border-[#207198] px-2 py-2 rounded-md focus:outline-none focus:border-blue-500"
      >
        <option value={undefined}>선택안함</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectBoxComponent;
