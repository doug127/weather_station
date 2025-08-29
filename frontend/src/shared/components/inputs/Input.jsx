import { useState } from "react";

export const Input = ({
    label,
  value,
  setValue,
  input,
  setInput,
  type = "text",
}) => {

    return (
        <div className="flex relative items-center w-full">
            <label
                className={`pointer-events-none absolute p-2 transition-[top, font-size] duration-200 ease-in-out h-5
                ${input || value ? "-top-4 text-xs left-2 bg-white" : "text-gray-400 left-2 top-0"}`}
            >
                {label}
            </label>
            <input
                className={`p-2 border rounded-md outline-none w-full ${
                value || input ? "border-1 border-gray-900" : "border-gray-200"
                }`}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onFocus={() => setInput(true)}
                onBlur={() => setInput(false)}
                type={type}
            />
        </div>
    );
}