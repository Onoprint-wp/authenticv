"use client";

import { useRef, useState } from "react";
import { Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useCvStore } from "@/store/useCvStore";
import type { CvData } from "@/store/useCvStore";

type UploadStatus = "idle" | "uploading" | "success" | "error";

export function UploadCvButton() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const setCvData = useCvStore((s) => s.setCvData);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus("uploading");
    setErrorMsg("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Erreur lors de l'import");
      }

      // Pré-remplir le store Zustand avec les données parsées
      setCvData(data.cvData as CvData);
      setStatus("success");

      // Retour à l'état normal après 3s
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Une erreur est survenue";
      setErrorMsg(message);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    } finally {
      // Reset l'input pour permettre de re-uploader le même fichier
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const icons: Record<UploadStatus, React.ReactNode> = {
    idle: <Upload className="w-3.5 h-3.5" />,
    uploading: <Loader2 className="w-3.5 h-3.5 animate-spin" />,
    success: <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />,
    error: <AlertCircle className="w-3.5 h-3.5 text-red-400" />,
  };

  const labels: Record<UploadStatus, string> = {
    idle: "Importer un CV",
    uploading: "Analyse en cours…",
    success: "CV importé !",
    error: "Échec de l'import",
  };

  const buttonColors: Record<UploadStatus, string> = {
    idle: "text-slate-400 hover:text-slate-200 hover:bg-slate-800",
    uploading: "text-indigo-400 bg-indigo-950/40 cursor-not-allowed",
    success: "text-emerald-400 bg-emerald-950/40",
    error: "text-red-400 bg-red-950/40",
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
        type="button"
        disabled={status === "uploading"}
        onClick={() => inputRef.current?.click()}
        title={
          status === "error"
            ? errorMsg
            : "Importer un CV existant (PDF ou DOCX)"
        }
        className={`
          flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md
          border border-slate-700/50 transition-all duration-200
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
          bg-slate-900 border border-red-800/50 rounded-lg p-2.5
          text-xs text-red-300 shadow-xl"
        >
          {errorMsg}
        </div>
      )}
    </div>
  );
}
