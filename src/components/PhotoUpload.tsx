'use client';

import { useState, useRef, useCallback } from 'react';
import Button from './Button';

interface PhotoUploadProps {
  maxFiles?: number;
  maxSizeMB?: number;
  onFilesChange: (files: File[]) => void;
  acceptedFormats?: string[];
}

interface FileWithPreview {
  file: File;
  preview: string;
  id: string;
}

export function PhotoUpload({
  maxFiles = 5,
  maxSizeMB = 10,
  onFilesChange,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/heic', 'image/webp'],
}: PhotoUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!acceptedFormats.includes(file.type))
      return `${file.name}: Invalid file type. Please upload JPEG, PNG, HEIC, or WebP images.`;
    if (file.size / (1024 * 1024) > maxSizeMB)
      return `${file.name}: File size exceeds ${maxSizeMB}MB limit.`;
    return null;
  };

  const processFiles = useCallback(
    async (newFiles: FileList | File[]) => {
      setIsUploading(true);
      const fileArray = Array.from(newFiles);
      const newErrors: string[] = [];
      const validFiles: FileWithPreview[] = [];

      if (files.length + fileArray.length > maxFiles) {
        setErrors([`You can only upload up to ${maxFiles} photos. Please remove some photos first.`]);
        setIsUploading(false);
        return;
      }

      for (const file of fileArray) {
        const error = validateFile(file);
        if (error) { newErrors.push(error); continue; }
        validFiles.push({
          file,
          preview: URL.createObjectURL(file),
          id: `${file.name}-${Date.now()}-${Math.random()}`,
        });
      }

      if (validFiles.length > 0) {
        const updated = [...files, ...validFiles];
        setFiles(updated);
        onFilesChange(updated.map((f) => f.file));
      }
      setErrors(newErrors);
      setIsUploading(false);
    },
    [files, maxFiles, onFilesChange]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) processFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) processFiles(e.dataTransfer.files);
  };

  const removeFile = (id: string) => {
    const f = files.find((f) => f.id === id);
    if (f) URL.revokeObjectURL(f.preview);
    const updated = files.filter((f) => f.id !== id);
    setFiles(updated);
    onFilesChange(updated.map((f) => f.file));
    if (updated.length < maxFiles)
      setErrors((prev) => prev.filter((e) => !e.includes('only upload up to')));
  };

  const full = files.length >= maxFiles;

  return (
    <div className="my-6">
      <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[var(--text)] mb-1">
        Upload Photos
      </h3>
      <p className="text-sm text-[var(--muted)] mb-3">
        Upload 1–5 photos for tailor assessment. Max {maxSizeMB}MB per image.
      </p>

      {/* Drop zone */}
      <div
        className={[
          'border-2 border-dashed rounded-[12px] p-8 text-center transition-colors duration-150',
          isDragging ? 'border-[var(--brand)] bg-[var(--brand-subtle)]' : 'border-[var(--border)] hover:border-[var(--brand)]',
          full ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        ].join(' ')}
        onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }}
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onDrop={handleDrop}
        onClick={() => !full && fileInputRef.current?.click()}
        role="button"
        tabIndex={full ? -1 : 0}
        aria-label="Upload photos"
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !full) {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(',')}
          multiple
          onChange={handleFileChange}
          className="hidden"
          aria-label="File input"
        />
        <svg
          className="mx-auto mb-3 text-[var(--muted)]"
          width="40" height="40" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        {isUploading ? (
          <p className="text-sm text-[var(--muted)]">Processing...</p>
        ) : full ? (
          <p className="text-sm text-[var(--muted)]">Maximum {maxFiles} photos reached</p>
        ) : (
          <>
            <p className="text-sm text-[var(--text)]">
              <strong>Click to upload</strong> or drag and drop
            </p>
            <p className="text-xs text-[var(--muted)] mt-1">
              JPEG, PNG, HEIC, WebP (max {maxSizeMB}MB each)
            </p>
          </>
        )}
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="mt-3 flex flex-col gap-1" role="alert" aria-live="polite">
          {errors.map((err, i) => (
            <div key={i} className="flex items-center gap-2 text-red-500 text-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {err}
            </div>
          ))}
        </div>
      )}

      {/* Previews */}
      {files.length > 0 && (
        <div className="mt-4">
          <p className="text-xs text-[var(--muted)] mb-2">{files.length} of {maxFiles} photos</p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {files.map((f) => (
              <div key={f.id} className="relative group rounded-[10px] overflow-hidden border border-[var(--border)]">
                <img src={f.preview} alt={`Preview of ${f.file.name}`} className="w-full h-24 object-cover" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); removeFile(f.id); }}
                  aria-label={`Remove ${f.file.name}`}
                  className="absolute top-1 right-1 !w-6 !h-6 !p-0 !rounded-full !min-h-0 !border-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 focus:opacity-100"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </Button>
                <p className="text-[10px] text-[var(--muted)] px-1 py-0.5 truncate">{f.file.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
