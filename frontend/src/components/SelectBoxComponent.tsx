import React from "react";
interface ISelectBox {
  label: string;
  options: string[];
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  //value: string;
}

function SelectBoxComponent({ label, options, onChange }: ISelectBox) {
  return (
    <div className="flex flex-col">
      <label>{label}</label>
      <select onChange={onChange} className="border rounded p-1">
        <option value="">선택안함</option>
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
