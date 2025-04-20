"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import { ImagePlus, Trash, UploadCloud } from "lucide-react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { MountedCheck } from "@/lib/mounted-check";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  
  const onCloudinaryUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  const handleDirectUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        
        try {
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
          toast.success("Image uploaded successfully!");
          router.refresh();
        } catch (error: any) {
          console.error("Upload error:", error);
          toast.error("Failed to upload: " + error.message);
        } finally {
          setIsUploading(false);
        }
      };
      
      reader.readAsDataURL(file);
    } catch (error: any) {
      setIsUploading(false);
      toast.error("Failed to read file: " + error.message);
    }
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
        
        <Tabs defaultValue="cloudinary" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="cloudinary">
              Cloudinary Upload
            </TabsTrigger>
            <TabsTrigger value="direct">
              Direct Upload
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="cloudinary">
            <CldUploadWidget 
              onUpload={onCloudinaryUpload} 
              uploadPreset="ABAYA"
              options={{
                maxFiles: 5,
                cloudName: "dq03afeam",
                apiKey: "854841872594433",
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
                    Upload via Cloudinary
                  </Button>
                );
              }}
            </CldUploadWidget>
          </TabsContent>
          
          <TabsContent value="direct">
            <div className="flex items-center gap-4">
              <Button
                type="button"
                disabled={disabled || isUploading}
                variant="secondary"
                onClick={() => document.getElementById('direct-upload')?.click()}
              >
                {isUploading ? (
                  <>
                    <UploadCloud className="w-4 h-4 mr-2 animate-bounce" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <ImagePlus className="w-4 h-4 mr-2" />
                    Direct Upload
                  </>
                )}
              </Button>
              <input
                id="direct-upload"
                type="file"
                accept="image/*"
                onChange={handleDirectUpload}
                className="hidden"
                disabled={disabled || isUploading}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MountedCheck>
  );
};

export default ImageUpload;
