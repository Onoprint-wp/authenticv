"use client";

import React, { useState, useRef } from "react";
import { useCvStore } from "@/store/useCvStore";
import { SectionCard, Input, Label } from "@/components/editor/ui/EditorPrimitives";
import { User, Camera, Loader2 } from "lucide-react";
import { PhotoCropModal } from "../PhotoCropModal";

const PhotoUpload = () => {
  const { cvData, updatePersonalInfo } = useCvStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [pendingImageSrc, setPendingImageSrc] = useState<string | null>(null);

  const openCropper = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setPendingImageSrc(reader.result as string);
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCropConfirm = async (blob: Blob) => {
    setPendingImageSrc(null);
    if (blob.size > 2 * 1024 * 1024) {
      alert("La photo ne doit pas dépasser 2 Mo.");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("photo", blob, "photo.jpg");
      const res = await fetch("/api/upload-photo", { method: "POST", body: formData });
      if (!res.ok) { const err = await res.json(); alert(err.error || "Erreur lors de l'upload."); return; }
      const { photoUrl } = await res.json();
      updatePersonalInfo({ photoUrl });
    } catch {
      alert("Erreur réseau lors de l'upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) openCropper(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) openCropper(file);
  };

  return (
    <div className="flex items-center gap-5 mb-6 pb-6 border-b border-slate-800/50">
      <div
        className={`relative w-24 h-24 rounded-full shrink-0 overflow-hidden border-2 transition-all cursor-pointer group ${
          dragOver
            ? "border-indigo-400 bg-indigo-500/10 scale-105"
            : cvData.personalInfo.photoUrl
            ? "border-slate-700 hover:border-indigo-500/50"
            : "border-dashed border-slate-700 hover:border-indigo-500/50 bg-slate-900/50"
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {cvData.personalInfo.photoUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cvData.personalInfo.photoUrl}
              alt="Photo de profil"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
          </>
        ) : uploading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1">
            <Camera className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
            <span className="text-[10px] text-slate-600">Photo</span>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex flex-col gap-1">
        <Label>Photo de profil</Label>
        <p className="text-xs text-slate-500 leading-relaxed">
          Cliquez ou glissez-déposez une photo.<br />
          JPG, PNG ou WebP · Max 2 Mo
        </p>
        {cvData.personalInfo.photoUrl && (
          <button
            onClick={() => updatePersonalInfo({ photoUrl: "" })}
            className="text-xs text-red-400 hover:text-red-300 mt-1 self-start transition-colors"
          >
            Supprimer la photo
          </button>
        )}
      </div>

      {pendingImageSrc && (
        <PhotoCropModal
          imageSrc={pendingImageSrc}
          onConfirm={handleCropConfirm}
          onCancel={() => setPendingImageSrc(null)}
        />
      )}
    </div>
  );
};

export const PersonalInfoSection = () => {
  const { cvData, updatePersonalInfo } = useCvStore();

  return (
    <SectionCard title="Informations personnelles" icon={User} defaultOpen>
      <PhotoUpload />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <Label>Prénom</Label>
          <Input value={cvData.personalInfo.firstName} onChange={(e) => updatePersonalInfo({ firstName: e.target.value })} />
        </div>
        <div className="flex flex-col">
          <Label>Nom</Label>
          <Input value={cvData.personalInfo.lastName} onChange={(e) => updatePersonalInfo({ lastName: e.target.value })} />
        </div>
        <div className="flex flex-col">
          <Label>Titre professionnel</Label>
          <Input value={cvData.personalInfo.title} onChange={(e) => updatePersonalInfo({ title: e.target.value })} />
        </div>
        <div className="flex flex-col">
          <Label>Email</Label>
          <Input type="email" value={cvData.personalInfo.email} onChange={(e) => updatePersonalInfo({ email: e.target.value })} />
        </div>
        <div className="flex flex-col">
          <Label>Téléphone</Label>
          <Input value={cvData.personalInfo.phone} onChange={(e) => updatePersonalInfo({ phone: e.target.value })} />
        </div>
        <div className="flex flex-col">
          <Label>Localisation</Label>
          <Input value={cvData.personalInfo.location} onChange={(e) => updatePersonalInfo({ location: e.target.value })} />
        </div>
        <div className="flex flex-col md:col-span-2">
          <Label>LinkedIn / Site web (Optionnel)</Label>
          <Input value={cvData.personalInfo.linkedin || ''} onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })} />
        </div>
      </div>
    </SectionCard>
  );
};
