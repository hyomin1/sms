import React from "react";

interface IInput {
  id: string;
  label: string;
  type: string;
  register: any;
}

function InputComponent({ id, label, type, register }: IInput) {
  return (
    <div className="mb-4 w-[60%]">
      <label
        htmlFor={id}
        className="text-xs text-[#207198] font-bold mb-1 ml-1 hover:opacity-60"
      >
        {label}
      </label>
      <input
        type={type}
        id={id}
        className="w-full border-2 border-[#207198] px-2 py-2 rounded-md focus:outline-none focus:border-blue-500"
        {...register(id, { required: true })}
      />
    </div>
  );
}

export default InputComponent;
