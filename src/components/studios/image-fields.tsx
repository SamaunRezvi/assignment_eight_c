"use client";

import { ImagePlus, Loader2, Plus, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { StudioImage } from "@/components/shared/studio-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiRequestError, apiRequest } from "@/lib/api";

const MAX_BYTES = 5 * 1024 * 1024;

/** Uploads a file through the API (which forwards it to imgbb) and returns the hosted URL. */
function useImageUpload() {
  const [uploading, setUploading] = useState(false);

  async function upload(file: File): Promise<string | null> {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Choose a JPEG, PNG or WebP image.");
      return null;
    }
    if (file.size > MAX_BYTES) {
      toast.error("Images must be 5 MB or smaller.");
      return null;
    }

    setUploading(true);
    try {
      const body = new FormData();
      body.append("image", file);
      const { url } = await apiRequest<{ url: string }>("/uploads", { method: "POST", body });
      toast.success("Image uploaded");
      return url;
    } catch (error) {
      toast.error(error instanceof ApiRequestError ? error.message : "The image could not be uploaded.");
      return null;
    } finally {
      setUploading(false);
    }
  }

  return { upload, uploading };
}

interface CoverImageFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
}

export function CoverImageField({ id, value, onChange, invalid }: CoverImageFieldProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const { upload, uploading } = useImageUpload();

  async function onFile(file: File | undefined) {
    if (!file) return;
    const url = await upload(file);
    if (url) onChange(url);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          id={id}
          type="url"
          inputMode="url"
          placeholder="https://images.example.com/studio.jpg"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={invalid}
          className="h-11"
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          tabIndex={-1}
          aria-label="Upload cover image"
          onChange={(event) => onFile(event.target.files?.[0])}
        />
        <Button type="button" variant="outline" className="h-11 shrink-0" disabled={uploading} onClick={() => fileRef.current?.click()}>
          {uploading ? <Loader2 className="animate-spin" /> : <ImagePlus />}
          Upload
        </Button>
      </div>
      {value ? (
        <StudioImage src={value} alt="Cover preview" className="aspect-[16/9] w-full max-w-sm rounded-xl border border-border" />
      ) : null}
    </div>
  );
}

interface GalleryFieldProps {
  value: string[];
  onChange: (value: string[]) => void;
  max?: number;
}

export function GalleryField({ value, onChange, max = 6 }: GalleryFieldProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState("");
  const { upload, uploading } = useImageUpload();
  const full = value.length >= max;

  function addUrl() {
    const candidate = draft.trim();
    if (!candidate) return;
    try {
      const { protocol } = new URL(candidate);
      if (protocol !== "http:" && protocol !== "https:") throw new Error("protocol");
    } catch {
      toast.error("Enter a valid image link starting with http:// or https://");
      return;
    }
    if (value.includes(candidate)) {
      toast.info("That image is already in the gallery.");
      return;
    }
    onChange([...value, candidate]);
    setDraft("");
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    const url = await upload(file);
    if (url) onChange([...value, url]);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="space-y-3">
      {value.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {value.map((url, index) => (
            <li key={url} className="relative">
              <StudioImage src={url} alt={`Gallery image ${index + 1}`} className="aspect-[4/3] w-full rounded-xl border border-border" />
              <button
                type="button"
                onClick={() => onChange(value.filter((item) => item !== url))}
                aria-label={`Remove gallery image ${index + 1}`}
                className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-background/90 text-foreground shadow hover:bg-destructive hover:text-white"
              >
                <X className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="flex gap-2">
        <Input
          type="url"
          inputMode="url"
          aria-label="Add a gallery image link"
          placeholder={full ? "Gallery is full" : "Paste an image link"}
          value={draft}
          disabled={full}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addUrl();
            }
          }}
          className="h-11"
        />
        <Button type="button" variant="outline" className="h-11 shrink-0" disabled={full} onClick={addUrl}>
          <Plus />
          Add
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          tabIndex={-1}
          aria-label="Upload gallery image"
          onChange={(event) => onFile(event.target.files?.[0])}
        />
        <Button type="button" variant="outline" className="h-11 shrink-0" disabled={full || uploading} onClick={() => fileRef.current?.click()}>
          {uploading ? <Loader2 className="animate-spin" /> : <ImagePlus />}
          Upload
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        {value.length} of {max} gallery images. Optional, but listings with several photos get more bookings.
      </p>
    </div>
  );
}
