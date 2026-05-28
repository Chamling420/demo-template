'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, ImagePlus, Link, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.heic', '.heif', '.bmp', '.avif'];
const ALLOWED_TYPES = [
  'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
  'image/svg+xml', 'image/heic', 'image/heif', 'image/bmp', 'image/avif',
];

function isAllowedFile(file: File): boolean {
  if (file.type && ALLOWED_TYPES.includes(file.type.toLowerCase())) {
    return true;
  }
  // Fallback: check extension if MIME type is empty/unrecognized
  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  if (ext && ALLOWED_EXTENSIONS.includes(ext)) {
    return true;
  }
  // If no MIME type and no recognizable extension, still allow (server will validate)
  if (!file.type) {
    return true;
  }
  return false;
}

export default function ImageUpload({ value, onChange, label = 'Product Image' }: ImageUploadProps) {
  const [mode, setMode] = useState<'upload' | 'url'>(
    value && value.startsWith('http') ? 'url' : 'upload'
  );
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(async (file: File) => {
    // Validate file type (lenient — server also validates)
    if (!isAllowedFile(file)) {
      toast.error('Invalid file type. Only image files are allowed (JPEG, PNG, GIF, WebP, SVG, HEIC, BMP, AVIF).');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large. Maximum size is 10MB.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      onChange(data.url);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    // Reset the input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const clearImage = () => {
    onChange('');
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-2">
        <Button
          type="button"
          variant={mode === 'upload' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('upload')}
          className="gap-1.5 rounded-full text-xs"
        >
          <ImagePlus className="w-3.5 h-3.5" />
          Upload from Device
        </Button>
        <Button
          type="button"
          variant={mode === 'url' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('url')}
          className="gap-1.5 rounded-full text-xs"
        >
          <Link className="w-3.5 h-3.5" />
          Enter URL
        </Button>
      </div>

      {mode === 'upload' ? (
        <div>
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />

          {/* Image Preview or Upload Zone */}
          {value ? (
            <div className="relative group">
              <div className="relative w-full h-40 rounded-xl overflow-hidden border-2 border-muted bg-muted/30">
                <img
                  src={value}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '';
                    (e.target as HTMLImageElement).alt = 'Failed to load image';
                  }}
                />
                {uploading && (
                  <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                )}
              </div>
              <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="h-8 w-8 p-0 rounded-full shadow-md"
                >
                  <Upload className="w-3.5 h-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={clearImage}
                  disabled={uploading}
                  className="h-8 w-8 p-0 rounded-full shadow-md"
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => !uploading && fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`
                relative flex flex-col items-center justify-center gap-3
                w-full h-40 rounded-xl border-2 border-dashed cursor-pointer
                transition-all duration-200
                ${dragOver
                  ? 'border-primary bg-primary/5 scale-[1.02]'
                  : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5'
                }
                ${uploading ? 'pointer-events-none opacity-60' : ''}
              `}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Uploading...</p>
                </>
              ) : (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <ImagePlus className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-center">
                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      className="rounded-full shadow-lg shadow-primary/25 gap-1.5 mb-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    >
                      <Upload className="w-4 h-4" />
                      Select Your Image
                    </Button>
                    <p className="text-sm font-medium text-foreground">
                      or drag & drop here
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPEG, PNG, GIF, WebP, SVG, HEIC (max 10MB)
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
          {value && (
            <div className="relative w-full h-32 rounded-lg overflow-hidden border border-muted bg-muted/30">
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '';
                  (e.target as HTMLImageElement).alt = 'Failed to load image';
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
