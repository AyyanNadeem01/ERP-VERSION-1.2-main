import React from "react";


export default function InputField({ label, type, value, onChange }) {
return (
<div className="flex flex-col mb-4 w-full">
<label className="text-gray-700 dark:text-gray-300 mb-1">{label}</label>
<input
type={type}
value={value}
onChange={(e) => onChange(e.target.value)}
className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
</div>
);
}