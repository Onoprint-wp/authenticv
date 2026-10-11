"use client";

import { useState } from "react";
import { useCvStore, type CvData } from "@/store/useCvStore";

export type UploadStatus = "idle" | "uploading" | "success" | "error";

const UPLOAD_TIMEOUT_MS = 55_000;

interface UseCvUploadOptions {
  onSuccess?: (cvData: CvData) => void;
  onError?: (errorMessage: string) => void;
}

export function useCvUpload(options?: UseCvUploadOptions) {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const setCvData = useCvStore((s) => s.setCvData);
  const saveCheckpoint = useCvStore((s) => s.saveCheckpoint);

  const uploadCvFile = async (file: File): Promise<CvData | null> => {
    if (!file) return null;

    setStatus("uploading");
    setErrorMsg("");

    const formData = new FormData();
    formData.append("file", file);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Erreur lors de l'import");
      }

      // Sauvegarder l'état actuel avant d'écraser (permet l'undo via VersionHistoryPanel)
      saveCheckpoint();

      // Préserver le thème/layout actuel — l'import ne doit pas réinitialiser le design
      const { cvData: current } = useCvStore.getState();
      const merged: CvData = {
        ...(data.cvData as CvData),
        designSettings: current.designSettings,
      };

      setCvData(merged);

      // Persister immédiatement en DB si connecté (ne bloque pas en mode invité)
      try {
        await fetch("/api/resumes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: merged }),
        });
      } catch {
        // En mode invité, /api/resumes peut échouer silencieusement sans impacter l'UI locale
      }

      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
      options?.onSuccess?.(merged);
      return merged;
    } catch (err) {
      let message = "Une erreur est survenue lors de l'analyse du document.";
      if (err instanceof Error) {
        message =
          err.name === "AbortError"
            ? "Délai dépassé — le fichier est volumineux ou la connexion est lente. Réessayez."
            : err.message;
      }
      setErrorMsg(message);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
      options?.onError?.(message);
      return null;
    } finally {
      clearTimeout(timeoutId);
    }
  };

  return {
    uploadCvFile,
    status,
    isUploading: status === "uploading",
    errorMsg,
  };
}
