// src/components/ui/ImageUpload.tsx
import { useState } from "react";
import { Button, Image, Tooltip } from "@heroui/react";

type ImageUploadProps = {
  label?: string;
  onFileSelect: (file: File | null) => void;
  recommendedSizeText?: string;
  maxSizeMB?: number;
  defaultPreview?: string;
};

export default function ImageUpload({
  label = "Upload Image",
  onFileSelect,
  recommendedSizeText = "Recommended size: 800x400px",
  maxSizeMB = 2,
  defaultPreview,
}: ImageUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(defaultPreview ?? null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (f: File) => {
    const allowed = ["image/jpeg", "image/png", "image/jpg"];
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (!allowed.includes(f.type)) {
      setError("Format gambar harus JPG/PNG.");
      setFile(null);
      setPreview(null);
      onFileSelect(null);
      return;
    }
    if (f.size > maxBytes) {
      setError(`Ukuran gambar > ${maxSizeMB}MB.`);
      setFile(null);
      setPreview(null);
      onFileSelect(null);
      return;
    }

    setError(null);
    setFile(f);
    setPreview(URL.createObjectURL(f));
    onFileSelect(f);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <div className="text-sm font-medium">{label}</div>}
      <label
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className={[
          "relative flex h-[180px] w-full cursor-pointer items-center justify-center overflow-hidden",
          "border-default-300 bg-content2 rounded-xl border border-dashed",
          "hover:border-primary transition-colors",
        ].join(" ")}
      >
        {preview ? (
          <Image
            src={preview}
            alt="Preview"
            className="h-full w-full object-cover"
            removeWrapper
          />
        ) : (
          <div className="text-default-500 flex flex-col items-center gap-1 text-sm">
            <span>Upload an image (JPG, PNG)</span>
            <span className="text-default-400">{recommendedSizeText}</span>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={onChange}
          className="absolute inset-0 h-full w-full opacity-0"
        />
      </label>

      <div className="flex items-center gap-2">
        <Tooltip content="Hapus gambar">
          <Button
            size="sm"
            variant="flat"
            onPress={() => {
              setFile(null);
              setPreview(null);
              setError(null);
              onFileSelect(null);
            }}
            isDisabled={!file && !preview}
          >
            Remove
          </Button>
        </Tooltip>
        {error && <span className="text-danger text-sm">{error}</span>}
      </div>

      <div className="text-default-400 text-xs">
        Maksimal {maxSizeMB}MB • {recommendedSizeText}
      </div>
    </div>
  );
}
