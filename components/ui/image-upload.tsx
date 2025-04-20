"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { ImagePlus, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MountedCheck } from "@/lib/mounted-check";

interface imageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImageUpload: React.FC<imageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  return (
    <MountedCheck>
      <div>
        <div className="flex items-center gap-4 mb-4">
          {value.map((url) => (
            <div
              key={url}
              className="relative w-[200px] h-[200px] overflow-hidden"
            >
              <div className="absolute z-10 top-2 right-2">
                <Button
                  type="button"
                  onClick={() => onRemove(url)}
                  variant="destructive"
                  size="icon"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
              <Image fill className="object-cover" alt="Image" src={url} />
            </div>
          ))}
        </div>
        <CldUploadWidget 
          onUpload={onUpload}
          uploadPreset="ml_default" 
          options={{
            maxFiles: 5,
            cloudName: "dq03afeam",
            sources: ["local", "url", "camera"],
            multiple: true,
            folder: "abaya/images",
            publicId: `${Date.now()}`,
            clientAllowedFormats: ["jpg", "jpeg", "png", "gif"],
            maxFileSize: 10000000,
          }}
        >
          {({ open }) => {
            const onClick = () => {
              open();
            };
            return (
              <Button
                type="button"
                disabled={disabled}
                variant="secondary"
                onClick={onClick}
              >
                <ImagePlus className="w-4 h-4 mr-2" />
                Upload an Image
              </Button>
            );
          }}
        </CldUploadWidget>
      </div>
    </MountedCheck>
  );
};

export default ImageUpload; 