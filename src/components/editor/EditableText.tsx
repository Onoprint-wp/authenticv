import React from "react";

// Reusable component for editable inline text
export const EditableText = ({
  value,
  onChange,
  className = "",
  placeholder = "Entrez du texte",
  multiline = false,
}: {
  value: string;
  onChange: (val: string) => void;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
}) => {
  return (
    <span
      className={`outline-none break-words min-w-[20px] inline-block transition-colors border-b border-transparent hover:border-slate-300 focus:border-blue-500 empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 ${className}`}
      contentEditable
      suppressContentEditableWarning
      data-placeholder={placeholder}
      onBlur={(e) => onChange(e.currentTarget.textContent || "")}
      onKeyDown={(e) => {
        if (!multiline && e.key === "Enter") {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
    >
      {value}
    </span>
  );
};
