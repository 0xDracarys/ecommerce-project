"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { ImagePlus, Trash, UploadCloud } from "lucide-react";

import { Button } from "@/components/ui/button";

interface FallbackImageUploadProps {
  disabled?: boolean;
  onChange: (url: string) => void;
  onRemove: (url: string) => void;
  value: string[];
}

export const FallbackImageUpload = ({
  disabled,
  onChange,
  onRemove,
  value,
}: FallbackImageUploadProps) => {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        
        const response = await fetch('/api/uploadthing', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ file: base64 }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to upload image');
        }
        
        onChange(data.url);
        setIsUploading(false);
        toast.success("Image uploaded successfully!");
        router.refresh();
      };
      
      reader.readAsDataURL(file);
    } catch (error: any) {
      setIsUploading(false);
      toast.error("Failed to upload image: " + error.message);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] overflow-hidden rounded-md"
          >
            <div className="absolute z-10 top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
                size="icon"
                disabled={disabled}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
            <Image
              fill
              className="object-cover"
              alt="Image"
              src={url}
            />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <Button
          type="button"
          disabled={disabled || isUploading}
          variant="secondary"
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          {isUploading ? (
            <>
              <UploadCloud className="w-4 h-4 mr-2 animate-bounce" />
              Uploading...
            </>
          ) : (
            <>
              <ImagePlus className="w-4 h-4 mr-2" />
              Upload an Image
            </>
          )}
        </Button>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
          disabled={disabled || isUploading}
        />
      </div>
    </div>
  );
}; 