import React, { useState } from "react";
import { ChevronDown, ChevronUp, type LucideIcon } from "lucide-react";

export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`w-full rounded-[10px] bg-background border border-border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#3667F0] focus:border-transparent hover:border-slate-400 dark:hover:border-slate-600 transition-all font-sans shadow-xs ${props.className || ''}`}
  />
);

export const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    className={`w-full rounded-[12px] bg-background border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#3667F0] focus:border-transparent hover:border-slate-400 dark:hover:border-slate-600 transition-all font-sans shadow-xs min-h-[120px] resize-y ${props.className || ''}`}
  />
);

export const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1 mb-1.5 font-heading">
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
    <div className="rounded-[16px] border border-border bg-card overflow-hidden mb-5 shadow-xs transition-all">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-muted/40 hover:bg-muted/70 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#3667F0]/10 dark:bg-[#3667F0]/20 rounded-lg text-[#3667F0] flex items-center justify-center border border-[#3667F0]/20 shadow-xs">
            <Icon size={18} />
          </div>
          <h3 className="text-base font-bold text-card-foreground font-heading">{title}</h3>
        </div>
        {isOpen ? <ChevronUp size={18} className="text-muted-foreground" /> : <ChevronDown size={18} className="text-muted-foreground" />}
      </button>
      
      {isOpen && (
        <div className="p-5 border-t border-border bg-card space-y-4">
          {children}
        </div>
      )}
    </div>
  );
};
