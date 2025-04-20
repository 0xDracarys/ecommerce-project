import { NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: 'r_YkZUG0TiZv2xsWl0X3YnUC7jE',
  api_secret: '7GH7rNYj0JCyA-y89TtZJEfVV8Q',
  secure: true
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { file } = body;

    if (!file) {
      return NextResponse.json(
        { error: "File is required" },
        { status: 400 }
      );
    }

    // Upload the file to Cloudinary directly
    const uploadResult = await cloudinary.uploader.upload(file, {
      folder: "abaya/images",
      use_filename: false,
      unique_filename: true,
      overwrite: true,
      resource_type: "auto",
    });

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id
    });
  } catch (error: any) {
    console.error("Error uploading to Cloudinary:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload image" },
      { status: 500 }
    );
  }
} 