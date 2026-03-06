'use client';

import { useState, useRef, useCallback } from 'react';

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
  acceptedFormats = ['image/jpeg', 'image/png', 'image/heic', 'image/webp']
}: PhotoUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate file
  const validateFile = (file: File): string | null => {
    // Check file type
    if (!acceptedFormats.includes(file.type)) {
      return `${file.name}: Invalid file type. Please upload JPEG, PNG, HEIC, or WebP images.`;
    }

    // Check file size
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      return `${file.name}: File size exceeds ${maxSizeMB}MB limit.`;
    }

    return null;
  };

  // Process files
  const processFiles = useCallback(async (newFiles: FileList | File[]) => {
    setIsUploading(true);
    const fileArray = Array.from(newFiles);
    const newErrors: string[] = [];
    const validFiles: FileWithPreview[] = [];

    // Check total count
    if (files.length + fileArray.length > maxFiles) {
      newErrors.push(`You can only upload up to ${maxFiles} photos. Please remove some photos first.`);
      setErrors(newErrors);
      setIsUploading(false);
      return;
    }

    // Validate and create previews
    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        newErrors.push(error);
        continue;
      }

      // Create preview
      const preview = URL.createObjectURL(file);
      validFiles.push({
        file,
        preview,
        id: `${file.name}-${Date.now()}-${Math.random()}`
      });
    }

    if (validFiles.length > 0) {
      const updatedFiles = [...files, ...validFiles];
      setFiles(updatedFiles);
      onFilesChange(updatedFiles.map(f => f.file));
    }

    setErrors(newErrors);
    setIsUploading(false);
  }, [files, maxFiles, onFilesChange]);

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  // Handle drag events
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  // Remove file
  const removeFile = (id: string) => {
    const fileToRemove = files.find(f => f.id === id);
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.preview);
    }

    const updatedFiles = files.filter(f => f.id !== id);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles.map(f => f.file));

    // Clear errors when files are removed
    if (updatedFiles.length < maxFiles) {
      setErrors(prev => prev.filter(err => !err.includes('only upload up to')));
    }
  };

  // Open file picker
  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  // Cleanup previews on unmount
  const cleanupPreviews = () => {
    files.forEach(f => URL.revokeObjectURL(f.preview));
  };

  // Cleanup on unmount
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', cleanupPreviews);
  }

  return (
    <div className="photo-upload">
      <div className="photo-upload__header">
        <h3 className="photo-upload__title">Upload Photos</h3>
        <p className="photo-upload__description">
          Upload 1-5 photos for tailor assessment (full body, side view, etc.). 
          Max {maxSizeMB}MB per image.
        </p>
      </div>

      {/* Drop zone */}
      <div
        className={`photo-upload__dropzone ${isDragging ? 'dragging' : ''} ${files.length >= maxFiles ? 'disabled' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={files.length < maxFiles ? openFilePicker : undefined}
        role="button"
        tabIndex={files.length < maxFiles ? 0 : -1}
        aria-label="Upload photos"
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && files.length < maxFiles) {
            e.preventDefault();
            openFilePicker();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(',')}
          multiple
          onChange={handleFileChange}
          className="photo-upload__input"
          aria-label="File input"
        />

        <div className="photo-upload__dropzone-content">
          <svg
            className="photo-upload__icon"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>

          {isUploading ? (
            <p className="photo-upload__text">Processing...</p>
          ) : files.length >= maxFiles ? (
            <p className="photo-upload__text">Maximum {maxFiles} photos reached</p>
          ) : (
            <>
              <p className="photo-upload__text">
                <strong>Click to upload</strong> or drag and drop
              </p>
              <p className="photo-upload__hint">
                JPEG, PNG, HEIC, WebP (max {maxSizeMB}MB each)
              </p>
            </>
          )}
        </div>
      </div>

      {/* Error messages */}
      {errors.length > 0 && (
        <div className="photo-upload__errors" role="alert" aria-live="polite">
          {errors.map((error, index) => (
            <div key={index} className="photo-upload__error">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          ))}
        </div>
      )}

      {/* Preview grid */}
      {files.length > 0 && (
        <div className="photo-upload__previews">
          <div className="photo-upload__preview-header">
            <span className="photo-upload__count">
              {files.length} of {maxFiles} photos
            </span>
          </div>
          <div className="photo-upload__grid">
            {files.map((fileWithPreview) => (
              <div key={fileWithPreview.id} className="photo-upload__preview">
                <img
                  src={fileWithPreview.preview}
                  alt={`Preview of ${fileWithPreview.file.name}`}
                  className="photo-upload__preview-image"
                />
                <button
                  type="button"
                  className="photo-upload__remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(fileWithPreview.id);
                  }}
                  aria-label={`Remove ${fileWithPreview.file.name}`}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
                <div className="photo-upload__preview-name">
                  {fileWithPreview.file.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
