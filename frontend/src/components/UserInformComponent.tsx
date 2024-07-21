import React from "react";

interface IUser {
  label: string;
  content: string;
}

function UserInformComponent({ label, content }: IUser) {
  return (
    <div className="flex flex-col border border-black w-[50%] p-2 rounded-md">
      <label className="text-xs text-[#207198] font-bold mb-1 ml-1 hover:opacity-60">
        {label}
      </label>
      <span className="font-bold">{content}</span>
    </div>
  );
}

export default UserInformComponent;
