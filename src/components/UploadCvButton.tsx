"use client";

import { useRef } from "react";
import { Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useCvUpload, type UploadStatus } from "@/hooks/useCvUpload";

export function UploadCvButton() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { uploadCvFile, status, isUploading, errorMsg } = useCvUpload();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadCvFile(file);
    if (inputRef.current) inputRef.current.value = "";
  };

  const icons: Record<UploadStatus, React.ReactNode> = {
    idle: <Upload className="w-3.5 h-3.5 text-brand-blue shrink-0" />,
    uploading: <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-blue shrink-0" />,
    success: <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />,
  };

  const labels: Record<UploadStatus, string> = {
    idle: "Importer un CV",
    uploading: "Analyse en cours…",
    success: "CV importé !",
    error: "Échec de l'import",
  };

  const buttonColors: Record<UploadStatus, string> = {
    idle: "text-foreground bg-card hover:bg-muted font-medium shadow-xs",
    uploading: "text-brand-blue bg-brand-blue/10 cursor-not-allowed",
    success: "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40",
    error: "text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40",
  };

  return (
    <div className="relative">
      {/* Input file caché */}
      <input
        ref={inputRef}
        id="upload-cv-input"
        type="file"
        accept=".pdf,.docx,.doc"
        className="hidden"
        onChange={handleFileChange}
        disabled={status === "uploading"}
      />

      {/* Bouton visible */}
      <button
        id="upload-cv-btn"
        data-testid="upload-btn"
        type="button"
        disabled={status === "uploading"}
        onClick={() => inputRef.current?.click()}
        title={
          status === "error"
            ? errorMsg
            : "Importer un CV existant (PDF ou DOCX)"
        }
        className={`
          flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-[10px]
          border border-border transition-all duration-200 cursor-pointer
          ${buttonColors[status]}
        `}
      >
        {icons[status]}
        <span className="hidden sm:inline">{labels[status]}</span>
      </button>

      {/* Tooltip d'erreur */}
      {status === "error" && errorMsg && (
        <div
          className="absolute top-full mt-1.5 right-0 z-50 w-56 
          bg-card border border-destructive/40 rounded-xl p-2.5
          text-xs text-destructive shadow-xl backdrop-blur-md"
        >
          {errorMsg}
        </div>
      )}
    </div>
  );
}
