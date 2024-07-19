import React from "react";

interface IRadioGroup {
  label: string;
  id: string;
  options: { value: string; label: string }[];
  register: any;
}
function RadioComponent({ label, id, options, register }: IRadioGroup) {
  return (
    <div className="w-[60%]">
      <label
        htmlFor="id"
        className="text-xs text-[#207198] font-bold mb-1 ml-1 hover:opacity-60"
      >
        {label}
      </label>
      <div className="flex justify-between w-[100%] border-2 px-2 py-2 mb-2 rounded-md border-[#207198]">
        {options.map((option, index) => (
          <div key={index} className="flex items-center">
            <input
              type="radio"
              id={option.value}
              name={id}
              value={option.value}
              {...register(id, { required: true })}
            />
            <label
              htmlFor={option.value}
              className="font-semibold text-sm ml-1 text-[#207198]"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RadioComponent;
