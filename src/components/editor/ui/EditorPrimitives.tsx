import React, { useState } from "react";
import { ChevronDown, ChevronUp, type LucideIcon } from "lucide-react";

export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`w-full rounded-xl bg-slate-950/60 border border-slate-800/80 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:bg-slate-900/80 hover:border-slate-700 shadow-inner transition-all ${props.className || ''}`}
  />
);

export const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    className={`w-full rounded-xl bg-slate-950/60 border border-slate-800/80 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:bg-slate-900/80 hover:border-slate-700 shadow-inner transition-all min-h-[120px] resize-y ${props.className || ''}`}
  />
);

export const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-sm font-medium text-slate-300 ml-1 mb-2">
    {children}
  </label>
);

export const SectionCard = ({
  title,
  icon: Icon,
  children,
  defaultOpen = false
}: {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/30 overflow-hidden mb-6 shadow-sm backdrop-blur-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 bg-slate-800/40 hover:bg-slate-800/60 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-800/80 rounded-lg text-indigo-400 border border-slate-700/50 shadow-sm">
            <Icon size={18} />
          </div>
          <h3 className="text-lg font-semibold text-slate-200 tracking-wide">{title}</h3>
        </div>
        {isOpen ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
      </button>
      
      {isOpen && (
        <div className="p-6 border-t border-slate-800/50">
          {children}
        </div>
      )}
    </div>
  );
};
